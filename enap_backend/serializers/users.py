
"""
Serializers for the User model.
"""
from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'specific_role', 'notes', 'last_login', 'is_active']
        read_only_fields = ['last_login']

class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a User.
    """
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'specific_role', 'notes', 'password']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
