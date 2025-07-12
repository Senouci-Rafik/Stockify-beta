import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DirectorProfileButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/directeur/profile')}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white"
    >
      <UserCog className="w-4 h-4" />
      Consulter le profil du directeur
    </Button>
  );
}; 