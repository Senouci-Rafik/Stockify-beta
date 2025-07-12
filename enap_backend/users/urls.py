from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserCreateAPIView,
    UserProfileView,
    UserUpdateView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    CustomTokenObtainPairView,
    LogoutView
)

app_name = 'users'

urlpatterns = [
    # User creation endpoint
    path('create/', UserCreateAPIView.as_view(), name='user-create'),
    
    # User profile and update endpoints
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    
    # Authentication
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Password Reset
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/<int:user_id>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
] 
