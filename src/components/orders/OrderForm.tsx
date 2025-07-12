import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "@/hooks/use-toast";
import { ClientSection } from "@/components/orders/ClientSection";
import { ProductsSection } from "@/components/orders/ProductsSection";
import { OrderActions } from "@/components/orders/OrderActions";
import { OrderFormValues, Client, Product } from "@/types/order";

interface OrderFormProps {
  clients: Client[];
  products: Product[];
}

const validationSchema = Yup.object({
  clientId: Yup.number().required("Veuillez sélectionner un client"),
  items: Yup.array().of(
    Yup.object({
      productId: Yup.mixed().required("Veuillez sélectionner un produit"),
      quantity: Yup.number().min(1, "La quantité doit être supérieure à 0").required("Quantité requise"),
      unitPrice: Yup.number().min(0, "Le prix doit être positif").required("Prix requis"),
    })
  ).min(1, "Au moins un produit est requis"),
});

export const OrderForm = ({ clients, products }: OrderFormProps) => {
  const navigate = useNavigate();

  const initialValues: OrderFormValues = {
    clientId: "",
    items: [
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Nouvelle commande:", values);
        
        toast({
          title: "Succès",
          description: "La commande a été créée avec succès"
        });
        
        setSubmitting(false);
        navigate("/orders");
      }}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <ClientSection
            clients={clients}
            value={values.clientId}
            onChange={(clientId) => setFieldValue("clientId", clientId)}
            error={touched.clientId && errors.clientId ? String(errors.clientId) : undefined}
          />

          <ProductsSection
            items={values.items}
            products={products}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
          />

          <OrderActions isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};
