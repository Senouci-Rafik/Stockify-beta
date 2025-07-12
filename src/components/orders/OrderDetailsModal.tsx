
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  clientName: string;
  clientEmail: string;
  date: string;
  totalAmount: number;
  status: string;
  products: Product[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsModal = ({ order, open, onOpenChange }: OrderDetailsModalProps) => {
  if (!order) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const subtotal = order.products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const tva = subtotal * 0.20;
  const total = subtotal + tva;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la commande #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Informations client</h3>
              <div>
                <p className="font-medium">{order.clientName}</p>
                <p className="text-gray-600">{order.clientEmail}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Informations commande</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Date:</span> {formatDate(order.date)}</p>
                <p><span className="font-medium">Statut:</span> {getStatusBadge(order.status)}</p>
                <p><span className="font-medium">Montant total:</span> {formatAmount(order.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Produits commandés</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">{formatAmount(product.price)}</TableCell>
                    <TableCell className="text-right">{formatAmount(product.quantity * product.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totaux */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{formatAmount(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%):</span>
                  <span>{formatAmount(tva)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatAmount(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
