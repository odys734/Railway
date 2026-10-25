import React, { useState } from 'react';
import { 
  FileText, 
  BarChart2, 
  Bookmark, 
  AlertTriangle, 
  Settings as SettingsIcon,
  Compass
} from 'lucide-react';
import { UserPreferences, Question } from '../types';
import { OfficialNotificationView } from './OfficialNotificationView';
import { ProgressAnalyticsView } from './ProgressAnalyticsView';
import { SettingsView } from './SettingsView';
import { StorageService } from '../services/storage';

interface HubViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onSendToTutor: (question: Question) => void;
  defaultSubTab?: 'reference' | 'analytics' | 'bookmarks' | 'incorrect' | 'settings';
}

export const HubView: React.FC<HubViewProps> = ({
  preferences,
  onUpdatePreferences,
  onSendToTutor,
  defaultSubTab = 'reference',
}) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'analytics' | 'bookmarks' | 'incorrect' | 'settings'>(defaultSubTab);

  const bookmarkedCount = StorageService.getBookmarkedIds().length;
  const incorrectCount = StorageService.getIncorrectQuestions().length;

  const tabs = [
    { id: 'reference', label: 'CEN 07/2026 Reference', icon: FileText },
    { id: 'analytics', label: 'Score Analytics', icon: BarChart2 },
    { id: 'bookmarks', label: `Saved (${bookmarkedCount})`, icon: Bookmark },
    { id: 'incorrect', label: `Revision (${incorrectCount})`, icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 pb-28 animate-fadeIn">
      {/* Hub Master Navigation Bar */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Preparation Hub & Resource Center
          </h2>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Section */}
      <div className="transition-all">
        {activeTab === 'reference' && (
          <OfficialNotificationView preferences={preferences} />
        )}

        {activeTab === 'analytics' && (
          <ProgressAnalyticsView 
            preferences={preferences} 
            onSendToTutor={onSendToTutor} 
            initialTab="overview" 
          />
        )}

        {activeTab === 'bookmarks' && (
          <ProgressAnalyticsView 
            preferences={preferences} 
            onSendToTutor={onSendToTutor} 
            initialTab="bookmarks" 
          />
        )}

        {activeTab === 'incorrect' && (
          <ProgressAnalyticsView 
            preferences={preferences} 
            onSendToTutor={onSendToTutor} 
            initialTab="incorrect" 
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            preferences={preferences} 
            onUpdatePreferences={onUpdatePreferences} 
          />
        )}
      </div>
    </div>
  );
};
