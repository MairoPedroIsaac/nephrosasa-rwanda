from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()

class AuthIntegrationTests(APITestCase):

    def setUp(self):
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'

    @patch('api.views.requests.post')
    def test_register_success(self, mock_post):
        # Mock the SendGrid API response
        mock_post.return_value.status_code = 202
        
        data = {
            'email': 'newpatient@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'SecurePassword123!',
            'user_type': 'PATIENT',
            'role': 'patient'
        }
        
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 201)
        
        # Verify user is created
        user_exists = User.objects.filter(email='newpatient@example.com').exists()
        self.assertTrue(user_exists)
        
        user = User.objects.get(email='newpatient@example.com')
        # Verify PatientProfile is created
        self.assertTrue(hasattr(user, 'patient_profile'))
        
        # Verify email was attempted to be sent
        self.assertTrue(mock_post.called)

    @patch('api.views.requests.post')
    def test_register_duplicate_email_fails(self, mock_post):
        mock_post.return_value.status_code = 202
        
        # First registration
        data = {
            'email': 'duplicate@example.com',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'password': 'Password123!',
            'user_type': 'PATIENT',
            'role': 'patient'
        }
        
        # Post first time
        response1 = self.client.post(self.register_url, data)
        self.assertEqual(response1.status_code, 201)
        
        # Attempt to register again with same email
        response2 = self.client.post(self.register_url, data)
        self.assertEqual(response2.status_code, 400)
        self.assertIn('email', response2.data)

    def test_register_missing_required_field_fails(self):
        # Omit password
        data = {
            'email': 'missing@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
        }
        
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.data)

    def test_login_success(self):
        # Create test user
        User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            password='SecurePassword123!'
        )
        
        data = {
            'email': 'login@example.com',
            'password': 'SecurePassword123!'
        }
        
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password_fails(self):
        # Create test user
        User.objects.create_user(
            username='loginuser2',
            email='wrongpass@example.com',
            password='SecurePassword123!'
        )
        
        data = {
            'email': 'wrongpass@example.com',
            'password': 'InvalidPassword999!'
        }
        
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, 401)
