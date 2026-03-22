import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  PlusIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import SeatGrid from '../../components/seats/SeatGrid';
import { seatAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SeatManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: seatsData, isLoading, refetch } = useQuery({
    queryKey: ['seats', refreshKey],
    queryFn: () => seatAPI.getAll(),
  });

  const handleSeatClick = (seat) => {
    console.log('Seat clicked:', seat);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast.success('Seats refreshed!');
  };

  const handleGenerateSeats = () => {
    toast.success('Seat generation feature coming soon!');
  };

  return (
    <div className="relative min-h-screen bg-[#F5F7F6] dark:bg-gray-900">
      <FloatingParticles count={10} />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <GradientText>Seat Management</GradientText>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage library seats with interactive visualization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium flex items-center gap-2 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors shadow-sm"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Refresh
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateSeats}
                className="px-4 py-2 bg-gradient-to-r from-[#2E7D32]/10 to-[#66BB6A]/10 text-[#2E7D32] border border-[#2E7D32]/20 rounded-lg font-medium flex items-center gap-2 hover:bg-gradient-to-r hover:from-[#2E7D32]/20 hover:to-[#66BB6A]/20 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                Configure
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg hover:shadow-green-500/20 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Add Seat
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Seat Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading seats...</p>
            </div>
          </div>
        ) : (
          <SeatGrid
            seats={seatsData?.data?.seats || []}
            onSeatClick={handleSeatClick}
          />
        )}
      </div>
    </div>
  );
};

export default SeatManagement;
