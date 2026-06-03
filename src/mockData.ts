import { RoutineEntry, Announcement, BusRoute, NoteResource, Classmate, AuditLog } from './types';

export const initialRoutine: RoutineEntry[] = [
  {
    id: 'r1',
    day: 'Sunday',
    subject: 'Database Systems',
    code: 'CSE-3101',
    room: 'Lab 3 (3rd Floor)',
    time: '09:00 AM - 10:30 AM',
    instructor: 'Dr. Tariqul Islam',
    status: 'active'
  },
  {
    id: 'r2',
    day: 'Sunday',
    subject: 'Software Engineering',
    code: 'CSE-3103',
    room: 'Room 502',
    time: '11:00 AM - 12:30 PM',
    instructor: 'Prof. Shamim Al Mamun',
    status: 'active'
  },
  {
    id: 'r3',
    day: 'Monday',
    subject: 'Computer Networks',
    code: 'CSE-3105',
    room: 'Room 403',
    time: '09:30 AM - 11:00 AM',
    instructor: 'Dr. Momena Begum',
    status: 'active'
  },
  {
    id: 'r4',
    day: 'Monday',
    subject: 'Artificial Intelligence',
    code: 'CSE-3107',
    room: 'Lab 1 (2nd Floor)',
    time: '01:30 PM - 03:00 PM',
    instructor: 'Dr. Faisal Rahman',
    status: 'active'
  },
  {
    id: 'r5',
    day: 'Tuesday',
    subject: 'Database Dev Lab',
    code: 'CSE-3102',
    room: 'Lab 3 (3rd Floor)',
    time: '09:00 AM - 12:00 PM',
    instructor: 'Lec. Sadia Afrin',
    status: 'active'
  },
  {
    id: 'r6',
    day: 'Wednesday',
    subject: 'Computer Networks',
    code: 'CSE-3105',
    room: 'Room 403',
    time: '09:30 AM - 11:00 AM',
    instructor: 'Dr. Momena Begum',
    status: 'active'
  },
  {
    id: 'r7',
    day: 'Wednesday',
    subject: 'Software Engineering',
    code: 'CSE-3103',
    room: 'Room 502',
    time: '11:30 AM - 01:00 PM',
    instructor: 'Prof. Shamim Al Mamun',
    status: 'active'
  },
  {
    id: 'r8',
    day: 'Thursday',
    subject: 'Artificial Intelligence',
    code: 'CSE-3107',
    room: 'Lab 1 (2nd Floor)',
    time: '09:00 AM - 10:30 AM',
    instructor: 'Dr. Faisal Rahman',
    status: 'active'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Midterm Exam Schedule Released',
    content: 'The Spring 2026 Midterm examinations will start from June 10th. Check the official notices section for individual room distributions and seat plans.',
    timestamp: '2026-05-23T09:00:00Z',
    author: 'Admin Office',
    tag: 'urgent'
  },
  {
    id: 'a2',
    title: 'Monday AI Class substituted by Dr. Faisal',
    content: 'Please note that Monday\'s Artificial Intelligence lecture at 01:30 PM will be substituted by Lab Instructor Rafiqul Islam, due to Dr. Faisal attending a conference.',
    timestamp: '2026-05-22T14:30:00Z',
    author: 'CR Tanvir',
    tag: 'routine'
  },
  {
    id: 'a3',
    title: 'Route-5 Shuttle Bus Delayed Today',
    content: 'Shuttle Bus Route-5 (Mirpur to Permanent Campus) is experiencing a 15-minute delay due to heavy congestion on the flyover. Plan accordingly.',
    timestamp: '2026-05-23T07:45:00Z',
    author: 'Transport Control',
    tag: 'bus'
  },
  {
    id: 'a4',
    title: 'Programming Contest Registration Open',
    content: 'Register for ACM Inter-University Mock Contest. Registration links are open until the end of this semester. Cash prizes for top 3 teams!',
    timestamp: '2026-05-20T10:15:00Z',
    author: 'CSE Club Admin',
    tag: 'event'
  }
];

export const initialBusRoutes: BusRoute[] = [
  {
    id: 'b1',
    name: 'Dhanmondi Express (Route-1)',
    number: 'Bus-08',
    departureTime: '07:30 AM / 02:30 PM',
    route: 'Dhanmondi Robindra Sarobar -> Kalabagan -> Science Lab -> Farmgate -> Campus',
    status: 'active'
  },
  {
    id: 'b2',
    name: 'Uttara Corridor (Route-2)',
    number: 'Bus-11',
    departureTime: '07:15 AM / 03:00 PM',
    route: 'Uttara House Building -> Azampur -> Khilkhet -> Kuril -> Campus',
    status: 'active'
  },
  {
    id: 'b3',
    name: 'Mirpur Link (Route-5)',
    number: 'Bus-15',
    departureTime: '07:30 AM / 02:00 PM',
    route: 'Mirpur-10 -> Kazipara -> Shewrapara -> Agargaon -> Campus',
    status: 'delayed',
    statusMessage: 'Estimated 15m delay due to flyover construction'
  },
  {
    id: 'b4',
    name: 'Old Dhaka Shuttle (Route-7)',
    number: 'Bus-03',
    departureTime: '07:00 AM / 01:30 PM',
    route: 'Sadarghat -> Gulisthan -> Shahbagh -> Karwan Bazar -> Campus',
    status: 'suspended',
    statusMessage: 'Suspended for maintenance today'
  }
];

