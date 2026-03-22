import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '../ui/GlassCard';
import toast from 'react-hot-toast';
import { admissionAPI } from '../../services/api';

const steps = [
  { id: 1, name: 'Personal Info', icon: UserIcon },
  { id: 2, name: 'Contact Details', icon: PhoneIcon },
  { id: 3, name: 'Membership', icon: CreditCardIcon },
  { id: 4, name: 'Documents', icon: DocumentTextIcon },
  { id: 5, name: 'Review', icon: CheckCircleIcon },
];

// Validation schemas for each step
const step1Schema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  fatherName: yup.string().required('Father name is required'),
  dob: yup.date().required('Date of birth is required').max(new Date(), 'Invalid date'),
  gender: yup.string().required('Gender is required'),
});

const step2Schema = yup.object({
  phone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required').min(10, 'Address must be at least 10 characters'),
  city: yup.string().required('City is required'),
  pincode: yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
});

const step3Schema = yup.object({
  membershipType: yup.string().required('Membership type is required'),
  shift: yup.string().when('membershipType', {
    is: 'parttime',
    then: () => yup.string().required('Shift is required for part-time'),
  }),
});

const MultiStepAdmission = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      default: return yup.object({});
    }
  };

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'onChange',
  });

  const watchedValues = watch();
  const membershipType = watch('membershipType');

  const onStepSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      reset();
    } else {
      submitForm({ ...formData, ...data });
    }
  };

  const submitForm = async (finalData) => {
    setIsSubmitting(true);
    try {
      await admissionAPI.submit(finalData);
      toast.success('Admission form submitted successfully!');
      onComplete?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit admission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                    backgroundColor: currentStep >= step.id ? '#3B82F6' : '#E5E7EB',
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <span className={`text-xs mt-2 ${
                  currentStep >= step.id ? 'text-blue-600 font-semibold' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                  <motion.div
                    initial={false}
                    animate={{
                      width: currentStep > step.id ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-blue-600 rounded"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <GlassCard className="p-8">
        <form onSubmit={handleSubmit(onStepSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Father's Name *
                      </label>
                      <input
                        {...register('fatherName')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter father's name"
                      />
                      {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        {...register('dob')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender *
                      </label>
                      <select
                        {...register('gender')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Contact Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        {...register('phone')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Address *
                      </label>
                      <textarea
                        {...register('address')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your complete address"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        {...register('city')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        {...register('pincode')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Membership */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Membership Selection
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Select Membership Type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`cursor-pointer ${membershipType === 'fulltime' ? 'ring-2 ring-blue-600' : ''}`}>
                          <input
                            type="radio"
                            {...register('membershipType')}
                            value="fulltime"
                            className="sr-only"
                          />
                          <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Full Time</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              Access from 6 AM to 11 PM daily
                            </p>
                            <p className="text-2xl font-bold text-blue-600">₹3000/month</p>
                          </div>
                        </label>

                        <label className={`cursor-pointer ${membershipType === 'parttime' ? 'ring-2 ring-blue-600' : ''}`}>
                          <input
                            type="radio"
                            {...register('membershipType')}
                            value="parttime"
                            className="sr-only"
                          />
                          <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Part Time</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              Select morning or evening shift
                            </p>
                            <p className="text-2xl font-bold text-blue-600">₹1500/month</p>
                          </div>
                        </label>
                      </div>
                      {errors.membershipType && <p className="text-red-500 text-sm mt-2">{errors.membershipType.message}</p>}
                    </div>

                    {membershipType === 'parttime' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Select Shift *
                        </label>
                        <select
                          {...register('shift')}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Choose shift</option>
                          <option value="morning">Morning (6 AM - 1 PM)</option>
                          <option value="evening">Evening (2 PM - 11 PM)</option>
                        </select>
                        {errors.shift && <p className="text-red-500 text-sm mt-1">{errors.shift.message}</p>}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Upload Documents
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        {...register('photo')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        ID Proof (Aadhar/PAN/Driving License)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        {...register('idProof')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Review & Submit
                  </h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Father's Name:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.fatherName}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">DOB:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.dob}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Gender:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.gender}</span></div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mt-6">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Phone:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.phone}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Email:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span></div>
                      <div className="col-span-2"><span className="text-gray-600 dark:text-gray-400">Address:</span> <span className="font-medium text-gray-900 dark:text-white">{formData.address}, {formData.city} - {formData.pincode}</span></div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mt-6">Membership</h3>
                    <div className="text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Type:</span> <span className="font-medium text-gray-900 dark:text-white capitalize">{formData.membershipType}</span></div>
                      {formData.shift && <div><span className="text-gray-600 dark:text-gray-400">Shift:</span> <span className="font-medium text-gray-900 dark:text-white capitalize">{formData.shift}</span></div>}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      By submitting this form, you agree to our terms and conditions. Your application will be reviewed within 24 hours.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {currentStep > 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back
              </motion.button>
            ) : (
              <div />
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50"
            >
              {currentStep === 5 ? (
                isSubmitting ? 'Submitting...' : 'Submit Application'
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default MultiStepAdmission;
