import os
import joblib
import pandas as pd
import resend
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import PatientProfile, VitalLog
from .serializers import UserSerializer, PatientProfileSerializer, VitalLogSerializer
from django.contrib.auth import get_user_model

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
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            PatientProfile.objects.create(user=user)
            
            # Send Welcome Email via Resend
            try:
                resend.Emails.send({
                    "from": "NephroSasa <onboarding@resend.dev>",
                    "to": user.email,
                    "subject": "Welcome to NephroSasa Rwanda",
                    "html": f"<h1>Hello {user.first_name},</h1><p>Welcome to NephroSasa Rwanda. Your account has been successfully created. Remember to log your vitals regularly!</p>"
                })
            except Exception as e:
                print(f"Failed to send email: {e}")

            return Response({"message": "Patient registered successfully", "user": user_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                    "from": "NephroSasa <updates@resend.dev>",
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
        try:
            patient = request.user.patient_profile
            logs = VitalLog.objects.filter(patient=patient).order_by('-recorded_at')
            return Response(VitalLogSerializer(logs, many=True).data)
        except PatientProfile.DoesNotExist:
            return Response({"error": "User is not a registered patient"}, status=status.HTTP_403_FORBIDDEN)
