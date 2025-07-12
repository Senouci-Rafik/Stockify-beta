import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Calendar, Euro, Filter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data pour les factures
const mockInvoices = [
  {
    id: 1,
    number: "FAC-2024-001",
    client: "Entreprise ABC",
    date: "2024-01-15",
    amount: 1250.00,
    status: "paid",
    dueDate: "2024-02-15"
  },
  {
    id: 2,
    number: "FAC-2024-002", 
    client: "Société XYZ",
    date: "2024-01-20",
    amount: 875.50,
    status: "pending",
    dueDate: "2024-02-20"
  },
  {
    id: 3,
    number: "FAC-2024-003",
    client: "SARL Martin",
    date: "2024-01-25",
    amount: 2100.00,
    status: "overdue",
    dueDate: "2024-02-10"
  },
  {
    id: 4,
    number: "FAC-2024-004",
    client: "Startup Tech",
    date: "2024-02-01",
    amount: 650.00,
    status: "draft",
    dueDate: "2024-03-01"
  }
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Simulation d'une requête API
  const { data: invoices = mockInvoices, isLoading, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => Promise.resolve(mockInvoices),
    staleTime: 60000,
  });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des factures...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Factures</h1>
        <Button onClick={() => navigate("/admin/factures/add")} className="flex items-center gap-2">
          <Plus size={16} />
          Créer facture
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <div className="enap-card">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-lg">Chargement des factures...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total des factures</p>
                    <p className="text-2xl font-bold">{invoices.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Montant total</p>
                    <p className="text-2xl font-bold">
                      {formatAmount(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payées</p>
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter(inv => inv.status === 'paid').length}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En retard</p>
                    <p className="text-2xl font-bold text-red-600">
                      {invoices.filter(inv => inv.status === 'overdue').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par numéro ou client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(invoice.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucune facture trouvée</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoices;
