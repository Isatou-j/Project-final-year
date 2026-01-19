'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientAppointments } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Clock, Video, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

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

const PatientAppointmentsPage = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = usePatientAppointments();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Refetch appointments when component mounts or when coming from booking
  useEffect(() => {
    const refetchData = async () => {
      try {
        const result = await refetch();
        console.log('Appointments refetched:', result.data);
      } catch (error) {
        console.error('Error refetching appointments:', error);
      }
    };
    refetchData();
  }, []);

  // Ensure appointments is always an array
  const appointments = useMemo(() => {
    console.log('Raw data from usePatientAppointments:', data);
    if (!data) {
      console.log('No data from usePatientAppointments');
      return [];
    }
    if (Array.isArray(data)) {
      console.log('Data is array, length:', data.length);
      return data;
    }
    if (Array.isArray(data.appointments)) {
      console.log('Data has appointments array, length:', data.appointments.length);
      return data.appointments;
    }
    if (Array.isArray(data.data)) {
      console.log('Data has data array, length:', data.data.length);
      return data.data;
    }
    console.log('Unknown data structure:', Object.keys(data || {}));
    return [];
  }, [data]);

  const upcomingAppointments = useMemo(
    () => {
      const filtered = appointments.filter(app => {
        try {
          // Use startTime if available, otherwise fall back to appointmentDate
          const appointmentStartTime = app.startTime 
            ? new Date(app.startTime) 
            : new Date(app.appointmentDate);
          const now = new Date();
          
          // Check if appointment is in the future
          const isFuture = appointmentStartTime.getTime() > now.getTime();
          
          // Include if it's in the future and status is PENDING or CONFIRMED
          const matchesStatus = app.status === 'PENDING' || app.status === 'CONFIRMED';
          
          const shouldInclude = isFuture && matchesStatus;
          
          if (!shouldInclude && appointments.length > 0) {
            console.log('Appointment filtered out:', {
              id: app.id,
              startTime: app.startTime,
              appointmentDate: app.appointmentDate,
              status: app.status,
              isFuture,
              matchesStatus,
              now: now.toISOString(),
              appointmentTime: appointmentStartTime.toISOString(),
            });
          }
          
          return shouldInclude;
        } catch (error) {
          console.error('Error filtering appointment:', app, error);
          return false;
        }
      });
      
      console.log('Filtering results:', {
        total: appointments.length,
        upcoming: filtered.length,
        appointments: appointments.map(a => ({
          id: a.id,
          startTime: a.startTime,
          status: a.status,
        })),
      });
      
      return filtered;
    },
    [appointments],
  );

  const pastAppointments = useMemo(
    () =>
      appointments.filter(app => {
        const date = new Date(app.appointmentDate);
        return date < new Date() || app.status === 'COMPLETED' || app.status === 'CANCELLED';
      }),
    [appointments],
  );

  const renderAppointmentCard = (appointment: any) => {
    const physicianName = appointment.physician
      ? `Dr. ${appointment.physician.firstName ?? ''} ${
          appointment.physician.lastName ?? ''
        }`.trim()
      : 'Assigned physician';

    const serviceName = appointment.service?.name ?? 'Consultation';

    return (
      <Card key={appointment.id}>
        <CardContent className='p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg font-semibold text-gray-900'>{physicianName}</h3>
              <Badge className={STATUS_COLORS[appointment.status] ?? 'bg-gray-100 text-gray-800'}>
                {appointment.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className='text-sm text-gray-600'>{serviceName}</p>
            <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
              <span className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                {format(new Date(appointment.appointmentDate), 'EEE, MMM dd, yyyy')}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                {format(new Date(appointment.startTime), 'hh:mm a')} –{' '}
                {format(new Date(appointment.endTime), 'hh:mm a')}
              </span>
              <span className='flex items-center gap-1'>
                {TYPE_ICON[appointment.consultationType] ?? null}
                {appointment.consultationType.toLowerCase()}
              </span>
            </div>
            {appointment.symptoms && (
              <p className='text-sm text-gray-500'>
                <span className='font-medium'>Symptoms:</span> {appointment.symptoms}
              </p>
            )}
          </div>
          <div className='flex gap-3'>
            {appointment.status === 'CONFIRMED' && appointment.meetingLink && (
              <Button 
                className='bg-teal-600 hover:bg-teal-700 text-white'
                onClick={() => window.open(appointment.meetingLink, '_blank', 'noopener,noreferrer')}
              >
                Join Video Consultation
              </Button>
            )}
            <Button variant='outline'>View Details</Button>
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
        <p className='text-gray-600'>Unable to load appointments.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>My Appointments</h1>
          <p className='text-gray-600'>Track your upcoming and past visits</p>
        </div>
        <Button
          className='bg-teal-600 hover:bg-teal-700 text-white'
          onClick={() => router.push('/patient/book-appointment')}
        >
          Book New Appointment
        </Button>
      </div>

      <div className='grid md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Upcoming</p>
            <p className='text-2xl font-semibold text-gray-900'>{upcomingAppointments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Past</p>
            <p className='text-2xl font-semibold text-gray-900'>{pastAppointments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total</p>
            <p className='text-2xl font-semibold text-gray-900'>{appointments.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className='flex items-center gap-3 border-b'>
        <Button
          variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === 'past' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('past')}
        >
          Past
        </Button>
      </div>

      <div className='space-y-4'>
        {activeTab === 'upcoming' ? (
          upcomingAppointments.length ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <p className='text-gray-600 text-center py-12'>No upcoming appointments.</p>
          )
        ) : pastAppointments.length ? (
          pastAppointments.map(renderAppointmentCard)
        ) : (
          <p className='text-gray-600 text-center py-12'>No past appointments.</p>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;

