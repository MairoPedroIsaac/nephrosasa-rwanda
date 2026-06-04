# predict.py
# NephroSasa Rwanda - Prediction Module
# Uses the same 10 columns as the trained model

import joblib
import pandas as pd

# Load the trained model and scaler
model = joblib.load('models/nephrosasa_model.pkl')
scaler = joblib.load('models/nephrosasa_scaler.pkl')

def get_risk_label(probability):
    """
    Convert model probability (0 to 1) into risk level.
    """
    if probability < 0.3:
        return "low", probability
    elif probability < 0.6:
        return "medium", probability
    else:
        return "high", probability

def predict_kidney_risk(patient_data):
    """
    Predict kidney risk level from patient vital readings.
    
    Args:
        patient_data: Dictionary with these keys:
            - SystolicBP: float
            - DiastolicBP: float
            - FastingBloodSugar: float
            - HbA1c: float
            - SerumCreatinine: float
            - GFR: float
            - BUNLevels: float
            - Age: float
            - Smoking: int (0 or 1)
            - FamilyHistoryKidneyDisease: int (0 or 1)
    """
    # Convert to DataFrame
    patient_df = pd.DataFrame([patient_data])
    
    # Match exact column order from training
    expected_columns = [
        'SystolicBP', 'DiastolicBP', 'FastingBloodSugar', 'HbA1c',
        'SerumCreatinine', 'GFR', 'BUNLevels', 'Age', 'Smoking',
        'FamilyHistoryKidneyDisease'
    ]
    patient_df = patient_df[expected_columns]
    
    # Scale the input
    patient_scaled = scaler.transform(patient_df)
    
    # Get probability of CKD
    probability = model.predict_proba(patient_scaled)[0][1]
    
    # Convert to risk level
    risk_level, prob_value = get_risk_label(probability)
    
    return {
        "risk_level": risk_level,
        "confidence": round(prob_value * 100, 2),
        "probability": round(prob_value, 4),
        "message": f"Kidney risk level is {risk_level.upper()} with {round(prob_value * 100, 2)}% confidence"
    }

# Test the function
if __name__ == "__main__":
    sample_patient = {
        'SystolicBP': 130.0,
        'DiastolicBP': 85.0,
        'FastingBloodSugar': 110.0,
        'HbA1c': 5.8,
        'SerumCreatinine': 1.1,
        'GFR': 95.0,
        'BUNLevels': 15.0,
        'Age': 45.0,
        'Smoking': 0,
        'FamilyHistoryKidneyDisease': 1
    }
    
    result = predict_kidney_risk(sample_patient)
    print(f"Risk Level: {result['risk_level'].upper()}")
    print(f"Confidence: {result['confidence']}%")
    print(f"Message: {result['message']}")