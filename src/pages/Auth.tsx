import React, { useState } from 'react';
import { LoginSelection } from '@/components/auth/LoginSelection';
import { ClientLoginForm } from '@/components/auth/ClientLoginForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { DirectorOnlyLoginForm } from '@/components/auth/DirectorOnlyLoginForm';

type AuthView = 'selection' | 'client' | 'director';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('selection');

  const handleSelectClient = () => setCurrentView('client');
  const handleSelectDirector = () => setCurrentView('director');
  const handleBackToSelection = () => setCurrentView('selection');

  switch (currentView) {
    case 'client':
      return <ClientLoginForm onBackToSelection={handleBackToSelection} />;
    case 'director':
      return <DirectorOnlyLoginForm onBackToSelection={handleBackToSelection} />;
    default:
      return <LoginSelection onSelectClient={handleSelectClient} onSelectDirector={handleSelectDirector} />;
  }
}; 