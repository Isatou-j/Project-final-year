'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  usePhysicianAvailability,
  useUpdateAvailability,
  useUpdateAvailabilityStatus,
  usePhysicianProfile,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Save, Calendar } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const AvailabilityPage = () => {
  const { data: profile } = usePhysicianProfile();
  const { data: availabilities = [], isLoading } = usePhysicianAvailability();
  const updateAvailability = useUpdateAvailability();
  const updateAvailabilityStatus = useUpdateAvailabilityStatus();

  // Memoize initial data to prevent unnecessary recalculations
  const initialData = useMemo(() => {
    const data: Record<
      number,
      { startTime: string; endTime: string; isAvailable: boolean }
    > = {};

    DAYS_OF_WEEK.forEach((day) => {
      const existing = availabilities.find((a) => a.dayOfWeek === day.value);
      data[day.value] = {
        startTime: existing?.startTime || '09:00',
        endTime: existing?.endTime || '17:00',
        isAvailable: existing?.isAvailable ?? true,
      };
    });

    return data;
  }, [availabilities]);

  const [availabilityData, setAvailabilityData] = useState<
    Record<number, { startTime: string; endTime: string; isAvailable: boolean }>
  >(initialData);

  const [globalAvailable, setGlobalAvailable] = useState(false);
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (profile) {
      setGlobalAvailable(profile.isAvailable || false);
    }
  }, [profile]);

  // Only update state when initialData actually changes (not just reference)
  useEffect(() => {
    // Create a stable string representation for comparison
    const currentDataString = JSON.stringify(initialData);
    
    // Only update if the data has actually changed
    if (previousDataRef.current !== currentDataString) {
      setAvailabilityData(initialData);
      previousDataRef.current = currentDataString;
    }
  }, [initialData]);

  const handleDayToggle = (dayOfWeek: number) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        isAvailable: !prev[dayOfWeek].isAvailable,
      },
    }));
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const availabilitiesArray = DAYS_OF_WEEK.map((day) => ({
        dayOfWeek: day.value,
        ...availabilityData[day.value],
      }));

      await updateAvailability.mutateAsync(availabilitiesArray);
      alert('Availability updated successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update availability. Please try again.',
      );
    }
  };

  const handleGlobalToggle = async (checked: boolean) => {
    try {
      setGlobalAvailable(checked);
      await updateAvailabilityStatus.mutateAsync(checked);
      alert(
        checked
          ? 'You are now available for appointments'
          : 'You are now unavailable for appointments',
      );
    } catch (error: any) {
      setGlobalAvailable(!checked);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update availability status. Please try again.',
      );
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Availability</h1>
        <p className='text-gray-600'>
          Set your weekly availability schedule for appointments
        </p>
      </div>

      {/* Global Availability Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Status</CardTitle>
          <CardDescription>
            Toggle your overall availability for receiving appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-900'>
                {globalAvailable ? 'Available' : 'Unavailable'}
              </p>
              <p className='text-sm text-gray-500'>
                {globalAvailable
                  ? 'Patients can book appointments with you'
                  : 'No new appointments will be accepted'}
              </p>
            </div>
            <Switch
              checked={globalAvailable}
              onCheckedChange={handleGlobalToggle}
              disabled={updateAvailabilityStatus.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Calendar className='w-5 h-5 text-teal-600' />
            <CardTitle>Weekly Schedule</CardTitle>
          </div>
          <CardDescription>
            Set your working hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {DAYS_OF_WEEK.map((day) => {
              const dayData = availabilityData[day.value];
              if (!dayData) return null;

              return (
                <div
                  key={day.value}
                  className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg'
                >
                  <div className='w-32'>
                    <Label className='text-sm font-medium'>{day.label}</Label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={dayData.isAvailable}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <span className='text-sm text-gray-600'>
                      {dayData.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {dayData.isAvailable && (
                    <>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-gray-500' />
                        <Label htmlFor={`start-${day.value}`} className='text-sm'>
                          From
                        </Label>
                        <Input
                          id={`start-${day.value}`}
                          type='time'
                          value={dayData.startTime}
                          onChange={(e) =>
                            handleTimeChange(day.value, 'startTime', e.target.value)
                          }
                          className='w-32'
                        />
                      </div>
                      <div className='flex items-center gap-2'>
                        <Label htmlFor={`end-${day.value}`} className='text-sm'>
                          To
                        </Label>
                        <Input
                          id={`end-${day.value}`}
                          type='time'
                          value={dayData.endTime}
                          onChange={(e) =>
                            handleTimeChange(day.value, 'endTime', e.target.value)
                          }
                          className='w-32'
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className='mt-6 flex justify-end'>
            <Button
              onClick={handleSave}
              disabled={updateAvailability.isPending}
              className='bg-teal-600 hover:bg-teal-700'
            >
              {updateAvailability.isPending ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Save Schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityPage;
