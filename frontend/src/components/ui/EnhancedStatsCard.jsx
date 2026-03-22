import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';
import { AnimatedCounter } from './AnimatedCounter';

const EnhancedStatsCard = ({
  title,
  value,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  trendLabel = 'vs last month',
  variant = 'default',
  size = 'default',
  showTrendIcon = true,
  className = '',
  onClick,
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    primary: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800',
    success: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800',
    danger: 'bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200 dark:border-red-800',
    warning: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-200 dark:border-yellow-800',
    info: 'bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-200 dark:border-cyan-800',
    glass: 'glass-card',
  };

  const sizes = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  const sizeClasses = sizes[size] || sizes.default;

  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  const trendIcon = showTrendIcon && (isPositive ? ArrowUpIcon : isNegative ? ArrowDownIcon : null);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl transition-all duration-300',
        'hover:shadow-md cursor-pointer',
        variants[variant],
        sizeClasses,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </h3>

          {/* Value */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'font-bold',
              size === 'large' ? 'text-4xl' : 'text-3xl',
              'text-gray-900 dark:text-white'
            )}
          >
            <AnimatedCounter value={value} />
          </motion.p>

          {/* Trend */}
          {trendValue !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              {isPositive && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">+{trendValue}%</span>
                </div>
              )}
              {isNegative && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                  <TrendingDownIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{trendValue}%</span>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className={cn(
              'p-3 rounded-2xl',
              'bg-gradient-to-br',
              isPositive
                ? 'from-green-500/20 to-emerald-500/20'
                : isNegative
                ? 'from-red-500/20 to-rose-500/20'
                : 'from-green-500/20 to-emerald-500/20'
            )}
          >
            <Icon
              className={cn(
                'w-6 h-6',
                isPositive
                  ? 'text-[#2E7D32] dark:text-green-400'
                  : isNegative
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-[#2E7D32] dark:text-green-400'
              )}
            />
          </motion.div>
        )}
      </div>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 40%, rgba(46, 125, 50, 0.1) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
        }}
        whileHover={{
          backgroundPosition: ['200% 200%', '0% 0%'],
          transition: { duration: 1.5 },
        }}
      />
    </motion.div>
  );
};

export default EnhancedStatsCard;
