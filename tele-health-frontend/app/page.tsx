'use client';

import React from 'react';
import {
  Activity,
  Calendar,
  Video,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Eye,
  Menu,
  X,
  Phone,
  ChevronRight,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  doctors,
  features,
  services,
  stats,
  testimonials,
  timeSlots,
} from '@/mocks/dummy-data';
import BookAppointment from '@/components/drawer/book-appointment';
import BookFirstAppointment from '@/components/drawer/book-first-appointment';
import {
  usePublicPhysicians,
  useTopRatedPhysicians,
  usePhysicianStatistics,
  useFeaturedReviews,
  useReviewsStatistics,
} from '@/hooks';
import LogoIcon from '@/components/svg/logo-icon';

const TeleHealthLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!session?.user) return null;

    // Assuming the role is stored in session.user.role or similar
    const role = session.user.role;

    switch (role.toLocaleLowerCase()) {
      case 'admin':
        return '/admin/dashboard'; // Note: keeping the existing typo
      case 'physician':
        return '/physician/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/patient/dashboard'; // Default to patient dashboard
    }
  };

  const dashboardRoute = getDashboardRoute();

  // API hooks for dynamic data
  const { data: physicians, isLoading: physiciansLoading } =
    usePublicPhysicians({ limit: 8 });
  const { data: topRatedPhysicians, isLoading: topRatedLoading } =
    useTopRatedPhysicians();
  const { data: physicianStats, isLoading: statsLoading } =
    usePhysicianStatistics();
  const { data: featuredReviews, isLoading: reviewsLoading } =
    useFeaturedReviews(6);
  const { data: reviewStats, isLoading: reviewStatsLoading } =
    useReviewsStatistics();

  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center gap-2 cursor-pointer'>
              <div className='w-10 h-10 bg-teal-600  rounded-lg flex items-center justify-center'>
                <LogoIcon fill='#F5F6F8' />
              </div>
              <span className='text-xl font-bold bg-teal-600  bg-clip-text text-transparent'>
                TeleHealth
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-8'>
              <Link
                href='#features'
                className='text-gray-600 hover:text-gray-900 transition'
              >
                Features
              </Link>
              <Link
                href='#doctors'
                className='text-gray-600 hover:text-gray-900 transition'
              >
                Doctors
              </Link>
              <Link
                href='#services'
                className='text-gray-600 hover:text-gray-900 transition'
              >
                Services
              </Link>
              <Link
                href='#testimonials'
                className='text-gray-600 hover:text-gray-900 transition'
              >
                Testimonials
              </Link>
            </div>

            <div className='hidden md:flex items-center gap-4'>
              {dashboardRoute && (
                <Button
                  variant='ghost'
                  onClick={() => router.push(dashboardRoute)}
                  className='text-teal-600 hover:text-teal-700 hover:bg-teal-50'
                >
                  Dashboard
                </Button>
              )}
              {!session ? (
                <>
                  <Button variant='ghost' onClick={() => router.push('/login')}>
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    className='bg-teal-600 hover:bg-teal-700'
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  variant='outline'
                  onClick={() => router.push('/api/auth/signout')}
                  className='border-teal-600 text-teal-600 hover:bg-teal-50'
                >
                  Sign Out
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className='md:hidden'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden border-t border-gray-200 bg-white'>
            <div className='px-4 py-4 space-y-3'>
              <Link
                href='#features'
                className='block text-gray-600 hover:text-gray-900'
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href='#doctors'
                className='block text-gray-600 hover:text-gray-900'
                onClick={() => setMobileMenuOpen(false)}
              >
                Doctors
              </Link>
              <Link
                href='#services'
                className='block text-gray-600 hover:text-gray-900'
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href='#testimonials'
                className='block text-gray-600 hover:text-gray-900'
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              {dashboardRoute && (
                <Button
                  variant='ghost'
                  className='w-full justify-start text-teal-600 hover:text-teal-700 hover:bg-teal-50'
                  onClick={() => {
                    router.push(dashboardRoute);
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
              )}
              {!session ? (
                <>
                  <Button
                    variant='ghost'
                    className='w-full justify-start'
                    onClick={() => {
                      router.push('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className='w-full bg-teal-600 hover:bg-teal-700'
                    onClick={() => {
                      router.push('/register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  variant='outline'
                  className='w-full justify-start border-teal-600 text-teal-600 hover:bg-teal-50'
                  onClick={() => {
                    router.push('/api/auth/signout');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-teal-50 via-teal-50 to-pink-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <Badge className='mb-6 bg-teal-100 text-teal-700 hover:bg-teal-100'>
                <Sparkles className='w-4 h-4 mr-1' />
                Trusted by 10,000+ patients
              </Badge>
              <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
                Quality Healthcare at Your{' '}
                <span className='bg-teal-600  bg-clip-text text-transparent'>
                  Fingertips
                </span>
              </h1>
              <p className='text-xl text-gray-600 mb-8'>
                Connect with certified doctors instantly. Get diagnosed, receive
                prescriptions, and manage your health from the comfort of your
                home.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <BookAppointment
                  selectedDoctor={selectedDoctor}
                  setSelectedDoctor={setSelectedDoctor}
                />
                <Button size='lg' variant='outline' onClick={() => null}>
                  Join as Doctor
                </Button>
              </div>
            </div>
            <div className='relative'>
              <div className='relative z-10'>
                {topRatedLoading ? (
                  // Loading skeleton for top-rated doctor
                  <Card className='shadow-2xl'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4 mb-6'>
                        <div className='w-16 h-16 bg-gray-200 rounded-full animate-pulse'></div>
                        <div>
                          <div className='h-6 bg-gray-200 rounded animate-pulse mb-2 w-32'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                        </div>
                        <div className='flex justify-between items-center'>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-10'></div>
                        </div>
                        <div className='flex justify-between items-center'>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-10'></div>
                          <div className='flex items-center gap-1'>
                            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                            <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                            <div className='h-4 bg-gray-200 rounded animate-pulse w-6 ml-1'></div>
                          </div>
                        </div>
                      </div>
                      <div className='w-full h-10 bg-gray-200 rounded animate-pulse mt-6'></div>
                    </CardContent>
                  </Card>
                ) : topRatedPhysicians ? (
                  // API data - single top-rated physician
                  <Card className='shadow-2xl'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4 mb-6'>
                        <Avatar className='w-16 h-16'>
                          <AvatarImage
                            src={
                              topRatedPhysicians.image ||
                              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop'
                            }
                          />
                          <AvatarFallback>
                            {topRatedPhysicians.name
                              ? topRatedPhysicians.name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                              : 'TD'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            {topRatedPhysicians.name || 'Top Rated Doctor'}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {topRatedPhysicians.specialty ||
                              'Medical Specialist'}
                          </p>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>
                            Experience
                          </span>
                          <span className='font-semibold text-gray-900'>
                            {topRatedPhysicians.experience || '12'} Years
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>
                            Patients
                          </span>
                          <span className='font-semibold text-gray-900'>
                            {topRatedPhysicians.patients || '2,000+'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>Rating</span>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className='w-4 h-4 fill-yellow-400 text-yellow-400'
                              />
                            ))}
                            <span className='ml-1 font-semibold text-gray-900'>
                              {topRatedPhysicians.rating || '4.9'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className='w-full mt-6 bg-teal-600 hover:from-teal-700 hover:to-teal-700'>
                        Book Consultation
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  // Fallback to mock data if API fails
                  <Card className='shadow-2xl'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4 mb-6'>
                        <Avatar className='w-16 h-16'>
                          <AvatarImage src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop' />
                          <AvatarFallback>SW</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            Dr. Sarah Williams
                          </h3>
                          <p className='text-sm text-gray-600'>
                            General Physician
                          </p>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>
                            Experience
                          </span>
                          <span className='font-semibold text-gray-900'>
                            12 Years
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>
                            Patients
                          </span>
                          <span className='font-semibold text-gray-900'>
                            2,000+
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600'>Rating</span>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className='w-4 h-4 fill-yellow-400 text-yellow-400'
                              />
                            ))}
                            <span className='ml-1 font-semibold text-gray-900'>
                              4.9
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className='w-full mt-6 bg-teal-600 hover:from-teal-700 hover:to-teal-700'>
                        Book Consultation
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className='absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full blur-3xl opacity-60'></div>
              <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-60'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {statsLoading
              ? // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <Card
                    key={index}
                    className='text-center border-0 shadow-none'
                  >
                    <CardContent className='p-6'>
                      <div className='flex justify-center mb-2'>
                        <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse'></div>
                      </div>
                      <div className='h-8 bg-gray-200 rounded animate-pulse mb-2'></div>
                      <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                    </CardContent>
                  </Card>
                ))
              : physicianStats?.data
                ? [
                    {
                      icon: Users,
                      value:
                        physicianStats.data.activePatients.toLocaleString(),
                      label: 'Active Patients',
                    },
                    {
                      icon: Award,
                      value: physicianStats.data.expertDoctors.toLocaleString(),
                      label: 'Expert Doctors',
                    },
                    {
                      icon: Video,
                      value: physicianStats.data.consultations.toLocaleString(),
                      label: 'Consultations',
                    },
                    {
                      icon: Star,
                      value: physicianStats.data.averageRating.toFixed(1),
                      label: 'Average Rating',
                    },
                  ].map((stat, index) => (
                    <Card
                      key={index}
                      className='text-center border-0 shadow-none'
                    >
                      <CardContent className='p-6'>
                        <div className='flex justify-center mb-2'>
                          <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600'>
                            {<stat.icon className='w-6 h-6' />}
                          </div>
                        </div>
                        <div className='text-4xl font-bold bg-teal-600  bg-clip-text text-transparent mb-2'>
                          {stat.value}
                        </div>
                        <div className='text-gray-600'>{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))
                : // Fallback to mock data if API fails
                  stats.map((stat, index) => (
                    <Card
                      key={index}
                      className='text-center border-0 shadow-none'
                    >
                      <CardContent className='p-6'>
                        <div className='flex justify-center mb-2'>
                          <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600'>
                            {<stat.icon className='w-6 h-6' />}
                          </div>
                        </div>
                        <div className='text-4xl font-bold bg-teal-600  bg-clip-text text-transparent mb-2'>
                          {stat.value}
                        </div>
                        <div className='text-gray-600'>{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id='features'
        className='py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <Badge className='mb-4 bg-teal-100 text-teal-700'>Features</Badge>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Why Choose MediConnect
            </h2>
            <p className='text-xl text-gray-600'>
              Experience healthcare that fits your lifestyle
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'
              >
                <CardContent className='p-6'>
                  <div className='w-12 h-12 bg-teal-600  rounded-lg flex items-center justify-center text-white mb-4'>
                    {<feature.icon className='w-6 h-6' />}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id='doctors' className='py-20 px-4 sm:px-6 lg:px-8 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <Badge className='mb-4 bg-teal-100 text-teal-700'>
              Our Doctors
            </Badge>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Meet Our Expert Physicians
            </h2>
            <p className='text-xl text-gray-600'>
              Certified professionals ready to help you
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {physiciansLoading
              ? // Loading skeleton for doctors
                Array.from({ length: 6 }).map((_, index) => (
                  <Card
                    key={index}
                    className='hover:shadow-xl transition-all duration-300 overflow-hidden group'
                  >
                    <div className='relative h-48 overflow-hidden'>
                      <div className='w-full h-full bg-gray-200 animate-pulse'></div>
                    </div>
                    <CardContent className='p-6'>
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <div className='h-6 bg-gray-200 rounded animate-pulse mb-2'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                        <div className='w-12 h-6 bg-gray-200 rounded animate-pulse'></div>
                      </div>
                      <div className='h-16 bg-gray-200 rounded animate-pulse mb-4'></div>
                      <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
                        <div className='flex items-center gap-1'>
                          <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                          <div className='w-16 h-4 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                          <div className='w-16 h-4 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between pt-4 border-t'>
                        <div className='w-16 h-6 bg-gray-200 rounded animate-pulse'></div>
                        <div className='w-20 h-8 bg-gray-200 rounded animate-pulse'></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : physicians?.physicians && physicians.physicians.length > 0
                ? // API data
                  physicians.physicians.slice(0, 6).map(doctor => (
                    <Card
                      key={doctor.id}
                      className='hover:shadow-xl transition-all duration-300 overflow-hidden group'
                    >
                      <div className='relative h-48 overflow-hidden'>
                        <img
                          src={doctor.image || '/placeholder-doctor.jpg'}
                          alt={doctor.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        {doctor.available && (
                          <Badge className='absolute top-4 right-4 bg-green-500 hover:bg-green-500'>
                            Available Now
                          </Badge>
                        )}
                      </div>
                      <CardContent className='p-6'>
                        <div className='flex justify-between items-start mb-3'>
                          <div>
                            <h3 className='font-semibold text-lg text-gray-900'>
                              {doctor.name}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {doctor.specialty}
                            </p>
                          </div>
                          <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded'>
                            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                            <span className='text-sm font-semibold'>
                              {doctor.rating}
                            </span>
                          </div>
                        </div>
                        <p className='text-sm text-gray-600 mb-4'>
                          {doctor.about ||
                            'Experienced healthcare professional dedicated to providing quality care.'}
                        </p>
                        <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
                          <div className='flex items-center gap-1'>
                            <Award className='w-4 h-4' />
                            <span>{doctor.experience || '5+'} years</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Users className='w-4 h-4' />
                            <span>{doctor.patients || '100+'} patients</span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between pt-4 border-t'>
                          <span className='text-lg font-bold text-teal-600'>
                            GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)}
                          </span>
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button
                                size='sm'
                                className='bg-teal-600  hover:from-teal-700 hover:to-teal-700'
                                onClick={() => setSelectedDoctor(doctor)}
                              >
                                Book Now
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>
                                  Book Appointment with {doctor.name}
                                </DrawerTitle>
                                <DrawerDescription>
                                  {doctor.specialty} - GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)} per
                                  consultation
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className='px-4 pb-4 max-h-[60vh] overflow-y-auto'>
                                <div className='space-y-4'>
                                  <Card>
                                    <CardContent className='p-4'>
                                      <div className='flex items-center gap-4 mb-4'>
                                        <Avatar className='w-16 h-16'>
                                          <AvatarImage src={doctor.image} />
                                          <AvatarFallback>
                                            {doctor.name
                                              .split(' ')
                                              .map(n => n[0])
                                              .join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className='font-semibold'>
                                            {doctor.name}
                                          </h4>
                                          <p className='text-sm text-gray-600'>
                                            {doctor.specialty}
                                          </p>
                                          <div className='flex items-center gap-2 mt-1'>
                                            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                            <span className='text-sm'>
                                              {doctor.rating} (
                                              {doctor.reviews || 0} reviews)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Select Date
                                    </Label>
                                    <Input type='date' />
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Select Time Slot
                                    </Label>
                                    <div className='grid grid-cols-3 gap-2'>
                                      {timeSlots.map(slot => (
                                        <Button
                                          key={slot}
                                          variant='outline'
                                          className='w-full hover:bg-teal-50 hover:border-teal-600'
                                        >
                                          {slot}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Consultation Type
                                    </Label>
                                    <div className='grid grid-cols-3 gap-2'>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Video className='w-5 h-5' />
                                        <span className='text-xs'>Video</span>
                                      </Button>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Phone className='w-5 h-5' />
                                        <span className='text-xs'>Audio</span>
                                      </Button>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Activity className='w-5 h-5' />
                                        <span className='text-xs'>Chat</span>
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Reason for Visit
                                    </Label>
                                    <Input placeholder='Brief description of symptoms' />
                                  </div>
                                </div>
                              </div>
                              <DrawerFooter>
                                <Button className='w-full bg-teal-600  hover:from-teal-700 hover:to-teal-700'>
                                  Confirm Booking - GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)}
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant='outline'>Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : // Fallback to mock data if API fails or no data
                  doctors.map(doctor => (
                    <Card
                      key={doctor.id}
                      className='hover:shadow-xl transition-all duration-300 overflow-hidden group'
                    >
                      <div className='relative h-48 overflow-hidden'>
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        {doctor.available && (
                          <Badge className='absolute top-4 right-4 bg-green-500 hover:bg-green-500'>
                            Available Now
                          </Badge>
                        )}
                      </div>
                      <CardContent className='p-6'>
                        <div className='flex justify-between items-start mb-3'>
                          <div>
                            <h3 className='font-semibold text-lg text-gray-900'>
                              {doctor.name}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {doctor.specialty}
                            </p>
                          </div>
                          <div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded'>
                            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                            <span className='text-sm font-semibold'>
                              {doctor.rating}
                            </span>
                          </div>
                        </div>
                        <p className='text-sm text-gray-600 mb-4'>
                          {doctor.about}
                        </p>
                        <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
                          <div className='flex items-center gap-1'>
                            <Award className='w-4 h-4' />
                            <span>{doctor.experience}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Users className='w-4 h-4' />
                            <span>{doctor.patients}</span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between pt-4 border-t'>
                          <span className='text-lg font-bold text-teal-600'>
                            GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)}
                          </span>
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button
                                size='sm'
                                className='bg-teal-600  hover:from-teal-700 hover:to-teal-700'
                                onClick={() => setSelectedDoctor(doctor)}
                              >
                                Book Now
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>
                                  Book Appointment with {doctor.name}
                                </DrawerTitle>
                                <DrawerDescription>
                                  {doctor.specialty} - GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)} per
                                  consultation
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className='px-4 pb-4 max-h-[60vh] overflow-y-auto'>
                                <div className='space-y-4'>
                                  <Card>
                                    <CardContent className='p-4'>
                                      <div className='flex items-center gap-4 mb-4'>
                                        <Avatar className='w-16 h-16'>
                                          <AvatarImage src={doctor.image} />
                                          <AvatarFallback>
                                            {doctor.name
                                              .split(' ')
                                              .map(n => n[0])
                                              .join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className='font-semibold'>
                                            {doctor.name}
                                          </h4>
                                          <p className='text-sm text-gray-600'>
                                            {doctor.specialty}
                                          </p>
                                          <div className='flex items-center gap-2 mt-1'>
                                            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                            <span className='text-sm'>
                                              {doctor.rating} ({doctor.reviews}{' '}
                                              reviews)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Select Date
                                    </Label>
                                    <Input type='date' />
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Select Time Slot
                                    </Label>
                                    <div className='grid grid-cols-3 gap-2'>
                                      {timeSlots.map(slot => (
                                        <Button
                                          key={slot}
                                          variant='outline'
                                          className='w-full hover:bg-teal-50 hover:border-teal-600'
                                        >
                                          {slot}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Consultation Type
                                    </Label>
                                    <div className='grid grid-cols-3 gap-2'>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Video className='w-5 h-5' />
                                        <span className='text-xs'>Video</span>
                                      </Button>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Phone className='w-5 h-5' />
                                        <span className='text-xs'>Audio</span>
                                      </Button>
                                      <Button
                                        variant='outline'
                                        className='flex flex-col items-center gap-2 h-auto py-3'
                                      >
                                        <Activity className='w-5 h-5' />
                                        <span className='text-xs'>Chat</span>
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className='mb-2 block'>
                                      Reason for Visit
                                    </Label>
                                    <Input placeholder='Brief description of symptoms' />
                                  </div>
                                </div>
                              </div>
                              <DrawerFooter>
                                <Button className='w-full bg-teal-600  hover:from-teal-700 hover:to-teal-700'>
                                  Confirm Booking - GMD {typeof doctor.fee === 'string' ? parseFloat(doctor.fee.replace(/[^0-9.]/g, '')) || 50 : (doctor.fee || 50)}
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant='outline'>Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </DrawerContent>
                          </Drawer>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id='services'
        className='py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <Badge className='mb-4 bg-green-100 text-green-700'>Services</Badge>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Our Specializations
            </h2>
            <p className='text-xl text-gray-600'>
              Access to a wide range of medical specialists
            </p>
          </div>
          <div className='grid md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {services.map((service, index) => (
              <Card
                key={index}
                className='hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md'
              >
                <CardContent className='p-6 text-center'>
                  <div
                    className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {<service.icon className='w-6 h-6' />}
                  </div>
                  <h3 className='font-semibold text-gray-900'>
                    {service.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id='testimonials'
        className='py-20 px-4 sm:px-6 lg:px-8 bg-white'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <Badge className='mb-4 bg-yellow-100 text-yellow-700'>
              Testimonials
            </Badge>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              What Our Users Say
            </h2>
            <p className='text-xl text-gray-600'>
              Real stories from real people
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {reviewsLoading
              ? // Loading skeleton for testimonials
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'
                  >
                    <CardContent className='p-6'>
                      <div className='flex gap-1 mb-4'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className='w-5 h-5 bg-gray-200 rounded animate-pulse'
                          ></div>
                        ))}
                      </div>
                      <div className='space-y-2 mb-6'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4'></div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse'></div>
                        <div className='space-y-2'>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                          <div className='h-3 bg-gray-200 rounded animate-pulse w-16'></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : featuredReviews?.reviews && featuredReviews.reviews.length > 0
                ? // API data
                  featuredReviews.reviews.slice(0, 3).map((review, index) => (
                    <Card
                      key={review.id || index}
                      className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'
                    >
                      <CardContent className='p-6'>
                        <div className='flex gap-1 mb-4'>
                          {[...Array(Math.floor(review.rating || 5))].map(
                            (_, i) => (
                              <Star
                                key={i}
                                className='w-5 h-5 fill-yellow-400 text-yellow-400'
                              />
                            ),
                          )}
                        </div>
                        <p className='text-gray-700 mb-6 italic'>
                          "
                          {review.comment ||
                            'Great experience with the healthcare platform!'}
                          "
                        </p>
                        <div className='flex items-center gap-4'>
                          <Avatar className='w-12 h-12'>
                            <AvatarImage src={review.profileUrl} />
                            <AvatarFallback>
                              {(review.patientName || 'Anonymous')
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-semibold text-gray-900'>
                              {review.patientName || 'Anonymous Patient'}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {review.role || 'Patient'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : // Fallback to mock data if API fails or no data
                  testimonials.map((testimonial, index) => (
                    <Card
                      key={index}
                      className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg'
                    >
                      <CardContent className='p-6'>
                        <div className='flex gap-1 mb-4'>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className='w-5 h-5 fill-yellow-400 text-yellow-400'
                            />
                          ))}
                        </div>
                        <p className='text-gray-700 mb-6 italic'>
                          "{testimonial.content}"
                        </p>
                        <div className='flex items-center gap-4'>
                          <Avatar className='w-12 h-12'>
                            <AvatarImage src={testimonial.image} />
                            <AvatarFallback>
                              {testimonial.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-semibold text-gray-900'>
                              {testimonial.name}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {testimonial.role}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-teal-600 via-teal-600 '>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Ready to Get Started?
          </h2>
          <p className='text-xl text-white/90 mb-8'>
            Join thousands of satisfied patients experiencing the future of
            healthcare
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <BookFirstAppointment />
            <Button
              size='lg'
              variant='outline'
              className='border-2 border-white text-gray-600 hover:bg-white/10'
            >
              Learn More
              <ChevronRight className='w-5 h-5 ml-2' />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-10 h-10 bg-teal-600  rounded-lg flex items-center justify-center'>
                  <LogoIcon fill='#F5F6F8' />
                </div>
                <span className='text-xl font-bold text-white'>TeleHealth</span>
              </div>
              <p className='text-sm'>
                Making quality healthcare accessible to everyone, everywhere.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-white mb-4'>For Patients</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Find a Doctor
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Health Records
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-white mb-4'>For Doctors</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Join as Doctor
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Physician Portal
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-white mb-4'>Company</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition'>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 pt-8 text-center text-sm'>
            <p>&copy; 2025 TeleHealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeleHealthLanding;
