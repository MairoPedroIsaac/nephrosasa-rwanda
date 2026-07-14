import os
import sys
import joblib
import pandas as pd
import pytest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE

# Change working directory so predict.py can load models relative to its own location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
sys.path.append(BASE_DIR)

from predict import get_risk_label

@pytest.fixture
def loaded_model():
    """Load the trained Random Forest model using joblib."""
    return joblib.load('models/nephrosasa_model.pkl')

@pytest.fixture
def loaded_scaler():
    """Load the trained StandardScaler using joblib."""
    return joblib.load('models/nephrosasa_scaler.pkl')

def test_get_risk_label_boundaries():
    """
    Test the risk label logic directly for all required boundary cases.
    """
    assert get_risk_label(0.0)[0] == "low"
    assert get_risk_label(0.29)[0] == "low"
    assert get_risk_label(0.3)[0] == "medium"
    assert get_risk_label(0.59)[0] == "medium"
    assert get_risk_label(0.6)[0] == "high"
    assert get_risk_label(1.0)[0] == "high"

def test_end_to_end_profiles(loaded_model, loaded_scaler):
    """
    Test the loaded model + scaler pipeline end-to-end with three representative 
    clinical profiles spanning the low/medium/high risk bands.
    """
    def predict_risk(patient_data):
        patient_df = pd.DataFrame([patient_data])
        expected_columns = [
            'SystolicBP', 'DiastolicBP', 'FastingBloodSugar', 'HbA1c',
            'SerumCreatinine', 'GFR', 'BUNLevels', 'Age', 'Smoking',
            'FamilyHistoryKidneyDisease'
        ]
        patient_df = patient_df[expected_columns]
        patient_scaled = loaded_scaler.transform(patient_df)
        probability = loaded_model.predict_proba(patient_scaled)[0][1]
        risk_level, _ = get_risk_label(probability)
        return risk_level

    # Representative low-risk clinical profile (synthetic, not a literal reproduction of a specific test account — 3 of the 10 fields are not documented in TESTING_REPORT.md)
    low_profile = {
        'SystolicBP': 115.0, 'DiastolicBP': 75.0, 'FastingBloodSugar': 4.5,
        'HbA1c': 5.5, 'SerumCreatinine': 0.8, 'GFR': 90.0, 'BUNLevels': 12.0,
        'Age': 40.0, 'Smoking': 0, 'FamilyHistoryKidneyDisease': 0
    }
    
    # Representative medium-risk clinical profile (synthetic, not a literal reproduction of a specific test account — 3 of the 10 fields are not documented in TESTING_REPORT.md)
    medium_profile = {
        'SystolicBP': 160.0, 'DiastolicBP': 100.0, 'FastingBloodSugar': 9.0,
        'HbA1c': 7.2, 'SerumCreatinine': 1.4, 'GFR': 58.0, 'BUNLevels': 22.0,
        'Age': 55.0, 'Smoking': 0, 'FamilyHistoryKidneyDisease': 0 
    }
    
    # Representative high-risk clinical profile (synthetic, not a literal reproduction of a specific test account — 3 of the 10 fields are not documented in TESTING_REPORT.md)
    high_profile = {
        'SystolicBP': 200.0, 'DiastolicBP': 120.0, 'FastingBloodSugar': 15.0,
        'HbA1c': 10.5, 'SerumCreatinine': 3.2, 'GFR': 22.0, 'BUNLevels': 45.0,
        'Age': 60.0, 'Smoking': 1, 'FamilyHistoryKidneyDisease': 1
    }

    assert predict_risk(low_profile) == "low"
    assert predict_risk(medium_profile) == "medium"
    assert predict_risk(high_profile) == "high"

def test_edge_cases(loaded_model, loaded_scaler):
    """
    Test two edge cases stressing the model's most important features (GFR and SerumCreatinine).
    """
    def predict_risk(patient_data):
        patient_df = pd.DataFrame([patient_data])
        expected_columns = [
            'SystolicBP', 'DiastolicBP', 'FastingBloodSugar', 'HbA1c',
            'SerumCreatinine', 'GFR', 'BUNLevels', 'Age', 'Smoking',
            'FamilyHistoryKidneyDisease'
        ]
        patient_df = patient_df[expected_columns]
        patient_scaled = loaded_scaler.transform(patient_df)
        probability = loaded_model.predict_proba(patient_scaled)[0][1]
        risk_level, _ = get_risk_label(probability)
        return risk_level

    # Severely abnormal GFR (15) with otherwise normal values
    abnormal_gfr_profile = {
        'SystolicBP': 120.0, 'DiastolicBP': 80.0, 'FastingBloodSugar': 5.0,
        'HbA1c': 5.5, 'SerumCreatinine': 1.0, 'GFR': 15.0, 'BUNLevels': 15.0,
        'Age': 40.0, 'Smoking': 0, 'FamilyHistoryKidneyDisease': 0
    }
    assert predict_risk(abnormal_gfr_profile) != "low"

    # Fully normal healthy profile
    healthy_profile = {
        'SystolicBP': 115.0, 'DiastolicBP': 75.0, 'FastingBloodSugar': 4.5,
        'HbA1c': 5.2, 'SerumCreatinine': 0.8, 'GFR': 95.0, 'BUNLevels': 12.0,
        'Age': 35.0, 'Smoking': 0, 'FamilyHistoryKidneyDisease': 0
    }
    assert predict_risk(healthy_profile) == "low"

def test_reproduce_benchmark_accuracy():
    """
    Reproduce the reported accuracy benchmark by running the exact same pipeline 
    as train_model.py and asserting the Random Forest test accuracy is 84.94%.
    """
    df = pd.read_csv('datasets/Chronic_Kidney_Disease_data.csv')
    
    feature_columns = [
        'SystolicBP', 'DiastolicBP', 'FastingBloodSugar', 'HbA1c', 
        'SerumCreatinine', 'GFR', 'BUNLevels', 'Age', 'Smoking', 
        'FamilyHistoryKidneyDisease'
    ]
    X = df[feature_columns]
    y = df['Diagnosis']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    smote = SMOTE(random_state=42)
    X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_balanced)
    X_test_scaled = scaler.transform(X_test)
    
    rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
    rf_model.fit(X_train_scaled, y_train_balanced)
    
    rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test_scaled))
    
    # Asserting accuracy is 84.94%
    assert abs(rf_accuracy - 0.8493975903614458) < 0.001

