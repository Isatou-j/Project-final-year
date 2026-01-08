'use client';

import React, { useMemo, useState } from 'react';
import {
  usePhysicianAppointments,
  useUpdateAppointmentStatus,
} from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  VIDEO: <Video className='w-4 h-4' />,
  AUDIO: <Phone className='w-4 h-4' />,
  CHAT: <MessageSquare className='w-4 h-4' />,
};

type FilterType = 'all' | 'upcoming' | 'past' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const PhysicianAppointmentsPage = () => {
  const { data, isLoading, isError, refetch } = usePhysicianAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const appointments = useMemo(() => data ?? [], [data]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    let filtered = appointments;

    switch (statusFilter) {
      case 'upcoming':
        filtered = filtered.filter(
          app =>
            new Date(app.appointmentDate) >= now &&
            (app.status === 'PENDING' || app.status === 'CONFIRMED')
        );
        break;
      case 'past':
        filtered = filtered.filter(
          app =>
            new Date(app.appointmentDate) < now ||
            app.status === 'COMPLETED' ||
            app.status === 'CANCELLED'
        );
        break;
      case 'pending':
        filtered = filtered.filter(app => app.status === 'PENDING');
        break;
      case 'confirmed':
        filtered = filtered.filter(app => app.status === 'CONFIRMED');
        break;
      case 'completed':
        filtered = filtered.filter(app => app.status === 'COMPLETED');
        break;
      case 'cancelled':
        filtered = filtered.filter(app => app.status === 'CANCELLED');
        break;
      default:
        break;
    }

    // Sort by date (upcoming first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();
      return dateA - dateB;
    });
  }, [appointments, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter(
      app =>
        new Date(app.appointmentDate) >= now &&
        (app.status === 'PENDING' || app.status === 'CONFIRMED')
    );
    const past = appointments.filter(
      app =>
        new Date(app.appointmentDate) < now ||
        app.status === 'COMPLETED' ||
        app.status === 'CANCELLED'
    );
    const pending = appointments.filter(app => app.status === 'PENDING');
    const confirmed = appointments.filter(app => app.status === 'CONFIRMED');
    const completed = appointments.filter(app => app.status === 'COMPLETED');

    return {
      total: appointments.length,
      upcoming: upcoming.length,
      past: past.length,
      pending: pending.length,
      confirmed: confirmed.length,
      completed: completed.length,
    };
  }, [appointments]);

  const handleStatusUpdate = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: selectedAppointment,
        status: newStatus,
      });
      toast.success('Appointment status updated successfully');
      setSelectedAppointment(null);
      setNewStatus('');
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const options: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED', 'NO_SHOW'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };
    return options[currentStatus] || [];
  };

  const renderAppointmentCard = (appointment: any) => {
    const patientName = appointment.patient
      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
      : 'Unknown Patient';

    const serviceName = appointment.service?.name ?? 'Consultation';
    const statusOptions = getStatusOptions(appointment.status);
    const isUpcoming =
      new Date(appointment.appointmentDate) >= new Date() &&
      (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED');

    return (
      <Card key={appointment.id} className='hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Left Section - Patient Info */}
            <div className='flex-1 space-y-4'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center'>
                    <User className='w-6 h-6 text-teal-600' />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {patientName}
                    </h3>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <Mail className='w-4 h-4' />
                      <span>{appointment.patient?.user?.email ?? 'N/A'}</span>
                    </div>
                    {appointment.patient?.phoneNumber && (
                      <div className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
                        <Phone className='w-4 h-4' />
                        <span>{appointment.patient.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  className={
                    STATUS_COLORS[appointment.status] ??
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {appointment.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-900'>{serviceName}</p>
                <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='w-4 h-4' />
                    {format(new Date(appointment.appointmentDate), 'EEE, MMM dd, yyyy')}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Clock className='w-4 h-4' />
                    {format(new Date(appointment.startTime), 'hh:mm a')} –{' '}
                    {format(new Date(appointment.endTime), 'hh:mm a')}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    {TYPE_ICON[appointment.consultationType] ?? null}
                    {appointment.consultationType.toLowerCase()}
                  </span>
                </div>
              </div>

              {appointment.symptoms && (
                <div className='bg-gray-50 rounded-lg p-3'>
                  <p className='text-xs font-medium text-gray-700 mb-1'>
                    Symptoms:
                  </p>
                  <p className='text-sm text-gray-600'>{appointment.symptoms}</p>
                </div>
              )}

              {appointment.notes && (
                <div className='bg-blue-50 rounded-lg p-3'>
                  <p className='text-xs font-medium text-blue-700 mb-1'>Notes:</p>
                  <p className='text-sm text-blue-600'>{appointment.notes}</p>
                </div>
              )}

              {appointment.payment && (
                <div className='flex items-center gap-2 text-sm'>
                  <span className='text-gray-600'>Payment:</span>
                  <Badge
                    className={
                      appointment.payment.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {appointment.payment.status} - ${appointment.payment.amount}
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Section - Actions */}
            <div className='flex flex-col gap-3 lg:min-w-[200px]'>
              {appointment.meetingLink && isUpcoming && (
                <Button
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white'
                  onClick={() => window.open(appointment.meetingLink, '_blank')}
                >
                  <Video className='w-4 h-4 mr-2' />
                  Join Meeting
                  <ExternalLink className='w-3 h-3 ml-2' />
                </Button>
              )}

              {statusOptions.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full'
                      onClick={() => {
                        setSelectedAppointment(appointment.id);
                        setNewStatus('');
                      }}
                    >
                      Update Status
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Appointment Status</AlertDialogTitle>
                      <AlertDialogDescription>
                        Change the status of this appointment. Current status:{' '}
                        <strong>{appointment.status}</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='space-y-4 py-4'>
                      <Select
                        value={newStatus}
                        onValueChange={setNewStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select new status' />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleStatusUpdate}
                        disabled={!newStatus || updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Updating...
                          </>
                        ) : (
                          'Update'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {appointment.status === 'COMPLETED' && (
                <div className='flex items-center gap-2 text-sm text-green-600'>
                  <CheckCircle2 className='w-4 h-4' />
                  <span>Completed</span>
                </div>
              )}

              {appointment.status === 'CANCELLED' && (
                <div className='flex items-center gap-2 text-sm text-red-600'>
                  <XCircle className='w-4 h-4' />
                  <span>Cancelled</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-center py-12 space-y-4'>
        <AlertCircle className='w-12 h-12 text-red-500 mx-auto' />
        <p className='text-gray-600'>Unable to load appointments.</p>
        <Button onClick={() => refetch()} className='bg-teal-600 hover:bg-teal-700'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Appointments</h1>
          <p className='text-gray-600'>Manage your patient appointments</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Total</p>
            <p className='text-2xl font-semibold text-gray-900'>{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Upcoming</p>
            <p className='text-2xl font-semibold text-blue-600'>{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Past</p>
            <p className='text-2xl font-semibold text-gray-600'>{stats.past}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Pending</p>
            <p className='text-2xl font-semibold text-yellow-600'>{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Confirmed</p>
            <p className='text-2xl font-semibold text-blue-600'>{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500 mb-1'>Completed</p>
            <p className='text-2xl font-semibold text-green-600'>{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className='flex items-center gap-3 flex-wrap'>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterType)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Appointments</SelectItem>
            <SelectItem value='upcoming'>Upcoming</SelectItem>
            <SelectItem value='past'>Past</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='confirmed'>Confirmed</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <div className='text-sm text-gray-600'>
          Showing <strong>{filteredAppointments.length}</strong> appointment
          {filteredAppointments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Appointments List */}
      <div className='space-y-4'>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(renderAppointmentCard)
        ) : (
          <Card>
            <CardContent className='p-12 text-center'>
              <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600 text-lg font-medium'>
                No appointments found
              </p>
              <p className='text-gray-500 text-sm mt-2'>
                {statusFilter === 'all'
                  ? 'You have no appointments yet.'
                  : `No ${statusFilter} appointments.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PhysicianAppointmentsPage;

