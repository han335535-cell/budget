import React from 'react';
import { Sparkles, X, Heart } from 'lucide-react';

interface PraiseToastProps {
  message: string | null;
  onClose: () => void;
}

export const PraiseToast: React.FC<PraiseToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-400/30 max-w-md">
        <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950 shrink-0">
          <Sparkles className="w-4 h-4 fill-current" />
        </span>
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
            <Heart className="w-3 h-3 fill-amber-300" />
            <span>노력을 인정합니다!</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white/95 mt-0.5 leading-snug">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
