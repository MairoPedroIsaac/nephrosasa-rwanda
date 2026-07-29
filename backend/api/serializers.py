from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PatientProfile, DoctorProfile, VitalLog

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Validates and serializes the base User model, handling standard authentication 
    fields like username, email, and password. Also handles user creation logic.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'role', 'phone_number', 'password', 'profile_picture', 'date_joined', 'last_login')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    """
    Validates and serializes the PatientProfile model. Includes nested read-only 
    User data to provide a complete patient identity payload.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'

class DoctorProfileSerializer(serializers.ModelSerializer):
    """
    Validates and serializes the DoctorProfile model. Includes nested read-only 
    User data and professional details like RMDC number and specialty.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'

class VitalLogSerializer(serializers.ModelSerializer):
    """
    Validates and serializes the VitalLog model for patient health readings. 
    AI risk scores and calculation timestamps are strictly read-only.
    """
    class Meta:
        model = VitalLog
        fields = '__all__'
        read_only_fields = ('ai_risk_score', 'confidence_percentage', 'recorded_at')
