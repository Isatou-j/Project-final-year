'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatientProfile, useUpdatePatientProfile } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Loader2,
  User,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  AlertTriangle,
  FileText,
  UserCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  emergencyContact: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const PatientProfilePage = () => {
  const { data: profile, isLoading, isError } = usePatientProfile();
  const updateProfile = useUpdatePatientProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: '',
      bloodType: '',
      allergies: '',
      medicalHistory: '',
    },
  });

  useEffect(() => {
    if (profile) {
      const dateOfBirth = profile.dateOfBirth
        ? format(new Date(profile.dateOfBirth), 'yyyy-MM-dd')
        : '';
      
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth,
        gender: profile.gender || 'MALE',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        emergencyContact: profile.emergencyContact || '',
        bloodType: profile.bloodType || '',
        allergies: profile.allergies || '',
        medicalHistory: profile.medicalHistory || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to update profile. Please try again.',
      );
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <UserCircle className='w-16 h-16 text-gray-400' />
        <h3 className='text-lg font-semibold text-gray-700'>
          Error loading profile
        </h3>
        <p className='text-sm text-gray-500'>
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Profile Settings</h1>
        <p className='text-gray-600 mt-1'>
          Manage your personal information and medical details
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='w-5 h-5' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4' />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='MALE'>Male</SelectItem>
                          <SelectItem value='FEMALE'>Female</SelectItem>
                          <SelectItem value='OTHER'>Other</SelectItem>
                          <SelectItem value='PREFER_NOT_TO_SAY'>
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <Label className='flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Email Address
                </Label>
                <Input
                  value={profile.user?.email || ''}
                  disabled
                  className='bg-gray-50 mt-1'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Email cannot be changed. Contact support if you need to update
                  it.
                </p>
              </div>

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <Phone className='w-4 h-4' />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='+220 XXX XXXX' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='w-5 h-5' />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Main Street' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder='City' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder='State' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='zipCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder='12345' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='emergencyContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Name and phone number'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bloodType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <Droplet className='w-4 h-4' />
                      Blood Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select blood type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='A+'>A+</SelectItem>
                          <SelectItem value='A-'>A-</SelectItem>
                          <SelectItem value='B+'>B+</SelectItem>
                          <SelectItem value='B-'>B-</SelectItem>
                          <SelectItem value='AB+'>AB+</SelectItem>
                          <SelectItem value='AB-'>AB-</SelectItem>
                          <SelectItem value='O+'>O+</SelectItem>
                          <SelectItem value='O-'>O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='allergies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <AlertTriangle className='w-4 h-4' />
                      Allergies
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='List any known allergies (e.g., Penicillin, Peanuts)'
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='medicalHistory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Previous conditions, surgeries, or relevant medical history'
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label>Account Status</Label>
                <div className='mt-2 flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      profile.user?.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className='text-sm'>
                    {profile.user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <Label>Email Verification</Label>
                <div className='mt-2 flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      profile.user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <span className='text-sm'>
                    {profile.user?.isVerified
                      ? 'Verified'
                      : 'Not Verified'}
                  </span>
                </div>
              </div>

              <div>
                <Label>Member Since</Label>
                <p className='text-sm text-gray-600 mt-1'>
                  {format(new Date(profile.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={updateProfile.isPending}
              className='bg-teal-600 hover:bg-teal-700'
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PatientProfilePage;
