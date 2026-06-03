import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, CalendarDays, MoreVertical, 
  MapPin, Clock, BookOpen, ClipboardCheck, Edit2, Ban, 
  Check, AlertTriangle, CalendarRange, Columns, X, CheckCheck
} from 'lucide-react';

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

interface RoutineTabProps {
  classes: ClassSlot[];
  onTriggerToast: (msg: string) => void;
  onOpenAttendance: (slot: ClassSlot, updateMode: boolean) => void;
  onOpenCancel: (slot: ClassSlot) => void;
  onNavigateToCourse: (courseCode: string) => void;
}

const SECTION_DATA = [
  { id: 'all', label: 'All sections', count: 121 },
  { id: 'SWE-M', label: 'SWE-M · 42', count: 42, color: '#FF5A36' },
  { id: 'SWE-N', label: 'SWE-N · 38', count: 38, color: '#2E7CF6' },
  { id: 'SWE-O', label: 'SWE-O · 41', count: 41, color: '#FFB020' }
];

const WEEKLY_SCHEDULE_MASTER: Record<string, ClassSlot[]> = {
  'Sat': [
    { id: 's1', code: 'SE131', name: 'Data Structure (Theory)', section: 'SWE-O', room: 'Room 411', timeStart: '09:00 am', timeEnd: '10:30 am', slotType: 'PAST', attendedCount: 39 },
    { id: 's2', code: 'SE131', name: 'Data Structure (Theory)', section: 'SWE-N', room: 'Room 308', timeStart: '11:00 am', timeEnd: '12:30 pm', slotType: 'PAST', attendedCount: 35 }
  ],
  'Sun': [
    { id: 's3', code: 'SE131', name: 'Data Structure (Lab)', section: 'SWE-O', room: 'Lab-5', timeStart: '08:30 am', timeEnd: '10:00 am', slotType: 'PAST', attendedCount: 41 },
    { id: 's4', code: 'SE132', name: 'Lab Data Structure', section: 'SWE-M', room: 'Room 710', timeStart: '10:00 am', timeEnd: '11:30 am', slotType: 'PAST', attendedCount: 42 }
  ],
  'Mon': [],
  'Tue': [
    { id: 's5', code: 'SE131', name: 'Data Structure (Theory)', section: 'SWE-M', room: 'Room 1504', timeStart: '09:00 am', timeEnd: '10:30 am', slotType: 'PAST', attendedCount: 40 },
    { id: 's6', code: 'SE131', name: 'Data Structure (Lab)', section: 'SWE-N', room: 'Lab-3', timeStart: '11:00 am', timeEnd: '12:30 pm', slotType: 'PAST', attendedCount: 37 }
  ],
  'Wed': [
    { id: '1', code: 'SE132', name: 'Lab M1 Data Structure', section: 'SWE-M', room: 'Room 710', timeStart: '08:30 am', timeEnd: '10:00 am', slotType: 'PAST', attendedCount: 40 },
    { id: '2', code: 'SE131', name: 'Data Structure', section: 'SWE-M', room: 'Room 1504', timeStart: '10:00 am', timeEnd: '11:30 am', slotType: 'NOW' },
    { id: '3', code: 'SE132', name: 'Lab M2 Data Structure', section: 'SWE-M', room: 'Room AB3-106', timeStart: '01:00 pm', timeEnd: '02:30 pm', slotType: 'UPCOMING' }
  ],
  'Thu': [],
  'Fri': []
};

