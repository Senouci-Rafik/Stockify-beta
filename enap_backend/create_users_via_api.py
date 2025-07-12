#!/usr/bin/env python
"""
Script pour créer des utilisateurs de test via l'API HTTP.
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_server_connection():
    """Tester la connexion au serveur"""
    try:
        response = requests.get(f"{BASE_URL}/users/")
        print("✅ Serveur accessible")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Serveur non accessible. Assurez-vous que le serveur Django est démarré.")
        print("   Commande: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def create_user_via_api(email, password, first_name, last_name, user_type):
    """Créer un utilisateur via l'API"""
    url = f"{BASE_URL}/users/create/"
    
    data = {
        "email": email,
        "password": password,
        "password2": password,
        "first_name": first_name,
        "last_name": last_name,
        "userType": user_type
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 201:
            print(f"✅ Utilisateur {email} créé avec succès!")
            return True
        elif response.status_code == 400:
            print(f"⚠️  Utilisateur {email} existe peut-être déjà ou erreur de validation")
            print(f"   Réponse: {response.text}")
            return False
        else:
            print(f"❌ Erreur lors de la création de {email}: {response.status_code}")
            print(f"   Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de la création de {email}: {e}")
        return False

def test_login(email, password):
    """Tester la connexion d'un utilisateur"""
    url = f"{BASE_URL}/users/token/"
    
    data = {
        "email": email,
        "password": password
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            print(f"✅ Connexion réussie pour {email}")
            return True
        else:
            print(f"❌ Échec de connexion pour {email}: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test de connexion pour {email}: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Création d'utilisateurs de test via l'API")
    print("=" * 60)
    
    # Tester la connexion au serveur
    if not test_server_connection():
        return
    
    print("\n📝 Création des utilisateurs de test...")
    print("-" * 40)
    
    # Liste des utilisateurs à créer
    users_to_create = [
        {
            "email": "test@example.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
            "user_type": "director"
        },
        {
            "email": "client@example.com",
            "password": "client123",
            "first_name": "Client",
            "last_name": "Industriel",
            "user_type": "client_industriel"
        },
        {
            "email": "retail@example.com",
            "password": "retail123",
            "first_name": "Point",
            "last_name": "Vente",
            "user_type": "client_point_vente"
        }
    ]
    
    created_users = []
    
    for user in users_to_create:
        success = create_user_via_api(
            user["email"],
            user["password"],
            user["first_name"],
            user["last_name"],
            user["user_type"]
        )
        if success:
            created_users.append(user)
        print()
    
    print("🧪 Test des connexions...")
    print("-" * 40)
    
    for user in created_users:
        test_login(user["email"], user["password"])
    
    print("\n" + "=" * 60)
    print("✅ Processus terminé!")
    print("\n📋 Identifiants de test pour Postman:")
    print("   - Directeur: test@example.com / testpassword123")
    print("   - Client Industriel: client@example.com / client123")
    print("   - Point de Vente: retail@example.com / retail123")
    print("\n🔗 Endpoint de connexion: POST http://localhost:8000/api/users/token/")

if __name__ == "__main__":
    main() 