"""
Main URL configuration for HealthVault Rwanda.
This file routes URLs to the correct views.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin panel (for managing data)
    path('admin/', admin.site.urls),
    
    # API endpoints (all start with /api/)
    path('api/', include('api.urls')),
]

# Serve media files in development (user uploads like profile pictures)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)