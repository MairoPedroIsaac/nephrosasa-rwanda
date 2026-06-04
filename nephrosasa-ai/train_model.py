# train_model_final.py
# NephroSasa Rwanda - Production AI Pipeline

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("NEPHROSASA RWANDA - PRODUCTION AI PIPELINE")
print("Dataset: 1,659 Clinical Records")
print("=" * 60)

# 1. Load the dataset
print("\n[1/6] Loading clinical data...")
df = pd.read_csv('datasets/Chronic_Kidney_Disease_data.csv')
print(f"Dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")

# 2. Map Features
feature_columns = [
    'SystolicBP', 'DiastolicBP', 'FastingBloodSugar', 'HbA1c', 
    'SerumCreatinine', 'GFR', 'BUNLevels', 'Age', 'Smoking', 
    'FamilyHistoryKidneyDisease'
]

X = df[feature_columns]
y = df['Diagnosis']

# 3. Train/Test Split & Apply SMOTE
print("\n[2/6] Splitting data and applying SMOTE balancing...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

print(f"  - Balanced Train Set Size: {X_train_balanced.shape}")
print(f"  - New Balanced Profile: {pd.Series(y_train_balanced).value_counts().to_dict()}")

# 4. Scale Features
print("\n[3/6] Normalizing features using StandardScaler...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_balanced)
X_test_scaled = scaler.transform(X_test)

# 5. Train Production Logistic Regression
print("\n[4/6] Fitting production Logistic Regression model...")
lr_model = LogisticRegression(random_state=42, max_iter=1000)
lr_model.fit(X_train_scaled, y_train_balanced)

y_pred_lr = lr_model.predict(X_test_scaled)
lr_accuracy = accuracy_score(y_test, y_pred_lr)

cm_lr = confusion_matrix(y_test, y_pred_lr)
tn_lr, fp_lr, fn_lr, tp_lr = cm_lr.ravel()
lr_fpr = fp_lr / (fp_lr + tn_lr) if (fp_lr + tn_lr) > 0 else 0

print(f"\nConfusion Matrix:")
print(f"  True Negatives (Correct Healthy):   {tn_lr}")
print(f"  False Positives (False Alarms):     {fp_lr}")
print(f"  False Negatives (Missed CKD):       {fn_lr}")
print(f"  True Positives (Correct CKD):       {tp_lr}")
print(f"\n  Production Accuracy: {lr_accuracy * 100:.2f}%")
print(f"  Production False Positive Rate: {lr_fpr * 100:.2f}%")

# 6. Train Random Forest Comparison
print("\n[5/6] Fitting baseline Random Forest model...")
rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
rf_model.fit(X_train_scaled, y_train_balanced)
rf_accuracy = accuracy_score(y_test, rf_model.predict(X_test_scaled))
print(f"  - Random Forest Accuracy: {rf_accuracy * 100:.2f}%")

# 7. Cross-Validation & Export
print("\n[6/6] Verifying system stability and saving models...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(lr_model, X_train_scaled, y_train_balanced, cv=cv, scoring='accuracy')

os.makedirs('models', exist_ok=True)
joblib.dump(rf_model, 'models/nephrosasa_model.pkl')      # RF is now production
joblib.dump(scaler, 'models/nephrosasa_scaler.pkl')
joblib.dump(lr_model, 'models/lr_model_baseline.pkl')     # LR saved for comparison
print("Models saved to /models directory")

print("\n" + "=" * 60)
print("FINAL PIPELINE SUMMARY")
print("=" * 60)
print(classification_report(y_test, y_pred_lr, target_names=['Healthy (No CKD)', 'CKD']))
print(f"Mean K-Fold CV Accuracy: {cv_scores.mean() * 100:.2f}%")
print(f"Standard Deviation: {cv_scores.std() * 100:.2f}%")
print("=" * 60)