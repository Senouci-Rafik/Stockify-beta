#!/usr/bin/env python
"""
Script simple pour créer des utilisateurs de test.
"""
import os
import sys
import django

# Ajouter le répertoire parent au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockify.settings')

try:
    django.setup()
    print("✅ Django configuré avec succès")
except Exception as e:
    print(f"❌ Erreur lors de la configuration Django: {e}")
    sys.exit(1)

try:
    from django.contrib.auth import get_user_model
    from users.constants import UserType
    
    User = get_user_model()
    print("✅ Modèles importés avec succès")
except Exception as e:
    print(f"❌ Erreur lors de l'import des modèles: {e}")
    sys.exit(1)

def create_test_users():
    """Créer des utilisateurs de test"""
    print("\n🚀 Création d'utilisateurs de test...")
    print("=" * 50)
    
    # 1. Créer un utilisateur directeur
    try:
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
        
        director.set_password('testpassword123')
        director.save()
        
        if created:
            print("✅ Directeur créé avec succès!")
        else:
            print("✅ Directeur mis à jour!")
        print(f"   Email: {director.email}")
        print(f"   Mot de passe: testpassword123")
        print(f"   Type: {director.user_type}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du directeur: {e}")

    # 2. Créer un utilisateur client industriel
    try:
        industrial_client, created = User.objects.get_or_create(
            email='client@example.com',
            defaults={
                'first_name': 'Client',
                'last_name': 'Industriel',
                'user_type': UserType.INDUSTRIAL_CLIENT,
                'is_active': True,
            }
        )
        
        industrial_client.set_password('client123')
        industrial_client.save()
        
        if created:
            print("✅ Client industriel créé avec succès!")
        else:
            print("✅ Client industriel mis à jour!")
        print(f"   Email: {industrial_client.email}")
        print(f"   Mot de passe: client123")
        print(f"   Type: {industrial_client.user_type}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du client industriel: {e}")

    # 3. Créer un utilisateur point de vente
    try:
        retail_client, created = User.objects.get_or_create(
            email='retail@example.com',
            defaults={
                'first_name': 'Point',
                'last_name': 'Vente',
                'user_type': UserType.RETAIL_CLIENT,
                'is_active': True,
            }
        )
        
        retail_client.set_password('retail123')
        retail_client.save()
        
        if created:
            print("✅ Point de vente créé avec succès!")
        else:
            print("✅ Point de vente mis à jour!")
        print(f"   Email: {retail_client.email}")
        print(f"   Mot de passe: retail123")
        print(f"   Type: {retail_client.user_type}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du point de vente: {e}")

    print("\n" + "=" * 50)
    print("✅ Tous les utilisateurs de test ont été créés!")
    print("\n📋 Identifiants de test pour Postman:")
    print("   - Directeur: test@example.com / testpassword123")
    print("   - Client Industriel: client@example.com / client123")
    print("   - Point de Vente: retail@example.com / retail123")
    print("\n🔗 Endpoint de connexion: POST http://localhost:8000/api/users/token/")

if __name__ == "__main__":
    create_test_users() 