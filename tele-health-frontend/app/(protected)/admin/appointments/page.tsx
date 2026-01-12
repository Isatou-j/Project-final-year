'use client';

import React, { useState } from 'react';
import { useAdminAppointments } from '@/hooks';
import DataTable from '@/components/table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XCircle, CheckCircle, Clock } from 'lucide-react';
import type { AdminAppointment } from '@/hooks/useAppointments';
import apiClient from '@/utils/api-client';
import { useQueryClient } from '@tanstack/react-query';

const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useAdminAppointments({
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
  });

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Time';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Time';
    }
  };

  const handleStatusUpdate = async (
    appointmentId: number,
    newStatus: string,
  ) => {
    try {
      setUpdatingId(appointmentId);
      await apiClient.patch(`/appointment/${appointmentId}/status`, {
        status: newStatus,
      });

      // Refetch appointments data
      queryClient.invalidateQueries({ queryKey: ['appointments', 'admin'] });

      alert('Appointment status updated successfully!');
    } catch (error: any) {
      console.error('Update status error:', error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update appointment status. Please try again.',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      await apiClient.patch(`/appointment/${appointmentId}/cancel`);

      // Refetch appointments data
      queryClient.invalidateQueries({ queryKey: ['appointments', 'admin'] });

      alert('Appointment cancelled successfully!');
    } catch (error: any) {
      console.error('Cancel appointment error:', error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to cancel appointment. Please try again.',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: 'id' as keyof AdminAppointment,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'patient' as keyof AdminAppointment,
      title: 'Patient',
      render: (value: AdminAppointment['patient']) => {
        if (!value) return 'N/A';
        return `${value.firstName} ${value.lastName}`;
      },
    },
    {
      key: 'physician' as keyof AdminAppointment,
      title: 'Physician',
      render: (value: AdminAppointment['physician']) => {
        if (!value) return 'N/A';
        return `Dr. ${value.firstName} ${value.lastName}`;
      },
    },
    {
      key: 'service' as keyof AdminAppointment,
      title: 'Service',
      render: (value: AdminAppointment['service']) => {
        return value?.name || 'N/A';
      },
    },
    {
      key: 'appointmentDate' as keyof AdminAppointment,
      title: 'Date',
      render: (value: AdminAppointment['appointmentDate']) => formatDate(value),
    },
    {
      key: 'startTime' as keyof AdminAppointment,
      title: 'Time',
      render: (_: AdminAppointment['startTime'], row?: AdminAppointment) => {
        if (!row) return 'N/A';
        return `${formatTime(row.startTime)} - ${formatTime(row.endTime)}`;
      },
    },
    {
      key: 'consultationType' as keyof AdminAppointment,
      title: 'Type',
      render: (value: AdminAppointment['consultationType']) => {
        const typeColors = {
          VIDEO: 'bg-blue-100 text-blue-800',
          AUDIO: 'bg-purple-100 text-purple-800',
          CHAT: 'bg-green-100 text-green-800',
        };

        return (
          <Badge className={typeColors[value] || 'bg-gray-100 text-gray-800'}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'status' as keyof AdminAppointment,
      title: 'Status',
      render: (value: AdminAppointment['status']) => {
        const statusColors = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          CONFIRMED: 'bg-blue-100 text-blue-800',
          COMPLETED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
          NO_SHOW: 'bg-gray-100 text-gray-800',
        };

        const statusIcons = {
          PENDING: <Clock className='w-3 h-3 mr-1' />,
          CONFIRMED: <CheckCircle className='w-3 h-3 mr-1' />,
          COMPLETED: <CheckCircle className='w-3 h-3 mr-1' />,
          CANCELLED: <XCircle className='w-3 h-3 mr-1' />,
          NO_SHOW: <XCircle className='w-3 h-3 mr-1' />,
        };

        return (
          <Badge className={statusColors[value] || 'bg-gray-100 text-gray-800'}>
            <span className='flex items-center'>
              {statusIcons[value]}
              {value}
            </span>
          </Badge>
        );
      },
    },
    {
      key: 'payment' as keyof AdminAppointment,
      title: 'Payment',
      render: (value: AdminAppointment['payment']) => {
        if (!value || value === null) {
          return <Badge className='bg-gray-100 text-gray-800'>N/A</Badge>;
        }

        const paymentColors = {
          PAID: 'bg-green-100 text-green-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          FAILED: 'bg-red-100 text-red-800',
          REFUNDED: 'bg-gray-100 text-gray-800',
        };

        const status = value.status || 'PENDING';
        const amount = value.amount || '0';
        const method = value.paymentMethod || 'N/A';

        return (
          <div className='flex flex-col gap-1'>
            <Badge
              className={
                paymentColors[status as keyof typeof paymentColors] ||
                'bg-gray-100 text-gray-800'
              }
            >
              {status}
            </Badge>
            <span className='text-xs text-gray-600'>
              {amount} {method}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      render: (value: number, row?: AdminAppointment) => {
        if (!row) return null;

        const isUpdating = updatingId === row.id;
        const canUpdateStatus =
          row.status !== 'COMPLETED' && row.status !== 'CANCELLED';

        if (!canUpdateStatus) {
          return <span className='text-gray-400'>No actions</span>;
        }

        return (
          <div className='flex items-center gap-2'>
            {row.status === 'PENDING' && (
              <Button
                size='sm'
                variant='default'
                className='bg-blue-600 hover:bg-blue-700'
                onClick={() => handleStatusUpdate(row.id, 'CONFIRMED')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className='animate-spin mr-2'>⏳</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-4 h-4 mr-2' />
                    Confirm
                  </>
                )}
              </Button>
            )}

            {row.status === 'CONFIRMED' && (
              <Button
                size='sm'
                variant='default'
                className='bg-green-600 hover:bg-green-700'
                onClick={() => handleStatusUpdate(row.id, 'COMPLETED')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className='animate-spin mr-2'>⏳</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-4 h-4 mr-2' />
                    Complete
                  </>
                )}
              </Button>
            )}

            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleCancel(row.id)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className='animate-spin mr-2'>⏳</span>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className='w-4 h-4 mr-2' />
                  Cancel
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    console.error('Appointments error:', error);
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading appointments: {error.message}
          </p>
          {error instanceof Error && error.stack && (
            <pre className='mt-2 text-xs text-red-600 overflow-auto'>
              {error.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Appointments Management
          </h1>
          <p className='text-gray-600'>
            View and manage all appointments in the system
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4 px-6'>
        <div className='flex items-center gap-2'>
          <label htmlFor='status-filter' className='text-sm font-medium text-gray-700'>
            Filter by Status:
          </label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id='status-filter' className='w-[180px]'>
              <SelectValue placeholder='All Statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='PENDING'>Pending</SelectItem>
              <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
              <SelectItem value='COMPLETED'>Completed</SelectItem>
              <SelectItem value='CANCELLED'>Cancelled</SelectItem>
              <SelectItem value='NO_SHOW'>No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {statusFilter && statusFilter !== 'all' && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setStatusFilter('all')}
          >
            Clear Filter
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(data?.appointments) ? data.appointments : []}
        loading={isLoading}
        searchPlaceholder='Search by patient name, physician name, or service...'
        emptyMessage='No appointments found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />
    </div>
  );
};

export default AppointmentsPage;
