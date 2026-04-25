import React from 'react';

const GhibliModal = ({ isOpen, title, message, type = 'info', onConfirm, onCancel, confirmText = "Yes", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 shadow-2xl border border-emerald-100 text-center animate-bounce-in">
        
        {/* Dynamic Emoji Icon based on Type */}
        <div className="text-5xl mb-4">
          {type === 'error' ? '🍂' : type === 'confirm' ? '🍃' : '✨'}
        </div>
        
        <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${type === 'error' ? 'text-red-500' : 'text-emerald-900'}`}>
          {title}
        </h3>
        
        <p className={`font-medium italic mb-6 leading-relaxed ${type === 'error' ? 'text-red-800 bg-red-50 p-4 rounded-2xl border border-red-100' : 'text-emerald-600'}`}>
          {message}
        </p>
        
        <div className="flex gap-3">
          {type === 'confirm' && (
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition shadow-lg active:scale-95">
              {confirmText}
            </button>
          )}
          <button 
            onClick={onCancel} 
            className={`flex-1 font-bold py-3 rounded-2xl transition shadow-lg active:scale-95 ${type === 'confirm' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {type === 'confirm' ? cancelText : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default GhibliModal;