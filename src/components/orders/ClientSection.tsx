
import { Label } from "@/components/ui/label";
import { ClientAutocomplete } from "@/components/orders/ClientAutocomplete";
import { Client } from "@/types/order";

interface ClientSectionProps {
  clients: Client[];
  value: string | number;
  onChange: (clientId: number) => void;
  error?: string;
}

export const ClientSection = ({ clients, value, onChange, error }: ClientSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h2 className="text-xl font-semibold mb-4">Informations client</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div>
          <Label htmlFor="clientId">Client *</Label>
          <ClientAutocomplete
            clients={clients}
            value={value}
            onChange={onChange}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
