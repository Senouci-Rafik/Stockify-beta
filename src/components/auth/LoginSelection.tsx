import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Building2 } from 'lucide-react';

interface LoginSelectionProps {
  onSelectClient: () => void;
  onSelectDirector: () => void;
}

export const LoginSelection: React.FC<LoginSelectionProps> = ({ onSelectClient, onSelectDirector }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Manager</h1>
          <p className="text-gray-600">Choisissez votre type de connexion</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Login Option */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectClient}>
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Espace Client</CardTitle>
              <CardDescription>
                Accès pour les clients particuliers et points de vente
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Consultation du catalogue produits</li>
                <li>• Gestion des commandes</li>
                <li>• Suivi des livraisons</li>
                <li>• Accès aux factures</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Connexion Client
              </Button>
            </CardContent>
          </Card>

          {/* Director Login Option */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectDirector}>
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Espace Directeur</CardTitle>
              <CardDescription>
                Accès réservé aux employés directeurs
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Gestion complète du stock</li>
                <li>• Analyses et rapports</li>
                <li>• Configuration système</li>
                <li>• Administration générale</li>
              </ul>
              <Button className="w-full bg-slate-800 hover:bg-slate-900">
                Connexion Directeur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 