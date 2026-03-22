import { useAuth } from '../context/AuthContext';

// Permission constants
export const PERMISSIONS = {
  // Student Management
  VIEW_STUDENTS: 'view_students',
  ADD_STUDENT: 'add_student',
  EDIT_STUDENT: 'edit_student',
  DELETE_STUDENT: 'delete_student',
  
  // Seat Management
  VIEW_SEATS: 'view_seats',
  ASSIGN_SEAT: 'assign_seat',
  UNASSIGN_SEAT: 'unassign_seat',
  
  // Fee Management
  VIEW_FEES: 'view_fees',
  CREATE_FEE: 'create_fee',
  APPROVE_PAYMENT: 'approve_payment',
  
  // Admission
  VIEW_ADMISSIONS: 'view_admissions',
  APPROVE_ADMISSION: 'approve_admission',
  REJECT_ADMISSION: 'reject_admission',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_AI_INSIGHTS: 'view_ai_insights',
  
  // System
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

// Role-based permissions
const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // Admin has all permissions
  
  manager: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.ADD_STUDENT,
    PERMISSIONS.EDIT_STUDENT,
    PERMISSIONS.VIEW_SEATS,
    PERMISSIONS.ASSIGN_SEAT,
    PERMISSIONS.UNASSIGN_SEAT,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.CREATE_FEE,
    PERMISSIONS.VIEW_ADMISSIONS,
    PERMISSIONS.APPROVE_ADMISSION,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  
  accountant: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.CREATE_FEE,
    PERMISSIONS.APPROVE_PAYMENT,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  
  receptionist: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.ADD_STUDENT,
    PERMISSIONS.VIEW_SEATS,
    PERMISSIONS.ASSIGN_SEAT,
    PERMISSIONS.VIEW_ADMISSIONS,
  ],
  
  student: [
    // Students have limited permissions
  ],
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const userRole = user.role || 'student';
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const can = hasPermission; // Alias for better readability

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    permissions: ROLE_PERMISSIONS[user?.role || 'student'] || [],
  };
};

export default usePermissions;
