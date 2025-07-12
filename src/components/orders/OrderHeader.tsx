
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrderHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Nouvelle commande</h1>
        <p className="text-gray-600 mt-2">
          Créez une nouvelle commande pour vos clients
        </p>
      </div>
    </div>
  );
};
