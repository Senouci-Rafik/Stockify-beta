#!/usr/bin/env python
"""
Script de test pour vérifier l'endpoint de connexion avec des utilisateurs valides.
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_login_with_valid_user():
    """Test de connexion avec un utilisateur valide"""
    print("🔍 Test de connexion avec utilisateur valide...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/token/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion réussie!")
            print(f"Access Token: {data.get('access', 'Non trouvé')[:50]}...")
            print(f"Refresh Token: {data.get('refresh', 'Non trouvé')[:50]}...")
            
            if 'user' in data:
                user = data['user']
                print(f"Utilisateur: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"Email: {user.get('email', '')}")
                print(f"Type: {user.get('user_type', '')}")
                print(f"ID: {user.get('id', '')}")
            else:
                print("❌ Données utilisateur manquantes dans la réponse")
                
        elif response.status_code == 401:
            print("❌ Erreur d'authentification")
            print(f"Réponse: {response.text}")
        else:
            print(f"❌ Erreur inattendue: {response.status_code}")
            print(f"Réponse: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connexion refusée (serveur non démarré)")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_login_with_client_user():
    """Test de connexion avec un utilisateur client"""
    print("\n🔍 Test de connexion avec utilisateur client...")
    
    login_data = {
        "email": "client@example.com",
        "password": "client123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/token/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion client réussie!")
            
            if 'user' in data:
                user = data['user']
                print(f"Utilisateur: {user.get('firstName', '')} {user.get('lastName', '')}")
                print(f"Email: {user.get('email', '')}")
                print(f"Type: {user.get('user_type', '')}")
            else:
                print("❌ Données utilisateur manquantes dans la réponse")
                
        elif response.status_code == 401:
            print("❌ Erreur d'authentification")
            print(f"Réponse: {response.text}")
        else:
            print(f"❌ Erreur inattendue: {response.status_code}")
            print(f"Réponse: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connexion refusée (serveur non démarré)")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🚀 Test de connexion avec utilisateurs valides")
    print("=" * 60)
    
    test_login_with_valid_user()
    test_login_with_client_user()
    
    print("\n✅ Tests terminés") 