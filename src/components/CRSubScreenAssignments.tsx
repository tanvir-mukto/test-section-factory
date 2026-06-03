import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Plus, 
  Calendar, 
  BookOpen, 
  Clock, 
  X, 
  Bell, 
  PenLine, 
  Ban, 
  Trash2, 
  RefreshCw, 
  Send, 
  UserRound, 
  Check, 
  MoreVertical 
} from 'lucide-react';
import { User } from '../types';

export interface AssignmentItem {
  id: string;
  courseCode: 'SE131' | 'SE132' | 'SE123' | 'SE213' | 'MAT102';
  courseName: string;
  postedBy: string;
  postedByRole: 'faculty' | 'cr' | 'admin';
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueDayString: string; // "Sat 13 Jun"
  dueTime: string; // "11:59 pm"
  submittedCount: number;
  totalCount: number; // 42
  description?: string;
  status: 'Active' | 'Past' | 'Cancelled';
}

interface AssignmentsProps {
  onBack: () => void;
  triggerToast: (msg: string, duration?: number) => void;
  assignments: AssignmentItem[];
  setAssignments: React.Dispatch<React.SetStateAction<AssignmentItem[]>>;
  currentUser: User;
}

const sweCourses = [
  { code: 'SE131' as const, name: 'Data Structure', faculty: 'Dr. NSL' },
  { code: 'SE132' as const, name: 'Lab Data Structure', faculty: 'Dr. NSL' },
  { code: 'SE123' as const, name: 'Discrete Mathematics', faculty: 'Dr. KNA' },
  { code: 'SE213' as const, name: 'Digital Electronics & Logic', faculty: 'Dr. KRY' },
  { code: 'MAT102' as const, name: 'Mathematics II', faculty: 'Dr. DK' }
];

