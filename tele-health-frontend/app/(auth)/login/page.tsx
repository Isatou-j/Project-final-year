'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

import LogoIcon from '@/components/svg/logo-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Form } from '@/components/ui/form';

// Form validation schema
const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email');
  const verified = searchParams.get('verified');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: emailFromParams || '',
      password: '',
    },
  });

  useEffect(() => {
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => setShowVerificationSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [verified]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // Provide more helpful error messages
        if (result.error.includes('404') || result.error.includes('ECONNREFUSED')) {
          alert('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
        } else {
          alert(`Login failed: ${result.error}`);
        }
        return;
      }

      if (result?.ok) {
        // Wait a moment for the session to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the session to determine redirect URL
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();
        
        // Redirect based on role
        let redirectUrl = '/patient/dashboard'; // default
        if (session?.user?.role) {
          const role = session.user.role.toUpperCase();
          switch (role) {
            case 'ADMIN':
              redirectUrl = '/admin/dashboard';
              break;
            case 'PHYSICIAN':
              redirectUrl = '/physician/dashboard';
              break;
            case 'PATIENT':
              redirectUrl = '/patient/dashboard';
              break;
          }
        }
        
        window.location.href = redirectUrl;
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('404')) {
        alert('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      } else {
        alert(`Error logging in: ${errorMessage}. Please try again.`);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center mb-4 gap-3'>
          <div className='w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center'>
            <LogoIcon fill='#F5F6F8' />
          </div>
          <h2 className='text-3xl font-bold'>Welcome Back</h2>
          <p>Sign in to your MediConnect account</p>
        </div>

        {showVerificationSuccess && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
            <div className='flex items-center'>
              <CheckCircle className='w-5 h-5 text-green-600 mr-2' />
              <p className='text-green-800 font-medium'>
                Email verified successfully! Please sign in with your
                credentials.
              </p>
            </div>
          </div>
        )}

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <div className='relative'>
            <Mail className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
            <Input
              id='email'
              type='email'
              placeholder='you@example.com'
              className='pl-10'
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className='text-sm text-red-600'>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <div className='relative'>
            <Lock className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              className='pl-10 pr-10'
              {...form.register('password')}
            />
          </div>
          {form.formState.errors.password && (
            <p className='text-sm text-red-600'>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between text-sm'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input type='checkbox' className='rounded' />
            <span className='text-gray-600'>Remember me</span>
          </label>
          <a href='#' className='text-teal-600 hover:text-teal-700 font-medium'>
            Forgot password?
          </a>
        </div>

        <Button
          type='submit'
          className='w-full bg-teal-600 hover:bg-teal-700'
          size='lg'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className='text-center text-sm'>
          <span className='text-gray-600'>Don't have an account? </span>
          <Link
            href='/register'
            className='text-teal-600 hover:text-teal-700 font-medium'
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default Login;
