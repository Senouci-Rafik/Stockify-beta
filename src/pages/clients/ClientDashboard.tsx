import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Tableau de bord Client</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte de bienvenue */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Bienvenue, {user?.firstName}!</h2>
              <p className="text-gray-600">
                Vous êtes connecté en tant que Client.
              </p>
            </div>

            {/* Actions rapides pour les clients */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Actions rapides</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Voir mes commandes
                </button>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Passer une nouvelle commande
                </button>
              </div>
            </div>

            {/* Historique des commandes (placeholder) */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Historique des commandes</h3>
              <p className="text-gray-600">Aucune commande récente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 