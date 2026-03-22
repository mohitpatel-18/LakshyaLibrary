import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  gradient = 'from-[#2E7D32] to-[#66BB6A]',
  iconBg = 'from-green-500/20 to-emerald-500/20',
}) => {
  const isPositive = trend === 'up';

  return (
    <GlassCard className="p-6 group" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            <AnimatedCounter value={value} />
          </h3>

          {trendValue && (
            <div className="flex items-center gap-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  isPositive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">{trendValue}%</span>
              </motion.div>
              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className={`p-4 rounded-2xl bg-gradient-to-br ${iconBg} backdrop-blur-sm`}
        >
          <Icon className={`w-8 h-8 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
            style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          />
        </motion.div>
      </div>

      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
        initial={false}
      />
    </GlassCard>
  );
};
