import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, PenLine, Users, User, Bell, BellOff, Check, CheckCheck, 
  MoreVertical, Ban, X, AlertTriangle, Megaphone, FileCheck, ClipboardCheck, 
  Trash2, MapPin, Link, Presentation, FileText, Link2, Upload, Volume2, Save, 
  Clock, Calendar, Star, ChevronLeft, Phone, MessageCircle, CalendarDays
} from 'lucide-react';

import FacultyRoutineTab from './FacultyRoutineTab';
import FacultyCoursesTab from './FacultyCoursesTab';
import FacultyRosterTab from './FacultyRosterTab';
import FacultyMeTab from './FacultyMeTab';

// Feature Flag
const FACULTY_ENABLED = true;

// Programmatically generate 42-student roster exactly matching prompt names and roll IDs
const NAMES_LOCKED = [
  "Tahmid Rahman", "Nila Akter", "Rakib Hasan", "Mehedi Khan", "Tasnim Jahan",
  "Anik Saha", "Sadia Rahman", "Imran Hossain", "Farhana Akter", "Zayed Hasan",
  "Mitu Barua", "Nusrat Jahan", "Sakib Al Amin", "Tania Sultana", "Raful Islam",
  "Sumaiya Akter", "Arif Mahmud", "Jannatul Ferdous", "Shahrior Kabir", "Maliha Noor",
  "Tanvir Ahmed", "Ishrat Jahan", "Naimur Rahman", "Proma Das", "Asif Iqbal",
  "Lamia Chowdhury", "Fahim Shahrior", "Rumana Akter", "Sabbir Hossain", "Tisha Rahman",
  "Mahin Uddin", "Anika Tabassum", "Redwan Karim", "Sneha Roy", "Hasibul Haque",
  "Mim Akter", "Junaid Alam", "Oishi Saha", "Raihan Kabir", "Nabila Yasmin",
  "Shuvo Das", "Faria Islam"
];

const MASTER_ROSTER = NAMES_LOCKED.map((name, index) => {
  const numStr = String(index + 1).padStart(3, '0');
  return {
    id: `2021-1-60-${numStr}`,
    name,
    isCR: name === "Sadia Rahman"
  };
});

// Seed data interfaces
interface ClassSlot {
  id: string;
  code: string;
  name: string;
  section: string;
  room: string;
  timeStart: string;
  timeEnd: string;
  slotType: 'PAST' | 'NOW' | 'UPCOMING';
  attendedCount?: number;
  cancelled?: boolean;
}

interface FacultyNotification {
  id: string;
  kind: 'reminder' | 'submission' | 'question' | 'grade' | 'system';
  unread: boolean;
  time: string;
  title: string;
  body: string;
  hasAction?: boolean;
}

