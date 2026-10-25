import React from 'react';
import { 
  Home, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Compass
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate,
  language,
}) => {
  const t = translations[language] || translations.en;

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'practice', label: t.nav.practice, icon: BookOpen },
    { id: 'mockTest', label: 'CBT Mock', icon: Clock, isFeatured: true },
    { id: 'aiTutor', label: t.nav.aiTutor, icon: Sparkles },
    { id: 'hub', label: 'Hub & Docs', icon: Compass },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#070D1E]/95 backdrop-blur-2xl border-t border-slate-800/90 shadow-2xl select-none transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isFeatured) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group relative flex flex-col items-center justify-center -mt-5 min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-400 via-teal-400 to-cyan-300 text-slate-950 shadow-cyan-500/40 ring-2 ring-cyan-400/50'
                    : 'bg-gradient-to-tr from-[#0F1E46] to-[#0A1128] text-cyan-400 border border-cyan-500/40 shadow-cyan-950/60'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-slate-950 font-black' : 'text-cyan-400'}`} />
                </div>
                <span className={`text-[10px] tracking-tight leading-tight mt-1 font-bold ${
                  isActive ? 'text-cyan-300' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
                {!isActive && (
                  <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#070D1E] animate-pulse" />
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-full px-2 py-1 transition-all duration-150 active:scale-95 focus:outline-none ${
                isActive
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-1 ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-400 font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
