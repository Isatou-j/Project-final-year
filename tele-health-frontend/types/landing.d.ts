export interface ExpertPhysician {
  id: number;
  name: string;
  specialty: string;
  experience: string; // e.g. "8 Years"
  patients: string; // e.g. "0+", "200+"
  rating: number; // e.g. 1–5
  reviews: number; // total number of reviews
  fee: string; // e.g. "$120"
  available: boolean;
  image: string; // image URL
  about: string;
}

export interface LandingPageStats {
  activePatients: number;
  expertDoctors: number;
  consultations: number;
  averageRating: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string; // e.g. "Patient"
  feedback: string;
  rating: number; // e.g. 1–5
  avatar: string; // image URL
}

export interface ServiceFeature {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Reviews {
  id: number;
  physicianId: number;
  patientName: string;
  rating: number; // 1–5 stars
  comment: string;
  createdAt: string; // ISO date string
  profileUrl?: string; // ✅ Added
  role: string;
}
