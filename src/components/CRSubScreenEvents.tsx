import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  X, 
  Check, 
  MoreVertical, 
  PenLine, 
  Trash2, 
  UserRound, 
  Calendar, 
  Clock, 
  Send 
} from 'lucide-react';
import { User } from '../types';

export interface EventItem {
  id: string;
  tabType: 'Upcoming' | 'Past';
  bannerColor: 'ink' | 'coral' | 'sand';
  day: string;
  month: string;
  title: string;
  fullDate: string;
  timeLabel: string;
  location: string;
  description: string;
  organizer: string;
  goingCount: number;
  initialsList: string[];
  userRSVP: boolean; // true if STUDENT has RSVP'd
  dateISO?: string;
}

const initialEvents: EventItem[] = [
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
    userRSVP: false,
    dateISO: '2026-06-14T09:00:00'
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
    userRSVP: true,
    dateISO: '2026-06-19T16:00:00'
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
    userRSVP: false,
    dateISO: '2026-03-10T18:00:00'
  }
];

export default function CRSubScreenEvents({
  onBack,
  triggerToast,
  events,
  setEvents,
  currentUser
}: {
  onBack: () => void;
  triggerToast: (msg: string) => void;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  currentUser: User;
}) {
  const [subRole, setSubRole] = useState<'Student' | 'CR'>('CR');
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  // Sheet Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form states matching screenshot fields exactly
  const [compTitle, setCompTitle] = useState('');
  const [compDay, setCompDay] = useState('14');
  const [compDateTimeLabel, setCompDateTimeLabel] = useState('');
  const [compMonth, setCompMonth] = useState<'JUN' | 'JUL' | 'AUG' | 'SEP'>('JUN');
  const [compLocation, setCompLocation] = useState('');
  const [compDescription, setCompDescription] = useState('');
  const [compBannerColor, setCompBannerColor] = useState<'ink' | 'coral' | 'sand'>('coral');

  // Validation feedback state
  const [valErrors, setValErrors] = useState<{
    title?: boolean;
    day?: boolean;
    dateTime?: boolean;
    location?: boolean;
  }>({});

  // Popup Kebab active states
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Deletion confirm modal state
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  // Draft protection state
  const [discardedDraft, setDiscardedDraft] = useState<{
    id?: string;
    title: string;
    pickedDate: string;
    pickedTime: string;
    location: string;
    description: string;
    bannerColor: 'ink' | 'coral' | 'sand';
    isEditing: boolean;
    editingEvent: EventItem | null;
  } | null>(null);
  const [showDraftToast, setShowDraftToast] = useState(false);

  // Timer handling for draft auto-dismiss
  useEffect(() => {
    if (showDraftToast) {
      const timer = setTimeout(() => {
        setShowDraftToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showDraftToast]);

  // Gate checker function
  const isGated = (user: any) => {
    if (!user) return false;
    
    // Check role, case-insensitive
    const role = (user.role || '').trim().toLowerCase();
    if (role !== 'cr') return false;

    // Check department code
    let dept = '';
    if (typeof user.department === 'object' && user.department !== null) {
      dept = (user.department.code || '').trim().toUpperCase();
    } else {
      dept = (user.department || '').trim().toUpperCase();
    }
    if (dept !== 'SWE') return false;

    // Check section code (e.g. "SWE-M" -> "M")
    let sec = '';
    if (typeof user.section === 'object' && user.section !== null) {
      sec = (user.section.code || '').trim().toUpperCase();
    } else {
      const secStr = (user.section || '').trim().toUpperCase();
      if (secStr.includes('-')) {
        const parts = secStr.split('-');
        sec = (parts[parts.length - 1] || '').trim().toUpperCase();
      } else {
        sec = secStr;
      }
    }
    if (sec !== 'M') return false;

    // Check batch
    const batch = user.batch;
    if (batch !== 46) return false;

    return true;
  };

  const isAuthoringAllowed = isGated(currentUser) && subRole === 'CR';

  // Format date helper: e.g. "2026-06-14" -> "Sat 14 Jun 2026"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    if (isNaN(date.getTime())) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format time helper: e.g. "16:00" -> "4:00 pm"
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return '';
    let hh = parseInt(parts[0], 10);
    const mm = parts[1];
    const ampm = hh >= 12 ? 'pm' : 'am';
    hh = hh % 12;
    if (hh === 0) hh = 12;
    return `${hh}:${mm} ${ampm}`;
  };

  // Convert "Sat 14 Jun" -> "2026-06-14"
  const parseExistingDate = (fullDate: string, monthAbbrev: string) => {
    try {
      const monthsMap: Record<string, string> = {
        'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
        'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
      };
      const mStr = monthsMap[monthAbbrev.trim().toUpperCase()] || '06';
      const dayMatch = fullDate.match(/\d+/);
      const dStr = dayMatch ? dayMatch[0].padStart(2, '0') : '14';
      return `2026-${mStr}-${dStr}`;
    } catch {
      return '2026-06-14';
    }
  };

  // Convert "4:00 pm" -> "16:00"
  const parseExistingTime = (timeLabel: string) => {
    try {
      const cleaned = timeLabel.toLowerCase().trim();
      const isPm = cleaned.includes('pm');
      const isAm = cleaned.includes('am');
      const match = cleaned.match(/(\d+):(\d+)/);
      if (!match) return '09:00';
      let hh = parseInt(match[1], 10);
      const mm = match[2].padStart(2, '0');
      if (isPm && hh < 12) hh += 12;
      if (isAm && hh === 12) hh = 0;
      return `${String(hh).padStart(2, '0')}:${mm}`;
    } catch {
      return '09:00';
    }
  };

  // Derived attributes from date picker selection
  const computeEventDetailsFromDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) {
      return {
        day: '14',
        month: 'JUN',
        fullDate: 'Sat 14 Jun',
        timeLabel: '4:00 pm'
      };
    }
    const parts = dateStr.split('-');
    const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    
    const daysAbbrev = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsAbbrev = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const dayName = daysAbbrev[dateObj.getDay()];
    const dayNum = String(dateObj.getDate());
    const monthNameRaw = monthsAbbrev[dateObj.getMonth()];
    
    const monthNameCapitalised = monthNameRaw.charAt(0) + monthNameRaw.slice(1).toLowerCase();
    const fullDate = `${dayName} ${dayNum} ${monthNameCapitalised}`;
    const timeLabel = formatTime(timeStr);
    
    return {
      day: dayNum,
      month: monthNameRaw,
      fullDate,
      timeLabel
    };
  };

  const getCRFirstName = () => {
    if (currentUser && currentUser.name) {
      return currentUser.name.split(' ')[0];
    }
    return 'Sadia';
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setCompTitle('');
    setCompDay('14');
    setCompDateTimeLabel('');
    setCompMonth('JUN');
    setCompLocation('');
    setCompDescription('');
    setCompBannerColor('coral');
    setValErrors({});
    setIsComposerOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setCompTitle(evt.title);
    setCompDay(evt.day);
    setCompMonth((evt.month || 'JUN') as any);
    setCompDateTimeLabel(`${evt.fullDate}${evt.timeLabel ? ' · ' + evt.timeLabel : ''}`);
    setCompLocation(evt.location);
    setCompDescription(evt.description);
    setCompBannerColor(evt.bannerColor);
    setValErrors({});
    setIsComposerOpen(true);
    setActiveDropdownId(null);
  };

  const handleDismissWithProtection = () => {
    const hasAnyContent = 
      compTitle.trim() !== '' || 
      compDay !== '14' || 
      compDateTimeLabel.trim() !== '' || 
      compLocation.trim() !== '' || 
      compDescription.trim() !== '';

    if (hasAnyContent) {
      setDiscardedDraft({
        title: compTitle,
        pickedDate: compDay,
        pickedTime: compDateTimeLabel,
        location: compLocation,
        description: compDescription,
        bannerColor: compBannerColor,
        isEditing: editingEvent !== null,
        editingEvent
      });
      setShowDraftToast(true);
    }
    setIsComposerOpen(false);
  };

  const scrollFieldIntoView = (fieldId: string) => {
    if (typeof window !== 'undefined' && window.document) {
      const el = window.document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleSaveEvent = () => {
    const errors: {
      title?: boolean;
      day?: boolean;
      dateTime?: boolean;
      location?: boolean;
    } = {};

    if (!compTitle.trim()) {
      errors.title = true;
    }
    if (!compDay.trim()) {
      errors.day = true;
    }
    if (!compDateTimeLabel.trim()) {
      errors.dateTime = true;
    }
    if (!compLocation.trim()) {
      errors.location = true;
    }

    setValErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.title) {
        triggerToast('Add a title first');
        scrollFieldIntoView('titleField');
      } else if (errors.day) {
        triggerToast('Set a day');
        scrollFieldIntoView('dayField');
      } else if (errors.dateTime) {
        triggerToast('Set date and time');
        scrollFieldIntoView('dateTimeField');
      } else if (errors.location) {
        triggerToast('Add a location');
        scrollFieldIntoView('locationField');
      }
      return;
    }

    let fullDate = compDateTimeLabel.trim();
    let timeLabel = '';
    if (compDateTimeLabel.includes('·')) {
      const parts = compDateTimeLabel.split('·');
      fullDate = parts[0].trim();
      timeLabel = parts[1].trim();
    } else if (compDateTimeLabel.includes(' - ')) {
      const parts = compDateTimeLabel.split(' - ');
      fullDate = parts[0].trim();
      timeLabel = parts[1].trim();
    } else {
      // Look for a time pattern (e.g. "9:00 am")
      const timeMatch = compDateTimeLabel.match(/\d+:\d+\s*(?:am|pm|AM|PM)/i);
      if (timeMatch) {
        timeLabel = timeMatch[0];
        fullDate = compDateTimeLabel.replace(timeMatch[0], '').replace(/·/g, '').trim();
      }
    }

    // Determine tabType (Upcoming vs Past) based on month and day
    const monthsMap: Record<string, number> = {
      'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
    };
    const mNum = monthsMap[compMonth.toUpperCase()] !== undefined ? monthsMap[compMonth.toUpperCase()] : 5;
    const dNum = parseInt(compDay, 10) || 14;
    
    // Default to the year 2026 as in the sample static dataset
    const eventDate = new Date(2026, mNum, dNum);
    const now = new Date();
    const isPast = eventDate.getTime() < now.getTime();
    const tabType = isPast ? 'Past' : 'Upcoming';
    
    // Construct valid dateISO
    const displayMonthNum = String(mNum + 1).padStart(2, '0');
    const displayDayStr = String(dNum).padStart(2, '0');
    let displayTimeStr = '09:00:00';
    if (timeLabel) {
      const tClean = timeLabel.toLowerCase().trim();
      const pm = tClean.includes('pm');
      const am = tClean.includes('am');
      const numMatch = tClean.match(/(\d+):(\d+)/);
      if (numMatch) {
        let hr = parseInt(numMatch[1], 10);
        const min = numMatch[2];
        if (pm && hr < 12) hr += 12;
        if (am && hr === 12) hr = 0;
        displayTimeStr = `${String(hr).padStart(2, '0')}:${min}:00`;
      }
    }
    const dateISO = `2026-${displayMonthNum}-${displayDayStr}T${displayTimeStr}`;

    if (editingEvent) {
      // Edit
      setEvents(prev => prev.map(e => {
        if (e.id === editingEvent.id) {
          return {
            ...e,
            title: compTitle.trim(),
            day: compDay,
            month: compMonth,
            fullDate,
            timeLabel,
            location: compLocation.trim(),
            description: compDescription.trim(),
            bannerColor: compBannerColor,
            tabType,
            dateISO
          };
        }
        return e;
      }));
      triggerToast('Event updated');
    } else {
      // New Upcoming
      const newEvent: EventItem = {
        id: `evt-${Date.now()}`,
        tabType,
        bannerColor: compBannerColor,
        day: compDay,
        month: compMonth,
        title: compTitle.trim(),
        fullDate,
        timeLabel,
        location: compLocation.trim(),
        description: compDescription.trim(),
        organizer: `CR ${getCRFirstName()}`,
        goingCount: 1,
        initialsList: ['SR'],
        userRSVP: false,
        dateISO
      };
      setEvents(prev => [newEvent, ...prev]);
      triggerToast('Event published — 42 students notified');
    }

    setIsComposerOpen(false);
  };

  const handleToggleRSVP = (evtId: string, title: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === evtId) {
        const nextRSVP = !e.userRSVP;
        const countDiff = nextRSVP ? 1 : -1;
        const nextCount = Math.max(0, e.goingCount + countDiff);
        
        if (nextRSVP) {
          triggerToast(`Marked going — ${title}`);
        } else {
          triggerToast('RSVP cancelled');
        }

        return {
          ...e,
          userRSVP: nextRSVP,
          goingCount: nextCount
        };
      }
      return e;
    }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 280) {
      setCompDescription(val);
    }
  };

  const filteredEvents = events.filter(e => e.tabType === activeTab);

  // Styled helper for card banners
  const getCardBannerStyles = (color: 'coral' | 'ink' | 'sand') => {
    if (color === 'coral') {
      return {
        bgClass: 'bg-[#FF5A36]',
        textClass: 'text-white',
        secTextClass: 'text-white/70',
        tileBgClass: 'bg-white/15',
        extraStyle: { boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }
      };
    }
    if (color === 'ink') {
      return {
        bgClass: 'bg-[#0E0D0B]',
        textClass: 'text-white',
        secTextClass: 'text-white/70',
        tileBgClass: 'bg-white/15',
        extraStyle: {}
      };
    }
    // sand
    return {
      bgClass: 'bg-[#FFF1D6] border-b-[2px] border-[#FF5A36]',
      textClass: 'text-[#7A4A00]',
      secTextClass: 'text-[#7A4A00]/70',
      tileBgClass: 'bg-[#FFF4F0]',
      extraStyle: {}
    };
  };

  // Preview properties
  const previewDay = compDay || '14';
  const previewMonth = compMonth || 'JUN';
  const previewDateText = compDateTimeLabel || 'Date · time';

  const previewStyles = getCardBannerStyles(compBannerColor);

  const countColor = compDescription.length >= 280 
    ? 'text-[#E5484D]' 
    : compDescription.length > 240 
    ? 'text-[#8A5A00]' 
    : 'text-ink-400';

  const isFormValid = compTitle.trim() !== '' && compDay.trim() !== '' && compDateTimeLabel.trim() !== '' && compLocation.trim() !== '';

  return (
    <div className="flex flex-col min-h-screen text-[#0E0D0B] bg-[#FAFAF9]" style={{ width: '100%' }}>
      
      {/* Draft protection custom Toast */}
      <AnimatePresence>
        {showDraftToast && discardedDraft && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-100 bg-[#0E0D0B] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 text-xs font-semibold select-none whitespace-nowrap"
          >
            <span>Draft discarded</span>
            <span className="text-white/30">·</span>
            <button
              onClick={() => {
                setCompTitle(discardedDraft.title);
                setCompDay(discardedDraft.pickedDate);
                setCompDateTimeLabel(discardedDraft.pickedTime);
                setCompLocation(discardedDraft.location);
                setCompDescription(discardedDraft.description);
                setCompBannerColor(discardedDraft.bannerColor);
                setEditingEvent(discardedDraft.editingEvent);
                setIsComposerOpen(true);
                setShowDraftToast(false);
              }}
              className="text-[#FF5A36] font-extrabold hover:underline active:scale-95 cursor-pointer bg-transparent border-none outline-none"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-[#ECEAE5] flex items-center justify-between px-4 select-none shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0E0D0B] active:bg-ink-100 cursor-pointer"
          >
            <ArrowLeft size={22} strokeWidth={1.75} />
          </motion.button>
          <div>
            <h1 className="text-base font-bold text-[#0E0D0B] tracking-tight leading-none text-left">Events</h1>
            <p className="text-[10px] font-mono text-ink-500 font-medium leading-none mt-1 text-left">
              SWE-M &middot; Summer 2026
            </p>
          </div>
        </div>
        
        {isAuthoringAllowed && (
          <motion.button
            whileTap={{ scale: 0.97, opacity: 0.85 }}
            onClick={handleOpenCreate}
            style={{ 
              backgroundColor: '#FF5A36', 
              boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' 
            }}
            className="h-9 px-3.5 text-white font-semibold text-[13px] rounded-full flex items-center gap-1 cursor-pointer hover:bg-coral-600 border-none justify-center"
          >
            <Plus size={14} className="text-white shrink-0" strokeWidth={2.5} />
            <span>Create</span>
          </motion.button>
        )}
      </header>

      {/* Screen Content */}
      <div className="p-4 space-y-4 flex-1 pb-24">
        
        {/* ROLE SWITCH */}
        <div className="flex items-center justify-center w-full bg-ink-100 p-1.5 rounded-full mb-1 shrink-0 select-none">
          {([
            { id: 'Student' as const, label: 'Student' },
            { id: 'CR' as const, label: 'CR (Sadia)' }
          ]).map((r) => {
            const isActive = subRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSubRole(r.id);
                  setActiveDropdownId(null);
                }}
                className={`flex-1 py-1 px-1 rounded-full text-center flex flex-col items-center justify-center transition-all duration-120 cursor-pointer outline-none border-none ${
                  isActive ? 'bg-white shadow-1' : 'bg-transparent'
                }`}
              >
                <span className={`text-[13px] font-bold ${isActive ? 'text-ink-900 font-semibold' : 'text-ink-500 font-medium'}`}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* TABS segmented */}
        <div className="grid grid-cols-2 gap-1 bg-ink-100 p-1.5 rounded-full text-center shrink-0 mb-1 select-none">
          {(['Upcoming', 'Past'] as const).map((tabItem) => {
            const isActive = activeTab === tabItem;
            return (
              <button
                key={tabItem}
                onClick={() => {
                  setActiveTab(tabItem);
                  setActiveDropdownId(null);
                }}
                className={`py-2 px-3 rounded-full text-sm font-semibold transition-all duration-[120ms] shrink-0 cursor-pointer outline-none border-none ${
                  isActive
                    ? 'bg-white text-[#0E0D0B] font-bold shadow-1'
                    : 'bg-transparent text-ink-500 hover:text-[#0E0D0B]'
                }`}
              >
                {tabItem}
              </button>
            );
          })}
        </div>

        {/* EVENTS LIST */}
        <div className="space-y-4 flex-1 overflow-visible font-sans">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center text-ink-400"
              >
                <p className="text-sm font-medium">No events listed in this view.</p>
              </motion.div>
            ) : (
              filteredEvents.map((evt) => {
                const styles = getCardBannerStyles(evt.bannerColor);
                const isDropdownOpen = activeDropdownId === evt.id;

                return (
                  <motion.div
                    layout
                    key={evt.id}
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.95, 
                      y: 8, 
                      height: 0, 
                      transition: { duration: 0.3, ease: 'easeOut' } 
                    }}
                    className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] overflow-hidden flex flex-col relative"
                  >
                    
                    {/* CR KEBAB OVERFLOW ACCORDION */}
                    {isAuthoringAllowed && evt.tabType !== 'Past' && (
                      <div className="absolute top-3.5 right-3.5 z-30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(isDropdownOpen ? null : evt.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                            evt.bannerColor === 'sand' ? 'text-ink-900 hover:bg-black/5' : 'text-white hover:bg-white/20'
                          } border-none bg-transparent`}
                        >
                          <MoreVertical size={18} strokeWidth={2.0} />
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <>
                              {/* Tap outside element backdrop */}
                              <div
                                className="fixed inset-0 z-30 bg-transparent"
                                onClick={() => setActiveDropdownId(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                style={{ minWidth: '160px' }}
                                className="absolute right-0 mt-1.5 bg-white border border-[#ECEAE5] rounded-[10px] shadow-3 z-40 py-1.5 flex flex-col text-left select-none"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEdit(evt);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 text-ink-900 hover:bg-ink-100 flex items-center gap-2 text-sm font-medium cursor-pointer border-none bg-transparent"
                                >
                                  <PenLine size={16} className="text-ink-700" />
                                  <span>Edit event</span>
                                </button>
                                <div className="h-[1px] bg-[#ECEAE5] my-1" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEventToDelete(evt);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2.5 text-[#E5484D] hover:bg-[#FCE8E9]/40 flex items-center gap-2 text-sm font-medium cursor-pointer border-none bg-transparent"
                                >
                                  <Trash2 size={16} className="text-[#E5484D]" />
                                  <span>Delete event</span>
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* 1. BANNER */}
                    <div 
                      style={styles.extraStyle}
                      className={`${styles.bgClass} p-4.5 flex gap-3.5 items-center select-none relative z-10 min-h-[82px]`}
                    >
                      {/* Date Block */}
                      <div className={`w-12 h-12 ${styles.tileBgClass} rounded-[10px] p-1.5 flex flex-col justify-center items-center shrink-0 border border-white/5`}>
                        <span className={`font-mono text-lg font-bold leading-none ${styles.textClass}`}>
                          {evt.day}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 leading-none ${styles.textClass}`}>
                          {evt.month}
                        </span>
                      </div>

                      {/* Main info text */}
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className={`text-[15px] font-bold leading-tight truncate ${styles.textClass}`}>
                          {evt.title}
                        </h4>
                        <p className={`font-mono text-[11px] font-medium mt-1 leading-none ${styles.secTextClass}`}>
                          {evt.fullDate} &middot; {evt.timeLabel}
                        </p>
                      </div>
                    </div>

                    {/* 2. BODY */}
                    <div className="p-4 flex flex-col gap-2.5 bg-white select-text selection:bg-[#FFE7DF]">
                      {/* Location */}
                      <div className="flex items-center gap-2 select-none">
                        <MapPin size={15} className="text-ink-500 shrink-0" strokeWidth={1.75} />
                        <span className="text-xs font-bold text-ink-900 leading-none">
                          {evt.location}
                        </span>
                      </div>

                      {/* Owner */}
                      <p className="text-[11px] text-[#75726A] font-medium leading-none select-none pl-0.5">
                        Posted by <span className="font-bold text-[#E84A28]">{evt.organizer}</span>
                      </p>

                      {/* Desc */}
                      {evt.description && (
                        <p className="border-t border-[#ECEAE5] pt-2.5 text-[#4D4B45] text-xs leading-relaxed font-sans font-light">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    {/* 3. FOOTER */}
                    <div className="bg-[#FAFAF9] border-t border-[#ECEAE5] px-4 py-3 flex items-center justify-between select-none">
                      
                      {/* Avatars */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                          {evt.initialsList.slice(0, 3).map((init, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full bg-coral-100 text-[#FF5A36] border border-white flex items-center justify-center font-bold font-mono text-[10px] select-none text-center"
                              style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                            >
                              {init}
                            </div>
                          ))}
                        </div>
                        <span className="font-mono text-[11px] font-medium text-[#75726A]">
                          {evt.goingCount} going
                        </span>
                      </div>

                      {/* Ticket controls */}
                      <div className="shrink-0">
                        {(() => {
                          if (evt.tabType === 'Past') {
                            return (
                              <span className="px-3 py-1 bg-ink-100 border border-transparent rounded-full text-[11px] font-bold text-ink-400 select-none cursor-not-allowed">
                                Event ended
                              </span>
                            );
                          }

                          if (subRole === 'CR') {
                            return (
                              <span className="text-xs font-bold text-[#FF5A36] italic">
                                You posted this
                              </span>
                            );
                          }

                          // Student RSVP views
                          if (evt.userRSVP) {
                            return (
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleToggleRSVP(evt.id, evt.title)}
                                className="px-3.5 py-1.5 bg-[#E5F7EE] text-[#0F6B43] rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm leading-none cursor-pointer border border-[#E5F7EE]/10 outline-none"
                              >
                                <Check size={12} strokeWidth={2.5} />
                                <span>Going</span>
                              </motion.button>
                            );
                          }

                          return (
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleToggleRSVP(evt.id, evt.title)}
                              className="px-3.5 py-1.5 bg-[#FFF4F0] hover:bg-[#FFE7DF] text-[#FF5A36] rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm leading-none cursor-pointer border border-[#FFE7DF]/10 outline-none"
                            >
                              <Check size={12} strokeWidth={2.0} />
                              <span>Mark going</span>
                            </motion.button>
                          );
                        })()}
                      </div>

                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* COMPOSER/EDIT BOTTOM SHEET */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-55 flex flex-col justify-end overflow-hidden font-sans">
            
            {/* Scrim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={handleDismissWithProtection}
              className="absolute inset-0 bg-[#0E0D0B]/55"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.35, ease: [0.34, 1.35, 0.64, 1] }}
              className="relative w-full max-h-[92%] bg-white rounded-t-[28px] shadow-3 flex flex-col z-10 overflow-hidden text-left pb-safe"
            >
              {/* Drag Handle */}
              <div className="w-[36px] h-[4px] bg-ink-200 rounded-full mx-auto mt-2.5 shrink-0 pointer-events-none" />

              {/* Title Header */}
              <div className="flex items-start justify-between px-6 pt-4 pb-3.5 shrink-0 select-none border-b border-[#F4F4F3]">
                <div className="space-y-1">
                  <h2 className="text-[21px] font-extrabold text-[#0E0D0B] tracking-tight leading-none">
                    {editingEvent ? 'Edit event' : 'Create an event'}
                  </h2>
                  <p className="text-[14px] font-medium text-gray-400 mt-1 leading-none font-sans">
                    SWE-M &middot; 42 students will be notified
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDismissWithProtection}
                  className="w-10 h-10 flex items-center justify-center text-[#0E0D0B] cursor-pointer border-none bg-transparent hover:bg-black/5 rounded-full transition-colors outline-none"
                >
                  <X size={24} strokeWidth={2.2} style={{ color: '#0E0D0B' }} />
                </button>
              </div>

              {/* Scroll Content */}
              <div id="composerScroller" className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-sans select-none pb-28">
                
                {/* 1. EVENT TITLE */}
                <div id="titleField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    EVENT TITLE
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. CSE Programming Contest"
                    value={compTitle}
                    onChange={(e) => {
                      setCompTitle(e.target.value);
                      if (valErrors.title) setValErrors(prev => ({ ...prev, title: false }));
                    }}
                    className={`w-full bg-white border ${
                      valErrors.title ? 'border-[#E5484D] focus:ring-[#E5484D]/18' : 'border-[#E0DED8]'
                    } focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[16px] py-3.5 px-4.5 text-[15px] font-semibold text-[#0E0D0B] transition-all outline-none`}
                  />
                </div>

                {/* 2. DAY & DATE TIME (Row) */}
                <div className="grid grid-cols-12 gap-4">
                  <div id="dayField" className="col-span-3 space-y-2 scroll-mt-4">
                    <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                      DAY
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="14"
                      value={compDay}
                      onChange={(e) => {
                        const digitOnly = e.target.value.replace(/\D/g, '');
                        setCompDay(digitOnly);
                        if (valErrors.day) setValErrors(prev => ({ ...prev, day: false }));
                      }}
                      className={`w-full bg-white border ${
                        valErrors.day ? 'border-[#E5484D] focus:ring-[#E5484D]/18' : 'border-[#E0DED8]'
                      } focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[16px] py-3.5 px-4 text-[15px] font-bold text-[#0E0D0B] text-center transition-all outline-none`}
                    />
                  </div>

                  <div id="dateTimeField" className="col-span-9 space-y-2 scroll-mt-4">
                    <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                      DATE & TIME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sun 14 Jun · 9:00 am"
                      value={compDateTimeLabel}
                      onChange={(e) => {
                        setCompDateTimeLabel(e.target.value);
                        if (valErrors.dateTime) setValErrors(prev => ({ ...prev, dateTime: false }));
                      }}
                      className={`w-full bg-white border ${
                        valErrors.dateTime ? 'border-[#E5484D] focus:ring-[#E5484D]/18' : 'border-[#E0DED8]'
                      } focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[16px] py-3.5 px-4.5 text-[15px] font-semibold text-[#0E0D0B] transition-all outline-none`}
                    />
                  </div>
                </div>

                {/* 3. MONTH */}
                <div id="monthField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    MONTH
                  </label>
                  <div className="flex gap-2.5">
                    {(['JUN', 'JUL', 'AUG', 'SEP'] as const).map((m) => {
                      const isSel = compMonth === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setCompMonth(m)}
                          className={`h-11 px-5 rounded-full text-[14px] font-black tracking-wider transition-all cursor-pointer border ${
                            isSel 
                              ? 'bg-[#0E0D0B] text-white border-transparent shadow-sm' 
                              : 'bg-white text-[#0E0D0B] border-[#E0DED8] hover:bg-gray-50'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. LOCATION */}
                <div id="locationField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    LOCATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium 14B"
                    value={compLocation}
                    onChange={(e) => {
                      setCompLocation(e.target.value);
                      if (valErrors.location) setValErrors(prev => ({ ...prev, location: false }));
                    }}
                    className={`w-full bg-white border ${
                      valErrors.location ? 'border-[#E5484D] focus:ring-[#E5484D]/18' : 'border-[#E0DED8]'
                    } focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[16px] py-3.5 px-4.5 text-[15px] font-semibold text-[#0E0D0B] transition-all outline-none`}
                  />
                </div>

                {/* 5. DESCRIPTION */}
                <div id="descriptionField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    DESCRIPTION
                  </label>
                  <textarea
                    placeholder="What's happening? Who should come?"
                    value={compDescription}
                    onChange={handleDescChange}
                    maxLength={280}
                    style={{ minHeight: '96px', maxHeight: '160px' }}
                    className="w-full bg-white border border-[#E0DED8] focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[16px] p-4 text-[14px] font-medium text-[#0E0D0B] transition-all outline-none resize-none"
                  />
                </div>

                {/* 6. CARD COLOR */}
                <div id="bannerColorField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    CARD COLOR
                  </label>
                  <div className="flex gap-3 w-full">
                    {[
                      { id: 'coral' as const, label: 'Coral', bgClass: 'bg-[#FF5A36]', textClass: 'text-white', ringClass: 'ring-2 ring-offset-2 ring-[#FF5A36]' },
                      { id: 'ink' as const, label: 'Ink', bgClass: 'bg-[#1B1A18]', textClass: 'text-white', ringClass: 'ring-2 ring-offset-2 ring-[#1B1A18]' },
                      { id: 'sand' as const, label: 'Sand', bgClass: 'bg-[#FFF1D6]', textClass: 'text-[#7A4A00]', ringClass: 'ring-2 ring-offset-2 ring-[#FFE59E]' }
                    ].map((sw) => {
                      const isSel = compBannerColor === sw.id;
                      return (
                        <button
                          key={sw.id}
                          type="button"
                          onClick={() => setCompBannerColor(sw.id)}
                          className={`flex-1 h-12 rounded-[16px] font-extrabold text-[14px] transition-all cursor-pointer ${sw.bgClass} ${sw.textClass} ${
                            isSel ? sw.ringClass : 'border border-[#E0DED8] hover:opacity-90'
                          }`}
                        >
                          {sw.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. PREVIEW */}
                <div id="previewField" className="space-y-2 scroll-mt-4">
                  <label className="block text-[13px] font-extrabold text-[#4D4B45] tracking-[0.02em] uppercase">
                    PREVIEW
                  </label>
                  {(() => {
                    const pStyles = compBannerColor === 'coral' ? {
                      bgClass: 'bg-[#FF5A36]',
                      textClass: 'text-white',
                      secTextClass: 'text-white/80',
                      tileClass: 'bg-white/20 border border-white/10 text-white',
                    } : compBannerColor === 'ink' ? {
                      bgClass: 'bg-[#1B1A18]',
                      textClass: 'text-white',
                      secTextClass: 'text-white/80',
                      tileClass: 'bg-white/15 border border-white/10 text-white',
                    } : {
                      bgClass: 'bg-[#FFF1D6]',
                      textClass: 'text-[#7A4A00]',
                      secTextClass: 'text-[#7A4A00]/80',
                      tileClass: 'bg-[#7A4A00]/10 border border-[#7A4A00]/10 text-[#7A4A00]',
                    };

                    const displayTitle = compTitle.trim() || 'Event title';
                    const displayDateTime = compDateTimeLabel.trim() || 'Date · time';
                    const displayDay = compDay.trim().padStart(2, '0');
                    
                    return (
                      <div className={`w-full ${pStyles.bgClass} rounded-[18px] p-5 flex gap-4 items-center select-none shadow-sm min-h-[92px]`}>
                        {/* Left Date tile */}
                        <div className={`w-14 h-14 ${pStyles.tileClass} rounded-[14px] flex flex-col justify-center items-center shrink-0`}>
                          <span className="text-[20px] font-extrabold leading-none tracking-tight">
                            {displayDay === '00' ? '14' : displayDay}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest mt-0.5 leading-none">
                            {compMonth}
                          </span>
                        </div>
                        
                        {/* Right text info */}
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className={`text-[16px] font-bold leading-tight truncate ${pStyles.textClass}`}>
                            {displayTitle}
                          </h4>
                          <p className={`font-mono text-[12px] font-medium mt-1 leading-none ${pStyles.secTextClass}`}>
                            {displayDateTime}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ECEAE5] py-4 px-6 flex items-center gap-3 shrink-0 font-sans z-20">
                <button
                  type="button"
                  onClick={handleDismissWithProtection}
                  className="px-8 py-3.5 rounded-full bg-[#F0EFF4] hover:bg-[#E2E1E6] text-[#0E0D0B] text-[15px] font-bold cursor-pointer active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={isFormValid ? { scale: 0.98 } : undefined}
                  disabled={!isFormValid}
                  onClick={handleSaveEvent}
                  style={{ 
                    backgroundColor: isFormValid ? '#FF5A36' : '#FFB2A1',
                  }}
                  className={`flex-1 py-3.5 text-white text-[15px] font-bold rounded-full flex items-center justify-center gap-1.5 transition-all outline-none border-none ${
                    isFormValid ? 'cursor-pointer shadow-sm hover:opacity-95' : 'cursor-not-allowed'
                  }`}
                >
                  <span>{editingEvent ? 'Save changes' : 'Publish event'}</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {eventToDelete && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEventToDelete(null)}
              className="absolute inset-0 bg-[#0E0D0B]/55"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[14px] p-5 shadow-3 z-10 font-sans text-left"
            >
              <h3 className="text-[18px] font-bold text-ink-900 leading-tight">
                Delete this event?
              </h3>
              <p className="text-[14px] font-normal text-ink-600 mt-2 leading-relaxed">
                {eventToDelete.title} will be removed. Students who marked going won't be notified.
              </p>
              <div className="flex gap-3 justify-end mt-5">
                <button
                  type="button"
                  onClick={() => setEventToDelete(null)}
                  className="border border-[#E0DED8] rounded-full py-2 px-4 bg-transparent text-ink-900 text-xs font-semibold cursor-pointer active:scale-[0.97] active:opacity-[0.85]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = eventToDelete.title;
                    setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
                    triggerToast('Event deleted');
                    setEventToDelete(null);
                  }}
                  style={{ backgroundColor: '#FCE8E9', color: '#E5484D' }}
                  className="rounded-full py-2 px-4 text-[#E5484D] text-xs font-bold border-none cursor-pointer active:scale-[0.97] active:opacity-[0.85]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
