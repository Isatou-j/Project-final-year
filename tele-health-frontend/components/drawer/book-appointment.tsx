import { doctors, timeSlots } from '@/mocks/dummy-data';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { ArrowRight, Badge, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Label } from 'recharts';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

type BookAppointmentProps = {
  selectedDoctor: any;
  setSelectedDoctor: React.Dispatch<any>;
};

const BookAppointment = ({
  selectedDoctor,
  setSelectedDoctor,
}: BookAppointmentProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size='lg' className='bg-teal-600  hover:from-teal-700 '>
          Book Appointment
          <ArrowRight className='w-5 h-5 ml-2' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Book Your Appointment</DrawerTitle>
          <DrawerDescription>
            Choose a doctor and select your preferred time slot
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-4 max-h-[70vh] overflow-y-auto'>
          <div className='space-y-4'>
            <div>
              <Label className='mb-2 block'>Select Doctor</Label>
              <div className='grid gap-3'>
                {doctors.slice(0, 3).map(doctor => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition ${selectedDoctor?.id === doctor.id ? 'ring-2 ring-blue-600' : ''}`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='w-16 h-16'>
                          <AvatarImage src={doctor.image} />
                          <AvatarFallback>
                            {doctor.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <h4 className='font-semibold'>{doctor.name}</h4>
                          <p className='text-sm text-gray-600'>
                            {doctor.specialty}
                          </p>
                          <div className='flex items-center gap-2 mt-1'>
                            <div className='flex items-center'>
                              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                              <span className='text-sm ml-1'>
                                {doctor.rating}
                              </span>
                            </div>
                            <span className='text-sm text-gray-500'>•</span>
                            <span className='text-sm font-semibold text-blue-600'>
                              {doctor.fee}
                            </span>
                          </div>
                        </div>
                        {doctor.available && (
                          <Badge className='bg-green-100 text-green-700'>
                            Available
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {selectedDoctor && (
              <>
                <div>
                  <Label className='mb-2 block'>Select Date</Label>
                  <Input type='date' />
                </div>
                <div>
                  <Label className='mb-2 block'>Select Time Slot</Label>
                  <div className='grid grid-cols-3 gap-2'>
                    {timeSlots.map(slot => (
                      <Button key={slot} variant='outline' className='w-full'>
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className='mb-2 block'>Reason for Visit</Label>
                  <Input placeholder='Brief description of symptoms' />
                </div>
              </>
            )}
          </div>
        </div>
        <DrawerFooter>
          <Button className='w-full bg-linear-to-r from-blue-600 to-purple-600'>
            Confirm Booking - {selectedDoctor?.fee || '$0'}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookAppointment;
