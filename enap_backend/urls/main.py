
"""
Main URL configuration for the enap_backend project.
"""
from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('enap_backend.urls.authentication')),
    path('api/products/', include('enap_backend.urls.products')),
    path('api/users/', include('enap_backend.urls.users')),
]
