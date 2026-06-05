from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VitalLog, PatientProfile
import joblib
import os

@api_view(['POST'])
# @permission_classes([IsAuthenticated]) # Disabled for testing/demo purposes
def predict_kidney_risk(request):
    """
    Endpoint to log patient vitals and predict kidney risk using the trained AI model.
    Accepts: { 'systolic_bp': 130, 'diastolic_bp': 85, 'blood_sugar': 110, 'patient_id': 1 }
    Returns: Risk score and confidence.
    """
    try:
        data = request.data
        systolic = float(data.get('systolic_bp'))
        diastolic = float(data.get('diastolic_bp'))
        blood_sugar = float(data.get('blood_sugar'))
        patient_id = data.get('patient_id')
        
        # 1. Load the AI Model
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'nephrosasa-ai', 'models', 'nephrosasa_model.pkl')
        model = joblib.load(model_path)
        
        # 2. Run Prediction (Mock logic wrapping the actual model inference)
        # Note: The actual model expects specific features based on the training data.
        # This is a representation of how the vitals map to the model input.
        features = [[systolic, diastolic, blood_sugar]]
        prediction = model.predict(features)[0]
        
        # Depending on the model output, map it to our labels
        risk_map = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}
        risk_level = risk_map.get(prediction, 'UNKNOWN')
        
        # 3. Calculate Confidence
        probabilities = model.predict_proba(features)[0]
        confidence = max(probabilities) * 100
        
        # 4. Save to Database (If patient is provided)
        if patient_id:
            try:
                patient = PatientProfile.objects.get(id=patient_id)
                VitalLog.objects.create(
                    patient=patient,
                    systolic_bp=systolic,
                    diastolic_bp=diastolic,
                    blood_sugar=blood_sugar,
                    ai_risk_score=risk_level,
                    confidence_percentage=confidence
                )
            except PatientProfile.DoesNotExist:
                pass # Skip saving if patient doesn't exist for demo
                
        # 5. Return JSON Response
        return Response({
            'status': 'success',
            'vitals': {
                'systolic_bp': systolic,
                'diastolic_bp': diastolic,
                'blood_sugar': blood_sugar
            },
            'ai_analysis': {
                'risk_level': risk_level,
                'confidence_percentage': round(confidence, 1)
            }
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=400)
