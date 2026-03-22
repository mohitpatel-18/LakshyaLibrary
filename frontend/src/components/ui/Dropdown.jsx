import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute z-50 mt-2 min-w-[200px] rounded-lg bg-white dark:bg-gray-800',
              'shadow-lg border border-gray-200 dark:border-gray-700',
              'py-1',
              alignmentClasses[align],
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon, className, danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
        'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
        className
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="my-1 border-t border-gray-200 dark:border-gray-700" />;
};
