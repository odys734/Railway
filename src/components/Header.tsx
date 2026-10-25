import React from 'react';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  Globe, 
  Smartphone, 
  Monitor, 
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, UserPreferences } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  preferences: UserPreferences;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  apiConnected: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onLanguageChange,
  onOpenSettings,
  isPhoneFrame,
  onTogglePhoneFrame,
  apiConnected,
}) => {
  const t = translations[preferences.language] || translations.en;

  return (
    <header className="sticky top-0 z-40 bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 flex-shrink-0">
            <div className="w-full h-full bg-[#0A1128] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img 
                src="/train-logo.svg" 
                alt="Railway Prep AI Logo" 
                className="w-7 h-7 object-contain" 
              />
            </div>
            {/* Online Spark */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0A1128] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 hidden sm:inline-block">
                CEN 07/2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="text-cyan-400 font-semibold">{t.madeBy}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">RRB NTPC & Group D</span>
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Connection status pill */}
          <button
            onClick={onOpenSettings}
            title="AI Engine Status"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[11px] font-medium text-slate-300">
              Gemini AI
            </span>
            {apiConnected === true ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="AI Ready" />
            ) : apiConnected === false ? (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Setup Key" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cyan-400" title="Connected" />
            )}
          </button>

          {/* Language selector */}
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            <select
              value={preferences.language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 font-medium py-1 px-1 pr-2 rounded focus:outline-none cursor-pointer"
            >
              <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hinglish" className="bg-slate-900 text-white">Hinglish</option>
            </select>
          </div>

          {/* Phone Frame Toggle (Desktop simulator vs Edge-to-edge) */}
          <button
            onClick={onTogglePhoneFrame}
            title={isPhoneFrame ? 'Switch to Full Web View' : 'Simulate Android Smartphone'}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-[11px]">Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline text-[11px]">Phone Frame</span>
              </>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={t.settings.title}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
