"""
Demo data for running NephroSasa locally.

Creates one patient with six months of readings and one verified doctor
who follows that patient, so both dashboards have something to show.
Safe to run more than once.

Run against the LOCAL SQLite database only:
    DATABASE_URL=sqlite:///db.sqlite3 python manage.py shell < scripts/seed_demo.py
"""
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

import uuid

from api.models import Consultation, CustomUser, DoctorPatient, DoctorProfile, HealthRecordShare, PatientProfile, VitalLog

engine = settings.DATABASES['default']['ENGINE']
if 'sqlite' not in engine:
    raise SystemExit('Refusing to seed: this is not the local SQLite database. Prefix the command with DATABASE_URL=sqlite:///db.sqlite3')

PASSWORD = 'Demo@2026!'

# Patient
patient, _ = CustomUser.objects.get_or_create(
    username='demo.patient',
    defaults=dict(email='patient@demo.nephrosasa.rw', first_name='Jeanne', last_name='Uwase', user_type='PATIENT', role='patient'),
)
patient.set_password(PASSWORD)
patient.save()
pprofile, _ = PatientProfile.objects.get_or_create(user=patient)

# Doctor
doctor, _ = CustomUser.objects.get_or_create(
    username='demo.doctor',
    defaults=dict(email='doctor@demo.nephrosasa.rw', first_name='Eric', last_name='Mugisha', user_type='DOCTOR', role='doctor'),
)
doctor.set_password(PASSWORD)
doctor.save()
dprofile, _ = DoctorProfile.objects.get_or_create(
    user=doctor,
    defaults=dict(full_name='Eric Mugisha', rmdc_number='RMDC-DEMO-001', specialty='Nephrology', is_verified=True),
)
pprofile.assigned_doctor = dprofile
pprofile.save()
# The patient shares their record with the doctor, the same as scanning their QR code
share = HealthRecordShare.objects.filter(patient=patient, is_active=True).first()
if share is None:
    share = HealthRecordShare.objects.create(patient=patient, token=str(uuid.uuid4()))
link, _ = DoctorPatient.objects.get_or_create(doctor=dprofile, patient=patient)
link.share_token = share.token
link.save()

# Readings: blood pressure creeping up over six months
VitalLog.objects.filter(patient=pprofile).delete()
now = timezone.now()
readings = [
    (180, 128, 82, 6.2, 'LOW', 84),
    (150, 131, 84, 6.5, 'LOW', 80),
    (120, 136, 88, 7.2, 'LOW', 72),
    (90, 134, 86, 6.9, 'LOW', 74),
    (60, 139, 90, 6.8, 'MEDIUM', 77),
    (35, 144, 92, 7.4, 'MEDIUM', 79),
    (14, 146, 93, 7.0, 'MEDIUM', 80),
    (3, 148, 94, 7.1, 'MEDIUM', 81),
]
for days_ago, sys_bp, dia_bp, sugar, risk, conf in readings:
    log = VitalLog.objects.create(
        patient=pprofile, systolic_bp=sys_bp, diastolic_bp=dia_bp, blood_sugar=sugar,
        ai_risk_score=risk, confidence_percentage=conf,
    )
    VitalLog.objects.filter(pk=log.pk).update(recorded_at=now - timedelta(days=days_ago))

# One confirmed consultation today
Consultation.objects.get_or_create(
    patient=patient, doctor=dprofile, scheduled_date=timezone.localdate(),
    defaults=dict(consultation_type='virtual', scheduled_time='14:00', status='confirmed', notes='Review rising blood pressure'),
)

print('Demo data ready.')
print('  Patient: patient@demo.nephrosasa.rw /', PASSWORD)
print('  Doctor:  doctor@demo.nephrosasa.rw /', PASSWORD)
