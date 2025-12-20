'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import LogoIcon from '@/components/svg/logo-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  Hash,
} from 'lucide-react';
import Link from 'next/link';
import { registerPatient, registerPhysician } from '@/lib/auth-api';

// Form schemas without transformation for React Hook Form
const PatientFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Invalid gender'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
});

const PhysicianFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  yearsOfExperience: z
    .number()
    .min(0, 'Years of experience must be non-negative'),
  qualification: z.string().min(1, 'Qualification is required'),
  consultationFee: z
    .number()
    .min(0, 'Consultation fee must be non-negative')
    .optional(),
});

type PatientFormData = z.infer<typeof PatientFormSchema>;
type PhysicianFormData = z.infer<typeof PhysicianFormSchema>;

const Register = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const patientForm = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const physicianForm = useForm<PhysicianFormData>({
    resolver: zodResolver(PhysicianFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      specialization: '',
      licenseNumber: '',
      yearsOfExperience: 0,
      qualification: '',
      consultationFee: 0,
    },
  });

  const onPatientSubmit = async (data: PatientFormData) => {
    try {
      setIsLoading(true);

      // Transform dateOfBirth for API
      const apiData = {
        ...data,
        dateOfBirth: data.dateOfBirth, // Keep as string for now, API will handle transformation
      };

      const result = await registerPatient(apiData);

      // Navigate to email verification page
      router.push(`/verify-email/${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error('Patient registration error:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };
  const onPhysicianSubmit = async (data: PhysicianFormData) => {
    try {
      setIsLoading(true);

      // Prepare data for API - ensure numbers are properly formatted
      const apiData: any = {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        specialization: data.specialization.trim(),
        licenseNumber: data.licenseNumber.trim(),
        yearsOfExperience: Number(data.yearsOfExperience) || 0,
        qualification: data.qualification.trim(),
      };

      // Only include consultationFee if it's provided and greater than 0
      if (data.consultationFee && data.consultationFee > 0) {
        apiData.consultationFee = Number(data.consultationFee);
      }

      console.log('Sending physician registration data:', apiData);

      const result = await registerPhysician(apiData);

      toast.success('Registration successful! Please check your email for verification code.');
      
      // Navigate to email verification page
      router.push(`/verify-email/${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error('Physician registration error:', error);
      console.error('Error response:', error?.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle Zod validation errors
        if (errorData.errors || errorData.issues) {
          const issues = errorData.errors || errorData.issues || [];
          const messages = issues.map((issue: any) => 
            `${issue.path?.join('.') || 'field'}: ${issue.message}`
          ).join(', ');
          errorMessage = `Validation error: ${messages}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className='flex flex-col items-center mb-4 gap-3'>
        <div className='w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center'>
          <LogoIcon fill='#F5F6F8' />
        </div>
        <h2 className='text-3xl font-bold'>Create Account</h2>
        <p>Join MediConnect and start your healthcare journey</p>
      </div>

      <Tabs
        defaultValue='patient'
        onValueChange={value => setActiveTab(value as 'patient' | 'doctor')}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='patient'>Patient</TabsTrigger>
          <TabsTrigger value='doctor'>Doctor</TabsTrigger>
        </TabsList>
        <TabsContent value='patient' className='space-y-4 mt-4'>
          <form
            onSubmit={patientForm.handleSubmit(onPatientSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    id='firstName'
                    placeholder='John'
                    className='pl-10'
                    {...patientForm.register('firstName')}
                  />
                </div>
                {patientForm.formState.errors.firstName && (
                  <p className='text-sm text-red-600'>
                    {patientForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  placeholder='Doe'
                  {...patientForm.register('lastName')}
                />
                {patientForm.formState.errors.lastName && (
                  <p className='text-sm text-red-600'>
                    {patientForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='username'
                  placeholder='johndoe123'
                  className='pl-10'
                  {...patientForm.register('username')}
                />
              </div>
              {patientForm.formState.errors.username && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  className='pl-10'
                  {...patientForm.register('email')}
                />
              </div>
              {patientForm.formState.errors.email && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone Number</Label>
              <div className='relative'>
                <Phone className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='phone'
                  type='tel'
                  placeholder='+1 (555) 000-0000'
                  className='pl-10'
                  {...patientForm.register('phoneNumber')}
                />
              </div>
              {patientForm.formState.errors.phoneNumber && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dateOfBirth'>Date of Birth</Label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='dateOfBirth'
                  type='date'
                  className='pl-10'
                  {...patientForm.register('dateOfBirth')}
                />
              </div>
              {patientForm.formState.errors.dateOfBirth && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                onValueChange={value =>
                  patientForm.setValue(
                    'gender',
                    value as 'MALE' | 'FEMALE' | 'OTHER',
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='MALE'>Male</SelectItem>
                  <SelectItem value='FEMALE'>Female</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectContent>
              </Select>
              {patientForm.formState.errors.gender && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.gender.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <div className='relative'>
                <MapPin className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='address'
                  placeholder='123 Main St'
                  className='pl-10'
                  {...patientForm.register('address')}
                />
              </div>
              {patientForm.formState.errors.address && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='city'>City</Label>
                <div className='relative'>
                  <Building className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    id='city'
                    placeholder='New York'
                    className='pl-10'
                    {...patientForm.register('city')}
                  />
                </div>
                {patientForm.formState.errors.city && (
                  <p className='text-sm text-red-600'>
                    {patientForm.formState.errors.city.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Input
                  id='state'
                  placeholder='NY'
                  {...patientForm.register('state')}
                />
                {patientForm.formState.errors.state && (
                  <p className='text-sm text-red-600'>
                    {patientForm.formState.errors.state.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='zipCode'>Zip Code</Label>
                <div className='relative'>
                  <Hash className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    id='zipCode'
                    placeholder='10001'
                    className='pl-10'
                    {...patientForm.register('zipCode')}
                  />
                </div>
                {patientForm.formState.errors.zipCode && (
                  <p className='text-sm text-red-600'>
                    {patientForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='pl-10'
                  {...patientForm.register('password')}
                />
              </div>
              {patientForm.formState.errors.password && (
                <p className='text-sm text-red-600'>
                  {patientForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <label className='flex items-start gap-2 cursor-pointer text-sm'>
              <input type='checkbox' className='mt-1 rounded' />
              <span className='text-gray-600'>
                I agree to the{' '}
                <a href='#' className='text-teal-600 hover:underline'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='#' className='text-teal-600 hover:underline'>
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button
              type='submit'
              className='w-full bg-teal-600 hover:bg-teal-700'
              size='lg'
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Patient Account'}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value='doctor' className='space-y-4 mt-4'>
          <form
            onSubmit={physicianForm.handleSubmit(onPhysicianSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='docFirstName'>First Name</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    id='docFirstName'
                    placeholder='Dr. Jane'
                    className='pl-10'
                    {...physicianForm.register('firstName')}
                  />
                </div>
                {physicianForm.formState.errors.firstName && (
                  <p className='text-sm text-red-600'>
                    {physicianForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='docLastName'>Last Name</Label>
                <Input
                  id='docLastName'
                  placeholder='Smith'
                  {...physicianForm.register('lastName')}
                />
                {physicianForm.formState.errors.lastName && (
                  <p className='text-sm text-red-600'>
                    {physicianForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='docUsername'>Username</Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='docUsername'
                  placeholder='drjanesmith'
                  className='pl-10'
                  {...physicianForm.register('username')}
                />
              </div>
              {physicianForm.formState.errors.username && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='docEmail'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='docEmail'
                  type='email'
                  placeholder='doctor@example.com'
                  className='pl-10'
                  {...physicianForm.register('email')}
                />
              </div>
              {physicianForm.formState.errors.email && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='specialization'>Specialization</Label>
              <Input
                id='specialization'
                placeholder='e.g., Cardiology'
                {...physicianForm.register('specialization')}
              />
              {physicianForm.formState.errors.specialization && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.specialization.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='license'>Medical License Number</Label>
              <Input
                id='license'
                placeholder='License #'
                {...physicianForm.register('licenseNumber')}
              />
              {physicianForm.formState.errors.licenseNumber && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='experience'>Years of Experience</Label>
                <Input
                  id='experience'
                  type='number'
                  placeholder='5'
                  min='0'
                  {...physicianForm.register('yearsOfExperience', {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === '' ? 0 : Number(v)),
                  })}
                />
                {physicianForm.formState.errors.yearsOfExperience && (
                  <p className='text-sm text-red-600'>
                    {physicianForm.formState.errors.yearsOfExperience.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='fee'>Consultation Fee ($)</Label>
                <Input
                  id='fee'
                  type='number'
                  placeholder='50 (optional)'
                  min='0'
                  step='0.01'
                  {...physicianForm.register('consultationFee', {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === '' || isNaN(v) ? undefined : Number(v)),
                  })}
                />
                {physicianForm.formState.errors.consultationFee && (
                  <p className='text-sm text-red-600'>
                    {physicianForm.formState.errors.consultationFee.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='qualification'>Qualification</Label>
              <Input
                id='qualification'
                placeholder='MD, MBBS, etc.'
                {...physicianForm.register('qualification')}
              />
              {physicianForm.formState.errors.qualification && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.qualification.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='docPassword'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                <Input
                  id='docPassword'
                  type='password'
                  placeholder='••••••••'
                  className='pl-10'
                  {...physicianForm.register('password')}
                />
              </div>
              {physicianForm.formState.errors.password && (
                <p className='text-sm text-red-600'>
                  {physicianForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <label className='flex items-start gap-2 cursor-pointer text-sm'>
              <input type='checkbox' className='mt-1 rounded' />
              <span className='text-gray-600'>
                I agree to the{' '}
                <a href='#' className='text-teal-600 hover:underline'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='#' className='text-teal-600 hover:underline'>
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button
              type='submit'
              className='w-full bg-teal-600 hover:bg-teal-700'
              size='lg'
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Doctor Account'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className='text-center text-sm mt-6'>
        <span className='text-gray-600'>Already have an account? </span>
        <Link
          href='/login'
          className='text-teal-600 hover:text-teal-700 font-medium'
        >
          Sign in
        </Link>
      </div>
    </>
  );
};

export default Register;
