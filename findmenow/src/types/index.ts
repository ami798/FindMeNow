export interface MissingPerson {
  id: string;
  fullName: string;
  lastSeenLocation: string;
  description: string;
  photoURL: string;
  createdAt: Date;
  status: 'missing' | 'found';
  missingDate: string; // ISO date string (YYYY-MM-DD)
  contactPhone?: string;
  features?: string;
}

export interface MissingPersonFormData {
  fullName: string;
  lastSeenLocation: string;
  description: string;
  photo: File | null;
  missingDate: string; // YYYY-MM-DD
  contactPhone?: string;
  features?: string;
}

export interface SearchFilters {
  query: string;
}

export interface Comment {
  id: string;
  personId: string;
  authorName: string;
  message: string;
  createdAt: Date;
} 