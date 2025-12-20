'use client';

import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import {
  AnalyticsCard,
  RevenueChart,
  AppointmentsChart,
  SpecializationChart,
  PatientGrowthChart,
  TopPerformersTable,
} from '@/components/analytics';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Mock data for analytics
  const revenueData = [
    { date: 'Oct 25', revenue: 4200 },
    { date: 'Oct 26', revenue: 3800 },
    { date: 'Oct 27', revenue: 4500 },
    { date: 'Oct 28', revenue: 5100 },
    { date: 'Oct 29', revenue: 4800 },
    { date: 'Oct 30', revenue: 5500 },
    { date: 'Oct 31', revenue: 6200 },
    { date: 'Nov 1', revenue: 5800 },
  ];

  const appointmentsData = [
    { month: 'Jul', completed: 120, pending: 15, cancelled: 8 },
    { month: 'Aug', completed: 145, pending: 20, cancelled: 10 },
    { month: 'Sep', completed: 165, pending: 18, cancelled: 7 },
    { month: 'Oct', completed: 190, pending: 25, cancelled: 12 },
  ];

  const specializationData = [
    { name: 'Cardiology', value: 45 },
    { name: 'Dermatology', value: 35 },
    { name: 'Pediatrics', value: 28 },
    { name: 'Neurology', value: 22 },
    { name: 'Orthopedics', value: 18 },
    { name: 'Others', value: 15 },
  ];

  const patientGrowthData = [
    { month: 'Jun', patients: 420, physicians: 45 },
    { month: 'Jul', patients: 485, physicians: 52 },
    { month: 'Aug', patients: 560, physicians: 58 },
    { month: 'Sep', patients: 640, physicians: 65 },
    { month: 'Oct', patients: 730, physicians: 72 },
  ];

  const topPhysicians = [
    {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      appointments: 156,
      rating: 4.9,
    },
    {
      name: 'Dr. Michael Chen',
      specialization: 'Dermatologist',
      appointments: 142,
      rating: 4.8,
    },
    {
      name: 'Dr. Emily Williams',
      specialization: 'Pediatrician',
      appointments: 128,
      rating: 4.9,
    },
    {
      name: 'Dr. James Brown',
      specialization: 'Neurologist',
      appointments: 115,
      rating: 4.7,
    },
    {
      name: 'Dr. Lisa Anderson',
      specialization: 'Orthopedist',
      appointments: 98,
      rating: 4.8,
    },
  ];

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>

      {/* Key Analytics Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <AnalyticsCard
          title='Total Revenue'
          value='$38,450'
          change='+18.2%'
          icon={DollarSign}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Total Appointments'
          value='743'
          change='+12.5%'
          icon={Calendar}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Active Patients'
          value='1,248'
          change='+8.3%'
          icon={Users}
          trend='up'
          description='vs last month'
        />
        <AnalyticsCard
          title='Active Physicians'
          value='89'
          change='+15.2%'
          icon={UserCheck}
          trend='up'
          description='vs last month'
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

      {/* Patient Growth and Specializations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PatientGrowthChart data={patientGrowthData} />
        <SpecializationChart data={specializationData} />
      </div>

      {/* Top Performers */}
      <TopPerformersTable physicians={topPhysicians} />

      {/* Admin-specific sections */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Pending Approvals
          </h2>
          <div className='space-y-3'>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg'
              >
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                  <UserCheck className='w-6 h-6 text-orange-600' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium text-gray-900'>Dr. Jane Wilson</h3>
                  <p className='text-sm text-gray-600'>Cardiologist</p>
                </div>
                <div className='flex gap-2'>
                  <Button className='p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200'>
                    <CheckCircle className='w-5 h-5' />
                  </Button>
                  <Button className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200'>
                    <XCircle className='w-5 h-5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Recent Activity
          </h2>
          <div className='space-y-4'>
            {[
              {
                text: 'New patient registered',
                time: '2 mins ago',
                icon: Users,
              },
              {
                text: 'Appointment completed',
                time: '15 mins ago',
                icon: CheckCircle,
              },
              {
                text: 'Payment received',
                time: '1 hour ago',
                icon: DollarSign,
              },
              { text: 'New review posted', time: '2 hours ago', icon: Star },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className='flex items-start gap-3'>
                  <div className='p-2 bg-gray-100 rounded-lg'>
                    <Icon className='w-4 h-4 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-900'>{activity.text}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