export default function FacultyShell({ currentUser, onLogout, onChangeContext }: { currentUser: any; onLogout: () => void; onChangeContext: () => void }) {
  // Simulator Override logic
  const [facultyEnabledLocal, setFacultyEnabledLocal] = useState(FACULTY_ENABLED);

  // Active Toast State
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
  };
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 1800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // CORE DATA STATE PERSISTED LOCALLY
  const [classes, setClasses] = useState<ClassSlot[]>(() => {
    const saved = localStorage.getItem('vars_faculty_classes');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', code: 'SE132', name: 'Lab M1 Data Structure', section: 'SWE-M', room: 'Room 710', timeStart: '08:30 am', timeEnd: '10:00 am', slotType: 'PAST', attendedCount: 40 },
      { id: '2', code: 'SE131', name: 'Data Structure', section: 'SWE-M', room: 'Room 1504', timeStart: '10:00 am', timeEnd: '11:30 am', slotType: 'NOW' },
      { id: '3', code: 'SE132', name: 'Lab M2 Data Structure', section: 'SWE-M', room: 'Room AB3-106', timeStart: '01:00 pm', timeEnd: '02:30 pm', slotType: 'UPCOMING' }
    ];
  });

  const [notifications, setNotifications] = useState<FacultyNotification[]>(() => {
    const saved = localStorage.getItem('vars_faculty_notifs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'n1', kind: 'reminder', unread: true, time: '10:45 am', title: 'Attendance not marked', body: 'SE131 · Data Structure is in session — mark attendance for SWE-M.', hasAction: true },
      { id: 'n2', kind: 'submission', unread: true, time: '5 min ago', title: 'New submission', body: 'Tahmid Rahman submitted Assignment 4 · Hash tables (SE131).' },
      { id: 'n3', kind: 'question', unread: true, time: '2h ago', title: 'CR Sadia Rahman asked', body: "Will Saturday's SE132 makeup class be cancelled?" },
      { id: 'n4', kind: 'submission', unread: false, time: '3h ago', title: 'Submissions update', body: '12 of 42 students submitted Lab report 5 · Stacks (SE132).' },
      { id: 'n5', kind: 'grade', unread: false, time: 'Yesterday', title: 'Grading pending', body: 'Quiz 2 · Linked lists has 24 papers left to grade.' },
      { id: 'n6', kind: 'system', unread: false, time: 'Mon 8 Jun', title: 'Room confirmed', body: 'Room AB3-106 booked for SE132 Lab M2 on Wed 10 Jun.' }
    ];
  });

  const [announcements, setAnnouncements] = useState<any[]>(() => {
    const saved = localStorage.getItem('vars_faculty_announcements');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'a1', sections: ['SWE-M'], text: "Bring your lab manuals for tomorrow's SE132 lab — we start at 8:30 sharp.", timestamp: 'Yesterday · 4:20 pm', reach: 42 },
      { id: 'a2', sections: ['SWE-M', 'SWE-N'], text: "Quiz 2 grades are published. Review on the portal before Sunday.", timestamp: 'Sat 7 Jun · 11:05 am', reach: 80 }
    ];
  });

  const [quizzes, setQuizzes] = useState<any[]>(() => {
    const saved = localStorage.getItem('vars_faculty_quizzes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'q1', code: 'SE131', title: 'Quiz 3 · Trees & BST', date: 'Sun 14 Jun', time: '10:00 am', marks: 15, status: 'Scheduled' },
      { id: 'q2', code: 'SE132', title: 'Lab quiz 2 · Stacks', date: 'Tue 16 Jun', time: '02:00 pm', marks: 10, status: 'Scheduled' },
      { id: 'q3', code: 'SE131', title: 'Quiz 2 · Linked lists', date: 'Sat 31 May', time: '09:30 am', marks: 30, status: 'Grading', gradedCount: 18 },
      { id: 'q4', code: 'SE131', title: 'Quiz 1 · Arrays', date: 'Sat 24 May', time: '09:30 am', marks: 30, status: 'Graded', gradedCount: 42 }
    ];
  });

  const [assignments, setAssignments] = useState<any[]>(() => {
    const saved = localStorage.getItem('vars_faculty_assignments');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'as1', code: 'SE131', title: 'Assignment 4 · Hash tables', due: 'Sun 14 Jun', submitted: 28, status: 'Open', toGrade: 28 },
      { id: 'as2', code: 'SE132', title: 'Lab report 5 · Stacks & queues', due: 'Tue 16 Jun', submitted: 12, status: 'Open', toGrade: 12 },
      { id: 'as3', code: 'SE131', title: 'Assignment 3 · Recursion', due: 'Closed 4 Jun', submitted: 41, status: 'Closed', toGrade: 5 },
      { id: 'as4', code: 'SE132', title: 'Lab report 4 · Linked lists', due: 'Closed 28 May', submitted: 40, status: 'Closed', toGrade: 0 }
    ];
  });

  const [officeHours, setOfficeHours] = useState<any[]>(() => {
    const saved = localStorage.getItem('vars_faculty_hours');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'o1', time: '2:00 pm – 4:00 pm', days: ['SUN', 'MON', 'TUE', 'WED'], room: 'UB-704', online: false }
    ];
  });

  const [materials, setMaterials] = useState<any[]>(() => {
    const saved = localStorage.getItem('vars_faculty_materials');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'm1', code: 'SE131', title: 'Lecture 6 · Trees', type: 'Slides', size: '4.2 MB', date: '2 Jun' },
      { id: 'm2', code: 'SE131', title: 'BST traversal notes', type: 'Notes', size: '820 KB', date: '2 Jun' },
      { id: 'm3', code: 'SE132', title: 'Lab 4 manual · Stacks', type: 'Reference', size: '1.1 MB', date: '28 May' }
    ];
  });

  // Keep LocalStorage updated
  useEffect(() => {
    localStorage.setItem('vars_faculty_classes', JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_announcements', JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_assignments', JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_hours', JSON.stringify(officeHours));
  }, [officeHours]);
  useEffect(() => {
    localStorage.setItem('vars_faculty_materials', JSON.stringify(materials));
  }, [materials]);

   // ACTIVE SHEET TARGET OR MODAL TRACKERS
  const [activeSheet, setActiveSheet] = useState<'attendance' | 'cancel_class' | 'new_quiz' | 'new_assignment' | 'add_office' | 'upload_material' | null>(null);
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null); // 'attendance_list' | 'announce' | 'quizzes' | 'assignments' | 'office' | 'materials' | 'notifications'
  const [activeTab, setActiveTab] = useState<'TODAY' | 'ROUTINE' | 'COURSES' | 'ROSTER' | 'ME'>('TODAY');
  
  // Cross-tab interaction preselection caches
  const [coursePreselectionCode, setCoursePreselectionCode] = useState<string | null>(null);
  const [rosterPreselectionSect, setRosterPreselectionSect] = useState<string | null>(null);
  
  // Selection Anchor for sheet context
  const [sheetTargetClass, setSheetTargetClass] = useState<ClassSlot | null>(null);
  const [attendanceMarks, setAttendanceMarks] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [cancelReason, setCancelReason] = useState('');
  const [kebabOpenId, setKebabOpenId] = useState<string | null>(null);

  // Announcement fields
  const [annSelectedSections, setAnnSelectedSections] = useState<string[]>(['SWE-M']);
  const [annPhrase, setAnnPhrase] = useState('');
  const [annPushNotify, setAnnPushNotify] = useState(true);

  // Quiz fields
  const [quizCourse, setQuizCourse] = useState('SE131');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizMarks, setQuizMarks] = useState('');

  // Assignment fields
  const [assignCourse, setAssignCourse] = useState('SE131');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');

  // Office Hour fields
  const [officeDays, setOfficeDays] = useState<string[]>(['SUN', 'MON', 'WED']);
  const [officeFrom, setOfficeFrom] = useState('2:00 pm');
  const [officeTo, setOfficeTo] = useState('4:00 pm');
  const [officeOnline, setOfficeOnline] = useState(false);
  const [officeLocation, setOfficeLocation] = useState('UB-704');

  // Material Upload fields
  const [materialCourse, setMaterialCourse] = useState('SE131');
  const [materialType, setMaterialType] = useState('Slides');
  const [materialTitle, setMaterialTitle] = useState('');

  // Unread Notification Counts
  const unreadCount = notifications.filter(n => n.unread).length;

  // Active state logic computed for hero card
  const activeClassNow = classes.find(c => c.slotType === 'NOW');
  let heroState: 'RIGHT_NOW' | 'ATTENDANCE_SAVED' | 'CANCELLED' | 'DONE' = 'RIGHT_NOW';
  
  if (activeClassNow) {
    if (activeClassNow.cancelled) {
      heroState = 'CANCELLED';
    } else if (activeClassNow.attendedCount !== undefined) {
      heroState = 'ATTENDANCE_SAVED';
    } else {
      heroState = 'RIGHT_NOW';
    }
  } else {
    heroState = 'DONE'; // fall back or all classes complete
  }

  // Attendance Sheet functions
  const openAttendanceSheet = (slot: ClassSlot, updateMode = false) => {
    setSheetTargetClass(slot);
    // Prep initial marks
    const initial: Record<string, 'P' | 'A' | 'L'> = {};
    if (updateMode && slot.attendedCount !== undefined) {
      // simulate preloaded
      MASTER_ROSTER.forEach((stud, idx) => {
        initial[stud.id] = (idx < slot.attendedCount!) ? 'P' : (idx % 8 === 0 ? 'L' : 'A');
      });
    }
    setAttendanceMarks(initial);
    setActiveSheet('attendance');
    setKebabOpenId(null);
  };

  const handleSaveAttendance = () => {
    if (!sheetTargetClass) return;
    const markedKeys = Object.keys(attendanceMarks);
    if (markedKeys.length === 0) {
      triggerToast('Mark at least one student before saving');
      return;
    }
    
    // Auto-mark unmarked as present
    const finalMarks = { ...attendanceMarks };
    MASTER_ROSTER.forEach(s => {
      if (!finalMarks[s.id]) {
        finalMarks[s.id] = 'P';
      }
    });

    const presentCount = Object.values(finalMarks).filter(m => m === 'P' || m === 'L').length;

    // Mutate state
    setClasses(prev => prev.map(c => {
      if (c.id === sheetTargetClass.id) {
        return { ...c, attendedCount: presentCount };
      }
      return c;
    }));

    // Mark corresponding notification read
    setNotifications(prev => prev.map(n => {
      if (n.kind === 'reminder' && n.title === 'Attendance not marked') {
        return { ...n, unread: false, hasAction: false };
      }
      return n;
    }));

    setActiveSheet(null);
    triggerToast(`Attendance saved · ${presentCount}/42 present`);
  };

  const handleCancelClassSubmit = () => {
    if (!sheetTargetClass) return;
    setClasses(prev => prev.map(c => {
      if (c.id === sheetTargetClass.id) {
        return { ...c, cancelled: true };
      }
      return c;
    }));
    setActiveSheet(null);
    triggerToast('Class cancelled · 42 students notified');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked read');
  };

  // Announce dispatch helper
  const handleAnnounceSend = () => {
    if (annSelectedSections.length === 0) {
      triggerToast('Pick at least one section');
      return;
    }
    if (!annPhrase.trim()) {
      triggerToast('Write a message first');
      return;
    }
    const reach = annSelectedSections.reduce((acc, c) => acc + (c === 'SWE-M' ? 42 : c === 'SWE-N' ? 38 : 41), 0);
    const newAnn = {
      id: 'a_' + Date.now(),
      sections: annSelectedSections,
      text: annPhrase,
      timestamp: 'Just now',
      reach
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setAnnPhrase('');
    triggerToast(`Announcement sent · ${reach} students`);
  };

  // Schedule Quiz submission
  const handleScheduleQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      triggerToast('Add a title');
      return;
    }
    if (!quizDate.trim()) {
      triggerToast('Pick a date');
      return;
    }
    if (!quizMarks.trim()) {
      triggerToast('Add total marks');
      return;
    }
    const newQ = {
      id: 'q_' + Date.now(),
      code: quizCourse,
      title: quizTitle,
      date: quizDate,
      time: '10:00 am',
      marks: parseInt(quizMarks) || 15,
      status: 'Scheduled'
    };
    setQuizzes(prev => [newQ, ...prev]);
    setQuizTitle('');
    setQuizDate('');
    setQuizMarks('');
    setActiveSheet(null);
    triggerToast(`Quiz scheduled · ${quizCourse}`);
  };

  // New assignment dispatch
  const handlePostAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) {
      triggerToast('Add a title');
      return;
    }
    if (!assignDueDate.trim()) {
      triggerToast('Pick a due date');
      return;
    }
    const newAs = {
      id: 'as_' + Date.now(),
      code: assignCourse,
      title: assignTitle,
      due: 'Due ' + assignDueDate,
      submitted: 0,
      status: 'Open',
      toGrade: 42
    };
    setAssignments(prev => [newAs, ...prev]);
    setAssignTitle('');
    setAssignDueDate('');
    setActiveSheet(null);
    triggerToast('Assignment posted · 42 students notified');
  };

  // Add Office Hour submission
  const handleAddOffice = () => {
    if (officeDays.length === 0) {
      triggerToast('Pick at least one day');
      return;
    }
    if (!officeOnline && !officeLocation.trim()) {
      triggerToast('Add a room or turn on Online');
      return;
    }
    const newO = {
      id: 'o_' + Date.now(),
      time: `${officeFrom} – ${officeTo}`,
      days: officeDays,
      room: officeOnline ? 'Google Meet' : officeLocation,
      online: officeOnline
    };
    setOfficeHours(prev => [...prev, newO]);
    setActiveSheet(null);
    triggerToast('Office hours added');
  };

  // Upload Materials
  const handleUploadMaterial = () => {
    if (!materialTitle.trim()) {
      triggerToast('Add a title');
      return;
    }
    const newM = {
      id: 'm_' + Date.now(),
      code: materialCourse,
      title: materialTitle,
      type: materialType,
      size: '2.4 MB',
      date: 'Just now'
    };
    setMaterials(prev => [newM, ...prev]);
    setMaterialTitle('');
    setActiveSheet(null);
    triggerToast(`Uploaded to ${materialCourse}`);
  };

  // Under Feature Flag Coming Soon fallback
  if (!facultyEnabledLocal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-canvas p-6 text-center font-sans">
        <div className="w-[390px] h-[844px] bg-white border border-[#E0DED8] rounded-[40px] shadow-4 overflow-hidden flex flex-col justify-between p-6 relative">
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-[#FFF4F0] text-[#FF5A36] rounded-full flex items-center justify-center shadow-1">
              <Star size={32} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-ink-900 leading-snug">Faculty Kit reserved for v1.x</h1>
            <p className="text-xs text-ink-500 max-w-[280px] leading-relaxed">
              Faculty role is currently locked under development. Reviewer toggle matches bypass testing values.
            </p>
            <button
              onClick={() => setFacultyEnabledLocal(true)}
              className="py-2.5 px-6 bg-[#FF5A36] hover:bg-[#E84A28] text-white text-xs font-bold rounded-full transition-all shadow-coral-glow"
            >
              Enable Reviewer Preview
            </button>
          </div>
          <button
            onClick={onChangeContext}
            className="text-xs font-bold text-ink-600 underline underline-offset-4"
          >
            ← Back to academic selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-[#0E0D0B] flex flex-col font-sans selection:bg-[#FFE7DF] selection:text-[#FF5A36] select-none">
      
      {/* TOP FLOATING TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-[16px] left-[16px] right-[16px] max-w-sm mx-auto bg-[#0E0D0B] text-white text-[12px] font-sans font-semibold py-3 px-4 rounded-[12px] shadow-4 flex items-center gap-2 z-55 justify-between"
          >
            <span className="leading-snug">{toast}</span>
            <X size={14} className="opacity-60 cursor-pointer shrink-0" onClick={() => setToast(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Nested Screen Content Container with max-width responsive alignment */}
      <main className="flex-1 p-[20px] pt-[24px] max-w-lg mx-auto w-full overflow-y-auto no-scrollbar pb-[80px]">
        <AnimatePresence mode="wait">
          {!activeSubScreen ? (
              /* MAIN LANDING TODAY PAGE OR ROUTINE/COURSES/ROSTER/ME TABS */
              <motion.div
                key={`tab-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-[16px]"
              >
                {activeTab === 'TODAY' && (
                  <>
                    {/* SHELL HEADER */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#ECEAE5]">
                      <div>
                        <h1 className="text-[32px] font-extrabold text-[#181a1a] tracking-tight leading-none text-left">Today</h1>
                        <p className="font-mono text-[12px] text-ink-500 font-semibold mt-2 text-left">
                          Wed 10 Jun &middot; 3 classes
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveSubScreen('notifications')}
                        className="w-[44px] h-[44px] bg-transparent rounded-[10px] flex items-center justify-center border border-[#ECEAE5] relative cursor-pointer active:scale-95 duration-120"
                      >
                        <Bell size={22} className="text-ink-900" />
                        {unreadCount > 0 && (
                          <span className="absolute top-[2px] right-[2px] w-[8px] h-[8px] bg-[#FF5A36] rounded-full border-2 border-[#FAFAF9]" />
                        )}
                      </button>
                    </div>

                    {/* STATE-AWARE HERO CARD */}
                    <div className="bg-[#0E0D0B] rounded-[20px] p-[24px] shadow-3 relative overflow-hidden flex flex-col justify-between min-h-[190px] text-white select-none">
                      {/* Decorative glyph */}
                      <BookOpen 
                        size={200} 
                        className="absolute right-[-20px] bottom-[-40px] text-white opacity-[0.06] pointer-events-none" 
                        strokeWidth={1.25}
                      />

                      {/* Top Logic overline & header definitions */}
                      <div className="space-y-[6px] relative z-10 text-left">
                        {heroState === 'RIGHT_NOW' && (
                          <>
                            <span className="font-mono text-[11px] font-extrabold tracking-widest text-[#FF5A36] uppercase">
                              RIGHT NOW &middot; 45 MIN IN
                            </span>
                            <div className="font-mono text-[13px] text-ink-400 font-semibold mt-1">SE131 &middot; Slot 2</div>
                            <h2 className="text-[28px] font-extrabold text-white leading-none tracking-tight">Data Structure</h2>
                            <div className="font-mono text-[13px] text-white/70 font-medium">SWE-M &middot; 42 students &middot; Room 1504</div>
                          </>
                        )}

                        {heroState === 'ATTENDANCE_SAVED' && (
                          <>
                            <span className="font-mono text-[11px] font-extrabold tracking-widest text-[#19A974] uppercase">
                              ATTENDANCE SAVED
                            </span>
                            <div className="font-mono text-[13px] text-ink-400 font-semibold mt-1">SE131 &middot; Slot 2</div>
                            <h2 className="text-[28px] font-extrabold text-white leading-none tracking-tight">Data Structure</h2>
                            <div className="font-mono text-[13px] text-white/70 font-medium">SWE-M &middot; 42 students &middot; Room 1504</div>
                          </>
                        )}

                        {heroState === 'CANCELLED' && (
                          <>
                            <span className="font-mono text-[11px] font-extrabold tracking-widest text-[#FFB020] uppercase">
                              CANCELLED &middot; SE131
                            </span>
                            <div className="font-mono text-[13px] text-ink-400 font-semibold mt-1">Class cancelled &middot; 42 students notified</div>
                            <h2 className="text-[28px] font-[#A8A59C] leading-none tracking-tight line-through opacity-50">Data Structure</h2>
                          </>
                        )}

                        {heroState === 'DONE' && (
                          <>
                            <span className="font-mono text-[11px] font-extrabold tracking-widest text-ink-400 uppercase">
                              DONE FOR TODAY
                            </span>
                            <h2 className="text-[28px] font-extrabold text-white leading-none tracking-tight mt-1">Enjoy your evening.</h2>
                          </>
                        )}
                      </div>

                      {/* State Actions CTA Row */}
                      {(heroState === 'RIGHT_NOW' || heroState === 'ATTENDANCE_SAVED') && (
                        <div className="flex items-center gap-[12px] pt-[20px] relative z-10 select-none">
                          <motion.button
                            whileTap={{ scale: 0.97, opacity: 0.85 }}
                            onClick={() => {
                              if (heroState === 'RIGHT_NOW') {
                                const target = classes.find(c => c.slotType === 'NOW');
                                if (target) openAttendanceSheet(target);
                              }
                            }}
                            disabled={heroState === 'ATTENDANCE_SAVED'}
                            className={`text-xs font-bold font-sans py-[11px] px-[18px] rounded-full text-white border-none ${
                              heroState === 'ATTENDANCE_SAVED' 
                                ? 'bg-white/10 opacity-40 cursor-not-allowed' 
                                : 'bg-[#FF5A36] shadow-coral-glow cursor-pointer'
                            }`}
                          >
                            {heroState === 'ATTENDANCE_SAVED' ? 'Attendance saved' : 'Take attendance'}
                          </motion.button>

                          {heroState === 'RIGHT_NOW' && (
                            <motion.button
                              whileTap={{ scale: 0.97, opacity: 0.85 }}
                              onClick={() => {
                                const target = classes.find(c => c.id === '2');
                                if (target) {
                                  setSheetTargetClass(target);
                                  setActiveSheet('cancel_class');
                                }
                              }}
                              className="bg-white/10 text-xs font-bold font-sans py-[11px] px-[18px] rounded-full text-white cursor-pointer border-none"
                            >
                              Cancel class
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* TODAY CLASS SCHEDULER SEGMENT */}
                    <div className="space-y-3 select-none text-left">
                      <div className="text-[11px] font-extrabold tracking-[0.06em] text-ink-500 uppercase font-mono mt-4 mb-2">
                        TODAY'S CLASSES
                      </div>
                      
                      {classes.map((cls) => {
                        const isNow = cls.slotType === 'NOW';
                        const isPast = cls.slotType === 'PAST';
                        return (
                          <div
                            key={cls.id}
                            id={`class-row-card-${cls.id}`}
                            onClick={() => triggerToast(`Open &middot; ${cls.code} &middot; ${cls.section}`)}
                            className={`bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 flex items-stretch cursor-pointer select-none relative h-[94px] overflow-visible active:scale-[0.99] duration-120`}
                          >
                            {/* LEFT TIME BANNER */}
                            <div className={`w-[74px] shrink-0 flex flex-col items-center justify-center text-center font-mono rounded-l-[14px] ${
                              isNow && !cls.cancelled 
                                ? 'bg-[#FFF4F0] text-[#FF5A36]' 
                                : 'bg-[#FAFAF9] text-ink-600'
                            } ${isPast ? 'opacity-60' : ''}`}>
                              <span className="text-[14px] font-bold tabular-nums">{cls.timeStart.split(' ')[0]}</span>
                              <span className={`w-[1px] h-[12px] my-1 ${isNow && !cls.cancelled ? 'bg-[#FFD9CD]' : 'bg-[#E8E7E3]'}`} />
                              <span className="text-[10px] opacity-70 tabular-nums">{cls.timeEnd}</span>
                            </div>

                            {/* MIDDLE METADATA AND CHIP DESIGNS */}
                            <div className="flex-1 min-w-0 p-[12px] flex flex-col justify-center">
                              <div className="flex items-center gap-1 font-mono text-[10px] text-[#2F2E2A] font-bold">
                                <span>{cls.code}</span>
                                <span>&middot;</span>
                                <span className="text-ink-900">{cls.section}</span>
                              </div>
                              
                              <h4 className={`text-[14px] font-extrabold text-ink-900 leading-snug tracking-tight mt-[2px] truncate ${cls.cancelled ? 'line-through opacity-40' : ''}`}>
                                {cls.name}
                              </h4>

                              <div className="flex items-center gap-[6px] mt-1.5 flex-wrap">
                                <span className="text-[10.5px] font-sans font-medium text-ink-500 shrink-0">Room {cls.room.replace('Room ', '')}</span>
                                {cls.cancelled ? (
                                  <span className="bg-[#FFF1F2] text-[#E5484D] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1px] tracking-wide shrink-0">
                                    Cancelled
                                  </span>
                                ) : cls.attendedCount !== undefined ? (
                                  <span className="bg-[#E5F7EE] text-[#0F6B43] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1px] tracking-wide inline-flex items-center gap-0.5 shrink-0">
                                    <Check size={10} strokeWidth={2.5} /> Attended &middot; {cls.attendedCount}/42
                                  </span>
                                ) : isNow ? (
                                  <span className="bg-[#FFF4F0] text-[#FF5A36] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1px] tracking-wide shrink-0">
                                    In session
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            {/* ISOLATED KEBAB ACTION CONTAINER */}
                            <div className="p-2 shrink-0 flex items-center justify-center relative select-none">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setKebabOpenId(kebabOpenId === cls.id ? null : cls.id);
                                }}
                                className="w-[36px] h-[36px] hover:bg-ink-100 rounded-full flex items-center justify-center text-ink-500 hover:text-ink-900 border-none bg-transparent cursor-pointer"
                              >
                                <MoreVertical size={18} />
                              </button>

                              {/* KEBAB DROPDOWN DIALOG */}
                              {kebabOpenId === cls.id && (
                                <div className="absolute right-4 top-12 bg-white rounded-[10px] border border-[#ECEAE5] shadow-3 z-30 min-w-[180px] py-1 select-none font-sans text-left">
                                  {!cls.cancelled ? (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openAttendanceSheet(cls, !!cls.attendedCount);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent select-none cursor-pointer"
                                      >
                                        <ClipboardCheck size={14} className="text-[#FF5A36]" />
                                        <span>{cls.attendedCount !== undefined ? 'Update attendance' : 'Take attendance'}</span>
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSheetTargetClass(cls);
                                          setActiveSheet('cancel_class');
                                          setKebabOpenId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[#E5484D] font-semibold text-xs hover:bg-[#FFF1F2] border-none bg-transparent select-none cursor-pointer"
                                      >
                                        <Ban size={14} />
                                        <span>Cancel class</span>
                                      </button>
                                    </>
                                  ) : null}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCoursePreselectionCode(cls.code);
                                      setActiveTab('COURSES');
                                      setKebabOpenId(null);
                                      triggerToast(`Viewing course: ${cls.code}`);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent select-none cursor-pointer"
                                  >
                                    <BookOpen size={14} className="text-ink-600" />
                                    <span>View course</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerToast(`Edit slot &middot; ${cls.code} &middot; Slot ${cls.id}`);
                                      setKebabOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent select-none cursor-pointer"
                                  >
                                    <PenLine size={14} className="text-ink-600" />
                                    <span>Edit slot</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* QUICK ACTIONS GRID */}
                    <div className="text-left font-sans">
                      <div className="text-[11px] font-extrabold tracking-[0.06em] text-ink-500 uppercase font-mono mt-4 mb-2">
                        QUICK ACTIONS
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        
                        {/* Q1: ATTENDANCE */}
                        <div
                          onClick={() => setActiveSubScreen('attendance_list')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-2.5 cursor-pointer relative active:scale-[0.97] opacity-100 transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#FFE7DF] text-[#FF5A36] rounded-[10px] flex items-center justify-center">
                            <ClipboardCheck size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Attendance</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Mark today's classes</p>
                          </div>
                          {heroState === 'RIGHT_NOW' && (
                            <span className="absolute top-2.5 right-2.5 bg-[#FF5A36] text-white text-[10px] font-bold font-mono h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                              1
                            </span>
                          )}
                        </div>

                        {/* Q2: ANNOUNCE */}
                        <div
                          onClick={() => setActiveSubScreen('announce')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-2.5 cursor-pointer active:scale-[0.97] transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#FFE7DF] text-[#FF5A36] rounded-[10px] flex items-center justify-center">
                            <Megaphone size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Announce</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Push to your sections</p>
                          </div>
                        </div>

                        {/* Q3: QUIZZES */}
                        <div
                          onClick={() => setActiveSubScreen('quizzes')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-2.5 cursor-pointer relative active:scale-[0.97] transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#FFF1D6] text-[#7A4A00] rounded-[10px] flex items-center justify-center">
                            <FileCheck size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Quizzes</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Schedule &middot; grade</p>
                          </div>
                          <span className="absolute top-2.5 right-2.5 bg-[#FFB020] text-[#7A4A00] text-[10px] font-bold font-mono h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                            2
                          </span>
                        </div>

                        {/* Q4: ASSIGNMENTS */}
                        <div
                          onClick={() => setActiveSubScreen('assignments')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-2.5 cursor-pointer relative active:scale-[0.97] transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#FFF1D6] text-[#7A4A00] rounded-[10px] flex items-center justify-center">
                            <BookOpen size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Assignments</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Review submissions</p>
                          </div>
                          <span className="absolute top-2.5 right-2.5 bg-[#FFB020] text-[#7A4A00] text-[10px] font-bold font-mono h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                            5
                          </span>
                        </div>

                        {/* Q5: OFFICE HOURS */}
                        <div
                          onClick={() => setActiveSubScreen('office')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-2.5 cursor-pointer active:scale-[0.97] transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#F4F4F2] text-ink-700 rounded-[10px] flex items-center justify-center">
                            <Clock size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Office hours</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Sun–Wed 2–4 pm</p>
                          </div>
                        </div>

                        {/* Q6: MATERIALS */}
                        <div
                          onClick={() => setActiveSubScreen('materials')}
                          className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex flex-col gap-[10px] cursor-pointer active:scale-[0.97] transition-all duration-120"
                        >
                          <div className="w-[40px] h-[40px] bg-[#F4F4F2] text-ink-700 rounded-[10px] flex items-center justify-center">
                            <Presentation size={22} />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-ink-900">Materials</h4>
                            <p className="text-[11px] text-ink-500 font-medium -mt-[2px]">Slides &middot; notes &middot; refs</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'ROUTINE' && (
                  <FacultyRoutineTab
                    classes={classes}
                    onTriggerToast={triggerToast}
                    onOpenAttendance={(slot, isUpdate) => openAttendanceSheet(slot, isUpdate)}
                    onOpenCancel={(slot) => {
                      setSheetTargetClass(slot);
                      setActiveSheet('cancel_class');
                    }}
                    onNavigateToCourse={(courseCode) => {
                      setCoursePreselectionCode(courseCode);
                      setActiveTab('COURSES');
                    }}
                  />
                )}

                {activeTab === 'COURSES' && (
                  <FacultyCoursesTab
                    onTriggerToast={triggerToast}
                    onNavigateToSectionRoster={(sectName) => {
                      setRosterPreselectionSect(sectName);
                      setActiveTab('ROSTER');
                    }}
                    preselectedCourse={coursePreselectionCode}
                    onClearedPreselectedCourse={() => setCoursePreselectionCode(null)}
                  />
                )}

                {activeTab === 'ROSTER' && (
                  <FacultyRosterTab
                    onTriggerToast={triggerToast}
                    overrideSelectedSection={rosterPreselectionSect}
                    onClearOverrideSection={() => setRosterPreselectionSect(null)}
                  />
                )}

                {activeTab === 'ME' && (
                  <FacultyMeTab
                    onTriggerToast={triggerToast}
                    onNavigateToSubScreen={(subName) => {
                      setActiveSubScreen(subName);
                    }}
                    onSignOut={() => {
                      triggerToast('Session cleared &middot; Academic selection');
                      onChangeContext();
                    }}
                  />
                )}
              </motion.div>
            ) : (
              /* DETAILED PUSHED SUBSCREENS */
              <motion.div
                key={`screen-${activeSubScreen}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.18 }}
                className="p-[20px] pt-[24px] space-y-4 select-none font-sans"
              >
                {/* SUBSCREEN COMMON HEADER */}
                <div className="flex items-start justify-between pb-2 border-b border-[#ECEAE5]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveSubScreen(null)}
                      className="w-9 h-9 hover:bg-ink-100 rounded-full flex items-center justify-center text-ink-900 -ml-2 cursor-pointer border-none bg-transparent"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <div>
                      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink-900">
                        {activeSubScreen === 'attendance_list' ? 'Attendance' :
                         activeSubScreen === 'announce' ? 'Announce' :
                         activeSubScreen === 'quizzes' ? 'Quizzes' :
                         activeSubScreen === 'assignments' ? 'Assignments' :
                         activeSubScreen === 'office' ? 'Office hours' :
                         activeSubScreen === 'materials' ? 'Materials' : 'Notifications'}
                      </h1>
                      <p className="text-[11px] font-mono text-ink-500 font-semibold leading-none pt-0.5 mt-1">
                        {activeSubScreen === 'attendance_list' && `Wed 10 Jun &middot; ${classes.filter(c => c.attendedCount !== undefined).length}/2 marked`}
                        {activeSubScreen === 'announce' && 'Push to your sections'}
                        {activeSubScreen === 'quizzes' && 'SWE-M &middot; Data Structure'}
                        {activeSubScreen === 'assignments' && 'SWE-M &middot; 45 ungraded submissions'}
                        {activeSubScreen === 'office' && 'Dr. NSL &middot; SWE'}
                        {activeSubScreen === 'materials' && 'Slides &middot; notes &middot; references'}
                        {activeSubScreen === 'notifications' && `${unreadCount} unread`}
                      </p>
                    </div>
                  </div>

                  {/* Header Sub-Screen Secondary CTAs */}
                  {activeSubScreen === 'quizzes' && (
                    <button onClick={() => setActiveSheet('new_quiz')} className="bg-[#FF5A36] text-white text-[11px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow border-none cursor-pointer">+ Schedule</button>
                  )}
                  {activeSubScreen === 'assignments' && (
                    <button onClick={() => setActiveSheet('new_assignment')} className="bg-[#FF5A36] text-white text-[11px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow border-none cursor-pointer">+ New</button>
                  )}
                  {activeSubScreen === 'office' && (
                    <button onClick={() => setActiveSheet('add_office')} className="bg-[#FF5A36] text-white text-[11px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow border-none cursor-pointer">+ Add</button>
                  )}
                  {activeSubScreen === 'materials' && (
                    <button onClick={() => setActiveSheet('upload_material')} className="bg-[#FF5A36] text-white text-[11px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow border-none cursor-pointer">↑ Upload</button>
                  )}
                  {activeSubScreen === 'notifications' && unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[#FF5A36] text-[12px] font-extrabold hover:underline py-1 px-2 border-none bg-transparent cursor-pointer">Mark all read</button>
                  )}
                </div>

                {/* S1: ATTENDANCE TRACKER SUB-SCREEN */}
                {activeSubScreen === 'attendance_list' && (
                  <div className="space-y-4">
                    {/* Caught up banners */}
                    {classes.some(c => c.slotType === 'NOW' && c.attendedCount === undefined && !c.cancelled) ? (
                      <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-[14px] p-4 flex gap-3 shadow-1">
                        <div className="w-[40px] h-[40px] bg-[#FFE7DF] rounded-[10px] flex items-center justify-center shrink-0">
                          <ClipboardCheck size={22} className="text-[#FF5A36]" />
                        </div>
                        <div className="font-sans">
                          <h4 className="text-xs font-bold text-ink-900">1 class still to mark</h4>
                          <p className="text-[11px] text-ink-700 leading-normal mt-0.5">Tap a class below to take attendance.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#E5F7EE] border border-[#C2EAD5] rounded-[14px] p-4 flex gap-3 shadow-1">
                        <div className="w-[40px] h-[40px] bg-[#C2EAD5] rounded-[10px] flex items-center justify-center shrink-0">
                          <CheckCheck size={22} className="text-[#0F6B43]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-ink-900">All caught up</h4>
                          <p className="text-[11px] text-ink-700 leading-normal mt-0.5">Today's attendance is fully captured.</p>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono mt-4">
                      TODAY'S CLASSES
                    </div>

                    <div className="space-y-3">
                      {classes.map((cls) => {
                        const isPast = cls.slotType === 'PAST';
                        const isNow = cls.slotType === 'NOW';
                        const isUpcoming = cls.slotType === 'UPCOMING';
                        return (
                          <div key={cls.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex items-center gap-3">
                            <div className="text-left font-mono shrink-0">
                              <span className="block text-xs font-bold text-ink-900">{cls.timeStart.split(' ')[0]}</span>
                              <span className="block text-[10px] text-ink-500 mt-0.5">{cls.timeEnd.split(' ')[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block font-mono text-[10px] text-ink-500">{cls.code} &middot; {cls.section}</span>
                              <h4 className="text-xs font-bold text-ink-900 truncate mt-[2px]">{cls.name}</h4>
                            </div>
                            <div>
                              {cls.cancelled ? (
                                <span className="text-[10px] font-mono text-[#E5484D] uppercase font-bold bg-[#FCE8E9] px-2 py-1 rounded-full">Cancelled</span>
                              ) : cls.attendedCount !== undefined ? (
                                <button
                                  onClick={() => openAttendanceSheet(cls, true)}
                                  className="bg-white border border-[#E0DED8] text-ink-900 font-mono text-[11px] font-semibold py-1.5 px-3 rounded-full flex items-center gap-1 active:scale-95 duration-120 cursor-pointer"
                                >
                                  <Check size={12} className="text-[#19A974]" /> {cls.attendedCount}/42
                                </button>
                              ) : isNow ? (
                                <button
                                  onClick={() => openAttendanceSheet(cls, false)}
                                  className="bg-[#FF5A36] text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full shadow-coral-glow inline-flex items-center gap-1 active:scale-95 duration-120 cursor-pointer border-none"
                                >
                                  <ClipboardCheck size={12} /> Mark
                                </button>
                              ) : (
                                <span className="font-mono text-[10px] tracking-wider text-ink-400 font-bold uppercase">Upcoming</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* S2: ANNOUNCING SURFACE SUB-SCREEN */}
                {activeSubScreen === 'announce' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-4.5 space-y-4">
                      
                      {/* Targets */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-ink-900">Send to</h4>
                        <div className="flex gap-2">
                          {['SWE-M &middot; 42', 'SWE-N &middot; 38', 'SWE-A &middot; 41'].map((sectRaw) => {
                            const sc = sectRaw.split(' ')[0];
                            const isActive = annSelectedSections.includes(sc);
                            return (
                              <button
                                key={sc}
                                onClick={() => {
                                  if (isActive) {
                                    setAnnSelectedSections(annSelectedSections.filter(x => x !== sc));
                                  } else {
                                    setAnnSelectedSections([...annSelectedSections, sc]);
                                  }
                                }}
                                className={`py-1.5 px-3 text-xs font-medium rounded-full cursor-pointer transition-all border outline-none ${
                                  isActive 
                                    ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-bold inline-flex items-center gap-1' 
                                    : 'bg-white border-[#E0DED8] text-ink-900'
                                }`}
                              >
                                {isActive && <Check size={12} />}
                                <span dangerouslySetInnerHTML={{ __html: sectRaw }} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Msg TArea */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-ink-900">Message</h4>
                        <textarea
                          rows={3}
                          value={annPhrase}
                          onChange={(e) => setAnnPhrase(e.target.value.slice(0, 280))}
                          placeholder="What do your students need to know?"
                          className="w-full bg-white border border-[#E0DED8] rounded-[12px] p-3 text-xs font-semibold text-ink-900 placeholder:text-ink-400 outline-none focus:border-[#FF5A36]"
                        />

                        {/* Templates fills */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {["Class cancelled today", "Quiz reminder", "Room change", "Bring lab manual"].map(tpl => (
                            <button
                              key={tpl}
                              onClick={() => setAnnPhrase(tpl)}
                              className="bg-white border border-[#E0DED8] text-ink-900 text-[10.5px] font-medium py-1 px-2 rounded-full cursor-pointer hover:border-ink-400"
                            >
                              {tpl}
                            </button>
                          ))}
                        </div>

                        {/* Character count */}
                        <div className="text-right">
                          <span className={`font-mono text-[11px] font-bold ${
                            annPhrase.length >= 260 ? 'text-[#E5484D]' : annPhrase.length >= 220 ? 'text-[#FFB020]' : 'text-ink-400'
                          }`}>
                            {annPhrase.length}/280
                          </span>
                        </div>
                      </div>

                      {/* Push Notification Switch */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#ECEAE5]">
                        <div className="flex items-center gap-1.5">
                          <Bell size={16} className="text-ink-700" />
                          <span className="text-xs font-semibold text-ink-900">Send push notification</span>
                        </div>
                        <button
                          onClick={() => setAnnPushNotify(!annPushNotify)}
                          className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors relative cursor-pointer outline-none border-none ${
                            annPushNotify ? 'bg-[#FF5A36]' : 'bg-[#E8E7E3]'
                          }`}
                        >
                          <span className={`block w-[18px] h-[18px] bg-white rounded-full transition-transform duration-150 ${
                            annPushNotify ? 'translate-x-[18px]' : 'translate-x-[0px]'
                          }`} />
                        </button>
                      </div>

                      {/* Dispatch Action */}
                      <button
                        onClick={handleAnnounceSend}
                        disabled={annPhrase.trim().length === 0 || annSelectedSections.length === 0}
                        className={`w-full py-2.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-1.5 border-none ${
                          annPhrase.trim().length > 0 && annSelectedSections.length > 0
                            ? 'bg-[#FF5A36] shadow-coral-glow cursor-pointer'
                            : 'bg-coral-100 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <Volume2 size={13} />
                        <span>Send to {annSelectedSections.reduce((acc, c) => acc + (c === 'SWE-M' ? 42 : c === 'SWE-N' ? 38 : 41), 0)} students</span>
                      </button>

                    </div>

                    <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono mt-4">
                      RECENT ANNOUNCEMENTS
                    </div>

                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <div className="flex gap-1.5">
                              {ann.sections.map((s: string) => (
                                <span key={s} className="bg-[#F4F4F2] text-ink-700 font-bold px-1.5 py-0.5 rounded">{s}</span>
                              ))}
                            </div>
                            <span className="text-ink-500 font-medium">{ann.timestamp}</span>
                          </div>
                          <p className="text-xs text-ink-900 font-medium leading-relaxed">{ann.text}</p>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-ink-500">
                            <Users size={12} />
                            <span>Reached {ann.reach} students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* S3: QUIZZES SUB-SCREEN */}
                {activeSubScreen === 'quizzes' && (
                  <QuizSubScreenComponent quizzes={quizzes} onPublish={(id, code) => {
                    setQuizzes(prev => prev.map(q => {
                      if (q.id === id) return { ...q, status: 'Graded', gradedCount: 42 };
                      return q;
                    }));
                    triggerToast(`Grades published &middot; ${code}`);
                  }} />
                )}

                {/* S4: ASSIGNMENTS SUB-SCREEN */}
                {activeSubScreen === 'assignments' && (
                  <div className="space-y-3">
                    {assignments.map((as) => (
                      <div key={as.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 space-y-2 select-none">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10.5px] text-ink-900 bg-ink-100 px-1.5 py-0.5 rounded font-bold">{as.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase ${
                            as.status === 'Open' ? 'bg-[#FFF4F0] text-[#FF5A36]' : 'bg-[#E8E7E3] text-ink-700'
                          }`}>
                            {as.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-ink-900 leading-snug">{as.title}</h4>
                        <div className="font-mono text-[11px] text-ink-500 font-semibold">{as.due}</div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-ink-500">
                            <span>Submission scale</span>
                            <span>{as.submitted}/42</span>
                          </div>
                          <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div className="bg-[#FF5A36] h-full" style={{ width: `${(as.submitted / 42) * 100}%` }} />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5] shrink-0">
                          <span className={`text-[11px] font-medium ${as.toGrade > 0 ? 'text-[#8A5A00] font-semibold' : 'text-ink-500'}`}>
                            {as.toGrade > 0 ? `${as.toGrade} to grade` : 'All graded'}
                          </span>
                          <button
                            onClick={() => triggerToast(`${as.submitted} submissions &middot; ${as.code}`)}
                            className="bg-white border border-[#E0DED8] text-ink-900 text-[11px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 active:scale-95 duration-120 cursor-pointer"
                          >
                            <FileText size={11} /> Review submissions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* S5: OFFICE HOURS MASTER SCREEN */}
                {activeSubScreen === 'office' && (
                  <div className="space-y-4">
                    <div className="bg-[#E5EFFE] text-[#1B4B9E] rounded-[14px] p-[14px] flex gap-2 shadow-1">
                      <Users size={18} className="shrink-0 text-info-fg mt-0.5" />
                      <div className="text-xs font-medium leading-relaxed">
                        Students see these on your profile and can book a slot.
                      </div>
                    </div>

                    <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono mt-4">
                      WEEKLY SLOTS
                    </div>

                    <div className="space-y-3">
                      {officeHours.length === 0 ? (
                        <p className="text-xs text-ink-400 font-medium italic text-center py-4">No active weekly slots defined.</p>
                      ) : (
                        officeHours.map((slot) => (
                          <div key={slot.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex gap-3 items-start select-none">
                            <div className="w-[40px] h-[40px] bg-ink-100 text-ink-700 rounded-[10px] flex items-center justify-center shrink-0">
                              <Clock size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-extrabold text-ink-900">{slot.time}</h4>
                              
                              {/* Display days */}
                              <div className="flex gap-1.5 flex-wrap mt-1.5 select-none">
                                {slot.days.map((d: string) => (
                                  <span key={d} className="bg-[#F4F4F2] text-ink-700 font-mono text-[9px] font-extrabold px-[6px] py-[2px] rounded">
                                    {d}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-500 mt-2">
                                {slot.online ? (
                                  <>
                                    <Link size={12} className="text-[#2E7CF6]" />
                                    <span>Google Meet</span>
                                  </>
                                ) : (
                                  <>
                                    <MapPin size={12} className="text-[#FF5A36]" />
                                    <span>{slot.room}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setOfficeHours(prev => prev.filter(x => x.id !== slot.id));
                                triggerToast('Slot removed');
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-[#E44A4D] hover:bg-ink-100 border-none bg-transparent cursor-pointer shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* S6: SHARING MATERIALS SUB-SCREEN */}
                {activeSubScreen === 'materials' && (
                  <div className="space-y-4">
                    {/* Course codes in system */}
                    {['SE131', 'SE132'].map((courseCode) => {
                      const files = materials.filter(m => m.code === courseCode);
                      return (
                        <div key={courseCode} className="space-y-2">
                          <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono">
                            {courseCode} &middot; {files.length} FILES
                          </div>
                          
                          {files.map((file) => (
                            <div
                              key={file.id}
                              onClick={() => triggerToast(`Open &middot; ${file.title}`)}
                              className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3 flex items-center gap-3 cursor-pointer select-none active:scale-[0.99] duration-120"
                            >
                              <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${
                                file.type === 'Slides' ? 'bg-[#FFE7DF] text-[#FF5A36]' :
                                file.type === 'Notes' ? 'bg-[#FFF1D6] text-[#7A4A00]' : 'bg-[#E5EFFE] text-[#1B4B9E]'
                              }`}>
                                {file.type === 'Slides' && <Presentation size={20} />}
                                {file.type === 'Notes' && <FileText size={20} />}
                                {file.type === 'Reference' && <Link2 size={20} />}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h4 className="text-[12.5px] font-bold text-ink-900 truncate">{file.title}</h4>
                                <p className="text-[11px] font-mono text-ink-500 font-medium leading-none pt-0.5 mt-[2px]">
                                  {file.type} &middot; {file.size} &middot; {file.date}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMaterials(prev => prev.filter(x => x.id !== file.id));
                                  triggerToast('Material removed');
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-[#E44A4D] hover:bg-ink-100 shrink-0 border-none bg-transparent cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* S7: NOTIFICATIONS INBOX SCREEN */}
                {activeSubScreen === 'notifications' && (
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-8 text-center text-ink-400 flex flex-col items-center justify-center gap-3">
                        <BellOff size={28} className="text-ink-400" />
                        <span className="text-[14px] font-medium font-sans">No notifications</span>
                      </div>
                    ) : (
                      <>
                        {/* TODAY */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono">TODAY</div>
                          {notifications.filter(n => n.time && (n.time.includes('am') || n.time.includes('ago') || n.time.includes('h ago'))).map((notif) => {
                            const isReminder = notif.kind === 'reminder';
                            return (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  // mark read
                                  setNotifications(prev => prev.map(x => x.id === notif.id ? { ...x, unread: false } : x));
                                  if (isReminder) {
                                    const target = classes.find(c => c.id === '2');
                                    if (target) {
                                      if (target.attendedCount !== undefined) {
                                        triggerToast('Attendance already marked');
                                      } else if (target.cancelled) {
                                        triggerToast('Class was cancelled');
                                      } else {
                                        setActiveSubScreen(null);
                                        openAttendanceSheet(target);
                                      }
                                    }
                                  } else {
                                    triggerToast(`Open ${notif.title}`);
                                  }
                                }}
                                className={`rounded-[14px] border p-3 flex gap-2.5 transition-all duration-120 items-start cursor-pointer select-none active:scale-[0.99] ${
                                  notif.unread 
                                    ? 'bg-[#FFF4F0] border-[#FFE7DF] shadow-1' 
                                    : 'bg-white border-[#ECEAE5]'
                                }`}
                              >
                                <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${
                                  notif.kind === 'reminder' || notif.kind === 'grade' ? 'bg-[#FFF1D6] text-[#7A4A00]' :
                                  notif.kind === 'submission' ? 'bg-[#FFE7DF] text-[#FF5A36]' :
                                  notif.kind === 'system' ? 'bg-[#E5EFFE] text-[#1B4B9E]' : 'bg-ink-100 text-ink-700'
                                }`}>
                                  {notif.kind === 'reminder' && <Clock size={20} />}
                                  {notif.kind === 'submission' && <FileText size={20} />}
                                  {notif.kind === 'question' && <MessageCircle size={20} />}
                                  {notif.kind === 'grade' && <Star size={20} />}
                                  {notif.kind === 'system' && <Calendar size={20} />}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <h4 className="text-[13px] font-bold text-ink-900 leading-snug">{notif.title}</h4>
                                  <p className="text-[11.5px] text-ink-600 leading-relaxed mt-0.5">{notif.body}</p>
                                  {notif.unread && isReminder && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifications(prev => prev.map(x => x.id === notif.id ? { ...x, unread: false, hasAction: false } : x));
                                        const target = classes.find(c => c.id === '2');
                                        if (target) {
                                          if (target.attendedCount !== undefined) {
                                            triggerToast('Attendance already marked');
                                          } else if (target.cancelled) {
                                            triggerToast('Class was cancelled');
                                          } else {
                                            setActiveSubScreen(null);
                                            openAttendanceSheet(target);
                                          }
                                        }
                                      }}
                                      className="mt-2 text-xs font-bold py-[6px] px-3 rounded-full text-white bg-[#FF5A36] select-none shadow-coral-glow inline-flex items-center gap-1 border-none cursor-pointer"
                                    >
                                      <ClipboardCheck size={11} /> Take attendance
                                    </button>
                                  )}
                                </div>
                                <div className="text-right shrink-0 flex flex-col justify-between items-end h-[42px] select-none">
                                  <span className="font-mono text-[10px] text-ink-500 font-semibold">{notif.time}</span>
                                  {notif.unread && (
                                    <span className="w-2 h-2 bg-[#FF5A36] rounded-full border-2 border-[#FAFAF9]" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* EARLIER */}
                        <div className="space-y-2 select-none">
                          <div className="text-[11px] font-extrabold tracking-wider text-ink-500 uppercase font-mono">EARLIER</div>
                          {notifications.filter(n => !n.time || (!n.time.includes('am') && !n.time.includes('ago') && !n.time.includes('h ago'))).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => triggerToast(`Open ${notif.title}`)}
                              className="rounded-[14px] border bg-white border-[#ECEAE5] p-3 flex gap-2.5 transition-all duration-120 items-start cursor-pointer h-[78px] active:scale-[0.99]"
                            >
                              <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${
                                notif.kind === 'grade' ? 'bg-[#FFF1D6] text-[#7A4A00]' :
                                notif.kind === 'system' ? 'bg-[#E5EFFE] text-[#1B4B9E]' : 'bg-ink-100 text-ink-700'
                              }`}>
                                {notif.kind === 'grade' && <Star size={20} />}
                                {notif.kind === 'system' && <Calendar size={20} />}
                              </div>
                              <div className="flex-1 min-w-0 text-left flex flex-col justify-center h-10 select-none">
                                <h4 className="text-[12.5px] font-bold text-ink-900 leading-tight">{notif.title}</h4>
                                <p className="text-[11px] text-ink-600 truncate mt-[2px]">{notif.body}</p>
                              </div>
                              <span className="font-mono text-[10px] text-ink-500 shrink-0 font-medium">{notif.time}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* FACULTY FIXED BOTTOM NAV AT ALL TIMES */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/92 backdrop-blur-[24px] border-t border-[#ECEAE5] flex items-center justify-around z-40 select-none px-2 pb-safe shadow-sm"
        >
          {[
            { tag: 'TODAY', label: 'TODAY', icon: <Home size={18} /> },
            { tag: 'ROUTINE', label: 'ROUTINE', icon: <CalendarDays size={18} /> },
            { tag: 'COURSES', label: 'COURSES', icon: <BookOpen size={18} /> },
            { tag: 'ROSTER', label: 'ROSTER', icon: <Users size={18} /> },
            { tag: 'ME', label: 'ME', icon: <User size={18} /> }
          ].map(tab => {
            const isTodayTabActive = tab.tag === 'TODAY' && !activeSubScreen && activeTab === 'TODAY';
            const isActive = activeTab === tab.tag;
            return (
              <button
                key={tab.tag}
                onClick={() => {
                  setActiveTab(tab.tag as any);
                  if (tab.tag === 'TODAY') {
                    setActiveSubScreen(null);
                  } else {
                    setActiveSubScreen(null);
                    triggerToast(`Switched to tab: ${tab.label}`);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer outline-none border-none bg-transparent ${
                  isActive ? 'text-[#FF5A36]' : 'text-ink-600'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-extrabold tracking-tight font-sans">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* BOTTOM SHEETS FOR FULL USER MECHANICS (Scrim-wrapped portals) */}
        <AnimatePresence>
          {activeSheet && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end select-none font-sans overflow-hidden">
              {/* Dark Ambient Scrim Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
                onClick={() => {
                  if (activeSheet === 'attendance') {
                    triggerToast('Draft discarded · Undo');
                  }
                  setActiveSheet(null);
                }}
              />

              {/* RISING PORTAL WINDOW */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.28, cubicBezier: [0.34, 1.56, 0.64, 1] }}
                className={`relative w-full max-w-lg mx-auto bg-white rounded-t-[28px] shadow-4 flex flex-col z-10 select-none text-left overflow-hidden ${
                  activeSheet === 'attendance' ? 'h-[90%] max-h-[90%]' : 'max-h-[500px]'
                }`}
              >
                {/* Grab controller bar */}
                <div className="w-[40px] h-[4px] bg-[#D4D2CC] rounded-full mx-auto mt-2.5 shrink-0 pointer-events-none" />

                {/* S-ATTENDANCE SHEET LAYOUTS */}
                {activeSheet === 'attendance' && sheetTargetClass && (
                  <div className="flex flex-col flex-1 overflow-hidden select-none">
                    <div className="flex items-start justify-between px-5 pt-3 shrink-0">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">
                          Attendance &middot; {sheetTargetClass.code}
                        </h2>
                        <p className="text-[11.5px] font-mono text-ink-500 font-semibold mt-1.5 selection:bg-transparent">
                          {sheetTargetClass.section} &middot; 42 students &middot; Wed 10 Jun
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          triggerToast('Draft discarded · Undo');
                          setActiveSheet(null);
                        }}
                        className="w-8 h-8 rounded-full bg-[#FAFAF9] hover:bg-ink-100 flex items-center justify-center text-ink-900 select-none border-none cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* LIVE UPDATE STATS COMPILER BLOCK */}
                    <div className="px-5 mt-4 shrink-0 selection:bg-transparent selection:text-inherit">
                      {/* STAT STRIP */}
                      <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-[14px] p-3 flex justify-evenly select-none">
                        {[
                          { label: 'PRESENT', count: MASTER_ROSTER.filter(s => attendanceMarks[s.id] === 'P' || !attendanceMarks[s.id]).length, color: 'text-[#0F6B43]' },
                          { label: 'ABSENT', count: Object.values(attendanceMarks).filter(m => m === 'A').length, color: 'text-[#E5484D]' },
                          { label: 'LATE', count: Object.values(attendanceMarks).filter(m => m === 'L').length, color: 'text-[#8A5A00]' }
                        ].map((st, i) => (
                          <React.Fragment key={st.label}>
                            <div className="text-center">
                              <span className={`block font-mono text-[22px] font-extrabold ${st.color} leading-none`}>{st.count}</span>
                              <span className="block text-[11px] font-bold tracking-wider text-ink-500 uppercase mt-1">{st.label}</span>
                            </div>
                            {i < 2 && <span className="w-[1px] h-[32px] bg-[#FFE7DF] align-self-center shrink-0" />}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* BULK ACTIONS */}
                      <div className="flex gap-2.5 mt-3 select-none">
                        <button
                          onClick={() => {
                            const updated = { ...attendanceMarks };
                            MASTER_ROSTER.forEach(s => {
                              if (!updated[s.id]) updated[s.id] = 'P';
                            });
                            setAttendanceMarks(updated);
                          }}
                          className="bg-[#FF5A36] hover:bg-[#E84A28] text-white text-[12px] font-bold py-1.5 px-3.5 rounded-full inline-flex items-center gap-1 active:scale-95 duration-120 cursor-pointer border-none"
                        >
                          <CheckCheck size={13} /> Mark all present
                        </button>
                        <button
                          onClick={() => {
                            const updated = { ...attendanceMarks };
                            MASTER_ROSTER.forEach(s => {
                              if (!updated[s.id]) updated[s.id] = 'A';
                            });
                            setAttendanceMarks(updated);
                          }}
                          className="bg-white border border-[#E0DED8] text-ink-900 text-[12px] font-bold py-1.5 px-3.5 rounded-full active:scale-95 duration-120 cursor-pointer"
                        >
                          Mark all absent
                        </button>
                      </div>
                    </div>

                    {/* ROSTER CONTAINER */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 select-none font-sans bg-canvas mt-4">
                      {MASTER_ROSTER.map((std) => {
                        const mark = attendanceMarks[std.id] || 'P'; // implicitly present initially until marked absent/late
                        return (
                          <div key={std.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3 flex items-center justify-between select-none p-3.5">
                            {/* Avatar */}
                            <div className="w-[36px] h-[36px] bg-[#FFE7DF] text-[#FF5A36] rounded-full flex items-center justify-center font-bold font-mono text-[13px] shrink-0">
                              {std.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>

                            {/* Middle Identification */}
                            <div className="flex-1 min-w-0 px-3 flex flex-col justify-center">
                              <div className="flex items-center gap-[6px]">
                                <span className="text-[13px] font-bold text-ink-900 leading-tight">{std.name}</span>
                                {std.isCR && (
                                  <span className="bg-[#FCE8E9] text-[#E5484D] text-[9px] font-sans font-bold uppercase rounded-full px-1.5 tracking-wide leading-none py-0.5">CR</span>
                                )}
                              </div>
                              <span className="font-mono text-[11px] text-ink-500 font-semibold leading-none pt-0.5">{std.id}</span>
                            </div>

                            {/* 3-Way Selector */}
                            <div className="bg-[#F4F4F2] p-[2px] rounded-full flex items-center select-none shadow-inner">
                              {(['P', 'A', 'L'] as const).map((seg) => {
                                const isActive = mark === seg;
                                return (
                                  <button
                                    key={seg}
                                    onClick={() => {
                                      if (isActive) {
                                        // clear toggle
                                        const copy = { ...attendanceMarks };
                                        delete copy[std.id];
                                        setAttendanceMarks(copy);
                                      } else {
                                        setAttendanceMarks({ ...attendanceMarks, [std.id]: seg });
                                      }
                                    }}
                                    className={`w-[34px] h-[28px] rounded-full text-[11px] font-bold flex items-center justify-center cursor-pointer outline-none border-none transition-all ${
                                      isActive 
                                        ? seg === 'P' ? 'bg-[#E5F7EE] text-[#0F6B43] shadow-sm' :
                                          seg === 'A' ? 'bg-[#FCE8E9] text-[#E5484D] shadow-sm' : 'bg-[#FFF4DB] text-[#8A5A00] shadow-sm'
                                        : 'bg-transparent text-ink-400'
                                    }`}
                                  >
                                    {seg}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* STICKY RISING EXECUTOR FOOTER */}
                    <div className="border-t border-[#ECEAE5] py-3.5 px-5 bg-white flex justify-between shrink-0 font-sans">
                      <button
                        onClick={() => {
                          triggerToast('Draft discarded · Undo');
                          setActiveSheet(null);
                        }}
                        className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2 px-4 rounded-full active:scale-95 duration-120 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAttendance}
                        className="bg-[#FF5A36] hover:bg-[#E84A28] text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 shadow-coral-glow border-none cursor-pointer"
                      >
                        <Save size={14} /> Save attendance
                      </button>
                    </div>
                  </div>
                )}

                {/* S-CANCEL CLASS LAYOUT */}
                {activeSheet === 'cancel_class' && sheetTargetClass && (
                  <div className="p-5 space-y-4 select-none font-sans">
                    <div className="flex justify-between items-start select-none">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">
                          Cancel today's {sheetTargetClass.code}?
                        </h2>
                        <p className="text-[11.5px] font-mono text-ink-500 font-semibold mt-1.5">
                          {sheetTargetClass.name} &middot; {sheetTargetClass.section} &middot; {sheetTargetClass.timeStart.split(' ')[0]}–{sheetTargetClass.timeEnd.split(' ')[0]}
                        </p>
                      </div>
                      <button onClick={() => setActiveSheet(null)} className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 cursor-pointer border-none"><X size={18} /></button>
                    </div>

                    <div className="bg-[#FFF4DB] border border-[#FFD9CD]/10 rounded-[14px] p-3 flex gap-2 select-none text-[#8A5A00]">
                      <AlertTriangle size={18} className="shrink-0 mt-0.5 text-warning-fg" />
                      <span className="text-xs font-semibold leading-relaxed">Students will get a push notification immediately.</span>
                    </div>

                    <textarea
                      rows={2}
                      maxLength={120}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Optional reason — e.g. 'unwell' or 'department meeting'"
                      className="w-full bg-white border border-[#E0DED8] rounded-[12px] p-3 text-xs font-bold text-ink-900 placeholder:text-ink-400 focus:border-[#E5484D] outline-none"
                    />

                    <div className="text-[11px] font-mono text-ink-500 font-semibold select-none">42 students will be notified</div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#ECEAE5]">
                      <button onClick={() => setActiveSheet(null)} className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2.5 px-4.5 rounded-full active:scale-95 duration-120 cursor-pointer">Keep class</button>
                      <button
                        onClick={handleCancelClassSubmit}
                        className="bg-[#FCE8E9] text-[#E5484D] text-xs font-extrabold py-2.5 px-5 rounded-full inline-flex items-center gap-1 shadow-sm active:scale-95 duration-120 border-none cursor-pointer"
                      >
                        <Ban size={14} /> Cancel class
                      </button>
                    </div>
                  </div>
                )}

                {/* S-NEW QUIZ FORM */}
                {activeSheet === 'new_quiz' && (
                  <form onSubmit={handleScheduleQuiz} className="p-5 space-y-4 select-none font-sans text-left">
                    <div className="flex justify-between items-start select-none">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">Schedule a quiz</h2>
                        <span className="block text-[11px] font-mono text-ink-500 font-semibold pt-1 mt-1">SWE-M &middot; students notified on publish</span>
                      </div>
                      <button type="button" onClick={() => setActiveSheet(null)} className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 cursor-pointer border-none"><X size={18} /></button>
                    </div>

                    {/* Course select */}
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider">COURSE</span>
                      <div className="flex gap-2.5 font-mono text-xs select-none">
                        {['SE131', 'SE132'].map(cs => (
                          <button
                            key={cs}
                            type="button"
                            onClick={() => setQuizCourse(cs)}
                            className={`py-1.5 px-3.5 rounded-full border outline-none cursor-pointer ${
                              quizCourse === cs ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-extrabold' : 'bg-white border-[#E0DED8] text-ink-900'
                            }`}
                          >
                            {cs}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider">TITLE</span>
                      <input
                        type="text"
                        required
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Quiz 3 &middot; Trees & BST"
                        className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-semibold text-ink-900 placeholder:text-ink-400 outline-none focus:border-[#FF5A36]"
                      />
                    </div>

                    {/* Date and total marks inline */}
                    <div className="grid grid-cols-2 gap-3 select-none">
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider font-sans">DATE</span>
                        <input
                          type="text"
                          required
                          value={quizDate}
                          onChange={(e) => setQuizDate(e.target.value)}
                          placeholder="Sun 14 Jun"
                          className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-mono font-semibold text-ink-900 outline-none focus:border-[#FF5A36]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider font-sans">MARKS</span>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          value={quizMarks}
                          onChange={(e) => setQuizMarks(e.target.value)}
                          placeholder="15"
                          className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-mono font-semibold text-[#181a1a] outline-none focus:border-[#FF5A36]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5]">
                      <button type="button" onClick={() => setActiveSheet(null)} className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2.5 px-4.5 rounded-full cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#FF5A36] text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1 shadow-coral-glow border-none cursor-pointer">+ Schedule quiz</button>
                    </div>
                  </form>
                )}

                {/* S-NEW ASSIGNMENT FORM */}
                {activeSheet === 'new_assignment' && (
                  <form onSubmit={handlePostAssignment} className="p-5 space-y-4 select-none font-sans text-left">
                    <div className="flex justify-between items-start select-none font-sans">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">New assignment</h2>
                        <span className="block text-[11px] font-mono text-ink-500 font-semibold pt-1 mt-1">SWE-M &middot; 42 students</span>
                      </div>
                      <button type="button" onClick={() => setActiveSheet(null)} className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 cursor-pointer border-none"><X size={18} /></button>
                    </div>

                    {/* Course */}
                    <div className="space-y-1.5 font-sans select-none">
                      <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider">COURSE</span>
                      <div className="flex gap-2.5 font-mono text-xs select-none">
                        {['SE131', 'SE132'].map(cs => (
                          <button
                            key={cs}
                            type="button"
                            onClick={() => setAssignCourse(cs)}
                            className={`py-1.5 px-3.5 rounded-full border outline-none cursor-pointer ${
                              assignCourse === cs ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-extrabold' : 'bg-white border-[#E0DED8] text-ink-900'
                            }`}
                          >
                            {cs}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5 font-sans">
                      <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">TITLE</span>
                      <input
                        type="text"
                        required
                        value={assignTitle}
                        onChange={(e) => setAssignTitle(e.target.value)}
                        placeholder="Assignment 4 &middot; Hash tables"
                        className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-semibold text-[#181a1a] outline-none"
                      />
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1.5 font-sans select-none">
                      <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">DUE DATE</span>
                      <input
                        type="text"
                        required
                        value={assignDueDate}
                        onChange={(e) => setAssignDueDate(e.target.value)}
                        placeholder="Sun 14 Jun"
                        className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-semibold text-[#1b1a18] outline-none"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5]">
                      <button type="button" onClick={() => setActiveSheet(null)} className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2.5 px-4.5 rounded-full cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#FF5A36] text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1 shadow-coral-glow border-none cursor-pointer">+ Post to 42</button>
                    </div>
                  </form>
                )}

                {/* S-OFFICE HOURS ADD */}
                {activeSheet === 'add_office' && (
                  <div className="p-5 space-y-4 select-none font-sans text-left">
                    <div className="flex justify-between items-start select-none">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">Add office hours</h2>
                        <span className="block text-[11px] font-mono text-ink-500 font-semibold pt-1 mt-1">Visible to your sections</span>
                      </div>
                      <button onClick={() => setActiveSheet(null)} className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 cursor-pointer border-none"><X size={18} /></button>
                    </div>

                    {/* Days Selection */}
                    <div className="space-y-1.5">
                      <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider">DAYS</span>
                      <div className="flex gap-2 select-none font-mono text-xs">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU'].map((day) => {
                          const isActive = officeDays.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => {
                                if (isActive) setOfficeDays(officeDays.filter(d => d !== day));
                                else setOfficeDays([...officeDays, day]);
                              }}
                              className={`py-1.5 px-3 rounded-full border outline-none cursor-pointer ${
                                isActive ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-bold' : 'bg-white border-[#E0DED8] text-[#1b1a18]'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time fields */}
                    <div className="grid grid-cols-2 gap-3 select-none">
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-extrabold text-ink-500 tracking-wider uppercase">From</span>
                        <input
                          type="text"
                          value={officeFrom}
                          onChange={(e) => setOfficeFrom(e.target.value)}
                          className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-mono font-semibold text-ink-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider uppercase">To</span>
                        <input
                          type="text"
                          value={officeTo}
                          onChange={(e) => setOfficeTo(e.target.value)}
                          className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-mono font-semibold text-[#1b1a18]"
                        />
                      </div>
                    </div>

                    {/* Link / Location */}
                    <div className="space-y-3 pt-1 border-t border-[#ECEAE5]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Link size={16} className="text-ink-700" />
                          <span className="text-xs font-semibold text-ink-900">Online (Google Meet)</span>
                        </div>
                        <button
                          onClick={() => setOfficeOnline(!officeOnline)}
                          className={`w-[40px] h-[22px] rounded-full p-[2px] transition-colors relative cursor-pointer border-none outline-none ${
                            officeOnline ? 'bg-[#FF5A36]' : 'bg-[#E8E7E3]'
                          }`}
                        >
                          <span className={`block w-[18px] h-[18px] bg-white rounded-full transition-transform duration-150 ${
                            officeOnline ? 'translate-x-[18px]' : 'translate-x-[0px]'
                          }`} />
                        </button>
                      </div>

                      {!officeOnline && (
                        <div className="space-y-1.5 select-none animate-fade-in">
                          <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">ROOM / LOCATION</span>
                          <input
                            type="text"
                            value={officeLocation}
                            onChange={(e) => setOfficeLocation(e.target.value)}
                            placeholder="UB-704"
                            className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-semibold text-[#111]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5]">
                      <button onClick={() => setActiveSheet(null)} className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2.5 px-4.5 rounded-full cursor-pointer">Cancel</button>
                      <button onClick={handleAddOffice} className="bg-[#FF5A36] text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1 shadow-coral-glow border-none cursor-pointer">+ Add slot</button>
                    </div>
                  </div>
                )}

                {/* S-UPLOAD MATERIALS */}
                {activeSheet === 'upload_material' && (
                  <div className="p-5 space-y-4 select-none font-sans text-left">
                    <div className="flex justify-between items-start select-none font-sans">
                      <div>
                        <h2 className="text-[20px] font-extrabold text-ink-900 tracking-tight leading-none">Upload material</h2>
                        <span className="block text-[11px] font-mono text-ink-500 font-semibold pt-1 mt-1">Shared with your section instantly</span>
                      </div>
                      <button onClick={() => setActiveSheet(null)} className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 border-none cursor-pointer"><X size={18} /></button>
                    </div>

                    {/* Course */}
                    <div className="space-y-1.5 font-sans select-none">
                      <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">COURSE</span>
                      <div className="flex gap-2.5 font-mono text-xs select-none">
                        {['SE131', 'SE132'].map(cs => (
                          <button
                            key={cs}
                            type="button"
                            onClick={() => setMaterialCourse(cs)}
                            className={`py-1.5 px-3.5 rounded-full border outline-none cursor-pointer ${
                              materialCourse === cs ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-extrabold' : 'bg-white border-[#E0DED8] text-[#1b1a18]'
                            }`}
                          >
                            {cs}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5 font-sans select-none">
                      <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">TYPE</span>
                      <div className="flex gap-2 font-mono text-[11px] select-none">
                        {['Slides', 'Notes', 'Reference'].map(tp => (
                          <button
                            key={tp}
                            type="button"
                            onClick={() => setMaterialType(tp)}
                            className={`py-1.5 px-3 rounded-full border outline-none cursor-pointer ${
                              materialType === tp ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] font-bold' : 'bg-white border-[#E0DED8] text-ink-950'
                            }`}
                          >
                            {tp}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5 font-sans">
                      <span className="block text-[11px] font-extrabold text-[#75726A] tracking-wider">TITLE</span>
                      <input
                        type="text"
                        value={materialTitle}
                        onChange={(e) => setMaterialTitle(e.target.value)}
                        placeholder="Lecture 7 &middot; Heaps"
                        className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-xs font-semibold text-[#181a1a] outline-none"
                      />
                    </div>

                    {/* Dashed file drop target */}
                    <div
                      onClick={() => triggerToast('File picker (demo)')}
                      className="border-2 border-dashed border-[#D4D2CC] rounded-[14px] p-6 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-[#FAFAF9]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center shrink-0">
                        <Upload size={16} />
                      </div>
                      <span className="text-xs font-semibold text-ink-700 leading-none">Tap to choose a file</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5]">
                      <button onClick={() => setActiveSheet(null)} className="bg-transparent border border-[#E0DED8] text-ink-900 text-xs font-bold py-2.5 px-4.5 rounded-full cursor-pointer">Cancel</button>
                      <button onClick={handleUploadMaterial} className="bg-[#FF5A36] text-white text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-1.5 shadow-coral-glow border-none cursor-pointer">↑ Upload</button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

    </div>
  );
}

// Separate Sub-Component: Quiz Sub-Screen Component to reduce core sizes
function QuizSubScreenComponent({ quizzes, onPublish }: { quizzes: any[]; onPublish: (id: string, code: string) => void }) {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const filtered = quizzes.filter(q => {
    if (activeTab === 'Upcoming') return q.status === 'Scheduled';
    return q.status === 'Grading' || q.status === 'Graded';
  });

  return (
    <div className="space-y-4 font-sans select-none text-left">
      {/* Sliding Tab headers */}
      <div className="bg-[#F4F4F2] p-[4px] rounded-full flex gap-1 select-none">
        {['Upcoming', 'Past'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all duration-120 border-none cursor-pointer ${
                isActive ? 'bg-white text-ink-900 shadow-sm' : 'bg-transparent text-ink-500 font-medium'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Render cards */}
      <div className="space-y-3">
        {filtered.map((qz) => (
          <div key={qz.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 space-y-2 select-none">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10.5px] text-ink-900 bg-[#F4F4F2] px-1.5 py-0.5 rounded font-bold">{qz.code}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase tracking-wide leading-none ${
                qz.status === 'Scheduled' ? 'bg-[#E5EFFE] text-[#1B4B9E]' :
                qz.status === 'Grading' ? 'bg-[#FFF4DB] text-[#8A5A00]' : 'bg-[#E5F7EE] text-[#0F6B43]'
              }`}>
                {qz.status}
              </span>
            </div>
            
            <h4 className="text-xs font-bold text-ink-900 leading-snug">{qz.title}</h4>

            {/* Timings row */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-500 select-none">
              <Calendar size={12} className="shrink-0" />
              <span>{qz.date} &middot; {qz.time} &middot; {qz.marks} marks</span>
            </div>

            {/* Marks footer past card updates */}
            {activeTab === 'Past' && (
              <div className="flex items-center justify-between border-t border-[#ECEAE5] pt-2 mt-1 text-[11px]">
                <span className="text-ink-500 font-semibold">{qz.gradedCount}/42 graded</span>
                <div>
                  {qz.status === 'Grading' ? (
                    <button
                      onClick={() => onPublish(qz.id, qz.code)}
                      className="bg-[#FF5A36] select-none text-white font-sans text-[11px] font-bold py-1 px-2.5 rounded-full shadow-coral-glow border-none cursor-pointer"
                    >
                      Publish grades
                    </button>
                  ) : (
                    <span className="text-ink-500 font-medium inline-flex items-center gap-0.5">
                      <Check size={12} className="text-[#19A974]" /> Published
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
