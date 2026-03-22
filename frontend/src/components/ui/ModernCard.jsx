import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const ModernCard = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  glow = false,
  gradient = false,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    glass: 'glass-card',
      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/10 dark:border-gray-700/30',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800',
    elevated: 'bg-white dark:bg-gray-800 shadow-hard',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300',
        variants[variant],
        hover && 'hover:shadow-medium cursor-pointer',
        glow && 'hover:glow-blue',
        gradient && 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        onClick && 'active:scale-95',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}

      {/* Shimmer effect overlay */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
          whileHover={{
            backgroundPosition: ['200% 0', '-200% 0'],
            transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
          }}
        />
      )}

      {/* Gradient border effect */}
      {variant === 'glass' && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      )}
    </motion.div>
  );
};

export default ModernCard;