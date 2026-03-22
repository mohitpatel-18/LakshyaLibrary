import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  UsersIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import { AdvancedTable } from '../../components/ui/AdvancedTable';
import { ExcelExport, ExcelImport } from '../../components/ui/ExcelExport';
import QRCodeGenerator from '../../components/ui/QRCodeGenerator';
import { GlassCard } from '../../components/ui/GlassCard';
import { studentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StudentsManagement = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    membership: 'all',
    search: '',
  });
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: studentsData, isLoading, refetch } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentAPI.getAll(filters),
  });

  const students = studentsData?.data?.students || [];

  const columns = [
    { 
      header: 'Student ID', 
      accessor: 'studentId',
    },
    { 
      header: 'Name', 
      accessor: 'name',
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
    },
    { 
      header: 'Membership', 
      accessor: 'membershipType',
      Cell: (row) => (
        <span className="capitalize px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-blue-400">
          {row.membershipType}
        </span>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'isActive',
      Cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.isActive 
            ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
            : 'bg-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Joining Date',
      accessor: 'joiningDate',
      Cell: (row) => new Date(row.joiningDate).toLocaleDateString(),
    },
  ];

  const handleExport = () => {
    const exportData = students.map(s => ({
      'Student ID': s.studentId,
      'Name': s.name,
      'Phone': s.phone,
      'Email': s.user?.email,
      'Membership': s.membershipType,
      'Status': s.isActive ? 'Active' : 'Inactive',
      'Joining Date': new Date(s.joiningDate).toLocaleDateString(),
    }));
    return exportData;
  };

  const handleImport = (data) => {
    console.log('Imported data:', data);
    toast.success(`Imported ${data.length} students`);
    refetch();
  };

  const handleBulkAction = (action) => {
    toast.success(`Bulk ${action} action initiated`);
  };

  return (
    <div className="relative min-h-screen">
      <FloatingParticles count={12} />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                <UsersIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  <GradientText>Student Management</GradientText>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage all students with advanced tools
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ExcelImport onImport={handleImport} />
              <ExcelExport 
                data={handleExport()} 
                filename="students"
                buttonText="Export"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Student
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={filters.membership}
                onChange={(e) => setFilters({ ...filters, membership: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Memberships</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({ status: 'all', membership: 'all', search: '' })}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
              >
                Reset Filters
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bulk Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bulk Actions:
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium"
                >
                  Activate Selected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium"
                >
                  Deactivate Selected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('send-notification')}
                  className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
                >
                  Send Notification
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
              </div>
            </div>
          ) : (
            <AdvancedTable
              data={students}
              columns={columns}
              title={`Students (${students.length})`}
              searchable={false} // Using custom search
              sortable={true}
              exportable={false} // Using custom export
              onRowClick={(student) => setSelectedStudent(student)}
              actions={(row) => (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
                  >
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedStudent(row)}
                    className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium"
                  >
                    QR
                  </motion.button>
                </>
              )}
            />
          )}
        </motion.div>

        {/* QR Code Modal */}
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <QRCodeGenerator
                value={`STUDENT:${selectedStudent.studentId}`}
                studentId={selectedStudent.studentId}
                name={selectedStudent.name}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentsManagement;
