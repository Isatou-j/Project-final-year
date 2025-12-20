'use client';

import page from '@/app/page';
import { Calendar, CheckCircle, FileText, Stethoscope } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import {
  AnalyticsCard,
  AppointmentsChart,
  SpecializationChart,
  TopPerformersTable,
} from '@/components/analytics';

const PatientDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Mock data for patient analytics
  const appointmentsData = [
    { month: 'Jul', completed: 8, pending: 2, cancelled: 1 },
    { month: 'Aug', completed: 12, pending: 1, cancelled: 0 },
    { month: 'Sep', completed: 15, pending: 3, cancelled: 1 },
    { month: 'Oct', completed: 18, pending: 2, cancelled: 0 },
  ];

  const specializationData = [
    { name: 'Cardiology', value: 6 },
    { name: 'Dermatology', value: 4 },
    { name: 'General Medicine', value: 8 },
    { name: 'Pediatrics', value: 3 },
    { name: 'Neurology', value: 2 },
    { name: 'Others', value: 2 },
  ];

  const topDoctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      appointments: 6,
      rating: 4.9,
    },
    {
      name: 'Dr. Michael Chen',
      specialization: 'Dermatologist',
      appointments: 4,
      rating: 4.8,
    },
    {
      name: 'Dr. Emily Williams',
      specialization: 'General Medicine',
      appointments: 8,
      rating: 4.9,
    },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Patient Dashboard</h1>

      {/* Patient Health Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <AnalyticsCard
          title='Total Appointments'
          value='53'
          change='+15%'
          icon={Calendar}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Completed Visits'
          value='48'
          change='+12%'
          icon={CheckCircle}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Health Records'
          value='8'
          change='+2'
          icon={FileText}
          trend='up'
          description='this month'
        />
        <AnalyticsCard
          title='Doctors Visited'
          value='5'
          change='+1'
          icon={Stethoscope}
          trend='up'
          description='this month'
        />
      </div>

      {/* Appointment History and Specializations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <AppointmentsChart data={appointmentsData} />
        <SpecializationChart data={specializationData} />
      </div>

      {/* Top Doctors */}
      <TopPerformersTable physicians={topDoctors} />

      {/* Upcoming appointments */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Upcoming Appointments
        </h2>
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
            >
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <Stethoscope className='w-6 h-6 text-blue-600' />
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900'>Dr. Sarah Smith</h3>
                <p className='text-sm text-gray-600'>General Consultation</p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>
                  Nov 15, 2024
                </p>
                <p className='text-sm text-gray-600'>10:00 AM</p>
              </div>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700'>
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
