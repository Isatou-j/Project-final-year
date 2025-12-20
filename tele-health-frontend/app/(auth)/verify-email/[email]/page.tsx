'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import LogoIcon from '@/components/svg/logo-icon';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VerifyEmailSchema } from '@/utils/schema/auth.schema';
import { verifyEmail, resendVerificationEmail } from '@/lib/auth-api';

type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: email,
      code: '',
    },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setIsLoading(true);

      const result = await verifyEmail({
        email: data.email,
        code: data.code,
      });

      // Redirect to login page with email pre-filled
      router.push(
        `/login?email=${encodeURIComponent(data.email)}&verified=true`,
      );
    } catch (error: any) {
      console.error('Email verification error:', error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Verification failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResendLoading(true);
      setResendMessage('');

      await resendVerificationEmail(email);

      setResendMessage(
        'Verification code sent successfully! Check your email.',
      );
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setResendMessage(
        error?.response?.data?.message ||
          error.message ||
          'Failed to resend verification code. Please try again.',
      );
    } finally {
      setIsResendLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    form.setValue('code', value);

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className='max-w-md w-full space-y-8'>
      <div className='flex flex-col items-center mb-4 gap-3'>
        <div className='w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center'>
          <LogoIcon fill='#F5F6F8' />
        </div>
        <h2 className='text-3xl font-bold'>Verify Your Email</h2>
        <p className='text-center text-gray-600'>
          We've sent a 6-digit verification code to
          <br />
          <span className='font-medium text-teal-600'>{email}</span>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Hidden input for form validation */}
        <input type='hidden' {...form.register('code')} />

        <div className='space-y-4'>
          <Label htmlFor='otp' className='text-center block'>
            Enter Verification Code
          </Label>
          <div className='flex justify-center'>
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={handleOtpChange}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {form.formState.errors.code && (
            <p className='text-sm text-red-600 text-center'>
              {form.formState.errors.code.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          className='w-full bg-teal-600 hover:bg-teal-700'
          size='lg'
          disabled={isLoading || otpValue.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className='text-center space-y-4'>
        {resendMessage && (
          <p
            className={`text-sm ${resendMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
          >
            {resendMessage}
          </p>
        )}
        <p className='text-sm text-gray-600'>
          Didn't receive the code?{' '}
          <button
            type='button'
            className='text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50'
            onClick={handleResendCode}
            disabled={isResendLoading}
          >
            {isResendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </p>

        <Link
          href='/register'
          className='inline-flex items-center text-sm text-gray-600 hover:text-teal-600'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Registration
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
