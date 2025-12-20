'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePublicPhysicians } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Star,
  Clock,
  Award,
  Users,
  Loader2,
  Stethoscope,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FindDoctorsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const { data: physiciansData, isLoading } = usePublicPhysicians({ limit: 60 });

  const specializations = useMemo(() => {
    if (!physiciansData?.physicians) return [];
    const unique = new Set(
      physiciansData.physicians.map(
        (p: any) => p.specialization ?? p.specialty ?? 'General Physician',
      ),
    );
    return Array.from(unique).sort();
  }, [physiciansData]);

  const filteredPhysicians = useMemo(() => {
    if (!physiciansData?.physicians) return [];

    let list = [...physiciansData.physicians];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter((p: any) => {
        const fullName = (p.name ?? `${p.firstName ?? ''} ${p.lastName ?? ''}`)
          .toLowerCase()
          .trim();
        const specialty = (p.specialization ?? p.specialty ?? '').toLowerCase();
        const bio = (p.bio ?? '').toLowerCase();
        return (
          fullName.includes(query) ||
          specialty.includes(query) ||
          bio.includes(query)
        );
      });
    }

    if (specialtyFilter !== 'all') {
      list = list.filter(
        (p: any) =>
          (p.specialization ?? p.specialty ?? 'General Physician') ===
          specialtyFilter,
      );
    }

    if (availabilityFilter === 'available') {
      list = list.filter((p: any) => p.isAvailable === true || p.available);
    }

    list.sort((a: any, b: any) => {
      const normalizeFee = (val: any) =>
        Number(String(val ?? '').replace(/[^0-9.]/g, '')) || 0;

      switch (sortBy) {
        case 'name': {
          const nameA =
            a.name ?? (`${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || '');
          const nameB =
            b.name ?? (`${b.firstName ?? ''} ${b.lastName ?? ''}`.trim() || '');
          return nameA.localeCompare(nameB);
        }
        case 'fee-low':
          return normalizeFee(a.consultationFee ?? a.fee) -
            normalizeFee(b.consultationFee ?? b.fee);
        case 'fee-high':
          return normalizeFee(b.consultationFee ?? b.fee) -
            normalizeFee(a.consultationFee ?? a.fee);
        case 'experience':
          return (b.experience ?? 0) - (a.experience ?? 0);
        case 'rating':
        default:
          return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });

    return list;
  }, [physiciansData, searchQuery, specialtyFilter, availabilityFilter, sortBy]);

  const handleBook = (physicianId: number) => {
    router.push(`/patient/book-appointment?physicianId=${physicianId}`);
  };

  const hasFilters =
    searchQuery || specialtyFilter !== 'all' || availabilityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSpecialtyFilter('all');
    setAvailabilityFilter('all');
    setSortBy('rating');
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Find a Doctor</h1>
        <p className='text-gray-600'>
          Browse our network of certified physicians and book your appointment.
        </p>
      </div>

      <Card>
        <CardContent className='p-6 space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              placeholder='Search by name, specialty, or keyword...'
              className='pl-10 h-12'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='grid gap-4 md:grid-cols-4'>
            <div className='space-y-1.5'>
              <Label className='text-sm text-gray-600 flex items-center gap-2'>
                <Stethoscope className='w-4 h-4' /> Specialty
              </Label>
              <Select
                value={specialtyFilter}
                onValueChange={value => setSpecialtyFilter(value)}
              >
                <SelectTrigger className='h-10'>
                  <SelectValue placeholder='All specialties' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Specialties</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-sm text-gray-600 flex items-center gap-2'>
                <Clock className='w-4 h-4' /> Availability
              </Label>
              <Select
                value={availabilityFilter}
                onValueChange={value => setAvailabilityFilter(value)}
              >
                <SelectTrigger className='h-10'>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Doctors</SelectItem>
                  <SelectItem value='available'>Available Now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1.5'>
              <Label className='text-sm text-gray-600 flex items-center gap-2'>
                <Filter className='w-4 h-4' /> Sort By
              </Label>
              <Select value={sortBy} onValueChange={value => setSortBy(value)}>
                <SelectTrigger className='h-10'>
                  <SelectValue placeholder='Sort option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='rating'>Highest Rating</SelectItem>
                  <SelectItem value='name'>Name (A-Z)</SelectItem>
                  <SelectItem value='fee-low'>Lowest Fee</SelectItem>
                  <SelectItem value='fee-high'>Highest Fee</SelectItem>
                  <SelectItem value='experience'>Most Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <div className='flex items-end'>
                <Button variant='outline' className='w-full h-10' onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='text-sm text-gray-600'>
        {isLoading ? (
          'Loading doctors...'
        ) : (
          <>
            Found{' '}
            <span className='font-semibold'>{filteredPhysicians.length}</span>{' '}
            {filteredPhysicians.length === 1 ? 'doctor' : 'doctors'}
          </>
        )}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-teal-600' />
        </div>
      ) : filteredPhysicians.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center space-y-3'>
            <Stethoscope className='w-12 h-12 text-gray-300 mx-auto' />
            <p className='text-gray-600'>No doctors match your filters.</p>
            {hasFilters && (
              <Button variant='outline' onClick={clearFilters}>
                Reset Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {filteredPhysicians.map((physician: any) => {
            const fullName =
              physician.name ??
              `Dr. ${physician.firstName ?? ''} ${physician.lastName ?? ''}`.trim();
            const specialization =
              physician.specialization ?? physician.specialty ?? 'General Physician';
            const rating = physician.rating ?? 4.5;
            const experience = physician.experience ?? '5';
            const patients = physician.patients ?? '100+';
            const feeRaw = physician.consultationFee ?? physician.fee ?? '$50';
            const fee =
              typeof feeRaw === 'number'
                ? `$${feeRaw.toFixed(2)}`
                : feeRaw || '$50';

            return (
              <Card
                key={physician.id}
                className='hover:shadow-lg transition-shadow duration-200'
              >
                <CardContent className='p-6 space-y-4'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='w-16 h-16 border'>
                      <AvatarImage src={physician.image || physician.profileImage} />
                      <AvatarFallback className='bg-teal-50 text-teal-600 font-semibold'>
                        {fullName
                          .replace('Dr.', '')
                          .trim()
                          .split(' ')
                          .map((part: string) => part[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold text-lg text-gray-900'>{fullName}</h3>
                        {physician.isAvailable && (
                          <Badge className='bg-green-100 text-green-700'>Available</Badge>
                        )}
                      </div>
                      <p className='text-sm text-gray-600'>{specialization}</p>
                      <div className='flex items-center gap-2 mt-2'>
                        <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded'>
                          <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                          <span className='text-sm font-semibold'>{rating}</span>
                        </div>
                        <span className='text-xs text-gray-500'>
                          {physician.reviews ?? '0'} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Award className='w-4 h-4 text-gray-400' />
                      <span>{experience} years experience</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='w-4 h-4 text-gray-400' />
                      <span>{patients} patients</span>
                    </div>
                    {physician.location && (
                      <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-gray-400' />
                        <span>{physician.location}</span>
                      </div>
                    )}
                    {physician.bio && (
                      <p className='text-gray-600 text-sm line-clamp-2'>
                        {physician.bio}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center justify-between pt-4 border-t'>
                    <div>
                      <p className='text-xs text-gray-500'>Consultation Fee</p>
                      <p className='text-lg font-bold text-teal-600'>{fee}</p>
                    </div>
                    <Button
                      size='sm'
                      className='bg-teal-600 hover:bg-teal-700 text-white'
                      onClick={() => handleBook(physician.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindDoctorsPage;

