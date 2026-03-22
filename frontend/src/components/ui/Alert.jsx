import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const alertVariants = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
    icon: Info,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-300',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-300',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
    icon: AlertCircle,
  },
};

export const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onClose,
  className 
}) => {
  const config = alertVariants[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'rounded-lg border p-4',
          config.bg,
          config.text,
          className
        )}
      >
        <div className="flex items-start">
          <Icon className="h-5 w-5 mr-3 mt-0.5" />
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold mb-1">{title}</h3>
            )}
            {children && (
              <div className="text-sm">{children}</div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 text-current hover:opacity-70 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
