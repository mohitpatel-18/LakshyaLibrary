import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import { GlassCard } from '../../components/ui/GlassCard';
import { AreaChart } from '../../components/charts/AreaChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

const AIAnalytics = () => {
  // AI-Generated Insights (simulated)
  const insights = [
    {
      id: 1,
      type: 'prediction',
      icon: TrendingUpIcon,
      color: 'blue',
      title: 'Revenue Forecast',
      description: 'Expected 15% increase in revenue next month based on enrollment trends',
      confidence: 92,
      impact: 'high',
    },
    {
      id: 2,
      type: 'warning',
      icon: ExclamationTriangleIcon,
      color: 'orange',
      title: 'Student Retention Alert',
      description: '5 students at risk of discontinuing. Recommend proactive engagement',
      confidence: 87,
      impact: 'medium',
    },
    {
      id: 3,
      type: 'opportunity',
      icon: LightBulbIcon,
      color: 'green',
      title: 'Peak Hours Optimization',
      description: 'Seat utilization drops 40% after 8 PM. Consider evening promotions',
      confidence: 94,
      impact: 'medium',
    },
    {
      id: 4,
      type: 'trend',
      icon: TrendingDownIcon,
      color: 'red',
      title: 'Payment Delays',
      description: 'Average payment delay increased by 3 days this month',
      confidence: 89,
      impact: 'low',
    },
  ];

  // Predictive data
  const revenueProjection = [
    { name: 'Jan', actual: 65000, predicted: 68000 },
    { name: 'Feb', actual: 72000, predicted: 75000 },
    { name: 'Mar', actual: 85000, predicted: 87000 },
    { name: 'Apr', actual: 92000, predicted: 95000 },
    { name: 'May', actual: 0, predicted: 106000 },
    { name: 'Jun', actual: 0, predicted: 115000 },
  ];

  const studentBehavior = [
    { name: 'Highly Engaged', value: 65 },
    { name: 'Moderately Engaged', value: 25 },
    { name: 'At Risk', value: 10 },
  ];

  const metrics = [
    {
      title: 'AI Accuracy Score',
      value: 94,
      suffix: '%',
      trend: 'up',
      trendValue: 5,
      color: 'blue',
    },
    {
      title: 'Predicted Growth',
      value: 15,
      suffix: '%',
      trend: 'up',
      trendValue: 3,
      color: 'green',
    },
    {
      title: 'Risk Students',
      value: 5,
      trend: 'down',
      trendValue: 2,
      color: 'orange',
    },
    {
      title: 'Optimization Score',
      value: 87,
      suffix: '%',
      trend: 'up',
      trendValue: 8,
      color: 'purple',
    },
  ];

  return (
    <div className="relative min-h-screen">
      <FloatingParticles count={15} />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                <GradientText gradient="purple-pink">AI-Powered Analytics</GradientText>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Intelligent insights and predictive analytics for smarter decisions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.title}</p>
                <div className="flex items-end justify-between">
                  <h3 className={`text-3xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>
                    <AnimatedCounter value={metric.value} suffix={metric.suffix || ''} />
                  </h3>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <TrendingDownIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">{metric.trendValue}%</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Generated Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-${insight.color}-500/20 to-${insight.color}-600/20 flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${insight.color}-600 dark:text-${insight.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">{insight.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            insight.impact === 'high' ? 'bg-red-500/20 text-red-600' :
                            insight.impact === 'medium' ? 'bg-orange-500/20 text-orange-600' :
                            'bg-blue-500/20 text-blue-600'
                          }`}>
                            {insight.impact}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${insight.confidence}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                              className={`h-full bg-gradient-to-r from-${insight.color}-500 to-${insight.color}-600 rounded-full`}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {insight.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Predictive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AreaChart
              data={revenueProjection}
              title="Revenue Prediction (AI-Powered)"
              dataKeys={['actual', 'predicted']}
              colors={['#3B82F6', '#8B5CF6']}
              height={350}
            />
          </div>

          <DonutChart
            data={studentBehavior}
            title="Student Engagement Analysis"
            colors={['#10B981', '#F59E0B', '#EF4444']}
            height={350}
          />
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <LightBulbIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {[
                'Implement automated follow-up system for at-risk students',
                'Introduce weekend discount packages to boost evening occupancy',
                'Launch referral program - predicted to increase enrollment by 20%',
                'Schedule maintenance during low-traffic hours (8-10 PM)',
              ].map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                >
                  <SparklesIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAnalytics;
