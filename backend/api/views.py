import os
import uuid
import datetime
import joblib
import pandas as pd
import requests
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import PatientProfile, VitalLog, DoctorProfile, HealthRecordShare, Consultation, DoctorPatient
from .serializers import UserSerializer, PatientProfileSerializer, VitalLogSerializer, DoctorProfileSerializer
from django.db import transaction
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

# Configure SendGrid (client initialized locally per request)

# Load ML Models
MODEL_PATH = os.path.join(settings.BASE_DIR, 'api', 'ml_models', 'nephrosasa_model.pkl')
SCALER_PATH = os.path.join(settings.BASE_DIR, 'api', 'ml_models', 'nephrosasa_scaler.pkl')

try:
    rf_model = joblib.load(MODEL_PATH)
    rf_scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"Warning: ML models not loaded. {e}")
    rf_model = None
    rf_scaler = None

def get_risk_label(probability):
    if probability < 0.45:
        return "LOW", probability
    elif probability < 0.70:
        return "MEDIUM", probability
    else:
        return "HIGH", probability

class RegisterPatientView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        if 'username' not in data and 'email' in data:
            base_username = data['email'].split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            data['username'] = username

        user_serializer = UserSerializer(data=data)
        if user_serializer.is_valid():
            try:
                with transaction.atomic():
                    user = user_serializer.save()
                    PatientProfile.objects.create(user=user)
            except Exception as e:
                return Response({"error": "Failed to create user and profile."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Send Welcome Email via SendGrid API HTTP request
            try:
                url = "https://api.sendgrid.com/v3/mail/send"
                headers = {
                    "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                    "Content-Type": "application/json"
                }
                subject = "Welcome to NephroSasa Rwanda"
                html_content = f"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://nephrosasa-rwanda.vercel.app/apple-touch-icon.png" width="80" alt="NephroSasa Logo" style="display: inline-block;">
                </div>
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Welcome to NephroSasa Rwanda</h2>
                <p style="font-size: 16px;">Dear {user.first_name} {user.last_name},</p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Your patient account has been successfully created. We are honored to be part of your health journey.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    With NephroSasa, you can securely access your personal health records, track your vital signs, and receive AI-driven risk assessments to help manage your kidney health proactively.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    To get started, please log in to your dashboard and log your first set of vital readings.
                </p>
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The NephroSasa Rwanda Team</strong>
                </p>
            </div>
            """
                payload = {
                    "personalizations": [{"to": [{"email": user.email}], "subject": subject}],
                    "from": {"email": "isaacmairopedro@gmail.com", "name": "NephroSasa Rwanda"},
                    "content": [{"type": "text/html", "value": html_content}]
                }
                response = requests.post(url, json=payload, headers=headers)
                if response.status_code >= 400:
                    print(f"Failed to send email. Status Code: {response.status_code}, Body: {response.text}")
            except Exception as e:
                print(f"Exception sending email: {e}")

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Patient registered successfully", 
                "user": user_serializer.data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')

        if not password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        email_to_lookup = email or (username if username and '@' in username else None)
        user_to_auth = None

        if email_to_lookup:
            users = User.objects.filter(email=email_to_lookup)
            user = None
            if users.exists():
                for u in users:
                    user = authenticate(username=u.username, password=password)
                    if user is not None:
                        break
            if user is None:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        elif username:
            user = authenticate(username=username, password=password)
            if user is None:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"error": "Email or username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user is not None:
            is_first_login = user.last_login is None
            
            # Manually update last_login to ensure it's recorded for future logins
            from django.utils.timezone import now
            user.last_login = now()
            user.save(update_fields=['last_login'])
            
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_serializer.data,
                "is_first_login": is_first_login
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

class LogVitalsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            patient = request.user.patient_profile
        except PatientProfile.DoesNotExist:
            return Response({"error": "User is not a registered patient"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        data['patient'] = patient.id
        serializer = VitalLogSerializer(data=data)
        
        if serializer.is_valid():
            vital_log = serializer.save()

            # Prepare data for ML Model
            # The model expects: SystolicBP, DiastolicBP, FastingBloodSugar, HbA1c, SerumCreatinine, GFR, BUNLevels, Age, Smoking, FamilyHistoryKidneyDisease
            # We use default values for fields not provided in standard vital logs for demo purposes
            patient_data = {
                'SystolicBP': float(vital_log.systolic_bp),
                'DiastolicBP': float(vital_log.diastolic_bp),
                'FastingBloodSugar': float(vital_log.blood_sugar),
                'HbA1c': float(vital_log.hba1c) if vital_log.hba1c is not None else float(data.get('hba1c', 5.5)),
                'SerumCreatinine': float(vital_log.creatinine) if vital_log.creatinine is not None else float(data.get('creatinine', 1.0)),
                'GFR': float(vital_log.gfr) if vital_log.gfr is not None else float(data.get('gfr', 90.0)),
                'BUNLevels': float(vital_log.bun) if vital_log.bun is not None else float(data.get('bun', 15.0)),
                'Age': float(data.get('age', 45.0)),
                'Smoking': int(data.get('smoking', 0)),
                'FamilyHistoryKidneyDisease': int(data.get('family_history', 0))
            }

            if rf_model and rf_scaler:
                df = pd.DataFrame([patient_data])
                scaled_input = rf_scaler.transform(df)
                probability = rf_model.predict_proba(scaled_input)[0][1]
                risk_level, _ = get_risk_label(probability)
                
                vital_log.ai_risk_score = risk_level
                vital_log.confidence_percentage = round(probability * 100, 2)
                vital_log.save()
            
            # Send Confirmation Email via SendGrid API HTTP request
            try:
                url = "https://api.sendgrid.com/v3/mail/send"
                headers = {
                    "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                    "Content-Type": "application/json"
                }
                subject = "Vitals Logged - NephroSasa"
                html_content = f"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://nephrosasa-rwanda.vercel.app/apple-touch-icon.png" width="80" alt="NephroSasa Logo" style="display: inline-block;">
                </div>
                <h3 style="color: #2563eb; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Vitals Recorded</h3>
                <p>Your blood pressure and sugar levels have been recorded.</p>
                <p>Current AI Risk Assessment: <strong>{vital_log.ai_risk_score}</strong></p>
            </div>
            """
                payload = {
                    "personalizations": [{"to": [{"email": request.user.email}], "subject": subject}],
                    "from": {"email": "isaacmairopedro@gmail.com", "name": "NephroSasa Rwanda"},
                    "content": [{"type": "text/html", "value": html_content}]
                }
                response = requests.post(url, json=payload, headers=headers)
                if response.status_code >= 400:
                    print(f"Failed to send email. Status Code: {response.status_code}, Body: {response.text}")
            except Exception as e:
                print(f"Exception sending email: {e}")

            return Response(VitalLogSerializer(vital_log).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientHistoryView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'PATIENT':
            return Response({'error': 'Only patients can view history'}, status=status.HTTP_403_FORBIDDEN)
        
        patient_profile = request.user.patient_profile
        vitals = VitalLog.objects.filter(patient=patient_profile).order_by('-recorded_at')
        serializer = VitalLogSerializer(vitals, many=True)
        return Response(serializer.data)

class ProfileUpdateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        
        # Update user fields
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'phone_number' in request.data:
            user.phone_number = request.data['phone_number']
            
        # Update profile picture if provided
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
            
        user.save()
        
        if user.role == 'doctor':
            try:
                doctor_profile = user.doctor_profile
                full_name_parts = []
                if user.first_name:
                    full_name_parts.append(user.first_name)
                if user.last_name:
                    full_name_parts.append(user.last_name)
                if full_name_parts:
                    doctor_profile.full_name = ' '.join(full_name_parts)
                    doctor_profile.save()
            except Exception:
                pass

        return Response({'message': 'Profile updated successfully'})

class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_new_password = request.data.get('confirm_new_password')

        if not current_password or not new_password or not confirm_new_password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({'error': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_new_password:
            return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'})

class RegisterDoctorView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        if 'username' not in data and 'email' in data:
            base_username = data['email'].split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            data['username'] = username

        # Ensure role is set to doctor
        data['role'] = 'doctor'

        user_serializer = UserSerializer(data=data)
        if user_serializer.is_valid():
            try:
                with transaction.atomic():
                    user = user_serializer.save()
                    DoctorProfile.objects.create(
                        user=user,
                        full_name=data.get('full_name', ''),
                        rmdc_number=data.get('rmdc_number', ''),
                        specialty=data.get('specialty', 'Nephrology'),
                        phone_number=data.get('phone_number', '')
                    )
            except Exception as e:
                return Response({"error": "Failed to create user and profile."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Send Welcome Email via SendGrid API HTTP request
            try:
                url = "https://api.sendgrid.com/v3/mail/send"
                headers = {
                    "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                    "Content-Type": "application/json"
                }
                subject = "Welcome to NephroSasa Provider Network"
                html_content = f"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://nephrosasa-rwanda.vercel.app/apple-touch-icon.png" width="80" alt="NephroSasa Logo" style="display: inline-block;">
                </div>
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Welcome to NephroSasa Provider Network</h2>
                <p style="font-size: 16px;">Dear Dr. {data.get('last_name', user.last_name)},</p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Your doctor account has been successfully created. We are excited to have you join our network.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    With NephroSasa, you can manage your patients securely, access their medical records and vitals instantly via QR code, and streamline your practice.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                    Please note that your RMDC License Number ({data.get('rmdc_number', '')}) is currently pending verification. You will gain full access to accept new patients once verified.
                </p>
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The NephroSasa Rwanda Team</strong>
                </p>
            </div>
            """
                payload = {
                    "personalizations": [{"to": [{"email": user.email}], "subject": subject}],
                    "from": {"email": "isaacmairopedro@gmail.com", "name": "NephroSasa Rwanda"},
                    "content": [{"type": "text/html", "value": html_content}]
                }
                response = requests.post(url, json=payload, headers=headers)
                if response.status_code >= 400:
                    print(f"Failed to send email. Status Code: {response.status_code}, Body: {response.text}")
            except Exception as e:
                print(f"Exception sending email: {e}")

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Doctor registered successfully", 
                "user": user_serializer.data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorDashboardView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this dashboard'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            profile = request.user.doctor_profile
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "full_name": profile.full_name,
            "rmdc_number": profile.rmdc_number,
            "specialty": profile.specialty,
            "phone_number": profile.phone_number,
            "is_verified": profile.is_verified,
            "total_patients": DoctorPatient.objects.filter(doctor=profile).count(),
            "recent_alerts": [],
            "upcoming_consultations_today": Consultation.objects.filter(
                doctor=profile,
                scheduled_date=datetime.date.today()
            ).count()
        })

class GenerateShareTokenView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can generate share tokens'}, status=status.HTTP_403_FORBIDDEN)
        
        # Deactivate existing tokens
        HealthRecordShare.objects.filter(patient=request.user, is_active=True).update(is_active=False)
        
        # Generate new token
        token = str(uuid.uuid4())
        share = HealthRecordShare.objects.create(patient=request.user, token=token)
        
        return Response({
            "token": token,
            "share_url": f"/shared-record/{token}",
            "created_at": share.created_at
        })

class GetShareTokenView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can access share tokens'}, status=status.HTTP_403_FORBIDDEN)
        
        active_share = HealthRecordShare.objects.filter(patient=request.user, is_active=True).first()
        if active_share:
            return Response({
                "token": active_share.token,
                "share_url": f"/shared-record/{active_share.token}",
                "created_at": active_share.created_at
            })
        return Response(None)

class SharedRecordView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            share = HealthRecordShare.objects.get(token=token, is_active=True)
        except HealthRecordShare.DoesNotExist:
            return Response({"error": "Record not found or link expired"}, status=status.HTTP_404_NOT_FOUND)
            
        patient = share.patient
        try:
            profile = patient.patient_profile
        except PatientProfile.DoesNotExist:
            return Response({"error": "Patient profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
        vitals = VitalLog.objects.filter(patient=profile).order_by('-recorded_at')
        
        recent_vitals = []
        for v in vitals[:5]:
            recent_vitals.append({
                "recorded_at": v.recorded_at,
                "systolic_bp": v.systolic_bp,
                "diastolic_bp": v.diastolic_bp,
                "blood_sugar": v.blood_sugar,
                "source": "Clinic" if any([v.hba1c, v.creatinine, v.gfr, v.bun]) else "Home",
                "hba1c": float(v.hba1c) if v.hba1c is not None else None,
                "creatinine": float(v.creatinine) if v.creatinine is not None else None,
                "bun": float(v.bun) if v.bun is not None else None,
                "gfr": float(v.gfr) if v.gfr is not None else None,
                "sodium": float(v.sodium) if v.sodium is not None else None,
                "potassium": float(v.potassium) if v.potassium is not None else None,
                "hemoglobin": float(v.hemoglobin) if v.hemoglobin is not None else None,
            })
            
        latest_vital = vitals.first()
        latest_risk_score = None
        if latest_vital and latest_vital.ai_risk_score:
            latest_risk_score = {
                "risk_level": latest_vital.ai_risk_score,
                "confidence": latest_vital.confidence_percentage,
                "scored_at": latest_vital.recorded_at
            }
            
        return Response({
            "patient_name": f"{patient.first_name} {patient.last_name}",
            "diagnosis_type": "Hypertension",
            "latest_risk_score": latest_risk_score,
            "recent_vitals": recent_vitals,
            "total_entries": vitals.count(),
            "generated_at": share.created_at
        })

class AvailableDoctorsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can access available doctors'}, status=status.HTTP_403_FORBIDDEN)
        
        doctors = DoctorProfile.objects.filter(is_verified=True)
        data = []
        for doctor in doctors:
            data.append({
                "id": doctor.id,
                "full_name": doctor.full_name,
                "rmdc_number": doctor.rmdc_number,
                "specialty": doctor.specialty,
                "phone_number": doctor.phone_number
            })
        return Response(data)

class BookConsultationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can book consultations'}, status=status.HTTP_403_FORBIDDEN)
        
        doctor_id = request.data.get('doctor_id')
        consultation_type = request.data.get('consultation_type')
        scheduled_date = request.data.get('scheduled_date')
        scheduled_time = request.data.get('scheduled_time')
        notes = request.data.get('notes', '')
        
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
            
        consultation = Consultation.objects.create(
            patient=request.user,
            doctor=doctor,
            consultation_type=consultation_type,
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            notes=notes
        )
        
        return Response({
            "id": consultation.id,
            "status": consultation.status,
            "message": "Consultation request sent!"
        }, status=status.HTTP_201_CREATED)

class MyConsultationsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can access their consultations'}, status=status.HTTP_403_FORBIDDEN)
            
        consultations = Consultation.objects.filter(patient=request.user).order_by('-booked_at')
        data = []
        for c in consultations:
            data.append({
                "id": c.id,
                "doctor_name": c.doctor.full_name,
                "consultation_type": c.consultation_type,
                "scheduled_date": c.scheduled_date,
                "scheduled_time": c.scheduled_time,
                "status": c.status,
                "notes": c.notes
            })
        return Response(data)

class AddPatientView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can add patients'}, status=status.HTTP_403_FORBIDDEN)

        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            share = HealthRecordShare.objects.get(token=token, is_active=True)
        except HealthRecordShare.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_404_NOT_FOUND)

        try:
            doctor_profile = request.user.doctor_profile
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        doctor_patient, created = DoctorPatient.objects.get_or_create(
            doctor=doctor_profile,
            patient=share.patient,
            defaults={'share_token': token}
        )

        return Response({
            'message': 'Patient added successfully' if created else 'Patient already in your list',
            'created': created
        }, status=status.HTTP_201_CREATED)


class MyPatientsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access patient list'}, status=status.HTTP_403_FORBIDDEN)

        try:
            doctor_profile = request.user.doctor_profile
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        doctor_patients = DoctorPatient.objects.filter(doctor=doctor_profile).order_by('-added_at')
        data = []
        for dp in doctor_patients:
            patient = dp.patient
            try:
                profile = patient.patient_profile
                vitals = VitalLog.objects.filter(patient=profile).order_by('-recorded_at').first()
                risk_level = vitals.ai_risk_score if vitals else None
            except PatientProfile.DoesNotExist:
                risk_level = None

            active_share = HealthRecordShare.objects.filter(patient=patient, is_active=True).first()
            share_token = active_share.token if active_share else dp.share_token

            data.append({
                'patient_name': patient.get_full_name(),
                'email': patient.email,
                'risk_level': risk_level,
                'added_at': dp.added_at,
                'share_token': share_token
            })

        return Response(data)

class DoctorScheduleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access schedule'}, status=status.HTTP_403_FORBIDDEN)
        try:
            doctor_profile = request.user.doctor_profile
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        consultations = Consultation.objects.filter(
            doctor=doctor_profile
        ).order_by('scheduled_date', 'scheduled_time')

        data = []
        for c in consultations:
            data.append({
                'id': str(c.id),
                'patient_name': f"{c.patient.first_name} {c.patient.last_name}",
                'patient_email': c.patient.email,
                'consultation_type': c.consultation_type,
                'scheduled_date': c.scheduled_date,
                'scheduled_time': c.scheduled_time,
                'status': c.status,
                'notes': c.notes
            })
        return Response(data)

class UpdateConsultationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, consultation_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can update consultations'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            consultation = Consultation.objects.get(id=consultation_id, doctor=request.user.doctor_profile)
        except Consultation.DoesNotExist:
            return Response({'error': 'Consultation not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if 'status' in request.data:
            consultation.status = request.data['status']
        if 'session_link' in request.data:
            consultation.session_link = request.data['session_link']
        consultation.save()
        
        return Response({'message': 'Consultation updated', 'status': consultation.status, 'session_link': consultation.session_link})
