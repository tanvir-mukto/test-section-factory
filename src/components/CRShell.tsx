import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Plus, Settings2, Users, User as UserIcon, Lock } from 'lucide-react';
import { User, RoutineEntry, Announcement, Classmate } from '../types';

import CRHome from './CRHome';
import CRPost from './CRPost';
import CRSection from './CRSection';
import CRRoster from './CRRoster';
import CRMe from './CRMe';

// Subscreens imports
import CRSubScreenAssignments from './CRSubScreenAssignments';
import CRSubScreenAcademicHub from './CRSubScreenAcademicHub';
import CRSubScreenFaculty, { FacultyMember } from './CRSubScreenFaculty';
import CRSubScreenPolls from './CRSubScreenPolls';
import CRSubScreenEvents from './CRSubScreenEvents';
import CRSubScreenAskCR from './CRSubScreenAskCR';
import RoutineScreen from './RoutineScreen';
import CRSubScreenTransport, { QATransport } from './CRSubScreenTransport';

// Register transport: QATransport in the CR_QA_SCREENS dispatcher
export const CR_QA_SCREENS = {
  Transport: CRSubScreenTransport,
  Routine: RoutineScreen,
};

import CRSearchOverlay from './CRSearchOverlay';
import CRNotificationsOverlay, { NotificationItem } from './CRNotificationsOverlay';

export interface PostItem {
  id: string;
  tag: string;
  title: string;
  body: string;
  timestamp: string;
  timeLabel: string;
  seenCount: number;
  totalCount: number;
  likes: number;
  isPinned?: boolean;
}

interface CRShellProps {
  currentUser: User;
  routine: RoutineEntry[];
  announcements: Announcement[];
  classmates: Classmate[];
  pendingApps: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    semester: string;
    section: string;
  }[];
  onAddAnnouncement: (newAnn: Announcement) => void;
  onUpdateRoutine: (updatedRoutine: RoutineEntry[]) => void;
  onAddClassmate: (newClassmate: Classmate) => void;
  onLogout: () => void;
  onChangeContext: () => void;
  onApprovePending: (id: string, name: string, role: string) => void;
  onRejectPending: (id: string) => void;
}

