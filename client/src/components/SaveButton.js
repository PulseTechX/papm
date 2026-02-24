import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const SaveButton = ({ promptId }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    setIsSaved(savedPrompts.includes(promptId));
  }, [promptId]);

  const toggleSave = () => {
    const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
    
    if (isSaved) {
      const updated = savedPrompts.filter(id => id !== promptId);
      localStorage.setItem('savedPrompts', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      localStorage.setItem('savedPrompts', JSON.stringify([...savedPrompts, promptId]));
      setIsSaved(true);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`p-2 rounded-lg transition ${
        isSaved 
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
          : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-red-400'
      }`}
      title={isSaved ? 'Remove from saved' : 'Save prompt'}
    >
      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  );
};

export default SaveButton;