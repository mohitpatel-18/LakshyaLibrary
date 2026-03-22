import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  DollarSign,
  Bell,
  Armchair,
  Settings,
  FileText,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { cn } from '../utils/cn';

const StudentLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'My Seat', href: '/student/seat', icon: Armchair },
    { name: 'My Fees', href: '/student/fees', icon: DollarSign },
    { name: 'Documents', href: '/student/documents', icon: FileText },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-gray-900">
      <Navbar />

      <div className="pt-16">
        {/* Top Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap text-sm font-medium',
                      isActive
                        ? 'border-[#2E7D32] text-[#2E7D32] dark:text-green-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
