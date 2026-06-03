import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpDown, Search, Phone, Mail, MessageCircle, MoreVertical, X, Check, SearchX } from 'lucide-react';

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  course: string;
  dept: string;
  phone: string;
  whatsapp: string;
  email: string;
  initials: string;
  letter: string;
  officeHours: string;
  status: 'Available' | 'Busy' | 'On leave' | 'Sub teaching';
}

const initialFaculty: FacultyMember[] = [
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
];

interface FacultyProps {
  onBack: () => void;
  triggerToast: (msg: string) => void;
  facultyList: FacultyMember[];
  setFacultyList: React.Dispatch<React.SetStateAction<FacultyMember[]>>;
}

export default function CRSubScreenFaculty({ onBack, triggerToast, facultyList, setFacultyList }: FacultyProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [activeFaculty, setActiveFaculty] = useState<FacultyMember | null>(null);

  // Editable Form fields
  const [updOffice, setUpdOffice] = useState('');
  const [updPhone, setUpdPhone] = useState('');
  const [updWhatsapp, setUpdWhatsapp] = useState('');
  const [updEmail, setUpdEmail] = useState('');
  const [updStatus, setUpdStatus] = useState<'Available' | 'Busy' | 'On leave' | 'Sub teaching'>('Available');

  // Input validation regex for Bangladeshi Phone (+880 1XXX XXX XXX or 11 digits)
  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/\s+/g, '');
    return /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(clean);
  };

  const validateEmail = (mail: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleOpenUpdate = (fac: FacultyMember) => {
    setActiveFaculty(fac);
    setUpdOffice(fac.officeHours);
    setUpdPhone(fac.phone);
    setUpdWhatsapp(fac.whatsapp);
    setUpdEmail(fac.email);
    setUpdStatus(fac.status);
    setIsUpdateOpen(true);
  };

  const handleSaveUpdate = () => {
    if (!activeFaculty) return;

    if (updPhone && !validatePhone(updPhone)) {
      triggerToast('Invalid Bangladeshi phone format');
      return;
    }
    if (updWhatsapp && !validatePhone(updWhatsapp)) {
      triggerToast('Invalid WhatsApp number format');
      return;
    }
    if (updEmail && !validateEmail(updEmail)) {
      triggerToast('Invalid email address format');
      return;
    }

    setFacultyList(prev => prev.map(f => {
      if (f.id === activeFaculty.id) {
        return {
          ...f,
          phone: updPhone,
          whatsapp: updWhatsapp,
          email: updEmail,
          officeHours: updOffice,
          status: updStatus
        };
      }
      return f;
    }));

    triggerToast(`Updated ${activeFaculty.name}`);
    setIsUpdateOpen(false);
  };

  // Filter list
  const filteredList = facultyList.filter(f => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      f.name.toLowerCase().includes(term) ||
      f.designation.toLowerCase().includes(term) ||
      f.course.toLowerCase().includes(term) ||
      f.dept.toLowerCase().includes(term)
    );
  });

  // Group by alphabetical letters
  const groups: Record<string, FacultyMember[]> = {};
  filteredList.forEach(fac => {
    if (!groups[fac.letter]) {
      groups[fac.letter] = [];
    }
    groups[fac.letter].push(fac);
  });

  const sortedLetters = Object.keys(groups).sort();

  return (
    <div className="flex flex-col min-h-screen text-[#0E0D0B] bg-[#FAFAF9]" style={{ width: '100%' }}>
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
            <h1 className="text-base font-bold text-[#0E0D0B] tracking-tight leading-none">Faculty directory</h1>
            <p className="text-[10px] font-mono text-ink-500 font-medium leading-none mt-1">
              Software Engineering &middot; 12 faculty
            </p>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerToast('Faculty list is sorted A-Z')}
          className="w-10 h-10 rounded-full text-ink-900 flex items-center justify-center hover:bg-ink-100 cursor-pointer"
        >
          <ArrowUpDown size={18} strokeWidth={1.75} />
        </motion.button>
      </header>

      {/* Screen Content */}
      <div className="p-4 space-y-4 flex-1 pb-24">
        
        {/* STICKY SEARCH ROW */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3 flex items-center gap-2.5 shadow-sm">
          <Search size={18} className="text-ink-400 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search by name, designation, or course…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium text-ink-900 bg-transparent outline-none focus:outline-none placeholder:text-ink-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-ink-400 shrink-0">
              <X size={16} strokeWidth={2.0} />
            </button>
          )}
        </div>

        {/* ALPHABETICAL GROUPED LIST */}
        <div className="space-y-5 flex-1 pr-0.5">
          {sortedLetters.length === 0 ? (
            <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-8 text-center text-ink-400">
              <SearchX className="mx-auto mb-2 text-ink-300" size={32} />
              <p className="text-sm font-semibold select-none leading-none">No faculty matches found</p>
              <p className="text-xs mt-1.5 leading-none">No match for "{searchQuery}"</p>
            </div>
          ) : (
            sortedLetters.map((letter) => (
              <div key={letter} className="space-y-2.5 font-sans">
                {/* LETTER GROUP HEADER */}
                <div className="bg-coral-50 border border-coral-100 rounded-[10px] px-3 py-1.5 flex items-center justify-between select-none shadow-sm">
                  <span className="font-mono text-[12px] font-extrabold text-[#FF5A36] tracking-widest uppercase">
                    {letter}
                  </span>
                </div>

                {/* Faculty Cards */}
                <div className="space-y-3">
                  {groups[letter].map((fac) => (
                    <div
                      key={fac.id}
                      className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3 relative"
                    >
                      {/* CR overflow menu kebab */}
                      <button
                        onClick={() => handleOpenUpdate(fac)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-ink-500 hover:text-ink-900 active:bg-ink-100 cursor-pointer"
                      >
                        <MoreVertical size={16} strokeWidth={1.75} />
                      </button>

                      <div className="flex gap-3.5 items-start">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-coral-100 text-[#FF5A36] flex items-center justify-center font-bold font-mono text-[14px] shrink-0 select-none">
                          {fac.initials}
                        </div>

                        {/* Text fields */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-ink-900 leading-tight">
                              {fac.name}
                            </h3>
                            {/* Short Status */}
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              fac.status === 'Available' ? 'bg-[#19A974]' : 'bg-[#E5484D]'
                            }`} title={fac.status} />
                          </div>

                          <p className="text-[12px] text-ink-700 leading-snug mt-1 selection:bg-transparent">
                            <span className="font-bold">{fac.designation}</span> &middot; {fac.course}
                          </p>

                          <div className="flex items-center gap-3 flex-wrap mt-2 select-none">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-700 bg-ink-100 px-1.5 py-0.5 rounded leading-none">
                              {fac.dept}
                            </span>
                            {fac.officeHours && (
                              <span className="text-[11px] font-medium font-sans text-ink-500">
                                Hrs: {fac.officeHours}
                              </span>
                            )}
                          </div>

                          {fac.phone && (
                            <div className="flex items-center gap-1.5 mt-2.5 select-none leading-none">
                              <Phone size={12} className="text-ink-400 shrink-0" />
                              <span className="font-mono text-[11px] font-medium text-ink-500 selection:bg-transparent">
                                {fac.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Direct Action triggers row */}
                      <div className="grid grid-cols-3 gap-2 border-t border-[#ECEAE5] pt-3 mt-1.5 select-none font-sans">
                        <motion.a
                          whileTap={{ scale: 0.96 }}
                          href={`tel:${fac.phone}`}
                          onClick={() => triggerToast(`Calling ${fac.name}`)}
                          className="bg-coral-50 hover:bg-coral-100/40 text-[#FF5A36] py-1.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 leading-none shadow-sm cursor-pointer border border-coral-100/10"
                        >
                          <Phone size={12} strokeWidth={2.0} />
                          <span>Call</span>
                        </motion.a>

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (fac.whatsapp) {
                              const digits = fac.whatsapp.replace(/\D/g, '');
                              window.open(`https://wa.me/${digits}`, '_blank');
                              triggerToast('Opening WhatsApp');
                            } else {
                              triggerToast('WhatsApp number not set');
                            }
                          }}
                          className="bg-success-bg hover:bg-success-bg/85 text-success-strong py-1.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 leading-none shadow-sm cursor-pointer border border-success-bg/10"
                        >
                          <MessageCircle size={12} strokeWidth={2.0} />
                          <span>WhatsApp</span>
                        </motion.button>

                        <motion.a
                          whileTap={{ scale: 0.96 }}
                          href={`mailto:${fac.email}`}
                          onClick={() => triggerToast(`Composing email`)}
                          className="bg-ink-100 hover:bg-ink-200/60 text-ink-700 py-1.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 leading-none shadow-sm cursor-pointer border border-ink-100/10"
                        >
                          <Mail size={12} strokeWidth={2.0} />
                          <span>Email</span>
                        </motion.a>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* UPDATE DIALOG SHEET */}
      <AnimatePresence>
        {isUpdateOpen && activeFaculty && (
          <div className="fixed inset-0 z-55 flex flex-col justify-end overflow-hidden font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setIsUpdateOpen(false)}
              className="absolute inset-0 bg-[#0E0D0B]/55"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-h-[90%] bg-white rounded-t-[28px] shadow-4 flex flex-col z-10 overflow-hidden text-left pb-safe"
            >
              <div className="w-10 h-1 bg-ink-300 rounded-full mx-auto mt-2 shrink-0 pointer-events-none" />

              <div className="flex items-start justify-between px-5 pt-4 pb-2 shrink-0 select-none">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-ink-900 tracking-tight leading-none">
                    Update {activeFaculty.name}
                  </h2>
                  <p className="text-[11px] font-medium text-ink-500 uppercase tracking-wide leading-none pt-0.5 mt-1">
                    {activeFaculty.designation} &middot; {activeFaculty.dept} Dept
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  className="w-9 h-9 rounded-full bg-ink-100/50 flex items-center justify-center text-ink-900 cursor-pointer"
                >
                  <X size={18} strokeWidth={2.0} />
                </button>
              </div>

              {/* Form Areas */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 font-sans select-none">
                
                {/* 1. Office hours */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    OFFICE HOURS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sun-Wed 2-4 pm"
                    value={updOffice}
                    onChange={(e) => setUpdOffice(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] py-3.5 px-3 text-sm font-medium text-[#0E0D0B] transition-all outline-none"
                  />
                </div>

                {/* 2. Phone number */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +880 1712 345 679"
                    value={updPhone}
                    onChange={(e) => setUpdPhone(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] py-3.5 px-3 text-sm font-semibold font-mono tracking-tight text-[#0E0D0B] transition-all outline-none"
                  />
                </div>

                {/* 3. WhatsApp */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    WHATSAPP (IF DIFFERENT)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +880 1712 345 679"
                    value={updWhatsapp}
                    onChange={(e) => setUpdWhatsapp(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] py-3.5 px-3 text-sm font-semibold font-mono tracking-tight text-[#0E0D0B] transition-all outline-none"
                  />
                </div>

                {/* 4. Email */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. name@swe.edu"
                    value={updEmail}
                    onChange={(e) => setUpdEmail(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] py-3.5 px-3 text-sm font-medium text-[#0E0D0B] transition-all outline-none"
                  />
                </div>

                {/* 5. Status Chip */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    AVAILABILITY STATUS
                  </label>
                  <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar select-none">
                    {(['Available', 'Busy', 'On leave', 'Sub teaching'] as const).map((st) => {
                      const isActive = updStatus === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setUpdStatus(st)}
                          className={`py-2 px-3.5 rounded-full text-xs font-semibold transition-all duration-120 cursor-pointer whitespace-nowrap shrink-0 outline-none ${
                            isActive
                              ? 'bg-ink-900 text-white font-semibold shadow-sm'
                              : 'bg-white border border-[#E0DED8] text-ink-900 font-medium'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Current course (read-only) */}
                <div className="space-y-1.5 selection:bg-transparent selection:text-inherit">
                  <label className="block text-[11px] font-extrabold text-ink-400 tracking-[0.04em] uppercase selection:text-ink-400">
                    CURRENT TAUGHT COURSE (READ-ONLY)
                  </label>
                  <div className="bg-ink-100 rounded-[12px] p-3.5 text-xs text-ink-500 font-mono font-bold selection:bg-transparent selection:text-ink-500">
                    {activeFaculty.course}
                  </div>
                </div>

                {/* Disclaimer footnote */}
                <p className="text-[11px] text-[#A8A59C] select-none text-center italic pt-2">
                  New faculty added by Admin only.
                </p>
              </div>

              {/* Footer sticky buttons */}
              <div className="bg-white border-t border-[#ECEAE5] py-3 px-5 flex items-center justify-between shrink-0 font-sans">
                <button
                  type="button"
                  onClick={() => setIsUpdateOpen(false)}
                  className="border border-[#E0DED8] rounded-full py-2 px-4 bg-transparent text-ink-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={{ scale: 0.97, opacity: 0.85 }}
                  type="button"
                  onClick={handleSaveUpdate}
                  style={{ backgroundColor: '#FF5A36', boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }}
                  className="rounded-full py-2.5 px-4 bg-[#FF5A36] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border-none"
                >
                  <Check size={14} strokeWidth={2.0} />
                  <span>Save changes</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
