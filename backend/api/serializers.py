from rest_framework import serializers
from .models import CustomUser, PatientProfile, DoctorProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'user_type')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    national_id = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone_number', 'user_type', 'national_id', 'date_of_birth')

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        # Check if email is already taken
        if CustomUser.objects.filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})
            
        return attrs

    def create(self, validated_data):
        user_type = validated_data.get('user_type', 'PATIENT')
        
        user = CustomUser.objects.create_user(
            username=validated_data['email'], # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            user_type=user_type
        )
        
        if user_type == 'PATIENT':
            PatientProfile.objects.create(
                user=user,
                national_id=validated_data.get('national_id'),
                date_of_birth=validated_data.get('date_of_birth')
            )
        elif user_type == 'DOCTOR':
            DoctorProfile.objects.create(
                user=user,
                rmdc_number=f"TMP-{user.id}" # Need real RMDC number in production
            )
            
        return user
