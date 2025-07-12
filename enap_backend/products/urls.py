# products/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, GammeViewSet, FamilleViewSet, EmballageViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'gammes', GammeViewSet, basename='gamme')
router.register(r'familles', FamilleViewSet, basename='famille')
router.register(r'emballages', EmballageViewSet, basename='emballage')

urlpatterns = router.urls
