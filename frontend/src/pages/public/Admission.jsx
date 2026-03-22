import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FloatingParticles } from '../../components/ui/FloatingParticles';
import { GradientText } from '../../components/ui/GradientText';
import MultiStepAdmission from '../../components/forms/MultiStepAdmission';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Admission = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-[#F5F7F6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles count={15} />

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-6"
          >
            <SparklesIcon className="w-5 h-5 text-[#2E7D32] dark:text-green-400" />
            <span className="text-sm font-semibold text-[#2E7D32] dark:text-green-400">
              Quick & Easy Application Process
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Apply for Admission</GradientText>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied students. Complete your application in just 5 simple steps.
          </p>
        </motion.div>

        {/* Success Message */}
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-xl p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-full mb-6 shadow-lg shadow-green-500/20"
              >
                <CheckCircleIcon className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Thank you for applying to Lakshya Library. We&apos;ve received your application and will review it within 24 hours.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                You will receive a confirmation email shortly with your application ID.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Redirecting to login page...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MultiStepAdmission onComplete={handleComplete} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admission;
