
import { OrderItem } from "@/types/order";

export const useOrderCalculations = () => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateSubtotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTVA = (subtotal: number) => {
    return subtotal * 0.20;
  };

  const calculateTotal = (subtotal: number) => {
    return subtotal + calculateTVA(subtotal);
  };

  return {
    formatAmount,
    calculateSubtotal,
    calculateTVA,
    calculateTotal,
  };
};
