'use client';

import React, { useMemo } from 'react';
import { usePhysicianEarnings, usePhysicianPayments } from '@/hooks';
import DataTable from '@/components/table/DataTable';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import type { PhysicianPayment } from '@/hooks/usePhysicianEarnings';

const EarningsPage = () => {
  const { data: earnings, isLoading: earningsLoading } =
    usePhysicianEarnings();
  const { data: payments = [], isLoading: paymentsLoading } =
    usePhysicianPayments();

  const isLoading = earningsLoading || paymentsLoading;

  // Calculate statistics
  const stats = useMemo(() => {
    if (!earnings) {
      return {
        totalEarnings: 0,
        totalTransactions: 0,
        thisMonth: 0,
        lastMonth: 0,
      };
    }

    const now = new Date();
    const thisMonth = now.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
    ).toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
      totalEarnings: earnings.totalEarnings || 0,
      totalTransactions: earnings.totalTransactions || 0,
      thisMonth: earnings.monthlyEarnings[thisMonth] || 0,
      lastMonth: earnings.monthlyEarnings[lastMonth] || 0,
    };
  }, [earnings]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GM', {
      style: 'currency',
      currency: 'GMD',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const columns = [
    {
      key: 'id' as keyof PhysicianPayment,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'appointment' as keyof PhysicianPayment,
      title: 'Patient',
      render: (value: PhysicianPayment['appointment']) => {
        return (
          <div>
            <div className='font-medium'>
              {value.patient.firstName} {value.patient.lastName}
            </div>
            <div className='text-sm text-gray-500'>{value.service.name}</div>
          </div>
        );
      },
    },
    {
      key: 'appointment' as keyof PhysicianPayment,
      title: 'Date',
      render: (value: PhysicianPayment['appointment']) => {
        return formatDate(value.appointmentDate);
      },
    },
    {
      key: 'amount' as keyof PhysicianPayment,
      title: 'Amount',
      render: (value: PhysicianPayment['amount']) => {
        return (
          <span className='font-semibold text-green-600'>
            {formatCurrency(value)}
          </span>
        );
      },
    },
    {
      key: 'paymentMethod' as keyof PhysicianPayment,
      title: 'Payment Method',
      render: (value: PhysicianPayment['paymentMethod']) => {
        const methodColors = {
          CREDIT_CARD: 'bg-blue-100 text-blue-800',
          DEBIT_CARD: 'bg-purple-100 text-purple-800',
          CASH: 'bg-green-100 text-green-800',
          INSURANCE: 'bg-yellow-100 text-yellow-800',
        };

        return (
          <Badge
            className={
              methodColors[value as keyof typeof methodColors] ||
              'bg-gray-100 text-gray-800'
            }
          >
            {value.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'status' as keyof PhysicianPayment,
      title: 'Status',
      render: (value: PhysicianPayment['status']) => {
        const statusColors = {
          PAID: 'bg-green-100 text-green-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          FAILED: 'bg-red-100 text-red-800',
          REFUNDED: 'bg-gray-100 text-gray-800',
        };

        return (
          <Badge
            className={
              statusColors[value as keyof typeof statusColors] ||
              'bg-gray-100 text-gray-800'
            }
          >
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt' as keyof PhysicianPayment,
      title: 'Received',
      render: (value: PhysicianPayment['createdAt']) => formatDate(value),
    },
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 px-6 py-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Earnings</h1>
        <p className='text-gray-600'>
          Track your earnings and payment history
        </p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-green-600' />
              <span className='text-2xl font-bold'>
                {formatCurrency(stats.totalEarnings)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <CreditCard className='w-5 h-5 text-blue-600' />
              <span className='text-2xl font-bold'>
                {stats.totalTransactions}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-teal-600' />
              <span className='text-2xl font-bold'>
                {formatCurrency(stats.thisMonth)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Last Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-gray-600' />
              <span className='text-2xl font-bold'>
                {formatCurrency(stats.lastMonth)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View all your payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            loading={paymentsLoading}
            searchPlaceholder='Search by patient name or service...'
            emptyMessage='No payments found.'
            enableSorting
            enableFiltering
            enablePagination
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
