from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from .serializers import (
    UserCreationSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .permissions import IsSuperUser, IsOwnerOrDirector

User = get_user_model()

class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsSuperUser,)
    serializer_class = UserCreationSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrDirector)

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrDirector)

    def get_object(self):
        return self.request.user

class LogoutView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

class PasswordResetRequestView(views.APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                user.last_password_reset_request = timezone.now()
                user.save()

                # Notify admin about password reset request
                admin_users = User.objects.filter(user_type='admin')
                for admin in admin_users:
                    send_mail(
                        _('Password Reset Request'),
                        _('A user has requested a password reset. Please check the admin panel.'),
                        settings.DEFAULT_FROM_EMAIL,
                        [admin.email],
                        fail_silently=False,
                    )

                return Response({
                    'message': _('Password reset request has been sent to administrators.')
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({
                    'message': _('If a user with this email exists, a password reset request has been sent.')
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(views.APIView):
    permission_classes = (IsSuperUser,)
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                user.set_password(serializer.validated_data['password'])
                user.last_password_reset_request = None
                user.save()

                # Notify user about password change
                send_mail(
                    _('Password Changed'),
                    _('Your password has been changed by an administrator.'),
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )

                return Response({
                    'message': _('Password has been reset successfully.')
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                'message': _('User not found.')
            }, status=status.HTTP_404_NOT_FOUND)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        print("=== Début de la requête de connexion ===")
        print(f"Données reçues: {request.data}")
        
        try:
            response = super().post(request, *args, **kwargs)
            print(f"Réponse de TokenObtainPairView: {response.status_code}")
            
            if response.status_code == 200:
                print("Tentative de récupération de l'utilisateur...")
                user = User.objects.get(email=request.data['email'])
                print(f"Utilisateur trouvé: {user.email}, type: {user.user_type}")
                
                if user.is_director():
                    print("L'utilisateur est un directeur, mise à jour de is_sso_authenticated...")
                    user.is_sso_authenticated = True
                    user.save()
                    print("is_sso_authenticated mis à jour avec succès")
                
                # Add user information to the response in the format expected by frontend
                user_data = {
                    'id': str(user.id),  # Convert to string to match frontend type
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'user_type': user.user_type,
                    'isActive': user.is_active,
                    'isStaff': user.is_staff,
                    'isSuperuser': user.is_superuser,
                    'companyName': getattr(user, 'company_name', None),
                    'createdAt': user.date_joined.isoformat() if user.date_joined else None,
                    'updatedAt': user.last_login.isoformat() if user.last_login else None,
                }
                print(f"Données utilisateur à envoyer: {user_data}")
                response.data['user'] = user_data
                print("Données utilisateur ajoutées à la réponse")
            
            print("=== Fin de la requête de connexion ===")
            return response
            
        except Exception as e:
            print(f"ERREUR dans CustomTokenObtainPairView: {str(e)}")
            print(f"Type d'erreur: {type(e)}")
            import traceback
            print(f"Traceback complet:\n{traceback.format_exc()}")
            raise 
