import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const Card = ({ children, className, hoverable = false, onClick }) => {
  if (hoverable || onClick) {
    return (
      <motion.div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
          'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
          className
        )}
        onClick={onClick}
        whileHover={{ y: -2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50', className)}>
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'green',
  onClick,
  loading = false
}) => {
  const colorClasses = {
    green: 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6',
        onClick && 'cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'
      )}
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trendValue}
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', color === 'green' ? colorClasses.green : colorClasses[color])}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
