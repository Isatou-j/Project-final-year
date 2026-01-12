'use client';

import React, { useState, useMemo } from 'react';
import { useAdminPhysicians } from '@/hooks';
import DataTable from '@/components/table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  UserX,
  Clock,
  Users,
} from 'lucide-react';
import type { Physician } from '@/types/physician';
import { approvePhysician, rejectPhysician } from '@/lib/auth-api';
import { useQueryClient } from '@tanstack/react-query';

const PhysiciansPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [viewingPhysician, setViewingPhysician] = useState<Physician | null>(
    null,
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data, isLoading, error } = useAdminPhysicians({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data?.physicians) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
      };
    }

    return {
      total: data.physicians.length,
      pending: data.physicians.filter((p) => p.status === 'PENDING').length,
      approved: data.physicians.filter((p) => p.status === 'APPROVED').length,
      rejected: data.physicians.filter((p) => p.status === 'REJECTED').length,
      suspended: data.physicians.filter((p) => p.status === 'SUSPENDED')
        .length,
    };
  }, [data]);

  const handleApprove = async (physicianId: number) => {
    if (
      !confirm(
        'Are you sure you want to approve this physician? They will be able to receive appointments.',
      )
    ) {
      return;
    }

    try {
      setApprovingId(physicianId);
      await approvePhysician(physicianId);

      queryClient.invalidateQueries({ queryKey: ['physicians', 'admin'] });

      alert('Physician approved successfully!');
    } catch (error: any) {
      console.error('Approve physician error:', error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to approve physician. Please try again.',
      );
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (physicianId: number) => {
    if (
      !confirm(
        'Are you sure you want to reject this physician application? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      setRejectingId(physicianId);
      await rejectPhysician(physicianId);

      queryClient.invalidateQueries({ queryKey: ['physicians', 'admin'] });

      alert('Physician application rejected.');
    } catch (error: any) {
      console.error('Reject physician error:', error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to reject physician. Please try again.',
      );
    } finally {
      setRejectingId(null);
    }
  };

  const handleViewDetails = (physician: Physician) => {
    setViewingPhysician(physician);
    setIsViewDialogOpen(true);
  };

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

  const columns = [
    {
      key: 'id' as keyof Physician,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'firstName' as keyof Physician,
      title: 'Name',
      render: (_: Physician['firstName'], row?: Physician) => {
        if (!row) return 'N/A';
        return (
          <div>
            <div className='font-medium'>
              {row.firstName} {row.lastName}
            </div>
            <div className='text-sm text-gray-500'>{row.specialization}</div>
          </div>
        );
      },
    },
    {
      key: 'user.email' as keyof Physician,
      title: 'Contact',
      render: (value: Physician['user']) => {
        return (
          <div>
            <div className='text-sm'>{value?.email || 'N/A'}</div>
            {value?.username && (
              <div className='text-xs text-gray-500'>@{value.username}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status' as keyof Physician,
      title: 'Status',
      render: (value: Physician['status']) => {
        const statusConfig = {
          APPROVED: {
            color: 'bg-green-100 text-green-800',
            icon: <CheckCircle className='w-3 h-3 mr-1' />,
          },
          PENDING: {
            color: 'bg-yellow-100 text-yellow-800',
            icon: <Clock className='w-3 h-3 mr-1' />,
          },
          REJECTED: {
            color: 'bg-red-100 text-red-800',
            icon: <XCircle className='w-3 h-3 mr-1' />,
          },
          SUSPENDED: {
            color: 'bg-gray-100 text-gray-800',
            icon: <UserX className='w-3 h-3 mr-1' />,
          },
        };

        const config = statusConfig[value] || statusConfig.PENDING;

        return (
          <Badge className={config.color}>
            <span className='flex items-center'>
              {config.icon}
              {value}
            </span>
          </Badge>
        );
      },
    },
    {
      title: 'Actions',
      render: (value: number, row?: Physician) => {
        if (!row) return null;

        const isPending = row.status === 'PENDING';
        const isApproving = approvingId === row.id;
        const isRejecting = rejectingId === row.id;
        const isLoading = isApproving || isRejecting;

        return (
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleViewDetails(row)}
            >
              <Eye className='w-4 h-4 mr-1' />
              View
            </Button>
            {isPending && (
              <>
                <Button
                  size='sm'
                  variant='default'
                  className='bg-teal-600 hover:bg-teal-700'
                  onClick={() => handleApprove(row.id)}
                  disabled={isLoading}
                >
                  {isApproving ? (
                    <>
                      <span className='animate-spin mr-2'>⏳</span>
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleReject(row.id)}
                  disabled={isLoading}
                >
                  {isRejecting ? (
                    <>
                      <span className='animate-spin mr-2'>⏳</span>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className='w-4 h-4 mr-2' />
                      Reject
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading physicians: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>
          Physicians Management
        </h1>
        <p className='text-gray-600'>
          Review and manage physician applications and profiles
        </p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Total Physicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-teal-600' />
              <span className='text-2xl font-bold'>{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Clock className='w-5 h-5 text-yellow-600' />
              <span className='text-2xl font-bold'>{stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <UserCheck className='w-5 h-5 text-green-600' />
              <span className='text-2xl font-bold'>{stats.approved}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <UserX className='w-5 h-5 text-red-600' />
              <span className='text-2xl font-bold'>{stats.rejected}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Suspended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <UserX className='w-5 h-5 text-gray-600' />
              <span className='text-2xl font-bold'>{stats.suspended}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <label htmlFor='status-filter' className='text-sm font-medium text-gray-700'>
            Filter by Status:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id='status-filter' className='w-[180px]'>
              <SelectValue placeholder='All Statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Physicians</SelectItem>
              <SelectItem value='PENDING'>Pending</SelectItem>
              <SelectItem value='APPROVED'>Approved</SelectItem>
              <SelectItem value='REJECTED'>Rejected</SelectItem>
              <SelectItem value='SUSPENDED'>Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== 'all' && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setStatusFilter('all')}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={Array.isArray(data?.physicians) ? data.physicians : []}
        loading={isLoading}
        searchPlaceholder='Search by name, email, or specialization...'
        emptyMessage='No physicians found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />

      {/* View Physician Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Physician Details</DialogTitle>
            <DialogDescription>
              Complete information about this physician
            </DialogDescription>
          </DialogHeader>
          {viewingPhysician && (
            <div className='space-y-6'>
              {/* Profile Section */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Profile Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      First Name
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {viewingPhysician.firstName}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Last Name
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {viewingPhysician.lastName}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {viewingPhysician.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Username
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {viewingPhysician.user?.username || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Specialization
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {viewingPhysician.specialization}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Status
                    </label>
                    <div className='mt-1'>
                      <Badge
                        className={
                          viewingPhysician.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : viewingPhysician.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : viewingPhysician.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {viewingPhysician.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              {viewingPhysician.status === 'PENDING' && (
                <div className='flex gap-3 pt-4 border-t'>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleApprove(viewingPhysician.id);
                    }}
                    className='bg-teal-600 hover:bg-teal-700 flex-1'
                    disabled={approvingId === viewingPhysician.id}
                  >
                    {approvingId === viewingPhysician.id ? (
                      <>
                        <span className='animate-spin mr-2'>⏳</span>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className='w-4 h-4 mr-2' />
                        Approve Physician
                      </>
                    )}
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleReject(viewingPhysician.id);
                    }}
                    className='flex-1'
                    disabled={rejectingId === viewingPhysician.id}
                  >
                    {rejectingId === viewingPhysician.id ? (
                      <>
                        <span className='animate-spin mr-2'>⏳</span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className='w-4 h-4 mr-2' />
                        Reject Application
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysiciansPage;
