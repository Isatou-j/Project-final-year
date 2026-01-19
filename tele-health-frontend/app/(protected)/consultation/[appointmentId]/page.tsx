'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Calendar, Clock, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/utils/api-client';
import { format } from 'date-fns';

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT';
  meetingLink: string | null;
  status: string;
  patient?: {
    firstName: string;
    lastName: string;
    user?: {
      email: string;
    };
  };
  physician?: {
    firstName: string;
    lastName: string;
    user?: {
      email: string;
    };
  };
  service?: {
    name: string;
  };
}

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appointmentId = params?.appointmentId
    ? parseInt(params.appointmentId as string)
    : null;

  useEffect(() => {
    if (!appointmentId) {
      setError('Invalid appointment ID');
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        const response = await apiClient.get(`/appointment/${appointmentId}`);
        setAppointment(response.data.data || response.data);
      } catch (err: any) {
        console.error('Error fetching appointment:', err);
        setError(
          err?.response?.data?.message ||
            'Failed to load appointment details',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className='container mx-auto p-6'>
        <div className='max-w-2xl mx-auto'>
          <Card>
            <CardContent className='p-6 text-center space-y-4'>
              <p className='text-red-600 font-semibold'>
                {error || 'Appointment not found'}
              </p>
              <Button onClick={() => router.back()} variant='outline'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const otherPerson =
    session?.user?.role === 'PATIENT'
      ? appointment.physician
      : appointment.patient;

  const otherPersonName = otherPerson
    ? `${otherPerson.firstName} ${otherPerson.lastName}`
    : 'Participant';

  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button onClick={() => router.back()} variant='outline' size='sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              {appointment.consultationType === 'VIDEO' && 'Video Consultation'}
              {appointment.consultationType === 'AUDIO' && 'Audio Consultation'}
              {appointment.consultationType === 'CHAT' && 'Chat Consultation'}
            </h1>
            <p className='text-gray-600'>
              {appointment.service?.name || 'Consultation'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full'>
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Appointment Info */}
      <Card>
        <CardContent className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex items-center gap-2'>
              <User className='w-5 h-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>With</p>
                <p className='font-semibold'>{otherPersonName}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Date</p>
                <p className='font-semibold'>
                  {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-5 h-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Time</p>
                <p className='font-semibold'>
                  {format(new Date(appointment.startTime), 'hh:mm a')} -{' '}
                  {format(new Date(appointment.endTime), 'hh:mm a')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Link */}
      <Card>
        <CardContent className='p-6'>
          {appointment.meetingLink ? (
            <div className='text-center space-y-4'>
              <p className='text-lg font-semibold text-gray-900'>
                Video Consultation
              </p>
              <p className='text-sm text-gray-600'>
                Click the button below to join the video consultation on Google Meet.
              </p>
              <a
                href={appointment.meetingLink}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold'
              >
                <ExternalLink className='w-5 h-5' />
                Join Video Consultation
              </a>
            </div>
          ) : (
            <div className='text-center space-y-4'>
              <p className='text-lg font-semibold text-gray-900'>
                No meeting link available
              </p>
              <p className='text-sm text-gray-600'>
                The meeting link will be generated when the appointment is confirmed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

