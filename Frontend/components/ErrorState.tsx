'use client';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-coral-500/10 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-coral-400" />
      </div>
      <p className="text-sm text-white/50 mb-1 text-center">{message}</p>
      <p className="text-xs text-white/25 mb-4 text-center">Please check your connection and try again.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-teal-400 hover:border-teal-500/20 transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
