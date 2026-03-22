import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Armchair,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientText } from '../../components/ui/GradientText';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Smart Management',
      description: 'Streamlined library operations with automated processes and real-time tracking',
      color: 'green'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Student Portal',
      description: 'Dedicated portal for students with payment history, seat info, and notifications',
      color: 'green'
    },
    {
      icon: <Armchair className="h-8 w-8" />,
      title: 'Seat Booking',
      description: 'Visual seat selection with real-time availability and instant confirmation',
      color: 'emerald'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Fee Management',
      description: 'Automated fee calculation with online payments via Razorpay integration',
      color: 'mint'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Access',
      description: 'Access your account anytime, anywhere with our cloud-based platform',
      color: 'teal'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Safe',
      description: 'Bank-level security with encrypted data and secure payment processing',
      color: 'green'
    },
  ];

  const benefits = [
    'Instant admission approval',
    'Real-time seat availability',
    'Automated payment receipts',
    'Digital ID card generation',
    'SMS & email notifications',
    'Mobile responsive design'
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '50+', label: 'Available Seats' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] via-[#43A047] to-[#66BB6A] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                Modern Library Management System
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome to <span className="text-[#A5D6A7]">LakshyaLibrary</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Experience the future of library management with our cutting-edge platform.
                Seamless admissions, smart seat booking, and instant payments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/admission">
                  <Button
                    size="lg"
                    className="bg-white text-[#2E7D32] hover:bg-gray-100 shadow-xl"
                    icon={<ArrowRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Apply for Admission
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#2E7D32]"
                  >
                    Student Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"
              className="fill-[#F5F7F6] dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#F5F7F6] dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-[#2E7D32] dark:text-green-400 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your library efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/10
                           rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 dark:border-gray-700"
              >
                <div className={`inline-flex p-4 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-green-400 mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#F5F7F6] dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Why Choose <GradientText>LakshyaLibrary</GradientText>?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We provide a comprehensive solution that simplifies library management
                and enhances the student experience with modern technology.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-2xl p-8 text-white shadow-2xl">
                <GraduationCap className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="mb-6 text-white/90">
                  Join hundreds of students who are already enjoying the benefits of our platform.
                </p>
                <Link to="/admission">
                  <Button
                    className="bg-white text-[#2E7D32] hover:bg-gray-100"
                    icon={<ArrowRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Trusted by students across the city
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  "Excellent platform! The online payment and seat booking features are amazing.
                  Highly recommended for all students."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] flex items-center justify-center">
                    <span className="text-white font-semibold">S{i}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Student {i}</p>
                    <p className="text-sm text-gray-500">Active Member</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Library Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join LakshyaLibrary today and experience the future of library management
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/admission">
                <Button
                  size="lg"
                  className="bg-white text-[#2E7D32] hover:bg-gray-100 shadow-xl"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#2E7D32]"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
