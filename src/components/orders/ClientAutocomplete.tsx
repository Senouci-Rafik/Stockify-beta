
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: number;
  name: string;
  email: string;
}

interface ClientAutocompleteProps {
  clients: Client[];
  value: string | number;
  onChange: (clientId: number) => void;
  error?: string;
}

export const ClientAutocomplete = ({ clients, value, onChange, error }: ClientAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedClient = clients.find(client => client.id === value);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (client: Client) => {
    onChange(client.id);
    setOpen(false);
    setSearchTerm("");
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
            {selectedClient ? selectedClient.name : "Sélectionner un client..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-60 overflow-auto">
              {filteredClients.length === 0 ? (
                <div className="py-2 px-3 text-sm text-gray-500">
                  Aucun client trouvé
                </div>
              ) : (
                filteredClients.map((client) => (
                  <Button
                    key={client.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start p-2 h-auto"
                    onClick={() => handleSelect(client)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="text-left">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
