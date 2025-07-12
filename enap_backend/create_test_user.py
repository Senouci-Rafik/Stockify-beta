#!/usr/bin/env python
"""
Script pour créer un utilisateur de test.
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

def create_test_user():
    """Créer un utilisateur de test (Directeur)"""
    try:
        # Vérifier si l'utilisateur existe déjà
        user, created = User.objects.get_or_create(
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
            user.set_password('testpassword123')
            user.save()
            print("✅ Utilisateur de test créé avec succès!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: testpassword123")
            print(f"Type: {user.user_type}")
        else:
            # Mettre à jour le mot de passe si l'utilisateur existe déjà
            user.set_password('testpassword123')
            user.save()
            print("✅ Utilisateur de test mis à jour!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: testpassword123")
            print(f"Type: {user.user_type}")
            
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'utilisateur: {e}")

def create_client_user():
    """Créer un utilisateur client de test"""
    try:
        user, created = User.objects.get_or_create(
            email='client@example.com',
            defaults={
                'first_name': 'Client',
                'last_name': 'Test',
                'user_type': UserType.INDUSTRIAL_CLIENT,
                'is_active': True,
            }
        )
        
        if created:
            user.set_password('client123')
            user.save()
            print("✅ Utilisateur client créé avec succès!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: client123")
            print(f"Type: {user.user_type}")
        else:
            user.set_password('client123')
            user.save()
            print("✅ Utilisateur client mis à jour!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: client123")
            print(f"Type: {user.user_type}")
            
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'utilisateur client: {e}")

def create_retail_client():
    """Créer un utilisateur point de vente de test"""
    try:
        user, created = User.objects.get_or_create(
            email='retail@example.com',
            defaults={
                'first_name': 'Retail',
                'last_name': 'Client',
                'user_type': UserType.RETAIL_CLIENT,
                'is_active': True,
            }
        )
        
        if created:
            user.set_password('retail123')
            user.save()
            print("✅ Utilisateur point de vente créé avec succès!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: retail123")
            print(f"Type: {user.user_type}")
        else:
            user.set_password('retail123')
            user.save()
            print("✅ Utilisateur point de vente mis à jour!")
            print(f"Email: {user.email}")
            print(f"Mot de passe: retail123")
            print(f"Type: {user.user_type}")
            
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'utilisateur point de vente: {e}")

if __name__ == "__main__":
    print("🚀 Création d'utilisateurs de test")
    print("=" * 50)
    
    create_test_user()
    print()
    create_client_user()
    print()
    create_retail_client()
    
    print("\n✅ Utilisateurs de test créés!")
    print("\nVous pouvez maintenant tester la connexion avec:")
    print("- Directeur: test@example.com / testpassword123")
    print("- Client Industriel: client@example.com / client123")
    print("- Point de Vente: retail@example.com / retail123") 