import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Stock() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock</h1>
        <Button onClick={() => navigate('/products/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* TODO: Implement stock list */}
        <p className="p-6 text-center text-muted-foreground">
          Liste des produits en stock à implémenter
        </p>
      </div>
    </div>
  );
}
