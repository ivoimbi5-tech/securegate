
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import SetupView from './components/SetupView';
import MasterLoginView from './components/MasterLoginView';
import EmailStorageView from './components/EmailStorageView';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './services/errorHandlers';

import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL_SETUP);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check if user has setup a master password in Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setAppState(AppState.MASTER_LOGIN);
          } else {
            setAppState(AppState.INITIAL_SETUP);
          }
        } catch (error) {
          console.error("Erro ao verificar usuário:", error);
          // If it's a permission error, it might be because the doc doesn't exist yet and rules are strict
          setAppState(AppState.INITIAL_SETUP);
        }
      } else {
        setIsUnlocked(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  const handleSetupComplete = async (password: string) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, path), {
        masterPassword: password,
        setupComplete: true
      });
      setAppState(AppState.MASTER_LOGIN);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleMasterLoginSuccess = () => {
    setIsUnlocked(true);
    setAppState(AppState.EMAIL_STORAGE);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setAppState(AppState.MASTER_LOGIN);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setAppState(AppState.MASTER_LOGIN);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-vault text-blue-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SecureVault</h1>
          <p className="text-gray-500 mb-8">Proteja suas credenciais na nuvem com criptografia mestre.</p>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          {appState === AppState.INITIAL_SETUP && (
            <SetupView onComplete={handleSetupComplete} />
          )}
          {appState === AppState.MASTER_LOGIN && (
            <MasterLoginView onSuccess={handleMasterLoginSuccess} />
          )}
          {appState === AppState.EMAIL_STORAGE && isUnlocked && (
            <EmailStorageView onLogout={handleLock} />
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400 flex flex-col gap-2">
          <p>&copy; 2024 SecureVault - Armazenamento de Credenciais Criptografado na Nuvem.</p>
          <button onClick={handleLogout} className="text-blue-500 hover:underline">Sair da conta Google</button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
