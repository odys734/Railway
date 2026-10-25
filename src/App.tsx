import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  Clock, 
  Sparkles, 
  BarChart2, 
  FileText, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { 
  UserPreferences, 
  Question, 
  MockExamResult, 
  Language, 
  Theme 
} from './types';
import { translations } from './i18n/translations';
import { StorageService, defaultPreferences } from './services/storage';
import { ApiService } from './services/api';

import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { PracticeView } from './components/PracticeView';
import { MockExamView } from './components/MockExamView';
import { ExamResultView } from './components/ExamResultView';
import { AiTutorView } from './components/AiTutorView';
import { OfficialNotificationView } from './components/OfficialNotificationView';
import { ProgressAnalyticsView } from './components/ProgressAnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AndroidFrame } from './components/AndroidFrame';

export function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return StorageService.getPreferences();
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeExamType, setActiveExamType] = useState<'full' | 'quick'>('full');
  const [activeExamResult, setActiveExamResult] = useState<MockExamResult | null>(null);
  const [contextQuestion, setContextQuestion] = useState<Question | null>(null);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'bookmarks' | 'incorrect'>('overview');

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const t = translations[preferences.language] || translations.en;

  // On mount, verify API health / connection status quietly
  useEffect(() => {
    ApiService.testConnection().then((res) => {
      setApiConnected(res.success);
    });
  }, [preferences.apiKey]);

  // Apply theme styling to document
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [preferences.theme]);

  // Update user preferences helper
  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const saved = StorageService.savePreferences(updated);
    setPreferences(saved);
  };

  // Navigation helper
  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'mockTest') {
      setActiveExamType(meta?.type || 'full');
      setActiveExamResult(null);
    }
    if (tab === 'analytics' && meta?.tab) {
      setAnalyticsSubTab(meta.tab);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transfer question context to AI Tutor
  const handleSendToTutor = (question: Question) => {
    setContextQuestion(question);
    setActiveTab('aiTutor');
  };

  return (
    <AndroidFrame enabled={isPhoneFrame}>
      <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top Header */}
        <Header
          preferences={preferences}
          onLanguageChange={(lang: Language) => handleUpdatePreferences({ language: lang })}
          onOpenSettings={() => setActiveTab('settings')}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          apiConnected={apiConnected}
        />

        {/* Main View Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
          {/* Active View Switcher */}
          {activeTab === 'home' && (
            <DashboardView
              preferences={preferences}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeView
              preferences={preferences}
              onSendToTutor={handleSendToTutor}
            />
          )}

          {activeTab === 'mockTest' && !activeExamResult && (
            <MockExamView
              preferences={preferences}
              examType={activeExamType}
              onFinishExam={(result) => setActiveExamResult(result)}
            />
          )}

          {activeTab === 'mockTest' && activeExamResult && (
            <ExamResultView
              result={activeExamResult}
              preferences={preferences}
              onRetake={() => {
                setActiveExamResult(null);
                handleNavigate('mockTest');
              }}
              onBackToDashboard={() => {
                setActiveExamResult(null);
                setActiveTab('home');
              }}
              onSendToTutor={handleSendToTutor}
            />
          )}

          {activeTab === 'aiTutor' && (
            <AiTutorView
              preferences={preferences}
              contextQuestion={contextQuestion}
              onClearContext={() => setContextQuestion(null)}
            />
          )}

          {activeTab === 'reference' && (
            <OfficialNotificationView
              preferences={preferences}
            />
          )}

          {activeTab === 'analytics' && (
            <ProgressAnalyticsView
              preferences={preferences}
              onSendToTutor={handleSendToTutor}
              initialTab={analyticsSubTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
            />
          )}
        </main>

        {/* First-Launch Onboarding Modal */}
        <OnboardingModal
          isOpen={!preferences.hasCompletedOnboarding}
          currentPreferences={preferences}
          onComplete={(prefs) => {
            handleUpdatePreferences(prefs);
          }}
        />

        {/* Fixed Mobile Bottom Navigation Bar (Hidden during active CBT exam) */}
        {!(activeTab === 'mockTest' && !activeExamResult) && (
          <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0A1128]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 transition">
            <div className="max-w-md mx-auto flex items-center justify-around">
              {[
                { id: 'home', label: t.nav.home, icon: Home },
                { id: 'practice', label: t.nav.practice, icon: BookOpen },
                { id: 'mockTest', label: t.nav.mockTest, icon: Clock, highlight: true },
                { id: 'aiTutor', label: t.nav.aiTutor, icon: Sparkles },
                { id: 'reference', label: 'CEN 07/26', icon: FileText },
                { id: 'analytics', label: t.nav.analytics, icon: BarChart2 },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                      isActive
                        ? 'text-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                      {item.highlight && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </AndroidFrame>
  );
}

export default App;
