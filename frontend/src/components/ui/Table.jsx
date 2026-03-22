import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Table = ({ children, className }) => {
  return (
    <div className="w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={cn('w-full border-collapse bg-white dark:bg-gray-800', className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className }) => {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-900/50', className)}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className }) => {
  return (
    <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className, hoverable = true, onClick }) => {
  const RowComponent = hoverable ? motion.tr : 'tr';
  
  return (
    <RowComponent
      className={cn(
        hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </RowComponent>
  );
};

export const TableHead = ({ children, className }) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        className
      )}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className }) => {
  return (
    <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100', className)}>
      {children}
    </td>
  );
};

export const EmptyState = ({ message = 'No data available', icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      {icon && <div className="mb-4 text-gray-300 dark:text-gray-600">{icon}</div>}
      <p className="text-sm">{message}</p>
    </div>
  );
};
