from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.models import PatientProfile, VitalLog
from unittest.mock import patch
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class VitalsIntegrationTests(APITestCase):

    def setUp(self):
        self.log_vitals_url = '/api/vitals/log/'
        self.history_url = '/api/vitals/history/'
        self.generate_token_url = '/api/patient/generate-share-token/'

        # Create Patient user
        self.user = User.objects.create_user(
            username='vitalpatient',
            email='vitals@example.com',
            password='Password123!',
            user_type='PATIENT',
            role='patient'
        )
        self.patient_profile = PatientProfile.objects.create(user=self.user)

        # Authenticate client
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    @patch('api.views.requests.post')
    def test_log_vital_success(self, mock_post):
        mock_post.return_value.status_code = 202

        data = {
            'systolic_bp': 120,
            'diastolic_bp': 80,
            'blood_sugar': 5.5
        }

        response = self.client.post(self.log_vitals_url, data, format='json')
        self.assertEqual(response.status_code, 201)

        # Verify record exists
        logs = VitalLog.objects.filter(patient=self.patient_profile)
        self.assertEqual(logs.count(), 1)
        
        log = logs.first()
        self.assertEqual(log.systolic_bp, 120)
        self.assertEqual(log.diastolic_bp, 80)
        self.assertEqual(log.blood_sugar, 5.5)

    @patch('api.views.requests.post')
    def test_log_vital_triggers_risk_score(self, mock_post):
        mock_post.return_value.status_code = 202

        data = {
            'systolic_bp': 180,
            'diastolic_bp': 110,
            'blood_sugar': 12.0
        }

        response = self.client.post(self.log_vitals_url, data, format='json')
        self.assertEqual(response.status_code, 201)

        log = VitalLog.objects.get(patient=self.patient_profile)
        
        # Check that the real model inference populated the risk fields.
        # Note: The model relation specified in the prompt was verified; 
        # the ai_risk_score is directly on the VitalLog model in this codebase.
        self.assertIsNotNone(log.ai_risk_score, "AI Risk Score should not be None")
        self.assertIn(log.ai_risk_score, ['LOW', 'MEDIUM', 'HIGH'])
        self.assertIsNotNone(log.confidence_percentage)

    def test_log_vital_unauthenticated_fails(self):
        # Clear auth
        self.client.credentials()
        
        data = {
            'systolic_bp': 120,
            'diastolic_bp': 80,
            'blood_sugar': 5.5
        }

        response = self.client.post(self.log_vitals_url, data, format='json')
        self.assertEqual(response.status_code, 401)

    def test_log_vital_missing_required_field_fails(self):
        # Omit blood_sugar
        data = {
            'systolic_bp': 120,
            'diastolic_bp': 80
        }

        response = self.client.post(self.log_vitals_url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('blood_sugar', response.data)

    @patch('api.views.requests.post')
    def test_health_history_returns_patient_own_data(self, mock_post):
        mock_post.return_value.status_code = 202

        # Log 2 vitals
        data1 = {'systolic_bp': 120, 'diastolic_bp': 80, 'blood_sugar': 5.5}
        data2 = {'systolic_bp': 130, 'diastolic_bp': 85, 'blood_sugar': 6.0}
        
        self.client.post(self.log_vitals_url, data1, format='json')
        self.client.post(self.log_vitals_url, data2, format='json')

        # GET history
        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, 200)
        
        # History is ordered by '-recorded_at', so data2 is first
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['systolic_bp'], 130)
        self.assertEqual(response.data[1]['systolic_bp'], 120)

    def test_qr_code_generation_success(self):
        response = self.client.post(self.generate_token_url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertIn('share_url', response.data)
        self.assertIn('created_at', response.data)
        
        # Share URL should contain the token
        token = response.data['token']
        self.assertTrue(response.data['share_url'].endswith(f'/{token}'))
