'use client';

import React, { useState } from 'react';
import { useAdminReviews, useDeleteReview } from '@/hooks';
import DataTable from '@/components/table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Trash2 } from 'lucide-react';
import type { AdminReview } from '@/hooks/useReviews';

const ReviewsPage = () => {
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, error } = useAdminReviews({
    rating:
      ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
  });

  const deleteReview = useDeleteReview();

  const handleDelete = async (id: number) => {
    try {
      await deleteReview.mutateAsync(id);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      alert('Review deleted successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to delete review. Please try again.',
      );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className='ml-2 text-sm text-gray-600'>({rating}/5)</span>
      </div>
    );
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const columns = [
    {
      key: 'id' as keyof AdminReview,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'physician' as keyof AdminReview,
      title: 'Physician',
      render: (value: AdminReview['physician']) => {
        if (!value) return 'N/A';
        return (
          <div>
            <div className='font-medium'>
              Dr. {value.firstName} {value.lastName}
            </div>
            <div className='text-sm text-gray-500'>{value.specialization}</div>
          </div>
        );
      },
    },
    {
      key: 'patientName' as keyof AdminReview,
      title: 'Patient',
    },
    {
      key: 'rating' as keyof AdminReview,
      title: 'Rating',
      render: (value: AdminReview['rating']) => {
        return (
          <div className='flex items-center gap-2'>
            {renderStars(value)}
            <Badge className={getRatingBadgeColor(value)}>{value}/5</Badge>
          </div>
        );
      },
    },
    {
      key: 'comment' as keyof AdminReview,
      title: 'Comment',
      render: (value: AdminReview['comment']) => {
        if (!value) {
          return <span className='text-gray-400 italic'>No comment</span>;
        }
        return (
          <div className='max-w-md'>
            <p className='text-sm line-clamp-2' title={value}>
              {value}
            </p>
          </div>
        );
      },
    },
    {
      key: 'createdAt' as keyof AdminReview,
      title: 'Date',
      render: (value: AdminReview['createdAt']) => formatDate(value),
    },
    {
      key: 'actions' as keyof AdminReview,
      title: 'Actions',
      render: (value: number, row?: AdminReview) => {
        if (!row) return null;

        return (
          <Button
            size='sm'
            variant='destructive'
            onClick={() => {
              setDeletingId(row.id);
              setDeleteConfirmOpen(true);
            }}
            disabled={deleteReview.isPending}
          >
            <Trash2 className='w-4 h-4 mr-1' />
            Delete
          </Button>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading reviews: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between px-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Reviews Management
          </h1>
          <p className='text-gray-600'>
            View and manage patient reviews and ratings
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4 px-6'>
        <div className='flex items-center gap-2'>
          <label htmlFor='rating-filter' className='text-sm font-medium text-gray-700'>
            Filter by Rating:
          </label>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger id='rating-filter' className='w-[180px]'>
              <SelectValue placeholder='All Ratings' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Ratings</SelectItem>
              <SelectItem value='5'>5 Stars</SelectItem>
              <SelectItem value='4'>4 Stars</SelectItem>
              <SelectItem value='3'>3 Stars</SelectItem>
              <SelectItem value='2'>2 Stars</SelectItem>
              <SelectItem value='1'>1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {ratingFilter !== 'all' && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setRatingFilter('all')}
          >
            Clear Filter
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(data?.reviews) ? data.reviews : []}
        loading={isLoading}
        searchPlaceholder='Search by patient name or comment...'
        emptyMessage='No reviews found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeletingId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (deletingId) {
                  handleDelete(deletingId);
                }
              }}
              disabled={deleteReview.isPending}
            >
              {deleteReview.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsPage;
