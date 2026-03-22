import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';

const SeatGrid = ({ seats = [], onSeatClick, readonly = false }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const getSeatColor = (seat) => {
    if (seat.status === 'available') {
      return 'from-[#2E7D32] to-[#66BB6A]';
    } else if (seat.status === 'occupied') {
      return 'from-red-500 to-rose-600';
    } else {
      return 'from-orange-500 to-amber-600';
    }
  };

  const getSeatIcon = (seat) => {
    if (seat.status === 'available') return CheckCircleIcon;
    if (seat.status === 'occupied') return XCircleIcon;
    return ClockIcon;
  };

  const filteredSeats = seats.filter(seat => {
    const matchesFilter = filter === 'all' || seat.status === filter;
    const matchesSearch = search === '' ||
      seat.seatNumber.toString().includes(search) ||
      seat.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: seats.length,
    available: seats.filter(s => s.status === 'available').length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    reserved: seats.filter(s => s.status === 'reserved').length,
  };

  const handleSeatClick = (seat) => {
    if (!readonly) {
      setSelectedSeat(seat);
      onSeatClick?.(seat);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Seats', value: stats.total, color: 'green', icon: '💺' },
          { label: 'Available', value: stats.available, color: 'green', icon: '✅' },
          { label: 'Occupied', value: stats.occupied, color: 'red', icon: '👤' },
          { label: 'Reserved', value: stats.reserved, color: 'orange', icon: '⏰' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <GlassCard className="p-6" hover>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            {['all', 'available', 'occupied', 'reserved'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === status
                    ? 'bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white shadow-md'
                    : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search seat or student..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all"
            />
          </div>
        </div>
      </GlassCard>

      {/* Seat Grid */}
      <GlassCard className="p-6" hover>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredSeats.map((seat, index) => {
              const Icon = getSeatIcon(seat);
              return (
                <motion.div
                  key={seat._id || seat.seatNumber}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: readonly ? 1 : 1.1, y: -5 }}
                  whileTap={{ scale: readonly ? 1 : 0.95 }}
                  onClick={() => handleSeatClick(seat)}
                  className={`relative aspect-square ${readonly ? '' : 'cursor-pointer'}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getSeatColor(seat)} rounded-lg shadow-md flex flex-col items-center justify-center text-white`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">{seat.seatNumber}</span>
                  </div>

                  {/* Hover Tooltip */}
                  {!readonly && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 pointer-events-none"
                    >
                      <div className="font-semibold">Seat {seat.seatNumber}</div>
                      <div className="text-gray-300 capitalize">{seat.status}</div>
                      {seat.student && (
                        <div className="text-gray-300">{seat.student.name}</div>
                      )}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredSeats.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No seats found matching your criteria</p>
          </div>
        )}
      </GlassCard>

      {/* Legend */}
      <GlassCard className="p-4" hover>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#2E7D32] to-[#66BB6A]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-rose-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-amber-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Reserved</span>
          </div>
        </div>
      </GlassCard>

      {/* Selected Seat Details */}
      <AnimatePresence>
        {selectedSeat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Seat {selectedSeat.seatNumber} Details
                </h3>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-semibold capitalize ${
                    selectedSeat.status === 'available' ? 'text-[#2E7D32]' :
                    selectedSeat.status === 'occupied' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    {selectedSeat.status}
                  </span>
                </div>

                {selectedSeat.student && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedSeat.student.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Student ID:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedSeat.student.studentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Assigned Date:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedSeat.assignedDate ? new Date(selectedSeat.assignedDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </>
                )}

                {selectedSeat.position && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Row {selectedSeat.position.row}, Col {selectedSeat.position.col}
                    </span>
                  </div>
                )}
              </div>

              {!readonly && (
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:shadow-green-500/20 transition-all"
                  >
                    Assign Student
                  </motion.button>
                  {selectedSeat.status !== 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Unassign
                    </motion.button>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatGrid;
