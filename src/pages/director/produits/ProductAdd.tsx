import React from 'react';
import { ProductForm } from './ProductForm';

export default function ProductAdd() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nouveau Produit</h1>
        <ProductForm />
      </div>
    </div>
  );
}