export const initialNotes: NoteResource[] = [
  {
    id: 'n1',
    title: 'Lecture 4 - Database B+ Trees & Indexing.pdf',
    course: 'Database Systems (CSE-3101)',
    uploadedBy: 'CR Tanvir',
    timestamp: '2026-05-18T16:00:00Z',
    downloadCount: 34,
    fileSize: '4.2 MB'
  },
  {
    id: 'n2',
    title: 'Software Development Methodologies Comparison.pdf',
    course: 'Software Engineering (CSE-3103)',
    uploadedBy: 'Dr. Tariqul Islam',
    timestamp: '2026-05-12T11:20:00Z',
    downloadCount: 28,
    fileSize: '1.8 MB'
  },
  {
    id: 'n3',
    title: 'Computer Networks - Chapter 3 Transport Layer Slides.pdf',
    course: 'Computer Networks (CSE-3105)',
    uploadedBy: 'CR Tanvir',
    timestamp: '2026-05-15T08:45:00Z',
    downloadCount: 45,
    fileSize: '5.6 MB'
  },
  {
    id: 'n4',
    title: 'AI Lab 2 - Pre-requisite Python Scripts for Search.zip',
    course: 'Artificial Intelligence (CSE-3107)',
    uploadedBy: 'Lec. Sadia Afrin',
    timestamp: '2026-05-21T13:10:00Z',
    downloadCount: 19,
    fileSize: '12.4 MB'
  }
];

export const initialClassmates: Classmate[] = [
  { id: 'c1', name: 'Al-Amin Rahman', roll: 'CSE-023-1101', email: 'alamin.rahman@student.edu', phone: '+880 1712 345678', section: 'CSE-A', department: 'CSE' },
  { id: 'c2', name: 'Farnaz Chowdhury', roll: 'CSE-023-1102', email: 'farnaz.c@student.edu', phone: '+880 1819 876543', section: 'CSE-A', department: 'CSE' },
  { id: 'c3', name: 'Tanvir Reza Mukto', roll: 'CSE-023-1103', email: 'tanvir.reza@student.edu', phone: '+880 1515 554321', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80', section: 'CSE-A', department: 'CSE' },
  { id: 'c4', name: 'Mahmudul Hasan', roll: 'CSE-023-1104', email: 'mahmud.h@student.edu', phone: '+880 1911 223344', section: 'CSE-A', department: 'CSE' },
  { id: 'c5', name: 'Nusrat Jahan', roll: 'CSE-023-1105', email: 'nusrat.j@student.edu', phone: '+880 1616 667788', section: 'CSE-A', department: 'CSE' },
  { id: 'c6', name: 'Rashedul Islam', roll: 'CSE-023-1106', email: 'rashed.i@student.edu', phone: '+880 1313 445566', section: 'CSE-A', department: 'CSE' },
  { id: 'c7', name: 'Sajia Afrin', roll: 'CSE-023-1107', email: 'sajia.a@student.edu', phone: '+880 1711 778899', section: 'CSE-B', department: 'CSE' }
];

export const initialPendingUsers = [
  { id: 'p1', name: 'Rashedul Islam', email: 'rashed.i@student.edu', role: 'Student', department: 'CSE', semester: 'Spring 2026', section: 'CSE-A' },
  { id: 'p2', name: 'Nusrat Jahan', email: 'nusrat.j@student.edu', role: 'Student', department: 'CSE', semester: 'Spring 2026', section: 'CSE-A' },
  { id: 'p3', name: 'Sajia Afrin', email: 'sajia.a@student.edu', role: 'CR', department: 'CSE', semester: 'Spring 2026', section: 'CSE-B' },
  { id: 'p4', name: 'Abdur Rahman', email: 'abdur.r@professor.edu', role: 'Admin', department: 'EEE', semester: 'Spring 2026', section: 'EEE-A' }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'l1', actor: 'Super Admin', action: 'Approved Admin Role', target: 'John Doe (john.doe@admin.edu)', timestamp: '2026-05-23T11:15:00Z', type: 'approval' },
  { id: 'l2', actor: 'Admin Office', action: 'Created New Section', target: 'CSE-C (Spring 2026)', timestamp: '2026-05-23T10:30:00Z', type: 'section_edit' },
  { id: 'l3', actor: 'Admin Office', action: 'Updated Bus route schedule', target: 'Mirpur Link (Route-5)', timestamp: '2026-05-23T09:45:00Z', type: 'transport_edit' },
  { id: 'l4', actor: 'Super Admin', action: 'Modified System Settings', target: 'Enabled Student Registration', timestamp: '2026-05-23T08:00:00Z', type: 'settings' }
];
