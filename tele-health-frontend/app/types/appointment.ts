export interface Physician {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Service {
  id: string;
  name?: string;
}

export interface Appointment {
  id: string;
  physicianId: string;
  patientId: string;
  serviceId?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT';
  symptoms?: string;
  meetingLink?: string;
  googleEventId?: string;
  createdAt: string;
  updatedAt: string;
  physician?: Physician;
  service?: Service;
}

export interface AppointmentsResponse {
  appointments: Appointment[];
}

export type AppointmentsData = 
  | Appointment[] 
  | AppointmentsResponse 
  | { data: Appointment[] };

