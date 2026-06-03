import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CalendarDays, 
  CalendarCheck, 
  PenLine, 
  BookOpen, 
  Plus, 
  RotateCcw, 
  MapPin, 
  Ban, 
  CalendarX, 
  X, 
  Send, 
  Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface Slot {
  id: string;
  start: string; // e.g. "10:00 am"
  end: string;   // e.g. "11:30 am"
  code: string;  // e.g. "SE123"
  name: string;  // e.g. "Discrete Mathematics"
  room: string;  // e.g. "YKSG3-106"
  faculty: string; // e.g. "Dr. KNA"
  cancelled: boolean;
}

const ROUTINE_BASE: Record<string, Slot[]> = {
  Sat: [
    { id: 'sat-1',  start: '10:00 am', end: '11:30 am', code: 'SE123',  name: 'Discrete Mathematics',         room: 'YKSG3-106', faculty: 'Dr. KNA', cancelled: false },
    { id: 'sat-2',  start: '11:30 am', end: '1:00 pm',  code: 'SE213',  name: 'Digital Electronics & Logic',  room: 'YKSG3-107', faculty: 'Dr. KRY', cancelled: false },
    { id: 'sat-3',  start: '2:30 pm',  end: '4:00 pm',  code: 'MAT102', name: 'Mathematics II',               room: 'Room 701B', faculty: 'Dr. DK',  cancelled: false },
  ],
  Sun: [
    { id: 'sun-1',  start: '2:30 pm',  end: '4:00 pm',  code: 'SE213',  name: 'Digital Electronics & Logic',  room: 'Room 811',  faculty: 'Dr. KRY', cancelled: false },
    { id: 'sun-2',  start: '4:00 pm',  end: '5:30 pm',  code: 'SE123',  name: 'Discrete Mathematics',         room: 'Room 914',  faculty: 'Dr. KNA', cancelled: false },
  ],
  Mon: [],
  Tue: [
    { id: 'tue-1',  start: '8:30 am',  end: '10:00 am', code: 'MAT102', name: 'Mathematics II',               room: 'Room 913',  faculty: 'Dr. DK',  cancelled: false },
    { id: 'tue-2',  start: '10:00 am', end: '11:30 am', code: 'SE131',  name: 'Data Structure',               room: 'Room 1504', faculty: 'Dr. NSL', cancelled: false },
  ],
  Wed: [
    { id: 'wed-1',  start: '8:30 am',  end: '10:00 am', code: 'SE132',  name: 'Lab M1 Data Structure',        room: 'Room 710',  faculty: 'Dr. NSL', cancelled: false },
    { id: 'wed-2',  start: '10:00 am', end: '11:30 am', code: 'SE131',  name: 'Data Structure',               room: 'Room 1504', faculty: 'Dr. NSL', cancelled: false },
    { id: 'wed-3',  start: '1:00 pm',  end: '2:30 pm',  code: 'SE132',  name: 'Lab M2 Data Structure',        room: 'AB3-106',   faculty: 'Dr. NSL', cancelled: false },
  ],
  Thu: [],
  Fri: [],
};

const WEEKDAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

const DAY_INFO: Record<string, { label: string; dateNum: number; dateStr: string; fullDate: string }> = {
  Sat: { label: 'Sat', dateNum: 6, dateStr: 'Sat 6 Jun', fullDate: 'Saturday, 6 June 2026' },
  Sun: { label: 'Sun', dateNum: 7, dateStr: 'Sun 7 Jun', fullDate: 'Sunday, 7 June 2026' },
  Mon: { label: 'Mon', dateNum: 8, dateStr: 'Mon 8 Jun', fullDate: 'Monday, 8 June 2026' },
  Tue: { label: 'Tue', dateNum: 9, dateStr: 'Tue 9 Jun', fullDate: 'Tuesday, 9 June 2026' },
  Wed: { label: 'Wed', dateNum: 10, dateStr: 'Wed 10 Jun', fullDate: 'Wednesday, 10 June 2026' },
  Thu: { label: 'Thu', dateNum: 11, dateStr: 'Thu 11 Jun', fullDate: 'Thursday, 11 June 2026' },
  Fri: { label: 'Fri', dateNum: 12, dateStr: 'Fri 12 Jun', fullDate: 'Friday, 12 June 2026' },
};

const LOCKED_COURSES = [
  { code: 'SE131', name: 'Data Structure', faculty: 'Dr. NSL' },
  { code: 'SE132', name: 'Lab Data Structure', faculty: 'Dr. NSL' },
  { code: 'SE123', name: 'Discrete Mathematics', faculty: 'Dr. KNA' },
  { code: 'SE213', name: 'Digital Electronics & Logic', faculty: 'Dr. KRY' },
  { code: 'MAT102', name: 'Mathematics II', faculty: 'Dr. DK' }
];

