import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const TestAuth: React.FC = () => {
  const { user, isLoading, error, checkAuth } = useAuth();

  const handleRefreshAuth = () => {
    checkAuth();
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Test d'authentification</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test d'authentification</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erreur: {error}
        </div>
      )}
      
      {user ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Utilisateur connecté:</h3>
          <p>Email: {user.email}</p>
          <p>Type: {user.user_type}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Aucun utilisateur connecté
        </div>
      )}
      
      <button
        onClick={handleRefreshAuth}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Rafraîchir l'authentification
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Token dans localStorage: {localStorage.getItem('token') ? 'Présent' : 'Absent'}</p>
        <p>Refresh Token: {localStorage.getItem('refreshToken') ? 'Présent' : 'Absent'}</p>
        <p>User dans localStorage: {localStorage.getItem('user') ? 'Présent' : 'Absent'}</p>
      </div>
    </div>
  );
}; 