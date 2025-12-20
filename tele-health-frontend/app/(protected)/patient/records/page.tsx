'use client';

import React, { useMemo, useState } from 'react';
import { usePatientMedicalRecords } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

const DOCUMENT_TYPES = [
  'Lab Report',
  'X-Ray',
  'Prescription',
  'Medical Certificate',
  'Discharge Summary',
  'Test Results',
  'Other',
];

const MedicalRecordsPage = () => {
  const { data: records, isLoading, isError } = usePatientMedicalRecords();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const medicalRecords = useMemo(() => {
    if (!records) return [];
    return Array.isArray(records) ? records : [];
  }, [records]);

  const filteredRecords = useMemo(() => {
    let filtered = medicalRecords;

    // Filter by document type
    if (filterType !== 'all') {
      filtered = filtered.filter(
        record => record.documentType.toLowerCase() === filterType.toLowerCase(),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.documentName.toLowerCase().includes(query) ||
          record.documentType.toLowerCase().includes(query) ||
          record.uploadedBy.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [medicalRecords, filterType, searchQuery]);

  const documentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    medicalRecords.forEach(record => {
      const type = record.documentType;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [medicalRecords]);

  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownloadDocument = (fileUrl: string, documentName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <FileText className='w-16 h-16 text-gray-400' />
        <h3 className='text-lg font-semibold text-gray-700'>
          Error loading medical records
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
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Medical Records</h1>
          <p className='text-gray-600 mt-1'>
            View and manage your medical documents
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='text-sm'>
            {medicalRecords.length} Total Records
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 md:flex-row'>
            {/* Search */}
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='Search by document name, type, or uploaded by...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Filter by Type */}
            <div className='md:w-64'>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type} ({documentTypeCounts[type] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <FileText className='w-16 h-16 text-gray-300 mb-4' />
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              {medicalRecords.length === 0
                ? 'No medical records found'
                : 'No records match your search'}
            </h3>
            <p className='text-sm text-gray-500 text-center max-w-md'>
              {medicalRecords.length === 0
                ? 'Your medical records will appear here once they are uploaded by your healthcare provider.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {filteredRecords.map(record => (
            <Card key={record.id} className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-lg mb-2'>
                      {record.documentName}
                    </CardTitle>
                    <div className='flex flex-wrap items-center gap-3 text-sm text-gray-600'>
                      <Badge variant='secondary' className='font-normal'>
                        {record.documentType}
                      </Badge>
                      <div className='flex items-center gap-1'>
                        <User className='w-4 h-4' />
                        <span>Uploaded by: {record.uploadedBy}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        <span>
                          {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleViewDocument(record.fileUrl)}
                    className='flex items-center gap-2'
                  >
                    <Eye className='w-4 h-4' />
                    View
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      handleDownloadDocument(record.fileUrl, record.documentName)
                    }
                    className='flex items-center gap-2'
                  >
                    <Download className='w-4 h-4' />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {medicalRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-gray-600'>Total Records</p>
                <p className='text-2xl font-bold text-teal-600'>
                  {medicalRecords.length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Document Types</p>
                <p className='text-2xl font-bold text-teal-600'>
                  {Object.keys(documentTypeCounts).length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>This Month</p>
                <p className='text-2xl font-bold text-teal-600'>
                  {
                    medicalRecords.filter(record => {
                      const recordDate = new Date(record.createdAt);
                      const now = new Date();
                      return (
                        recordDate.getMonth() === now.getMonth() &&
                        recordDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Most Recent</p>
                <p className='text-sm font-semibold text-gray-900'>
                  {medicalRecords.length > 0
                    ? format(
                        new Date(medicalRecords[0].createdAt),
                        'MMM dd, yyyy',
                      )
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
