
"""
Serializers for authentication (login, register).
"""
from rest_framework import serializers
from ..models import User

class LoginSerializer(serializers.Serializer):
    """
    Serializer for login requests.
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registration requests.
    """
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'specific_role', 'password']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
