'use client';

import React, { useState } from 'react';
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/hooks';
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
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Service, CreateServicePayload, UpdateServicePayload } from '@/types/service';

const ServicesPage = () => {
  const [isActiveFilter, setIsActiveFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, error } = useAdminServices({
    isActive:
      isActiveFilter !== 'all'
        ? isActiveFilter === 'active'
        : undefined,
  });

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [formData, setFormData] = useState<CreateServicePayload>({
    name: '',
    description: '',
    icon: '',
    isActive: true,
  });

  const handleCreate = async () => {
    try {
      await createService.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        icon: '',
        isActive: true,
      });
      alert('Service created successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to create service. Please try again.',
      );
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon || '',
      isActive: service.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    try {
      await updateService.mutateAsync({
        id: editingService.id,
        data: formData as UpdateServicePayload,
      });
      setIsEditDialogOpen(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        isActive: true,
      });
      alert('Service updated successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to update service. Please try again.',
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteService.mutateAsync(id);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      alert('Service deleted successfully!');
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          'Failed to delete service. Please try again.',
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
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const columns = [
    {
      key: 'id' as keyof Service,
      title: 'ID',
      width: '80px',
    },
    {
      key: 'name' as keyof Service,
      title: 'Name',
    },
    {
      key: 'description' as keyof Service,
      title: 'Description',
      render: (value: Service['description']) => {
        return (
          <span className='max-w-md truncate block' title={value}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'icon' as keyof Service,
      title: 'Icon',
      render: (value: Service['icon']) => {
        return value ? (
          <span className='text-lg'>{value}</span>
        ) : (
          <span className='text-gray-400'>N/A</span>
        );
      },
    },
    {
      key: '_count' as keyof Service,
      title: 'Appointments',
      render: (value: Service['_count']) => {
        return value?.appointments || 0;
      },
    },
    {
      key: 'isActive' as keyof Service,
      title: 'Status',
      render: (value: Service['isActive']) => {
        return value ? (
          <Badge className='bg-green-100 text-green-800 flex items-center gap-1 w-fit'>
            <CheckCircle className='w-3 h-3' />
            Active
          </Badge>
        ) : (
          <Badge className='bg-gray-100 text-gray-800 flex items-center gap-1 w-fit'>
            <XCircle className='w-3 h-3' />
            Inactive
          </Badge>
        );
      },
    },
    {
      key: 'createdAt' as keyof Service,
      title: 'Created',
      render: (value: Service['createdAt']) => formatDate(value),
    },
    {
      render: (value: number, row?: Service) => {
        if (!row) return null;

        return (
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(row)}
            >
              <Edit className='w-4 h-4 mr-1' />
              Edit
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => {
                setDeletingId(row.id);
                setDeleteConfirmOpen(true);
              }}
              disabled={deleteService.isPending}
            >
              <Trash2 className='w-4 h-4 mr-1' />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            Error loading services: {error.message}
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
            Services Management
          </h1>
          <p className='text-gray-600'>
            Manage healthcare services offered on the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-teal-600 hover:bg-teal-700'>
              <Plus className='w-4 h-4 mr-2' />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new healthcare service to the platform
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Service Name *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g., General Consultation'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder='Describe the service...'
                  rows={3}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='icon'>Icon (Emoji)</Label>
                <Input
                  id='icon'
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder='e.g., 🏥'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='isActive'>Status</Label>
                <Select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      isActive: value === 'active',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.description || createService.isPending}
                className='bg-teal-600 hover:bg-teal-700'
              >
                {createService.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex items-center gap-4 px-6'>
        <div className='flex items-center gap-2'>
          <label htmlFor='status-filter' className='text-sm font-medium text-gray-700'>
            Filter by Status:
          </label>
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
            <SelectTrigger id='status-filter' className='w-[180px]'>
              <SelectValue placeholder='All Statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Services</SelectItem>
              <SelectItem value='active'>Active Only</SelectItem>
              <SelectItem value='inactive'>Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(data?.services) ? data.services : []}
        loading={isLoading}
        searchPlaceholder='Search services by name or description...'
        emptyMessage='No services found.'
        enableSorting
        enableFiltering
        enablePagination
        pageSize={10}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service information
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-name'>Service Name *</Label>
              <Input
                id='edit-name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='e.g., General Consultation'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-description'>Description *</Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Describe the service...'
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-icon'>Icon (Emoji)</Label>
              <Input
                id='edit-icon'
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder='e.g., 🏥'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-isActive'>Status</Label>
              <Select
                value={formData.isActive ? 'active' : 'inactive'}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    isActive: value === 'active',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingService(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!formData.name || !formData.description || updateService.isPending}
              className='bg-teal-600 hover:bg-teal-700'
            >
              {updateService.isPending ? 'Updating...' : 'Update Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone. Services with appointments cannot be deleted.
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
              disabled={deleteService.isPending}
            >
              {deleteService.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
