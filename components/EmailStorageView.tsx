
import React, { useState, useEffect } from 'react';
import BrandIcon from './BrandIcon';
import { getSecurityTip } from '../services/geminiService';
import { SecurityTip, StoredCredential } from '../types';

interface EmailStorageViewProps {
  onLogout: () => void;
}

const EmailStorageView: React.FC<EmailStorageViewProps> = ({ onLogout }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState<StoredCredential[]>([]);
  const [tip, setTip] = useState<SecurityTip | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('stored_credentials');
    if (saved) {
      try {
        setCredentials(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse credentials", e);
      }
    }
    fetchNewTip();
  }, []);

  const saveCredentials = (updated: StoredCredential[]) => {
    setCredentials(updated);
    localStorage.setItem('stored_credentials', JSON.stringify(updated));
  };

  const fetchNewTip = async () => {
    setIsLoadingTip(true);
    const newTip = await getSecurityTip();
    setTip(newTip);
    setIsLoadingTip(false);
  };

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    const newCredential: StoredCredential = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      createdAt: Date.now()
    };
    saveCredentials([newCredential, ...credentials]);
    setEmail('');
    setPassword('');
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      saveCredentials(credentials.filter(c => c.id !== id));
    }
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col max-h-[90vh]">
      <div className="bg-slate-900 p-6 flex justify-between items-center text-white sticky top-0 z-10">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <i className="fa-solid fa-vault text-blue-400"></i>
            Cofre de E-mails
          </h3>
          <p className="text-xs text-slate-400">{credentials.length} contas armazenadas</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onLogout}
            className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <i className="fa-solid fa-lock"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Form Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleAddCredential} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 flex justify-center">
                    <BrandIcon email={email} className="scale-75" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
            >
              <i className="fa-solid fa-plus"></i>
              Adicionar ao Cofre
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="p-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Minhas Contas</h4>
          
          {credentials.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <i className="fa-solid fa-folder-open text-4xl mb-3 text-gray-300"></i>
              <p className="text-sm text-gray-500">Nenhuma conta salva ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <BrandIcon email={cred.email} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{cred.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-mono text-gray-400">
                          {showPasswords[cred.id] ? cred.password : '••••••••'}
                        </p>
                        <button 
                          onClick={() => togglePassword(cred.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <i className={`fa-solid ${showPasswords[cred.id] ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(cred.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-4"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Tip Section */}
        <div className="p-6 pt-0">
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-black text-blue-600/50 uppercase tracking-[0.2em] flex items-center gap-2">
                <i className="fa-solid fa-shield-halved"></i>
                Consultor de Segurança
              </h4>
              <button 
                onClick={fetchNewTip}
                disabled={isLoadingTip}
                className="text-blue-500 hover:text-blue-700 text-[10px] font-bold uppercase"
              >
                {isLoadingTip ? 'Refinando...' : 'Nova Dica'}
              </button>
            </div>
            
            {tip ? (
              <div>
                <h5 className="font-bold text-blue-900 text-sm mb-1">{tip.title}</h5>
                <p className="text-blue-800 text-xs leading-relaxed opacity-80">{tip.content}</p>
              </div>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-blue-200/50 rounded w-1/2"></div>
                <div className="h-3 bg-blue-200/50 rounded w-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStorageView;
