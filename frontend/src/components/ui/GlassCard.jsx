import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const GlassCard = ({
  children,
  className,
  hover = true,
  gradient = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        'bg-white/90 dark:bg-gray-800/90',
        'border border-gray-200/50 dark:border-gray-700/50',
        'rounded-2xl shadow-sm',
        'relative overflow-hidden',
        gradient && 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/10 before:to-emerald-500/10 before:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassPanel = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white/60 dark:bg-gray-800/60',
        'border border-gray-200/50 dark:border-gray-700/50',
        'rounded-xl shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
