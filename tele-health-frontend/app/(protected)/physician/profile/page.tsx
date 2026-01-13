'use client';

import React, { useState, useEffect } from 'react';
import {
  usePhysicianProfile,
  useUpdatePhysicianProfile,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Save,
  Image as ImageIcon,
  Mail,
  Briefcase,
  Award,
  DollarSign,
  Calendar,
} from 'lucide-react';

const PhysicianProfilePage = () => {
  const { data: profile, isLoading } = usePhysicianProfile();
  const updateProfile = useUpdatePhysicianProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    yearsOfExperience: '',
    qualification: '',
    bio: '',
    consultationFee: 0,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        specialization: profile.specialization || '',
        yearsOfExperience: String(profile.yearsOfExperience || 0),
        qualification: profile.qualification || '',
        bio: profile.bio || '',
        consultationFee: profile.consultationFee || 0,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        qualification: formData.qualification,
        bio: formData.bio,
        consultationFee: formData.consultationFee,
      });
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update profile. Please try again.',
      );
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Note: Profile picture update would need a separate endpoint
    alert('Profile picture upload functionality coming soon');
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>My Profile</h1>
        <p className='text-gray-600'>Manage your professional profile information</p>
      </div>

      <div className='grid gap-6'>
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
                    profile.profileImage ||
                    profile.user?.profileUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${profile.firstName} ${profile.lastName}`,
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
                    Choose Image
                  </div>
                </Label>
                <Input
                  id='profile-picture'
                  type='file'
                  accept='image/*'
                  onChange={handleProfilePictureChange}
                  className='hidden'
                />
                <p className='mt-2 text-sm text-gray-500'>
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <User className='w-5 h-5 text-teal-600' />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your professional information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name *</Label>
                  <Input
                    id='firstName'
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name *</Label>
                  <Input
                    id='lastName'
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='specialization'>Specialization *</Label>
                <Input
                  id='specialization'
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder='e.g., Cardiology, Dermatology'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='yearsOfExperience'>Years of Experience *</Label>
                  <Input
                    id='yearsOfExperience'
                    type='number'
                    min='0'
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='consultationFee'>Consultation Fee (GMD) *</Label>
                  <Input
                    id='consultationFee'
                    type='number'
                    min='0'
                    step='0.01'
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='qualification'>Qualification *</Label>
                <Input
                  id='qualification'
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                  placeholder='e.g., MD, MBBS, PhD'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder='Tell patients about yourself...'
                  rows={4}
                />
              </div>

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
                <div className='flex items-center gap-2'>
                  <Mail className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>Email</span>
                </div>
                <span className='text-sm text-gray-900'>
                  {profile.user?.email || 'N/A'}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Briefcase className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    License Number
                  </span>
                </div>
                <span className='text-sm text-gray-900'>
                  {profile.licenseNumber}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Award className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>Status</span>
                </div>
                <Badge
                  className={
                    profile.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : profile.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : profile.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }
                >
                  {profile.status}
                </Badge>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <DollarSign className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    Consultation Fee
                  </span>
                </div>
                <span className='text-sm text-gray-900'>
                  {profile.consultationFee} GMD
                </span>
              </div>
              <Separator />
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    Member Since
                  </span>
                </div>
                <span className='text-sm text-gray-600'>
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhysicianProfilePage;
