'use client';

import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { Calendar, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BookFirstAppointment = () => {
  const router = useRouter();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size='lg' className='bg-white text-teal-600 hover:bg-gray-100'>
          <Calendar className='w-5 h-5 mr-2' />
          Book Your First Consultation
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Start Your Healthcare Journey</DrawerTitle>
          <DrawerDescription>
            Choose from our expert doctors and book your appointment
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-4'>
          <div className='text-center py-8'>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>
              Welcome to MediConnect!
            </h3>
            <p className='text-gray-600 mb-6'>
              Create an account to start booking appointments
            </p>
            <Button
              className='bg-teal-600 '
              onClick={() => router.push('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BookFirstAppointment;
