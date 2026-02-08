
import React, { useState } from 'react';

interface MasterLoginViewProps {
  onSuccess: () => void;
}

const MasterLoginView: React.FC<MasterLoginViewProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem('master_password');
    if (password === saved) {
      onSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
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
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
        >
          Desbloquear
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => {
            if(confirm("Isso apagará sua senha mestre e todos os dados. Continuar?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Redefinir aplicativo
        </button>
      </div>
    </div>
  );
};

export default MasterLoginView;
