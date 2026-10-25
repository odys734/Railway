import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  X, 
  BookOpen, 
  Lightbulb, 
  Globe
} from 'lucide-react';
import { Question, ChatMessage, UserPreferences, Language } from '../types';
import { translations } from '../i18n/translations';
import { ApiService } from '../services/api';

interface AiTutorViewProps {
  preferences: UserPreferences;
  contextQuestion: Question | null;
  onClearContext: () => void;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  preferences,
  contextQuestion,
  onClearContext,
}) => {
  const t = translations[preferences.language] || translations.en;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: t.tutor.welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<Language>(preferences.language);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (contextQuestion) {
      const introText = activeLang === 'hi'
        ? `नमस्ते! मैंने यह प्रश्न लोड कर लिया है:\n**विषय:** ${contextQuestion.subject} (${contextQuestion.topic})\n**प्रश्न:** "${contextQuestion.questionText}"\n\nआप इसके बारे में क्या समझना चाहते हैं? जैसे: शॉर्टकट ट्रिक, स्टेप-बाय-स्टेप हल, या अन्य विकल्पों का विश्लेषण?`
        : activeLang === 'hinglish'
        ? `Namaste! Maine ye question load kar liya hai:\n**Subject:** ${contextQuestion.subject} (${contextQuestion.topic})\n**Question:** "${contextQuestion.questionText}"\n\nAapko isme kya doubt hai? Shortcut trick chahiye ya step-by-step full solution?`
        : `Hello! I have loaded this question:\n**Subject:** ${contextQuestion.subject} (${contextQuestion.topic})\n**Question:** "${contextQuestion.questionText}"\n\nWhat would you like me to explain? I can provide the shortcut trick, step-by-step reasoning, or explain why each option is right/wrong.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ctx_${Date.now()}`,
          role: 'assistant',
          content: introText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          contextQuestion,
        },
      ]);
    }
  }, [contextQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setErrorMsg('');

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextQuestion: contextQuestion || undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const historyPayload = newMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await ApiService.sendTutorMessage({
      messages: historyPayload,
      language: activeLang,
      contextQuestion: contextQuestion,
    });

    setIsLoading(false);

    if (res.success && res.reply) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setErrorMsg(res.message || 'AI Tutor could not generate a response.');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: t.tutor.welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMsg('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-[540px] max-w-4xl mx-auto pb-28 animate-fadeIn">
      {/* Top Tutor Sub-header */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-lg shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">
                {t.tutor.title}
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 hidden sm:inline-block">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t.tutor.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Response language toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs font-semibold py-1 px-1 focus:outline-none cursor-pointer"
            >
              <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hinglish" className="bg-slate-900 text-white">Hinglish</option>
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title={t.tutor.clearChat}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sticky Context Banner if a Question is Active */}
      {contextQuestion && (
        <div className="p-3 bg-cyan-950/90 border border-cyan-500/40 rounded-2xl text-xs text-cyan-200 flex items-start justify-between gap-3 shadow-md shrink-0 mb-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{contextQuestion.subject}</span>
                <span className="text-cyan-400">·</span>
                <span className="text-cyan-300">{contextQuestion.topic}</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                {contextQuestion.questionText}
              </p>
            </div>
          </div>

          <button
            onClick={onClearContext}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            title="Unload question context"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 bg-[#0A1128] border border-slate-800 rounded-3xl p-4 sm:p-5 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shrink-0 shadow-sm mt-0.5">
                  <div className="w-full h-full bg-[#0A1128] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              )}

              <div className={`relative max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-900/30'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-line">
                  {msg.content}
                </div>

                <div className={`flex items-center justify-between text-[10px] pt-1 ${
                  isUser ? 'text-slate-900/70 font-semibold' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-cyan-300 flex items-center gap-1 transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin text-teal-400" />
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 font-medium">Daman AI reasoning through solution...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 shrink-0 no-scrollbar">
        {t.tutor.suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-700 whitespace-nowrap transition active:scale-95 flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-[#0A1128] border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-xl shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={t.tutor.placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
