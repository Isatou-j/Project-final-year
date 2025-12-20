import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Physician {
  name: string;
  specialization: string;
  appointments: number;
  rating: number;
}

interface TopPerformersTableProps {
  physicians: Physician[];
}

export const TopPerformersTable: React.FC<TopPerformersTableProps> = ({
  physicians,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Physicians</CardTitle>
        <CardDescription>Based on appointments and ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {physicians.map((physician, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center gap-4'>
                <div className='flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold'>
                  {index + 1}
                </div>
                <div>
                  <p className='font-semibold'>{physician.name}</p>
                  <p className='text-sm text-gray-600'>
                    {physician.specialization}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-semibold'>
                  {physician.appointments} appointments
                </p>
                <p className='text-sm text-gray-600'>
                  ⭐ {physician.rating} rating
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
