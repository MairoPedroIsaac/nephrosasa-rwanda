import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('PATIENT', 'Patient'),
        ('DOCTOR', 'Doctor'),
        ('ADMIN', 'Admin'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='PATIENT')
    
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    assigned_doctor = models.ForeignKey('DoctorProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    
    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    full_name = models.CharField(max_length=255, default='')
    rmdc_number = models.CharField(max_length=50, unique=True)
    specialty = models.CharField(max_length=100, default='Nephrology')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Dr. {self.full_name}"

class VitalLog(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='vital_logs')
    systolic_bp = models.IntegerField(help_text="Systolic Blood Pressure (mmHg)")
    diastolic_bp = models.IntegerField(help_text="Diastolic Blood Pressure (mmHg)")
    blood_sugar = models.FloatField(help_text="Blood Sugar Level (mg/dL)")
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    # Clinic Lab Results (Optional)
    hba1c = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="HbA1c (%)")
    creatinine = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Serum Creatinine (mg/dL)")
    bun = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="BUN (mg/dL)")
    gfr = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="GFR (mL/min)")
    sodium = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Serum Sodium (mEq/L)")
    potassium = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Serum Potassium (mEq/L)")
    hemoglobin = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Hemoglobin (g/dL)")
    
    # AI Generated Risk Score based on this log
    ai_risk_score = models.CharField(max_length=10, choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')], null=True, blank=True)
    confidence_percentage = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.patient.user.last_name} Vitals - {self.recorded_at.strftime('%Y-%m-%d')}"

class HealthRecordShare(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='health_record_shares')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Share Token for {self.patient.username}"

class Consultation(models.Model):
    CONSULTATION_TYPE_CHOICES = (
        ('virtual', 'Virtual Session'),
        ('in_person', 'In-Person Visit'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='consultations')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='consultations')
    consultation_type = models.CharField(max_length=20, choices=CONSULTATION_TYPE_CHOICES)
    booked_at = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateField()
    scheduled_time = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    session_link = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.patient.username} with {self.doctor.full_name} on {self.scheduled_date}"

class DoctorPatient(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_patients')
    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_doctors')
    added_at = models.DateTimeField(auto_now_add=True)
    share_token = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('doctor', 'patient')

    def __str__(self):
        return f"Dr. {self.doctor.full_name} - {self.patient.get_full_name()}"
