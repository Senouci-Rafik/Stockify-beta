
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderForm } from "@/components/orders/OrderForm";

// Mock data pour les clients
const mockClients = [
  { id: 1, name: "Entreprise ABC", email: "contact@abc.com" },
  { id: 2, name: "Société XYZ", email: "info@xyz.com" },
  { id: 3, name: "SARL Martin", email: "martin@sarl.fr" },
  { id: 4, name: "Startup Tech", email: "tech@startup.fr" },
];

// Mock data pour les produits
const mockProducts = [
  { id: 1, name: "Produit A", price: 500.00 },
  { id: 2, name: "Produit B", price: 250.00 },
  { id: 3, name: "Service Premium", price: 875.50 },
  { id: 4, name: "Consultation", price: 300.00 },
  { id: 5, name: "Formation", price: 450.00 },
];

const OrderAdd = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <OrderHeader />
        <OrderForm clients={mockClients} products={mockProducts} />
      </div>
    </MainLayout>
  );
};

export default OrderAdd;
