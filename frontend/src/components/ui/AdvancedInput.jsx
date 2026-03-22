import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const AdvancedInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  helper,
  icon: Icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  maxLength,
  className,
  containerClassName,
  labelClassName,
  inputClassName,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleClear = () => {
    onChange({ target: { name, value: '' } });
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error
              ? 'text-red-600 dark:text-red-400'
              : success
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-700 dark:text-gray-300',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Icon
              className={cn(
                'w-5 h-5 transition-colors duration-200',
                disabled
                  ? 'text-gray-400 dark:text-gray-600'
                  : isFocused
                  ? 'text-primary-600 dark:text-primary-400'
                  : error
                  ? 'text-red-500'
                  : success
                  ? 'text-green-500'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            />
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && iconPosition === 'left' && 'pl-11',
            (Icon || showPasswordToggle) && iconPosition === 'right' && 'pr-11',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : success
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
              : isFocused
              ? 'border-primary-500 focus:border-primary-500 focus:ring-primary-500/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600',
            inputClassName
          )}
          {...props}
        />

        {/* Right Side Icons */}
        {(showPasswordToggle || Icon || value) && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            {value && !disabled && type !== 'password' && (
              <motion.button
                type="button"
                onClick={handleClear}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}

            {/* Success/Error Icon */}
            {error && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {success && !error && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}

            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            )}

            {/* Icon */}
            {Icon && iconPosition === 'right' && (
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  disabled
                    ? 'text-gray-400 dark:text-gray-600'
                    : isFocused
                    ? 'text-primary-600 dark:text-primary-400'
                    : error
                    ? 'text-red-500'
                    : success
                    ? 'text-green-500'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              />
            )}
          </div>
        )}

        {/* Animated Border Gradient */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className={cn(
                  'absolute inset-0 rounded-xl -z-10',
                  'bg-gradient-to-r',
                  error
                    ? 'from-red-500/20 to-pink-500/20'
                    : success
                    ? 'from-green-500/20 to-emerald-500/20'
                    : 'from-blue-500/20 to-purple-500/20'
                )}
                style={{
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {(error || success || helper) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5"
          >
            {error && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </>
            )}
            {helper && !error && !success && (
              <>
                <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{helper}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value?.length || 0} / {maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdvancedInput;