// Physician hooks
export {
  usePublicPhysicians,
  useTopRatedPhysicians,
  usePhysicianStatistics,
  useAdminPhysicians,
  type PhysicianResponse,
  type StatisticsResponse,
} from './usePhysicians';

// Review hooks
export {
  useReviews,
  useFeaturedReviews,
  useReviewsStatistics,
  useAdminReviews,
  useDeleteReview,
  type ReviewsResponse,
  type ReviewsStatistics,
  type ReviewsStatsResponse,
  type AdminReview,
  type AdminReviewsResponse,
} from './useReviews';

// Appointment hooks
export {
  useBookAppointment,
  usePatientAppointments,
  useAdminAppointments,
  type BookAppointmentPayload,
  type Appointment,
  type AdminAppointment,
  type AdminAppointmentsResponse,
} from './useAppointments';

// Medical Records hooks
export {
  usePatientMedicalRecords,
  type MedicalRecord,
  type MedicalRecordsResponse,
} from './useMedicalRecords';

// Patient Profile hooks
export {
  usePatientProfile,
  useUpdatePatientProfile,
  type PatientProfile,
  type UpdatePatientProfilePayload,
} from './usePatientProfile';

// Notifications hooks
export {
  useNotifications,
  useMarkNotificationAsRead,
  type Notification,
  type NotificationsResponse,
} from './useNotifications';

// Patient hooks
export {
  useAdminPatients,
  type PatientResponse,
  type Patient,
} from './usePatients';

// Service hooks
export {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  type Service,
  type ServiceResponse,
  type CreateServicePayload,
  type UpdateServicePayload,
} from './useServices';

// Physician Profile hooks
export {
  usePhysicianProfile,
  useUpdatePhysicianProfile,
  type PhysicianProfile,
} from './usePhysicianProfile';

// Physician Appointments hooks
export {
  usePhysicianAppointments,
  useUpdateAppointmentStatus,
  type PhysicianAppointment,
} from './usePhysicianAppointments';

// Availability hooks
export {
  usePhysicianAvailability,
  useUpdateAvailability,
  useUpdateAvailabilityStatus,
  type Availability,
  type AvailabilityInput,
} from './useAvailability';

// Physician Earnings hooks
export {
  usePhysicianPayments,
  usePhysicianEarnings,
  type PhysicianPayment,
  type PhysicianEarnings,
} from './usePhysicianEarnings';

