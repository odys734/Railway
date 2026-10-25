import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Sparkles, 
  Key, 
  Eye, 
  EyeOff, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Award,
  RotateCcw
} from 'lucide-react';
import { UserPreferences, Language, Theme } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const t = translations[preferences.language] || translations.en;

  const [apiKey, setApiKey] = useState<string>(preferences.apiKey || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMsg, setTestMsg] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetDoneMsg, setResetDoneMsg] = useState<string>('');

  const handleSaveApiKey = () => {
    onUpdatePreferences({ apiKey: apiKey.trim() });
    setTestMsg('API Key saved locally on this device.');
    setTimeout(() => setTestMsg(''), 3000);
  };

  const handleClearApiKey = () => {
    setApiKey('');
    onUpdatePreferences({ apiKey: '' });
    setTestStatus('idle');
    setTestMsg('API Key cleared from local device.');
    setTimeout(() => setTestMsg(''), 3000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMsg('Verifying Gemini 3.8 Flash connection...');
    const res = await ApiService.testConnection(apiKey);
    if (res.success) {
      setTestStatus('success');
      setTestMsg(`Verified! Latency: ${res.latencyMs || 350}ms. AI Engine is ready.`);
    } else {
      setTestStatus('failed');
      setTestMsg(res.message || 'Connection failed.');
    }
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    setShowResetConfirm(false);
    setResetDoneMsg(t.settings.resetDone);
    setTimeout(() => setResetDoneMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          {t.settings.title}
        </h2>
        <p className="text-xs text-slate-400">
          Personalize language, appearance, and AI provider credentials
        </p>
      </div>

      {resetDoneMsg && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-medium">
          {resetDoneMsg}
        </div>
      )}

      {/* Language Section */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-cyan-400" />
          {t.settings.language}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'hi', label: 'हिन्दी', desc: 'Devanagari standard' },
            { id: 'en', label: 'English', desc: 'English interface & tests' },
            { id: 'hinglish', label: 'Hinglish', desc: 'Roman Hindi + English' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => onUpdatePreferences({ language: l.id as Language })}
              className={`p-3.5 rounded-xl border text-left transition ${
                preferences.language === l.id
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">{l.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-cyan-400" />
          {t.settings.theme}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'dark', label: t.settings.darkTheme, icon: Moon },
            { id: 'light', label: t.settings.lightTheme, icon: Sun },
            { id: 'system', label: t.settings.systemTheme, icon: RotateCcw },
          ].map((th) => {
            const Icon = th.icon;
            return (
              <button
                key={th.id}
                onClick={() => onUpdatePreferences({ theme: th.id as Theme })}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  preferences.theme === th.id
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold">{th.label}</span>
                </div>
                {preferences.theme === th.id && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Provider & API Key Section */}
      <div className="bg-[#0A1128] border border-cyan-900/40 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            {t.settings.aiProvider}
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Model: gemini-3.8-flash
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.settings.apiKey}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use server-side credentials)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {t.settings.apiKeyHint}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSaveApiKey}
              className="py-1.5 px-3.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
            >
              Save Key
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {testStatus === 'testing' ? t.settings.testing : t.settings.testConnection}
            </button>

            {apiKey && (
              <button
                onClick={handleClearApiKey}
                className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-900/60 transition"
              >
                {t.settings.clearKey}
              </button>
            )}
          </div>

          {testMsg && (
            <div className={`p-2.5 rounded-xl text-xs font-mono ${
              testStatus === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : testStatus === 'failed'
                ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
                : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}>
              {testMsg}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-[#0A1128] border border-rose-950/60 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" />
          {t.settings.resetData}
        </h3>

        <p className="text-xs text-slate-400">
          Clear all saved mock exams, practice results, and bookmarks. This action cannot be undone.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
          >
            {t.settings.resetData}
          </button>
        ) : (
          <div className="p-3 bg-rose-950/90 border border-rose-700 rounded-xl space-y-2">
            <p className="text-xs font-bold text-white">
              {t.settings.resetConfirm}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetData}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Yes, Delete All My Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About App & Credits */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3 text-center text-xs text-slate-400">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center p-2 shadow-inner">
          <img src="/train-logo.svg" alt="App Logo" className="w-8 h-8 object-contain" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-white">Railway Prep AI</h4>
          <p className="text-cyan-400 font-semibold text-xs mt-0.5">Made by Daman</p>
          <p className="text-[11px] text-slate-500 mt-1">Application ID: com.daman.railwayprep • Version 1.0.0</p>
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
          Dedicated to every railway exam aspirant striving to crack RRB NTPC Under-Graduate & Graduate posts.
        </p>
      </div>
    </div>
  );
};
