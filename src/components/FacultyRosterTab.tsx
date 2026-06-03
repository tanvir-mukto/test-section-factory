import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Search, SlidersHorizontal, ArrowUpDown, Check, 
  MapPin, Clock, Star, Users, Phone, Mail, Award, X, ChevronRight, 
  User, CheckCheck, AlertCircle, FileText
} from 'lucide-react';

interface StudentNode {
  id: string; // academic ID: e.g. 23-45601-1
  name: string;
  attendanceRate: number; // e.g. 96
  completedSubmissions: number; // e.g. 4
  totalSubmissions: number; // e.g. 4
  isCR?: boolean;
  phone?: string;
  email?: string;
}

interface SectionMeta {
  name: string;
  courseLabel: string;
  studentsCount: number;
  avgAttendance: number;
  avgQuizScore: number;
}

const SECTIONS_METAS: SectionMeta[] = [
  { name: 'SWE-M', courseLabel: 'SE131 Data Structure & SE132 Lab', studentsCount: 42, avgAttendance: 94, avgQuizScore: 78 },
  { name: 'SWE-N', courseLabel: 'SE131 Data Structure (Theory & Lab)', studentsCount: 38, avgAttendance: 89, avgQuizScore: 82 },
  { name: 'SWE-O', courseLabel: 'SE131 Data Structure (Theory Only)', studentsCount: 41, avgAttendance: 92, avgQuizScore: 75 }
];

