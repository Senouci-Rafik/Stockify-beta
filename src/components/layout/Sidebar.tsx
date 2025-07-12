import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Home, label: 'Tableau de bord', path: '/admin' },
  { icon: Package, label: 'Produits', path: '/admin/produits' },
  { icon: ShoppingCart, label: 'Commandes', path: '/admin/commandes' },
  { icon: FileText, label: 'Factures', path: '/admin/factures' },
  { icon: User, label: 'Utilisateurs', path: '/admin/utilisateurs' },
  { icon: Settings, label: 'Paramètres', path: '/admin/dashboard/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-enap-primary text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
      isOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 lg:w-64"
    )}>
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h1 className="text-xl font-bold">Stockify</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 lg:block">
        <h1 className="text-xl font-bold">Stockify</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? 'bg-enap-secondary text-white'
                    : 'hover:bg-enap-secondary/30 text-gray-300'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-enap-secondary/30">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