export default function CRShell({
  currentUser,
  routine,
  announcements,
  classmates,
  pendingApps,
  onAddAnnouncement,
  onUpdateRoutine,
  onAddClassmate,
  onLogout,
  onChangeContext,
  onApprovePending,
  onRejectPending
}: CRShellProps) {
  // Gate Normalisation & Checks
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
  const isCR = currentUser?.role?.toUpperCase() === 'CR';
  const isSweM46CR = isCR && deptCode === 'SWE' && sectionCode === 'M' && batchVal === 46;

  // Active Bottom Tab State
  const [activeTab, setActiveTab] = useState<'Home' | 'Post' | 'Section' | 'Roster' | 'Me'>('Home');

  // Search and Notifications overlay states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      kind: 'reach',
      unread: true,
      title: 'Your post hit 41 of 42 students',
      sub: "'MAT102 cancelled today' · 98% reach",
      when: '5 min ago'
    },
    {
      id: 'notif-2',
      kind: 'reaction',
      unread: true,
      title: 'Tahmid and 23 others reacted',
      sub: 'MAT102 cancelled today — Slot 3',
      when: '12 min ago'
    },
    {
      id: 'notif-3',
      kind: 'ask',
      unread: true,
      title: 'New question in Ask CR',
      sub: "Rakib: 'Which room is the SE131 mid-term in?'",
      when: '1 hr ago'
    },
    {
      id: 'notif-4',
      kind: 'poll',
      unread: false,
      title: 'Poll closing today',
      sub: 'Makeup class — 37 of 42 have voted',
      when: '3 hr ago'
    },
    {
      id: 'notif-5',
      kind: 'faculty',
      unread: false,
      title: 'Dr. NSL posted in SE131',
      sub: 'Quiz tomorrow · Chapter 3 + 4',
      when: '5 hr ago'
    }
  ]);

  // Active Subscreen Navigation
  const [currentSubScreen, setCurrentSubScreen] = useState<'Assignments' | 'AcademicHub' | 'Faculty' | 'Polls' | 'Events' | 'AskCR' | 'Routine' | 'Transport' | null>(null);

  // Dynamic States for Sub-screens
  // 1. Assignments
  const [assignments, setAssignments] = useState<any[]>([
    {
      id: 'asg-1',
      courseCode: 'SE131',
      courseName: 'Data Structure',
      postedBy: 'Dr. NSL',
      postedByRole: 'faculty',
      title: 'Lab 4 report submission',
      dueDate: '2026-06-13',
      dueDayString: 'Sat 13 Jun',
      dueTime: '11:59 pm',
      submittedCount: 28,
      totalCount: 42,
      description: 'Please submit your comprehensive Lab 4 document matching the guidelines.',
      status: 'Active'
    },
    {
      id: 'asg-2',
      courseCode: 'SE213',
      courseName: 'Digital Electronics & Logic',
      postedBy: 'Dr. KRY',
      postedByRole: 'faculty',
      title: 'UML class diagram',
      dueDate: '2026-06-14',
      dueDayString: 'Sun 14 Jun',
      dueTime: '11:59 pm',
      submittedCount: 12,
      totalCount: 42,
      description: 'Complete logical and schematic diagrams for the ALU simulation.',
      status: 'Active'
    },
    {
      id: 'asg-3',
      courseCode: 'SE123',
      courseName: 'Discrete Mathematics',
      postedBy: 'Sadia Rahman (CR)',
      postedByRole: 'cr',
      title: 'Set theory problem set — Chapter 5',
      dueDate: '2026-06-17',
      dueDayString: 'Wed 17 Jun',
      dueTime: '11:59 pm',
      submittedCount: 5,
      totalCount: 42,
      description: 'Submit all solutions from Section 5.1 to 5.4 in PDF format.',
      status: 'Active'
    },
    {
      id: 'asg-4',
      courseCode: 'SE131',
      courseName: 'Data Structure',
      postedBy: 'Dr. NSL',
      postedByRole: 'faculty',
      title: 'Programming exercise 2',
      dueDate: '2026-06-05',
      dueDayString: 'Fri 5 Jun',
      dueTime: '11:59 pm',
      submittedCount: 42,
      totalCount: 42,
      description: 'Implementation of AVL Trees balancing and rotations.',
      status: 'Past'
    },
    {
      id: 'asg-5',
      courseCode: 'MAT102',
      courseName: 'Mathematics II',
      postedBy: 'Dr. DK',
      postedByRole: 'faculty',
      title: 'Vector spaces homework',
      dueDate: '2026-06-03',
      dueDayString: 'Wed 3 Jun',
      dueTime: '11:59 pm',
      submittedCount: 40,
      totalCount: 42,
      description: 'Complete questions 1 to 15 on basis vectors and sub-spaces.',
      status: 'Past'
    }
  ]);

  // 2. Polls
  const [polls, setPolls] = useState<any[]>([
    {
      id: 'poll-1',
      status: 'Closing today',
      closeMeta: 'Closes 6 pm today',
      question: 'Makeup class — Saturday or Sunday?',
      author: 'CR Sadia',
      options: [
        { id: 'p1-opt1', label: 'Saturday 13 Jun', baseVotes: 27, addedStudentVote: true, addedCRVote: false },
        { id: 'p1-opt2', label: 'Sunday 14 Jun', baseVotes: 13, addedStudentVote: false, addedCRVote: false }
      ]
    },
    {
      id: 'poll-2',
      status: 'Active',
      closeMeta: 'Closes 13 Jun 6 pm',
      question: 'Semester study tour destination?',
      author: 'CR Sadia',
      options: [
        { id: 'p2-opt1', label: 'Sajek', baseVotes: 12, addedStudentVote: false, addedCRVote: false },
        { id: 'p2-opt2', label: 'Cox\'s Bazar', baseVotes: 18, addedStudentVote: false, addedCRVote: false },
        { id: 'p2-opt3', label: 'Sundarbans', baseVotes: 7, addedStudentVote: false, addedCRVote: false },
        { id: 'p2-opt4', label: 'Sylhet', baseVotes: 3, addedStudentVote: false, addedCRVote: false }
      ]
    },
    {
      id: 'poll-3',
      status: 'Closed',
      closeMeta: 'Closed 9 Jun',
      question: 'Study circle weekly slot?',
      author: 'CR Sadia',
      options: [
        { id: 'p3-opt1', label: 'Friday 8 pm', baseVotes: 22, addedStudentVote: false, addedCRVote: false },
        { id: 'p3-opt2', label: 'Saturday 6 pm', baseVotes: 12, addedStudentVote: false, addedCRVote: false },
        { id: 'p3-opt3', label: 'Sunday 5 pm', baseVotes: 6, addedStudentVote: false, addedCRVote: false }
      ]
    }
  ]);

  // 3. Events
  const [events, setEvents] = useState<any[]>([
    {
      id: 'e1',
      tabType: 'Upcoming',
      bannerColor: 'ink',
      day: '14',
      month: 'JUN',
      title: 'Inter-university programming contest',
      fullDate: 'Sat 14 Jun',
      timeLabel: '9:00 am',
      location: 'Daffodil Smart City Campus',
      description: 'Open to all 4th-year SWE students. Three-person teams. Registration via the CR.',
      organizer: 'CR Sadia',
      goingCount: 18,
      initialsList: ['TR', 'NA', 'RH'],
      userRSVP: false
    },
    {
      id: 'e2',
      tabType: 'Upcoming',
      bannerColor: 'coral',
      day: '19',
      month: 'JUN',
      title: 'Industry talk — Ride-hail backend at Pathao',
      fullDate: 'Thu 19 Jun',
      timeLabel: '4:00 pm',
      location: 'Auditorium 14B',
      description: 'Senior engineer walks through how Pathao scaled their dispatch layer. Q&A after.',
      organizer: 'CR Sadia',
      goingCount: 26,
      initialsList: ['TR', 'TJ', 'AS'],
      userRSVP: true
    },
    {
      id: 'e3',
      tabType: 'Past',
      bannerColor: 'sand',
      day: '10',
      month: 'MAR',
      title: 'Spring 2026 farewell',
      fullDate: 'Tue 10 Mar',
      timeLabel: '6:00 pm',
      location: 'Cafeteria rooftop',
      description: 'Spring 2026 graduating students send-off.',
      organizer: 'CR Sadia',
      goingCount: 38,
      initialsList: ['NA', 'RH', 'MK'],
      userRSVP: false
    }
  ]);

  // 4. Ask CR Threads
  const [threads, setThreads] = useState<any[]>([
    {
      id: 't1',
      asker: 'Tahmid Rahman',
      askerInitials: 'TR',
      timeLabel: '23 min ago',
      tag: 'GENERAL',
      question: 'Will the SE131 lecture next Tuesday move to Wednesday?',
      replied: true,
      replyText: 'Yes, Dr. NSL will be at a conference. Class shifts to Wed same slot, Room 1504. I\'ll pin a notice tonight.',
      replyTime: '20 min ago'
    },
    {
      id: 't2',
      asker: 'Nila Akter',
      askerInitials: 'NA',
      timeLabel: '1 hr ago',
      tag: 'URGENT',
      question: 'Is Route 7 confirmed delayed today? Should I take an alternate?',
      replied: false
    },
    {
      id: 't3',
      asker: 'Rakib Hasan',
      askerInitials: 'RH',
      timeLabel: '3 hr ago',
      tag: 'ROUTINE',
      question: 'Quiz 2 syllabus — only chapter 3-4 or also chapter 5?',
      replied: true,
      replyText: 'Only 3-4. Dr. NSL confirmed in class today. I\'ll forward you the slide pack.',
      replyTime: '20 min ago'
    },
    {
      id: 't4',
      asker: 'Tasnim Jahan',
      askerInitials: 'TJ',
      timeLabel: 'Yesterday',
      tag: 'GENERAL',
      question: 'Where can I find the final exam window dates?',
      replied: false
    }
  ]);

  // 5. Faculty directory initial state
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([
    { id: 'f_ahmed', name: 'Dr. Khondkar Nazmul Ahmed', designation: 'Assistant Professor', course: 'SE123 Discrete Mathematics', dept: 'SWE', phone: '+880 1712 345 671', whatsapp: '+880 1712 345 671', email: 'nazmul.ahmed@swe.edu', initials: 'KA', letter: 'A', officeHours: 'Sun-Wed 10-12 pm', status: 'Available' },
    { id: 'f_alam', name: 'Dr. Mahbub Alam', designation: 'Senior Lecturer', course: 'SE221 Algorithms', dept: 'SWE', phone: '+880 1712 345 672', whatsapp: '+880 1712 345 672', email: 'mahbub.alam@swe.edu', initials: 'MA', letter: 'A', officeHours: 'Mon-Thu 2-4 pm', status: 'Available' },
    { id: 'f_bhuiyan', name: 'Dr. Ahmed Karim Bhuiyan', designation: 'Professor & Head', course: 'SE301 Software Project Management', dept: 'SWE', phone: '+880 1712 345 673', whatsapp: '+880 1712 345 673', email: 'ahmed.bhuiyan@swe.edu', initials: 'AB', letter: 'B', officeHours: 'By appointment', status: 'Available' },
    { id: 'f_hossain', name: 'Dr. Faruq Hossain', designation: 'Associate Professor', course: 'SE302 Software Architecture', dept: 'SWE', phone: '+880 1712 345 674', whatsapp: '+880 1712 345 674', email: 'faruq.hossain@swe.edu', initials: 'FH', letter: 'H', officeHours: 'Tue-Wed 11-1 pm', status: 'Available' },
    { id: 'f_islam_r', name: 'Dr. Rafiqul Islam', designation: 'Lecturer', course: 'SE315 Web Engineering', dept: 'SWE', phone: '+880 1712 345 675', whatsapp: '+880 1712 345 675', email: 'rafiqul.islam@swe.edu', initials: 'RI', letter: 'I', officeHours: 'Sun-Wed 1-3 pm', status: 'Available' },
    { id: 'f_islam_t', name: 'Dr. Tariqul Islam', designation: 'Assistant Professor', course: 'SE207 Computer Architecture', dept: 'SWE', phone: '+880 1712 345 676', whatsapp: '', email: 'tariqul.islam@swe.edu', initials: 'TI', letter: 'I', officeHours: 'Mon-Wed 9-11 am', status: 'Available' },
    { id: 'f_karim', name: 'Dr. Delowar Karim', designation: 'Assistant Professor', course: 'MAT102 Mathematics II', dept: 'SWE', phone: '+880 1712 345 677', whatsapp: '+880 1712 345 677', email: 'delowar.karim@swe.edu', initials: 'DK', letter: 'K', officeHours: 'Sun-Tue 12-2 pm', status: 'Available' },
    { id: 'f_khatun', name: 'Dr. Ayesha Khatun', designation: 'Associate Professor', course: 'SE205 Database Systems', dept: 'SWE', phone: '+880 1712 345 678', whatsapp: '+880 1712 345 678', email: 'ayesha.khatun@swe.edu', initials: 'AK', letter: 'K', officeHours: 'Wed-Thu 3-5 pm', status: 'Available' },
    { id: 'f_lipu', name: 'Dr. Nazmul Sultan Lipu', designation: 'Associate Professor', course: 'SE131 Data Structure', dept: 'SWE', phone: '+880 1712 345 679', whatsapp: '+880 1712 345 679', email: 'nazmul.lipu@swe.edu', initials: 'NL', letter: 'L', officeHours: 'Sun-Wed 2-4 pm', status: 'Available' },
    { id: 'f_mahmud', name: 'Dr. Hasan Mahmud', designation: 'Senior Lecturer', course: 'SE211 Operating Systems', dept: 'SWE', phone: '+880 1712 345 680', whatsapp: '', email: 'hasan.mahmud@swe.edu', initials: 'HM', letter: 'M', officeHours: 'Tue-Wed 4-5 pm', status: 'Available' },
    { id: 'f_uddin', name: 'Dr. Jashim Uddin', designation: 'Professor', course: 'SE401 Software Engineering Theory', dept: 'SWE', phone: '+880 1712 345 681', whatsapp: '+880 1712 345 681', email: 'jashim.uddin@swe.edu', initials: 'JU', letter: 'U', officeHours: 'Mon-Wed 1-3 pm', status: 'Available' },
    { id: 'f_yusuf', name: 'Dr. Khalid Rahman Yusuf', designation: 'Associate Professor', course: 'SE213 Digital Electronics & Logic', dept: 'SWE', phone: '+880 1712 345 682', whatsapp: '+880 1712 345 682', email: 'khalid.yusuf@swe.edu', initials: 'KY', letter: 'Y', officeHours: 'Mon-Tue 2-4 pm', status: 'Available' }
  ]);

  // Real System Clock for Header Date formatted anchor
  const [systemTime, setSystemTime] = useState<Date>(() => new Date());
  useEffect(() => {
    const clock = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Post composer state bindings
  const [postTitle, setPostTitle] = useState('MAT102 cancelled today — Slot 3');
  const [postBody, setPostBody] = useState('Dr. DK is unwell. Class rescheduled to Wed same slot, Room 913.');
  const [selectedTemplate, setSelectedTemplate] = useState<'cancelled' | 'room' | 'bus' | 'custom'>('cancelled');

  // Delivery options state
  const [pinToTop, setPinToTop] = useState(true);
  const [sendPush, setSendPush] = useState(true);
  const [scheduleLater, setScheduleLater] = useState(false);

  // In-app floating dismissible warning toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State arrays for posts (pinned & recent) to ensure real-time interaction
  const [pinnedPost, setPinnedPost] = useState<PostItem | null>({
    id: 'mock-pinned-post',
    tag: 'routine',
    title: 'MAT102 cancelled today — Slot 3',
    body: 'Dr. DK is unwell. Class rescheduled to Wed same slot, Room 913.',
    timestamp: new Date().toISOString(),
    timeLabel: '2 min ago',
    seenCount: 41,
    totalCount: 42,
    likes: 24,
    isPinned: true
  });

  const [recentPosts, setRecentPosts] = useState<PostItem[]>([
    {
      id: 'mock-post-1',
      tag: 'transport',
      title: 'Bus pickup moved to Gate 2',
      body: 'Route 7 bus scheduled departure will proceed from Main Gate 2 instead of the standard terminal.',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      timeLabel: '3 hr ago',
      seenCount: 38,
      totalCount: 42,
      likes: 12
    },
    {
      id: 'mock-post-2',
      tag: 'exam',
      title: 'Mid-term schedule posted',
      body: 'Syllabus guidelines and physical seat plans for Software Engineering courses have been released in official portals.',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      timeLabel: '1 day ago',
      seenCount: 42,
      totalCount: 42,
      likes: 31
    }
  ]);

  // Handler for liking post
  const handleLikePost = (postId: string, isPinned: boolean) => {
    if (isPinned && pinnedPost && pinnedPost.id === postId) {
      setPinnedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      triggerToast("Voted support for pinned thread!");
    } else {
      setRecentPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      triggerToast("Voted support for thread!");
    }
  };

  // Select a template
  const handleSelectTemplate = (templateName: 'cancelled' | 'room' | 'bus' | 'custom') => {
    setSelectedTemplate(templateName);
    if (templateName === 'cancelled') {
      setPostTitle('MAT102 cancelled today — Slot 3');
      setPostBody('Dr. DK is unwell. Class rescheduled to Wed same slot, Room 913.');
    } else if (templateName === 'room') {
      setPostTitle('SE131 room relocated to AB3-106');
      setPostBody('Data Structure lecture relocated. Please find the proxy arrangement attached.');
    } else if (templateName === 'bus') {
      setPostTitle('Bus pickup moved to Gate 2');
      setPostBody('Route 7 bus scheduled departure will proceed from Main Gate 2 instead of the standard terminal.');
    } else {
      setPostTitle('');
      setPostBody('');
    }
    setActiveTab('Post');
  };

  // Publish Draft Post
  const handlePublishPost = () => {
    if (!postTitle.trim() || !postBody.trim()) {
      triggerToast("Please fill in the title and description values!");
      return;
    }

    const newPost: PostItem = {
      id: 'custom-user-post-' + Date.now(),
      tag: selectedTemplate === 'custom' ? 'announcement' : selectedTemplate === 'cancelled' ? 'routine' : selectedTemplate === 'room' ? 'routine' : 'transport',
      title: postTitle,
      body: postBody,
      timestamp: new Date().toISOString(),
      timeLabel: 'now',
      seenCount: 1,
      totalCount: 42,
      likes: 0
    };

    if (pinToTop) {
      // If a post is already pinned, move it into recents first
      if (pinnedPost) {
        setRecentPosts(prev => [pinnedPost, ...prev]);
      }
      setPinnedPost(newPost);
      triggerToast("Dispatched pinned broadcast push to SWE-M!");
    } else {
      setRecentPosts(prev => [newPost, ...prev]);
      triggerToast("Dispatched recent stream update!");
    }

    // Reset composer to defaults
    setPostTitle('MAT102 cancelled today — Slot 3');
    setPostBody('Dr. DK is unwell. Class rescheduled to Wed same slot, Room 913.');
    setSelectedTemplate('cancelled');
    setPinToTop(true);
    setSendPush(true);
    setScheduleLater(false);

    // Swap back to main board
    setActiveTab('Home');
  };

  // Unpin post
  const handleUnpinPost = () => {
    if (pinnedPost) {
      setRecentPosts(prev => [pinnedPost, ...prev]);
      setPinnedPost(null);
      triggerToast("Unpinned post moved to regular stream.");
    }
  };

  // Gate Check Restricted Screen
  if (!isSweM46CR) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-6 max-w-sm space-y-4">
          <div className="w-12 h-12 bg-[#FCE8E9] rounded-full flex items-center justify-center text-[#E5484D] mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-bold text-[#0E0D0B] font-sans">Access Restricted</h2>
          <p className="text-xs text-[#4D4B45] leading-relaxed">
            This Class Representative interface is exclusive to Section M (Batch 46) of Software Engineering (SWE).
          </p>
          <div className="pt-2">
            <button
              onClick={onChangeContext}
              className="w-full py-2.5 bg-[#FF5A36] text-white font-semibold text-xs rounded-full shadow-coral-glow transition-all active:scale-97 cursor-pointer"
            >
              Change Academic Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  const combinedActivePosts = pinnedPost ? [pinnedPost, ...recentPosts] : recentPosts;

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-[#0E0D0B] flex flex-col font-sans pb-24 selection:bg-[#FFE7DF] selection:text-[#FF5A36]">
      {/* Scrollable Container Wrapper */}
      <main className={`flex-1 p-5 max-w-lg mx-auto w-full ${(isSearchOpen || isNotificationsOpen) ? 'h-[calc(100vh-72px)] overflow-hidden' : ''}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'Home' && !currentSubScreen && (
            <motion.div
              key="cr-home-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <CRHome 
                systemTime={systemTime}
                pinnedPost={pinnedPost}
                recentPosts={recentPosts}
                onUnpin={handleUnpinPost}
                onSelectTemplate={handleSelectTemplate}
                onLikePost={handleLikePost}
                onNavigateSubScreen={(screen) => setCurrentSubScreen(screen)}
                assignmentsCount={assignments.length}
                quizzesCount={3} // Static count matching mock
                facultyCount={facultyList.length}
                pollsCount={polls.filter(p => p.status !== 'Closed').length}
                eventsCount={events.filter(e => e.tabType === 'Upcoming').length}
                unansweredCount={threads.filter(t => !t.replied).length}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                unreadNotificationsCount={notifications.filter(n => n.unread).length}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Assignments' && (
            <motion.div
              key="cr-sub-assignments"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenAssignments 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                assignments={assignments}
                setAssignments={setAssignments}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'AcademicHub' && (
            <motion.div
              key="cr-sub-academic-hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenAcademicHub 
                onBack={() => setCurrentSubScreen(null)}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Faculty' && (
            <motion.div
              key="cr-sub-faculty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenFaculty 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                facultyList={facultyList}
                setFacultyList={setFacultyList}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Polls' && (
            <motion.div
              key="cr-sub-polls"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenPolls 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                polls={polls}
                setPolls={setPolls}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Events' && (
            <motion.div
              key="cr-sub-events"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenEvents 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                events={events}
                setEvents={setEvents}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'AskCR' && (
            <motion.div
              key="cr-sub-ask-cr"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenAskCR 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                threads={threads}
                setThreads={setThreads}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Routine' && (
            <motion.div
              key="cr-sub-routine"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <RoutineScreen 
                currentUser={currentUser} 
                onBack={() => setCurrentSubScreen(null)}
              />
            </motion.div>
          )}

          {activeTab === 'Home' && currentSubScreen === 'Transport' && (
            <motion.div
              key="cr-sub-transport"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenTransport 
                currentUser={currentUser} 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

          {activeTab === 'Post' && (
            <motion.div
              key="cr-post-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.12 }}
            >
              <CRPost 
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
                pinToTop={pinToTop}
                setPinToTop={setPinToTop}
                sendPush={sendPush}
                setSendPush={setSendPush}
                scheduleLater={scheduleLater}
                setScheduleLater={setScheduleLater}
                onPostNow={handlePublishPost}
                onCancel={() => {
                  triggerToast("Draft saved in temporary store.");
                  setActiveTab('Home');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'Section' && !currentSubScreen && (
            <motion.div
              key="cr-section-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <CRSection 
                pinnedPost={pinnedPost}
                onUnpin={handleUnpinPost}
                onTriggerToast={triggerToast}
                onNavigateSubScreen={(screen) => setCurrentSubScreen(screen)}
              />
            </motion.div>
          )}

          {activeTab === 'Section' && currentSubScreen === 'Routine' && (
            <motion.div
              key="cr-sub-routine-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <RoutineScreen 
                currentUser={currentUser} 
                onBack={() => setCurrentSubScreen(null)}
              />
            </motion.div>
          )}

          {activeTab === 'Section' && currentSubScreen === 'Transport' && (
            <motion.div
              key="cr-sub-transport-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenTransport 
                currentUser={currentUser} 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

          {activeTab === 'Section' && currentSubScreen === 'Events' && (
            <motion.div
              key="cr-sub-events-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <CRSubScreenEvents 
                onBack={() => setCurrentSubScreen(null)}
                triggerToast={triggerToast}
                events={events}
                setEvents={setEvents}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {activeTab === 'Roster' && (
            <motion.div
              key="cr-roster-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <CRRoster 
                onTriggerToast={triggerToast}
              />
            </motion.div>
          )}

          {activeTab === 'Me' && (
            <motion.div
              key="cr-me-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <CRMe 
                onTriggerToast={triggerToast}
                onChangeContext={onChangeContext}
                onLogout={onLogout}
                currentUser={currentUser}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING WARNING TOAST CONFIRMATIONS OVERLAY */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-[96px] left-1/2 -translate-x-1/2 z-50 bg-[#0E0D0B] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2 border border-white/10 font-sans tracking-wide text-center whitespace-normal max-w-[340px] pointer-events-none"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CR overlays for Search and Notifications */}
      <CRSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        activePosts={combinedActivePosts}
      />

      <CRNotificationsOverlay
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onNotificationsChange={(updated) => setNotifications(updated)}
      />

      {/* (CR-specific Bottom glass-blur pill navigation) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/92 backdrop-blur-[24px] border-t border-[#ECEAE5] flex items-center justify-around px-2 pb-safe shadow-sm">
        {[
          { label: 'Home', icon: <Volume2 size={22} strokeWidth={1.75} />, tabId: 'Home' as const },
          { label: 'Post', icon: <Plus size={22} strokeWidth={1.75} />, tabId: 'Post' as const },
          { label: 'Section', icon: <Settings2 size={22} strokeWidth={1.75} />, tabId: 'Section' as const },
          { label: 'Roster', icon: <Users size={22} strokeWidth={1.75} />, tabId: 'Roster' as const },
          { label: 'Me', icon: <UserIcon size={22} strokeWidth={1.75} />, tabId: 'Me' as const },
        ].map((item) => {
          const isActive = activeTab === item.tabId;
          
          if (item.tabId === 'Post') {
            return (
              <button
                key={item.tabId}
                onClick={() => {
                  setActiveTab('Post');
                  setCurrentSubScreen(null);
                }}
                className="flex flex-col items-center justify-center shrink-0 active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] cursor-pointer"
              >
                <div 
                  className={`w-[44px] h-[44px] rounded-[10px] bg-[#FFE7DF] flex items-center justify-center transition-all ${
                    isActive ? 'ring-4 ring-[#FF5A36]' : ''
                  }`}
                >
                  <Plus size={22} strokeWidth={1.75} className="text-[#FF5A36]" />
                </div>
                <span className="text-[10px] font-semibold mt-1 text-[#FF5A36]">Post</span>
              </button>
            );
          }

          return (
            <button
              key={item.tabId}
              onClick={() => {
                setActiveTab(item.tabId);
                setCurrentSubScreen(null);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-sm transition-all duration-120 cursor-pointer active:scale-[0.97] ${
                isActive ? 'text-[#FF5A36]' : 'text-[#4D4B45] hover:text-[#0E0D0B]'
              }`}
            >
              {item.icon}
              <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
                isActive ? 'text-[#FF5A36]' : 'text-[#4D4B45]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
