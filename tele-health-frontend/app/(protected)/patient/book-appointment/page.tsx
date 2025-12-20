'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

import { usePublicPhysicians, useBookAppointment } from '@/hooks';
import type { ConsultationType } from '@/hooks/useAppointments';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MessageSquare,
  Phone,
  Video,
} from 'lucide-react';
import Link from 'next/link';

const appointmentSchema = z.object({
  physicianId: z.string().min(1, 'Please select a doctor'),
  serviceId: z.string().min(1, 'Please select a service'),
  appointmentDate: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time'),
  consultationType: z.enum(['VIDEO', 'AUDIO', 'CHAT']),
  symptoms: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const BookAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const physicianIdFromUrl = searchParams.get('physicianId');

  const { data: physiciansData, isLoading: physiciansLoading } = usePublicPhysicians({
    limit: 100,
  });
  const bookAppointment = useBookAppointment();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      physicianId: physicianIdFromUrl ?? '',
      serviceId: '',
      appointmentDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      consultationType: 'VIDEO',
    },
  });

  const selectedPhysicianId = watch('physicianId');
  const selectedDate = watch('appointmentDate');
  const selectedTime = watch('startTime');
  const consultationType = watch('consultationType') as ConsultationType;

  // When physicians load, ensure the physicianId from URL is set
  useEffect(() => {
    if (physicianIdFromUrl && !selectedPhysicianId) {
      setValue('physicianId', physicianIdFromUrl);
    }
  }, [physicianIdFromUrl, selectedPhysicianId, setValue]);

  const selectedPhysician = useMemo(() => {
    if (!physiciansData?.physicians || !selectedPhysicianId) return null;
    const p: any = physiciansData.physicians.find(
      (ph: any) => ph.id.toString() === selectedPhysicianId,
    );
    if (!p) return null;
    // Normalize shape between ExpertPhysician (landing) and API physicians
    return {
      id: p.id,
      firstName: p.firstName ?? p.name?.split(' ')?.[0] ?? '',
      lastName:
        p.lastName ??
        (p.name?.split(' ').length > 1
          ? p.name?.split(' ').slice(1).join(' ')
          : ''),
      specialization: p.specialization ?? p.specialty ?? 'General Physician',
      consultationFee:
        p.consultationFee ??
        (p.fee ? Number(String(p.fee).replace(/[^0-9.]/g, '')) : 0),
    };
  }, [physiciansData, selectedPhysicianId]);

  const timeSlots = useMemo(() => {
    const slots: { value: string; label: string }[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const label = format(new Date(`2000-01-01T${time}`), 'hh:mm a');
        slots.push({ value: time, label });
      }
    }
    return slots;
  }, []);

  const calculateEndTimeIso = (date: string, startTime: string) => {
    const [h, m] = startTime.split(':').map(Number);
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    return {
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    };
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const { startIso, endIso } = calculateEndTimeIso(
        data.appointmentDate,
        data.startTime,
      );

      await bookAppointment.mutateAsync({
        physicianId: parseInt(data.physicianId, 10),
        serviceId: parseInt(data.serviceId, 10),
        appointmentDate: startIso,
        startTime: startIso,
        endTime: endIso,
        consultationType: data.consultationType as ConsultationType,
        symptoms: data.symptoms || undefined,
      });

      toast.success('Appointment booked successfully');
      setIsSubmitted(true);
      reset({
        physicianId: '',
        serviceId: '',
        appointmentDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '',
        consultationType: 'VIDEO',
        symptoms: '',
      });
      // Navigate to appointments after a short delay
      setTimeout(() => router.push('/patient/appointments'), 1500);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to book appointment. Please try again.',
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className='max-w-2xl mx-auto py-12 px-4'>
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='p-10 text-center space-y-4'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Appointment Booked!
            </h2>
            <p className='text-gray-600'>
              Your appointment has been scheduled successfully. You can review
              all your upcoming visits on the appointments page.
            </p>
            <div className='flex gap-3 justify-center'>
              <Button
                className='bg-teal-600 hover:bg-teal-700'
                onClick={() => router.push('/patient/appointments')}
              >
                View Appointments
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setIsSubmitted(false);
                }}
              >
                Book Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto py-8 px-4 space-y-6'>
      {/* Header */}
      <div>
        <Link
          href='/patient/dashboard'
          className='inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Dashboard
        </Link>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Book an Appointment
        </h1>
        <p className='text-gray-600'>
          Choose a doctor, pick a time, and tell us a bit about your symptoms.
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Form */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Fill in the information below to schedule your visit.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Doctor */}
                <div className='space-y-2'>
                  <Label className='text-base'>
                    Select Doctor <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={selectedPhysicianId}
                    onValueChange={value => setValue('physicianId', value)}
                  >
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Choose a doctor' />
                    </SelectTrigger>
                    <SelectContent>
                      {physiciansLoading ? (
                        <div className='p-4 text-center'>
                          <Loader2 className='w-5 h-5 animate-spin mx-auto' />
                        </div>
                      ) : physiciansData?.physicians?.length ? (
                        physiciansData.physicians.map((p: any) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            Dr. {p.firstName} {p.lastName} — {p.specialization}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='none' disabled>
                          No doctors available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.physicianId && (
                    <p className='text-sm text-red-500'>
                      {errors.physicianId.message}
                    </p>
                  )}
                </div>

                {/* Service */}
                <div className='space-y-2'>
                  <Label className='text-base'>
                    Service Type <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={watch('serviceId')}
                    onValueChange={value => setValue('serviceId', value)}
                  >
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Select a service' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>General Consultation</SelectItem>
                      <SelectItem value='2'>Follow-up Visit</SelectItem>
                      <SelectItem value='3'>Specialist Consultation</SelectItem>
                      <SelectItem value='4'>Emergency Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceId && (
                    <p className='text-sm text-red-500'>
                      {errors.serviceId.message}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2 text-base'>
                      <Calendar className='w-4 h-4' />
                      Date <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      type='date'
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className='h-11'
                      {...register('appointmentDate')}
                    />
                    {errors.appointmentDate && (
                      <p className='text-sm text-red-500'>
                        {errors.appointmentDate.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2 text-base'>
                      <Clock className='w-4 h-4' />
                      Time <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      value={selectedTime}
                      onValueChange={value => setValue('startTime', value)}
                    >
                      <SelectTrigger className='h-11'>
                        <SelectValue placeholder='Select time' />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.startTime && (
                      <p className='text-sm text-red-500'>
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Consultation type */}
                <div className='space-y-2'>
                  <Label className='text-base'>
                    Consultation Type <span className='text-red-500'>*</span>
                  </Label>
                  <div className='grid grid-cols-3 gap-3'>
                    <button
                      type='button'
                      onClick={() => setValue('consultationType', 'VIDEO')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                        consultationType === 'VIDEO'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <Video
                        className={`w-5 h-5 ${
                          consultationType === 'VIDEO'
                            ? 'text-teal-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className='text-xs font-medium'>Video</span>
                    </button>
                    <button
                      type='button'
                      onClick={() => setValue('consultationType', 'AUDIO')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                        consultationType === 'AUDIO'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <Phone
                        className={`w-5 h-5 ${
                          consultationType === 'AUDIO'
                            ? 'text-teal-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className='text-xs font-medium'>Audio</span>
                    </button>
                    <button
                      type='button'
                      onClick={() => setValue('consultationType', 'CHAT')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                        consultationType === 'CHAT'
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <MessageSquare
                        className={`w-5 h-5 ${
                          consultationType === 'CHAT'
                            ? 'text-teal-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className='text-xs font-medium'>Chat</span>
                    </button>
                  </div>
                  {errors.consultationType && (
                    <p className='text-sm text-red-500'>
                      {errors.consultationType.message}
                    </p>
                  )}
                </div>

                {/* Symptoms */}
                <div className='space-y-2'>
                  <Label className='text-base'>Reason for visit / symptoms</Label>
                  <Textarea
                    placeholder='Describe your symptoms or reason for consultation...'
                    className='min-h-24'
                    {...register('symptoms')}
                  />
                  <p className='text-xs text-gray-500'>
                    This helps your doctor prepare for the consultation.
                  </p>
                </div>

                <div className='flex gap-4 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='flex-1 bg-teal-600 hover:bg-teal-700'
                    disabled={isSubmitting || bookAppointment.isPending}
                  >
                    {isSubmitting || bookAppointment.isPending ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className='lg:col-span-1'>
          <Card className='sticky top-24'>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm text-gray-700'>
              {selectedPhysician ? (
                <>
                  <div>
                    <p className='text-xs text-gray-500'>Doctor</p>
                    <p className='font-semibold'>
                      Dr. {selectedPhysician.firstName}{' '}
                      {selectedPhysician.lastName}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {selectedPhysician.specialization}
                    </p>
                  </div>
                  {selectedDate && (
                    <div>
                      <p className='text-xs text-gray-500'>Date</p>
                      <p className='font-medium'>
                        {format(new Date(selectedDate), 'EEEE, MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {selectedTime && (
                    <div>
                      <p className='text-xs text-gray-500'>Time</p>
                      <p className='font-medium'>
                        {format(
                          new Date(`2000-01-01T${selectedTime}`),
                          'hh:mm a',
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className='text-xs text-gray-500'>Consultation type</p>
                    <p className='font-medium capitalize'>
                      {consultationType.toLowerCase()}
                    </p>
                  </div>
                  <div className='pt-3 border-t'>
                    <p className='text-xs text-gray-500'>Estimated fee</p>
                    <p className='text-xl font-bold text-teal-600'>
                      $
                      {Number(
                        selectedPhysician.consultationFee || 0,
                      ).toFixed(2)}
                    </p>
                  </div>
                </>
              ) : (
                <p className='text-sm text-gray-500'>
                  Select a doctor and time to see a summary here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;


