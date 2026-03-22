import React from 'react';
import { cn } from '../../utils/cn';

export const GradientText = ({ children, className, gradient = 'green' }) => {
  const gradients = {
    'green': 'from-[#2E7D32] via-[#43A047] to-[#66BB6A]',
    'green-mint': 'from-[#2E7D32] via-[#66BB6A] to-[#A5D6A7]',
    'mint': 'from-[#66BB6A] to-[#A5D6A7]',
    'blue-purple': 'from-blue-600 via-indigo-600 to-purple-600',
    'pink-orange': 'from-pink-600 via-rose-600 to-orange-600',
    'green-blue': 'from-green-600 via-teal-600 to-blue-600',
    'purple-pink': 'from-purple-600 via-fuchsia-600 to-pink-600',
    'orange-red': 'from-orange-600 via-red-600 to-pink-600',
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        'font-bold',
        gradients[gradient] || gradients['green'],
        className
      )}
    >
      {children}
    </span>
  );
};
