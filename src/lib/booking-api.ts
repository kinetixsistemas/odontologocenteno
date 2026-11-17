export type DocumentType = 'cc' | 'ce' | 'passport' | 'other';
export type AppointmentType = 'consulta' | 'control' | 'cirugia' | 'limpieza' | 'ortodoncia' | 'otro';

export interface ScheduleRange {
  openTime: string;
  closeTime: string;
  slotMinutes: number;
  professionalId?: string;
}

export interface ScheduleDay {
  dayOfWeek: number;
  ranges: ScheduleRange[];
}

export interface ScheduleResponse {
  timezone: string;
  professional: {
    id: string;
    name: string;
    specialty: string | null;
  } | null;
  days: ScheduleDay[];
}

export interface AvailabilityResponse {
  date: string;
  timezone: string;
  slots: string[];
}

export interface CreateAppointmentInput {
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  startsAt: string;
  appointmentType: AppointmentType;
}

export interface CreateAppointmentResponse {
  id: string;
  status: 'pending' | string;
  startsAt: string;
  endsAt: string;
}

const BASE_URL = (import.meta.env.PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
const API_KEY = import.meta.env.PUBLIC_API_KEY || '';

export const isBookingApiConfigured = Boolean(BASE_URL && API_KEY);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isBookingApiConfigured) {
    throw new Error('La reserva en línea no está configurada.');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'x-api-key': API_KEY,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String(data.error)
        : 'No se pudo completar la solicitud.';
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return data as T;
}

export function getSchedule(): Promise<ScheduleResponse> {
  return request<ScheduleResponse>('/api/public/v1/schedule');
}

export function getAvailability(date: string): Promise<AvailabilityResponse> {
  return request<AvailabilityResponse>(`/api/public/v1/availability?date=${encodeURIComponent(date)}`);
}

export function createAppointment(input: CreateAppointmentInput): Promise<CreateAppointmentResponse> {
  return request<CreateAppointmentResponse>('/api/public/v1/appointments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
