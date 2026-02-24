import React from 'react';
import { Coffee } from 'lucide-react';

const CoffeeButton = ({ size = 'normal' }) => {
  // ⚠️ REPLACE WITH YOUR BUY ME A COFFEE USERNAME
  const COFFEE_USERNAME = 'your-username'; 
  
  const coffeeUrl = `https://www.buymeacoffee.com/${COFFEE_USERNAME}`;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    normal: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  return (
    <a
      href={coffeeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition shadow-lg shadow-yellow-500/30 ${sizeClasses[size]}`}
    >
      <Coffee size={size === 'large' ? 20 : 16} />
      <span>Buy Me a Coffee</span>
    </a>
  );
};

export default CoffeeButton;