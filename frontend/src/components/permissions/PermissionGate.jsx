import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { LockClosedIcon } from '@heroicons/react/24/outline';

/**
 * PermissionGate Component
 * Shows content only if user has required permissions
 */
export const PermissionGate = ({ 
  permissions = [], 
  requireAll = false,
  fallback = null,
  showLocked = false,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Single permission check
  if (typeof permissions === 'string') {
    if (!hasPermission(permissions)) {
      return showLocked ? <LockedContent /> : fallback;
    }
    return <>{children}</>;
  }

  // Multiple permissions check
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return showLocked ? <LockedContent /> : fallback;
  }

  return <>{children}</>;
};

const LockedContent = () => (
  <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
    <LockClosedIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
    <p className="text-gray-600 dark:text-gray-400 font-medium">
      You don't have permission to access this content
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
      Contact your administrator for access
    </p>
  </div>
);

export default PermissionGate;
