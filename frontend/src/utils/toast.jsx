import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Global Toast State
let listeners = [];
let toasts = [];

export const toast = (message, type = 'success') => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { id, message, type };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));
  
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  }, 5000);
};

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState([]);

  useEffect(() => {
    setCurrentToasts(toasts);
    const listener = (newToasts) => setCurrentToasts([...newToasts]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map(t => (
        <div key={t.id} className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-300",
          t.type === 'success' ? "bg-white border-green-200 text-slate-800" :
          t.type === 'error' ? "bg-white border-red-200 text-slate-800" :
          "bg-white border-slate-200 text-slate-800"
        )}>
          {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-indigo-500" />}
          <p className="text-sm font-medium">{t.message}</p>
          <button 
            onClick={() => {
              toasts = toasts.filter(toast => toast.id !== t.id);
              listeners.forEach(listener => listener(toasts));
            }}
            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
