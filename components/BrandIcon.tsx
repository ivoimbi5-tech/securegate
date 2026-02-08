
import React from 'react';
import { EmailProvider } from '../types';

interface BrandIconProps {
  email: string;
  className?: string;
}

const BrandIcon: React.FC<BrandIconProps> = ({ email, className = "" }) => {
  const getProvider = (email: string): EmailProvider => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'generic';

    if (domain.includes('gmail') || domain.includes('googlemail')) return 'gmail';
    if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live') || domain.includes('msn')) return 'outlook';
    if (domain.includes('yahoo') || domain.includes('ymail')) return 'yahoo';
    if (domain.includes('icloud') || domain.includes('apple') || domain.includes('me.com')) return 'apple';
    if (domain.includes('proton')) return 'proton';
    
    return 'generic';
  };

  const provider = getProvider(email);

  const iconMap: Record<EmailProvider, { icon: string; color: string }> = {
    gmail: { icon: 'fa-brands fa-google', color: 'text-red-500' },
    outlook: { icon: 'fa-brands fa-microsoft', color: 'text-blue-600' },
    yahoo: { icon: 'fa-brands fa-yahoo', color: 'text-purple-600' },
    apple: { icon: 'fa-brands fa-apple', color: 'text-slate-800' },
    proton: { icon: 'fa-solid fa-shield-halved', color: 'text-indigo-600' },
    generic: { icon: 'fa-solid fa-envelope', color: 'text-gray-400' }
  };

  const { icon, color } = iconMap[provider];

  return (
    <div className={`transition-all duration-300 flex items-center justify-center ${className}`}>
      <i className={`${icon} ${color} text-2xl`}></i>
    </div>
  );
};

export default BrandIcon;
