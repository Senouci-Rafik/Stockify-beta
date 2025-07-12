﻿from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/products/', include('products.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/deliveries/', include('deliveries.urls')),
    path('api/alerts/', include('alerts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
