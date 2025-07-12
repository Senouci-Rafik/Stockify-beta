#!/usr/bin/env python
"""
Script final pour créer des utilisateurs de test.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockify.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.constants import UserType

User = get_user_model()

def create_test_users():
    """Créer des utilisateurs de test"""
    print("🚀 Création d'utilisateurs de test...")
    
    # Créer un utilisateur directeur
    director, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': UserType.DIRECTOR,
            'is_active': True,
            'is_staff': True,
        }
    )
    
    if created:
        director.set_password('testpassword123')
        director.save()
        print("✅ Directeur créé: test@example.com / testpassword123")
    else:
        print("ℹ️  Directeur existe déjà: test@example.com")
    
    # Créer un client industriel
    industrial, created = User.objects.get_or_create(
        email='client@example.com',
        defaults={
            'first_name': 'Client',
            'last_name': 'Industriel',
            'user_type': UserType.INDUSTRIAL_CLIENT,
            'is_active': True,
        }
    )
    
    if created:
        industrial.set_password('client123')
        industrial.save()
        print("✅ Client industriel créé: client@example.com / client123")
    else:
        print("ℹ️  Client industriel existe déjà: client@example.com")
    
    # Créer un point de vente
    retail, created = User.objects.get_or_create(
        email='retail@example.com',
        defaults={
            'first_name': 'Point',
            'last_name': 'Vente',
            'user_type': UserType.RETAIL_CLIENT,
            'is_active': True,
        }
    )
    
    if created:
        retail.set_password('retail123')
        retail.save()
        print("✅ Point de vente créé: retail@example.com / retail123")
    else:
        print("ℹ️  Point de vente existe déjà: retail@example.com")
    
    print("\n🎉 Utilisateurs de test prêts !")
    print("\n📋 Identifiants de connexion :")
    print("   Directeur: test@example.com / testpassword123")
    print("   Client Industriel: client@example.com / client123")
    print("   Point de Vente: retail@example.com / retail123")

if __name__ == '__main__':
    create_test_users() 