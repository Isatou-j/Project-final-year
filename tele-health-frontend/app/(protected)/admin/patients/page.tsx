'use client';

import React from 'react';
import { useAdminPatients } from '@/hooks';
import DataTable from '@/components/table/DataTable';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '@/types/patient';

const PatientsPage = () => {
  const { data, isLoading, error } = useAdminPatients();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const columns = [
    {
      key: 'id' as keyof Patient,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'firstName' as keyof Patient,
      title: 'First Name',
    },
    {
      key: 'lastName' as keyof Patient,
      title: 'Last Name',
    },
    {
      key: 'user.email' as keyof Patient,
      title: 'Email',
      render: (value: Patient['user']) => value?.email || 'N/A',
    },
    {
      key: 'phoneNumber' as keyof Patient,
      title: 'Phone',
    },
    {
      key: 'dateOfBirth' as keyof Patient,
      title: 'Age',
      render: (value: Patient['dateOfBirth']) => {
        const age = calculateAge(value);
        return `${age} years`;
      },
    },
    {
      key: 'gender' as keyof Patient,
      title: 'Gender',
      render: (value: Patient['gender']) => {
        const genderColors = {
          MALE: 'bg-blue-100 text-blue-800',
          FEMALE: 'bg-pink-100 text-pink-800',
          OTHER: 'bg-purple-100 text-purple-800',
          PREFER_NOT_TO_SAY: 'bg-gray-100 text-gray-800',
        };

        return (
          <Badge
            className={genderColors[value] || 'bg-gray-100 text-gray-800'}
          >
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'city' as keyof Patient,
      title: 'Location',
      render: (_: Patient['city'], row?: Patient) => {
        if (!row) return 'N/A';
        return `${row.city}, ${row.state}`;
      },
    },
    {
      key: 'user' as keyof Patient,
      title: 'Status',
      render: (value: Patient['user'], row?: Patient) => {
        if (!row || !value) return null;

        const isVerified = value.isVerified;
        const isActive = value.isActive;

        if (!isActive) {
          return <Badge className='bg-red-100 text-red-800'>Inactive</Badge>;
        }

        if (isVerified) {
          return <Badge className='bg-green-100 text-green-800'>Verified</Badge>;
        }

        return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>;
      },
    },
    {
      key: 'createdAt' as keyof Patient,
      title: 'Joined',
      render: (value: Patient['createdAt']) => formatDate(value),
    },
  ];

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading patients: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Patients Management
          </h1>
          <p className='text-gray-600'>
            View and manage all registered patients
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.patients || []}
        loading={isLoading}
        searchPlaceholder='Search patients by name, email, or phone...'
        emptyMessage='No patients found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />
    </div>
  );
};

export default PatientsPage;
