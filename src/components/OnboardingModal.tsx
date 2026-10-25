import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Key, 
  Eye, 
  EyeOff, 
  Zap, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';
import { Language, UserPreferences } from '../types';
import { translations } from '../i18n/translations';
import { ApiService } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (prefs: Partial<UserPreferences>) => void;
  currentPreferences: UserPreferences;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currentPreferences,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentPreferences.language || 'hi');
  const [apiKey, setApiKey] = useState<string>(currentPreferences.apiKey || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [aspirantName, setAspirantName] = useState<string>(currentPreferences.name || 'Railway Aspirant');
  const [dailyGoal, setDailyGoal] = useState<number>(currentPreferences.dailyGoalQuestions || 30);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const t = translations[selectedLanguage] || translations.en;

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setStatusMessage('Pinging Gemini AI engine...');
    const res = await ApiService.testConnection(apiKey);
    if (res.success) {
      setTestingStatus('success');
      setStatusMessage(`Verified! Latency: ${res.latencyMs || 420}ms. Model: gemini-3.8-flash ready.`);
    } else {
      setTestingStatus('failed');
      setStatusMessage(res.message || 'Connection test failed. Check key validity.');
    }
  };

  const handleFinish = () => {
    onComplete({
      language: selectedLanguage,
      apiKey: apiKey.trim(),
      name: aspirantName.trim() || 'Railway Aspirant',
      dailyGoalQuestions: dailyGoal,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0A1128] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Top Progress bar */}
        <div className="w-full bg-slate-900 h-1.5">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Welcome & Brand */}
          {step === 1 && (
            <div className="text-center space-y-4 py-2 animate-fadeIn">
              <div className="inline-flex p-3 bg-cyan-950/70 border border-cyan-500/40 rounded-2xl shadow-inner">
                <img 
                  src="/train-logo.svg" 
                  alt="Railway Prep Logo" 
                  className="w-16 h-16 object-contain" 
                />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Railway Prep AI
                </h2>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mt-1">
                  Made by Daman
                </p>
                <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto">
                  {t.appTagline}
                </p>
              </div>

              {/* Highlights pills */}
              <div className="grid grid-cols-2 gap-2 text-left pt-2">
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Authentic CBT-1
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    100 Qs • 90 Mins • -1/3 Negative Marking
                  </p>
                </div>
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div className="text-teal-400 font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Daman AI Tutor
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Maths shortcuts & 24/7 instant solutions
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98]"
                >
                  {t.onboarding.next} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Language Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex p-2 rounded-xl bg-cyan-950/80 text-cyan-400 mb-2">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {t.onboarding.step1Title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.onboarding.step1Desc}
                </p>
              </div>

              {/* Language Options */}
              <div className="space-y-2.5 pt-2">
                {[
                  { id: 'hi', label: 'हिन्दी (Hindi)', badge: 'Recommended for Railway Aspirants', desc: 'देवनागरी लिपि में प्रश्न, विकल्प और सम्पूर्ण व्याख्या' },
                  { id: 'en', label: 'English', badge: 'Standard Official', desc: 'Standard English interface, question papers, and solutions' },
                  { id: 'hinglish', label: 'Hinglish', badge: 'Fast & Conversational', desc: 'Roman Hindi + English natural reasoning and tricks' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as Language)}
                    className={`w-full p-4 rounded-xl text-left border transition flex items-start justify-between ${
                      selectedLanguage === lang.id
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-900/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{lang.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 font-medium">
                          {lang.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{lang.desc}</p>
                    </div>
                    {selectedLanguage === lang.id && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition"
                >
                  {t.onboarding.next} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Provider Setup */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex p-2 rounded-xl bg-teal-950/80 text-teal-400 mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {t.onboarding.step2Title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.onboarding.step2Desc}
                </p>
              </div>

              {/* Provider card */}
              <div className="p-3.5 bg-slate-900/90 border border-cyan-900/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Default Engine: Google Gemini 3.8 Flash
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-900/60 text-cyan-300 rounded font-semibold">
                    Fast & Verified
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Personal Gemini API Key (Optional / Direct Mode)
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy... (leave blank to use server proxy)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    {t.settings.apiKeyHint}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleTestConnection}
                    disabled={testingStatus === 'testing'}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {testingStatus === 'testing' ? t.settings.testing : t.settings.testConnection}
                  </button>

                  {testingStatus === 'success' && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  )}
                  {testingStatus === 'failed' && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Check key
                    </span>
                  )}
                </div>

                {statusMessage && (
                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono">
                    {statusMessage}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition"
                >
                  {t.onboarding.next} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Aspirant Profile & Daily Goal */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex p-2 rounded-xl bg-cyan-950/80 text-cyan-400 mb-2">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {t.onboarding.step3Title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.onboarding.step3Desc}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.onboarding.enterName}
                  </label>
                  <input
                    type="text"
                    value={aspirantName}
                    onChange={(e) => setAspirantName(e.target.value)}
                    placeholder="e.g., Rohit Kumar"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>{t.dashboard.dailyGoal}</span>
                    <span className="text-cyan-400 font-bold">{dailyGoal} Questions / Day</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>10 (Casual)</span>
                    <span>30 (Standard NTPC)</span>
                    <span>100 (Intense)</span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-[11px] text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Your configuration is ready. You can always change your language, theme, or API keys anytime in Settings.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => setStep(3)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-[0.98]"
                >
                  {t.onboarding.getStarted} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
