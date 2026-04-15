
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface MasterLoginViewProps {
  onSuccess: () => void;
}

const MasterLoginView: React.FC<MasterLoginViewProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const savedPassword = userDoc.data().masterPassword;
        if (password === savedPassword) {
          onSuccess();
        } else {
          setError('Senha incorreta. Tente novamente.');
          setPassword('');
        }
      } else {
        setError('Configuração não encontrada. Por favor, reinicie o app.');
      }
    } catch (err) {
      console.error("Erro ao verificar senha mestre:", err);
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-lock text-indigo-600 text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Cofre de Acesso</h2>
        <p className="text-gray-500 mt-2">Insira sua senha mestre para continuar.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha Mestre</label>
          <input
            autoFocus
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Desbloquear'}
        </button>
      </form>
    </div>
  );
};

export default MasterLoginView;