const STUDENTS_MOCK_MASTER: Record<string, StudentNode[]> = {
  'SWE-M': [
    { id: '23-45101-1', name: 'Tahmid Rahman', attendanceRate: 98, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1711-234567', email: 'tahmid.rahman@student.edu' },
    { id: '23-45102-1', name: 'Nila Akter', attendanceRate: 92, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1712-345678', email: 'nila.akter@student.edu' },
    { id: '23-45103-1', name: 'Rakib Hasan', attendanceRate: 74, completedSubmissions: 2, totalSubmissions: 4, phone: '+880-1713-456789', email: 'rakib.hasan@student.edu' },
    { id: '23-45104-1', name: 'Mehedi Khan', attendanceRate: 88, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1714-567890', email: 'mehedi.khan@student.edu' },
    { id: '23-45105-1', name: 'Tasnim Jahan', attendanceRate: 95, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1715-678901', email: 'tasnim.jahan@student.edu' },
    { id: '23-45106-1', name: 'Anik Saha', attendanceRate: 85, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1716-789012', email: 'anik.saha@student.edu' },
    { id: '23-45107-1', name: 'Sadia Rahman', attendanceRate: 99, completedSubmissions: 4, totalSubmissions: 4, isCR: true, phone: '+880-1811-999888', email: 'sadia.rahman@student.edu' },
    { id: '23-45108-1', name: 'Imran Hossain', attendanceRate: 79, completedSubmissions: 2, totalSubmissions: 4, phone: '+880-1717-890123', email: 'imran.hossain@student.edu' },
    { id: '23-45109-1', name: 'Farhana Akter', attendanceRate: 91, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1718-901234', email: 'farhana.akter@student.edu' },
    { id: '23-45110-1', name: 'Zayed Hasan', attendanceRate: 94, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1719-012345', email: 'zayed.hasan@student.edu' },
    { id: '23-45111-1', name: 'Mitu Barua', attendanceRate: 86, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1721-123456', email: 'mitu.barua@student.edu' },
    { id: '23-45112-1', name: 'Nusrat Jahan', attendanceRate: 93, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1722-234567', email: 'nusrat.jahan@student.edu' },
    { id: '23-45113-1', name: 'Sakib Al Amin', attendanceRate: 77, completedSubmissions: 2, totalSubmissions: 4, phone: '+880-1723-345678', email: 'sakib.alamin@student.edu' },
    { id: '23-45114-1', name: 'Tania Sultana', attendanceRate: 97, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1724-456789', email: 'tania.sultana@student.edu' },
    { id: '23-45115-1', name: 'Raful Islam', attendanceRate: 90, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1725-567890', email: 'raful.islam@student.edu' },
    { id: '23-45116-1', name: 'Sumaiya Akter', attendanceRate: 96, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1726-678901', email: 'sumaiya.akter@student.edu' },
    { id: '23-45117-1', name: 'Arif Mahmud', attendanceRate: 81, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1727-789012', email: 'arif.mahmud@student.edu' },
    { id: '23-45118-1', name: 'Jannatul Ferdous', attendanceRate: 95, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1728-890123', email: 'jannatul.ferdous@student.edu' },
    { id: '23-45119-1', name: 'Shahrior Kabir', attendanceRate: 83, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1729-901234', email: 'shahrior.kabir@student.edu' },
    { id: '23-45120-1', name: 'Maliha Noor', attendanceRate: 92, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1731-012345', email: 'maliha.noor@student.edu' }
  ],
  'SWE-N': [
    { id: '23-45201-1', name: 'Zarif Ahmed', attendanceRate: 91, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1741-234567', email: 'zarif.ahmed@student.edu' },
    { id: '23-45202-1', name: 'Hasan Mahmud', attendanceRate: 84, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1742-345678', email: 'hasan.mahmud@student.edu' },
    { id: '23-45203-1', name: 'Israt Jahan', attendanceRate: 93, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1743-456789', email: 'israt.jahan@student.edu' },
    { id: '23-45204-1', name: 'Naimur Rahman', attendanceRate: 95, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1744-567890', email: 'naimur.rahman@student.edu' },
    { id: '23-45205-1', name: 'Proma Das', attendanceRate: 89, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1745-678901', email: 'proma.das@student.edu' },
    { id: '23-45206-1', name: 'Asif Iqbal', attendanceRate: 78, completedSubmissions: 2, totalSubmissions: 4, phone: '+880-1746-789012', email: 'asif.iqbal@student.edu' },
    { id: '23-45207-1', name: 'Lamia Chowdhury', attendanceRate: 90, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1747-890123', email: 'lamia.chowdhury@student.edu' },
    { id: '23-45208-1', name: 'Fahim Shahrior', attendanceRate: 82, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1748-901234', email: 'fahim.shahrior@student.edu' }
  ],
  'SWE-O': [
    { id: '23-45301-1', name: 'Sabbir Hossain', attendanceRate: 92, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1751-234567', email: 'sabbir.hossain@student.edu' },
    { id: '23-45302-1', name: 'Tisha Rahman', attendanceRate: 96, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1752-345678', email: 'tisha.rahman@student.edu' },
    { id: '23-45303-1', name: 'Mahin Uddin', attendanceRate: 70, completedSubmissions: 1, totalSubmissions: 4, phone: '+880-1753-456789', email: 'mahin.uddin@student.edu' },
    { id: '23-45304-1', name: 'Anika Tabassum', attendanceRate: 94, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1754-567890', email: 'anika.tabassum@student.edu' },
    { id: '23-45305-1', name: 'Redwan Karim', attendanceRate: 88, completedSubmissions: 3, totalSubmissions: 4, phone: '+880-1755-678901', email: 'redwan.karim@student.edu' },
    { id: '23-45306-1', name: 'Sneha Roy', attendanceRate: 91, completedSubmissions: 4, totalSubmissions: 4, phone: '+880-1756-789012', email: 'sneha.roy@student.edu' }
  ]
};

interface RosterTabProps {
  onTriggerToast: (msg: string) => void;
  overrideSelectedSection?: string | null;
  onClearOverrideSection?: () => void;
}

export default function FacultyRosterTab({ onTriggerToast, overrideSelectedSection, onClearOverrideSection }: RosterTabProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  // Roster controls
  const [searchPhrase, setSearchPhrase] = useState('');
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'attendance-desc' | 'attendance-asc' | 'submissions'>('alphabetical');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Selected student drawer trace
  const [selectedStudent, setSelectedStudent] = useState<StudentNode | null>(null);

  // Handle outside routing overrides
  React.useEffect(() => {
    if (overrideSelectedSection) {
      setActiveSectionId(overrideSelectedSection);
      if (onClearOverrideSection) onClearOverrideSection();
    }
  }, [overrideSelectedSection]);

  const activeMeta = SECTIONS_METAS.find(s => s.name === activeSectionId);
  
  // Compute initial avatar
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Ledger color indicators
  const getAttendanceLedgerDot = (rate: number) => {
    if (rate >= 90) return 'bg-[#19A974]'; // healthy green
    if (rate >= 80) return 'bg-[#FFB020]'; // warnings amber
    return 'bg-[#E5484D]'; // critical red
  };

  // Sort and filter computation
  const sortedAndFilteredList = useMemo(() => {
    if (!activeSectionId) return [];
    
    // Fallback list to prevent empty renders
    const baseList = STUDENTS_MOCK_MASTER[activeSectionId] || [];
    
    // search
    let results = baseList.filter(st => {
      const matchName = st.name.toLowerCase().includes(searchPhrase.toLowerCase());
      const matchId = st.id.includes(searchPhrase);
      return matchName || matchId;
    });

    // sort
    if (sortMethod === 'alphabetical') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMethod === 'attendance-desc') {
      results.sort((a, b) => b.attendanceRate - a.attendanceRate);
    } else if (sortMethod === 'attendance-asc') {
      results.sort((a, b) => a.attendanceRate - b.attendanceRate);
    } else if (sortMethod === 'submissions') {
      results.sort((a, b) => b.completedSubmissions - a.completedSubmissions);
    }

    return results;
  }, [activeSectionId, searchPhrase, sortMethod]);

  return (
    <div className="select-none font-sans text-left">
      <AnimatePresence mode="wait">
        {!activeSectionId ? (
          /* SECTION SELECT VIEWER list */
          <motion.div
            key="section-picker-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-[16px]"
          >
            {/* Header */}
            <div className="pb-2 border-b border-[#ECEAE5]">
              <h1 className="text-[32px] font-extrabold text-[#181a1a] tracking-tight leading-none">Roster</h1>
              <p className="font-mono text-[11.5px] text-ink-500 font-semibold mt-2">
                Dr. NSL &middot; sections in Summer 2026
              </p>
            </div>

            {/* List classes */}
            <div className="space-y-3">
              {SECTIONS_METAS.map((sec) => (
                <div
                  key={sec.name}
                  onClick={() => {
                    setActiveSectionId(sec.name);
                    setSearchPhrase('');
                    setSortMethod('alphabetical');
                  }}
                  className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-4 cursor-pointer active:scale-[0.98] transition-all duration-120 flex items-stretch hover:border-ink-400"
                >
                  {/* Left accent bar */}
                  <div className={`w-[4.5px] rounded-sm shrink-0 mr-3.5 ${
                    sec.name === 'SWE-M' ? 'bg-[#FF5A36]' : sec.name === 'SWE-N' ? 'bg-[#2E7CF6]' : 'bg-[#FFB020]'
                  }`} />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-extrabold text-ink-900 leading-none">{sec.name}</h3>
                    <p className="text-[11.5px] font-medium text-ink-500 mt-1 leading-none">{sec.courseLabel}</p>

                    <div className="flex items-center gap-4.5 text-[11px] font-mono text-ink-500 font-bold mt-4">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-ink-600" />
                        <span>{sec.studentsCount} students</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCheck size={12} className="text-green-600" />
                        <span>{sec.avgAttendance}% avg attendance</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500" />
                        <span>{sec.avgQuizScore}% avg quiz</span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center p-1 text-ink-400">
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* SECTION ROSTER PANEL SCREEN */
          <motion.div
            key="section-roster-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-[16px]"
          >
            {/* Header section details */}
            <div className="flex items-start justify-between pb-2 border-b border-[#ECEAE5]">
              <div className="flex items-start gap-1">
                <button
                  onClick={() => setActiveSectionId(null)}
                  className="w-9 h-9 hover:bg-ink-100 rounded-full flex items-center justify-center text-ink-900 -ml-1 cursor-pointer border-none bg-transparent"
                >
                  <ChevronLeft size={22} />
                </button>
                <div>
                  <h1 className="text-[25px] font-extrabold text-ink-900 leading-none tracking-tight">
                    {activeMeta?.name} Students
                  </h1>
                  <p className="font-mono text-xs text-ink-500 font-semibold mt-1">
                    {activeMeta?.studentsCount} students &middot; Roster sheet
                  </p>
                </div>
              </div>

              {/* Sort Action popover button */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-9 h-9 border border-[#E0DED8] bg-white rounded-full flex items-center justify-center text-ink-900 cursor-pointer active:scale-95"
                >
                  <ArrowUpDown size={15} />
                </button>

                {/* Dropdown list */}
                {isSortDropdownOpen && (
                  <div className="absolute right-0 top-11 bg-white rounded-xl border border-[#ECEAE5] shadow-3 z-30 min-w-[210px] py-1 text-left font-sans text-xs">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-ink-400 uppercase tracking-widest leading-none my-1">
                      Sort list by
                    </div>
                    {[
                      { id: 'alphabetical', label: 'Alphabetical (A - Z)' },
                      { id: 'attendance-desc', label: 'Attendance (Highest first)' },
                      { id: 'attendance-asc', label: 'Attendance (Lowest first)' },
                      { id: 'submissions', label: 'Assignments Submitted' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortMethod(opt.id as any);
                          setIsSortDropdownOpen(false);
                          onTriggerToast(`List sorted by: ${opt.label}`);
                        }}
                        className="w-full px-3 py-2 flex items-center justify-between text-ink-900 font-medium hover:bg-ink-100/60 border-none bg-transparent cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        {sortMethod === opt.id && <Check size={12} className="text-[#FF5A36] font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH BANNER INPUT ROW */}
            <div className="relative font-sans">
              <Search size={15} className="absolute left-3.5 top-3.5 text-ink-450" />
              <input
                type="text"
                value={searchPhrase}
                onChange={(e) => setSearchPhrase(e.target.value)}
                placeholder="Search by name or student ID..."
                className="w-full bg-white border border-[#E0DED8] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-ink-900 outline-none placeholder:text-ink-400"
              />
              {searchPhrase.trim() && (
                <span className="absolute right-3.5 top-[13.5px] font-mono text-[10px] font-bold text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded">
                  {sortedAndFilteredList.length} matches
                </span>
              )}
            </div>

            {/* List students */}
            <div className="space-y-2">
              {sortedAndFilteredList.length === 0 ? (
                <div className="bg-[#FAFAF9] border border-dashed border-[#ECEAE5] rounded-[14px] p-8 text-center text-xs text-ink-400 italic">
                  No students match your query.
                </div>
              ) : (
                sortedAndFilteredList.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStudent(st);
                      onTriggerToast(`Viewing ${st.name}`);
                    }}
                    className="bg-white border border-[#ECEAE5] rounded-xl p-[11px] px-3 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] hover:border-ink-300 shadow-sm"
                  >
                    {/* Led Indicator dot */}
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getAttendanceLedgerDot(st.attendanceRate)}`} />

                    {/* Avatar Initials bubble */}
                    <div className="w-[38px] h-[38px] bg-ink-100 text-ink-905 font-extrabold text-[12.5px] rounded-full flex items-center justify-center shrink-0">
                      {getInitials(st.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-extrabold text-ink-900 leading-none truncate">{st.name}</h4>
                        {st.isCR && (
                          <span className="bg-[#FFF1F2] text-[#E5484D] text-[9.5px] font-mono font-extrabold uppercase rounded px-1 py-[0.5px] border border-[#FCE8E9]/10 shadow-sm">
                            CR
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10.5px] text-ink-400 mt-1 leading-none">{st.id}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-ink-900 leading-none">{st.attendanceRate}%</div>
                      <span className="text-[9.5px] font-sans font-semibold text-ink-500 mt-1 block">
                        {st.completedSubmissions}/{st.totalSubmissions} assign
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDENT DETAIL DRAWER POPUP SHEET */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-55 flex flex-col justify-end select-none font-sans overflow-hidden">
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
              onClick={() => setSelectedStudent(null)}
            />

            {/* Rising block */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, cubicBezier: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-w-sm mx-auto bg-white rounded-t-[28px] max-h-[85%] overflow-y-auto shadow-4 p-5 z-10 text-left space-y-4 pb-12"
            >
              <div className="w-[40px] h-[4px] bg-[#D4D2CC] rounded-full mx-auto mb-2 shrink-0" />

              {/* Header profile info */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3.5 items-center">
                  <div className="w-[50px] h-[50px] bg-ink-100 text-ink-900 font-extrabold text-[17px] rounded-full flex items-center justify-center shrink-0">
                    {getInitials(selectedStudent.name)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-ink-900 leading-none flex items-center gap-1.5">
                      {selectedStudent.name}
                      {selectedStudent.isCR && (
                        <span className="bg-[#FFF1F2] text-[#E5484D] text-[9.5px] font-mono font-bold uppercase rounded px-1.5 py-[0.5px]">CR</span>
                      )}
                    </h3>
                    <span className="font-mono text-[11.5px] text-ink-450 mt-1 block">{selectedStudent.id} &middot; CSE Dept</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full bg-ink-100/50 flex items-center justify-center border-none text-ink-900 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status details indicators list */}
              <div className="grid grid-cols-2 gap-3.5 bg-ink-100/30 p-3.5 rounded-xl text-xs sm:text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-[#75726A] uppercase block">Attendance Ratio</span>
                  <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-ink-900 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getAttendanceLedgerDot(selectedStudent.attendanceRate)}`} />
                    <span>{selectedStudent.attendanceRate}%</span>
                  </div>
                  <span className="text-[10px] text-ink-450 mt-0.5 block">Good standing</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#75726A] uppercase block">Task Submissions</span>
                  <div className="font-mono text-base font-extrabold text-ink-900 mt-1 flex items-center gap-1.5">
                    <FileText size={16} className="text-[#FF5A36] shrink-0" />
                    <span>{selectedStudent.completedSubmissions} of {selectedStudent.totalSubmissions}</span>
                  </div>
                  <span className="text-[10px] text-ink-450 mt-0.5 block">100% completion rate</span>
                </div>
              </div>

              {/* Detailed contacts rows details */}
              <div className="space-y-2.5 pt-1.5 font-sans">
                <span className="text-[11px] font-extrabold tracking-wider text-ink-400 uppercase block font-mono">Student Details</span>
                
                <div className="flex items-center gap-3 text-xs text-ink-800">
                  <Phone size={14} className="text-ink-400 shrink-0" />
                  <span className="font-semibold">{selectedStudent.phone || '+880-1700-111222'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-ink-800">
                  <Mail size={14} className="text-ink-400 shrink-0" />
                  <span className="font-semibold">{selectedStudent.email || 'student@domain.edu'}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-800">
                  <Award size={14} className="text-ink-400 shrink-0" />
                  <span className="font-semibold">Scholarship status: None</span>
                </div>
              </div>

              {/* Trigger fast contact methods */}
              <div className="flex gap-2 pt-3 border-t border-[#ECEAE5]">
                <button
                  type="button"
                  onClick={() => onTriggerToast(`Calling ${selectedStudent.name}...`)}
                  className="flex-1 bg-ink-900 text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow-sm inline-flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <Phone size={13} />
                  <span>Call Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerToast(`Email compose opened...`)}
                  className="flex-1 bg-white border border-[#E0DED8] text-ink-900 font-sans text-xs font-bold py-2.5 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail size={13} />
                  <span>Email</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
