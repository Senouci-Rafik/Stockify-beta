
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OrderActionsProps {
  isSubmitting: boolean;
}

export const OrderActions = ({ isSubmitting }: OrderActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate("/orders")}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Ajouter la commande"}
      </Button>
    </div>
  );
};
