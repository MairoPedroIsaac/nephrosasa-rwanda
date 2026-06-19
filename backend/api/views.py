import os
import joblib
import pandas as pd
import resend
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import PatientProfile, VitalLog
from .serializers import UserSerializer, PatientProfileSerializer, VitalLogSerializer
from django.db import transaction
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

# Configure Resend
resend.api_key = settings.RESEND_API_KEY

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
    if probability < 0.3:
        return "LOW", probability
    elif probability < 0.6:
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
            
            # Send Welcome Email via Resend
            try:
                resend.Emails.send({
                    "from": "NephroSasa <onboarding@resend.dev>",
                    "to": user.email,
                    "subject": "Welcome to NephroSasa Rwanda",
                    "html": f"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
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
                })
            except Exception as e:
                print(f"Failed to send email: {e}")

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
                'HbA1c': float(data.get('hba1c', 5.5)),
                'SerumCreatinine': float(data.get('creatinine', 1.0)),
                'GFR': float(data.get('gfr', 90.0)),
                'BUNLevels': float(data.get('bun', 15.0)),
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
            
            # Send Confirmation Email via Resend
            try:
                resend.Emails.send({
                    "from": "NephroSasa <onboarding@resend.dev>",
                    "to": request.user.email,
                    "subject": "Vitals Logged - NephroSasa",
                    "html": f"<h3>Vitals Recorded</h3><p>Your blood pressure and sugar levels have been recorded.</p><p>Current AI Risk Assessment: <strong>{vital_log.ai_risk_score}</strong></p>"
                })
            except Exception as e:
                print(f"Failed to send email: {e}")

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
