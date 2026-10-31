import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocial();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isNeon = toast.type === 'neon';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in ${
              isNeon
                ? 'bg-[#121218]/90 border-[#00D9FF]/40 text-white shadow-[0_0_20px_rgba(0,217,255,0.25)]'
                : isSuccess
                ? 'bg-[#121218]/90 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-[#121218]/90 border-white/10 text-[#A0A0AA]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isNeon && <Sparkles className="w-4 h-4 text-[#00D9FF] shrink-0 animate-spin-slow" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {!isNeon && !isSuccess && <Info className="w-4 h-4 text-[#A0A0AA] shrink-0" />}
              <span className="text-sm font-medium tracking-wide text-white">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A0A0AA] hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

