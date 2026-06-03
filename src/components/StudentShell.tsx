import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Calendar, 
  Bus, 
  FileText, 
  User as UserIcon, 
  LogOut, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  BookOpen, 
  Download, 
  Plus, 
  Compass,
  RotateCcw, 
  RefreshCw,
  Search,
  CheckCircle,
  Timer,
  ChevronRight,
  ChevronLeft,
  Users,
  SquareCheckBig,
  CalendarClock,
  MessageCircle,
  ClipboardList,
  GraduationCap,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Footprints,
  X,
  Filter,
  SlidersHorizontal,
  UserRound,
  Send,
  ArrowUpDown,
  Phone,
  Mail,
  Inbox,
  Check,
  SearchX
} from 'lucide-react';
import { User, RoutineEntry, Announcement, BusRoute, NoteResource, Classmate, UserTransport } from '../types';
import RoutineScreen from './RoutineScreen';

// Mock Data segment for Academic Hub (Screen 2)
const quizzes = [
  {
    date: { day: '12', month: 'JUN' },
    code: 'SE131',
    name: 'Data Structure',
    detail: 'Quiz 2 · Chapter 3-4',
    proximity: 'In 2 days',
    pillVariant: 'WARN'
  },
  {
    date: { day: '18', month: 'JUN' },
    code: 'MAT102',
    name: 'Mathematics II',
    detail: 'Quiz 1 · Differential Calculus',
    proximity: '8 days',
    pillVariant: 'NEUTRAL'
  },
  {
    date: { day: '25', month: 'JUN' },
    code: 'SE123',
    name: 'Discrete Mathematics',
    detail: 'Quiz 3 · Graph Theory',
    proximity: '15 days',
    pillVariant: 'NEUTRAL'
  }
];

const midterms = [
  {
    date: { day: '30', month: 'JUN' },
    code: 'MAT102',
    name: 'Mathematics II',
    detail: 'Mid-term · 90 min',
    proximity: 'Room 913',
    pillVariant: 'INFO'
  },
  {
    date: { day: '01', month: 'JUL' },
    code: 'SE131',
    name: 'Data Structure',
    detail: 'Mid-term · 90 min',
    proximity: 'Room 1504',
    pillVariant: 'INFO'
  },
  {
    date: { day: '02', month: 'JUL' },
    code: 'SE123',
    name: 'Discrete Mathematics',
    detail: 'Mid-term · 90 min',
    proximity: 'TBA',
    pillVariant: 'TBA'
  },
  {
    date: { day: '03', month: 'JUL' },
    code: 'SE213',
    name: 'Digital Electronics & Logic',
    detail: 'Mid-term · 90 min',
    proximity: 'Room 811',
    pillVariant: 'INFO'
  }
];

const finals = [
  {
    date: { day: '16', month: 'JUL' },
    code: 'SE131',
    name: 'Data Structure',
    detail: 'Final · 180 min',
    proximity: 'Room 1504',
    pillVariant: 'INFO'
  },
  {
    date: { day: '19', month: 'JUL' },
    code: 'MAT102',
    name: 'Mathematics II',
    detail: 'Final · 180 min',
    proximity: 'Room 913',
    pillVariant: 'INFO'
  },
  {
    date: { day: '22', month: 'JUL' },
    code: 'SE123',
    name: 'Discrete Mathematics',
    detail: 'Final · 120 min', // Or 180 min typical
    proximity: 'YKSG3-106',
    pillVariant: 'INFO'
  },
  {
    date: { day: '25', month: 'JUL' },
    code: 'SE213',
    name: 'Digital Electronics & Logic',
    detail: 'Final · 180 min',
    proximity: 'Room 811',
    pillVariant: 'INFO'
  },
  {
    date: { day: '28', month: 'JUL' },
    code: 'SE132',
    name: 'Lab Data Structure',
    detail: 'Final · 120 min · practical',
    proximity: 'Room 710',
    pillVariant: 'INFO'
  }
];

const deadlines = [
  {
    date: { day: '11', month: 'JUN' },
    courseCode: 'SE131',
    type: 'ASSIGNMENT',
    title: 'Lab 4 report submission',
    author: 'Dr. NSL',
    role: 'Faculty',
    detail: '11:59 pm',
    daysLeft: '1d',
    urgent: true
  },
  {
    date: { day: '12', month: 'JUN' },
    courseCode: 'SE131',
    type: 'QUIZ',
    title: 'Quiz 2 — Trees and Graphs',
    author: 'Dr. NSL',
    role: 'Faculty',
    detail: 'Slot 2, in class',
    daysLeft: '2d',
    urgent: false
  },
  {
    date: { day: '18', month: 'JUN' },
    courseCode: 'MAT102',
    type: 'QUIZ',
    title: 'Quiz 1 — Differential Calculus',
    author: 'Dr. DK',
    role: 'Faculty',
    detail: 'Slot 1, in class',
    daysLeft: '8d',
    urgent: false
  },
  {
    date: { day: '30', month: 'JUN' },
    courseCode: 'MAT102',
    type: 'MIDTERM',
    title: 'Mid-term examination',
    author: 'Admin Office',
    role: 'Admin',
    detail: 'Room 913 · 90 min',
    daysLeft: '20d',
    urgent: false
  }
];

const broadcasts = [
  {
    date: '09/06/2026',
    avatar: 'AO',
    author: 'Admin Office',
    role: 'ADMIN',
    title: 'Mid-term schedule released',
    body: 'Mid-terms run 30 Jun – 3 Jul. Check the Academic Hub for slot times and room numbers.',
    seen: 41,
    urgent: true
  },
  {
    date: '08/06/2026',
    avatar: 'SR',
    author: 'CR Sadia Rahman',
    role: 'CR',
    title: 'Tuesday SE131 quiz scope',
    body: 'Chapters 3 to 5. Open book. 30 minutes. Bring your own paper.',
    seen: 39,
    urgent: false
  },
  {
    date: '07/06/2026',
    avatar: 'TC',
    author: 'Transport Control',
    role: 'TRANSPORT',
    title: 'Route 7 pickup moved to Gate 2',
    body: 'From tomorrow morning, Route 7 picks up from Gate 2 instead of the main entrance.',
    seen: 38,
    urgent: false
  }
];

const sweCourses = [
  { code: 'SE131', name: 'Data Structure' },
  { code: 'SE132', name: 'Lab Data Structure' },
  { code: 'SE123', name: 'Discrete Mathematics' },
  { code: 'SE213', name: 'Digital Electronics & Logic' },
  { code: 'MAT102', name: 'Mathematics II' }
];

const initialAssignmentsList = [
  {
    id: 'asg-1',
    day: '11',
    month: 'JUN',
    dateValue: '2026-06-11',
    code: 'SE131',
    courseName: 'Data Structure',
    title: 'Lab 4 report submission',
    type: 'Lab report',
    author: 'Dr. Nazmul Sultan Lipu',
    authorShort: 'Dr. NSL',
    authorType: 'Faculty',
    proximity: 'Tomorrow',
    proximityColor: 'danger',
    daysDiff: 1,
    submitted: false,
    overdue: false
  },
  {
    id: 'asg-2',
    day: '12',
    month: 'JUN',
    dateValue: '2026-06-12',
    code: 'SE131',
    courseName: 'Data Structure',
    title: 'Quiz 2 — Trees and Graphs',
    type: 'Quiz',
    author: 'Dr. Nazmul Sultan Lipu',
    authorShort: 'Dr. NSL',
    authorType: 'Faculty',
    proximity: 'In 2 days',
    proximityColor: 'danger',
    daysDiff: 2,
    submitted: false,
    overdue: false
  },
  {
    id: 'asg-3',
    day: '18',
    month: 'JUN',
    dateValue: '2026-06-18',
    code: 'MAT102',
    courseName: 'Mathematics II',
    title: 'Quiz 1 — Differential Calculus',
    type: 'Quiz',
    author: 'Dr. Kazi Noman Ahmed',
    authorShort: 'Dr. KNA',
    authorType: 'Faculty',
    proximity: '8 days',
    proximityColor: 'neutral',
    daysDiff: 8,
    submitted: false,
    overdue: false
  },
  {
    id: 'asg-4',
    day: '08',
    month: 'JUN',
    dateValue: '2026-06-08',
    code: 'SE123',
    courseName: 'Discrete Mathematics',
    title: 'Graph theory worksheet',
    type: 'Assignment',
    author: 'Sadia Rahman',
    authorShort: 'CR Sadia',
    authorType: 'CR',
    proximity: '2d ago',
    proximityColor: 'neutral',
    daysDiff: -2,
    submitted: true,
    submitDate: '07 Jun',
    overdue: false
  },
  {
    id: 'asg-5',
    day: '07',
    month: 'JUN',
    dateValue: '2026-06-07',
    code: 'SE213',
    courseName: 'Digital Electronics & Logic',
    title: 'Boolean algebraic reductions',
    type: 'Assignment',
    author: 'Sadia Rahman',
    authorShort: 'CR Sadia',
    authorType: 'CR',
    proximity: '3d ago',
    proximityColor: 'neutral',
    daysDiff: -3,
    submitted: true,
    submitDate: '06 Jun',
    overdue: false
  }
];

const facultyMembers = [
  { key: 'lipu', initials: 'NL', fullName: 'Dr. Nazmul Sultan Lipu', designation: 'Associate Professor & Associate Head', course: 'SE131 · SE132', phone: '+880 1711 123 456', dept: 'SWE', group: 'L', shortName: 'Dr. NSL' },
  { key: 'ahmed', initials: 'KNA', fullName: 'Dr. Kazi Noman Ahmed', designation: 'Professor', course: 'MAT102', phone: '+880 1819 111 222', dept: 'MATH', group: 'A', shortName: 'Dr. KNA' },
  { key: 'bhuiyan', initials: 'AB', fullName: 'Dr. Ashraful Bhuiyan', designation: 'Professor & CSE Dean', course: 'SE123', phone: '+880 1911 333 444', dept: 'SWE', group: 'B', shortName: 'Dr. AB' },
  { key: 'karim', initials: 'TI', fullName: 'Dr. Tariqul Islam', designation: 'Assistant Professor', course: 'SE213', phone: '+880 1552 555 666', dept: 'SWE', group: 'I', shortName: 'Dr. TI' }
];

const initialPollsList = [
  {
    id: 'poll-1',
    status: 'Closing today',
    closeTime: '6:00 pm',
    question: 'Should the makeup class for SE131 be scheduled on Sunday 2:00 pm?',
    author: 'Sadia Rahman',
    options: [
      { text: 'Yes, I am available', votes: 24 },
      { text: 'No, scheduled bus issue', votes: 12 },
      { text: 'No, midterm conflict', votes: 3 }
    ],
    voted: false,
    userChoice: null,
    totalVotes: 39,
    turnout: 93,
    closed: false
  },
  {
    id: 'poll-2',
    status: 'Closed',
    closeTime: 'Closed Mon',
    question: 'CR elections: Are we satisfied with the present administrative terms?',
    author: 'Sadia Rahman',
    options: [
      { text: 'Yes, proceed', votes: 32 },
      { text: 'No, seek adjustments', votes: 8 }
    ],
    voted: true,
    userChoice: 0,
    totalVotes: 40,
    turnout: 95,
    closed: true
  }
];

const initialEventsList = [
  {
    id: 'evt-1',
    type: 'Upcoming',
    banner: 'coral',
    day: '14',
    month: 'JUN',
    title: 'CSE Programming Contest',
    dateText: 'Sun 14 Jun · 9:00 am',
    location: 'Auditorium 14B',
    organizer: 'Sadia Rahman',
    description: 'SWE-M team contest. Team size is 3 students. Registered members please bring laptops.',
    goingCount: 15,
    isGoing: false,
    past: false
  },
  {
    id: 'evt-2',
    type: 'Upcoming',
    banner: 'ink-900',
    day: '16',
    month: 'JUN',
    title: 'Digital Systems Workshop',
    dateText: 'Tue 16 Jun · 11:30 am',
    location: 'Lab Room 710',
    organizer: 'Sadia Rahman',
    description: 'Exploring FPGA and Logisim reductions. Highly recommended for SE213 students.',
    goingCount: 8,
    isGoing: true,
    past: false
  },
  {
    id: 'evt-3',
    type: 'Past',
    banner: 'amber',
    day: '05',
    month: 'JUN',
    title: 'Semester Orientation',
    dateText: 'Fri 05 Jun · 10:00 am',
    location: 'Main Campus Hall',
    organizer: 'Sadia Rahman',
    description: 'Welcome and introduction of course coordinators and batch guidelines.',
    goingCount: 38,
    isGoing: true,
    past: true
  }
];

const initialThreadsList = [
  {
    id: 'thread-1',
    asker: 'Tanvir',
    initials: 'TR',
    timestamp: '1h ago',
    tag: 'Urgent',
    question: 'When will the Lab 4 manual printouts be verified? Do we need Dr. Lipu signature today?',
    replied: true,
    replyText: 'No today signing not required. Complete the reports and we will collect and verify them together on Sunday class slot.',
    replyTimestamp: '30m ago'
  },
  {
    id: 'thread-2',
    asker: 'Sadid Hossain',
    initials: 'SH',
    timestamp: '2h ago',
    tag: 'Routine',
    question: 'Is the MAT102 makeup on Saturday cancelled?',
    replied: false,
    replyText: '',
    replyTimestamp: ''
  },
  {
    id: 'thread-3',
    asker: 'Nusrat Jahan',
    initials: 'NJ',
    timestamp: '4h ago',
    tag: 'General',
    question: 'Where can we collect the Digital Logic syllabus pamphlet? Is it still available in SWE department?',
    replied: true,
    replyText: 'Yes, it is still available near SWE office file cabinet. Grab file SE213.',
    replyTimestamp: '3h ago'
  }
];

