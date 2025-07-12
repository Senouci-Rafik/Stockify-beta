
import { OrderItem } from "@/types/order";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";

interface OrderSummaryProps {
  items: OrderItem[];
}

export const OrderSummary = ({ items }: OrderSummaryProps) => {
  const { formatAmount, calculateSubtotal, calculateTVA, calculateTotal } = useOrderCalculations();

  const subtotal = calculateSubtotal(items);

  return (
    <div className="mt-6 flex justify-end">
      <div className="w-80 space-y-2">
        <div className="flex justify-between">
          <span>Sous-total:</span>
          <span>{formatAmount(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>TVA (20%):</span>
          <span>{formatAmount(calculateTVA(subtotal))}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>{formatAmount(calculateTotal(subtotal))}</span>
        </div>
      </div>
    </div>
  );
};
