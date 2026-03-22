import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Armchair,
  DollarSign,
  FileText,
  Settings,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Shield,
  LogOut,
  Bell,
  BookOpen,
  CalendarDays,
  CreditCard,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CommandPalette from '../components/ui/CommandPalette';
import { cn } from '../utils/cn';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enquiry Management', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Seat Booking', href: '/admin/seats', icon: Armchair },
    { name: 'Seat & Shift Management', href: '/admin/seat-shifts', icon: CalendarDays },
    { name: 'Student Management', href: '/admin/students', icon: Users },
    { name: 'Admission Management', href: '/admin/admissions', icon: ClipboardList },
    { name: 'Fee & Due Fee Management', href: '/admin/fees', icon: CreditCard },
    { name: 'Library Time Management', href: '/admin/library-time', icon: BookOpen },
    { name: 'Monthly Records', href: '/admin/records', icon: FileText },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'ID Card Generator', href: '/admin/id-cards', icon: UserCircle },
    { name: 'Messages & Alerts', href: '/admin/messages', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-gray-900">
      <CommandPalette />
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 shadow-sm',
            sidebarOpen ? 'w-72' : 'w-20'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
            >
              <AnimatePresence mode="wait">
                {sidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.name} to={item.href}>
                    <motion.div
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
                        'hover:bg-green-50 dark:hover:bg-green-900/10',
                        isActive
                          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-[#2E7D32] dark:text-green-400 font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabAdmin"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#2E7D32] to-[#66BB6A] rounded-r-full"
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] text-white shadow-md shadow-green-500/20'
                            : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 text-gray-500 dark:text-gray-400 group-hover:text-[#2E7D32] dark:group-hover:text-green-400'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Text */}
                      <AnimatePresence mode="wait">
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="truncate"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Arrow indicator */}
                      {isActive && sidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-auto"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Quick Actions */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-full flex items-center justify-center shadow-md shadow-green-500/20">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <Bell className="h-4 w-4 mb-1" />
                    <span className="text-xs">Alerts</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mb-1" />
                    <span className="text-xs">Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300',
            sidebarOpen ? 'ml-72' : 'ml-20'
          )}
        >
          <div className="p-6 mt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
