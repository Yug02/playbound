import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Disappear after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-red-500';

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce-in flex items-center gap-3 z-50`}>
      <span>{type === 'success' ? '✨' : '❌'}</span>
      <span className="font-bold text-sm uppercase tracking-wider">{message}</span>
    </div>
  );
};

export default Toast;