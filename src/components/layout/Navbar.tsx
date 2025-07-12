import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Menu, User, UserCog, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Navigate to auth page after logout
  };

  // Check if the logged-in user is a director
  const isDirecteur = user?.role === 'employee'; // Assuming 'employee' role represents the director

  return (
    <header className="bg-background border-b border-border h-16 flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4 w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu size={20} />
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? `Bonjour, ${user.firstName || user.email}` : "Mon Compte"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isDirecteur && (
                <DropdownMenuItem onClick={() => navigate('/directeur/profile')}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Profil Directeur</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
