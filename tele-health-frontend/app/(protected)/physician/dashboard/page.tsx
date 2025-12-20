'use client';

import { Calendar, Users, DollarSign, Star } from 'lucide-react';
import { useState } from 'react';
import {
  AnalyticsCard,
  RevenueChart,
  AppointmentsChart,
  PatientGrowthChart,
} from '@/components/analytics';

const PhysicianDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Mock data for physician analytics
  const revenueData = [
    { date: 'Oct 25', revenue: 850 },
    { date: 'Oct 26', revenue: 920 },
    { date: 'Oct 27', revenue: 780 },
    { date: 'Oct 28', revenue: 1100 },
    { date: 'Oct 29', revenue: 950 },
    { date: 'Oct 30', revenue: 1200 },
    { date: 'Oct 31', revenue: 1350 },
    { date: 'Nov 1', revenue: 1180 },
  ];

  const appointmentsData = [
    { month: 'Jul', completed: 45, pending: 8, cancelled: 3 },
    { month: 'Aug', completed: 52, pending: 6, cancelled: 2 },
    { month: 'Sep', completed: 58, pending: 9, cancelled: 4 },
    { month: 'Oct', completed: 65, pending: 7, cancelled: 3 },
  ];

  const patientGrowthData = [
    { month: 'Jun', patients: 120, physicians: 1 },
    { month: 'Jul', patients: 135, physicians: 1 },
    { month: 'Aug', patients: 148, physicians: 1 },
    { month: 'Sep', patients: 156, physicians: 1 },
    { month: 'Oct', patients: 168, physicians: 1 },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Physician Dashboard</h1>

      {/* Physician Performance Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <AnalyticsCard
          title="Today's Appointments"
          value='8'
          change='+2'
          icon={Calendar}
          trend='up'
          description='vs yesterday'
        />
        <AnalyticsCard
          title='Total Patients'
          value='168'
          change='+7.7%'
          icon={Users}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Monthly Earnings'
          value='$9,450'
          change='+18.2%'
          icon={DollarSign}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Average Rating'
          value='4.8'
          change='+0.1'
          icon={Star}
          trend='up'
          description='patient reviews'
        />
      </div>

      {/* Revenue and Appointments Overview */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <RevenueChart
          data={revenueData}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
        <AppointmentsChart data={appointmentsData} />
      </div>

      {/* Patient Growth */}
      <PatientGrowthChart data={patientGrowthData} />

      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Today's Schedule
        </h2>
        <div className='space-y-3'>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
            >
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold'>
                JD
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900'>John Doe</h3>
                <p className='text-sm text-gray-600'>Video Consultation</p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>
                  {9 + i}:00 AM
                </p>
                <span className='inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1'>
                  Confirmed
                </span>
              </div>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700'>
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysicianDashboard;
