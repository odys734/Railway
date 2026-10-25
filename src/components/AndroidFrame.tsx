import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      {children}
    </div>
  );
};
