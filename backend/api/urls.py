from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterPatientView, LogVitalsView, PatientHistoryView, LoginView, ProfileUpdateView, ChangePasswordView, 
    RegisterDoctorView, DoctorDashboardView, GenerateShareTokenView, GetShareTokenView, SharedRecordView,
    AvailableDoctorsView, BookConsultationView, MyConsultationsView
)

urlpatterns = [
    path('auth/register/', RegisterPatientView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    path('vitals/log/', LogVitalsView.as_view(), name='log_vitals'),
    path('vitals/history/', PatientHistoryView.as_view(), name='vital_history'),
    
    path('auth/register/doctor/', RegisterDoctorView.as_view(), name='register_doctor'),
    path('doctor/dashboard/', DoctorDashboardView.as_view(), name='doctor_dashboard'),
    
    path('patient/generate-share-token/', GenerateShareTokenView.as_view(), name='generate_share_token'),
    path('patient/share-token/', GetShareTokenView.as_view(), name='get_share_token'),
    path('shared-record/<str:token>/', SharedRecordView.as_view(), name='shared_record'),
    
    path('doctors/available/', AvailableDoctorsView.as_view(), name='available_doctors'),
    path('consultations/book/', BookConsultationView.as_view(), name='book_consultation'),
    path('consultations/my/', MyConsultationsView.as_view(), name='my_consultations'),
]
