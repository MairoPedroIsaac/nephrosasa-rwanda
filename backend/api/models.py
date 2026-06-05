from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='PATIENT')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    assigned_doctor = models.ForeignKey('DoctorProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    
    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    rmdc_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=100, default='Nephrology')
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"

class VitalLog(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='vital_logs')
    systolic_bp = models.IntegerField(help_text="Systolic Blood Pressure (mmHg)")
    diastolic_bp = models.IntegerField(help_text="Diastolic Blood Pressure (mmHg)")
    blood_sugar = models.FloatField(help_text="Blood Sugar Level (mg/dL)")
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    # AI Generated Risk Score based on this log
    ai_risk_score = models.CharField(max_length=10, choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')], null=True, blank=True)
    confidence_percentage = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.patient.user.last_name} Vitals - {self.recorded_at.strftime('%Y-%m-%d')}"
