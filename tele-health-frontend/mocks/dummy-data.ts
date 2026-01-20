import {
  Video,
  Calendar,
  Shield,
  Clock,
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Eye,
  Users,
  Star,
  Activity,
} from 'lucide-react';

export const features = [
  {
    icon: Video,
    title: 'Virtual Consultations',
    description:
      'Connect with healthcare providers through secure HD video calls from anywhere',
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description:
      'Book appointments 24/7 with instant confirmation and automated reminders',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'HIPAA-compliant platform with end-to-end encryption for your data',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'No waiting rooms, no travel time. Get expert care in minutes',
  },
];

export const doctors = [
  {
    id: 1,
    name: 'Dr. Tamsirr Ceesay',
    specialty: 'General Physician',
    experience: '12 Years',
    patients: '2,000+',
    rating: 4.9,
    reviews: 324,
    fee: '$80',
    available: true,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop&crop=face&auto=format',
    about: 'Specialized in internal medicine with focus on preventive care',
  },
  {
    id: 2,
    name: 'Dr. Omar Bojang',
    specialty: 'Cardiologist',
    experience: '15 Years',
    patients: '3,500+',
    rating: 4.8,
    reviews: 456,
    fee: '$120',
    available: true,
    image:
      'https://cdn.oreateai.com/aiimage/strategy/eeaebd18f9fa49848d137ce5c03921fb.jpg',
    about: 'Expert in heart disease prevention and cardiac rehabilitation',
  },
  {
    id: 3,
    name: 'Dr. Fatou Jawaneh',
    specialty: 'Dermatologist',
    experience: '10 Years',
    patients: '1,800+',
    rating: 5.0,
    reviews: 289,
    fee: '$90',
    available: true,
    image:
      'https://cdn.oreateai.com/aiimage/strategy/f20d16ac5e9a401e9db38ceb5136b0e1.jpg',
    about: 'Specializing in medical and cosmetic dermatology',
  },
  {
    id: 4,
    name: 'Dr. Momodou Jallow',
    specialty: 'Pediatrician',
    experience: '15 Years',
    patients: '4,200+',
    rating: 4.9,
    reviews: 512,
    fee: '$75',
    available: false,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CmKuvFP9T2j3iv-FV5Fo74-l8vN3m7Nr7A&s',
    about: 'Compassionate care for infants, children, and adolescents',
  },
  {
    id: 5,
    name: 'Dr. Zainab Mohammed',
    specialty: 'Neurologist',
    experience: '14 Years',
    patients: '2,600+',
    rating: 4.8,
    reviews: 378,
    fee: '$110',
    available: true,
    image:
      'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face',
    about: 'Expert in treating neurological disorders and headaches',
  },
  {
    id: 6,
    name: 'Dr. Thabo Mthembu',
    specialty: 'Orthopedic Surgeon',
    experience: '20 Years',
    patients: '5,000+',
    rating: 4.9,
    reviews: 621,
    fee: '$150',
    available: true,
    image:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    about: 'Specialized in joint replacement and sports medicine',
  },
  {
    id: 7,
    name: 'Dr. Binta Ceesay',
    specialty: 'General Practice',
    experience: '2 Years',
    patients: '500+',
    rating: 4.7,
    reviews: 89,
    fee: '$80',
    available: true,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnnY3WDyUO6qXqOXOqDCs75zw6-oq-YECq1g&s',
    about: 'Dedicated general practitioner committed to providing quality primary healthcare services',
  },
];

export const services = [
  {
    icon: Stethoscope,
    name: 'General Medicine',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Heart,
    name: 'Cardiology',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Brain,
    name: 'Neurology',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Baby,
    name: 'Pediatrics',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Eye,
    name: 'Ophthalmology',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: Activity,
    name: 'Dermatology',
    color: 'bg-green-100 text-green-600',
  },
];

export const stats = [
  {
    value: '10K+',
    label: 'Active Patients',
    icon: Users,
  },
  {
    value: '500+',
    label: 'Expert Doctors',
    icon: Stethoscope,
  },
  {
    value: '50K+',
    label: 'Consultations',
    icon: Video,
  },
  {
    value: '4.8',
    label: 'Average Rating',
    icon: Star,
  },
];

export const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    content:
      'The convenience of consulting with my doctor from home has been life-changing. The platform is easy to use and doctors are very professional.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    name: 'Michael Chen',
    role: 'Patient',
    content:
      'Quick, professional, and easy to use. Got my prescription within 30 minutes of consultation. Highly recommend for busy professionals!',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Dr. Emily Roberts',
    role: 'Physician',
    content:
      'As a healthcare provider, this platform makes it easy to reach more patients while maintaining quality care. The interface is intuitive.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
  },
];

export const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export const revenueData = [
  { date: 'Oct 25', revenue: 4200 },
  { date: 'Oct 26', revenue: 3800 },
  { date: 'Oct 27', revenue: 4500 },
  { date: 'Oct 28', revenue: 5100 },
  { date: 'Oct 29', revenue: 4800 },
  { date: 'Oct 30', revenue: 5500 },
  { date: 'Oct 31', revenue: 6200 },
  { date: 'Nov 1', revenue: 5800 },
];

export const appointmentsData = [
  { month: 'Jul', completed: 120, pending: 15, cancelled: 8 },
  { month: 'Aug', completed: 145, pending: 20, cancelled: 10 },
  { month: 'Sep', completed: 165, pending: 18, cancelled: 7 },
  { month: 'Oct', completed: 190, pending: 25, cancelled: 12 },
];

export const specializationData = [
  { name: 'Cardiology', value: 45 },
  { name: 'Dermatology', value: 35 },
  { name: 'Pediatrics', value: 28 },
  { name: 'Neurology', value: 22 },
  { name: 'Orthopedics', value: 18 },
  { name: 'Others', value: 15 },
];

export const patientGrowthData = [
  { month: 'Jun', patients: 420, physicians: 45 },
  { month: 'Jul', patients: 485, physicians: 52 },
  { month: 'Aug', patients: 560, physicians: 58 },
  { month: 'Sep', patients: 640, physicians: 65 },
  { month: 'Oct', patients: 730, physicians: 72 },
];

export const hourlyActivityData = [
  { hour: '8 AM', appointments: 5 },
  { hour: '9 AM', appointments: 12 },
  { hour: '10 AM', appointments: 18 },
  { hour: '11 AM', appointments: 22 },
  { hour: '12 PM', appointments: 15 },
  { hour: '1 PM', appointments: 10 },
  { hour: '2 PM', appointments: 20 },
  { hour: '3 PM', appointments: 25 },
  { hour: '4 PM', appointments: 23 },
  { hour: '5 PM', appointments: 18 },
  { hour: '6 PM', appointments: 12 },
  { hour: '7 PM', appointments: 8 },
];

export const topPhysicians = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    appointments: 156,
    rating: 4.9,
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    appointments: 142,
    rating: 4.8,
  },
  {
    name: 'Dr. Emily Williams',
    specialization: 'Pediatrician',
    appointments: 128,
    rating: 4.9,
  },
  {
    name: 'Dr. James Brown',
    specialization: 'Neurologist',
    appointments: 115,
    rating: 4.7,
  },
  {
    name: 'Dr. Lisa Anderson',
    specialization: 'Orthopedist',
    appointments: 98,
    rating: 4.8,
  },
];
