import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  Award, 
  Eye, 
  BookOpen, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { UserPreferences } from '../types';
import { translations } from '../i18n/translations';
import { cenNotificationData } from '../data/officialCenData';

interface OfficialNotificationViewProps {
  preferences: UserPreferences;
}

export const OfficialNotificationView: React.FC<OfficialNotificationViewProps> = ({
  preferences,
}) => {
  const t = translations[preferences.language] || translations.en;
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'pattern' | 'medical' | 'syllabus'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter syllabus or rules based on search
  const filteredSyllabus = useMemo(() => {
    if (!searchQuery.trim()) return cenNotificationData.syllabus;
    const query = searchQuery.toLowerCase();
    return cenNotificationData.syllabus.map(s => ({
      subject: s.subject,
      topics: s.topics.filter(top => top.toLowerCase().includes(query) || s.subject.toLowerCase().includes(query)),
    })).filter(s => s.topics.length > 0);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return cenNotificationData.posts;
    const q = searchQuery.toLowerCase();
    return cenNotificationData.posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.medicalStandard.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn select-none">
      {/* Official Header Card */}
      <div className="bg-[#0A1128] border border-cyan-900/50 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-widest inline-block">
              {cenNotificationData.notificationNumber}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {t.reference.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              {cenNotificationData.issuedBy}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Official Reference
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.reference.searchPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3 no-scrollbar">
          {[
            { id: 'overview', label: t.reference.tabOverview, icon: FileText },
            { id: 'posts', label: t.reference.tabPosts, icon: Award },
            { id: 'pattern', label: t.reference.tabPattern, icon: Clock },
            { id: 'medical', label: t.reference.tabMedical, icon: Eye },
            { id: 'syllabus', label: t.reference.tabSyllabus, icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & KEY TIMELINES */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Key Dates Grid */}
          <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {t.reference.importantDates}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {cenNotificationData.importantDates.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">{item.label}</div>
                  <div className="text-xs font-bold text-cyan-300">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Age Limits & Relaxations */}
          <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {t.reference.ageLimit}
            </h3>

            <p className="text-xs text-slate-300">
              Standard Age Criteria: <strong>18 to 33 Years</strong> (Prescribed reference date as per official Gazette).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {cenNotificationData.ageRelaxations.map((rel, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{rel.category}</span>
                  <span className="font-bold text-amber-400">{rel.relaxation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Stage Selection Process */}
          <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Comprehensive 4-Stage Selection Pipeline
            </h3>

            <div className="space-y-3">
              {cenNotificationData.selectionStages.map((stage, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{stage.stage} — {stage.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTS & VACANCIES */}
      {activeTab === 'posts' && (
        <div className="space-y-4 animate-fadeIn">
          {filteredPosts.map((post, idx) => (
            <div key={idx} className="p-5 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded font-semibold border border-cyan-800">
                      7th CPC Level {post.payLevel}
                    </span>
                    <span className="text-slate-400">Initial Pay: {post.initialPay}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 font-bold border border-purple-800">
                    Medical: {post.medicalStandard}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                    ~{post.approxVacancies} Vacancies
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed pt-1">
                {post.description}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-200 block mb-1">Minimum Educational Qualification:</span>
                <span className="text-slate-400">{post.minEduQualification}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: EXAM SCHEME (CBT-1 & CBT-2) */}
      {activeTab === 'pattern' && (
        <div className="space-y-5 animate-fadeIn">
          {/* CBT-1 Scheme */}
          <div className="bg-[#0A1128] border border-cyan-900/50 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                  Stage 1 Screening
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  1st Stage Computer Based Test (CBT-1)
                </h3>
              </div>
              <div className="text-xs text-cyan-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                Duration: {cenNotificationData.examPatternCbt1.duration}
              </div>
            </div>

            <p className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 font-medium">
              ⚠️ {cenNotificationData.examPatternCbt1.negativeMarking}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Subject</th>
                    <th className="p-3">No. of Questions</th>
                    <th className="p-3 rounded-r-xl">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {cenNotificationData.examPatternCbt1.subjects.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold">{s.name}</td>
                      <td className="p-3 text-cyan-400 font-bold">{s.questions}</td>
                      <td className="p-3 font-bold">{s.marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900/90 font-black text-white">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-cyan-400">100</td>
                    <td className="p-3">100 Marks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CBT-2 Scheme */}
          <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                  Stage 2 Merit
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  2nd Stage Computer Based Test (CBT-2)
                </h3>
              </div>
              <div className="text-xs text-slate-300 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                Duration: {cenNotificationData.examPatternCbt2.duration}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Subject</th>
                    <th className="p-3">No. of Questions</th>
                    <th className="p-3 rounded-r-xl">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {cenNotificationData.examPatternCbt2.subjects.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold">{s.name}</td>
                      <td className="p-3 text-purple-400 font-bold">{s.questions}</td>
                      <td className="p-3 font-bold">{s.marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900/90 font-black text-white">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-purple-400">120</td>
                    <td className="p-3">120 Marks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MEDICAL STANDARDS */}
      {activeTab === 'medical' && (
        <div className="space-y-4 animate-fadeIn">
          {cenNotificationData.medicalStandards.map((med, idx) => (
            <div key={idx} className="p-5 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Medical Standard Code: {med.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Posts: {med.applicablePosts.join(', ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 block">Distance Vision:</span>
                  <span className="text-cyan-300 font-medium">{med.distanceVision}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 block">Near Vision:</span>
                  <span className="text-cyan-300 font-medium">{med.nearVision}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs text-slate-300">
                <strong className="text-slate-200">Additional Tests: </strong> {med.otherTests}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SYLLABUS & SEARCH */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4 animate-fadeIn">
          {filteredSyllabus.map((subj, idx) => (
            <div key={idx} className="p-5 bg-[#0A1128] border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                {subj.subject}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {subj.topics.map((t, tIdx) => (
                  <div key={tIdx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
