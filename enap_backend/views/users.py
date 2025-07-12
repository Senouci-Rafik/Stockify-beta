
"""
API views pour la gestion des utilisateurs.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import User
from ..serializers import UserSerializer, UserCreateSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée - seuls les administrateurs peuvent modifier les utilisateurs.
    Les autres peuvent seulement consulter.
    """
    def has_permission(self, request, view):
        # Autoriser GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permissions d'écriture uniquement pour les admins
        return request.user and request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    """
    Endpoint API pour la gestion des utilisateurs.
    Fournit toutes les opérations CRUD sur les utilisateurs.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Endpoint pour récupérer les informations de l'utilisateur connecté.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Endpoint pour changer le mot de passe de l'utilisateur connecté.
        """
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {'detail': 'Les deux mots de passe sont requis.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not user.check_password(old_password):
            return Response(
                {'detail': 'Mot de passe actuel incorrect.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Mot de passe modifié avec succès.'})
