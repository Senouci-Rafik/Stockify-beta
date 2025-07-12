import { Plus, Trash2 } from "lucide-react";
import { Field, FieldArray, FieldInputProps } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductSelector } from "@/components/orders/ProductSelector";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { OrderItem, Product } from "@/types/order";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";

interface ProductsSectionProps {
  items: OrderItem[];
  products: Product[];
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
}

export const ProductsSection = ({ 
  items, 
  products, 
  setFieldValue, 
  errors, 
  touched 
}: ProductsSectionProps) => {
  const { formatAmount } = useOrderCalculations();

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Produits</h2>
        <FieldArray name="items">
          {({ push }) => (
            <Button
              type="button"
              onClick={() =>
                push({
                  productId: "",
                  productName: "",
                  quantity: 1,
                  unitPrice: 0,
                  total: 0,
                })
              }
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          )}
        </FieldArray>
      </div>

      <FieldArray name="items">
        {({ remove }) => (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit *</TableHead>
                <TableHead className="w-24">Quantité</TableHead>
                <TableHead className="w-32">Prix unitaire</TableHead>
                <TableHead className="w-32">Total</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <ProductSelector
                      products={products}
                      value={item.productId}
                      onChange={(productId, productName, price) => {
                        setFieldValue(`items.${index}.productId`, productId);
                        setFieldValue(`items.${index}.productName`, productName);
                        setFieldValue(`items.${index}.unitPrice`, price);
                        setFieldValue(`items.${index}.total`, item.quantity * price);
                      }}
                      error={
                        touched.items?.[index] && 
                        errors.items?.[index] && 
                        typeof errors.items[index] === 'object' && 
                        'productId' in errors.items[index] 
                          ? (errors.items[index] as any).productId 
                          : undefined
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Field name={`items.${index}.quantity`}>
                      {({ field }: { field: FieldInputProps<number> }) => (
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            setFieldValue(`items.${index}.quantity`, quantity);
                            setFieldValue(`items.${index}.total`, quantity * item.unitPrice);
                          }}
                        />
                      )}
                    </Field>
                  </TableCell>
                  <TableCell>
                    <Field name={`items.${index}.unitPrice`}>
                      {({ field }: { field: FieldInputProps<number> }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => {
                            const price = parseFloat(e.target.value) || 0;
                            setFieldValue(`items.${index}.unitPrice`, price);
                            setFieldValue(`items.${index}.total`, item.quantity * price);
                          }}
                          placeholder="0.00"
                        />
                      )}
                    </Field>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatAmount(item.total)}</span>
                  </TableCell>
                  <TableCell>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </FieldArray>

      <OrderSummary items={items} />
    </div>
  );
};
