import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Switch = ({ checked, onChange, label, className }) => {
  return (
    <label className={cn('flex items-center cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={cn(
            'w-12 h-6 rounded-full transition-colors',
            checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          )}
        >
          <motion.div
            className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md"
            animate={{ x: checked ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};
