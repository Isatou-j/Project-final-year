'use client';

import React, { useMemo, useState } from 'react';
import { usePhysicianAppointments } from '@/hooks';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, Eye, Phone, Mail, Calendar } from 'lucide-react';
import type { PhysicianAppointment } from '@/hooks/usePhysicianAppointments';

const PatientsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<{
    name: string;
    email: string;
    phone: string;
    appointments: PhysicianAppointment[];
  } | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: appointments = [], isLoading, error } =
    usePhysicianAppointments();

  // Get unique patients from appointments
  const patients = useMemo(() => {
    const patientMap = new Map<
      number,
      {
        id: number;
        name: string;
        email: string;
        phone: string;
        appointments: PhysicianAppointment[];
      }
    >();

    appointments.forEach((appointment) => {
      const patientId = appointment.patient.id;
      const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          id: patientId,
          name: patientName,
          email: appointment.patient.user.email,
          phone: appointment.patient.phoneNumber,
          appointments: [],
        });
      }

      const patient = patientMap.get(patientId)!;
      if (statusFilter === 'all' || appointment.status === statusFilter) {
        patient.appointments.push(appointment);
      }
    });

    return Array.from(patientMap.values()).map((patient) => ({
      ...patient,
      appointments: appointments.filter(
        (apt) => apt.patient.id === patient.id,
      ),
    }));
  }, [appointments, statusFilter]);

  const handleViewPatient = (patient: typeof patients[0]) => {
    setSelectedPatient({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      appointments: patient.appointments,
    });
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

  const columns = [
    {
      key: 'id' as const,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'name' as const,
      title: 'Patient Name',
    },
    {
      key: 'email' as const,
      title: 'Email',
    },
    {
      key: 'phone' as const,
      title: 'Phone',
    },
    {
      key: 'appointments' as const,
      title: 'Total Appointments',
      render: (value: PhysicianAppointment[]) => {
        return (
          <Badge className='bg-teal-100 text-teal-800'>
            {value?.length || 0}
          </Badge>
        );
      },
    },
    {
      key: 'actions' ,
      title: 'Actions',
      render: (_: any, row?: any) => {
        if (!row) return null;

        return (
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleViewPatient(row)}
          >
            <Eye className='w-4 h-4 mr-1' />
            View Details
          </Button>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading patients: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>My Patients</h1>
        <p className='text-gray-600'>
          View and manage your patient list and their appointments
        </p>
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-teal-600' />
              <div>
                <p className='text-2xl font-bold'>{patients.length}</p>
                <p className='text-sm text-gray-600'>Total Patients</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-blue-600' />
              <div>
                <p className='text-2xl font-bold'>{appointments.length}</p>
                <p className='text-sm text-gray-600'>Total Appointments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <label htmlFor='status-filter' className='text-sm font-medium text-gray-700'>
            Filter by Appointment Status:
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id='status-filter' className='w-[180px]'>
              <SelectValue placeholder='All Statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Patients</SelectItem>
              <SelectItem value='PENDING'>Pending</SelectItem>
              <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
              <SelectItem value='COMPLETED'>Completed</SelectItem>
              <SelectItem value='CANCELLED'>Cancelled</SelectItem>
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
        data={patients}
        loading={isLoading}
        searchPlaceholder='Search by patient name or email...'
        emptyMessage='No patients found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />

      {/* Patient Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              View patient information and appointment history
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className='space-y-6'>
              {/* Patient Info */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Patient Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Name
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {selectedPatient.name}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {selectedPatient.email}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Phone
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {selectedPatient.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Appointment History ({selectedPatient.appointments.length})
                </h3>
                <div className='space-y-3'>
                  {selectedPatient.appointments.length === 0 ? (
                    <p className='text-sm text-gray-500'>No appointments found</p>
                  ) : (
                    selectedPatient.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className='p-4 border border-gray-200 rounded-lg'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              <Badge
                                className={
                                  appointment.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : appointment.status === 'CONFIRMED'
                                      ? 'bg-blue-100 text-blue-800'
                                      : appointment.status === 'PENDING'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }
                              >
                                {appointment.status}
                              </Badge>
                              <Badge variant='outline'>
                                {appointment.consultationType}
                              </Badge>
                            </div>
                            <p className='text-sm font-medium text-gray-900'>
                              {appointment.service.name}
                            </p>
                            <p className='text-sm text-gray-600 mt-1'>
                              {formatDate(appointment.appointmentDate)} at{' '}
                              {formatTime(appointment.startTime)} -{' '}
                              {formatTime(appointment.endTime)}
                            </p>
                            {appointment.symptoms && (
                              <p className='text-sm text-gray-600 mt-2'>
                                <span className='font-medium'>Symptoms:</span>{' '}
                                {appointment.symptoms}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;
