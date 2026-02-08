
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import SetupView from './components/SetupView';
import MasterLoginView from './components/MasterLoginView';
import EmailStorageView from './components/EmailStorageView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL_SETUP);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const masterPassword = localStorage.getItem('master_password');
    if (masterPassword) {
      setAppState(AppState.MASTER_LOGIN);
    } else {
      setAppState(AppState.INITIAL_SETUP);
    }
    setLoading(false);
  }, []);

  const handleSetupComplete = (password: string) => {
    localStorage.setItem('master_password', password);
    setAppState(AppState.MASTER_LOGIN);
  };

  const handleMasterLoginSuccess = () => {
    setAppState(AppState.EMAIL_STORAGE);
  };

  const handleLogout = () => {
    setAppState(AppState.MASTER_LOGIN);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
        {appState === AppState.INITIAL_SETUP && (
          <SetupView onComplete={handleSetupComplete} />
        )}
        {appState === AppState.MASTER_LOGIN && (
          <MasterLoginView onSuccess={handleMasterLoginSuccess} />
        )}
        {appState === AppState.EMAIL_STORAGE && (
          <EmailStorageView onLogout={handleLogout} />
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>&copy; 2024 SecureVault - Armazenamento de Credenciais Criptografado Localmente.</p>
      </div>
    </div>
  );
};

export default App;
