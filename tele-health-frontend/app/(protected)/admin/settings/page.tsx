'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
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
import { Separator } from '@/components/ui/separator';
import { User, Lock, Image as ImageIcon, Save, Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  profileUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SettingsPage = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch current user profile
  const { data: userData, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: UserProfile }>('/user/me');
      return response.data.data;
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const response = await apiClient.put('/user/profile-details', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      alert('Profile updated successfully!');
    },
  });

  // Change password mutation
  const changePassword = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await apiClient.post('/auth/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    },
  });

  // Update profile picture mutation
  const updateProfilePicture = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiClient.put('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      alert('Profile picture updated successfully!');
    },
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.username || '',
        email: userData.email || '',
        username: userData.username || '',
      });
    }
  }, [userData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name: profileData.name,
        email: profileData.email,
      });
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update profile. Please try again.',
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }

    try {
      await changePassword.mutateAsync({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to change password. Please try again.',
      );
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      await updateProfilePicture.mutateAsync(file);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update profile picture. Please try again.',
      );
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
        <p className='text-gray-600'>Manage your account settings and preferences</p>
      </div>

      <div className='grid gap-6'>
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <User className='w-5 h-5 text-teal-600' />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your profile information and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  placeholder='Enter your name'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder='Enter your email'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={profileData.username}
                  disabled
                  className='bg-gray-50'
                  placeholder='Username (read-only)'
                />
                <p className='text-xs text-gray-500'>
                  Username cannot be changed
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  type='submit'
                  disabled={updateProfile.isPending}
                  className='bg-teal-600 hover:bg-teal-700'
                >
                  {updateProfile.isPending ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
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
          </CardContent>
        </Card>

        {/* Profile Picture Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <ImageIcon className='w-5 h-5 text-teal-600' />
              <CardTitle>Profile Picture</CardTitle>
            </div>
            <CardDescription>
              Update your profile picture. Max size: 5MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <img
                  src={
                    userData?.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData?.username || userData?.email || 'Admin',
                    )}&background=0f766e&color=fff&size=128`
                  }
                  alt='Profile'
                  className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
                />
              </div>
              <div className='flex-1'>
                <Label htmlFor='profile-picture' className='cursor-pointer'>
                  <div className='inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
                    <ImageIcon className='w-4 h-4' />
                    {updateProfilePicture.isPending
                      ? 'Uploading...'
                      : 'Choose Image'}
                  </div>
                </Label>
                <Input
                  id='profile-picture'
                  type='file'
                  accept='image/*'
                  onChange={handleProfilePictureChange}
                  className='hidden'
                  disabled={updateProfilePicture.isPending}
                />
                <p className='mt-2 text-sm text-gray-500'>
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Lock className='w-5 h-5 text-teal-600' />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='old-password'>Current Password</Label>
                <div className='relative'>
                  <Input
                    id='old-password'
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder='Enter current password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showOldPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='new-password'>New Password</Label>
                <div className='relative'>
                  <Input
                    id='new-password'
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder='Enter new password (min 6 characters)'
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showNewPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <div className='relative'>
                  <Input
                    id='confirm-password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder='Confirm new password'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  type='submit'
                  disabled={changePassword.isPending}
                  className='bg-teal-600 hover:bg-teal-700'
                >
                  {changePassword.isPending ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock className='w-4 h-4 mr-2' />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700'>
                  Account Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData?.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {userData?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700'>
                  Email Verification
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData?.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {userData?.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700'>
                  Member Since
                </span>
                <span className='text-sm text-gray-600'>
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
