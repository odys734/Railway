import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full min-h-screen bg-[#050814] text-slate-100">{children}</div>;
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#03060E] py-4 sm:py-8 px-2 flex items-center justify-center">
      {/* Android Smartphone Chassis */}
      <div className="relative w-full max-w-[430px] h-[92vh] max-h-[890px] bg-[#0A1128] rounded-[48px] p-3 shadow-2xl shadow-cyan-950/40 ring-1 ring-slate-800 border-4 border-slate-900 flex flex-col overflow-hidden">
        {/* Outer Phone Bezel details */}
        {/* Top Camera Punch Hole & Status Bar */}
        <div className="relative z-50 h-7 bg-[#0A1128] text-slate-400 text-[11px] font-semibold flex items-center justify-between px-6 select-none flex-shrink-0">
          <span>{currentTime}</span>

          {/* Camera Notch */}
          <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-cyan-900/40" />
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] font-bold text-cyan-400">5G</span>
            <Wifi className="w-3 h-3 text-slate-400" />
            <Battery className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Screen Viewport with smooth scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#050814] rounded-b-[38px] no-scrollbar">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-4 bg-[#0A1128] flex items-center justify-center select-none flex-shrink-0">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
