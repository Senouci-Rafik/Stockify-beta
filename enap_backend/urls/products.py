
"""
URL patterns for product management.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.products import ProductViewSet

router = DefaultRouter()
router.register('', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
