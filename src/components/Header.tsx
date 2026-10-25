import React from 'react';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  Globe, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Language, UserPreferences } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  preferences: UserPreferences;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: string) => void;
  activeTab: string;
  apiConnected: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onLanguageChange,
  onOpenSettings,
  onNavigateTab,
  activeTab,
  apiConnected,
}) => {
  const t = translations[preferences.language] || translations.en;

  const languages: { id: Language; label: string; short: string }[] = [
    { id: 'hi', label: 'हिन्दी', short: 'HI' },
    { id: 'en', label: 'English', short: 'EN' },
    { id: 'hinglish', label: 'Hinglish', short: 'HG' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070D1E]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark & Emblem */}
        <div 
          onClick={() => onNavigateTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0A1128] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img 
                src="/train-logo.svg" 
                alt="Railway Prep AI" 
                className="w-7 h-7 object-contain" 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Railway Prep AI
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 hidden sm:inline-block uppercase tracking-wider">
                NTPC CEN 07/2026
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="text-cyan-400 font-semibold">{t.madeBy}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 truncate max-w-[140px] sm:max-w-none">
                Exam Preparation
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links (hidden on mobile, shown on md+) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1 text-xs font-semibold">
          {[
            { id: 'home', label: t.nav.home },
            { id: 'practice', label: t.nav.practice },
            { id: 'mockTest', label: t.nav.mockTest },
            { id: 'aiTutor', label: t.nav.aiTutor },
            { id: 'hub', label: 'Reference & Analytics' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language Segmented Pill + AI status + Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Trilingual Segmented Pill */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden sm:inline-block" />
            <div className="flex items-center gap-0.5">
              {languages.map((lang) => {
                const isSelected = preferences.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onLanguageChange(lang.id)}
                    title={`Switch to ${lang.label}`}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="sm:hidden">{lang.short}</span>
                    <span className="hidden sm:inline">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Ready Indicator (Click opens Settings) */}
          <button
            onClick={onOpenSettings}
            title={apiConnected ? 'Gemini AI Ready' : 'Configure Gemini Key'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium hidden lg:inline">Gemini AI</span>
            <span 
              className={`w-2 h-2 rounded-full ${
                apiConnected === true ? 'bg-emerald-400' : 'bg-cyan-400'
              }`} 
            />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title={t.settings.title}
            className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
