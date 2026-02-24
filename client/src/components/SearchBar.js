import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange, onClear }) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder="Search prompts..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-gray-900/80 text-white text-xs pl-8 pr-8 py-2 rounded-lg border border-gray-700 focus:border-blue-500 outline-none placeholder-gray-500 transition"
      />
      {searchQuery && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;