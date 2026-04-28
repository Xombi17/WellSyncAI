export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'vaccine' | 'medicine' | 'growth' | 'pregnancy' | 'checkup';
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  aiExplanation?: string;
}

export interface GrowthRecord {
  date: string;
  height: number;
  weight: number;
  milestone?: string;
}

export interface Dependent {
  id: string;
  name: string;
  relation: 'child' | 'spouse' | 'parent' | 'self';
  dob: string;
  gender: 'male' | 'female';
  avatar: string;
  timeline: TimelineEvent[];
  growthRecords: GrowthRecord[];
  pregnancyWeek?: number;
  edd?: string;
  highRiskFlags?: string[];
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  forDependent: string;
  safety: 'safe' | 'caution' | 'avoid';
  active: boolean;
  startDate: string;
  endDate?: string;
  dosesTaken: number;
  totalDoses: number;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  forDependent: string;
  done: boolean;
  category: 'vaccine' | 'medicine' | 'checkup' | 'growth';
}

export interface HealthCenter {
  id: string;
  name: string;
  type: 'PHC' | 'Hospital' | 'Clinic' | 'ASHA';
  distance: string;
  openNow: boolean;
  phone: string;
  address: string;
  specialties: string[];
}

export interface Family {
  id: string;
  name: string;
  language: string;
  dependents: Dependent[];
  medicines: Medicine[];
  reminders: Reminder[];
  healthCenters: HealthCenter[];
  schemes: { name: string; description: string; eligible: boolean }[];
}

export interface DemoLoginAccount {
  familyId: string;
  familyName: string;
  username: string;
  email: string;
  password: string;
}
