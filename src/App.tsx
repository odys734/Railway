import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

import { 
  UserPreferences, 
  Question, 
  MockExamResult, 
  Language 
} from './types';
import { translations } from './i18n/translations';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { PracticeView } from './components/PracticeView';
import { MockExamView } from './components/MockExamView';
import { ExamResultView } from './components/ExamResultView';
import { AiTutorView } from './components/AiTutorView';
import { HubView } from './components/HubView';
import { AndroidFrame } from './components/AndroidFrame';

export function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return StorageService.getPreferences();
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeExamType, setActiveExamType] = useState<'full' | 'quick'>('full');
  const [activeExamResult, setActiveExamResult] = useState<MockExamResult | null>(null);
  const [contextQuestion, setContextQuestion] = useState<Question | null>(null);
  const [hubSubTab, setHubSubTab] = useState<'reference' | 'analytics' | 'bookmarks' | 'incorrect' | 'settings'>('reference');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const t = translations[preferences.language] || translations.en;

  // Verify API connectivity
  useEffect(() => {
    ApiService.testConnection().then((res) => {
      setApiConnected(res.success);
    });
  }, [preferences.apiKey]);

  // Apply dark/light theme
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [preferences.theme]);

  // Handle Capacitor native Android features (Status Bar & Hardware Back Button)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#070D1E' });
      } catch (e) {
        // Safe fallback in web view
      }

      const backListener = CapApp.addListener('backButton', () => {
        if (activeExamResult) {
          setActiveExamResult(null);
          setActiveTab('home');
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          CapApp.exitApp();
        }
      });

      return () => {
        backListener.then(l => l.remove());
      };
    }
  }, [activeTab, activeExamResult]);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const saved = StorageService.savePreferences(updated);
    setPreferences(saved);
  };

  const handleNavigate = (tab: string, meta?: any) => {
    if (tab === 'mockTest') {
      setActiveExamType(meta?.type || 'full');
      setActiveExamResult(null);
    }
    if (tab === 'hub' && meta?.defaultTab) {
      setHubSubTab(meta.defaultTab);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToTutor = (question: Question) => {
    setContextQuestion(question);
    setActiveTab('aiTutor');
  };

  const isExamActive = activeTab === 'mockTest' && !activeExamResult;

  return (
    <AndroidFrame>
      <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Upper Navigation Bar */}
        <Header
          preferences={preferences}
          onLanguageChange={(lang: Language) => handleUpdatePreferences({ language: lang })}
          onOpenSettings={() => handleNavigate('hub', { defaultTab: 'settings' })}
          onNavigateTab={handleNavigate}
          activeTab={activeTab}
          apiConnected={apiConnected}
        />

        {/* Main Content Area with safe bottom padding */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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

          {activeTab === 'hub' && (
            <HubView
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onSendToTutor={handleSendToTutor}
              defaultSubTab={hubSubTab}
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

        {/* Fixed Mobile Bottom Navigation Bar (Hidden during live CBT exam) */}
        {!isExamActive && (
          <BottomNav
            activeTab={activeTab}
            onNavigate={handleNavigate}
            language={preferences.language}
          />
        )}
      </div>
    </AndroidFrame>
  );
}

export default App;
