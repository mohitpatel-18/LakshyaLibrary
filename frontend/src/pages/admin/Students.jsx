import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Download,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  MoreVertical
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState
} from '../../components/ui/Table';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { Dropdown, DropdownItem, DropdownDivider } from '../../components/ui/Dropdown';
import { Card, CardContent } from '../../components/ui/Card';
import { studentAPI } from '../../services/api';
import StudentFormModal from '../../components/admin/StudentFormModal';

const Students = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    membershipType: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['students', currentPage, search, filters],
    queryFn: async () => {
      const response = await studentAPI.getAll({
        page: currentPage,
        limit: 10,
        search,
        ...filters,
      });
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => studentAPI.delete(id),
    onSuccess: () => {
      toast.success('Student deleted successfully');
      queryClient.invalidateQueries(['students']);
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      studentAPI.update(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success('Student status updated');
      queryClient.invalidateQueries(['students']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const handleExport = async () => {
    try {
      const response = await studentAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Students exported successfully');
    } catch (error) {
      toast.error('Failed to export students');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all students, seats, and fees
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" />}
            onClick={handleExport}
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            Export
          </Button>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:shadow-lg hover:shadow-green-500/20"
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                placeholder="Search by name, email, or student ID..."
              />
            </div>
            <div>
              <select
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E7D32] transition-all"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <select
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2E7D32] transition-all"
                value={filters.membershipType}
                onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data?.pagination?.total || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserCheck className="h-5 w-5 text-[#2E7D32]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {data?.students?.filter(s => s.isActive).length || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {data?.students?.filter(s => !s.isActive).length || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Time</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {data?.students?.filter(s => s.membershipType === 'fulltime').length || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.students?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <EmptyState
                        message="No students found"
                        icon={<UserCheck className="h-12 w-12" />}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.students?.map((student, index) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{student.studentId}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {student.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.membershipType === 'fulltime' ? 'primary' : 'info'}>
                          {student.membershipType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.seat ? (
                          <Badge variant="success">{student.seat.seatNumber}</Badge>
                        ) : (
                          <span className="text-sm text-gray-500">Not Assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={student.isActive ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Dropdown
                          trigger={
                            <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          }
                          align="right"
                        >
                          <DropdownItem
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => handleEdit(student)}
                          >
                            Edit Details
                          </DropdownItem>
                          <DropdownItem
                            icon={student.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            onClick={() => toggleStatusMutation.mutate({
                              id: student._id,
                              isActive: student.isActive
                            })}
                          >
                            {student.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem
                            danger
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => handleDelete(student)}
                          >
                            Delete
                          </DropdownItem>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={data.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create Student Modal */}
      <StudentFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries(['students']);
          setShowCreateModal(false);
        }}
      />

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSuccess={() => {
          queryClient.invalidateQueries(['students']);
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setStudentToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(studentToDelete._id)}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};

export default Students;
