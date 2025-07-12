import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fonction pour vérifier et renouveler l'authentification
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
      } else {
        // Autre erreur, nettoyer
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/users/token/', {
        email,
        password,
      });

      const { access, refresh, user: userData } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(access);
      setUser(userData);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Redirection basée sur le rôle
      if (userData.user_type === 'director') {
        navigate('/admin');
      } else if (['industrial_client', 'retail_client', 'reseller_client'].includes(userData.user_type)) {
        navigate('/dashboard-client');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login page after logout
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 