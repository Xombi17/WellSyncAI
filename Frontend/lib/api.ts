// API client library - connects Frontend to Backend API
// Uses standard fetch (not axios) with typed responses

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types matching Backend SQLModel/Prisma schema
export interface Household {
  id: string;
  name: string;
  primary_language: string;
  village_town?: string;
  state?: string;
  district?: string;
  created_at: string;
  updated_at: string;
}

export interface Dependent {
  id: string;
  household_id: string;
  name: string;
  type: 'child' | 'adult' | 'elder' | 'pregnant';
  date_of_birth: string;
  sex: 'male' | 'female' | 'other';
  expected_delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthEvent {
  id: string;
  dependent_id: string;
  household_id: string;
  name: string;
  schedule_key: string;
  category: 'vaccination' | 'checkup' | 'vitamin' | 'reminder';
  dose_number?: number;
  due_date: string;
  window_start?: string;
  window_end?: string;
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  completed_at?: string;
  completed_by?: string;
  location?: string;
  notes?: string;
  schedule_version: string;
  created_at: string;
  updated_at: string;
}

// Error handling helper
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// API functions

/**
 * Fetch all households
 */
export async function getHouseholds(): Promise<Household[]> {
  return fetchApi<Household[]>('/api/v1/households');
}

/**
 * Fetch a single household by ID
 */
export async function getHousehold(id: string): Promise<Household> {
  return fetchApi<Household>(`/api/v1/households/${id}`);
}

/**
 * Fetch dependents, optionally filtered by household ID
 */
export async function getDependents(householdId?: string): Promise<Dependent[]> {
  const params = householdId ? `?household_id=${householdId}` : '';
  return fetchApi<Dependent[]>(`/api/v1/dependents${params}`);
}

/**
 * Fetch timeline/health events for a dependent
 */
export async function getTimeline(dependentId: string): Promise<HealthEvent[]> {
  return fetchApi<HealthEvent[]>(`/api/v1/timeline/${dependentId}`);
}