export default function CRSubScreenAssignments({
  onBack,
  triggerToast,
  assignments,
  setAssignments,
  currentUser
}: AssignmentsProps) {
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [selectedFilterCourse, setSelectedFilterCourse] = useState<string>('All courses');

  // Sheet Controls
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields
  const [formCourse, setFormCourse] = useState<'SE131' | 'SE132' | 'SE123' | 'SE213' | 'MAT102' | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('23:59'); // native 24h format for <input type="time">
  const [formDesc, setFormDesc] = useState('');
  const [formNotify, setFormNotify] = useState(true);

  // Validation States
  const [courseError, setCourseError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [dateError, setDateError] = useState(false);

  // Draft Backup State for Undo
  const [draftBackup, setDraftBackup] = useState<{
    id?: string;
    mode: 'create' | 'edit';
    course: 'SE131' | 'SE132' | 'SE123' | 'SE213' | 'MAT102' | null;
    title: string;
    date: string;
    time: string;
    description: string;
    notify: boolean;
  } | null>(null);

  // Popover State (Kebab Menu)
  const [activeKebabId, setActiveKebabId] = useState<string | null>(null);

  // Confirm Modal Dialogs State
  const [confirmModal, setConfirmModal] = useState<{
    type: 'reminder' | 'cancel' | 'delete' | 'reopen';
    item: AssignmentItem;
  } | null>(null);

  // localToast state (for TOP toast, 16px below header, auto-dismiss 1800ms / 4000ms)
  const [localToast, setLocalToast] = useState<{
    id: string;
    message: string;
    duration: number;
    hasUndo?: boolean;
    onUndo?: () => void;
  } | null>(null);

  const showLocalToast = (message: string, duration = 1800, hasUndo = false, onUndo?: () => void) => {
    setLocalToast({
      id: Math.random().toString(),
      message,
      duration,
      hasUndo,
      onUndo
    });
  };

  useEffect(() => {
    if (!localToast) return;
    const t = setTimeout(() => {
      setLocalToast(null);
    }, localToast.duration);
    return () => clearTimeout(t);
  }, [localToast]);

  // Proximity calculations
  const getProximityInfo = (dueDateStr: string): { label: string; bg: string; fg: string } => {
    const today = new Date(2026, 5, 10); // June 10, 2026
    const parts = dueDateStr.split('-');
    if (parts.length < 3) return { label: 'Active', bg: 'bg-[#F4F4F2]', fg: 'text-[#2F2E2A]' };
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const due = new Date(year, month, day);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: 'Closed', bg: 'bg-[#ECEAE5]', fg: 'text-[#2f2e2a]' };
    } else if (diffDays === 0) {
      return { label: 'Due today', bg: 'bg-[#FCE8E9]', fg: 'text-[#E5484D]' };
    } else if (diffDays === 1) {
      return { label: 'Due tomorrow', bg: 'bg-[#FCE8E9]', fg: 'text-[#E5484D]' };
    } else if (diffDays === 2 || diffDays === 3) {
      return { label: `In ${diffDays} days`, bg: 'bg-[#FFF4DB]', fg: 'text-[#8A5A00]' };
    } else {
      return { label: `${diffDays} days`, bg: 'bg-[#F4F4F2]', fg: 'text-[#2F2E2A]' };
    }
  };

  // Human date string formatter: Native "2026-06-14" -> "Sun 14 Jun"
  const formattedDayString = (dateStr: string): string => {
    const parts = dateStr.split('-');
    if (parts.length < 3) return '';
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dt = new Date(year, month, day);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[dt.getDay()]} ${day} ${months[dt.getMonth()]}`;
  };

  // Convert 24h string ("23:59") to lowercase 12h representation ("11:59 pm")
  const formatTime12h = (time24: string): string => {
    if (!time24) return '11:59 pm';
    const parts = time24.split(':');
    if (parts.length < 2) return '11:59 pm';
    let hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const minStr = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minStr} ${ampm}`;
  };

  // Sheet Submission Action
  const handlePostOrUpdate = () => {
    let hasErr = false;
    if (!formCourse) {
      setCourseError(true);
      showLocalToast('Pick a course');
      hasErr = true;
    }
    if (!formTitle.trim()) {
      setTitleError(true);
      showLocalToast('Add a title');
      hasErr = true;
    }
    if (!formDate) {
      setDateError(true);
      showLocalToast('Pick a due date');
      hasErr = true;
    }
    if (hasErr) return;

    const matchedCourse = sweCourses.find(c => c.code === formCourse);
    const courseName = matchedCourse ? matchedCourse.name : '';
    const faculty = matchedCourse ? matchedCourse.faculty : '';

    const newDayStr = formattedDayString(formDate);
    const formattedTime = formatTime12h(formTime);

    if (sheetMode === 'edit' && editingItemId) {
      setAssignments(prev => prev.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            courseCode: formCourse!,
            courseName,
            title: formTitle,
            dueDate: formDate,
            dueDayString: newDayStr,
            dueTime: formattedTime,
            description: formDesc || undefined
          };
        }
        return item;
      }));
      setIsSheetOpen(false);
      showLocalToast('Assignment updated');
    } else {
      // Create new card
      const newAsg: AssignmentItem = {
        id: `asg-${Date.now()}`,
        courseCode: formCourse!,
        courseName,
        postedBy: 'Sadia Rahman (CR)',
        postedByRole: 'cr',
        title: formTitle,
        dueDate: formDate,
        dueDayString: newDayStr,
        dueTime: formattedTime,
        submittedCount: 0,
        totalCount: 42,
        description: formDesc || undefined,
        status: 'Active'
      };

      setAssignments(prev => [newAsg, ...prev]);
      setIsSheetOpen(false);
      showLocalToast('Assignment posted · 42 students notified');
    }
  };

  // Dismiss Sheet with Draft Protection
  const handleDismissSheet = () => {
    const hasData = formCourse !== null || formTitle.trim() !== '' || formDate !== '' || formDesc.trim() !== '';
    if (hasData) {
      // backup current state
      setDraftBackup({
        id: editingItemId || undefined,
        mode: sheetMode,
        course: formCourse,
        title: formTitle,
        date: formDate,
        time: formTime,
        description: formDesc,
        notify: formNotify
      });
      setIsSheetOpen(false);
      showLocalToast('Draft discarded · Undo', 4000, true, handleRestoreDraft);
    } else {
      setIsSheetOpen(false);
    }
  };

  const handleRestoreDraft = () => {
    if (!draftBackup) return;
    setFormCourse(draftBackup.course);
    setFormTitle(draftBackup.title);
    setFormDate(draftBackup.date);
    setFormTime(draftBackup.time);
    setFormDesc(draftBackup.description);
    setFormNotify(draftBackup.notify);
    setSheetMode(draftBackup.mode);
    if (draftBackup.id) setEditingItemId(draftBackup.id);
    
    setIsSheetOpen(true);
    setDraftBackup(null);
  };

  const handleOpenCreateSheet = () => {
    setSheetMode('create');
    setEditingItemId(null);
    setFormCourse(null);
    setFormTitle('');
    setFormDate('');
    setFormTime('23:59');
    setFormDesc('');
    setFormNotify(true);
    setCourseError(false);
    setTitleError(false);
    setDateError(false);
    setIsSheetOpen(true);
  };

  const handleOpenEditSheet = (item: AssignmentItem) => {
    setSheetMode('edit');
    setEditingItemId(item.id);
    setFormCourse(item.courseCode);
    setFormTitle(item.title);
    setFormDate(item.dueDate);
    // Convert e.g. "11:59 pm" back to 24h for time picker
    let rawTime = '23:59';
    if (item.dueTime) {
      const match = item.dueTime.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (match) {
        let hrs = parseInt(match[1], 10);
        const mins = match[2];
        const ampm = match[3].toLowerCase();
        if (ampm === 'pm' && hrs < 12) hrs += 12;
        if (ampm === 'am' && hrs === 12) hrs = 0;
        const hrsStr = hrs < 10 ? `0${hrs}` : hrs;
        rawTime = `${hrsStr}:${mins}`;
      }
    }
    setFormTime(rawTime);
    setFormDesc(item.description || '');
    setFormNotify(true);
    setCourseError(false);
    setTitleError(false);
    setDateError(false);
    setIsSheetOpen(true);
  };

  // Kebab Confirmations Action handlers
  const triggerSendReminder = (item: AssignmentItem) => {
    setConfirmModal({ type: 'reminder', item });
    setActiveKebabId(null);
  };

  const triggerCancelAsg = (item: AssignmentItem) => {
    setConfirmModal({ type: 'cancel', item });
    setActiveKebabId(null);
  };

  const triggerDeleteAsg = (item: AssignmentItem) => {
    setConfirmModal({ type: 'delete', item });
    setActiveKebabId(null);
  };

  const triggerReopenAsg = (item: AssignmentItem) => {
    setConfirmModal({ type: 'reopen', item });
    setActiveKebabId(null);
  };

  const handleConfirmModalAction = () => {
    if (!confirmModal) return;
    const { type, item } = confirmModal;

    if (type === 'reminder') {
      const pendingCount = item.totalCount - item.submittedCount;
      showLocalToast(`Reminder sent to ${pendingCount} students`);
    } else if (type === 'cancel') {
      setAssignments(prev => prev.map(a => {
        if (a.id === item.id) {
          return { ...a, status: 'Cancelled' };
        }
        return a;
      }));
      showLocalToast(`Assignment cancelled · 42 students notified`);
    } else if (type === 'delete') {
      setAssignments(prev => prev.filter(a => a.id !== item.id));
      showLocalToast('Assignment deleted');
    } else if (type === 'reopen') {
      const defaultDate = new Date(2026, 5, 17); // today Wednesday 10 Jun + 7 days
      const dString = '2026-06-17';
      const dDayString = 'Wed 17 Jun';

      setAssignments(prev => prev.map(a => {
        if (a.id === item.id) {
          return { 
            ...a, 
            status: 'Active', 
            dueDate: dString,
            dueDayString: dDayString,
            dueTime: '11:59 pm',
            submittedCount: 0 
          };
        }
        return a;
      }));
      showLocalToast('Assignment reopened');
    }

    setConfirmModal(null);
  };

  // Course Filter calculation
  const displayedAssignments = assignments.filter(a => {
    const isTabMatch = activeTab === 'Active' 
      ? a.status === 'Active' 
      : (a.status === 'Past' || a.status === 'Cancelled');
    
    if (!isTabMatch) return false;
    if (selectedFilterCourse === 'All courses') return true;
    return a.courseCode === selectedFilterCourse;
  });

  // Count active globally
  const activeCount = assignments.filter(a => a.status === 'Active').length;

  return (
    <div className="flex flex-col min-h-screen text-[#0E0D0B] bg-[#FAFAF9]" style={{ width: '100%' }}>
      
      {/* LOCAL TOAST NOTIFICATION PREVIEW (16px below header, standard fixed) */}
      <AnimatePresence mode="wait">
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[104px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm z-50 text-white flex items-center justify-between rounded-xl px-4 py-3 bg-[#0E0D0B] shadow-[0_12px_32px_rgba(14,13,11,0.28)]"
          >
            <span className="text-xs font-semibold leading-relaxed font-sans">{localToast.message}</span>
            {localToast.hasUndo && (
              <button
                onClick={() => {
                  if (localToast.onUndo) localToast.onUndo();
                  setLocalToast(null);
                }}
                className="text-xs font-bold text-[#FF5A36] px-2.5 py-1 rounded-md bg-[#FF5A36]/10 active:scale-95 duration-75 cursor-pointer outline-none ml-2 shrink-0 select-none"
              >
                Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER (§A1) */}
      <header className="sticky top-0 z-40 h-[88px] bg-white border-b border-[#ECEAE5] flex items-center px-4 shrink-0 select-none">
        {/* Left: icon chevron */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          id="asg_back_btn"
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-transparent hover:bg-ink-100 transition-colors cursor-pointer select-none"
        >
          <ChevronLeft size={22} className="text-[#0E0D0B]" strokeWidth={1.75} />
        </motion.button>

        {/* Title center block */}
        <div className="flex-1 ml-2 min-w-0">
          <h3 className="text-lg font-bold text-[#0E0D0B] tracking-tight leading-none">Assignments</h3>
          <p className="font-mono text-xs text-[#75726A] font-medium leading-none mt-1.5">
            SWE-M · 42 students · <span className="font-bold">{activeCount} active</span>
          </p>
        </div>

        {/* Right: + Post */}
        <motion.button
          whileTap={{ scale: 0.97, opacity: 0.85 }}
          onClick={handleOpenCreateSheet}
          id="asg_header_post_btn"
          style={{ backgroundColor: '#FF5A36', boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }}
          className="h-[38px] px-3.5 text-white font-semibold text-[13px] rounded-full flex items-center gap-1.5 select-none cursor-pointer outline-none border-none shrink-0"
        >
          <Plus size={14} className="text-white" strokeWidth={2.5} />
          <span>Post</span>
        </motion.button>
      </header>

      {/* CONTAINER BODY */}
      <div className="flex-grow flex flex-col p-0 overflow-y-auto">
        
        {/* PILL TAB BAR (§A2) */}
        <div className="mt-4 px-5 shrink-0">
          <div className="bg-[#F4F4F2] p-1 rounded-full flex items-center w-full">
            {(['Active', 'Past'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    // Clear kebab popover
                    setActiveKebabId(null);
                  }}
                  className={`flex-1 py-2 text-center text-xs font-semibold rounded-full select-none cursor-pointer outline-none transition-all duration-150 ${
                    isActive ? 'bg-white text-[#0E0D0B] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-transparent text-[#75726A]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTER CHIPS ROW (§A3) */}
        <div className="mt-3 px-5 overflow-x-auto no-scrollbar py-1 flex items-center gap-2 select-none shrink-0" style={{ scrollbarWidth: 'none' }}>
          {['All courses', 'SE131', 'SE132', 'SE123', 'SE213', 'MAT102'].map(courseFilter => {
            const isActive = selectedFilterCourse === courseFilter;
            return (
              <button
                key={courseFilter}
                onClick={() => {
                  setSelectedFilterCourse(courseFilter);
                  setActiveKebabId(null);
                }}
                className={`px-4 py-1.5 text-xs rounded-full cursor-pointer shrink-0 transition-all font-sans ${
                  isActive 
                    ? 'bg-[#0E0D0B] text-white font-semibold' 
                    : 'bg-white border border-[#E0DED8] text-[#0E0D0B] font-medium'
                }`}
              >
                {courseFilter}
              </button>
            );
          })}
        </div>

        {/* ASSIGNMENT CARDS LIST (§A4) */}
        <div className="mt-4 px-5 pb-24 space-y-3flex-grow">
          {displayedAssignments.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white border border-[#ECEAE5] rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-8 text-center flex flex-col items-center justify-center font-sans mt-4">
              <ClipboardListIcon className="text-[#A8A59C] mb-3" size={28} />
              <p className="text-sm font-medium text-[#75726A]">No assignments {activeTab.toLowerCase()} for {selectedFilterCourse}</p>
              {activeTab === 'Active' && (
                <p className="text-xs text-[#A8A59C] mt-1">Tap + Post to add an assignment for your section.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAssignments.map(item => {
                const proxy = getProximityInfo(item.dueDate);
                const isItemCancelled = item.status === 'Cancelled';
                
                return (
                  <motion.div
                    key={item.id}
                    layoutId={`asg-layout-${item.id}`}
                    whileTap={{ scale: 0.99, opacity: 0.92 }}
                    onClick={() => {
                      showLocalToast(`Open: ${item.title}`);
                    }}
                    className="relative bg-white border border-[#ECEAE5] rounded-[14px] p-4 flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors text-left"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      {/* Left Block */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-[#0E0D0B] uppercase">
                          {item.courseCode}
                        </span>
                        
                        <span className="text-[#ECEAE5] select-none">·</span>
                        
                        {/* Posted By attribution chip */}
                        {item.postedByRole === 'faculty' && (
                          <span className="bg-[#FFF1D6] text-[#7A4A00] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] tracking-wider uppercase select-none">
                            {item.postedBy.toUpperCase()}
                          </span>
                        )}
                        {item.postedByRole === 'cr' && (
                          <span className="bg-[#FFE7DF] text-[#FF5A36] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] tracking-wider uppercase select-none">
                            POSTED BY YOU
                          </span>
                        )}
                        {item.postedByRole === 'admin' && (
                          <span className="bg-[#F4F4F2] text-[#2F2E2A] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] tracking-wider uppercase select-none">
                            ADMIN OFFICE
                          </span>
                        )}
                      </div>

                      {/* Right Block (Status Badge + Kebab Menu wrapper) */}
                      <div className="flex items-center gap-1.5 relative">
                        {/* Status tag */}
                        {isItemCancelled ? (
                          <span className="bg-[#FCE8E9] text-[#E5484D] font-sans text-[10px] font-bold px-2 py-0.5 rounded-full select-none uppercase tracking-wide">
                            Cancelled
                          </span>
                        ) : (
                          <span className={`${proxy.bg} ${proxy.fg} font-sans text-[10px] font-bold px-2 py-0.5 rounded-full select-none uppercase tracking-wide`}>
                            {proxy.label}
                          </span>
                        )}

                        {/* ISOLATED KEBAB MENU TRIGGER */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveKebabId(activeKebabId === item.id ? null : item.id);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#75726A] hover:bg-ink-100 cursor-pointer select-none transition-colors active:scale-90"
                        >
                          <MoreVertical size={16} strokeWidth={2.0} />
                        </button>

                        {/* Isolated Popover Menu */}
                        {activeKebabId === item.id && (
                          <>
                            {/* Tap-out Scrim */}
                            <div 
                              className="fixed inset-0 z-40 bg-transparent cursor-default" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveKebabId(null);
                              }}
                            />
                            
                            {/* Popover container */}
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-9 bg-white border border-[#ECEAE5] rounded-[10px] shadow-[0_12px_32px_rgba(14,13,11,0.2)] py-1.5 min-w-[200px] z-50 text-left"
                            >
                              {/* ALWAYS SHOW SEND REMINDER */}
                              <button
                                onClick={() => triggerSendReminder(item)}
                                className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-ink-50 transition-colors text-left"
                              >
                                <Bell size={15} className="text-[#FF5A36] shrink-0" strokeWidth={1.75} />
                                <span className="text-xs font-semibold text-[#0E0D0B]">Send reminder</span>
                              </button>

                              {/* ONLY IF POSTED BY SADIA: EDIT */}
                              {item.postedByRole === 'cr' && (
                                <button
                                  onClick={() => {
                                    setActiveKebabId(null);
                                    handleOpenEditSheet(item);
                                  }}
                                  className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-ink-50 transition-colors text-left"
                                >
                                  <PenLine size={15} className="text-[#2F2E2A] shrink-0" strokeWidth={1.75} />
                                  <span className="text-xs font-semibold text-[#0E0D0B]">Edit</span>
                                </button>
                              )}

                              {/* ACTIVE ONLY: CANCEL */}
                              {item.status === 'Active' && (
                                <button
                                  onClick={() => triggerCancelAsg(item)}
                                  className="w-full px-4 py-2 border-t border-[#ECEAE5]/60 flex items-center gap-2.5 hover:bg-[#FCE8E9]/10 transition-colors text-left"
                                >
                                  <Ban size={15} className="text-[#E5484D] shrink-0" strokeWidth={1.75} />
                                  <span className="text-xs font-semibold text-[#E5484D]">Mark cancelled</span>
                                </button>
                              )}

                              {/* ONLY IF POSTED BY SADIA + ACTIVE: DELETE */}
                              {item.postedByRole === 'cr' && item.status === 'Active' && (
                                <button
                                  onClick={() => triggerDeleteAsg(item)}
                                  className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-[#FCE8E9]/10 transition-colors text-left"
                                >
                                  <Trash2 size={15} className="text-[#E5484D] shrink-0" strokeWidth={1.75} />
                                  <span className="text-xs font-semibold text-[#E5484D]">Delete</span>
                                </button>
                              )}

                              {/* PAST ONLY: REOPEN */}
                              {item.status !== 'Active' && (
                                <button
                                  onClick={() => triggerReopenAsg(item)}
                                  className="w-full px-4 py-2 border-t border-[#ECEAE5]/60 flex items-center gap-2.5 hover:bg-ink-50 transition-colors text-left"
                                >
                                  <RefreshCw size={15} className="text-[#2F2E2A] shrink-0" strokeWidth={1.75} />
                                  <span className="text-xs font-semibold text-[#0E0D0B]">Reopen</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="mt-2 text-[15px] font-bold text-[#0E0D0B] line-height-1.3 leading-snug truncate select-none">
                      {item.title}
                    </h4>

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs select-none font-medium text-[#75726A]">
                      <div className="flex items-center gap-1 shrink-0">
                        <Calendar size={14} className="text-[#75726A]" strokeWidth={1.75} />
                        <span className="font-mono text-[11px] font-semibold">Due {item.dueDayString} · {item.dueTime}</span>
                      </div>
                      
                      <span className="text-[#A8A59C]">·</span>

                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <BookOpen size={14} className="text-[#75726A] shrink-0" strokeWidth={1.75} />
                        <span className="font-sans text-[11px] truncate">{item.courseName}</span>
                      </div>
                    </div>

                    {/* SUBMISSION PROGRESS ROW (Only Active list, and non-cancelled) */}
                    {item.status === 'Active' && !isItemCancelled && (
                      <div className="mt-4 flex items-center gap-3 select-none">
                        {/* Progress Bar Track */}
                        <div className="flex-1 h-1.5 bg-[#F4F4F2] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FF5A36] rounded-full transition-all duration-300"
                            style={{ width: `${(item.submittedCount / item.totalCount) * 100}%` }}
                          />
                        </div>
                        {/* Track Label */}
                        <span className="font-mono text-xs font-semibold text-[#2F2E2A] shrink-0">
                          {item.submittedCount}/{item.totalCount}
                        </span>
                      </div>
                    )}

                    {/* FOOTER ROW */}
                    <div className="mt-3 pt-3 border-t border-[#ECEAE5] flex items-center justify-between">
                      {/* Left caption */}
                      <span className="text-xs font-medium text-[#75726A]">
                        {item.status === 'Active' && !isItemCancelled && (
                          item.totalCount - item.submittedCount > 0 ? (
                            <span className="text-[#8A5A00] font-semibold">{item.totalCount - item.submittedCount} not submitted</span>
                          ) : (
                            <span className="text-[#75726A]">All submitted</span>
                          )
                        )}
                        {(item.status !== 'Active' || isItemCancelled) && (
                          <span className="font-mono text-[11px] text-[#75726A]">
                            {isItemCancelled 
                              ? `Cancelled · ${item.dueDayString}`
                              : `${item.submittedCount}/${item.totalCount} submitted · Closed ${item.dueDayString}`
                            }
                          </span>
                        )}
                      </span>

                      {/* Right button */}
                      {item.status === 'Active' && !isItemCancelled ? (
                        <div className="bg-white border border-[#E0DED8] text-[#FF5A36] text-[12px] font-bold rounded-full py-1 px-3 flex items-center gap-1 select-none active:scale-95 transition-all">
                          <span>See details</span>
                          <ChevronLeft className="rotate-180" size={13} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <span className="text-xs text-[#75726A] font-semibold">View</span>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM DIALOG MODALS (§D) */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-5 select-none font-sans">
            {/* Scrim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-default"
              onClick={() => setConfirmModal(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-[0_16px_48px_rgba(14,13,11,0.25)] text-left z-10 font-sans"
            >
              {confirmModal.type === 'reminder' && (
                <>
                  <h3 className="text-[17px] font-bold text-[#0E0D0B] tracking-tight">Send reminder?</h3>
                  <p className="text-xs text-[#75726A] leading-relaxed mt-2.5">
                    {confirmModal.item.totalCount - confirmModal.item.submittedCount} students who haven't submitted will get a push notification.
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="px-4 py-2 border border-[#E0DED8] text-xs font-bold text-[#2F2E2A] rounded-full active:scale-95 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmModalAction}
                      style={{ backgroundColor: '#FF5A36' }}
                      className="px-4 py-2 text-white text-xs font-bold rounded-full active:scale-95 transition flex items-center gap-1"
                    >
                      <Bell size={13} strokeWidth={2} />
                      <span>Send reminder</span>
                    </button>
                  </div>
                </>
              )}

              {confirmModal.type === 'cancel' && (
                <>
                  <h3 className="text-[17px] font-bold text-[#0E0D0B] tracking-tight">Cancel this assignment?</h3>
                  <p className="text-xs text-[#75726A] leading-relaxed mt-2.5">
                    Students will get notified that <span className="font-semibold text-ink-900">"{confirmModal.item.title}"</span> is cancelled.
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="px-4 py-2 border border-[#E0DED8] text-xs font-bold text-[#2F2E2A] rounded-full active:scale-95 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmModalAction}
                      className="px-4 py-2 bg-[#E1484D] hover:bg-[#E5484D] text-white text-xs font-bold rounded-full active:scale-95 transition"
                    >
                      Cancel assignment
                    </button>
                  </div>
                </>
              )}

              {confirmModal.type === 'delete' && (
                <>
                  <h3 className="text-[17px] font-bold text-[#0E0D0B] tracking-tight">Delete this assignment?</h3>
                  <p className="text-xs text-[#75726A] leading-relaxed mt-2.5">
                    <span className="font-semibold text-ink-900">"{confirmModal.item.title}"</span> will be removed completely. This operation cannot be undone.
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="px-4 py-2 border border-[#E0DED8] text-xs font-bold text-[#2F2E2A] rounded-full active:scale-95 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmModalAction}
                      className="px-4 py-2 bg-[#E1484D] text-white text-xs font-bold rounded-full active:scale-95 transition flex items-center gap-1"
                    >
                      <Trash2 size={13} strokeWidth={2} />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}

              {confirmModal.type === 'reopen' && (
                <>
                  <h3 className="text-[17px] font-bold text-[#0E0D0B] tracking-tight">Reopen this assignment?</h3>
                  <p className="text-xs text-[#75726A] leading-relaxed mt-2.5">
                    Reopening <span className="font-semibold text-[#0E0D0B]">"{confirmModal.item.title}"</span> resets submissions. Students can submit again until next week.
                  </p>
                  <div className="mt-5 flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="px-4 py-2 border border-[#E0DED8] text-xs font-bold text-[#2F2E2A] rounded-full active:scale-95 transition animate-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmModalAction}
                      style={{ backgroundColor: '#FF5A36' }}
                      className="px-4 py-2 text-white text-xs font-bold rounded-full active:scale-95 transition"
                    >
                      Reopen
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POST / EDIT ASSIGNMENT BOTTOM SHEET (§B) */}
      <AnimatePresence>
        {isSheetOpen && (
          <div className="fixed inset-0 z-55 flex flex-col justify-end overflow-hidden selection:bg-[#FFE7DF]">
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismissSheet}
              className="absolute inset-0 bg-[#0E0D0B]/55"
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-h-[85%] bg-white rounded-t-[28px] shadow-[0_-8px_32px_rgba(14,13,11,0.18)] flex flex-col z-10 overflow-hidden font-sans pb-safe"
            >
              {/* Grab Handle */}
              <div className="mt-2 shrink-0 flex justify-center w-full">
                <div className="w-[38px] h-1 bg-[#ECEAE5] rounded-full select-none shrink-0" />
              </div>

              {/* SHEET HEADER FRAME (§B2) */}
              <div className="mt-4 px-5 pb-3 flex items-start justify-between border-b border-[#ECEAE5]/40 shrink-0 select-none">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[#0E0D0B] tracking-tight">
                    {sheetMode === 'edit' ? 'Edit assignment' : 'Post assignment'}
                  </h2>
                  <p className="font-mono text-xs text-[#75726A] font-medium leading-none mt-1.5 uppercase tracking-wide">
                    SWE-M · 42 students will be notified
                  </p>
                </div>
                <button
                  onClick={handleDismissSheet}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent active:bg-ink-100 cursor-pointer select-none"
                >
                  <X size={22} className="text-[#0E0D0B]" strokeWidth={1.75} />
                </button>
              </div>

              {/* Form Body Scrollable Area */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                
                {/* POSTED BY BANNER (§B3) */}
                <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-xl px-3 py-2.5 flex items-center gap-2.5 select-none shrink-0">
                  <UserRound size={16} className="text-[#FF5A36] shrink-0" strokeWidth={2.0} />
                  <span className="text-[13px] font-medium text-[#2F2E2A]">
                    Posted by <span className="font-bold text-[#FF5A36]">CR Sadia</span>
                  </span>
                </div>

                {/* FORM FIELDS (§B4) */}
                
                {/* FIELD 1: Course (Select single) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0E0D0B]">
                    Course <span className="text-[#E5484D]">*</span>
                  </label>
                  <div className={`flex gap-2 overflow-x-auto py-1.5 no-scrollbar select-none ${
                    courseError ? 'border-2 border-[#E5484D]/40 rounded-xl px-1' : ''
                  }`}>
                    {sweCourses.map(courseObj => {
                      const isActive = formCourse === courseObj.code;
                      return (
                        <button
                          key={courseObj.code}
                          type="button"
                          onClick={() => {
                            setFormCourse(courseObj.code);
                            setCourseError(false);
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all font-mono ${
                            isActive
                              ? 'bg-[#FFF4F0] border-[1.5px] border-[#FF5A36] text-[#FF5A36] font-bold'
                              : 'bg-white border border-[#E0DED8] text-[#0E0D0B] font-medium'
                          }`}
                        >
                          {courseObj.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FIELD 2: Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0E0D0B]">
                    Title <span className="text-[#E5484D]">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Lab 4 report · Hash tables"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (e.target.value.trim()) setTitleError(false);
                    }}
                    className={`w-full bg-white border ${
                      titleError ? 'border-[#E5484D] ring-2 ring-[#E5484D]/10' : 'border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18'
                    } rounded-xl py-3 px-3.5 text-sm font-medium text-[#0E0D0B] outline-none placeholder:text-ink-400/85`}
                  />
                </div>

                {/* FIELD 3: Posted by faculty */}
                {formCourse && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#0E0D0B]">
                      Posted by faculty
                    </label>
                    <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-3 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF1D6] flex items-center justify-center shrink-0">
                          <span className="font-mono text-xs font-bold text-[#7A4A00] uppercase">
                            {sweCourses.find(c => c.code === formCourse)?.faculty || 'NSL'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#0E0D0B]">
                          {sweCourses.find(c => c.code === formCourse)?.faculty 
                            ? `Dr. ${sweCourses.find(c => c.code === formCourse)?.faculty}` 
                            : 'Dr. NSL'
                          }
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerToast('Faculty picker (demo)')}
                        className="text-xs font-bold text-[#FF5A36] px-2"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* FIELD 4: Due Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0E0D0B]">
                    Due date <span className="text-[#E5484D]">*</span>
                  </label>
                  <div className="relative w-full">
                    {/* Customizable tap display */}
                    <div className={`w-full bg-white border ${
                      dateError ? 'border-[#E5484D] ring-2 ring-[#E5484D]/10' : 'border-[#E0DED8]'
                    } rounded-xl py-3 px-3.5 flex items-center justify-between text-sm`}>
                      <span className={`font-mono ${formDate ? 'font-bold text-[#0E0D0B]' : 'text-ink-400/85'}`}>
                        {formDate ? formattedDayString(formDate) : 'Pick a date'}
                      </span>
                      <Calendar size={18} className="text-[#75726A]" strokeWidth={1.75} />
                    </div>
                    {/* Native Overlay Input Date */}
                    <input
                      type="date"
                      min="2026-06-10"
                      value={formDate}
                      onChange={(e) => {
                        setFormDate(e.target.value);
                        if (e.target.value) setDateError(false);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full text-transparent"
                    />
                  </div>
                </div>

                {/* FIELD 5: Due Time */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0E0D0B] font-sans">
                    Due time (optional)
                  </label>
                  <div className="relative w-full">
                    {/* Customizable tap display */}
                    <div className="w-full bg-white border border-[#E0DED8] rounded-xl py-3 px-3.5 flex items-center justify-between text-sm">
                      <span className="font-mono font-bold text-[#0E0D0B]">
                        {formTime ? formatTime12h(formTime) : '11:59 pm'}
                      </span>
                      <Clock size={18} className="text-[#75726A]" strokeWidth={1.75} />
                    </div>
                    {/* Native Overlay Input Time */}
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full text-transparent"
                    />
                  </div>
                </div>

                {/* FIELD 6: Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0E0D0B]">
                    Details (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      maxLength={280}
                      rows={3}
                      placeholder="Add instructions, attachments, or context students need."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-xl py-3 px-3.5 text-sm font-normal text-[#0E0D0B] outline-none min-h-[80px] resize-none pb-8"
                    />
                    <span className={`absolute bottom-2.5 right-3 font-mono text-[11px] font-semibold ${
                      formDesc.length >= 280 ? 'text-[#E5484D]' : formDesc.length >= 240 ? 'text-[#8A5A00]' : 'text-ink-400'
                    }`}>
                      {formDesc.length}/280
                    </span>
                  </div>
                </div>

                {/* FIELD 7: Push Notifications Toggle */}
                <div className="pt-2 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell size={18} className="text-[#2F2E2A]" strokeWidth={1.75} />
                    <span className="text-xs font-bold text-[#0E0D0B]">Send push to 42 students</span>
                  </div>
                  {/* Custom iOS Toggle Button */}
                  <button
                    onClick={() => setFormNotify(!formNotify)}
                    className="cursor-pointer select-none"
                  >
                    <div className={`w-[44px] h-[24px] rounded-full p-0.5 transition-colors relative ${
                      formNotify ? 'bg-[#FF5A36]' : 'bg-[#E5E5EA]'
                    }`}>
                      <div className={`w-[20px] h-[20px] bg-white rounded-full transition-transform ${
                        formNotify ? 'translate-x-[20px]' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>
                </div>

              </div>

              {/* STICKY FOOTER BUTTONS (§B5) */}
              <div className="bg-white border-t border-[#ECEAE5] py-3 px-5 flex items-center justify-between shrink-0 select-none">
                <button
                  type="button"
                  onClick={handleDismissSheet}
                  className="bg-white border border-[#E0DED8] rounded-full py-2.5 px-4 text-xs font-bold text-[#0E0D0B] select-none cursor-pointer outline-none active:scale-95 transition-all"
                >
                  Cancel
                </button>

                {(() => {
                  const isEnabled = formCourse !== null && formTitle.trim() !== '' && formDate !== '';
                  return (
                    <motion.button
                      whileTap={isEnabled ? { scale: 0.97, opacity: 0.85 } : undefined}
                      disabled={!isEnabled}
                      type="button"
                      onClick={handlePostOrUpdate}
                      style={isEnabled ? {
                        backgroundColor: '#FF5A36',
                        boxShadow: '0 8px 24px rgba(255, 90, 54, 0.28)'
                      } : {}}
                      className={`h-10 px-4.5 text-white font-bold text-[13px] rounded-full flex items-center gap-1.5 outline-none border-none ${
                        isEnabled
                          ? 'bg-[#FF5A36] cursor-pointer'
                          : 'bg-[#FF5A36]/40 opacity-[0.4] cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Send size={14} className="text-white" strokeWidth={2.5} />
                      <span>{sheetMode === 'edit' ? 'Save changes' : 'Post assignment'}</span>
                    </motion.button>
                  );
                })()}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Minimal placeholder component to support icon fallbacks comfortably
function ClipboardListIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center justify-center p-3.5 bg-ink-50 rounded-xl leading-none ${className}`}>
      <span className="font-mono text-xl font-bold">📋</span>
    </div>
  );
}
