import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`fixed top-20 right-5 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce`}>
      {message}
    </div>
  );
};

export default Toast;