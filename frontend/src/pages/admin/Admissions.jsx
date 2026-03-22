import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
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
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { GradientText } from '../../components/ui/GradientText';
import { admissionAPI } from '../../services/api';
import { format } from 'date-fns';

const Admissions = () => {
  const queryClient = useQueryClient();
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { data: admissionsData, isLoading } = useQuery({
    queryKey: ['admissions'],
    queryFn: async () => {
      const response = await admissionAPI.getAll();
      return response.data.data;
    },
  });

  const admissions = Array.isArray(admissionsData) ? admissionsData : [];

  const approveMutation = useMutation({
    mutationFn: (id) => admissionAPI.approve(id),
    onSuccess: () => {
      toast.success('Admission approved successfully');
      queryClient.invalidateQueries(['admissions']);
      setShowDetailsModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve admission');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => admissionAPI.reject(id),
    onSuccess: () => {
      toast.success('Admission rejected');
      queryClient.invalidateQueries(['admissions']);
      setShowDetailsModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject admission');
    },
  });

  const handleView = (admission) => {
    setSelectedAdmission(admission);
    setShowDetailsModal(true);
  };

  const filterAdmissions = (status) => {
    if (!admissions) return [];
    return admissions.filter(a => a.status === status);
  };

  const stats = {
    pending: filterAdmissions('pending').length,
    approved: filterAdmissions('approved').length,
    rejected: filterAdmissions('rejected').length,
  };

  const AdmissionTable = ({ data, status }) => (
    <Table>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead>Applicant</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Membership</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              <EmptyState message={`No ${status} admissions`} />
            </TableCell>
          </TableRow>
        ) : (
          data.map((admission) => (
            <TableRow key={admission._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {admission.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {admission.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {admission.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{admission.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={admission.membershipType === 'fulltime' ? 'primary' : 'info'}>
                  {admission.membershipType}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(admission.createdAt), 'dd MMM yyyy')}
              </TableCell>
              <TableCell>
                <StatusBadge status={admission.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => handleView(admission)}
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-green-50"
                  >
                    View
                  </Button>
                  {admission.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        icon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => approveMutation.mutate(admission._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        icon={<XCircle className="h-4 w-4" />}
                        onClick={() => rejectMutation.mutate(admission._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const tabs = [
    {
      label: `Pending (${stats.pending})`,
      icon: <Calendar className="h-4 w-4" />,
      content: <AdmissionTable data={filterAdmissions('pending')} status="pending" />,
    },
    {
      label: `Approved (${stats.approved})`,
      icon: <CheckCircle className="h-4 w-4" />,
      content: <AdmissionTable data={filterAdmissions('approved')} status="approved" />,
    },
    {
      label: `Rejected (${stats.rejected})`,
      icon: <XCircle className="h-4 w-4" />,
      content: <AdmissionTable data={filterAdmissions('rejected')} status="rejected" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          <GradientText>Admission Management</GradientText>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and process admission requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedAdmission && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Admission Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedAdmission.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedAdmission.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedAdmission.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Membership Type</p>
                <Badge variant={selectedAdmission.membershipType === 'fulltime' ? 'primary' : 'info'}>
                  {selectedAdmission.membershipType}
                </Badge>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedAdmission.address}</p>
              </div>
              {selectedAdmission.message && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additional Message</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedAdmission.message}</p>
                </div>
              )}
            </div>

            {selectedAdmission.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="destructive"
                  icon={<XCircle className="h-4 w-4" />}
                  onClick={() => rejectMutation.mutate(selectedAdmission._id)}
                  loading={rejectMutation.isPending}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  icon={<CheckCircle className="h-4 w-4" />}
                  onClick={() => approveMutation.mutate(selectedAdmission._id)}
                  loading={approveMutation.isPending}
                >
                  Approve & Create Student
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admissions;
