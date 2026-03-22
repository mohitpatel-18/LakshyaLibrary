import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatsCard } from '../../components/ui/StatsCard';
import { AreaChart } from '../../components/charts/AreaChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import { studentAPI, feeAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardData } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => studentAPI.getDashboard(),
  });

  const { data: feesData } = useQuery({
    queryKey: ['myFees'],
    queryFn: () => studentAPI.getMyFees(),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['myPayments'],
    queryFn: () => paymentAPI.getMyPayments(),
  });

  const attendanceData = [
    { name: 'Week 1', present: 6, absent: 1 },
    { name: 'Week 2', present: 7, absent: 0 },
    { name: 'Week 3', present: 5, absent: 2 },
    { name: 'Week 4', present: 6, absent: 1 },
  ];

  const feeBreakdown = [
    { name: 'Paid', value: 75 },
    { name: 'Pending', value: 25 },
  ];

  const stats = [
    {
      title: 'My Seat',
      value: user?.student?.seat?.seatNumber || 'Not Assigned',
      icon: AcademicCapIcon,
      gradient: 'from-[#2E7D32] to-[#66BB6A]',
      iconBg: 'from-green-500/20 to-emerald-500/20',
    },
    {
      title: 'Pending Fees',
      value: feesData?.data?.totalDue || 0,
      icon: CurrencyDollarIcon,
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'from-green-500/20 to-emerald-500/20',
    },
    {
      title: 'Days Active',
      value: dashboardData?.data?.daysActive || 0,
      icon: ClockIcon,
      trend: 'up',
      trendValue: 100,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      title: 'Attendance',
      value: `${dashboardData?.data?.attendancePercentage || 0}%`,
      icon: CheckCircleIcon,
      trend: 'up',
      trendValue: 5.2,
      gradient: 'from-[#A5D6A7] to-[#66BB6A]',
      iconBg: 'from-[#A5D6A7]/20 to-[#66BB6A]/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-gray-900 relative overflow-hidden">
      <FloatingParticles count={12} />

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <GradientText>Welcome back, {user?.student?.name || 'Student'}!</GradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s your learning progress and activities
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <AreaChart
            data={attendanceData}
            title="Weekly Attendance"
            dataKeys={['present', 'absent']}
            colors={['#2E7D32', '#EF4444']}
            height={300}
          />

          <DonutChart
            data={feeBreakdown}
            title="Fee Status"
            colors={['#2E7D32', '#F59E0B']}
            height={300}
          />
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Seat Information */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#2E7D32]/20 to-[#66BB6A]/20">
                <AcademicCapIcon className="w-6 h-6 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                My Seat
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Seat Number</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.student?.seat?.seatNumber || 'Not Assigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Membership</span>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                  {user?.student?.membershipType || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-[#2E7D32] dark:text-green-400 text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Recent Payments */}
          <GlassCard className="p-6 lg:col-span-2" hover>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <CurrencyDollarIcon className="w-6 h-6 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Payments
              </h3>
            </div>
            <div className="space-y-3">
              {paymentsData?.data?.payments?.slice(0, 3).map((payment, index) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircleIcon className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {payment.receiptNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{payment.amount}
                  </span>
                </motion.div>
              )) || (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No recent payments
                </p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <BellIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Notifications
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Fee Payment Due', message: 'Your monthly fee is due in 3 days', time: '2 hours ago', type: 'warning' },
                { title: 'Seat Assigned', message: 'Your seat number has been assigned', time: '1 day ago', type: 'success' },
                { title: 'Welcome!', message: 'Welcome to Lakshya Library', time: '3 days ago', type: 'info' },
              ].map((notif, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    notif.type === 'warning' ? 'bg-yellow-500/20' :
                    notif.type === 'success' ? 'bg-green-500/20' :
                    'bg-emerald-500/20'
                  }`}>
                    <BellIcon className={`w-5 h-5 ${
                      notif.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                      notif.type === 'success' ? 'text-[#2E7D32] dark:text-green-400' :
                      'text-emerald-600 dark:text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notif.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
