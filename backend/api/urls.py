from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterPatientView, LogVitalsView, PatientHistoryView

urlpatterns = [
    path('auth/register/', RegisterPatientView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('vitals/log/', LogVitalsView.as_view(), name='log_vitals'),
    path('vitals/history/', PatientHistoryView.as_view(), name='vital_history'),
]
