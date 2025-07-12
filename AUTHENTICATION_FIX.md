# Correction du Problème d'Authentification - Stockify

## Problème Identifié

Lors de l'actualisation des pages, les utilisateurs étaient redirigés vers la page d'authentification, indiquant un problème avec la gestion des tokens JWT côté frontend.

## Causes du Problème

1. **Conflit entre deux systèmes d'authentification** : `AuthContext` et `useAuth` hook
2. **Pas de vérification automatique du token** lors de l'actualisation
3. **Endpoints incohérents** entre le frontend et le backend
4. **Gestion du refresh token** incomplète
5. **Manque d'endpoint de logout** dans le backend

## Solutions Implémentées

### 1. Unification du Système d'Authentification

- **Supprimé** le hook `useAuth.ts` redondant
- **Amélioré** le `AuthContext` pour gérer toute l'authentification
- **Ajouté** une fonction `checkAuth()` pour vérifier et renouveler automatiquement les tokens

### 2. Gestion Automatique des Tokens

```typescript
// Dans AuthContext.tsx
const checkAuth = async () => {
  const storedToken = localStorage.getItem('token');
  const storedRefreshToken = localStorage.getItem('refreshToken');
  
  if (!storedToken) {
    setUser(null);
    setToken(null);
    setIsLoading(false);
    return;
  }

  try {
    // Vérifier si le token actuel est valide
    const response = await axios.get('http://localhost:8000/api/users/profile/', {
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    });
    
    setUser(response.data);
    setToken(storedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    
  } catch (error: any) {
    // Si le token est expiré, essayer de le renouveler
    if (error.response?.status === 401 && storedRefreshToken) {
      try {
        const refreshResponse = await axios.post('http://localhost:8000/api/users/token/refresh/', {
          refresh: storedRefreshToken
        });
        
        const newToken = refreshResponse.data.access;
        localStorage.setItem('token', newToken);
        
        // Récupérer les informations utilisateur avec le nouveau token
        const userResponse = await axios.get('http://localhost:8000/api/users/profile/', {
          headers: {
            'Authorization': `Bearer ${newToken}`
          }
        });
        
        setUser(userResponse.data);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
      } catch (refreshError) {
        // Si le refresh échoue, nettoyer et rediriger vers login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Correction des Endpoints Backend

- **Ajouté** une vue `LogoutView` dans `users/views.py`
- **Ajouté** l'endpoint `/api/users/logout/` dans `users/urls.py`
- **Corrigé** les endpoints dans le service API frontend

### 4. Amélioration du Service API

```typescript
// Dans api.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        error.config.headers.Authorization = `Bearer ${access}`;
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

### 5. Composants de Test

- **Créé** `TestAuth.tsx` pour tester l'authentification
- **Créé** `TestPage.tsx` pour tester le système complet
- **Mis à jour** `LoginForm.tsx` pour utiliser le nouveau système

## Fonctionnalités Ajoutées

1. **Vérification automatique** de l'authentification au chargement de l'application
2. **Renouvellement automatique** des tokens expirés
3. **Gestion des erreurs** améliorée
4. **Nettoyage automatique** des données corrompues
5. **Redirection intelligente** basée sur le type d'utilisateur

## Comment Tester

1. **Démarrer le serveur Django** :
   ```bash
   cd enap_backend
   python manage.py runserver
   ```

2. **Démarrer le frontend** :
   ```bash
   cd frontend
   npm run dev
   ```

3. **Tester l'authentification** :
   - Aller sur la page de test
   - Se connecter avec un utilisateur valide
   - Actualiser la page pour vérifier la persistance
   - Utiliser le bouton "Rafraîchir l'authentification" pour tester manuellement

## Structure des Fichiers Modifiés

- `src/contexts/AuthContext.tsx` - Système d'authentification principal
- `src/services/api.ts` - Service API avec gestion des tokens
- `src/components/auth/ProtectedRoute.tsx` - Protection des routes
- `src/components/auth/LoginForm.tsx` - Formulaire de connexion
- `src/components/TestAuth.tsx` - Composant de test
- `src/pages/TestPage.tsx` - Page de test
- `enap_backend/users/views.py` - Vue de logout ajoutée
- `enap_backend/users/urls.py` - Endpoint de logout ajouté

## Résultat

Le problème d'actualisation est maintenant résolu. Les utilisateurs restent connectés après actualisation de la page grâce à :
- La vérification automatique des tokens
- Le renouvellement automatique des tokens expirés
- La gestion robuste des erreurs d'authentification 