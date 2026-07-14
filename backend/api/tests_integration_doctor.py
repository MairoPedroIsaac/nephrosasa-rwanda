from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.models import DoctorProfile, PatientProfile, Consultation
from unittest.mock import patch
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class DoctorIntegrationTests(APITestCase):

    def setUp(self):
        self.register_doctor_url = '/api/auth/register/doctor/'
        self.dashboard_url = '/api/doctor/dashboard/'
        self.generate_token_url = '/api/patient/generate-share-token/'
        self.book_consultation_url = '/api/consultations/book/'
        self.profile_update_url = '/api/auth/profile/update/'
        
        # Create a verified doctor for tests
        self.doctor_user = User.objects.create_user(
            username='doctor1',
            email='doctor@example.com',
            password='Password123!',
            user_type='DOCTOR',
            role='doctor',
            first_name='John',
            last_name='Doe'
        )
        self.doctor_profile = DoctorProfile.objects.create(
            user=self.doctor_user,
            full_name='John Doe',
            rmdc_number='RMDC12345',
            specialty='Nephrology',
            is_verified=True
        )
        
        # Create a patient for tests
        self.patient_user = User.objects.create_user(
            username='patient1',
            email='patient@example.com',
            password='Password123!',
            user_type='PATIENT',
            role='patient',
            first_name='Jane',
            last_name='Smith'
        )
        self.patient_profile = PatientProfile.objects.create(user=self.patient_user)

    def authenticate_as_doctor(self):
        refresh = RefreshToken.for_user(self.doctor_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
    def authenticate_as_patient(self):
        refresh = RefreshToken.for_user(self.patient_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    @patch('api.views.requests.post')
    def test_doctor_register_success(self, mock_post):
        mock_post.return_value.status_code = 202
        
        data = {
            'email': 'newdoc@example.com',
            'password': 'Password123!',
            'first_name': 'New',
            'last_name': 'Doc',
            'full_name': 'New Doc',
            'rmdc_number': 'RMDC999',
            'specialty': 'Urology',
            'phone_number': '1234567890'
        }
        
        response = self.client.post(self.register_doctor_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        
        # Verify doctor is created and UNVERIFIED by default
        new_doc_user = User.objects.get(email='newdoc@example.com')
        self.assertEqual(new_doc_user.role, 'doctor')
        
        new_doc_profile = DoctorProfile.objects.get(user=new_doc_user)
        self.assertFalse(new_doc_profile.is_verified)
        self.assertEqual(new_doc_profile.rmdc_number, 'RMDC999')

    def test_doctor_dashboard_requires_auth(self):
        self.client.credentials() # clear auth
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, 401)

    def test_qr_scan_valid_token_returns_patient_data(self):
        # Generate token as patient
        self.authenticate_as_patient()
        gen_response = self.client.post(self.generate_token_url, format='json')
        self.assertEqual(gen_response.status_code, 200)
        token = gen_response.data['token']
        
        # Scan as doctor
        self.authenticate_as_doctor()
        scan_url = f'/api/shared-record/{token}/'
        scan_response = self.client.get(scan_url)
        self.assertEqual(scan_response.status_code, 200)
        
        # Validate patient info in response
        self.assertEqual(scan_response.data['patient_name'], 'Jane Smith')

    def test_qr_scan_invalid_token_fails(self):
        self.authenticate_as_doctor()
        scan_url = '/api/shared-record/fake-invalid-token-123/'
        scan_response = self.client.get(scan_url)
        self.assertEqual(scan_response.status_code, 404)

    def test_book_consultation_success(self):
        self.authenticate_as_patient()
        data = {
            'doctor_id': self.doctor_profile.id,
            'consultation_type': 'virtual',
            'scheduled_date': '2026-08-01',
            'scheduled_time': '10:00 AM',
            'notes': 'Routine checkup'
        }
        response = self.client.post(self.book_consultation_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        
        # Verify Consultation record
        consultation = Consultation.objects.get(id=response.data['id'])
        self.assertEqual(consultation.patient, self.patient_user)
        self.assertEqual(consultation.doctor, self.doctor_profile)
        self.assertEqual(consultation.status, 'pending')

    def test_doctor_confirm_consultation(self):
        # Create consultation manually first
        consultation = Consultation.objects.create(
            patient=self.patient_user,
            doctor=self.doctor_profile,
            consultation_type='virtual',
            scheduled_date='2026-08-01',
            scheduled_time='10:00 AM',
            status='pending'
        )
        
        self.authenticate_as_doctor()
        update_url = f'/api/doctor/consultation/{consultation.id}/update/'
        data = {
            'status': 'confirmed',
            'session_link': 'https://meet.google.com/abc-defg-hij'
        }
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        
        # Refresh and assert
        consultation.refresh_from_db()
        self.assertEqual(consultation.status, 'confirmed')
        self.assertEqual(consultation.session_link, 'https://meet.google.com/abc-defg-hij')

    def test_doctor_profile_update_success(self):
        self.authenticate_as_doctor()
        data = {
            'first_name': 'Johnny',
            'last_name': 'Appleseed',
            'phone_number': '0987654321'
        }
        response = self.client.put(self.profile_update_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        
        self.doctor_user.refresh_from_db()
        self.assertEqual(self.doctor_user.first_name, 'Johnny')
        self.assertEqual(self.doctor_user.last_name, 'Appleseed')
        self.assertEqual(self.doctor_user.phone_number, '0987654321')
        
        self.doctor_profile.refresh_from_db()
        self.assertEqual(self.doctor_profile.full_name, 'Johnny Appleseed')