const getProximityInfo = (dateValueStr: string) => {
  const currentDate = new Date('2026-06-10'); // Today is Wed 10 Jun
  const dueDate = new Date(dateValueStr);
  const diffTime = dueDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d ago`, color: 'neutral', overdue: true };
  } else if (diffDays === 0) {
    return { text: 'Today', color: 'danger', overdue: false };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', color: 'danger', overdue: false };
  } else if (diffDays === 2) {
    return { text: 'In 2 days', color: 'danger', overdue: false };
  } else if (diffDays <= 4) {
    return { text: `In ${diffDays} days`, color: 'warning', overdue: false };
  } else {
    return { text: `${diffDays} days`, color: 'neutral', overdue: false };
  }
};

interface StudentShellProps {
  currentUser: User;
  onUpdateUser: (updates: Partial<User>) => void;
  routine: RoutineEntry[];
  announcements: Announcement[];
  busRoutes: BusRoute[];
  notes: NoteResource[];
  attendance: Record<string, Record<string, { joined: number; missed: number }>>;
  classmates: Classmate[];
  onAddNote: (newNote: NoteResource) => void;
  onLogout: () => void;
  onChangeContext: () => void;
}

export default function StudentShell({
  currentUser,
  onUpdateUser,
  routine,
  announcements,
  busRoutes,
  notes,
  attendance,
  classmates,
  onAddNote,
  onLogout,
  onChangeContext
}: StudentShellProps) {
  const [activeTab, setActiveTab] = useState<'Home' | 'Routine' | 'Bus' | 'Notes' | 'Me'>('Home');
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [successNoteId, setSuccessNoteId] = useState<string | null>(null);

  // States for Student-contributed note dialog
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourse, setNoteCourse] = useState('Database Systems (CSE-3101)');
  const [noteSize, setNoteSize] = useState('2.4 MB');

  // Bus filtering
  const [busSearchQuery, setBusSearchQuery] = useState('');

  // Bus tracking and simulation state for Student Shell Info
  const [studentRidesBus, setStudentRidesBus] = useState<boolean>(true);
  const [studentDeadlineMs, setStudentDeadlineMs] = useState<number>(() => {
    return Date.now() + 32 * 60 * 1000;
  });
  const [studentCurrentMs, setStudentCurrentMs] = useState<number>(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStudentCurrentMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Top Toast Alerter System states
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<any>(null);

  const handleTriggerToast = (message: string, duration = 1800) => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setActiveToast(message);
    const id = setTimeout(() => {
      setActiveToast(null);
    }, duration);
    setToastTimeoutId(id);
  };

  const handleUndoDraft = () => {
    if (draftBackup) {
      setSelectedCourse(draftBackup.course);
      setNewAsgDateRaw(draftBackup.dateRaw);
      setNewAsgDateString(draftBackup.dateString);
      setNewAsgType(draftBackup.type);
      setNewAsgTitle(draftBackup.title);
      setNewAsgDesc(draftBackup.desc);
      setIsPostAssignmentOpen(true);
      setActiveToast(null);
    }
  };

  // Screen 2 Academic Hub navigation states
  const [currentView, setCurrentView] = useState<'Main' | 'AcademicHub' | 'Assignments' | 'Faculty' | 'Polls' | 'Events' | 'AskCR'>('Main');
  const [activeHubTab, setActiveHubTab] = useState<'Quizzes' | 'Mid-terms' | 'Finals'>('Quizzes');

  // demoRole switches between Student and CR or Faculty (as specified in each screen requirements)
  const [demoRole, setDemoRole] = useState<'Student' | 'CR' | 'Faculty'>('Student');

  // Interactive local states for 5 new screens
  const [assignments, setAssignments] = useState(initialAssignmentsList);
  const [activeAssignmentTab, setActiveAssignmentTab] = useState<'Due' | 'Submitted'>('Due');
  const [isPostAssignmentOpen, setIsPostAssignmentOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ code: string; name: string } | null>(null);
  const [newAsgDateRaw, setNewAsgDateRaw] = useState('');
  const [newAsgDateString, setNewAsgDateString] = useState('');
  const [newAsgType, setNewAsgType] = useState<'Assignment' | 'Lab report' | 'Project' | 'Quiz' | 'Reading'>('Assignment');
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const [draftBackup, setDraftBackup] = useState<{
    course: { code: string; name: string } | null;
    dateRaw: string;
    dateString: string;
    type: 'Assignment' | 'Lab report' | 'Project' | 'Quiz' | 'Reading';
    title: string;
    desc: string;
  } | null>(null);

  const [courseError, setCourseError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [titleError, setTitleError] = useState(false);

  // Helper date parsing and difference utilities
  const parseDateStr = (dStr: string): Date => {
    const [y, m, d] = dStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const getDaysDifference = (targetDateStr: string): number => {
    const targetDate = parseDateStr(targetDateStr);
    const todayDate = new Date(2026, 5, 10); // June 10, 2026
    const diffTime = targetDate.getTime() - todayDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const monthsAbbr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const getMonthAbbr = (dateStr: string): string => {
    const [_, m] = dateStr.split('-');
    return monthsAbbr[parseInt(m, 10) - 1];
  };

  const getDayString = (dateStr: string): string => {
    const [_, __, d] = dateStr.split('-');
    return d;
  };

  const handlePostAssignment = () => {
    if (!selectedCourse) {
      handleTriggerToast('Pick a course');
      setCourseError(true);
      document.getElementById('asg-field-course')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!newAsgDateRaw) {
      handleTriggerToast('Pick a due date');
      setDateError(true);
      document.getElementById('asg-field-date')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!newAsgTitle.trim()) {
      handleTriggerToast('Add a title');
      setTitleError(true);
      document.getElementById('asg-field-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const titleStr = newAsgTitle.trim();
    const descStr = newAsgDesc.trim();

    const diffDays = getDaysDifference(newAsgDateRaw);
    let proxText = '';
    let proximityColor: 'danger' | 'warning' | 'neutral' = 'neutral';
    if (diffDays === 0) {
      proxText = 'Today';
      proximityColor = 'danger';
    } else if (diffDays === 1) {
      proxText = 'Tomorrow';
      proximityColor = 'danger';
    } else if (diffDays === 2 || diffDays === 3) {
      proxText = `In ${diffDays} days`;
      proximityColor = 'warning';
    } else {
      proxText = `${diffDays} days`;
      proximityColor = 'neutral';
    }

    const dayVal = getDayString(newAsgDateRaw);
    const monthVal = getMonthAbbr(newAsgDateRaw);
    const crFirstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Sadia';
    const authorShortLabel = `CR ${crFirstName}`;

    const newAsgItem = {
      id: `asg-${Date.now()}`,
      day: dayVal,
      month: monthVal,
      dateValue: newAsgDateRaw,
      code: selectedCourse.code,
      courseName: selectedCourse.name,
      title: titleStr,
      type: newAsgType,
      author: currentUser.name || 'Sadia Rahman',
      authorShort: authorShortLabel,
      authorType: 'CR' as const,
      proximity: proxText,
      proximityColor: proximityColor,
      daysDiff: diffDays,
      submitted: false,
      overdue: false,
      description: descStr
    };

    setAssignments((prev) => [newAsgItem, ...prev]);
    setIsPostAssignmentOpen(false);

    handleTriggerToast(`Posted '${titleStr}' to ${selectedCourse.code} — 42 students notified`, 3500);

    setSelectedCourse(null);
    setNewAsgDateRaw('');
    setNewAsgDateString('');
    setNewAsgType('Assignment');
    setNewAsgTitle('');
    setNewAsgDesc('');
    setCourseError(false);
    setDateError(false);
    setTitleError(false);
  };

  const handleDismissSheet = () => {
    const hasData = selectedCourse !== null || newAsgDateRaw !== '' || newAsgTitle.trim() !== '' || newAsgDesc.trim() !== '';
    if (hasData) {
      setDraftBackup({
        course: selectedCourse,
        dateRaw: newAsgDateRaw,
        dateString: newAsgDateString,
        type: newAsgType,
        title: newAsgTitle,
        desc: newAsgDesc
      });
      setIsPostAssignmentOpen(false);
      handleTriggerToast('Draft discarded · Undo', 4000);
    } else {
      setIsPostAssignmentOpen(false);
    }
  };

  const [facultySearch, setFacultySearch] = useState('');

  const [polls, setPolls] = useState(initialPollsList);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '']);
  const [newPollCloses, setNewPollCloses] = useState('6:00 pm today');

  const [events, setEvents] = useState(initialEventsList);
  const [activeEventTab, setActiveEventTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('14 Jun 2026');
  const [newEventTime, setNewEventTime] = useState('9:00 am');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventBanner, setNewEventBanner] = useState<'ink-900' | 'coral' | 'amber'>('coral');

  const [threads, setThreads] = useState(initialThreadsList);
  const [newThreadText, setNewThreadText] = useState('');
  const [newThreadTag, setNewThreadTag] = useState<'General' | 'Routine' | 'Urgent'>('General');
  const [inlineReplyText, setInlineReplyText] = useState<{ [threadId: string]: string }>({});

  const renderRoleSwitch = (allowedRoles: ('Student' | 'CR' | 'Faculty')[]) => {
    return (
      <div className="bg-ink-100 p-1 rounded-pill flex items-center justify-between select-none">
        <span className="text-[11px] font-bold text-fg-3 uppercase tracking-wider pl-3.5">
          Mock Role:
        </span>
        <div className="flex gap-1">
          {allowedRoles.map((role) => {
            const isActive = demoRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setDemoRole(role);
                  handleTriggerToast(`Mock role toggled to: ${role}`);
                }}
                className={`py-1.5 px-3 rounded-pill text-[12px] font-bold cursor-pointer transition-all duration-120 ${
                  isActive
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'text-fg-2 hover:text-fg-1 bg-transparent'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDepartmentPendingState = (featureTitle: string, icon: React.ReactNode) => {
    return (
      <div className="space-y-5 select-none text-fg-1 font-sans">
        {/* HEADER CARD */}
        <div className="relative bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 pl-[22px] overflow-hidden flex items-center justify-between text-left">
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-coral" />
          <div className="space-y-1">
            <h2 className="text-[15px] font-semibold text-fg-1 leading-snug tracking-tight font-sans">
              {featureTitle} planner
            </h2>
            <p className="text-[12px] font-medium text-fg-3 leading-none font-sans flex items-center gap-1 flex-wrap">
              <span className="font-mono font-semibold text-fg-1">{deptCode}-{sectionCode}</span>
              <span>&middot;</span>
              <span>Batch</span>
              <span className="font-mono font-semibold text-fg-1">{batchVal || '?'}</span>
              <span>&middot;</span>
              <span>not published yet</span>
            </p>
          </div>
          <div className="shrink-0 text-fg-3">
            {icon}
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-coral-50 flex items-center justify-center text-coral">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-fg-1 leading-snug tracking-tight font-sans">
              {featureTitle} not ready
            </h3>
            <p className="text-[13px] font-medium text-fg-3 max-w-xs mx-auto leading-relaxed font-sans">
              The coordinator has not published the official {featureTitle.toLowerCase()} for this academic stream yet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTriggerToast(`We'll notify you under ${deptCode}-${sectionCode} Batch ${batchVal || '?'}`)}
            className="w-full py-3 px-4 bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-semibold text-[14px] rounded-full shadow-coral-glow scale-100 hover:scale-[0.98] active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            Notify me when ready
          </button>
        </div>
      </div>
    );
  };

  const renderAssignmentsScreen = () => {
    const dueCount = assignments.filter(a => !a.submitted && !a.overdue && (a.daysDiff === undefined || a.daysDiff <= 7)).length;
    const overdueCount = assignments.filter(a => !a.submitted && a.overdue).length;
    const submittedCount = assignments.filter(a => a.submitted).length;

    const filteredList = assignments.filter(a => activeAssignmentTab === 'Due' ? !a.submitted : a.submitted);

    return (
      <div className="space-y-4 text-left select-none">
        {renderRoleSwitch(['Student', 'CR', 'Faculty'])}

        {/* SUMMARY HERO */}
        <div className="bg-coral-50 border border-coral-100 rounded-[14px] p-4 flex select-none">
          <div className="flex-1 text-center font-sans">
            <span className="text-[20px] font-extrabold tracking-tight text-ink-900 leading-none block font-mono">
              {dueCount + overdueCount} due
            </span>
            <span className="text-[10px] font-bold text-fg-3 uppercase tracking-wider block mt-1">
              this week
            </span>
          </div>
          <div className="flex-1 text-center border-l border-coral-100/60 font-sans">
            <span className="text-[20px] font-extrabold tracking-tight text-[#E5484D] leading-none block font-mono">
              {overdueCount} overdue
            </span>
            <span className="text-[10px] font-bold text-fg-3 uppercase tracking-wider block mt-1">
              submit asap
            </span>
          </div>
          <div className="flex-1 text-center border-l border-coral-100/60 font-sans">
            <span className="text-[20px] font-extrabold tracking-tight text-ink-900 leading-none block font-mono">
              {submittedCount}
            </span>
            <span className="text-[10px] font-bold text-fg-3 uppercase tracking-wider block mt-1">
              this term
            </span>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-ink-100 p-1 rounded-pill flex gap-1 mt-4 select-none">
          {(['Due', 'Submitted'] as const).map((tab) => {
            const isActive = activeAssignmentTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveAssignmentTab(tab)}
                className={`flex-1 text-center py-2 px-3.5 rounded-pill text-[13px] font-bold font-sans transition-all duration-120 cursor-pointer ${
                  isActive
                    ? 'bg-ink-900 text-white shadow-1'
                    : 'text-fg-2 hover:text-fg-1 bg-transparent'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-2.5">
          {filteredList.map((item) => {
            const isOverdue = item.overdue && !item.submitted;
            const pmInfo = getProximityInfo(item.dateValue);

            let proxText = pmInfo.text;
            let proxColorClass = '';
            if (pmInfo.color === 'danger') proxColorClass = 'bg-[#FCE8E9] text-[#E5484D]';
            else if (pmInfo.color === 'warning') proxColorClass = 'bg-warning-bg text-warning-fg';
            else proxColorClass = 'bg-ink-100 text-ink-600';

            let authorClass = 'font-bold text-ink-900';
            if (item.authorType === 'Faculty') authorClass = 'font-semibold text-[#7A4A00]';
            if (item.authorType === 'CR') authorClass = 'font-semibold text-coral';

            return (
              <motion.div
                key={item.id}
                layoutId={item.id}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3.5 flex gap-[14px] relative items-center"
              >
                {/* Date Tile */}
                <div className={`w-14 text-center rounded-[10px] py-[8px] px-0 flex flex-col items-center justify-center leading-none select-none shrink-0 ${
                  isOverdue ? 'bg-[#FCE8E9]' : 'bg-ink-100'
                }`}>
                  <span className={`font-mono text-[17px] font-bold block leading-none tabular-numbers ${
                    isOverdue ? 'text-[#E5484D]' : 'text-fg-1'
                  }`}>
                    {item.day}
                  </span>
                  <span className={`font-sans text-[10px] font-bold block tracking-[0.06em] mt-1 uppercase leading-none ${
                    isOverdue ? 'text-[#E5484D]' : 'text-fg-3'
                  }`}>
                    {item.month}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 font-sans">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] font-bold text-fg-1">{item.code}</span>
                    <span className="text-fg-3">&middot;</span>
                    <span className="text-[12px] font-medium text-fg-2 truncate">{item.courseName}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-ink-900 leading-snug mt-1 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-medium text-fg-3 mt-1 leading-none flex items-center gap-1 flex-wrap">
                    <span>{item.type}</span>
                    <span>&middot;</span>
                    <span>Posted by</span>
                    <span className={authorClass}>{item.authorShort}</span>
                  </p>
                </div>

                {/* Proximity / Actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {item.submitted ? (
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-[#E5F7EE] text-[#0F6B43] rounded-pill leading-none font-sans select-none flex items-center gap-0.5">
                      ✓ Submitted
                    </span>
                  ) : (
                    <>
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-pill leading-none font-sans select-none ${proxColorClass}`}>
                        {item.overdue ? `${Math.abs(item.daysDiff)}d overdue` : proxText}
                      </span>
                      {demoRole === 'Student' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setAssignments(prev => prev.map(a => a.id === item.id ? { ...a, submitted: true, submitDate: '10 Jun', overdue: false } : a));
                            handleTriggerToast(`Marked submitted – ${item.title}`);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white rounded-pill cursor-pointer transition-all font-sans"
                        >
                          Mark submitted
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
          {filteredList.length === 0 && (
            <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center text-fg-3 text-sm font-sans">
              No assignments here.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFacultyScreen = () => {
    const query = facultySearch.trim().toLowerCase();
    const filtered = facultyMembers.filter(f => 
      f.fullName.toLowerCase().includes(query) ||
      f.designation.toLowerCase().includes(query) ||
      f.course.toLowerCase().includes(query) ||
      f.dept.toLowerCase().includes(query)
    );

    const groups: { [key: string]: typeof facultyMembers } = {};
    filtered.forEach(f => {
      if (!groups[f.group]) {
         groups[f.group] = [];
      }
      groups[f.group].push(f);
    });

    const sortedLetterKeys = Object.keys(groups).sort();

    return (
      <div className="space-y-4 text-left font-sans select-none">
        {/* VIEW SEARCH ROW */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3 flex items-center gap-2 select-none">
          <Search size={18} className="text-fg-3 shrink-0" strokeWidth={2} />
          <input
            type="text"
            value={facultySearch}
            onChange={(e) => setFacultySearch(e.target.value)}
            placeholder="Search by name, designation, or course…"
            className="w-full bg-transparent text-[14px] font-medium text-fg-1 placeholder-fg-3 border-none outline-none focus:ring-0 leading-none"
          />
          {facultySearch && (
            <button
              onClick={() => setFacultySearch('')}
              className="text-fg-3 hover:text-fg-1 p-1 rounded-full cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FACULTY LIST */}
        <div className="space-y-4">
          {sortedLetterKeys.map((letter) => (
            <div key={letter} className="space-y-2">
              <div className="relative bg-coral-50 border border-coral-100 rounded-[10px] py-2 px-3 flex items-center select-none">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-coral leading-none">
                  Letter {letter}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {groups[letter].map((fac) => (
                  <div
                    key={fac.key}
                    className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3 text-left"
                  >
                    <div className="flex gap-[14px] start">
                      <div className="w-11 h-11 rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-[13px] shrink-0 select-none font-mono">
                        {fac.initials}
                      </div>
                      <div className="flex-1 min-w-0 font-sans">
                        <h4 className="text-[14px] font-bold text-fg-1 leading-snug tracking-tight">
                          {fac.fullName}
                        </h4>
                        <p className="text-[12px] font-medium text-fg-2 mt-1 leading-normal font-sans">
                          {fac.designation} &middot; {fac.course}
                        </p>
                        <div className="inline-block mt-1.5 leading-none">
                          <span className="font-mono text-[10px] font-bold text-fg-2 bg-ink-200 px-2 py-0.5 rounded-[5px] uppercase tracking-wider">
                            {fac.dept}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 select-none font-mono text-[11px] text-fg-3 leading-none">
                          <Clock size={11} className="text-fg-3" />
                          <span>{fac.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2.5 border-t border-subtle select-none font-sans">
                      <motion.a
                        whileTap={{ scale: 0.95 }}
                        href={`tel:${fac.phone.replace(/\s+/g, '')}`}
                        onClick={() => handleTriggerToast(`Calling ${fac.fullName}`)}
                        className="flex-1 py-1.5 px-2 bg-coral-50 hover:bg-coral-100 text-coral font-bold text-[12px] rounded-full flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Phone size={12} strokeWidth={2.5} />
                        Call
                      </motion.a>
                      <motion.a
                        whileTap={{ scale: 0.95 }}
                        href={`https://wa.me/${fac.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleTriggerToast(`Opening WhatsApp`)}
                        className="flex-1 py-1.5 px-2 bg-[#E5F7EE] hover:bg-[#d4f3e3] text-[#0F6B43] font-bold text-[12px] rounded-full flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <MessageCircle size={12} strokeWidth={2.5} />
                        WhatsApp
                      </motion.a>
                      <motion.a
                        whileTap={{ scale: 0.95 }}
                        href={`mailto:${fac.fullName.toLowerCase().replace(/\s+/g, '')}@daffodilvarsity.edu.bd`}
                        onClick={() => handleTriggerToast(`Composing email`)}
                        className="flex-1 py-1.5 px-2 bg-ink-100 hover:bg-ink-150 text-ink-700 font-bold text-[12px] rounded-full flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Mail size={12} strokeWidth={2.5} />
                        Email
                      </motion.a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center flex flex-col items-center justify-center gap-3">
              <SearchX size={28} className="text-fg-3 text-ink-400" strokeWidth={1.5} />
              <p className="text-[14px] font-medium text-fg-3">
                No faculty match "{facultySearch}"
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPollsScreen = () => {
    return (
      <div className="space-y-4 text-left select-none font-sans">
        {renderRoleSwitch(['Student', 'CR'])}

        {/* POLL LIST */}
        <div className="flex flex-col gap-3">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const turnoutPercent = Math.min(100, Math.round((totalVotes / 42) * 100));
            const showResults = poll.voted || poll.closed || demoRole === 'CR';

            return (
              <div 
                key={poll.id}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col t-left"
              >
                <div className="flex items-center justify-between font-sans leading-none">
                  {poll.status === 'Closing today' ? (
                    <span className="bg-coral-50 text-coral text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider">
                      Closing Today
                    </span>
                  ) : poll.status === 'Active' ? (
                    <span className="bg-[#E5F7EE] text-[#0F6B43] text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="bg-ink-100 text-ink-600 text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider">
                      Closed
                    </span>
                  )}
                  <span className="font-mono text-[11px] font-semibold text-fg-3 leading-none">
                    {poll.closeTime}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-fg-1 leading-snug mt-3 font-sans">
                  {poll.question}
                </h3>
                <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none">
                  Posted by <span className="text-coral font-bold">Sadia Rahman</span>
                </p>

                <div className="flex flex-col gap-2 mt-3.5">
                  {poll.options.map((opt, oIdx) => {
                    const optVotes = opt.votes;
                    const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                    const isUserChoice = poll.userChoice === oIdx;

                    if (!showResults) {
                      return (
                        <motion.button
                          key={oIdx}
                          whileTap={{ scale: 0.99, opacity: 0.92 }}
                          onClick={() => {
                            setPolls(prev => prev.map(p => {
                              if (p.id === poll.id) {
                                const newOpts = [...p.options];
                                newOpts[oIdx] = { ...newOpts[oIdx], votes: newOpts[oIdx].votes + 1 };
                                return {
                                  ...p,
                                  voted: true,
                                  userChoice: oIdx,
                                  options: newOpts,
                                  totalVotes: p.totalVotes + 1
                                };
                              }
                              return p;
                            }));
                            handleTriggerToast(`Vote recorded — ${opt.text}`);
                          }}
                          className="w-full text-left bg-white border border-ink-200 hover:border-coral rounded-[10px] py-2.5 px-3.5 text-[13px] font-bold text-fg-1 cursor-pointer transition-colors"
                        >
                          {opt.text}
                        </motion.button>
                      );
                    } else {
                      return (
                        <div
                          key={oIdx}
                          className="relative w-full rounded-[10px] border border-subtle overflow-hidden flex items-center justify-between py-2.5 px-3.5 bg-ink-100"
                        >
                          {/* Percent Fill bar */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-coral-50 transition-all duration-300" 
                            style={{ width: `${pct}%`, zIndex: 0 }}
                          />
                          
                          {/* Content Overlay */}
                          <div className="flex items-center gap-2 z-10 select-none text-left flex-1 min-w-0 pr-2 leading-none">
                            {isUserChoice ? (
                              <CheckCircle size={16} className="text-coral shrink-0" strokeWidth={2.5} />
                            ) : (
                              <div className="w-[16px] h-[16px] rounded-full border-[1.5px] border-ink-300 shrink-0" />
                            )}
                            <span className="text-[13px] font-bold text-ink-900 leading-none truncate">
                              {opt.text}
                            </span>
                          </div>

                          <span className="font-mono text-[11px] font-bold text-fg-2 z-10 shrink-0 select-none">
                            {pct}% &middot; {optVotes}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-subtle mt-4 pt-3 text-center leading-none">
                  <span className="font-mono text-[11px] font-semibold text-fg-3 leading-none">
                    {totalVotes} votes &middot; {turnoutPercent}% turnout
                  </span>
                  <span className="text-[11px] font-bold font-sans leading-none">
                    {poll.closed ? (
                      <span className="text-fg-3">Voting closed</span>
                    ) : poll.voted ? (
                      <span className="text-coral flex items-center gap-0.5">
                        <CheckCircle size={12} strokeWidth={2.5} />
                        You voted
                      </span>
                    ) : demoRole === 'CR' ? (
                      <span className="text-coral">You posted this</span>
                    ) : (
                      <span className="text-fg-3">Tap to vote</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEventsScreen = () => {
    const sortedList = events.filter(e => activeEventTab === 'Upcoming' ? !e.past : e.past);

    return (
      <div className="space-y-4 text-left select-none font-sans">
        {renderRoleSwitch(['Student', 'CR'])}

        {/* TABS */}
        <div className="bg-ink-100 p-1 rounded-pill flex gap-1 mt-4 select-none">
          {(['Upcoming', 'Past'] as const).map((tab) => {
            const isActive = activeEventTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveEventTab(tab)}
                className={`flex-1 text-center py-2 px-3.5 rounded-pill text-[13px] font-bold font-sans transition-all duration-120 cursor-pointer ${
                  isActive
                    ? 'bg-ink-900 text-white shadow-1'
                    : 'text-fg-2 hover:text-fg-1 bg-transparent'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* EVENT LIST */}
        <div className="flex flex-col gap-3">
          {sortedList.map((evt) => {
            let bannerClass = 'bg-[#0E0D0B] text-white';
            if (evt.banner === 'coral') bannerClass = 'bg-coral text-white';
            if (evt.banner === 'amber') bannerClass = 'bg-[#FFF1D6] text-[#7A4A00] border-b border-amber-250';

            return (
              <div 
                key={evt.id}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] overflow-hidden flex flex-col text-left"
              >
                <div className={`p-4 gap-3 flex items-center select-none ${bannerClass}`}>
                  <div className="w-[50px] h-[50px] bg-white/15 rounded-[10px] flex flex-col items-center justify-center shrink-0 leading-none">
                    <span className="font-mono text-[20px] font-extrabold leading-none block">
                      {evt.day}
                    </span>
                    <span className="font-sans text-[10px] font-semibold mt-1 uppercase tracking-wider block leading-none">
                      {evt.month}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold leading-snug truncate">
                      {evt.title}
                    </h3>
                    <p className="font-mono text-[11px] opacity-75 mt-1 leading-none">
                      {evt.dateText}
                    </p>
                  </div>
                </div>

                <div className="p-4 font-sans select-none text-left">
                  <div className="flex gap-1.5 items-center leading-none">
                    <MapPin size={14} className="text-fg-2 shrink-0" />
                    <span className="text-[13px] font-bold text-fg-1">
                      {evt.location}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-fg-3 mt-1.5 leading-none">
                    Posted by <span className="text-coral font-bold">{evt.organizer}</span>
                  </p>
                  <div className="border-t border-[#ECEAE5] pt-3 mt-3">
                    <p className="text-[13px] font-medium text-fg-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAFAF9] border-t border-[#ECEAE5] py-2.5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 select-none text-left leading-none">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-[8px] border border-white">
                        TR
                      </div>
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[8px] border border-white">
                        SR
                      </div>
                      <div className="w-5 h-5 rounded-full bg-ink-200 text-ink-600 flex items-center justify-center font-bold text-[8px] border border-white">
                        NS
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-fg-3 leading-none">
                      {evt.goingCount} going
                    </span>
                  </div>

                  <div>
                    {evt.past ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-ink-200 text-ink-400 rounded-full select-none cursor-not-allowed">
                        Event ended
                      </span>
                    ) : demoRole === 'CR' ? (
                      <span className="text-coral text-[11px] font-bold">
                        You posted this
                      </span>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const originalGoing = evt.isGoing;
                          setEvents(prev => prev.map(e => e.id === evt.id ? { 
                            ...e, 
                            isGoing: !originalGoing, 
                            goingCount: originalGoing ? e.goingCount - 1 : e.goingCount + 1 
                          } : e));
                          handleTriggerToast(originalGoing ? 'RSVP cancelled' : `Marked going — ${evt.title}`);
                        }}
                        className={`px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer flex items-center gap-1 transition-all leading-none ${
                          evt.isGoing 
                            ? 'bg-[#E5F7EE] text-[#0F6B43] hover:bg-[#d4f3e3]' 
                            : 'bg-coral-50 text-coral hover:bg-coral-100'
                        }`}
                      >
                        <CheckCircle size={10} strokeWidth={2.5} />
                        {evt.isGoing ? 'Going' : 'Mark going'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAskCRScreen = () => {
    const unansweredCount = threads.filter(t => !t.replied).length;

    return (
      <div className="space-y-4 text-left select-none font-sans">
        {renderRoleSwitch(['Student', 'CR'])}

        {demoRole === 'Student' && (
          <div className="bg-white border border-[#ECEAE5] shadow-2 rounded-[16px] p-5.5 flex flex-col gap-4 font-sans max-w-full overflow-hidden select-none">
            <span className="font-mono text-[10px] font-bold tracking-[0.04em] text-fg-3 uppercase block leading-none">
              ASK YOUR CR
            </span>
            <div className="text-left">
              <textarea
                value={newThreadText}
                onChange={(e) => setNewThreadText(e.target.value)}
                placeholder="What do you need? Ask Sadia anything."
                className="w-full bg-white border border-ink-200 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[10px] p-3.5 text-sm font-normal text-fg-1 placeholder-fg-2 transition-all outline-none min-h-[135px] resize-none"
              />
            </div>

            {/* Tag options select */}
            <div className="flex justify-between items-center w-full select-none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {(['General', 'Routine', 'Urgent'] as const).map((tag) => {
                const isActive = newThreadTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewThreadTag(tag)}
                    style={{ padding: '8px 18px' }}
                    className={`rounded-full text-[13px] font-semibold transition-all duration-[120ms] cursor-pointer border active:scale-[0.97] active:opacity-[0.85] ${
                      isActive
                        ? 'bg-ink-900 border-transparent text-white shadow-sm'
                        : 'bg-white border-ink-200 text-ink-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.97, opacity: 0.85 }}
              onClick={() => {
                if (!newThreadText.trim()) {
                  handleTriggerToast('Enter your question first');
                  return;
                }
                const newT = {
                  id: `thread-custom-${Date.now()}`,
                  asker: 'Tanvir',
                  initials: 'TR',
                  timestamp: 'just now',
                  tag: newThreadTag,
                  question: newThreadText,
                  replied: false,
                  replyText: '',
                  replyTimestamp: ''
                };
                setThreads([newT, ...threads]);
                setNewThreadText('');
                handleTriggerToast('Sent to CR Sadia — typically replies within 2h');
              }}
              style={{ backgroundColor: '#FF5A36', boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }}
              className="relative w-full h-11 rounded-full flex items-center justify-center cursor-pointer border-none text-white transition-all duration-[120ms] outline-none"
            >
              <span className="text-[14px] font-semibold">Send</span>
              <div className="absolute right-[18px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                <Send size={16} strokeWidth={2.0} className="text-white" />
              </div>
            </motion.button>
          </div>
        )}

        <div className="px-0.5 select-none leading-none mt-2.5 pt-1">
          <span className="font-mono text-[10px] font-bold tracking-[0.05em] text-fg-3 uppercase block leading-none">
            {demoRole === 'Student' 
              ? 'YOUR CONVERSATIONS'
              : `INBOX · ${threads.length} THREADS · ${unansweredCount} UNANSWERED`
            }
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {threads.map((thr) => {
            const isUrgent = thr.tag === 'Urgent';
            const isRoutine = thr.tag === 'Routine';

            let tagBgClass = 'bg-ink-100 text-ink-700';
            if (isUrgent) tagBgClass = 'bg-[#FCE8E9] text-[#E5484D]';
            else if (isRoutine) tagBgClass = 'bg-[#EAF5FD] text-[#0A5F9E]';

            return (
              <div
                key={thr.id}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col text-left"
              >
                <div className="flex items-center justify-between font-sans leading-none">
                  <div className="flex items-center gap-2">
                    {demoRole === 'CR' && (
                      <div className="w-[28px] h-[28px] rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-[10px] shrink-0 select-none font-mono">
                        {thr.initials}
                      </div>
                    )}
                    <span className="text-[13px] font-bold text-fg-1 leading-none">
                      {demoRole === 'CR' ? thr.asker : `Question by ${thr.asker}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${tagBgClass} leading-none`}>
                      {thr.tag}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-fg-3 leading-none">
                      {thr.timestamp}
                    </span>
                  </div>
                </div>

                <p className="text-[13px] font-semibold text-ink-900 leading-normal mt-3">
                  {thr.question}
                </p>

                {thr.replied ? (
                  <div className="mt-3.5 bg-coral-50 border border-coral-100 rounded-[10px] p-3 flex flex-col text-left font-sans">
                    <div className="flex items-center justify-between select-none font-sans leading-none">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-[9px] shrink-0 font-sans">
                          SR
                        </div>
                        <span className="text-[11px] font-bold text-coral leading-none">
                          CR Sadia replied
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-fg-3 leading-none">
                        {thr.replyTimestamp}
                      </span>
                    </div>
                    <p className="text-[12.5px] font-medium text-fg-1 leading-normal mt-1.5 pl-8">
                      {thr.replyText}
                    </p>
                  </div>
                ) : (
                  demoRole === 'Student' ? (
                    <div className="mt-3 select-none leading-none pt-1">
                      <p className="italic text-[12px] font-semibold text-fg-3 leading-none">
                        Waiting for CR Sadia to reply…
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 bg-[#FAFAF9] border border-[#ECEAE5] rounded-[10px] p-2.5 flex flex-col gap-2 text-left font-sans">
                      <input
                        type="text"
                        value={inlineReplyText[thr.id] || ''}
                        onChange={(e) => setInlineReplyText(prev => ({ ...prev, [thr.id]: e.target.value }))}
                        placeholder="Type reply to student..."
                        className="w-full bg-white border border-ink-200 rounded-[8px] py-2 px-3 text-[12.5px] font-medium text-fg-1 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = inlineReplyText[thr.id]?.trim();
                            if (!val) return;
                            setThreads(prev => prev.map(t => t.id === thr.id ? {
                              ...t,
                              replied: true,
                              replyText: val,
                              replyTimestamp: 'just now'
                            } : t));
                            setInlineReplyText(prev => ({ ...prev, [thr.id]: '' }));
                            handleTriggerToast(`Reply sent to ${thr.asker.split(' ')[0]}`);
                          }
                        }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const val = inlineReplyText[thr.id]?.trim();
                          if (!val) {
                            handleTriggerToast('Type your reply first');
                            return;
                          }
                          setThreads(prev => prev.map(t => t.id === thr.id ? {
                            ...t,
                            replied: true,
                            replyText: val,
                            replyTimestamp: 'just now'
                          } : t));
                          setInlineReplyText(prev => ({ ...prev, [thr.id]: '' }));
                          handleTriggerToast(`Reply sent to ${thr.asker.split(' ')[0]}`);
                        }}
                        className="py-1.5 px-3 bg-coral hover:bg-coral-600 font-bold text-[11px] text-white rounded-full transition-all cursor-pointer text-center"
                      >
                        Send reply
                      </motion.button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Transport selection overlay states for Student Shell profile and unset transport cards
  const [isTransportDrawerOpen, setIsTransportDrawerOpen] = useState(false);
  const [transportModeState, setTransportModeState] = useState<'bus' | 'walk-in' | 'unset'>('unset');
  const [selectedRouteIdState, setSelectedRouteIdState] = useState<string>('');
  const [drawerSearchQuery, setDrawerSearchQuery] = useState<string>('');

  const mockRoutes = [
    { id: 'route-7', name: 'Route 7', area: 'Dhanmondi', stops: '8 stops' },
    { id: 'route-9', name: 'Route 9', area: 'Mohammadpur', stops: '6 stops' },
    { id: 'route-12', name: 'Route 12', area: 'Mirpur', stops: '9 stops' },
    { id: 'route-15', name: 'Route 15', area: 'Uttara', stops: '11 stops' },
    { id: 'route-18', name: 'Route 18', area: 'Bashundhara', stops: '5 stops' },
    { id: 'route-22', name: 'Route 22', area: 'Old Dhaka', stops: '7 stops' },
  ];

  // Helper to resolve transport model
  const rawDept = currentUser.department || '';
  const rawSectionCode = currentUser.section ? currentUser.section.split('-')[1] || '' : '';
  const rawBatch = currentUser.batch;
  
  const isSweM46ForTransport = rawDept === 'SWE' && rawSectionCode === 'M' && rawBatch === 46;

  const userTransport = (currentUser.transport || (isSweM46ForTransport 
    ? { mode: 'bus', busRouteId: 'route-7' } 
    : { mode: 'unset' })) as UserTransport;

  const getRouteDetails = (routeId: string) => {
    switch (routeId) {
      case 'route-9': return { name: 'Route 9', area: 'Mohammadpur', time: '8:00 am', stop: 'Sec-2', plate: 'MP-44' };
      case 'route-12': return { name: 'Route 12', area: 'Mirpur', time: '7:30 am', stop: 'Sec-10', plate: 'MP-12' };
      case 'route-15': return { name: 'Route 15', area: 'Uttara', time: '7:15 am', stop: 'House-2', plate: 'UT-99' };
      case 'route-18': return { name: 'Route 18', area: 'Bashundhara', time: '8:15 am', stop: 'Gate 1', plate: 'BD-77' };
      case 'route-22': return { name: 'Route 22', area: 'Old Dhaka', time: '7:50 am', stop: 'Sadarghat', plate: 'OD-11' };
      default: return { name: 'Route 7', area: 'Dhanmondi', time: '7:45 am', stop: 'Gate 2', plate: 'DH-23' };
    }
  };

  const renderTransportCard = () => {
    if (userTransport.mode === 'walk-in') {
      return null;
    }

    if (userTransport.mode === 'bus') {
      const details = getRouteDetails(userTransport.busRouteId || 'route-7');
      return (
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('Bus')}
          className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-11 h-11 rounded-[10px] bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center shrink-0">
            <Bus size={22} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0 text-left font-sans">
            <h4 className="text-[15px] font-semibold text-ink-900 leading-snug truncate">
              {details.name} &middot; {details.area}
            </h4>
            <p className="font-mono text-[12px] font-medium text-ink-500 mt-1.5 leading-none">
              Pickup {details.time} &middot; {details.stop} &middot; {details.plate}
            </p>
          </div>
          <div 
            className="w-11 h-11 flex items-center justify-center bg-transparent rounded-full shrink-0"
          >
            <ChevronRight size={18} className="text-ink-400" strokeWidth={1.75} />
          </div>
        </motion.div>
      );
    }

    // mode === 'unset'
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center gap-3 select-none"
      >
        <div className="w-11 h-11 rounded-[10px] bg-ink-100 flex items-center justify-center text-ink-400 shrink-0">
          <Bus size={22} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0 text-left font-sans">
          <h4 className="text-[15px] font-semibold text-ink-900 leading-snug">
            Set up your transport
          </h4>
          <p className="text-[12px] font-medium text-ink-500 mt-1">
            Tell us how you get to campus
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTransportModeState('unset');
            setSelectedRouteIdState('');
            setIsTransportDrawerOpen(true);
          }}
          className="py-1.5 px-3 bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-semibold text-[13px] rounded-full transition-all shrink-0 cursor-pointer"
        >
          Set up
        </button>
      </motion.div>
    );
  };

  // Gate check normalization values
  const getDeptCode = (u: any): string => {
    if (!u) return '';
    if (typeof u.department === 'object' && u.department !== null) {
      return (u.department.code || '').trim().toUpperCase();
    }
    return (u.department || '').trim().toUpperCase();
  };

  const getSectionCode = (u: any): string => {
    if (!u) return '';
    if (typeof u.section === 'object' && u.section !== null) {
      return (u.section.code || '').trim().toUpperCase();
    }
    const secStr = (u.section || '').trim().toUpperCase();
    if (secStr.includes('-')) {
      const parts = secStr.split('-');
      return (parts[parts.length - 1] || '').trim().toUpperCase();
    }
    return secStr;
  };

  const getBatchVal = (u: any): number => {
    if (!u || u.batch === undefined || u.batch === null) return NaN;
    const b = parseInt(u.batch, 10);
    return b;
  };

  const deptCode = getDeptCode(currentUser);
  const sectionCode = getSectionCode(currentUser);
  const batchVal = getBatchVal(currentUser);
  const isSweM46 = deptCode === 'SWE' && sectionCode === 'M' && batchVal === 46;

  // Handle Note Download animation & state increment
  const triggerDownload = (noteId: string) => {
    if (downloadingId) return;
    setDownloadingId(noteId);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setSuccessNoteId(noteId);
            setTimeout(() => setSuccessNoteId(null), 2500);
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle) return;
    onAddNote({
      id: 'student-note-' + Date.now(),
      title: noteTitle.endsWith('.pdf') || noteTitle.endsWith('.zip') ? noteTitle : `${noteTitle}.pdf`,
      course: noteCourse,
      uploadedBy: currentUser.name,
      timestamp: new Date().toISOString(),
      downloadCount: 0,
      fileSize: noteSize
    });
    setNoteTitle('');
    setIsAddingNote(false);
  };

  const filteredBuses = busRoutes.filter(b => 
    b.name.toLowerCase().includes(busSearchQuery.toLowerCase()) || 
    b.route.toLowerCase().includes(busSearchQuery.toLowerCase())
  );

  const initials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TR';

  // Specific color rendering functions for deadlines and broadcasts
  const renderAuthorNode = (author: string, role: string) => {
    if (role === 'Faculty') {
      return <span className="font-sans font-extrabold text-[#7A4A00]">{author}</span>;
    } else if (role === 'CR') {
      return <span className="font-sans font-extrabold text-coral">{author}</span>;
    } else {
      return <span className="font-sans font-extrabold text-ink-900">{author}</span>;
    }
  };

  const renderBroadcastBadge = (role: string) => {
    return (
      <span className="inline-block bg-ink-900 text-white font-mono text-[10px] font-bold tracking-[0.05em] uppercase px-2 py-0.5 rounded-[6.5px]">
        {role}
      </span>
    );
  };

  const renderAcademicRow = (item: any, idx: number) => {
    let pillClass = '';
    switch (item.pillVariant) {
      case 'DANGER':
        pillClass = 'bg-[#FCE8E9] text-[#E5484D] font-sans';
        break;
      case 'WARN':
        pillClass = 'bg-[#FFF4DB] text-[#8A5A00] font-sans';
        break;
      case 'NEUTRAL':
        pillClass = 'bg-ink-100 text-[#4D4B45] font-sans';
        break;
      case 'INFO':
        pillClass = 'bg-[#E5EFFE] text-[#1B4B9E] font-mono font-semibold';
        break;
      case 'TBA':
        pillClass = 'bg-ink-100 text-[#A8A59C] font-mono font-semibold';
        break;
      default:
        pillClass = 'bg-ink-100 text-[#4D4B45] font-sans';
    }

    return (
      <motion.div
        key={`${item.code}-${idx}`}
        whileTap={{ scale: 0.99, opacity: 0.92 }}
        transition={{ duration: 0.12 }}
        onClick={() => handleTriggerToast(`${item.code} · ${item.name}`)}
        className="bg-white border border-subtle shadow-1 rounded-[14px] py-3.5 px-4 flex items-center gap-[14px] cursor-pointer"
      >
        <div className="w-14 shrink-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[17px] font-extrabold text-fg-1 tabular-numbers leading-none block">
            {item.date.day}
          </span>
          <span className="font-sans text-[11px] font-medium text-fg-3 uppercase tracking-[0.06em] mt-1 block">
            {item.date.month}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-mono text-[13px] font-bold text-fg-1 block leading-none">
            {item.code}
          </span>
          <h4 className="text-[15px] font-bold text-fg-1 tracking-tight leading-snug mt-1.5 truncate">
            {item.name}
          </h4>
          <p className="text-[12px] font-medium text-[#75726A] mt-1 truncate">
            {item.detail}
          </p>
        </div>

        <div className={`py-1 px-2.5 rounded-pill text-[12px] font-extrabold text-center shrink-0 tracking-wide select-none ${pillClass}`}>
          {item.proximity}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0EFEA] flex flex-col justify-start items-center p-0 md:py-8 font-sans selection:bg-coral-100 selection:text-coral-600 antialiased text-fg-1">
      {/* 390px Mobile view boundaries */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[844px] md:max-h-[844px] bg-canvas shadow-2xl md:rounded-[36px] border border-subtle relative flex flex-col overflow-hidden">
        
        {/* Absolute TOP Toast Alerts */}
        <AnimatePresence mode="wait">
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -12, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -12, x: '-50%' }}
              transition={{ duration: 0.18 }}
              className={`absolute top-[104px] left-1/2 z-50 bg-ink-900 text-white py-3 px-[18px] rounded-[12px] shadow-[0_12px_32px_rgba(14,13,11,0.28)] font-sans text-xs font-semibold select-none flex items-center justify-center text-center whitespace-normal ${
                activeToast.includes('Undo') ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{ maxWidth: '345px', width: '310px' }}
            >
              {activeToast.includes('Undo') ? (
                <div className="flex items-center justify-between w-full font-sans">
                  <span>{activeToast.split('·')[0].trim()}</span>
                  <span className="font-mono text-fg-3 px-1">·</span>
                  <button
                    onClick={() => {
                      handleUndoDraft();
                    }}
                    className="text-coral hover:text-coral-600 font-bold uppercase tracking-wider ml-1 cursor-pointer transition-colors"
                  >
                    Undo
                  </button>
                </div>
              ) : (
                activeToast
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Chrome Header switcher */}
        {currentView !== 'Main' ? (
          <header className="sticky top-0 z-40 h-[88px] shrink-0 bg-white border-b border-subtle flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentView('Main');
                }}
                className="w-11 h-11 rounded-[10px] bg-transparent hover:bg-ink-100 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Back to home"
              >
                <ChevronLeft size={22} className="text-fg-1" strokeWidth={1.75} />
              </motion.button>
              <div className="text-left font-sans">
                <h2 className="text-[20px] font-bold text-fg-1 tracking-tight leading-none">
                  {currentView === 'AcademicHub' && 'Academic Hub'}
                  {currentView === 'Assignments' && 'Assignments'}
                  {currentView === 'Faculty' && 'Faculty directory'}
                  {currentView === 'Polls' && 'Active polls'}
                  {currentView === 'Events' && 'Events'}
                  {currentView === 'AskCR' && 'Ask CR'}
                </h2>
                <p className="font-mono text-[12px] font-medium text-fg-3 mt-1.5 leading-none">
                  {currentView === 'AcademicHub' && `${deptCode}-${sectionCode} · Batch ${batchVal || '?'}`}
                  {currentView === 'Assignments' && 'SWE-M · 5 courses · Summer 2026'}
                  {currentView === 'Faculty' && 'Software Engineering · 12 faculty'}
                  {currentView === 'Polls' && 'SWE-M · 42 voters'}
                  {currentView === 'Events' && 'SWE-M · Summer 2026'}
                  {currentView === 'AskCR' && (
                    demoRole === 'Student' 
                      ? 'SWE-M · CR Sadia replies' 
                      : `SWE-M · ${threads.filter(t => !t.replied).length} awaiting reply`
                  )}
                </p>
              </div>
            </div>

            {/* Header Right Action buttons based on active screen and mock role */}
            <div className="flex items-center gap-1.5 shrink-0">
              {currentView === 'AcademicHub' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTriggerToast('Notifications')}
                  className="w-11 h-11 rounded-[10px] bg-transparent hover:bg-ink-100 flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={22} className="text-fg-1" strokeWidth={1.75} />
                </motion.button>
              )}

              {currentView === 'Assignments' && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={() => handleTriggerToast('Filters coming')}
                    className="w-[36px] h-[36px] rounded-full bg-transparent flex items-center justify-center cursor-pointer transition-all shrink-0 text-ink-700 outline-none"
                    aria-label="Filter"
                  >
                    <SlidersHorizontal size={18} strokeWidth={1.75} />
                  </motion.button>
                  {(demoRole === 'CR' || demoRole === 'Faculty') && isSweM46 && (
                    <motion.button
                      whileTap={{ scale: 0.97, opacity: 0.85 }}
                      transition={{ duration: 0.12 }}
                      onClick={() => {
                        setSelectedCourse(null);
                        setNewAsgDateRaw('');
                        setNewAsgDateString('');
                        setNewAsgType('Assignment');
                        setNewAsgTitle('');
                        setNewAsgDesc('');
                        setIsPostAssignmentOpen(true);
                      }}
                      style={{
                        backgroundColor: '#FF5A36',
                        boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)',
                        paddingTop: '14px',
                        paddingBottom: '14px',
                        paddingLeft: '8px',
                        paddingRight: '8px'
                      }}
                      className="text-white font-semibold text-[13px] rounded-full flex items-center gap-[4px] leading-none select-none shrink-0 cursor-pointer outline-none"
                    >
                      <Plus size={14} className="text-white shrink-0" strokeWidth={2.5} />
                      <span>Post assignment</span>
                    </motion.button>
                  )}
                </>
              )}

              {currentView === 'Faculty' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTriggerToast('Faculty list is sorted A-Z')}
                  className="w-11 h-11 rounded-[10px] bg-transparent hover:bg-ink-100 flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Sort"
                >
                  <ArrowUpDown size={20} className="text-fg-1" strokeWidth={1.75} />
                </motion.button>
              )}

              {currentView === 'Polls' && (demoRole === 'CR') && isSweM46 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNewPollQuestion('');
                    setNewPollOptions(['', '']);
                    setIsCreatePollOpen(true);
                  }}
                  className="h-10 px-3 bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-bold text-[13px] rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm leading-none"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Create
                </motion.button>
              )}

              {currentView === 'Events' && (demoRole === 'CR') && isSweM46 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNewEventTitle('');
                    setNewEventLocation('');
                    setNewEventDesc('');
                    setIsCreateEventOpen(true);
                  }}
                  className="h-10 px-3 bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-bold text-[13px] rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm leading-none"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Create
                </motion.button>
              )}

              {currentView === 'AskCR' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTriggerToast('Opened inbox')}
                  className="w-11 h-11 rounded-[10px] bg-transparent hover:bg-ink-100 flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Inbox"
                >
                  <Inbox size={22} className="text-fg-1" strokeWidth={1.75} />
                </motion.button>
              )}
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-40 h-[88px] shrink-0 bg-white border-b border-subtle flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-coral shrink-0" style={{ boxShadow: '0 0 0 4px rgba(255,90,54,0.16)' }} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold tracking-tight text-fg-1 leading-none uppercase font-sans">
                  {isSweM46 ? 'SWE-M' : `${deptCode}-${sectionCode}`}
                </h2>
                <p className="text-[12px] font-mono text-fg-3 font-medium leading-none mt-1.5">
                  Student &middot; {currentUser.semester || 'Spring 2026'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentView('Main');
                setActiveTab('Me');
              }}
              className="flex items-center gap-3 cursor-pointer shrink-0 border border-transparent outline-none focus:outline-none"
              title="View student profiles"
            >
              <div className="text-right hidden xxs:block">
                <span className="text-[9px] uppercase tracking-wider text-fg-3 font-mono font-bold block leading-none">ACADEMIC SESSION</span>
                <span className="text-[11px] font-extrabold text-coral bg-coral-50 border border-coral-100/60 px-2 py-0.5 rounded-pill uppercase tracking-tight block mt-1 leading-none">
                  Spring 2026
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-sm shrink-0 shadow-1 font-sans">
                {initials}
              </div>
            </button>
          </header>
        )}

        {/* Scroll content canvas area */}
        <div className="flex-1 overflow-y-auto bg-canvas">
          <div className="p-5 pt-5 pb-24">
            <AnimatePresence mode="wait">
              {currentView !== 'Main' ? (
                <motion.div
                  key={`panel-${currentView}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  {/* Academic Hub view */}
                  {currentView === 'AcademicHub' && (
                    !isSweM46 ? (
                      renderDepartmentPendingState('Academic Hub', <GraduationCap strokeWidth={1.75} size={22} />)
                    ) : (
                      <>
                        {/* STATS */}
                        <div className="bg-coral-50 border border-coral-100 rounded-[14px] py-4 px-5 flex items-center justify-between select-none">
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[24px] font-extrabold tracking-tight text-fg-1 leading-none font-mono tabular-numbers">
                              3 quizzes
                            </span>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.05em] text-fg-3 mt-1.5 text-left leading-none">
                              this month
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col justify-center border-l border-coral-100/50 px-3">
                            <span className="text-[24px] font-extrabold tracking-tight text-fg-1 leading-none font-mono tabular-numbers text-center block">
                              4 mid-terms
                            </span>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.05em] text-fg-3 mt-1.5 text-center block leading-none">
                              this semester
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col justify-center border-l border-coral-100/50 pl-3">
                            <span className="text-[24px] font-extrabold tracking-tight text-fg-1 leading-none font-mono tabular-numbers text-right block">
                              5 finals
                            </span>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.05em] text-fg-3 mt-1.5 text-right block leading-none">
                              upcoming
                            </span>
                          </div>
                        </div>

                        {/* TABS */}
                        <div className="bg-ink-100 p-1 rounded-pill flex gap-1 mt-5">
                          {['Quizzes', 'Mid-terms', 'Finals'].map((tab) => {
                            const isActive = activeHubTab === tab;
                            return (
                              <button
                                key={tab}
                                onClick={() => setActiveHubTab(tab as any)}
                                className={`flex-1 text-center py-[9px] px-3.5 rounded-pill text-[13px] font-bold font-sans transition-all duration-120 cursor-pointer ${
                                  isActive
                                    ? 'bg-ink-900 text-white shadow-1'
                                    : 'text-fg-2 hover:text-fg-1 bg-transparent active:opacity-85'
                                }`}
                              >
                                {tab}
                              </button>
                            );
                          })}
                        </div>

                        {/* TAB CONTENT */}
                        <div className="mt-4 flex flex-col gap-2.5">
                          {activeHubTab === 'Quizzes' && quizzes.map((item, idx) => renderAcademicRow(item, idx))}
                          {activeHubTab === 'Mid-terms' && midterms.map((item, idx) => renderAcademicRow(item, idx))}
                          {activeHubTab === 'Finals' && (
                            <>
                              <div className="bg-coral-50 border border-coral-100 rounded-[14px] p-3 flex gap-2.5 items-center">
                                <CalendarDays size={18} className="text-coral shrink-0" strokeWidth={1.75} />
                                <span className="text-[15px] font-bold text-fg-1 font-sans">
                                  Final exam window: 15 Jul – 28 Jul 2026
                                </span>
                              </div>
                              {finals.map((item, idx) => renderAcademicRow(item, idx))}
                            </>
                          )}
                        </div>
                      </>
                    )
                  )}

                  {/* Assignments view */}
                  {currentView === 'Assignments' && (
                    !isSweM46 ? renderDepartmentPendingState('Assignments', <BookOpen strokeWidth={1.75} size={22} />) : renderAssignmentsScreen()
                  )}

                  {/* Faculty view */}
                  {currentView === 'Faculty' && (
                    renderFacultyScreen()
                  )}

                  {/* Polls view */}
                  {currentView === 'Polls' && (
                    !isSweM46 ? renderDepartmentPendingState('Active polls', <SquareCheckBig strokeWidth={1.75} size={22} />) : renderPollsScreen()
                  )}

                  {/* Events view */}
                  {currentView === 'Events' && (
                    !isSweM46 ? renderDepartmentPendingState('Events', <CalendarDays strokeWidth={1.75} size={22} />) : renderEventsScreen()
                  )}

                  {/* Ask CR view */}
                  {currentView === 'AskCR' && (
                    !isSweM46 ? renderDepartmentPendingState('Ask CR', <MessageCircle strokeWidth={1.75} size={22} />) : renderAskCRScreen()
                  )}
                </motion.div>
              ) : (
                <>
                  {activeTab === 'Home' && (
                    <motion.div
                      key="student-home-panel"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-7"
                    >
                      {/* (A) HERO PAIR */}
                      {!isSweM46 ? (
                        <div className="space-y-3">
                          {/* Next up empty state */}
                          <div className="space-y-3">
                            <div className="relative bg-white border border-subtle shadow-1 rounded-[14px] p-4 pl-[22px] overflow-hidden flex items-center justify-between">
                              <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-coral" />
                              <div className="space-y-1">
                                <h2 className="text-[15px] font-semibold text-fg-1 leading-snug tracking-tight font-sans">
                                  Weekly routine planner
                                </h2>
                                <p className="text-[12px] font-medium text-fg-3 leading-none font-sans flex items-center gap-1 flex-wrap">
                                  <span className="font-mono font-semibold text-fg-1">{deptCode}-{sectionCode}</span>
                                  <span>&middot;</span>
                                  <span>Batch</span>
                                  <span className="font-mono font-semibold text-fg-1">{batchVal || '?'}</span>
                                  <span>&middot;</span>
                                  <span>not published yet</span>
                                </p>
                              </div>
                              <div className="shrink-0 text-[#75726A]">
                                <BookOpen strokeWidth={1.75} size={22} className="text-[#75726A]" />
                              </div>
                            </div>

                            <div className="bg-white border border-subtle shadow-1 rounded-[14px] p-6 text-center flex flex-col items-center justify-center space-y-3.5">
                              <div className="w-11 h-11 rounded-full bg-coral-50 flex items-center justify-center text-coral">
                                <Calendar strokeWidth={1.75} size={22} />
                              </div>
                              <div className="space-y-1.5">
                                <h3 className="text-[15px] font-semibold text-fg-1 leading-snug tracking-tight font-sans">
                                  Routine not ready
                                </h3>
                                <p className="text-[12.5px] font-medium text-fg-3 max-w-[280px] mx-auto leading-relaxed font-sans">
                                  The coordinator has not published the official routine for this academic stream yet.
                                </p>
                              </div>
                              <button
                                onClick={() => handleTriggerToast(`We'll notify you under ${deptCode}-${sectionCode} Batch ${batchVal || '?'}`)}
                                className="w-full py-2.5 px-4 bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition-all duration-120 flex items-center justify-center gap-1.5 cursor-pointer active:scale-97 active:opacity-[0.85] font-sans"
                              >
                                Notify me when ready
                              </button>
                            </div>
                          </div>

                          {/* Today's bus empty state */}
                          {renderTransportCard()}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {/* HERO 1: NEXT UP */}
                          <div className="bg-ink-900 text-white rounded-[14px] p-5 shadow-2 relative overflow-hidden flex flex-col justify-between h-[184px]">
                            {/* Watermark */}
                            <div className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-5 text-white pointer-events-none select-none">
                              <BookOpen size={160} strokeWidth={1.25} />
                            </div>

                            {/* Top row */}
                            <div className="flex justify-between items-center z-10 select-none">
                              <div className="flex items-center gap-1.5">
                                <Timer size={16} className="text-coral shrink-0" strokeWidth={1.75} />
                                <span className="font-mono text-[11px] font-extrabold tracking-[0.1em] text-coral uppercase mt-0.5 leading-none">
                                  NEXT UP
                                </span>
                              </div>
                              <span className="font-mono text-[15px] font-semibold text-white leading-none">
                                in 12 min
                              </span>
                            </div>

                            {/* Title block */}
                            <div className="mt-4 z-10 text-left">
                              <h3 className="text-[20px] font-bold text-white tracking-tight leading-none font-sans">
                                SE131 — Data Structure
                              </h3>
                              <p className="font-mono text-[13px] font-medium text-[#A8A59C] mt-2 leading-none">
                                10:30 &rarr; 11:30 &middot; Room 1504 &middot; Dr. NSL
                              </p>
                            </div>

                            {/* Badges footer */}
                            <div className="flex items-center gap-3 mt-4 z-10 select-none">
                              <span className="bg-[#E5EFFE] text-[#1B4B9E] text-[12px] font-bold py-1 px-2.5 rounded-pill font-sans leading-none">
                                Slot 2
                              </span>
                              <span className="bg-ink-800 text-white text-[12px] font-bold font-mono py-1 px-2.5 rounded-pill leading-none">
                                Room 1504
                              </span>
                            </div>
                          </div>

                          {/* HERO 2: TODAY'S BUS */}
                          {renderTransportCard()}
                        </div>
                      )}

                      {/* (B) QUICK ACCESS GRID */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-0.5 select-none">
                          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-fg-3 uppercase">
                            QUICK ACCESS
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTriggerToast('Customize coming soon')}
                            className="text-coral text-[13px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            Customize
                            <ChevronRight size={14} className="text-coral" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Tile 1 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => setCurrentView('Assignments')}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-[#FFF1D6] text-[#7A4A00] flex items-center justify-center shrink-0">
                              <ClipboardList size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Assignments
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                3 due this week
                              </p>
                            </div>
                            {isSweM46 && (
                              <span className="absolute top-3.5 right-3.5 min-w-[20px] h-5 bg-coral text-white font-mono text-[10px] font-bold px-1.5 flex items-center justify-center rounded-pill">
                                3
                              </span>
                            )}
                          </motion.button>

                          {/* Tile 2 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => {
                              setCurrentView('AcademicHub');
                            }}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-coral-100 text-coral flex items-center justify-center shrink-0">
                              <GraduationCap size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Academic Hub
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                Mid &middot; final &middot; quiz updates
                              </p>
                            </div>
                            {isSweM46 && (
                              <span className="absolute top-3.5 right-3.5 min-w-[20px] h-5 bg-coral text-white font-mono text-[10px] font-bold px-1.5 flex items-center justify-center rounded-pill">
                                3
                              </span>
                            )}
                          </motion.button>

                          {/* Tile 3 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => setCurrentView('Faculty')}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-coral-100 text-coral flex items-center justify-center shrink-0">
                              <Users size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Faculty
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                Contacts & hours
                              </p>
                            </div>
                          </motion.button>

                          {/* Tile 4 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => setCurrentView('Polls')}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-[#FFF1D6] text-[#7A4A00] flex items-center justify-center shrink-0">
                              <SquareCheckBig size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Active polls
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                1 closing today
                              </p>
                            </div>
                            {isSweM46 && (
                              <span className="absolute top-3.5 right-3.5 min-w-[20px] h-5 bg-coral text-white font-mono text-[10px] font-bold px-1.5 flex items-center justify-center rounded-pill">
                                1
                              </span>
                            )}
                          </motion.button>

                          {/* Tile 5 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => setCurrentView('Events')}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-ink-100 text-fg-2 flex items-center justify-center shrink-0">
                              <CalendarClock size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Events
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                Prog contest, Jun 14
                              </p>
                            </div>
                          </motion.button>

                          {/* Tile 6 */}
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            transition={{ duration: 0.12 }}
                            onClick={() => setCurrentView('AskCR')}
                            className="bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 flex flex-col gap-2.5 text-left relative overflow-hidden cursor-pointer outline-none"
                          >
                            <div className="w-9 h-9 rounded-[10px] bg-ink-100 text-fg-2 flex items-center justify-center shrink-0">
                              <MessageCircle size={20} strokeWidth={1.75} />
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-fg-1 leading-none font-sans">
                                Ask CR
                              </h4>
                              <p className="text-[11px] font-medium text-fg-3 mt-1.5 leading-none font-sans">
                                Open a request
                              </p>
                            </div>
                          </motion.button>
                        </div>
                      </div>

                      {/* (C) UPCOMING DEADLINES */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-0.5 select-none">
                          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-fg-3 uppercase">
                            UPCOMING DEADLINES
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTriggerToast('Deadlines')}
                            className="text-coral text-[13px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            View all 4
                            <ChevronRight size={14} className="text-coral" strokeWidth={2.5} />
                          </motion.button>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {deadlines.map((item, idx) => {
                            const isUrgent = item.urgent;
                            return (
                              <motion.div
                                key={`${item.courseCode}-dl-${idx}`}
                                whileTap={{ scale: 0.99, opacity: 0.92 }}
                                transition={{ duration: 0.12 }}
                                onClick={() => handleTriggerToast(`${item.courseCode} · ${item.title}`)}
                                className={`bg-white border border-subtle shadow-1 rounded-[14px] p-3.5 pl-[14px] flex items-center gap-[14px] cursor-pointer relative text-left ${
                                  isUrgent ? 'border-l-[3px] border-l-coral' : ''
                                }`}
                              >
                                {/* Date Tile */}
                                <div className={`w-[52px] shrink-0 text-center rounded-[10px] py-[6px] px-0 flex flex-col items-center justify-center leading-none ${
                                  isUrgent ? 'bg-coral-50' : 'bg-ink-100'
                                }`}>
                                  <span className={`font-mono text-[10px] font-bold tracking-[0.06em] block uppercase leading-none h-3 ${
                                    isUrgent ? 'text-coral' : 'text-fg-3'
                                  }`}>
                                    {item.date.month}
                                  </span>
                                  <span className={`font-mono text-[20px] font-extrabold tracking-tight block leading-none mt-1 h-5 ${
                                    isUrgent ? 'text-coral' : 'text-fg-1'
                                  }`}>
                                    {item.date.day}
                                  </span>
                                </div>

                                {/* Body Middle */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1 flex-wrap leading-none">
                                    <span className="font-mono text-[10px] font-bold text-[#2F2E2A] bg-ink-200 px-1.5 py-0.5 rounded-[5px] leading-none">
                                      {item.courseCode}
                                    </span>
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.05em] text-fg-3 leading-none mt-0.5">
                                      {item.type}
                                    </span>
                                  </div>
                                  <h4 className="text-[15px] font-semibold text-fg-1 truncate font-sans leading-snug">
                                    {item.title}
                                  </h4>
                                  <p className="text-[12px] font-medium text-[#75726A] mt-1.5 truncate leading-none font-sans">
                                    Posted by {renderAuthorNode(item.author, item.role)}
                                    <span className="text-fg-4 mx-1.5 select-none font-sans">&middot;</span>
                                    <span>{item.detail}</span>
                                  </p>
                                </div>

                                {/* Right Column Countdown */}
                                <div className="shrink-0 text-right self-center select-none">
                                  <span className={`font-mono text-[18px] font-extrabold block leading-none ${
                                    isUrgent ? 'text-coral' : 'text-fg-1'
                                  }`}>
                                    {item.daysLeft}
                                  </span>
                                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-fg-3 mt-1 block leading-none">
                                    left
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* (D) RECENT BROADCASTS */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-0.5 select-none font-sans">
                          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-fg-3 uppercase">
                            RECENT BROADCASTS
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTriggerToast('All broadcasts')}
                            className="text-coral text-[13px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            View all
                            <ChevronRight size={14} className="text-coral" strokeWidth={2.5} />
                          </motion.button>
                        </div>

                        <div className="flex flex-col gap-3">
                          {broadcasts.map((item, idx) => {
                            return (
                              <motion.div
                                key={`bc-${idx}`}
                                whileTap={{ scale: 0.99, opacity: 0.92 }}
                                transition={{ duration: 0.12 }}
                                onClick={() => handleTriggerToast(`Broadcast: ${item.title}`)}
                                className="bg-white border border-subtle shadow-1 rounded-[14px] p-[18px] flex flex-col cursor-pointer text-left"
                              >
                                {/* HEAD row */}
                                <div className="flex gap-3 items-start mb-3">
                                  <div className="w-10 h-10 rounded-full bg-coral-100 text-coral flex items-center justify-center font-mono font-bold text-[13px] shrink-0 select-none">
                                    {item.avatar}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap leading-none">
                                      <span className="text-[14px] font-bold text-fg-1 leading-none mr-1">
                                        {item.author}
                                      </span>
                                      {renderBroadcastBadge(item.role)}
                                    </div>
                                    <p className="font-mono text-[12px] font-medium text-fg-3 mt-1.5 leading-none">
                                      {item.date}
                                    </p>
                                  </div>
                                </div>

                                {/* TITLE */}
                                <h4 className="text-[17px] font-extrabold tracking-tight text-fg-1 leading-snug mt-1 font-sans">
                                  {item.title}
                                </h4>

                                {/* BODY */}
                                <p className="text-[14px] font-normal text-[#4D4B45] leading-relaxed mt-2 font-sans">
                                  {item.body}
                                </p>

                                {/* FOOT row */}
                                <div className="flex items-center gap-2 pt-3.5 mt-3.5 border-t border-subtle text-[12px] font-medium text-[#75726A] leading-none select-none">
                                  <span className="text-coral flex items-center gap-1 font-mono text-[11px] font-bold tracking-[0.04em] leading-none">
                                    <CheckCircle size={14} strokeWidth={2.5} /> Verified broadcast
                                  </span>
                                  <span className="text-fg-4 select-none leading-none">&middot;</span>
                                  <span className="font-sans leading-none">Seen by {item.seen} classmates</span>
                                  {item.urgent && (
                                    <span className="ml-[auto] bg-coral-100 text-coral font-mono text-[10px] font-bold tracking-[0.08em] px-[10px] py-[4px] rounded-full leading-none">
                                      URGENT
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}


          {activeTab === 'Routine' && (
            <RoutineScreen currentUser={currentUser} />
          )}

          {activeTab === 'Bus' && (() => {
            const stLeftMs = Math.max(0, studentDeadlineMs - studentCurrentMs);
            const stTotalMs = 32 * 60 * 1000;
            const stRatio = stLeftMs / stTotalMs;
            const stMins = Math.floor(stLeftMs / 60000);
            const stSecs = Math.floor((stLeftMs % 60000) / 1000);
            const stIsUrgent = stMins < 10;
            const stIsDeparted = stLeftMs <= 0;

            return (
              <motion.div
                key="student-bus"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* HERO COUNTDOWN WIND DOWN CARD */}
                <div className="bg-[#1B1A18] text-white rounded-[14px] p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col font-sans select-none">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2F2E2A] text-[#FF5A36] flex items-center justify-center shrink-0">
                        <Bus size={20} className="text-[#FF5A36]" />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-extrabold text-[#A8A59C] tracking-wider uppercase block leading-none">
                          {stIsDeparted ? 'OFF CAMPUS' : 'LAST BUS OFF CAMPUS'}
                        </span>
                        <h3 className="text-[16px] font-bold text-white tracking-tight leading-none mt-1">
                          {stIsDeparted ? 'Route 7 · Departed' : 'Route 7 · 5:30 pm'}
                        </h3>
                        <code className="text-[10px] font-mono text-[#A8A59C] font-semibold block leading-none mt-1">
                          YKSGP &middot; Mirpur-Campus
                        </code>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0">
                      <span 
                        className="text-[34px] font-extrabold font-mono tracking-tighter leading-none tabular-numbers transition-colors duration-300"
                        style={{ color: stIsDeparted ? '#A8A59C' : (stIsUrgent ? '#FF7A5C' : '#FF5A36') }}
                      >
                        {stIsDeparted ? '—' : stMins}
                      </span>
                      <span className="text-[8px] font-black uppercase text-[#A8A59C] tracking-widest mt-1 block leading-none">
                        {stIsDeparted ? 'departed' : 'min to leave'}
                      </span>
                    </div>
                  </div>

                  {/* Depleting progress bar */}
                  <div className="w-full h-1.5 bg-[#2F2E2A] rounded-full overflow-hidden transition-all">
                    <div 
                      className="h-full rounded-full transition-all duration-[1000ms] ease-linear"
                      style={{ 
                        width: `${stIsDeparted ? 0 : stRatio * 100}%`,
                        backgroundColor: stIsUrgent ? '#FF7A5C' : '#FF5A36' 
                      }}
                    />
                  </div>

                  {/* Footer with remaining time details */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#A8A59C] font-semibold mt-1">
                    <span>
                      {stIsDeparted ? 'Last bus has left' : 'Leave campus by 5:30 pm'}
                    </span>
                    {!stIsDeparted && (
                      <span className="text-white">
                        {stMins}m {stSecs.toString().padStart(2, '0')}s left
                      </span>
                    )}
                  </div>
                </div>

                {/* COUNTDOWN SIMULATION CONTROLS */}
                <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-4 shadow-xs space-y-3 font-sans select-none">
                  <span className="text-[9px] font-black uppercase text-[#75726A] tracking-wider block text-left">
                    Countdown simulation (Testing controls)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentDeadlineMs(prev => prev - 5 * 60 * 1000);
                        handleTriggerToast('Timer adjusted by -5 min');
                      }}
                      className="px-2.5 py-1 bg-[#F4F4F2] hover:bg-[#E8E7E3] text-[#1B1A18] text-[10px] font-bold rounded-md active:scale-95 duration-75 transition-all outline-none"
                    >
                      -5 Min
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentDeadlineMs(prev => prev + 5 * 60 * 1000);
                        handleTriggerToast('Timer adjusted by +5 min');
                      }}
                      className="px-2.5 py-1 bg-[#F4F4F2] hover:bg-[#E8E7E3] text-[#1B1A18] text-[10px] font-bold rounded-md active:scale-95 duration-75 transition-all outline-none"
                    >
                      +5 Min
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentDeadlineMs(Date.now() + 8 * 60 * 1000 + 35 * 1000);
                        handleTriggerToast('Timer shifted to 8m 35s remaining (urgent state)');
                      }}
                      className="px-2.5 py-1 bg-[#FFE7DF] hover:bg-[#FFD9CD] text-[#FF5A36] text-[10px] font-bold rounded-md active:scale-95 duration-75 transition-all outline-none"
                    >
                      Urgent (&lt;10m)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentDeadlineMs(Date.now());
                        handleTriggerToast('Timer set to departed');
                      }}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold rounded-md active:scale-95 duration-75 transition-all outline-none"
                    >
                      Depart Now
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentDeadlineMs(Date.now() + 32 * 60 * 1000);
                        handleTriggerToast('Countdown timer reset to 32 mins');
                      }}
                      className="px-3 py-1.5 bg-[#1B1A18] hover:bg-[#2F2E2A] text-white text-[10px] font-bold rounded-full flex items-center gap-1.5 active:scale-95 transition-all outline-none shadow-xs"
                    >
                      <RotateCcw size={10} strokeWidth={2.5} />
                      <span>Reset Target</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-[11px] uppercase font-bold text-fg-3 font-mono tracking-wider">
                    Transport schedules
                  </h3>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                      <Search size={16} strokeWidth={1.75} />
                    </span>
                    <input
                      type="text"
                      value={busSearchQuery}
                      onChange={(e) => setBusSearchQuery(e.target.value)}
                      placeholder="Search Dhanmondi, Mirpur routes..."
                      className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none transition-all shadow-1 focus:border-coral focus:ring-[4px] focus:ring-coral/18"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredBuses.map((bus) => (
                    <div key={bus.id} className="bg-surface border border-subtle rounded-md p-4 space-y-3.5 shadow-1 transition-colors hover:border-coral-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-fg-1 bg-ink-100 px-2 py-0.5 border border-subtle rounded-sm uppercase tracking-wide">
                            {bus.number}
                          </span>
                          <h4 className="font-semibold text-fg-1 text-[15px] mt-2 leading-none">{bus.name}</h4>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded-pill text-[10px] font-mono font-bold tracking-wide uppercase ${
                          bus.status === 'active' ? 'bg-success-bg text-success-strong' :
                          bus.status === 'delayed' ? 'bg-warning-bg text-warning-strong' :
                          'bg-danger-bg text-danger-fg'
                        }`}>
                          {bus.status}
                        </span>
                      </div>

                      <div className="bg-sunken p-3 rounded-md border border-subtle flex items-start gap-2 text-xs leading-relaxed text-fg-2 font-mono">
                        <MapPin size={13} className="text-fg-3 mt-0.5 shrink-0" strokeWidth={1.75} />
                        <span>{bus.route}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-0.5 text-fg-2">
                        <span className="leading-none">Departure shifts:</span>
                        <strong className="text-fg-1 font-mono tracking-wide font-bold">{bus.departureTime}</strong>
                      </div>

                      {bus.statusMessage && (
                        <div className="flex items-center gap-1.5 text-[11px] text-danger-fg bg-danger-bg px-2.5 py-1.5 rounded-md border border-danger-bg/20 font-mono">
                          <AlertTriangle size={12} className="shrink-0" strokeWidth={1.75} />
                          <span>{bus.statusMessage}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          {activeTab === 'Notes' && (
            <motion.div
              key="student-notes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between bg-surface p-4 rounded-md border border-subtle shadow-1">
                <div>
                  <h3 className="font-semibold text-sm text-fg-1 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-coral rounded-pill shrink-0" /> Shared Study Resources
                  </h3>
                  <p className="text-xs text-fg-3 font-sans">Class notes, lecture transcripts, and PDF files</p>
                </div>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="w-8 h-8 bg-coral hover:bg-coral-600 text-white rounded-sm transition duration-120 cursor-pointer flex items-center justify-center shadow-1"
                  title="Share resource pdf"
                >
                  <Plus size={16} strokeWidth={1.75} />
                </button>
              </div>

              {/* Note contribution form */}
              {isAddingNote && (
                <motion.form 
                  onSubmit={handleCreateNoteSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface border border-subtle rounded-md p-4 space-y-3.5 shadow-1"
                >
                  <h4 className="text-[11px] font-bold text-coral font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" /> Contribute Resource Node
                  </h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-fg-3 uppercase tracking-wider font-mono">Document title / file name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Midterm lab exam solution.pdf"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] py-2.5 px-3.5 text-xs text-fg-1 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-fg-3 uppercase tracking-wider font-mono">Course Allocation</label>
                      <select
                        value={noteCourse}
                        onChange={(e) => setNoteCourse(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-[11px] text-fg-1 outline-none font-mono font-bold"
                      >
                        <option>Database Systems (CSE-3101)</option>
                        <option>Software Engineering (CSE-3103)</option>
                        <option>Computer Networks (CSE-3105)</option>
                        <option>Artificial Intelligence (CSE-3107)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-fg-3 uppercase tracking-wider font-mono">Estimated File Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.2 MB"
                        value={noteSize}
                        onChange={(e) => setNoteSize(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 bg-ink-100 hover:bg-ink-200 text-fg-1 rounded-pill transition cursor-pointer text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill transition cursor-pointer shadow-coral-glow"
                    >
                      Publish resource
                    </button>
                  </div>
                </motion.form>
              )}

              {/* PDF/Media files list */}
              <div className="space-y-3">
                {notes.map((note) => {
                  const isDownloading = downloadingId === note.id;
                  const isSuccess = successNoteId === note.id;
                  
                  return (
                    <div key={note.id} className="bg-surface border border-subtle rounded-md p-4 flex items-center justify-between gap-4 hover:border-coral-100 transition-all duration-120 shadow-1">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-semibold text-fg-1 text-[15px] truncate font-sans">{note.title}</h4>
                        <p className="text-[11px] text-coral font-mono font-bold truncate">{note.course}</p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-fg-3 font-mono mt-2 pt-2 border-t border-subtle">
                          <span>By: <span className="text-fg-1 font-semibold">{note.uploadedBy}</span></span>
                          <span>&bull;</span>
                          <span>{note.fileSize}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSuccess ? (
                          <div className="p-2 bg-success-bg text-success-strong rounded-sm flex flex-col items-center justify-center font-bold text-[10px] tracking-wide uppercase border border-success-strong/10">
                            <CheckCircle size={15} />
                            <span className="mt-1 font-sans">Ready</span>
                          </div>
                        ) : isDownloading ? (
                          <div className="p-2 bg-coral-50 text-coral border border-coral-100 rounded-sm relative overflow-hidden flex flex-col items-center justify-center font-mono text-[10px] w-12 h-12">
                            <span className="relative z-10 font-bold">{downloadProgress}%</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerDownload(note.id)}
                            className="p-3 bg-sunken border border-border-default hover:bg-ink-100 text-coral rounded-sm transition cursor-pointer flex flex-col items-center justify-center hover:scale-105"
                          >
                            <Download size={14} strokeWidth={1.75} />
                            <span className="text-[8.5px] mt-1 font-mono font-extrabold uppercase tracking-widest text-fg-3 tabular-numbers">
                              {note.downloadCount + (isSuccess ? 1 : 0)} DL
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'Me' && (
            <motion.div
              key="student-profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {(() => {
                const myClassmate = classmates.find(c => c.name.toLowerCase() === currentUser.name.toLowerCase());
                const myRoll = myClassmate?.roll || 'CSE-023-1103';
                const courses = [
                  { code: 'CSE-3101', name: 'Database Systems' },
                  { code: 'CSE-3103', name: 'Software Engineering' },
                  { code: 'CSE-3105', name: 'Computer Networks' },
                  { code: 'CSE-3107', name: 'Artificial Intelligence' }
                ];
                const myAttendance = attendance[myRoll] || {
                  'CSE-3101': { joined: 12, missed: 1 },
                  'CSE-3103': { joined: 10, missed: 2 },
                  'CSE-3105': { joined: 13, missed: 0 },
                  'CSE-3107': { joined: 9, missed: 2 }
                };

                return (
                  <>
                    {/* Premium Student Card */}
                    <div className="bg-gradient-to-tr from-white to-ink-50 border border-subtle rounded-md p-6 shadow-2 relative overflow-hidden font-sans">
                      <span className="absolute top-4 right-4 bg-coral-50 text-coral border border-coral-100 font-bold font-mono text-[9px] px-2.5 py-1 rounded-pill uppercase tracking-wider">
                        Active Student
                      </span>

                      {/* Chip decoration */}
                      <div className="w-10 h-7 rounded-sm bg-gradient-to-r from-amber to-amber-100 border border-amber/20 mb-6 flex items-center justify-center p-1.5 gap-0.5 shadow-1">
                        <div className="w-0.5 bg-ink-900/30 h-full" />
                        <div className="w-0.5 bg-ink-900/30 h-full" />
                        <div className="w-0.5 bg-ink-900/30 h-full" />
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-coral font-extrabold block">University Student Identity</span>
                          <h3 className="text-xl font-bold text-fg-1 tracking-tight">{currentUser.name}</h3>
                          <p className="text-xs text-fg-3 font-mono">Roll: {myRoll}</p>
                        </div>
                        <div className="w-[60px] h-[60px] rounded-full bg-coral-100 text-coral font-bold flex items-center justify-center text-xl shrink-0">
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      {/* Grid info */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-1 mt-7 border-t border-subtle pt-4 text-xs font-mono text-fg-3 leading-snug">
                        <div>
                          <span className="text-[9px] text-fg-4 block uppercase font-mono">Department Name</span>
                          <span className="text-fg-1 block font-sans font-bold">{currentUser.department || 'CSE'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-fg-4 block uppercase font-mono">Academic Semester</span>
                          <span className="text-fg-1 block font-bold font-sans">{currentUser.semester || 'Spring 2026'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-fg-4 block uppercase font-mono">Specific Section</span>
                          <span className="text-coral block font-bold font-sans">{currentUser.section || 'CSE-A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-fg-4 block uppercase font-mono">Secure Auth Channel</span>
                          <span className="text-coral block font-bold flex items-center gap-1 font-sans">
                            <CheckCircle size={10} /> Active
                          </span>
                        </div>
                      </div>

                      {/* Barcode line */}
                      <div className="mt-6 pt-4 border-t border-subtle flex flex-col items-center">
                        <div className="h-9 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#E0DED8_2px,#E0DED8_4px,#A8A59C_4px,#A8A59C_6px)] opacity-55" />
                        <span className="text-[9px] text-fg-3 font-mono mt-1 tracking-wider uppercase">SEC-FACTORY-ID-{currentUser.id}</span>
                      </div>
                    </div>

                    {/* Transport Settings Card */}
                    <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-4 font-sans space-y-3.5 shadow-1 text-left">
                      <div className="flex items-center justify-between font-sans">
                        <div>
                          <span className="text-[12px] font-bold text-[#FF5A36] uppercase tracking-[0.04em]">
                            Campus Transport Mode
                          </span>
                          <p className="text-[11px] text-ink-500 mt-0.5 leading-normal">
                            Determines transport-related cards on your home dashboard
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase leading-none shrink-0 ${
                          userTransport.mode === 'bus' ? 'bg-[#FFE7DF] text-[#FF5A36]' : 'bg-ink-100 text-ink-650'
                        }`}>
                          {userTransport.mode === 'bus' ? 'Bus Rider' : 'Walk-In'}
                        </span>
                      </div>

                      <div className="bg-[#FFF4F0] rounded-[12px] p-3 border border-coral-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center shrink-0 border border-coral-100 shadow-sm">
                            {userTransport.mode === 'bus' ? (
                              <Bus size={18} className="text-[#FF5A36]" />
                            ) : (
                              <Footprints size={18} className="text-ink-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-bold text-ink-900 block leading-none truncate">
                              {userTransport.mode === 'bus'
                                ? (mockRoutes.find(r => r.id === userTransport.busRouteId)?.name || 'Custom Route')
                                : 'Walk-in / Own arrangement'
                              }
                            </span>
                            <span className="text-[10px] text-ink-500 font-medium font-sans mt-1.5 block leading-none truncate">
                              {userTransport.mode === 'bus'
                                ? `${mockRoutes.find(r => r.id === userTransport.busRouteId)?.area || 'Unknown route'} area`
                                : 'Independent transit'
                              }
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setTransportModeState(userTransport.mode);
                            setSelectedRouteIdState(userTransport.busRouteId || '');
                            setDrawerSearchQuery('');
                            setIsTransportDrawerOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white border border-[#E0DED8] text-ink-900 rounded-full font-bold text-[11px] hover:bg-coral-50 shrink-0 cursor-pointer transition-all active:scale-95"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Class Attendance Tracker Widget */}
                    <div className="bg-surface border border-subtle rounded-md p-4 shadow-1 space-y-4">
                      <div className="flex items-center justify-between pb-2.5 border-b border-subtle">
                        <div>
                          <h3 className="text-xs font-bold font-mono tracking-wider text-coral uppercase">Class Attendance Tracker</h3>
                          <p className="text-[10.5px] text-fg-3 mt-0.5">Real-time status of current semester courses</p>
                        </div>
                        <span className="px-2.5 py-1 bg-coral-50 border border-coral-100 rounded-sm text-xs font-mono font-bold text-coral flex items-center gap-1 tabular-numbers">
                          Avg: {(() => {
                            let totalJoined = 0;
                            let totalMissed = 0;
                            courses.forEach(c => {
                              const s = myAttendance[c.code] || { joined: 0, missed: 0 };
                              totalJoined += s.joined;
                              totalMissed += s.missed;
                            });
                            const totalClasses = totalJoined + totalMissed;
                            return totalClasses === 0 ? '0%' : `${Math.round((totalJoined / totalClasses) * 100)}%`;
                          })()}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {courses.map((course) => {
                          const stats = myAttendance[course.code] || { joined: 0, missed: 0 };
                          const total = stats.joined + stats.missed;
                          const percent = total === 0 ? 0 : Math.round((stats.joined / total) * 100);
                          
                          let statusColor = "bg-danger-fg";
                          let statusBg = "bg-danger-bg text-danger-fg";
                          let statusText = "Shortage";
                          if (percent >= 90) {
                            statusColor = "bg-success-fg";
                            statusBg = "bg-success-bg text-success-strong";
                            statusText = "Excellent";
                          } else if (percent >= 75) {
                            statusColor = "bg-yellow";
                            statusBg = "bg-yellow-101 text-warning-strong";
                            statusText = "Eligible";
                          }

                          return (
                            <div key={course.code} className="space-y-1.5 pb-2 border-b border-dashed border-subtle last:border-b-0 last:pb-0">
                              <div className="flex items-start justify-between text-xs">
                                <div>
                                  <span className="font-semibold text-fg-1 text-xs block leading-none">{course.name}</span>
                                  <span className="text-[10px] text-fg-3 font-mono tracking-tight font-medium">{course.code}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-fg-1 font-mono text-xs tabular-numbers">{percent}%</span>
                                  <span className="text-[9.5px] text-fg-3 block font-mono font-semibold tabular-numbers">Present: {stats.joined} &bull; Absent: {stats.missed}</span>
                                </div>
                              </div>

                              <div className="relative w-full h-2 bg-ink-100 rounded-pill overflow-hidden">
                                <div 
                                  className={`h-full rounded-pill transition-all duration-300 ${statusColor}`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider font-mono ${statusBg}`}>
                                  {statusText}
                                </span>
                                {percent < 75 ? (
                                  <span className="text-[9px] text-danger-fg flex items-center gap-1 font-semibold">
                                    <AlertTriangle size={10} strokeWidth={1.75} /> Shortage (Min. 75% needed)
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-success-strong flex items-center gap-1 font-semibold">
                                    ✓ Clear of Shortage
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Action commands */}
              <div className="space-y-2">
                <button
                  onClick={onChangeContext}
                  className="w-full py-3 border border-border-default hover:border-ink-400 bg-surface text-fg-1 font-semibold rounded-pill hover:bg-ink-50 transition cursor-pointer text-xs flex items-center justify-center gap-2 shadow-1 duration-120 active:scale-97 active:opacity-85"
                >
                  <RefreshCw size={14} className="text-coral" strokeWidth={1.75} />
                  Change Academic Role (Onboarding Loop)
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-3 bg-surface border border-danger-bg hover:bg-danger-bg hover:text-danger-fg text-danger-fg font-semibold rounded-pill transition cursor-pointer text-xs flex items-center justify-center gap-2 duration-120 active:scale-97"
                >
                  <LogOut size={14} strokeWidth={1.75} />
                  Terminate Connection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>

        {/* Persistent Footer Navigation within 390px relative scope */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] md:absolute md:left-0 md:translate-x-0 right-0 z-50 h-[72px] shrink-0 bg-white/92 backdrop-blur-[24px] border-t border-subtle flex items-center justify-around py-1.5 shadow-sm safe-bottom">
          {[
            { icon: <Home size={22} strokeWidth={1.75} />, label: 'Home' as const },
            { icon: <Calendar size={22} strokeWidth={1.75} />, label: 'Routine' as const },
            { icon: <Bus size={22} strokeWidth={1.75} />, label: 'Bus' as const },
            { icon: <FileText size={22} strokeWidth={1.75} />, label: 'Notes' as const },
            { icon: <UserIcon size={22} strokeWidth={1.75} />, label: 'Me' as const }
          ].map((item) => {
            const isTabActive = activeTab === item.label && currentView === 'Main';
            return (
              <button
                key={item.label}
                onClick={() => {
                  setCurrentView('Main');
                  setActiveTab(item.label);
                }}
                className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-sm transition duration-120 cursor-pointer ${
                  isTabActive
                    ? 'text-coral'
                    : 'text-fg-3 hover:text-fg-1 active:opacity-80'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-semibold uppercase tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </footer>

        {/* BOTTOM SHEET — POST A NEW ASSIGNMENT */}
        <AnimatePresence>
          {isPostAssignmentOpen && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden select-none">
              {/* Backdrop Scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                onClick={handleDismissSheet}
                className="absolute inset-0 bg-[#0E0D0B]/55"
              />

              {/* Sheet Content Panel */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative w-full h-[90%] bg-white rounded-t-[28px] shadow-[0_-8px_32px_rgba(14,13,11,0.18)] flex flex-col z-10 overflow-hidden text-left"
              >
                {/* Decorative Grab Handle */}
                <div className="w-10 h-1 bg-ink-300 rounded-full mx-auto mt-2 shrink-0 pointer-events-none" />

                {/* Header Block */}
                <div className="flex items-start justify-between px-5 pt-4 pb-2 shrink-0">
                  <div className="space-y-1">
                    <h2 className="text-[22px] font-bold text-ink-900 tracking-tight leading-none font-sans">
                      Post a new assignment
                    </h2>
                    <div className="font-mono text-[12px] font-medium text-ink-500 mt-1">
                      SWE-M &middot; 42 students will be notified
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDismissSheet}
                    className="w-9 h-9 rounded-[10px] bg-transparent hover:bg-ink-100 flex items-center justify-center text-[#0E0D0B] cursor-pointer transition-all active:scale-95 shrink-0 outline-none"
                  >
                    <X size={22} className="text-[#0E0D0B]" strokeWidth={1.75} />
                  </button>
                </div>

                {/* Content Box (Scrollable area) */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  
                  {/* Posted-By Preview Banner */}
                  <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-[14px] p-3.5 flex items-center gap-2.5 shadow-1 selection:bg-transparent">
                    <UserRound size={18} className="text-[#FF5A36] shrink-0" strokeWidth={1.75} />
                    <div className="text-[14px] font-medium text-ink-700 leading-none font-sans">
                      <span>Posted by </span>
                      <span className="font-bold text-[#FF5A36]">CR {currentUser.name ? currentUser.name.split(' ')[0] : 'Sadia'}</span>
                    </div>
                  </div>

                  {/* Form Fields Stack */}
                  <div className="space-y-4">
                    
                    {/* 1. COURSE */}
                    <div className="space-y-1.5 font-sans" id="asg-field-course">
                      <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                        COURSE
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsCoursePickerOpen(true);
                          setCourseError(false);
                        }}
                        className={`w-full text-left bg-white border ${
                          courseError ? 'border-[#E5484D] ring-2 ring-[#E5484D]/10' : 'border-[#E0DED8] hover:border-ink-400'
                        } rounded-[12px] p-3.5 flex items-center justify-between cursor-pointer transition-all duration-120 shadow-1 outline-none`}
                      >
                        {selectedCourse ? (
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[13px] font-semibold text-ink-900 leading-none shrink-0">{selectedCourse.code}</span>
                            <span className="text-ink-300 font-mono leading-none shrink-0">&middot;</span>
                            <span className="text-[14px] font-medium text-ink-700 truncate leading-none">{selectedCourse.name}</span>
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#A8A59C] font-normal">Pick a course</span>
                        )}
                        <ChevronRight size={18} className="text-ink-500 shrink-0" strokeWidth={1.75} />
                      </button>
                    </div>

                    {/* 2. DUE DATE */}
                    <div className="space-y-1.5 font-sans" id="asg-field-date">
                      <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                        DUE DATE
                      </label>
                      <div className="relative">
                        {/* Visual input layer */}
                        <input
                          type="text"
                          readOnly
                          placeholder="DD/MM/YYYY"
                          value={newAsgDateString}
                          className={`w-full bg-white border ${
                            dateError ? 'border-[#E5484D] ring-2 ring-[#E5484D]/10' : 'border-[#E0DED8] hover:border-ink-400'
                          } rounded-[12px] py-3.5 px-[12px] pr-[40px] text-[14px] font-medium text-ink-900 font-mono tracking-tight pointer-events-none transition-all duration-120`}
                        />
                        {/* Native hidden picker layer which overlays above the visual box on mobile tap */}
                        <input
                          type="date"
                          min="2026-06-10"
                          max="2026-12-31"
                          onChange={(e) => {
                            const val = e.target.value; // format YYYY-MM-DD
                            if (val) {
                              const [y, m, d] = val.split('-');
                              setNewAsgDateString(`${d}/${m}/${y}`);
                              setNewAsgDateRaw(val);
                              setDateError(false);
                            } else {
                              setNewAsgDateString('');
                              setNewAsgDateRaw('');
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500">
                          <Calendar size={18} strokeWidth={1.75} />
                        </div>
                      </div>
                    </div>

                    {/* 3. TYPE */}
                    <div className="space-y-1.5 font-sans">
                      <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                        TYPE
                      </label>
                      <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar select-none">
                        {(['Assignment', 'Lab report', 'Project', 'Quiz', 'Reading'] as const).map((typeItem) => {
                          const isActive = newAsgType === typeItem;
                          return (
                            <motion.button
                              key={typeItem}
                              type="button"
                              whileTap={{ scale: 0.97, opacity: 0.85 }}
                              transition={{ duration: 0.12 }}
                              onClick={() => setNewAsgType(typeItem)}
                              className={`py-2 px-[14px] rounded-full text-[13px] transition-all duration-120 cursor-pointer whitespace-nowrap shrink-0 outline-none ${
                                isActive
                                  ? 'bg-[#0E0D0B] text-white font-semibold'
                                  : 'bg-white border border-[#E0DED8] text-[#0E0D0B] font-medium'
                              }`}
                            >
                              {typeItem}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. TITLE */}
                    <div className="space-y-1.5 font-sans" id="asg-field-title">
                      <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                        TITLE
                      </label>
                      <input
                        type="text"
                        maxLength={80}
                        placeholder="e.g. Final UML class diagram submission"
                        value={newAsgTitle}
                        onChange={(e) => {
                          setNewAsgTitle(e.target.value);
                          if (e.target.value.trim()) setTitleError(false);
                        }}
                        className={`w-full bg-white border ${
                          titleError ? 'border-[#E5484D] ring-2 ring-[#E5484D]/10' : 'border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18'
                        } rounded-[12px] py-3.5 px-[12px] text-[15px] font-medium text-ink-900 transition-all duration-120 outline-none placeholder:text-ink-400/85`}
                      />
                    </div>

                    {/* 5. DESCRIPTION */}
                    <div className="space-y-1.5 font-sans">
                      <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                        DESCRIPTION (OPTIONAL)
                      </label>
                      <div className="relative">
                        <textarea
                          maxLength={280}
                          placeholder="Add instructions, requirements, or attachment notes…"
                          value={newAsgDesc}
                          onChange={(e) => setNewAsgDesc(e.target.value)}
                          className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] py-3.5 px-[12px] pb-8 text-[14px] font-normal text-ink-900 transition-all duration-120 outline-none min-h-[88px] max-h-[160px] placeholder:text-ink-400/85 resize-none font-sans"
                        />
                        
                        {/* Character Soft Counter */}
                        <span className={`absolute bottom-2.5 right-3 font-mono text-[12px] font-semibold ${
                          newAsgDesc.length >= 280
                            ? 'text-[#E5484D]'
                            : newAsgDesc.length >= 240
                            ? 'text-[#8A5A00]'
                            : 'text-ink-400'
                        }`}>
                          {newAsgDesc.length}/280
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sticky Footer Area */}
                <div className="bg-white border-t border-[#ECEAE5] py-3 px-5 flex items-center justify-between z-20 shrink-0 font-sans">
                  <motion.button
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    transition={{ duration: 0.12 }}
                    type="button"
                    onClick={handleDismissSheet}
                    className="border border-[#E0DED8] rounded-full py-2.5 px-4 text-ink-900 text-[13px] font-semibold cursor-pointer select-none active:scale-95 bg-transparent"
                  >
                    Cancel
                  </motion.button>

                  {(() => {
                    const isSendEnabled = selectedCourse !== null && newAsgDateRaw !== '' && newAsgTitle.trim() !== '';
                    return (
                      <motion.button
                        whileTap={isSendEnabled ? { scale: 0.97, opacity: 0.85 } : undefined}
                        transition={{ duration: 0.12 }}
                        type="button"
                        disabled={!isSendEnabled}
                        onClick={handlePostAssignment}
                        style={isSendEnabled ? {
                          backgroundColor: '#FF5A36',
                          boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)'
                        } : {}}
                        className={`rounded-full py-3 px-4.5 text-white text-[14px] font-semibold flex items-center gap-1.5 transition-all outline-none ${
                          isSendEnabled
                            ? 'bg-[#FF5A36] cursor-pointer'
                            : 'bg-[#FF5A36]/40 cursor-not-allowed opacity-[0.4] shadow-none'
                        }`}
                      >
                        <Send size={16} strokeWidth={2.0} />
                        <span>Post to 42 students</span>
                      </motion.button>
                    );
                  })()}
                </div>

                {/* Nested Course Picker Sheet Overlay */}
                <AnimatePresence>
                  {isCoursePickerOpen && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                      className="absolute inset-0 z-50 bg-white rounded-t-[28px] p-5 pb-8 flex flex-col pt-4 h-full"
                    >
                      {/* Grab handle for decorative purpose */}
                      <div className="w-10 h-1 bg-ink-300 rounded-full mx-auto mb-4 shrink-0 pointer-events-none" />

                      <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE5] mb-4 shrink-0 font-sans">
                        <span className="text-[18px] font-bold text-[#0E0D0B] tracking-tight">Pick a course</span>
                        <button
                          type="button"
                          onClick={() => setIsCoursePickerOpen(false)}
                          className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-[#0E0D0B] hover:bg-ink-200 cursor-pointer transition-all active:scale-90 shrink-0"
                        >
                          <X size={18} strokeWidth={2.0} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pb-4 font-sans">
                        {sweCourses.map((courseItem) => {
                          const isSelected = selectedCourse?.code === courseItem.code;
                          return (
                            <motion.button
                              key={courseItem.code}
                              whileTap={{ scale: 0.97, opacity: 0.85 }}
                              transition={{ duration: 0.12 }}
                              type="button"
                              onClick={() => {
                                setSelectedCourse(courseItem);
                                setIsCoursePickerOpen(false);
                                setCourseError(false);
                              }}
                              className={`w-full text-left bg-white border rounded-[14px] p-3.5 flex items-center justify-between cursor-pointer transition-all duration-[120ms] ${
                                isSelected
                                  ? 'border-[#FF5A36] bg-[#FFF4F0]/20 shadow-1'
                                  : 'border-[#ECEAE5] hover:border-ink-300 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[13px] font-bold text-ink-950 bg-ink-50 px-2 py-0.5 rounded-md border border-[#ECEAE5]">{courseItem.code}</span>
                                <span className="text-[14px] font-semibold text-ink-900 leading-snug">{courseItem.name}</span>
                              </div>
                              {isSelected ? (
                                <Check size={18} className="text-[#FF5A36] shrink-0" strokeWidth={2.5} />
                              ) : (
                                <div className="w-[18px] h-[18px] rounded-full border border-ink-300 shrink-0" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Shell - Transport Bottom Sheet Drawer */}
      <AnimatePresence>
        {isTransportDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px]">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsTransportDrawerOpen(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-canvas rounded-t-[24px] border-t border-[#ECEAE5] p-5 pb-8 shadow-2xl flex flex-col max-h-[90vh] z-10 font-sans text-fg-1"
            >
              {/* Drag Handle / Accent indicator */}
              <div className="w-12 h-1.5 bg-[#E6E4DF] rounded-full mx-auto mb-5 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-ink-900">Configure Transport</span>
                <button
                  type="button"
                  onClick={() => setIsTransportDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-fg-3 hover:text-fg-1 cursor-pointer transition-all active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 2 Option Cards */}
              <div className="flex flex-col gap-2.5 mb-4">
                {/* OPTION A */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTransportModeState('bus');
                    setSelectedRouteIdState('');
                  }}
                  className={`p-3.5 rounded-[12px] cursor-pointer transition-all ${
                    transportModeState === 'bus'
                      ? 'border-[2px] border-[#FF5A36] bg-surface'
                      : 'border border-[#ECEAE5] bg-surface hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                      transportModeState === 'bus' ? 'border-[#FF5A36] bg-[#FFE7DF]' : 'border-[#CCCCCC] bg-transparent'
                    }`}>
                      {transportModeState === 'bus' && (
                        <div className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[14px] font-semibold text-ink-900 leading-snug font-sans">
                        I take the bus
                      </h4>
                      <p className="text-[11px] text-ink-500 mt-0.5 leading-none">
                        Show bus updates on my dashboard
                      </p>
                    </div>
                    <Bus size={18} className="text-[#FF5A36]" />
                  </div>
                </motion.div>

                {/* OPTION B */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTransportModeState('walk-in');
                    setSelectedRouteIdState('');
                  }}
                  className={`p-3.5 rounded-[12px] cursor-pointer transition-all ${
                    transportModeState === 'walk-in'
                      ? 'border-[2px] border-[#FF5A36] bg-surface'
                      : 'border border-[#ECEAE5] bg-surface hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                      transportModeState === 'walk-in' ? 'border-[#FF5A36] bg-[#FFE7DF]' : 'border-[#CCCCCC] bg-transparent'
                    }`}>
                      {transportModeState === 'walk-in' && (
                        <div className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[14px] font-semibold text-ink-900 leading-snug font-sans">
                        Walk-in / Own arrangement
                      </h4>
                      <p className="text-[11px] text-ink-500 mt-0.5 leading-none">
                        No bus-related cards on my home screen
                      </p>
                    </div>
                    <Footprints size={18} className="text-ink-500" />
                  </div>
                </motion.div>
              </div>

              {/* Sub-route Selection list (if bus) */}
              {transportModeState === 'bus' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.04em] text-ink-500 mb-2 text-left">
                    Select route
                  </span>

                  {/* Picker search */}
                  <div className="relative mb-3.5 shrink-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-fg-4 pointer-events-none">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      placeholder="Search routes (e.g. Dhanmondi, Mirpur)"
                      className="w-full bg-surface border border-[#E0DED8] rounded-[10px] py-2.5 pl-9 pr-3 text-xs font-semibold text-ink-900 placeholder:text-fg-4 outline-none focus:border-[#FF5A36]"
                    />
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 max-h-[180px]">
                    {mockRoutes
                      .filter(r => 
                        r.name.toLowerCase().includes(drawerSearchQuery.toLowerCase()) || 
                        r.area.toLowerCase().includes(drawerSearchQuery.toLowerCase())
                      )
                      .map((route) => (
                        <div
                          key={route.id}
                          onClick={() => setSelectedRouteIdState(route.id)}
                          className={`flex justify-between items-center border rounded-[10px] p-2.5 cursor-pointer transition-all ${
                            selectedRouteIdState === route.id
                              ? 'border-[#FF5A36] bg-amber-50/5'
                              : 'border-[#ECEAE5] bg-white hover:border-ink-300'
                          }`}
                        >
                          <div className="text-left font-sans">
                            <span className="font-mono text-xs font-bold text-ink-900 block leading-none">
                              {route.name} &bull; {route.area}
                            </span>
                            <span className="text-[10px] text-ink-500 font-medium mt-1 block leading-none">
                              {route.stops}
                            </span>
                          </div>
                          {selectedRouteIdState === route.id && (
                            <div className="w-4 h-4 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shrink-0">
                              <CheckCircle size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Drawer Action CTA */}
              <div className="mt-5 pt-3 border-t border-subtle flex flex-col gap-3 shrink-0">
                <button
                  type="button"
                  disabled={transportModeState === 'unset' || (transportModeState === 'bus' && !selectedRouteIdState)}
                  onClick={() => {
                    onUpdateUser({
                      transport: transportModeState === 'bus' 
                        ? { mode: 'bus', busRouteId: selectedRouteIdState } 
                        : { mode: 'walk-in' }
                    });
                    setIsTransportDrawerOpen(false);
                    handleTriggerToast('Transport details customized');
                  }}
                  className={`w-full py-2.5 rounded-pill font-bold text-sm transition-all ${
                    (transportModeState === 'unset' || (transportModeState === 'bus' && !selectedRouteIdState))
                      ? 'bg-ink-150 text-ink-400 pointer-events-none'
                      : 'bg-coral text-white hover:bg-coral-600 active:scale-98 cursor-pointer'
                  }`}
                >
                  Save Selection
                </button>
                <div className="flex justify-between items-center text-xs text-ink-550 justify-center">
                  <button 
                    onClick={() => handleTriggerToast("Tell your admin — we'll add it")}
                    className="mx-auto text-[11px] font-bold text-ink-400 hover:text-coral transition-all"
                  >
                    My route isn't listed
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
