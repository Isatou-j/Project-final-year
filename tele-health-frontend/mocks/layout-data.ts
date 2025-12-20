import { NavigationItem, Role, User as UserType } from '@/types/layout';
import {
  Home,
  Stethoscope,
  Calendar,
  Clock,
  Video,
  FileText,
  User,
  Users,
  DollarSign,
  UserCheck,
  Briefcase,
  CreditCard,
  Star,
  Settings,
} from 'lucide-react';

export const mockUsers: Record<Role, UserType> = {
  PATIENT: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'PATIENT',
  },
  PHYSICIAN: {
    name: 'Dr. Sarah Smith',
    email: 'sarah@example.com',
    role: 'PHYSICIAN',
  },
  ADMIN: {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
};

export const navigationConfig: Record<Role, NavigationItem[]> = {
  PATIENT: [
    { icon: Home, label: 'Dashboard', href: '/patient/dashboard' },
    { icon: Stethoscope, label: 'Find Doctors', href: '/patient/doctors' },
    {
      icon: Calendar,
      label: 'Book Appointment',
      href: '/patient/book-appointment',
    },
    { icon: Clock, label: 'Appointments', href: '/patient/appointments' },
    { icon: Video, label: 'Consultations', href: '/patient/consultation' },
    {
      icon: FileText,
      label: 'Medical Records',
      href: '/patient/records',
    },
    { icon: User, label: 'Profile', href: '/patient/profile' },
  ],
  PHYSICIAN: [
    { icon: Home, label: 'Dashboard', href: '/physician/dashboard' },
    { icon: Calendar, label: 'Appointments', href: '/physician/appointments' },
    {
      icon: Video,
      label: 'Consultation Room',
      href: '/physician/consultation-room',
    },
    { icon: Users, label: 'Patients', href: '/physician/patients' },
    { icon: Clock, label: 'Availability', href: '/physician/availability' },
    { icon: DollarSign, label: 'Earnings', href: '/physician/earnings' },
    { icon: User, label: 'Profile', href: '/physician/profile' },
  ],
  ADMIN: [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    {
      icon: UserCheck,
      label: 'Physicians',
      href: '/admin/physicians',
      badge: 5,
    },
    { icon: Users, label: 'Patients', href: '/admin/patients' },
    { icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
    { icon: Briefcase, label: 'Services', href: '/admin/services' },
    { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
    { icon: Star, label: 'Reviews', href: '/admin/reviews' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ],
};