const DAY_NAMES = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SHORT_DAY_NAMES = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function FacultyRoutineTab({ classes, onTriggerToast, onOpenAttendance, onOpenCancel, onNavigateToCourse }: RoutineTabProps) {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewPill, setViewPill] = useState<'Day' | 'Week' | 'Month'>('Day');
  
  // Date navigator states
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 10)); // Wed 10 Jun 2026
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempDatePickerDate, setTempDatePickerDate] = useState<string>('2026-06-10');

  // Month navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 5, 1)); // Jun 2026

  // Kebab popup open ID
  const [kebabId, setKebabId] = useState<string | null>(null);

  // Filter helper functions
  const getSectionBadgeStyle = (section: string) => {
    switch (section) {
      case 'SWE-M': return 'bg-[#FFF4F0] text-[#FF5A36]';
      case 'SWE-N': return 'bg-[#E5EFFE] text-[#1B4B9E]';
      case 'SWE-O': return 'bg-[#FFF1D6] text-[#7A4A00]';
      default: return 'bg-ink-100 text-ink-700';
    }
  };

  const getTypeChip = (name: string) => {
    const isLab = name.toLowerCase().includes('lab');
    if (isLab) return { bg: 'bg-[#E5EFFE]', fg: 'text-[#1B4B9E]', label: 'LAB' };
    return { bg: 'bg-ink-100', fg: 'text-ink-700', label: 'THEORY' };
  };

  const getDayOfWeekName = (date: Date): string => {
    const index = date.getDay(); // 0 is Sun, 6 is Sat
    // map standard Sunday = 0, Monday = 1... to Academic Sat=0, Sun=1
    const academicDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return academicDays[index];
  };

  const getShortDayOfWeekName = (date: Date): string => {
    const name = getDayOfWeekName(date);
    return name.slice(0, 3);
  };

  // Shift current date ±1 day
  const handleShiftDate = (direction: number) => {
    const updated = new Date(currentDate);
    updated.setDate(currentDate.getDate() + direction);
    // Bind to Sat 6 Jun -> Fri 12 Jun 2026 range for our mock calendar
    if (updated.getFullYear() === 2026 && updated.getMonth() === 5 && updated.getDate() >= 6 && updated.getDate() <= 12) {
      setCurrentDate(updated);
    } else {
      setCurrentDate(updated); // Allow free scroll but toast reminder
      onTriggerToast(`Navigating to ${updated.getDate()} ${updated.toLocaleString('default', { month: 'short' })}`);
    }
  };

  // Day list getter
  const getSlotsForDate = (date: Date): ClassSlot[] => {
    const dayName = getShortDayOfWeekName(date);
    let daySlots = WEEKLY_SCHEDULE_MASTER[dayName] || [];
    
    // Wed 10 Jun should always fallback to our interactive state-aware 'classes' props
    if (dayName === 'Wed' && date.getDate() === 10 && date.getMonth() === 5) {
      daySlots = classes;
    }

    if (selectedSection === 'all') return daySlots;
    return daySlots.filter(s => s.section === selectedSection);
  };

  return (
    <div className="space-y-[16px] select-none font-sans">
      {/* APP HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-[#ECEAE5]">
        <div>
          <h1 className="text-[32px] font-extrabold text-ink-900 tracking-tight leading-none">Routine</h1>
          <p className="font-mono text-[12px] text-ink-500 font-semibold mt-2">
            Dr. NSL &middot; Summer 2026
          </p>
        </div>
        <button
          onClick={() => onTriggerToast('Notification preferences open')}
          className="w-[44px] h-[44px] bg-transparent rounded-[10px] flex items-center justify-center border border-[#ECEAE5] relative cursor-pointer active:scale-95 duration-120"
        >
          <CalendarDays size={22} className="text-ink-900" />
        </button>
      </div>

      {/* FILTER CHIP LIST ROW 1 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {SECTION_DATA.map((sec) => {
          const isActive = selectedSection === sec.id;
          let activeStyleClass = 'bg-ink-900 text-white';
          if (isActive && sec.id === 'SWE-M') activeStyleClass = 'bg-[#FFF4F0] border-[1.5px] border-[#FF5A36] text-[#FF5A36] font-bold';
          if (isActive && sec.id === 'SWE-N') activeStyleClass = 'bg-[#E5EFFE] border-[1.5px] border-[#1B4B9E] text-[#1B4B9E] font-bold';
          if (isActive && sec.id === 'SWE-O') activeStyleClass = 'bg-[#FFF1D6] border-[1.5px] border-[#7A4A00] text-[#7A4A00] font-bold';

          return (
            <motion.button
              key={sec.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedSection(sec.id);
                onTriggerToast(`Filtered: ${sec.label}`);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full border shrink-0 transition-all cursor-pointer ${
                isActive ? activeStyleClass : 'bg-white border-[#E0DED8] text-ink-900'
              }`}
            >
              {sec.label}
            </motion.button>
          );
        })}
      </div>

      {/* VIEW SEGMENTED PILL */}
      <div className="bg-ink-100 p-1 rounded-full flex select-none">
        {(['Day', 'Week', 'Month'] as const).map((view) => {
          const isActive = viewPill === view;
          return (
            <button
              key={view}
              onClick={() => {
                setViewPill(view);
                setKebabId(null);
              }}
              className={`flex-1 py-1.5 text-center text-xs font-bold rounded-full border-none transition-all cursor-pointer ${
                isActive ? 'bg-white text-ink-900 shadow-sm' : 'bg-transparent text-ink-500 font-medium'
              }`}
            >
              {view}
            </button>
          );
        })}
      </div>

      {/* SUB-SCREEN DYNAMIC PANEL */}
      <div className="space-y-[16px]">
        {/* DAY VIEW */}
        {viewPill === 'Day' && (
          <div className="space-y-[16px]">
            {/* Date Navigator */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleShiftDate(-1)}
                className="w-9 h-9 border border-[#E0DED8] bg-white text-ink-900 rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div 
                onClick={() => {
                  setTempDatePickerDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`);
                  setIsDatePickerOpen(true);
                }}
                className="text-center cursor-pointer select-none"
              >
                {/* Highlight wednesday today */}
                <h3 className={`text-base font-extrabold text-ink-900 ${currentDate.getDate() === 10 && currentDate.getMonth() === 5 ? 'text-[#FF5A36]' : ''}`}>
                  {currentDate.getDate()} {currentDate.toLocaleString('default', { month: 'short' })} {currentDate.getFullYear()}
                </h3>
                <p className="font-mono text-xs text-ink-500 font-medium mt-0.5">{getDayOfWeekName(currentDate)}</p>
              </div>

              <button 
                onClick={() => handleShiftDate(1)}
                className="w-9 h-9 border border-[#E0DED8] bg-white text-ink-900 rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* List slots */}
            <div className="space-y-3">
              {getSlotsForDate(currentDate).length === 0 ? (
                <div className="bg-white border border-[#ECEAE5] rounded-[14px] shadow-1 p-8 text-center flex flex-col items-center justify-center gap-2">
                  <CalendarRange size={28} className="text-ink-400" />
                  <span className="text-sm font-bold text-ink-900">No classes on {getDayOfWeekName(currentDate)}</span>
                  <span className="text-xs text-ink-400">Enjoy the day off</span>
                </div>
              ) : (
                getSlotsForDate(currentDate).map((slot) => {
                  const isNow = slot.slotType === 'NOW';
                  const isPast = slot.slotType === 'PAST';
                  const tChip = getTypeChip(slot.name);

                  return (
                    <div 
                      key={slot.id}
                      onClick={() => onTriggerToast(`Open &middot; ${slot.code} &middot; ${slot.section}`)}
                      className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 flex items-stretch cursor-pointer select-none relative h-[94px] overflow-visible active:scale-[0.99] duration-120"
                    >
                      {/* Left Rails */}
                      <div className={`w-[74px] shrink-0 flex flex-col items-center justify-center text-center font-mono rounded-l-[14px] ${
                        isNow && !slot.cancelled ? 'bg-[#FFF4F0] text-[#FF5A36]' : 'bg-[#FAFAF9] text-ink-600'
                      } ${isPast ? 'opacity-60' : ''}`}>
                        <span className="text-sm font-bold tabular-nums">{slot.timeStart.split(' ')[0]}</span>
                        <span className={`w-[1px] h-[12px] my-1 ${isNow && !slot.cancelled ? 'bg-[#FFD9CD]' : 'bg-[#E8E7E3]'}`} />
                        <span className="text-[10px] opacity-70 tabular-nums">{slot.timeEnd}</span>
                      </div>

                      {/* Content Middle */}
                      <div className="flex-1 min-w-0 p-[12px] flex flex-col justify-center text-left">
                        <div className="flex items-center gap-[6.5px] font-mono text-[10px] text-[#2F2E2A] font-bold">
                          <span>{slot.code}</span>
                          <span>&middot;</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold shadow-sm ${getSectionBadgeStyle(slot.section)}`}>{slot.section}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${tChip.bg} ${tChip.fg}`}>{tChip.label}</span>
                        </div>

                        <h4 className={`text-sm font-extrabold text-ink-900 leading-snug tracking-tight mt-[4px] truncate ${slot.cancelled ? 'line-through opacity-40' : ''}`}>
                          {slot.name}
                        </h4>

                        <div className="flex items-center gap-[6px] mt-1 text-xs">
                          <span className="text-xs text-ink-500 font-medium shrink-0">Room {slot.room.replace('Room ', '')}</span>
                          {slot.cancelled ? (
                            <span className="bg-[#FFF1F2] text-[#E5484D] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1.5px] tracking-wide shrink-0">
                              Cancelled
                            </span>
                          ) : slot.attendedCount !== undefined ? (
                            <span className="bg-[#E5F7EE] text-[#0F6B43] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1px] tracking-wide inline-flex items-center gap-0.5 shrink-0">
                              <CheckCheck size={10} strokeWidth={2.5} /> Attended &middot; {slot.attendedCount}/42
                            </span>
                          ) : isNow ? (
                            <span className="bg-[#FFF4F0] text-[#FF5A36] text-[9px] font-mono font-bold uppercase rounded-full px-1.5 py-[1px] tracking-wide shrink-0">
                              In session
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Right Kebab */}
                      <div className="p-2 shrink-0 flex items-center justify-center relative select-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setKebabId(kebabId === slot.id ? null : slot.id);
                          }}
                          className="w-[36px] h-[36px] hover:bg-ink-100 rounded-full flex items-center justify-center text-ink-500 hover:text-ink-900 border-none bg-transparent cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Popover list */}
                        {kebabId === slot.id && (
                          <div className="absolute right-4 top-12 bg-white rounded-[10px] border border-[#ECEAE5] shadow-3 z-30 min-w-[190px] py-1 select-none font-sans text-left">
                            {!slot.cancelled ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenAttendance(slot, slot.attendedCount !== undefined);
                                  setKebabId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent cursor-pointer"
                              >
                                <ClipboardCheck size={14} className="text-[#FF5A36]" />
                                <span>{slot.attendedCount !== undefined ? 'Update attendance' : 'Take attendance'}</span>
                              </button>
                            ) : null}

                            {!slot.cancelled && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenCancel(slot);
                                  setKebabId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-[#E5484D] font-semibold text-xs hover:bg-[#FFF1F2] border-none bg-transparent cursor-pointer"
                              >
                                <Ban size={14} />
                                <span>Cancel class</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToCourse(slot.code);
                                setKebabId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent cursor-pointer"
                            >
                              <BookOpen size={14} className="text-ink-600" />
                              <span>View course</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTriggerToast(`Edit slot &middot; ${slot.code} &middot; Slot ${slot.id}`);
                                setKebabId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-900 font-medium text-xs hover:bg-[#F4F4F2] border-none bg-transparent cursor-pointer"
                            >
                              <Edit2 size={13} className="text-ink-650" />
                              <span>Edit slot</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {viewPill === 'Week' && (
          <div className="space-y-[16px]">
            {/* Week header */}
            <div className="flex items-center justify-between px-2">
              <button 
                onClick={() => onTriggerToast('Previous week')}
                className="w-9 h-9 border border-[#E0DED8] bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-sm font-extrabold text-ink-900">
                6 &ndash; 12 Jun 2026
              </h3>
              <button 
                onClick={() => onTriggerToast('Next week')}
                className="w-9 h-9 border border-[#E0DED8] bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* List 7 days */}
            <div className="space-y-4">
              {SHORT_DAY_NAMES.map((dayTag, index) => {
                const dayDate = 6 + index; // June 6 is sat
                const isToday = dayTag === 'Wed'; // Wednesday 10th
                const matchedSlots = (WEEKLY_SCHEDULE_MASTER[dayTag] || []).filter(s => selectedSection === 'all' || s.section === selectedSection);
                
                return (
                  <div key={dayTag} className="space-y-1.5 text-left select-none">
                    <div 
                      onClick={() => {
                        const d = new Date(2026, 5, dayDate);
                        setCurrentDate(d);
                        setViewPill('Day');
                      }}
                      className="flex items-center gap-2.5 px-2 cursor-pointer"
                    >
                      {isToday && <span className="w-[6px] h-[6px] bg-[#FF5A36] rounded-full" />}
                      <span className={`text-[12px] font-extrabold uppercase font-mono tracking-wide ${isToday ? 'text-[#FF5A36]' : 'text-ink-900'}`}>
                        {dayTag === 'Wed' ? 'WEDNESDAY' : dayTag === 'Sat' ? 'SATURDAY' : dayTag === 'Sun' ? 'SUNDAY' : dayTag === 'Mon' ? 'MONDAY' : dayTag === 'Tue' ? 'TUESDAY' : dayTag === 'Thu' ? 'THURSDAY' : 'FRIDAY'} {dayDate}
                      </span>
                      <span className="text-[10px] text-ink-400 font-semibold">&middot; Jun 2026</span>
                      <div className="flex-1" />
                      <span className="text-[10.5px] font-mono text-ink-500 font-bold">
                        {matchedSlots.length > 0 ? `${matchedSlots.length} classes` : 'Off day'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {matchedSlots.length === 0 ? (
                        <div className="bg-white border border-[#ECEAE5] rounded-[10px] p-2.5 text-center text-xs text-ink-400">
                          No classes
                        </div>
                      ) : (
                        matchedSlots.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => onTriggerToast(`Open &middot; ${item.code} &middot; ${item.section}`)}
                            className="bg-white border border-[#ECEAE5] rounded-[12px] p-3 flex gap-2.5 items-center cursor-pointer active:scale-[0.99] duration-120 hover:border-ink-300 shadow-sm"
                          >
                            <span className="font-mono text-xs font-bold text-[#FF5A36] shrink-0 leading-none">
                              {item.timeStart.split(' ')[0]}
                            </span>
                            <span className="w-[1px] h-[14px] bg-ink-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-ink-900 font-bold">{item.code}</span>
                                <span className={`px-1 rounded font-mono text-[8px] font-extrabold ${getSectionBadgeStyle(item.section)}`}>{item.section}</span>
                              </div>
                              <h4 className="text-xs font-bold text-ink-900 truncate">{item.name}</h4>
                            </div>
                            <span className="text-[10px] text-ink-500 font-semibold font-mono">Room {item.room.replace('Room ', '')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MONTH VIEW */}
        {viewPill === 'Month' && (
          <div className="space-y-[16px]">
            {/* Month header row */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onTriggerToast('Previous month')}
                className="w-9 h-9 border border-[#E0DED8] bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-base font-extrabold text-ink-900">
                June 2026
              </h3>
              <button 
                onClick={() => onTriggerToast('Next month')}
                className="w-9 h-9 border border-[#E0DED8] bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days columns headers (Academic Sat-first) */}
            <div className="grid grid-cols-7 text-center">
              {['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'].map((day) => (
                <span key={day} className="text-[10px] font-mono font-bold text-ink-500 uppercase tracking-widest py-1">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar grid inside a universal card */}
            <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-3.5 shadow-1">
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center select-none">
                {/* June 2026 calendar structure: 
                    June 1, 2026 is Monday. Monday academic is index 2 (Sa=0, Su=1, Mo=2). 
                    So let's pad the first 2 slots index with past May days */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square w-10 flex flex-col items-center justify-center text-[11px] text-ink-300 font-medium font-mono select-none">
                    {30 + i} {/* May 30, May 31 */}
                  </div>
                ))}

                {/* June dates 1 to 30 */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dateNum = i + 1;
                  const academicDayIndex = (i + 2) % 7; // offset for Saturday start
                  const shortDay = SHORT_DAY_NAMES[academicDayIndex];
                  const hasClasses = WEEKLY_SCHEDULE_MASTER[shortDay]?.length > 0;
                  
                  // Wed 10 Jun highlighting
                  const isToday = dateNum === 10;
                  
                  // Count dots filter
                  const slotsCount = (WEEKLY_SCHEDULE_MASTER[shortDay] || [])
                    .filter(s => selectedSection === 'all' || s.section === selectedSection).length;

                  return (
                    <div 
                      key={`day-${dateNum}`}
                      onClick={() => {
                        const dateObj = new Date(2026, 5, dateNum);
                        setCurrentDate(dateObj);
                        setViewPill('Day');
                        onTriggerToast(`Selected ${dateNum} June`);
                      }}
                      className={`aspect-square w-10 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all select-none ${
                        isToday 
                          ? 'bg-[#FFE7DF] border border-[#FF5A36]' 
                          : 'bg-transparent hover:bg-ink-100'
                      }`}
                    >
                      <span className={`text-[12px] font-mono font-bold leading-none ${
                        isToday ? 'text-[#FF5A36]' : 'text-ink-900'
                      }`}>
                        {dateNum}
                      </span>
                      
                      {/* Dots indicators below number */}
                      {slotsCount > 0 && (
                        <div className="flex gap-[2px] mt-1 shrink-0">
                          {Array.from({ length: Math.min(slotsCount, 3) }).map((_, dotIdx) => (
                            <span 
                              key={dotIdx}
                              className={`w-1 h-1 rounded-full shrink-0 ${isToday ? 'bg-[#FF5A36]' : 'bg-ink-400'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legends Row */}
            <div className="flex items-center justify-between text-[11.5px] text-ink-500 font-medium px-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36]" /> Today
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-ink-400" /> Class scheduled
              </span>
              <span className="font-mono text-ink-400 text-[10.5px]">Academic calendar week</span>
            </div>
          </div>
        )}
      </div>

      {/* RATIVE NATIVE-STYLE DATE PICKER MODAL SHEET */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-55 flex flex-col justify-end font-sans overflow-hidden">
          <div 
            onClick={() => setIsDatePickerOpen(false)}
            className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
          />
          <div className="relative w-full max-w-md mx-auto bg-white rounded-t-[28px] p-5 shadow-4 flex flex-col z-10 text-left">
            <div className="w-[40px] h-[4px] bg-[#D4D2CC] rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-ink-900">Select Date</h3>
              <button 
                onClick={() => setIsDatePickerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAF9]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Native Input simulation for dates */}
              <input 
                type="date"
                value={tempDatePickerDate}
                onChange={(e) => setTempDatePickerDate(e.target.value)}
                className="w-full border border-[#E0DED8] p-3 text-sm font-semibold rounded-xl text-ink-900 bg-[#FAFAF9] outline-none"
              />
              
              <div className="flex gap-2 justify-end border-t border-[#ECEAE5] pt-3">
                <button 
                  onClick={() => setIsDatePickerOpen(false)}
                  className="bg-transparent border border-[#E0DED8] px-4 py-2 rounded-full text-xs font-bold text-ink-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const splitted = tempDatePickerDate.split('-');
                    if (splitted.length === 3) {
                      const newD = new Date(parseInt(splitted[0]), parseInt(splitted[1]) - 1, parseInt(splitted[2]));
                      setCurrentDate(newD);
                      setIsDatePickerOpen(false);
                      onTriggerToast(`Navigated to ${newD.toLocaleDateString()}`);
                    }
                  }}
                  className="bg-[#FF5A36] px-5 py-2 rounded-full text-xs font-bold text-white shadow-coral-glow"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
