from django.contrib import admin
from .models import CustomUser, PatientProfile, DoctorProfile, VitalLog, HealthRecordShare, Consultation, DoctorPatient

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'rmdc_number', 'specialty', 'is_verified']
    list_editable = ['is_verified']
    search_fields = ['full_name', 'rmdc_number']

@admin.register(DoctorPatient)
class DoctorPatientAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'patient', 'added_at']

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['user']

@admin.register(VitalLog)
class VitalLogAdmin(admin.ModelAdmin):
    list_display = ['patient', 'systolic_bp', 'diastolic_bp', 'blood_sugar', 'ai_risk_score', 'recorded_at']

@admin.register(HealthRecordShare)
class HealthRecordShareAdmin(admin.ModelAdmin):
    list_display = ['patient', 'token', 'is_active', 'created_at']
    list_editable = ['is_active']

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'scheduled_date', 'status']
    list_editable = ['status']
