import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  default: 'bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white hover:from-[#1B5E20] hover:to-[#2E7D32] shadow-md hover:shadow-lg',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg',
  outline: 'border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 dark:hover:bg-green-900/20',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  ghost: 'hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300',
  link: 'text-[#2E7D32] underline-offset-4 hover:underline',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-12 px-8 text-lg',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(
  ({
    className,
    variant = 'default',
    size = 'default',
    loading = false,
    disabled = false,
    children,
    icon,
    iconPosition = 'left',
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