const LOCKED_ROOMS = [
  'Room 1504', 'Room 710', 'AB3-106', 'YKSG3-106', 'YKSG3-107', 'Room 701B', 'Room 811', 'Room 914', 'Room 913'
];

interface ToastState {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface RoutineScreenProps {
  currentUser?: User | null;
  onBack?: () => void;
}

export default function RoutineScreen({ currentUser, onBack }: RoutineScreenProps) {
  // Demo Role Swapper state (Defaults to 'cr')
  const [role, setRole] = useState<'student' | 'cr'>('cr');
  
  // Selected day key, default Wednesday 10
  const [selectedDay, setSelectedDay] = useState<string>('Wed');

  // Active routine state
  const [routine, setRoutine] = useState<Record<string, Slot[]>>(() => {
    const saved = localStorage.getItem('vars_diu_routine_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse routine data: ", e);
      }
    }
    return JSON.parse(JSON.stringify(ROUTINE_BASE));
  });

  // Save routine automatically to local storage
  useEffect(() => {
    localStorage.setItem('vars_diu_routine_data', JSON.stringify(routine));
  }, [routine]);

  // Toast notifications state (TOP of screen)
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (message: string, actionLabel?: string, onAction?: () => void, duration = 3000) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, actionLabel, onAction });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Undo memory state
  const [lastDraft, setLastDraft] = useState<{
    day: string;
    mode: 'add' | 'edit';
    slotId?: string;
    code: string;
    name: string;
    start: string;
    end: string;
    room: string;
    faculty: string;
  } | null>(null);

  // Bottom Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingSlotId, setEditingSlotId] = useState<string | undefined>(undefined);

  // Form Fields
  const [fieldCode, setFieldCode] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [fieldStart, setFieldStart] = useState('');
  const [fieldEnd, setFieldEnd] = useState('');
  const [fieldRoom, setFieldRoom] = useState('');
  const [fieldFaculty, setFieldFaculty] = useState('');

  // Delete confirmation overlay within the bottom sheet
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Gate check
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
    return parseInt(u.batch, 10);
  };

  const deptCode = currentUser ? getDeptCode(currentUser) : 'SWE';
  const sectionCode = currentUser ? getSectionCode(currentUser) : 'M';
  const batchVal = currentUser ? getBatchVal(currentUser) : 46;

  const isSweM46 = deptCode === 'SWE' && sectionCode === 'M' && batchVal === 46;

  // Render Gate Warning if user context is from incorrect cohort
  if (!isSweM46) {
    return (
      <div id="routine-screen-gated" className="space-y-5 px-5 select-none text-[#0E0D0B] font-sans pb-10 bg-[#FAFAF9] min-h-screen pt-4">
        {/* HEADER CARD */}
        <div 
          id="header-card" 
          className="relative bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 pl-[22px] overflow-hidden flex items-center justify-between"
        >
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#FF5A36]" />
          <div className="space-y-1">
            <h2 className="text-[15px] font-semibold text-[#0E0D0B] leading-snug tracking-tight font-sans">
              Weekly class routine
            </h2>
            <p className="text-[12px] font-medium text-[#75726A] leading-none font-sans flex items-center gap-1 flex-wrap">
              <span className="font-mono font-semibold text-[#0E0D0B]">{deptCode}-{sectionCode}</span>
              <span>·</span>
              <span>Batch</span>
              <span className="font-mono font-semibold text-[#0E0D0B]">{batchVal}</span>
              <span>·</span>
              <span>not published yet</span>
            </p>
          </div>
          <div className="shrink-0 text-[#75726A]">
            <BookOpen strokeWidth={1.75} size={22} />
          </div>
        </div>

        {/* EMPTY STATE */}
        <div 
          id="empty-state-card"
          className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFF4F0] flex items-center justify-center text-[#FF5A36]">
            <Calendar strokeWidth={1.75} size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[#0E0D0B] leading-snug tracking-tight font-sans">
              Routine pending setup
            </h3>
            <p className="text-[13px] font-medium text-[#75726A] max-w-xs mx-auto leading-relaxed font-sans">
              The official weekly schedule of the department for this cohort has not been published or authorized yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authoring overrides
  const isCR = role === 'cr';

  // Helper calculation functions
  const dayDirty = (dayKey: string): boolean => {
    return JSON.stringify(routine[dayKey]) !== JSON.stringify(ROUTINE_BASE[dayKey]);
  };

  const isWholeRoutineDirty = (): boolean => {
    return JSON.stringify(routine) !== JSON.stringify(ROUTINE_BASE);
  };

  // Time utilities
  const parseTimeToMins = (timeStr: string): number => {
    const clean = timeStr.trim().toLowerCase();
    const match = clean.match(/(\d+):(\d+)\s*(am|pm)/);
    if (!match) return 0;
    let hrs = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const isPm = match[3] === 'pm';
    if (isPm && hrs < 12) hrs += 12;
    if (!isPm && hrs === 12) hrs = 0;
    return hrs * 60 + mins;
  };

  const formatMinsToTime = (totalMins: number): string => {
    const normMins = totalMins % (24 * 60);
    let hrs = Math.floor(normMins / 60);
    const mins = normMins % 60;
    const ampm = hrs >= 12 ? 'pm' : 'am';
    hrs = hrs % 12;
    if (hrs === 0) hrs = 12;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${minsStr} ${ampm}`;
  };

  const parseMinsToHoursAndMinutesStr = (totalMins: number): string => {
    let hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const normHrs = hrs % 24;
    return `${normHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convert "9:00 am" or similar text into "09:00" for input type="time"
  const getInputValueFromTimeStr = (timeStr: string): string => {
    if (!timeStr) return '';
    const mins = parseTimeToMins(timeStr);
    return parseMinsToHoursAndMinutesStr(mins);
  };

  // Convert time input "09:00" output from type="time" into standard "9:00 am" format
  const getTimeStrFromInputValue = (timeVal: string): string => {
    if (!timeVal) return '';
    const parts = timeVal.split(':');
    if (parts.length < 2) return '';
    const hrs = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    return formatMinsToTime(hrs * 60 + mins);
  };

  // Triggering sheet state
  const openAddSheet = () => {
    setSheetMode('add');
    setEditingSlotId(undefined);
    setFieldCode('');
    setFieldName('');
    setFieldStart('');
    setFieldEnd('');
    setFieldRoom('');
    setFieldFaculty('');
    setIsSheetOpen(true);
    setShowDeleteConfirm(false);
  };

  const openEditSheet = (slot: Slot) => {
    setSheetMode('edit');
    setEditingSlotId(slot.id);
    setFieldCode(slot.code);
    setFieldName(slot.name);
    setFieldStart(getInputValueFromTimeStr(slot.start));
    setFieldEnd(getInputValueFromTimeStr(slot.end));
    setFieldRoom(slot.room);
    setFieldFaculty(slot.faculty);
    setIsSheetOpen(true);
    setShowDeleteConfirm(false);
  };

  // Handlers
  const handleToggleCancel = (day: string, slotId: string) => {
    const nextSlots = routine[day].map(s => {
      if (s.id === slotId) {
        const cancelled = !s.cancelled;
        const formattedCode = s.code.toUpperCase();
        if (cancelled) {
          triggerToast(`${formattedCode} cancelled — 42 notified`);
        } else {
          triggerToast(`${formattedCode} restored — 42 notified`);
        }
        return { ...s, cancelled };
      }
      return s;
    });
    setRoutine({
      ...routine,
      [day]: nextSlots
    });
  };

  const handleResetDay = (day: string) => {
    setRoutine({
      ...routine,
      [day]: JSON.parse(JSON.stringify(ROUTINE_BASE[day]))
    });
    const fullDay = DAY_INFO[day]?.fullDate.split(',')[0] || day;
    triggerToast(`${fullDay} reset to original`);
  };

  const handleResetWholeRoutine = () => {
    setRoutine(JSON.parse(JSON.stringify(ROUTINE_BASE)));
    triggerToast(`Whole routine reset`);
  };

  const handleApplyLockedCourse = (course: { code: string; name: string; faculty: string }) => {
    setFieldCode(course.code);
    setFieldName(course.name);
    setFieldFaculty(course.faculty);
  };

  const handleApplyLockedRoom = (room: string) => {
    setFieldRoom(room);
  };

  // Submit flow inside bottom sheet
  const handleSaveClass = () => {
    // Validations
    if (!fieldCode.trim()) {
      triggerToast('Add a course code');
      return;
    }
    if (!fieldName.trim()) {
      triggerToast('Add a course name');
      return;
    }
    if (!fieldStart.trim()) {
      triggerToast('Add a start time');
      return;
    }

    const startStr = getTimeStrFromInputValue(fieldStart);
    let endStr = getTimeStrFromInputValue(fieldEnd);
    if (!fieldEnd.trim()) {
      // END empty -> auto-fills to start + 90 minutes silently
      const startMins = parseTimeToMins(startStr);
      endStr = formatMinsToTime(startMins + 90);
    }

    const finalCode = fieldCode.trim().toUpperCase();
    const finalRoom = fieldRoom.trim() ? fieldRoom.trim() : 'TBA';
    const finalFaculty = fieldFaculty.trim() ? fieldFaculty.trim() : 'TBA';

    if (sheetMode === 'add') {
      const newSlot: Slot = {
        id: `slot-${Math.random().toString(36).substring(2, 9)}`,
        start: startStr,
        end: endStr,
        code: finalCode,
        name: fieldName.trim(),
        room: finalRoom,
        faculty: finalFaculty,
        cancelled: false,
      };

      const originalSlots = routine[selectedDay] || [];
      const updatedSlots = [...originalSlots, newSlot];
      // Sort day's slots by start time ascending
      const sortedSlots = updatedSlots.sort((a, b) => parseTimeToMins(a.start) - parseTimeToMins(b.start));

      setRoutine({
        ...routine,
        [selectedDay]: sortedSlots
      });
      triggerToast(`${finalCode} added to ${selectedDay}`);
    } else {
      // edit mode
      const nextSlots = routine[selectedDay].map(s => {
        if (s.id === editingSlotId) {
          return {
            ...s,
            start: startStr,
            end: endStr,
            code: finalCode,
            name: fieldName.trim(),
            room: finalRoom,
            faculty: finalFaculty
          };
        }
        return s;
      });
      const sortedSlots = nextSlots.sort((a, b) => parseTimeToMins(a.start) - parseTimeToMins(b.start));

      setRoutine({
        ...routine,
        [selectedDay]: sortedSlots
      });
      triggerToast(`${finalCode} updated`);
    }

    setIsSheetOpen(false);
  };

  const handleDeleteClass = () => {
    if (!editingSlotId) return;
    const finalSlots = routine[selectedDay].filter(s => s.id !== editingSlotId);
    setRoutine({
      ...routine,
      [selectedDay]: finalSlots
    });
    triggerToast('Class removed');
    setIsSheetOpen(false);
    setShowDeleteConfirm(false);
  };

  // Unsaved check and dismiss handling
  const checkDismissWithUnsavedChange = () => {
    // If add mode
    if (sheetMode === 'add') {
      if (fieldCode.trim() || fieldName.trim() || fieldStart.trim() || fieldRoom.trim() || fieldFaculty.trim()) {
        // Discard draft with a top toast draft and undo option
        const currentDraft = {
          day: selectedDay,
          mode: 'add' as const,
          code: fieldCode,
          name: fieldName,
          start: fieldStart,
          end: fieldEnd,
          room: fieldRoom,
          faculty: fieldFaculty
        };
        setLastDraft(currentDraft);

        triggerToast('Draft discarded · Undo', 'Undo', () => {
          setSelectedDay(currentDraft.day);
          setSheetMode('add');
          setFieldCode(currentDraft.code);
          setFieldName(currentDraft.name);
          setFieldStart(currentDraft.start);
          setFieldEnd(currentDraft.end);
          setFieldRoom(currentDraft.room);
          setFieldFaculty(currentDraft.faculty);
          setIsSheetOpen(true);
        }, 4000);
      }
    } else {
      // edit mode
      const originalSlot = routine[selectedDay].find(s => s.id === editingSlotId);
      if (originalSlot) {
        const activeStartVal = getInputValueFromTimeStr(originalSlot.start);
        const activeEndVal = getInputValueFromTimeStr(originalSlot.end);

        const hasChanged = originalSlot.code !== fieldCode.trim().toUpperCase() ||
          originalSlot.name !== fieldName.trim() ||
          activeStartVal !== fieldStart ||
          activeEndVal !== fieldEnd ||
          originalSlot.room !== (fieldRoom.trim() || 'TBA') ||
          originalSlot.faculty !== (fieldFaculty.trim() || 'TBA');

        if (hasChanged) {
          const currentDraft = {
            day: selectedDay,
            mode: 'edit' as const,
            slotId: editingSlotId,
            code: fieldCode,
            name: fieldName,
            start: fieldStart,
            end: fieldEnd,
            room: fieldRoom,
            faculty: fieldFaculty
          };
          setLastDraft(currentDraft);

          triggerToast('Draft discarded · Undo', 'Undo', () => {
            setSelectedDay(currentDraft.day);
            setSheetMode('edit');
            setEditingSlotId(currentDraft.slotId);
            setFieldCode(currentDraft.code);
            setFieldName(currentDraft.name);
            setFieldStart(currentDraft.start);
            setFieldEnd(currentDraft.end);
            setFieldRoom(currentDraft.room);
            setFieldFaculty(currentDraft.faculty);
            setIsSheetOpen(true);
          }, 4000);
        }
      }
    }
    setIsSheetOpen(false);
  };

  const selectedDayInfo = DAY_INFO[selectedDay];
  const daySlots = routine[selectedDay] || [];
  const totalClasses = daySlots.length;
  const totalCancelled = daySlots.filter(s => s.cancelled).length;

  return (
    <div 
      id="routine-screen-root" 
      className="relative flex flex-col min-h-screen bg-[#FAFAF9]"
      style={{ width: '100%', maxWidth: '390px', margin: '0 auto' }}
    >
      {/* (A) APP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#ECEAE5] h-16 px-5 flex items-center justify-between shadow-1">
        <div className="flex items-center gap-3">
          <button 
            id="routine-header-back-btn"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} className="text-[#0E0D0B] stroke-[1.75]" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-[20px] font-bold tracking-tight text-[#0E0D0B] leading-none">
              Class routine
            </h1>
            <span className="font-mono text-[12px] font-medium text-[#75726A] mt-1 tracking-tight">
              SWE-M · Batch 46 · Jun 2026
            </span>
          </div>
        </div>

        <button 
          id="routine-header-sync-btn"
          onClick={() => {
            if (isCR) {
              triggerToast('Routine published to 42 students');
            } else {
              triggerToast('Routine synced');
            }
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] text-[#0E0D0B]"
        >
          <CalendarCheck size={22} className="stroke-[1.75]" />
        </button>
      </header>

      {/* TOP TOAST BANNER CONTAINER */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            id="top-toast-alert"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-18 left-4 right-4 z-50 bg-[#0E0D0B] text-white py-3 px-4 rounded-xl shadow-3 flex items-center justify-between"
          >
            <span className="text-xs font-semibold font-sans">{toast.message}</span>
            {toast.actionLabel && (
              <button 
                onClick={() => {
                  if (toast.onAction) toast.onAction();
                  setToast(null);
                }}
                className="text-xs font-bold text-[#FF5A36] select-none uppercase tracking-wider px-2.5 py-1 hover:opacity-90 active:scale-95"
              >
                {toast.actionLabel}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* (B) ROLE SWITCH SEGMENTED CONTROL */}
        <div className="px-5 mt-4">
          <div className="bg-[#F4F4F2] p-1 rounded-full flex items-center w-full">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full text-center transition-all duration-[120ms] ease-out active:scale-[0.97] active:opacity-[0.85] ${
                role === 'student'
                  ? 'bg-white text-[#0E0D0B] shadow-1'
                  : 'text-[#75726A]'
              }`}
            >
              Student · Tanvir
            </button>
            <button
              onClick={() => setRole('cr')}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-full text-center transition-all duration-[120ms] ease-out active:scale-[0.97] active:opacity-[0.85] ${
                role === 'cr'
                  ? 'bg-white text-[#0E0D0B] shadow-1'
                  : 'text-[#75726A]'
              }`}
            >
              CR · Sadia
            </button>
          </div>
        </div>

        {/* (C) WEEK NAVIGATOR (CR role only) */}
        {isCR && (
          <div className="flex items-center justify-between gap-3 px-5 mt-4">
            <button 
              onClick={() => triggerToast('Week navigation coming')}
              className="w-9 h-9 bg-white border border-[#E0DED8] rounded-full flex items-center justify-center active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] text-[#0E0D0B]"
            >
              <ChevronLeft size={18} className="stroke-[1.75]" />
            </button>
            
            <span className="text-[15px] font-semibold text-[#0E0D0B] font-sans">
              6 – 12 Jun 2026
            </span>

            <button 
              onClick={() => triggerToast('Week navigation coming')}
              className="w-9 h-9 bg-white border border-[#E0DED8] rounded-full flex items-center justify-center active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] text-[#0E0D0B]"
            >
              <ChevronRight size={18} className="stroke-[1.75]" />
            </button>
          </div>
        )}

        {/* DAY STRIP - 7 days horizontally scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto px-5 py-4 no-scrollbar scroll-smooth">
          {WEEKDAYS.map((dayKey) => {
            const inf = DAY_INFO[dayKey];
            const isActive = selectedDay === dayKey;
            const isToday = dayKey === 'Wed'; // wed is 10 June 2026 (mocked today)
            const classesCount = routine[dayKey]?.length || 0;

            return (
              <button
                key={dayKey}
                onClick={() => setSelectedDay(dayKey)}
                className={`flex flex-col items-center justify-center p-2 rounded-full min-w-[56px] h-[68px] relative transition-all duration-[120ms] active:scale-[0.97] active:opacity-[0.85] select-none shrink-0 ${
                  isActive 
                    ? 'bg-[#0E0D0B] text-white border-none shadow-1' 
                    : 'bg-white border border-[#E0DED8] text-[#0E0D0B]'
                }`}
              >
                {/* Today indicator: 6px coral dot above the weekday label when inactive */}
                <div className="h-1.5 flex items-center justify-center mb-0.5">
                  {isToday && !isActive && (
                    <span className="w-1.5 h-1.5 bg-[#FF5A36] rounded-full" />
                  )}
                </div>

                <span className="text-[13px] font-bold leading-none font-sans">
                  {inf.label}
                </span>
                
                <span className="font-mono text-[14px] font-semibold leading-none mt-1.5">
                  {inf.dateNum}
                </span>

                {/* Class density dot */}
                {classesCount > 0 && (
                  <span 
                    className={`absolute top-0 right-0 w-2 h-2 rounded-full border border-[#FAFAF9] ${
                      isActive ? 'bg-[#FF5A36]' : 'bg-[#A8A59C]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* DAY HEADER ROW */}
        <div className="flex items-center justify-between py-2 px-5 mt-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] font-sans">
            {totalClasses === 0 ? 'No classes' : `${totalClasses} class${totalClasses > 1 ? 'es' : ''}`} · {selectedDayInfo.dateStr}
          </span>

          <div className="flex items-center gap-2">
            {totalCancelled > 0 && (
              <span className="text-[12px] font-semibold text-[#E5484D] bg-[#FCE8E9] px-2.5 py-0.5 rounded-full leading-none">
                {totalCancelled} cancelled
              </span>
            )}

            <div className="flex items-center gap-1">
              {isCR ? (
                <>
                  <PenLine size={14} className="text-[#FF5A36] stroke-[1.75]" />
                  <span className="text-[12px] font-medium text-[#FF5A36] font-sans">You can edit</span>
                </>
              ) : (
                <>
                  <BookOpen size={14} className="text-[#75726A] stroke-[1.75]" />
                  <span className="text-[12px] font-medium text-[#75726A] font-sans">View only</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CR QUICK ACTIONS ROW (CR role only) */}
        {isCR && (
          <div className="flex items-center gap-3 px-5 mb-4">
            <button
              onClick={openAddSheet}
              className="flex-1 bg-[#FF5A36] text-white text-[14px] font-semibold py-2.5 px-4 rounded-full flex items-center justify-center gap-1.5 active:scale-[0.97] active:opacity-[0.85] transition-all duration-[120ms] shadow-coral-glow cursor-pointer"
            >
              <Plus size={16} className="text-white" />
              <span>Add class</span>
            </button>

            <button
              disabled={!dayDirty(selectedDay)}
              onClick={() => handleResetDay(selectedDay)}
              className={`py-2 px-4 rounded-full border border-[#E0DED8] bg-white text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-[120ms] ${
                dayDirty(selectedDay)
                  ? 'text-[#0E0D0B] opacity-100 active:scale-[0.97] active:opacity-[0.85]'
                  : 'text-[#75726A] opacity-40 cursor-default'
              }`}
            >
              <RotateCcw size={14} className="text-[#0E0D0B]" />
              <span>Reset day</span>
            </button>
          </div>
        )}

        {/* CLASS SLOT CARDS OR EMPTY STATE */}
        <div className="space-y-3 px-5">
          {daySlots.length === 0 ? (
            <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] py-8 px-5 text-center flex flex-col items-center justify-center">
              <CalendarX size={28} className="text-[#A8A59C] stroke-[1.75] mb-3" />
              <p className="text-[15px] font-medium text-[#75726A] font-sans">
                No classes on {DAY_INFO[selectedDay].fullDate.split(',')[0]}
              </p>
              
              {isCR && (
                <button
                  onClick={openAddSheet}
                  className="w-full mt-4 border-1.5 border-dashed border-[#D4D2CC] hover:border-[#FF5A36] text-[#2F2E2A] text-[14px] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-[120ms] active:scale-[0.99] active:opacity-[0.92]"
                >
                  <Plus size={16} className="text-[#75726A]" />
                  <span>Add a class</span>
                </button>
              )}
            </div>
          ) : (
            daySlots.map((slot) => (
              <div 
                key={slot.id}
                className={`bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] overflow-hidden flex flex-col transition-all duration-[120ms] ${
                  slot.cancelled ? 'opacity-72' : ''
                }`}
              >
                {/* Slot Body Row */}
                <div className="flex gap-3.5 p-3.5 items-start">
                  {/* Left: Time Tile */}
                  <div className="w-[52px] shrink-0 text-center flex flex-col items-center justify-center">
                    <span className={`font-mono text-[14px] font-bold tabular-numbers leading-none ${
                      slot.cancelled ? 'text-[#A8A59C]' : 'text-[#0E0D0B]'
                    }`}>
                      {slot.start}
                    </span>
                    <span className="w-full h-[14px] border-l border-[#E8E7E3] block my-1.5 self-center" style={{ marginLeft: '25px' }} />
                    <span className="font-mono text-[12px] font-medium text-[#75726A] tabular-numbers leading-none whitespace-nowrap">
                      {slot.end}
                    </span>
                  </div>

                  {/* Middle and Main */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold text-[#0E0D0B] leading-none tracking-wide">
                        {slot.code}
                      </span>
                      {slot.cancelled && (
                        <span className="bg-[#FCE8E9] text-[#E5484D] font-mono text-[10px] font-bold tracking-[0.05em] px-1.5 py-0.5 rounded uppercase">
                          CANCELLED
                        </span>
                      )}
                    </div>

                    <h4 className={`text-[15px] font-bold text-[#0E0D0B] leading-snug mt-1 truncate ${
                      slot.cancelled ? 'line-through decoration-[#E5484D]' : ''
                    }`}>
                      {slot.name}
                    </h4>

                    {/* Metadata indicators */}
                    <div className="flex items-center gap-1 text-[12px] font-medium text-[#75726A] mt-1 truncate">
                      <MapPin size={14} className="text-[#FF5A36] stroke-[1.75]" />
                      <span className="font-mono text-[#2F2E2A] text-[12px] font-medium">{slot.room}</span>
                      <span className="text-[#D4D2CC] select-none mx-0.5">·</span>
                      <span className="font-sans text-[#75726A] font-medium">{slot.faculty}</span>
                    </div>
                  </div>
                </div>

                {/* CR Footer Action bars */}
                {isCR && (
                  <div className="border-t border-[#ECEAE5] grid grid-cols-2 text-center h-[44px]">
                    <button
                      onClick={() => openEditSheet(slot)}
                      className="flex items-center justify-center gap-1.5 text-[#0E0D0B] text-[14px] font-semibold active:bg-[#F4F4F2] transition-colors duration-[120ms] border-r border-[#ECEAE5]"
                    >
                      <PenLine size={16} className="text-[#4D4B45] stroke-[1.75]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleToggleCancel(selectedDay, slot.id)}
                      className="flex items-center justify-center gap-1.5 text-[14px] font-semibold active:bg-[#F4F4F2] transition-colors duration-[120ms]"
                    >
                      {slot.cancelled ? (
                        <>
                          <RotateCcw size={16} className="text-[#19A974] stroke-[1.75]" />
                          <span className="text-[#0F6B43]">Restore</span>
                        </>
                      ) : (
                        <>
                          <Ban size={16} className="text-[#E5484D] stroke-[1.75]" />
                          <span className="text-[#E5484D]">Cancel class</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* (B) WHOLE-ROUTINE RESET (CR role only, displayed when edits exist) */}
        {isCR && isWholeRoutineDirty() && (
          <div className="px-5 mt-6 mb-8">
            <button
              onClick={() => {
                const confirmed = window.confirm("Reset all 7 days to the original published routine?");
                if (confirmed) {
                  handleResetWholeRoutine();
                }
              }}
              className="w-full bg-white border-1.5 border-[#D4D2CC] text-[#0E0D0B] text-[13px] font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 active:scale-[0.98] active:opacity-[0.85] transition-all duration-[120ms] cursor-pointer"
            >
              <RotateCcw size={14} className="text-[#0E0D0B]" />
              <span>Reset whole routine to original</span>
            </button>
          </div>
        )}
      </div>

      {/* (B) BOTTOM SHEET SHELF */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={checkDismissWithUnsavedChange}
              className="fixed inset-0 z-50 bg-[#0E0D0B]/55 backdrop-blur-sm"
            />

            {/* Slide-Up container sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[28px] shadow-4 flex flex-col overflow-hidden font-sans"
              style={{ maxHeight: '85vh', height: '640px', maxWidth: '390px', margin: '0 auto' }}
            >
              {/* Grab Handle */}
              <div 
                className="w-full flex items-center justify-center py-2 shrink-0 cursor-grab active:cursor-grabbing"
                onClick={checkDismissWithUnsavedChange}
              >
                <div className="w-9 h-1 bg-[#D4D2CC] rounded-full" />
              </div>

              {/* Sheet Header */}
              <div className="px-5 pb-3 flex items-start justify-between shrink-0">
                <div className="space-y-1">
                  <h2 className="text-[22px] font-bold tracking-tight text-[#0E0D0B] leading-none">
                    {sheetMode === 'add' ? 'Add class' : 'Edit class'} · {selectedDayInfo.label}
                  </h2>
                  <p className="font-mono text-[12px] font-medium text-[#75726A] mt-1 tracking-tight">
                    {selectedDayInfo.fullDate} · 42 students
                  </p>
                </div>

                <button
                  onClick={checkDismissWithUnsavedChange}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F4F4F2] active:scale-90"
                >
                  <X size={18} className="text-[#0E0D0B] stroke-[1.75]" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 pb-28">
                
                {/* Preset autoselect tags to help CR conform to 5 courses constraint */}
                <div className="space-y-1.5 p-3.5 bg-[#FFF4F0] border border-[#FFE7DF] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#FF5A36] block mb-1">
                    Presets · Class &amp; Faculty
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCKED_COURSES.map(c => {
                      const isSelected = fieldCode.trim().toUpperCase() === c.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => handleApplyLockedCourse(c)}
                          className={`text-[11px] font-semibold font-mono rounded-lg px-2 py-1 select-none border tracking-wide transition-colors ${
                            isSelected 
                              ? 'bg-[#FF5A36] text-white border-transparent'
                              : 'bg-white text-[#75726A] border-[#E0DED8]'
                          }`}
                        >
                          {c.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1. COURSE CODE */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block">
                    COURSE CODE
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="e.g. SE131"
                    value={fieldCode}
                    onChange={(e) => setFieldCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-[#E0DED8] rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-bold text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                  />
                </div>

                {/* 2. COURSE NAME */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block">
                    COURSE NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structure"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                  />
                </div>

                {/* 3. TIMINGS */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block">
                      START
                    </label>
                    <input
                      type="time"
                      value={fieldStart}
                      onChange={(e) => setFieldStart(e.target.value)}
                      className="w-full bg-white border border-[#E0DED8] rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-semibold text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block">
                      END <span className="opacity-65">(optional)</span>
                    </label>
                    <input
                      type="time"
                      value={fieldEnd}
                      onChange={(e) => setFieldEnd(e.target.value)}
                      className="w-full bg-white border border-[#E0DED8] rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-semibold text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                    />
                  </div>
                </div>

                {/* 4. ROOM */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block flex items-center gap-1">
                    <MapPin size={12} className="text-[#75726A]" /> ROOM
                  </label>
                  
                  {/* Preset room autoselect tags with locked rooms */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {LOCKED_ROOMS.map(r => {
                      const isSelected = fieldRoom === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleApplyLockedRoom(r)}
                          className={`text-[10px] font-semibold font-mono rounded-lg px-2 py-0.5 border tracking-tight transition-all ${
                            isSelected 
                              ? 'bg-[#FF5A36] text-white border-transparent'
                              : 'bg-[#FAFAF9] text-[#75726A] border-[#E0DED8]'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#75726A]">
                      <MapPin size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Room 1504"
                      value={fieldRoom}
                      onChange={(e) => setFieldRoom(e.target.value)}
                      className="w-full bg-white border border-[#E0DED8] rounded-xl pl-10 pr-3.5 py-2.5 font-mono text-[15px] font-medium text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                    />
                  </div>
                </div>

                {/* 5. FACULTY NAME / INITIAL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#75726A] block">
                    FACULTY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. NSL"
                    value={fieldFaculty}
                    onChange={(e) => setFieldFaculty(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-[#0E0D0B] focus:border-[#FF5A36] outline-none"
                  />
                </div>
              </div>

              {/* Sticky footer always visible in bottom sheet context */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ECEAE5] p-5 flex items-center justify-between gap-3 shrink-0">
                {sheetMode === 'add' ? (
                  <>
                    <button
                      onClick={checkDismissWithUnsavedChange}
                      className="py-2.5 px-4.5 bg-white border border-[#E0DED8] text-[#0E0D0B] text-[13px] font-semibold rounded-full active:bg-[#F4F4F2]"
                    >
                      Cancel
                    </button>
                    
                    <button
                      disabled={!fieldCode.trim() || !fieldName.trim() || !fieldStart.trim()}
                      onClick={handleSaveClass}
                      className={`flex-1 bg-[#FF5A36] text-white text-[14px] font-semibold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-coral-glow transition-all ${
                        fieldCode.trim() && fieldName.trim() && fieldStart.trim()
                          ? 'opacity-100 active:scale-[0.98] active:opacity-[0.85]'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span>Add to routine</span>
                      <Send size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="py-2.5 px-4 bg-[#FCE8E9] text-[#E5484D] text-[13px] font-semibold rounded-full flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Trash2 size={14} className="text-[#E5484D]" />
                      <span>Delete</span>
                    </button>

                    <button
                      onClick={handleSaveClass}
                      disabled={!fieldCode.trim() || !fieldName.trim() || !fieldStart.trim()}
                      className={`flex-1 bg-[#FF5A36] text-white text-[14px] font-semibold py-3 px-5 rounded-full flex items-center justify-center gap-2 shadow-coral-glow transition-all ${
                        fieldCode.trim() && fieldName.trim() && fieldStart.trim()
                          ? 'opacity-100 active:scale-[0.98] active:opacity-[0.85]'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span>Save changes</span>
                    </button>
                  </>
                )}
              </div>

              {/* INLINE OVERLAY MODAL FOR REMOVAL DELETIONS CONFIRM */}
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#0E0D0B]/72 flex flex-col justify-end p-5 font-sans"
                  >
                    <motion.div
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      exit={{ y: 20 }}
                      className="bg-white rounded-2xl p-5 space-y-4"
                    >
                      <h3 className="text-[17px] font-bold text-[#0E0D0B] leading-snug">
                        Delete this class?
                      </h3>
                      <p className="text-[14px] font-medium text-[#75726A] leading-relaxed">
                        It will be removed from {DAY_INFO[selectedDay].fullDate.split(',')[0]}'s routine permanently.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 py-2.5 bg-[#F4F4F2] text-[#0E0D0B] text-[13px] font-semibold rounded-full hover:bg-opacity-80 active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteClass}
                          className="flex-1 py-2.5 bg-[#E5484D] text-white text-[13px] font-semibold rounded-full hover:bg-opacity-95 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
