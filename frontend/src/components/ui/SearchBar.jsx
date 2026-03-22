import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className,
  onClear 
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600',
          'rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500',
          'focus:border-transparent transition-all'
        )}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
