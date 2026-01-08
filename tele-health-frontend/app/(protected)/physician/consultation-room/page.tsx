'use client';

import React, { useMemo, useState } from 'react';
import {
  usePhysicianAppointments,
  type PhysicianAppointment,
} from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

type ConsultationFilter = 'ALL' | 'VIDEO' | 'AUDIO' | 'CHAT';

const TYPE_LABEL: Record<ConsultationFilter, string> = {
  ALL: 'All',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  CHAT: 'Chat',
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  VIDEO: <Video className='w-4 h-4' />,
  AUDIO: <Phone className='w-4 h-4' />,
  CHAT: <MessageSquare className='w-4 h-4' />,
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800',
};

const PhysicianConsultationRoomPage = () => {
  const { data, isLoading, isError, refetch } = usePhysicianAppointments();
  const [filter, setFilter] = useState<ConsultationFilter>('ALL');

  const consultations = useMemo(() => {
    const all = (data ?? []).filter(app =>
      ['VIDEO', 'AUDIO', 'CHAT'].includes(app.consultationType),
    );

    // Upcoming and active (pending/confirmed) for the physician
    const now = new Date();
    return all.filter(app => {
      const start = new Date(app.startTime);
      return (
        start >= now &&
        (app.status === 'PENDING' || app.status === 'CONFIRMED')
      );
    });
  }, [data]);

  const filteredConsultations = useMemo(() => {
    if (filter === 'ALL') return consultations;
    return consultations.filter(
      app => app.consultationType === filter,
    );
  }, [consultations, filter]);

  const countsByType = useMemo(() => {
    const base: Record<ConsultationFilter, number> = {
      ALL: consultations.length,
      VIDEO: 0,
      AUDIO: 0,
      CHAT: 0,
    };

    consultations.forEach(app => {
      if (app.consultationType in base) {
        base[app.consultationType as ConsultationFilter] += 1;
      }
    });

    return base;
  }, [consultations]);

  const handleJoin = (appointment: PhysicianAppointment) => {
    if (!appointment.meetingLink) return;
    window.open(appointment.meetingLink, '_blank', 'noopener,noreferrer');
  };

  const renderCard = (app: PhysicianAppointment) => {
    const patientName = app.patient
      ? `${app.patient.firstName} ${app.patient.lastName}`.trim()
      : 'Patient';
    const serviceName = app.service?.name ?? 'Consultation';
    const canJoin = app.status === 'CONFIRMED' && !!app.meetingLink;

    return (
      <Card key={app.id}>
        <CardContent className='p-4 space-y-3 md:flex md:items-center md:justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center'>
                <User className='w-4 h-4 text-teal-700' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>{patientName}</h3>
                <p className='text-xs text-gray-500'>
                  {app.patient?.user?.email ?? ''}
                </p>
              </div>
              <Badge
                className={
                  STATUS_COLOR[app.status] ?? 'bg-gray-100 text-gray-800'
                }
              >
                {app.status.toLowerCase()}
              </Badge>
            </div>
            <p className='text-sm text-gray-600'>{serviceName}</p>
            <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
              <span className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                {format(new Date(app.appointmentDate), 'EEE, MMM dd, yyyy')}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                {format(new Date(app.startTime), 'hh:mm a')} –{' '}
                {format(new Date(app.endTime), 'hh:mm a')}
              </span>
              <span className='flex items-center gap-1'>
                {TYPE_ICON[app.consultationType] ?? null}
                {app.consultationType.toLowerCase()}
              </span>
            </div>
            {app.symptoms && (
              <p className='text-xs text-gray-500'>
                <span className='font-medium'>Symptoms: </span>
                {app.symptoms}
              </p>
            )}
          </div>
          <div className='flex gap-2 mt-3 md:mt-0'>
            <Button
              className='bg-teal-600 hover:bg-teal-700 text-white'
              disabled={!canJoin}
              onClick={() => handleJoin(app)}
            >
              <Video className='w-4 h-4 mr-2' />
              {canJoin ? 'Join Consultation' : 'Waiting for confirmation'}
              {canJoin && <ExternalLink className='w-3 h-3 ml-2' />}
            </Button>
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
        <AlertCircle className='w-10 h-10 text-red-500 mx-auto' />
        <p className='text-gray-600'>Unable to load consultations.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Consultation Room</h1>
          <p className='text-gray-600'>
            Manage and join your upcoming video, audio, and chat consultations.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className='grid md:grid-cols-4 gap-4'>
        {(Object.keys(TYPE_LABEL) as ConsultationFilter[]).map(key => (
          <Card key={key}>
            <CardContent className='p-4 space-y-1'>
              <p className='text-xs text-gray-500'>
                {key === 'ALL' ? 'All active consultations' : TYPE_LABEL[key]}
              </p>
              <p className='text-2xl font-semibold text-gray-900'>
                {countsByType[key]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 border-b pb-2'>
        {(Object.keys(TYPE_LABEL) as ConsultationFilter[]).map(key => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'ghost'}
            onClick={() => setFilter(key)}
          >
            {key !== 'ALL' && TYPE_ICON[key] ? (
              <span className='mr-1'>{TYPE_ICON[key]}</span>
            ) : null}
            {TYPE_LABEL[key]}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className='space-y-4'>
        {filteredConsultations.length ? (
          filteredConsultations.map(renderCard)
        ) : (
          <Card>
            <CardContent className='p-12 text-center space-y-2'>
              <Calendar className='w-10 h-10 text-gray-400 mx-auto' />
              <p className='text-gray-700 font-medium'>
                No upcoming consultations for this filter.
              </p>
              <p className='text-gray-500 text-sm'>
                When patients book consultations with you, they will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PhysicianConsultationRoomPage;


