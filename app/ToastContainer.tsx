'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './components/Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    console.log(`Global toast: ${message} (${type})`);
    setMessage(message);
    setType(type);
    setVisible(true);
  }, []);

  const closeToast = useCallback(() => {
    console.log("Closing toast");
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={message}
        type={type}
        isVisible={visible}
        onClose={closeToast}
        duration={7000}
      />
    </ToastContext.Provider>
  );
};

// For debugging purposes
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.showDebugToast = (message: string, type: ToastType = 'info') => {
    // Find the Toast provider instance
    const provider = document.querySelector('[data-toast-provider]');
    if (provider) {
      // @ts-ignore
      provider.__showToast(message, type);
    } else {
      console.error('Toast provider not found');
    }
  };
}

export default ToastProvider; 