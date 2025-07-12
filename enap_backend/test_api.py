#!/usr/bin/env python
"""
Script de test pour vérifier que l'API fonctionne correctement.
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_cors():
    """Test CORS headers"""
    print("🔍 Test des en-têtes CORS...")
    
    # Test OPTIONS request (preflight)
    response = requests.options(f"{BASE_URL}/users/token/", 
                               headers={
                                   'Origin': 'http://localhost:3000',
                                   'Access-Control-Request-Method': 'POST',
                                   'Access-Control-Request-Headers': 'content-type'
                               })
    
    print(f"Status OPTIONS: {response.status_code}")
    print(f"Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
    print(f"Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods')}")
    print(f"Access-Control-Allow-Headers: {response.headers.get('Access-Control-Allow-Headers')}")
    
    return response.status_code == 200

def test_endpoints():
    """Test des endpoints principaux"""
    print("\n🔍 Test des endpoints...")
    
    endpoints = [
        "/users/token/",
        "/users/profile/",
        "/products/",
        "/auth/login/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"✅ {endpoint}: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint}: Connexion refusée (serveur non démarré)")
        except Exception as e:
            print(f"❌ {endpoint}: {e}")

def test_login_endpoint():
    """Test de l'endpoint de connexion"""
    print("\n🔍 Test de l'endpoint de connexion...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/token/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Endpoint de connexion accessible")
        elif response.status_code == 401:
            print("✅ Endpoint de connexion accessible (erreur d'authentification attendue)")
        else:
            print(f"❌ Erreur inattendue: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connexion refusée (serveur non démarré)")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🚀 Test de l'API Stockify")
    print("=" * 50)
    
    test_cors()
    test_endpoints()
    test_login_endpoint()
    
    print("\n✅ Tests terminés") 