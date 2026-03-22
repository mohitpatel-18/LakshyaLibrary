import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { studentAPI } from '../../services/api';

const studentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  membershipType: z.enum(['fulltime', 'parttime']),
  discount: z.number().min(0).max(100).optional(),
  discountType: z.enum(['percentage', 'fixed']).optional(),
});

const StudentFormModal = ({ isOpen, onClose, student, onSuccess }) => {
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      name: '',
      email: '',
      phone: '',
      address: '',
      membershipType: 'fulltime',
      discount: 0,
      discountType: 'percentage',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return studentAPI.update(student._id, data);
      }
      return studentAPI.create(data);
    },
    onSuccess: () => {
      toast.success(`Student ${isEdit ? 'updated' : 'created'} successfully`);
      reset();
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} student`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            placeholder="Enter student name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="student@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number *"
            type="tel"
            placeholder="10-digit mobile number"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Select
            label="Membership Type *"
            error={errors.membershipType?.message}
            {...register('membershipType')}
          >
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
          </Select>
        </div>

        <Textarea
          label="Address *"
          placeholder="Enter complete address"
          error={errors.address?.message}
          rows={3}
          {...register('address')}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Discount (Optional)"
            type="number"
            placeholder="0"
            error={errors.discount?.message}
            {...register('discount', { valueAsNumber: true })}
          />
          <Select
            label="Discount Type"
            {...register('discountType')}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </Select>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentFormModal;
