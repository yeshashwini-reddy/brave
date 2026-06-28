import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const toast = {
  success: (message) => {
    window.dispatchEvent(new CustomEvent('toast-notify', { detail: { type: 'success', message } }));
  },
  error: (message) => {
    window.dispatchEvent(new CustomEvent('toast-notify', { detail: { type: 'error', message } }));
  },
  info: (message) => {
    window.dispatchEvent(new CustomEvent('toast-notify', { detail: { type: 'info', message } }));
  }
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { type, message } = e.detail;
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, type, message }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('toast-notify', handleToast);
    return () => window.removeEventListener('toast-notify', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-[9999] max-w-sm w-full pointer-events-none">
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(100%) translateY(-20px); opacity: 0; }
          to { transform: translateX(0) translateY(0); opacity: 1; }
        }
        .toast-item {
          animation: toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-item flex items-start p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 gap-3 ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
            {t.type === 'error' && <AlertCircle size={18} className="text-rose-500" />}
            {t.type === 'info' && <Info size={18} className="text-blue-500" />}
          </div>
          <div className="flex-1 text-sm font-medium">{t.message}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

