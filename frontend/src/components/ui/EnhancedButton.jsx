import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const EnhancedButton = ({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  className,
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
    secondary: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:shadow-yellow-500/25',
    info: 'bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25',
    glass: 'glass-panel text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-gray-800/80',
    glow: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:glow-blue',
    outline: 'border-2 border-current bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700',
    link: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline-offset-4 hover:underline p-0',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    icon: 'w-5 h-5',
  };

  const loaderSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    icon: 'w-5 h-5',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'disabled:hover:transform-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        rounded ? 'rounded-full' : 'rounded-xl',
        className
      )}
      whileHover={!disabled && !loading ? { y: -2, scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Shimmer effect */}
      {!loading && !disabled && variant !== 'ghost' && variant !== 'link' && (
        <motion.div
          className="absolute inset-0 rounded-inherit overflow-hidden"
          initial={false}
          whileHover={{
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          opacity={0}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <>
          <Loader2 className={cn('animate-spin', loaderSizes[size])} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={iconSizes[size]} />
          )}
          <span className={cn(loading && 'opacity-50')}>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={iconSizes[size]} />
          )}
        </>
      )}

      {/* Ripple effect on click */}
      {variant !== 'ghost' && variant !== 'link' && !loading && (
        <motion.span
          className="absolute inset-0 rounded-inherit"
          initial={{ scale: 0, opacity: 0.3 }}
          whileTap={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default EnhancedButton;