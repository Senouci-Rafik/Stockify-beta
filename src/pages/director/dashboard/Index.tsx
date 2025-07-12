import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Package, Users, ShoppingCart, DollarSign, AlertCircle, TrendingDown, Clock, Home, Box, TrendingUp, TrendingDown as TrendingDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DirecteurDashboard = () => {
  // Dummy data for demonstration
  const stats = [
    { title: "Total Produits", value: "324", icon: Package, description: "" },
    { title: "Utilisateurs", value: "158", icon: Users, description: "42 clients entreprises, 116 individuels" },
    { title: "Commandes Mensuelles", value: "78", icon: ShoppingCart, description: "+12.5% vs dernier mois", trend: "up" },
    { title: "Ventes Mensuelles", value: "1.2M DA", icon: DollarSign, description: "+8.2% vs dernier mois", trend: "up" },
  ];

  const alerts = [
    { title: "Produits Expirés", value: "12", icon: AlertCircle, description: "Nécessite une action immédiate", type: "critical" },
    { title: "Produits Bientôt Expirés", value: "28", icon: Clock, description: "Expiration dans 30 jours", type: "warning" },
    { title: "Stocks Faibles", value: "15", icon: TrendingDown, description: "Sous le seuil minimum", type: "warning" },
  ];

  const recentActivities = [
    { action: "Commande créée", description: "Nouvelle commande #ENP-2023-04-16-001", user: "client.entreprise@enap.dz", datetime: "16/04/2023\n14:32", status: "Complété" },
    { action: "Stock mis à jour", description: "Produit B11001 mis à jour (Qté +50)", user: "magasinier.principal@enap.dz", datetime: "16/04/2023\n11:15", status: "Complété" },
    { action: "Facture payée", description: "Paiement reçu pour la facture #F-2023-156", user: "finances.responsable@enap.dz", datetime: "15/04/2023\n16:45", status: "Complété" },
  ];

  const stockDistribution = [
    { label: "Bâtiment", percentage: 45 },
    { label: "Carrosserie", percentage: 30 },
    { label: "Industrie", percentage: 15 },
    { label: "Autres", percentage: 10 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        {/* Optionally add a user dropdown or notifications here */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon && <stat.icon className="h-4 w-4 text-blue-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.description && (
                <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert, index) => (
          <Card key={index} className={alert.type === "critical" ? "border-red-500" : alert.type === "warning" ? "border-orange-500" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
              {alert.icon && <alert.icon className={`h-4 w-4 ${alert.type === "critical" ? "text-red-600" : alert.type === "warning" ? "text-orange-600" : "text-gray-600"}`} />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alert.value}</div>
              <p className="text-xs text-gray-600">
                {alert.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-2 pr-4">ACTION</th>
                    <th className="pb-2 pr-4">DESCRIPTION</th>
                    <th className="pb-2 pr-4">UTILISATEUR</th>
                    <th className="pb-2 pr-4">HORODATAGE</th>
                    <th className="pb-2">STATUT</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2 pr-4 font-medium">{activity.action}</td>
                      <td className="py-2 pr-4 text-gray-600">{activity.description}</td>
                      <td className="py-2 pr-4 text-gray-600">{activity.user}</td>
                      <td className="py-2 pr-4 text-gray-600 whitespace-pre-wrap">{activity.datetime}</td>
                      <td className="py-2">
                        <Badge className="bg-green-600 text-white hover:bg-green-700">
                          {activity.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition du Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-24 text-sm text-gray-600">{item.label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-700 h-2.5 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirecteurDashboard; 