import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const SkeletonBase = ({ className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-blue-200 dark:bg-blue-800',
    success: 'bg-green-200 dark:bg-green-800',
  };

  return (
    <motion.div
      className={cn(
        'rounded-lg overflow-hidden relative',
        variants[variant],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  );
};

const Skeleton = ({ className }) => <SkeletonBase className={className} />;

const SkeletonCard = ({ className }) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700', className)}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
    <Skeleton className="w-full h-12 mb-3" />
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

const SkeletonStatsCard = ({ className }) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700', className)}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-20 h-5 rounded-lg" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700', className)}>
    {/* Header */}
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className={`h-4 rounded flex-1 ${i === 0 ? 'w-1/4' : ''}`} />
        ))}
      </div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            {Array.from({ length: columns - 1 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className={`h-4 rounded flex-1 ${colIndex === 0 ? 'w-32' : ''}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonAvatar = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return <Skeleton className={cn('rounded-full', sizes[size], className)} />;
};

const SkeletonInput = ({ className }) => (
  <div className="relative">
    <Skeleton className="w-full h-12 rounded-xl" />
  </div>
);

const SkeletonButton = ({ variant = 'default', className }) => {
  const variants = {
    default: 'w-24 h-10 rounded-lg',
    icon: 'w-10 h-10 rounded-lg',
    large: 'w-32 h-12 rounded-xl',
  };

  return <Skeleton className={cn(variants[variant], className)} />;
};

const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4 rounded',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

const SkeletonChart = ({ height = 200, className }) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700', className)}>
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="w-40 h-5" />
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
    <Skeleton className="w-full h-[200px] rounded-lg" />
  </div>
);

export {
  Skeleton,
  SkeletonCard,
  SkeletonStatsCard,
  SkeletonTable,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonButton,
  SkeletonText,
  SkeletonChart,
};