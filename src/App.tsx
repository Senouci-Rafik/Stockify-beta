import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthPage } from "@/pages/Auth";
import { useAuth } from "@/contexts/AuthContext";

// Director Pages
import DirecteurDashboardIndex from "@/pages/director/dashboard/Index";
import Stock from "@/pages/director/dashboard/Stock";
import Settings from "@/pages/director/dashboard/Settings";
import Products from "@/pages/director/produits/Products";
import ProductAdd from "@/pages/director/produits/ProductAdd";
import Orders from "@/pages/director/commandes/Orders";
import OrderAdd from "@/pages/director/commandes/OrderAdd";
import Invoices from "@/pages/director/factures/Invoices";
import InvoiceAdd from "@/pages/director/factures/InvoiceAdd";
import Users from "@/pages/director/utilisateurs/Users";
import UserAdd from "@/pages/director/utilisateurs/UserAdd";
import NotFound from "@/pages/director/NotFound";
import Profile from "@/pages/director/Profile";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si l'utilisateur est un 'director', toujours rediriger vers '/admin'
  if (user.user_type === 'director' && !window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  // Vérifier si le rôle de l'utilisateur est autorisé pour cette route spécifique
  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["client_particulier", "client_interne"]}>
                <div>Client Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professional"
            element={
              <ProtectedRoute allowedRoles={["client_particulier", "client_interne", "director"]}>
                <div>Professional Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Director Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["director"]}><Outlet /></ProtectedRoute>}>
            <Route index element={<DirecteurDashboardIndex />} /> {/* /admin */}
            <Route path="dashboard" element={<DirecteurDashboardIndex />} />
            <Route path="dashboard/stock" element={<Stock />} />
            <Route path="dashboard/settings" element={<Settings />} />
            <Route path="produits" element={<Products />} />
            <Route path="produits/add" element={<ProductAdd />} />
            <Route path="commandes" element={<Orders />} />
            <Route path="commandes/add" element={<OrderAdd />} />
            <Route path="factures" element={<Invoices />} />
            <Route path="factures/add" element={<InvoiceAdd />} />
            <Route path="utilisateurs" element={<Users />} />
            <Route path="utilisateurs/add" element={<UserAdd />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} /> {/* Catch all for director's area */}
          </Route>
        </Route>
        {/* Route attrape-tout pour les chemins non gérés */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
