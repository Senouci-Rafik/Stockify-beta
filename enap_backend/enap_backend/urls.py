from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, GammeViewSet, FamilleViewSet, EmballageViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'gammes', GammeViewSet)
router.register(r'familles', FamilleViewSet)
router.register(r'emballages', EmballageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
] 
