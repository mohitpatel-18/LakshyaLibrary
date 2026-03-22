import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import { GraduationCap } from 'lucide-react';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Smart Seat Management',
      description: '3D interactive seat layout with real-time availability tracking',
      color: 'green',
      delay: 0,
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'AI-powered insights and predictive analytics for better decision making',
      color: 'emerald',
      delay: 0.1,
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Automated Billing',
      description: 'Streamlined fee management with automated reminders and payments',
      color: 'mint',
      delay: 0.2,
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control',
      color: 'green',
      delay: 0.3,
    },
    {
      icon: ClockIcon,
      title: 'Real-time Updates',
      description: 'Live notifications and instant updates via WebSocket',
      color: 'teal',
      delay: 0.4,
    },
    {
      icon: UserGroupIcon,
      title: 'Student Portal',
      description: 'Dedicated dashboard for students to manage their activities',
      color: 'green',
      delay: 0.5,
    },
  ];

  const stats = [
    { value: '1000+', label: 'Active Students' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '4.9/5', label: 'Rating' },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Student',
      content: 'Best library management system! Easy to use and very efficient.',
      avatar: '👨‍🎓',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      role: 'Library Admin',
      content: 'Revolutionary platform that simplified our entire operations.',
      avatar: '👩‍💼',
      rating: 5,
    },
    {
      name: 'Amit Kumar',
      role: 'Student',
      content: 'Love the real-time notifications and seat booking features!',
      avatar: '👨‍💻',
      rating: 5,
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <AnimatedBackground variant="gradient" intensity="low" />
      <FloatingParticles count={20} />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-5 h-5 text-[#2E7D32] dark:text-green-400" />
              </motion.div>
              <span className="text-sm font-semibold text-[#2E7D32] dark:text-green-400">
                India&apos;s #1 Library Management System
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-extrabold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GradientText>Transform Your Library</GradientText>
              <br />
              <span className="text-gray-900 dark:text-white">Into a Digital Hub</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Powerful, intuitive, and feature-rich library management system designed for
              modern libraries. Manage students, seats, fees, and analytics all in one place.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/admission">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#66BB6A] hover:from-[#1B5E20] hover:via-[#2E7D32] hover:to-[#43A047] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 flex items-center gap-2 relative overflow-hidden"
                >
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
                  <RocketLaunchIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:border-[#2E7D32] dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <motion.div
              className="bg-white/90 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-4 overflow-hidden"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-gradient-to-br from-[#2E7D32] via-[#43A047] to-[#66BB6A] rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                {/* Animated shapes */}
                <motion.div
                  className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl"
                  animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                  }}
                />
                <div className="text-white text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                  >
                    <GraduationCap className="w-24 h-24 mx-auto mb-4 opacity-80" />
                  </motion.div>
                  <p className="text-xl font-semibold">Premium Dashboard Preview</p>
                  <p className="text-sm opacity-80 mt-2">Experience the future of library management</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative inline-block"
                >
                  <motion.h3
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent mb-2"
                  >
                    {stat.value}
                  </motion.h3>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity"
                  />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Powerful Features</GradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to run a modern library efficiently
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const colorMap = {
                green: { from: 'from-[#2E7D32]', to: 'to-[#43A047]', bg: 'bg-[#2E7D32]', text: 'text-[#2E7D32]', dark: 'dark:text-green-400' },
                emerald: { from: 'from-emerald-500', to: 'to-emerald-600', bg: 'bg-emerald-500', text: 'text-emerald-600', dark: 'dark:text-emerald-400' },
                mint: { from: 'from-[#A5D6A7]', to: 'to-[#66BB6A]', bg: 'bg-[#66BB6A]', text: 'text-[#66BB6A]', dark: 'dark:text-[#A5D6A7]' },
                teal: { from: 'from-teal-500', to: 'to-teal-600', bg: 'bg-teal-500', text: 'text-teal-600', dark: 'dark:text-teal-400' },
              };
              const colors = colorMap[feature.color] || colorMap.green;

              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <motion.div
                    className={`p-4 rounded-xl bg-gradient-to-br ${colors.from}/20 to-${colors.to}/20 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${colors.text} ${colors.dark}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2E7D32] dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span>Learn more</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Loved by Students & Admins</GradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our users have to say about us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-12 relative overflow-hidden shadow-lg"
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 100%',
              }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-2xl shadow-lg shadow-green-500/20 mb-6"
              >
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <GradientText>Ready to Get Started?</GradientText>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of satisfied students and library administrators
              </p>
              <Link to="/admission">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#66BB6A] hover:from-[#1B5E20] hover:via-[#2E7D32] hover:to-[#43A047] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 flex items-center gap-3 mx-auto relative overflow-hidden"
                >
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
                  <span>Apply for Admission Now</span>
                  <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent">
                  Lakshya Library
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Modern library management system designed for educational institutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-green-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-green-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/admission" className="text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-green-400 transition-colors">
                    Admission
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-[#2E7D32] dark:hover:text-green-400 transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>support@lakshyalibrary.com</li>
                <li>+91 12345 67890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 Lakshya Library. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
