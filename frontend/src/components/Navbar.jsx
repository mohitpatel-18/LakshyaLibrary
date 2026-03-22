import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  Home,
  FileText,
  BookOpen,
  ChevronDown,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Dropdown, DropdownItem, DropdownDivider } from './ui/Dropdown';
import NotificationCenter from './notifications/NotificationCenter';
import { cn } from '../utils/cn';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, message: 'Your fee payment is due', read: false },
    { id: 2, message: 'Seat assignment updated', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="h-10 w-10 bg-gradient-to-br from-[#2E7D32] via-[#43A047] to-[#66BB6A] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#66BB6A] bg-clip-text text-transparent hidden sm:block">
                Lakshya Library
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Navigation Links */}
            {!isAuthenticated && (
              <div className="flex items-center gap-1 mr-2">
                <Link to="/">
                  <Button variant="ghost" className="flex items-center gap-2 group">
                    <Home className="h-4 w-4 group-hover:text-[#2E7D32] transition-colors" />
                    <span className="group-hover:text-[#2E7D32] transition-colors">Home</span>
                  </Button>
                </Link>
                <Link to="/admission">
                  <Button variant="ghost" className="flex items-center gap-2 group">
                    <FileText className="h-4 w-4 group-hover:text-[#2E7D32] transition-colors" />
                    <span className="group-hover:text-[#2E7D32] transition-colors">Admission</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-[#2E7D32]" />
                  )}
                </motion.div>
              </Button>
            </motion.div>

            {isAuthenticated ? (
              <>
                {/* Real-time Notifications */}
                <NotificationCenter />

                {/* User Menu */}
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                      <div className="relative">
                        <div className="h-9 w-9 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                        {user?.name}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </button>
                  }
                  align="right"
                  className="w-64"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <DropdownItem icon={<User className="h-4 w-4" />} onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/student')}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem icon={<Settings className="h-4 w-4" />}>Settings</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem danger icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
                    Logout
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login">
                  <Button variant="outline" className="font-semibold rounded-xl border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 dark:hover:bg-green-900/20">
                    Login
                  </Button>
                </Link>
                <Link to="/admission">
                  <Button className="group bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#66BB6A] hover:from-[#1B5E20] hover:via-[#2E7D32] hover:to-[#43A047] font-semibold rounded-xl relative overflow-hidden shadow-lg shadow-green-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Apply Now
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-[#2E7D32]" />
                )}
              </Button>
            </motion.div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              {isAuthenticated ? (
                <>
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl mb-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 mt-2 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/student'}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <Badge variant="danger" className="rounded-full">{unreadCount}</Badge>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/admission"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Admission</span>
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/admission"
                    className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white text-center font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Apply Now
                    </span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
