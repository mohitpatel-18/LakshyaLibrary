import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RazorpayPayment = ({ amount, studentId, feeId, onSuccess, onFailure }) => {
  const [processing, setProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await api.post('/payments/create-order', {
        amount,
        studentId,
        feeId,
      });

      const { orderId, currency, amount: orderAmount } = orderResponse.data.data;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency,
        name: 'Lashya Library',
        description: 'Library Fee Payment',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              studentId,
              feeId,
            });

            toast.success('Payment successful!');
            onSuccess?.(verifyResponse.data.data);
          } catch (error) {
            toast.error('Payment verification failed');
            onFailure?.(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error('Payment error:', error);
      onFailure?.(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
            <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Payment Details
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Secure payment via Razorpay
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">Amount to Pay</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{amount.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Including all taxes and charges
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span>100% Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span>Instant Payment Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span>Multiple Payment Methods</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCardIcon className="w-5 h-5" />
              <span>Pay ₹{amount.toLocaleString()}</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4" />
          <span>Powered by Razorpay</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default RazorpayPayment;
