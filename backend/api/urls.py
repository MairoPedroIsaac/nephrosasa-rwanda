from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterPatientView, LogVitalsView, PatientHistoryView, LoginView, ProfileUpdateView, ChangePasswordView

urlpatterns = [
    path('auth/register/', RegisterPatientView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    path('vitals/log/', LogVitalsView.as_view(), name='log_vitals'),
    path('vitals/history/', PatientHistoryView.as_view(), name='vital_history'),
]
