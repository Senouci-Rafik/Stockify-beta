import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { TestAuth } from '@/components/TestAuth';
import { useAuth } from '@/contexts/AuthContext';

export const TestPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Page de Test - Authentification Stockify</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Formulaire de connexion</h2>
            <LoginForm />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Test d'authentification</h2>
            <TestAuth />
          </div>
        </div>
        
        {user && (
          <div className="mt-8 p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold text-green-800">Utilisateur connecté avec succès!</h3>
            <p className="text-green-700">Vous pouvez maintenant actualiser la page pour tester la persistance de l'authentification.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 