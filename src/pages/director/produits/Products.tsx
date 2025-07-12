import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { productService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/product";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsList = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        if (process.env.NODE_ENV === 'development' && !window.location.hostname.includes('localhost:8000')) {
          console.log("Using mock data for products");
          return [
            {
              id: 1,
              reference: "REF001",
              name: "Produit A",
              category: "Catégorie X",
              unit: "U",
              quantity: 100,
              status: "in_stock",
              gamme: "batiment",
              famille: "Peinture à base d'huile de lin",
              couleur: "rouge",
              emballage: "seau-metallique"
            },
            {
              id: 2,
              reference: "REF002",
              name: "Produit B",
              category: "Catégorie Y",
              unit: "KG",
              quantity: 50,
              status: "low_stock",
              gamme: "aviation",
              famille: "Laque bicomposant",
              couleur: "bleu",
              emballage: "seau-plastique"
            },
            {
              id: 3,
              reference: "REF003",
              name: "Produit C",
              category: "Catégorie Z",
              unit: "L",
              quantity: 0,
              status: "out_of_stock",
              gamme: "carrosserie",
              famille: "Laque métallisée",
              couleur: "vert",
              emballage: "seau-metallique"
            },
          ] as Product[];
        } else {
          const response = await productService.getAll();
          return response.data;
        }
      } catch (error) {
        console.error("Error loading products:", error);
        throw error;
      }
    },
    staleTime: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du produit."
      });
    },
  });

  const handleDeleteProduct = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredProducts = productsList.filter(
    (product: Product) =>
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">En Stock</Badge>;
      case "low_stock":
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">Stock Faible</Badge>;
      case "out_of_stock":
        return <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Rupture de Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Button onClick={() => navigate("/admin/produits/add")} className="flex items-center gap-2">
          <Plus size={16} />
          Ajouter un Produit
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
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Erreur lors du chargement des produits</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.reference}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/products/edit/${product.id}`)}>
                            <Edit size={16} className="mr-2" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 focus:bg-red-50"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Products;
