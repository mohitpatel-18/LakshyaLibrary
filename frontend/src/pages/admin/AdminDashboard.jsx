import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '../../components/ui/GlassCard';
import { EnhancedStatsCard } from '../../components/ui/EnhancedStatsCard';
import { AreaChart } from '../../components/charts/AreaChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { AdvancedTable } from '../../components/ui/AdvancedTable';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import { analyticsAPI, studentAPI, admissionAPI } from '../../services/api';
import { SkeletonStatsCard } from '../../components/ui/EnhancedSkeleton';
import { CalendarIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => analyticsAPI.getDashboard(),
    refetchInterval: 30000,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentAPI.getAll({ limit: 10 }),
  });

  const { data: admissionsData } = useQuery({
    queryKey: ['admissions'],
    queryFn: () => admissionAPI.getAll({ status: 'pending', limit: 5 }),
  });

  const revenueData = [
    { name: 'Jan', revenue: 65000, expenses: 45000 },
    { name: 'Feb', revenue: 72000, expenses: 48000 },
    { name: 'Mar', revenue: 85000, expenses: 52000 },
    { name: 'Apr', revenue: 92000, expenses: 55000 },
    { name: 'May', revenue: 98000, expenses: 58000 },
    { name: 'Jun', revenue: 105000, expenses: 60000 },
  ];

  const membershipData = [
    { name: 'Full-time', value: 65 },
    { name: 'Part-time', value: 35 },
  ];

  const tableColumns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Name', accessor: 'name' },
    {
      header: 'Status',
      accessor: 'isActive',
      Cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.isActive
              ? 'bg-green-500/20 text-[#2E7D32] dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { header: 'Membership', accessor: 'membershipType' },
    { header: 'Phone', accessor: 'phone' },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: dashboardData?.data?.totalStudents || 0,
      icon: UsersIcon,
      trend: 'up',
      trendValue: 12.5,
      trendLabel: 'vs last month',
      variant: 'primary',
    },
    {
      title: 'Active Seats',
      value: dashboardData?.data?.occupiedSeats || 0,
      icon: AcademicCapIcon,
      trend: 'up',
      trendValue: 8.2,
      trendLabel: 'vs last month',
      variant: 'info',
    },
    {
      title: 'Monthly Revenue',
      value: dashboardData?.data?.monthlyRevenue || 0,
      icon: CurrencyDollarIcon,
      trend: 'up',
      trendValue: 15.3,
      trendLabel: 'vs last month',
      variant: 'success',
    },
    {
      title: 'Pending Admissions',
      value: dashboardData?.data?.pendingAdmissions || 0,
      icon: ClockIcon,
      trend: 'down',
      trendValue: 3.1,
      trendLabel: 'vs last month',
      variant: 'warning',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-gray-900 relative overflow-hidden">
      <AnimatedBackground variant="gradient" intensity="low" />
      <FloatingParticles count={15} />

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {greeting}, Admin
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <GradientText>Admin Dashboard</GradientText>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here&apos;s what&apos;s happening with your library today.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <AnimatePresence>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <SkeletonStatsCard />
                </motion.div>
              ))
            ) : (
              stats.map((stat, index) => (
                <motion.div key={stat.title} variants={itemVariants}>
                  <EnhancedStatsCard {...stat} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <AreaChart
              data={revenueData}
              title="Revenue & Expenses Overview"
              dataKeys={['revenue', 'expenses']}
              colors={['#2E7D32', '#66BB6A']}
              height={350}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DonutChart
              data={membershipData}
              title="Membership Distribution"
              colors={['#2E7D32', '#A5D6A7']}
              height={350}
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" hover>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Add Student', icon: UsersIcon, color: 'green', href: '/admin/students' },
                  { label: 'Manage Seats', icon: AcademicCapIcon, color: 'emerald', href: '/admin/seats' },
                  { label: 'View Reports', icon: ChartBarIcon, color: 'green', href: '/admin/reports' },
                  { label: 'Process Payments', icon: CurrencyDollarIcon, color: 'mint', href: '/admin/fees' },
                ].map((action) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors group cursor-pointer border border-gray-100 dark:border-gray-700"
                  >
                    <div
                      className={`p-2 rounded-lg bg-[#2E7D32]/10 group-hover:bg-[#2E7D32]/20 transition-colors`}
                    >
                      <action.icon
                        className={`w-5 h-5 text-[#2E7D32]`}
                      />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {action.label}
                    </span>
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard className="p-6" hover>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    user: 'John Doe',
                    action: 'enrolled in Full-time membership',
                    time: '2 mins ago',
                    icon: CheckCircleIcon,
                    color: 'green',
                  },
                  {
                    user: 'Jane Smith',
                    action: 'payment received',
                    time: '15 mins ago',
                    icon: CurrencyDollarIcon,
                    color: 'green',
                  },
                  {
                    user: 'Mike Johnson',
                    action: 'seat assigned',
                    time: '1 hour ago',
                    icon: AcademicCapIcon,
                    color: 'emerald',
                  },
                  {
                    user: 'Sarah Williams',
                    action: 'membership expired',
                    time: '2 hours ago',
                    icon: XCircleIcon,
                    color: 'red',
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors group cursor-default"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.color === 'green' ? 'bg-green-500/10' :
                        activity.color === 'emerald' ? 'bg-emerald-500/10' :
                        'bg-red-500/10'
                      }`}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${
                          activity.color === 'green' ? 'text-[#2E7D32]' :
                          activity.color === 'emerald' ? 'text-emerald-600' :
                          'text-red-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdvancedTable
            data={studentsData?.data?.students || []}
            columns={tableColumns}
            title="Recent Students"
            searchable={true}
            sortable={true}
            exportable={true}
            actions={(row) => (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] dark:text-green-400 rounded-lg text-sm font-medium hover:bg-[#2E7D32]/20 transition-colors"
                >
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  Edit
                </motion.button>
              </>
            )}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
