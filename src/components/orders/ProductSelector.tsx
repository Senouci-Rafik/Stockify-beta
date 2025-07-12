
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductSelectorProps {
  products: Product[];
  value: string | number;
  onChange: (productId: number, productName: string, price: number) => void;
  error?: string;
}

export const ProductSelector = ({ products, value, onChange, error }: ProductSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find(product => product.id === value);

  const handleSelect = (product: Product) => {
    onChange(product.id, product.name, product.price);
    setOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-red-500"
            )}
          >
            {selectedProduct ? selectedProduct.name : "Sélectionner un produit..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="max-h-60 overflow-auto">
            {products.map((product) => (
              <Button
                key={product.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start p-3 h-auto"
                onClick={() => handleSelect(product)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="text-left flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500">{formatPrice(product.price)}</div>
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
