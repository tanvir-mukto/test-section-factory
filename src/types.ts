export type Role = 'Student' | 'CR' | 'Admin' | 'Super Admin' | 'faculty' | 'Faculty';

export type AuthState = 'signedOut' | 'needsRole' | 'needsOnboarding' | 'pending' | 'ready';

export interface UserTransport {
  mode: 'bus' | 'walk-in' | 'unset';
  busRouteId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | null;
  department: string | null;
  semester: string | null;
  section: string | null;
  batch?: number;
  isApproved: boolean;
  transport?: UserTransport;
}

export interface RoutineEntry {
  id: string;
  day: string;
  subject: string;
  code: string;
  room: string;
  time: string;
  instructor: string;
  status: 'active' | 'cancelled' | 'substituted';
  substituteInstructor?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  author: string;
  tag: 'urgent' | 'routine' | 'event' | 'bus';
}

export interface BusRoute {
  id: string;
  name: string;
  number: string;
  departureTime: string;
  route: string;
  status: 'active' | 'delayed' | 'suspended';
  statusMessage?: string;
}

export interface NoteResource {
  id: string;
  title: string;
  course: string;
  uploadedBy: string;
  timestamp: string;
  downloadCount: number;
  fileSize: string;
}

export interface Classmate {
  id: string;
  name: string;
  roll: string;
  email: string;
  phone: string;
  avatar?: string;
  section?: string;
  department?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'approval' | 'settings' | 'section_edit' | 'transport_edit';
}
