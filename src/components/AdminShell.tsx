import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Map, 
  Users, 
  Sliders, 
  UserCheck, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Compass, 
  BookOpen, 
  RefreshCw,
  LogOut,
  Search,
  User as UserIcon
} from 'lucide-react';
import { User, BusRoute, AuditLog, Classmate } from '../types';

interface PendingAppItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  semester: string;
  section: string;
}

interface AdminShellProps {
  currentUser: User;
  busRoutes: BusRoute[];
  auditLogs: AuditLog[];
  classmates: Classmate[];
  attendance: Record<string, Record<string, { joined: number; missed: number }>>;
  onUpdateAttendance: (studentRolls: Record<string, { present: boolean }>, courseId: string) => void;
  pendingApps?: PendingAppItem[];
  onApprovePending?: (id: string, name: string, role: string) => void;
  onRejectPending?: (id: string) => void;
  onAddBusRoute: (newBus: BusRoute) => void;
  onLogout: () => void;
  onChangeContext: () => void;
  onAddAuditLog: (log: AuditLog) => void;
}

export default function AdminShell({
  currentUser,
  busRoutes,
  auditLogs,
  classmates = [],
  attendance = {},
  onUpdateAttendance,
  pendingApps = [],
  onApprovePending,
  onRejectPending,
  onAddBusRoute,
  onLogout,
  onChangeContext,
  onAddAuditLog
}: AdminShellProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Sections' | 'Attendance' | 'Transport' | 'Staff' | 'Settings'>('Overview');

  // Attendance State Management
  const [selectedCourse, setSelectedCourse] = useState<string>('CSE-3101');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterSec, setFilterSec] = useState<string>('All');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'present' | 'absent'>>({});
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceFeedback, setAttendanceFeedback] = useState<string | null>(null);

  // Get filtered students list
  const filteredClassmates = classmates.filter(std => {
    const matchesSearch = std.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          std.roll.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = filterDept === 'All' || std.department === filterDept;
    const matchesSec = filterSec === 'All' || 
                        std.section === filterSec || 
                        std.section?.endsWith(`-${filterSec}`) ||
                        std.section === `${std.department}-${filterSec}`;

    return matchesSearch && matchesDept && matchesSec;
  });

  const markAllPresent = () => {
    const sheet: Record<string, 'present' | 'absent'> = { ...attendanceSheet };
    filteredClassmates.forEach(std => {
      sheet[std.roll] = 'present';
    });
    setAttendanceSheet(sheet);
  };

  const markAllAbsent = () => {
    const sheet: Record<string, 'present' | 'absent'> = { ...attendanceSheet };
    filteredClassmates.forEach(std => {
      sheet[std.roll] = 'absent';
    });
    setAttendanceSheet(sheet);
  };

  const submitAttendanceForm = () => {
    setIsSubmittingAttendance(true);
    
    const finalSheet: Record<string, { present: boolean }> = {};
    filteredClassmates.forEach(std => {
      const status = attendanceSheet[std.roll] || 'present';
      finalSheet[std.roll] = { present: status === 'present' };
    });

    onUpdateAttendance(finalSheet, selectedCourse);

    onAddAuditLog({
      id: 'audit-' + Date.now(),
      actor: `Faculty ${currentUser.name.split(' ')[0]}`,
      action: 'Took Class Attendance Sheet',
      target: `${selectedCourse} - ${filterDept === 'All' ? 'Combined' : filterDept} Sec-${filterSec === 'All' ? 'All' : filterSec}`,
      timestamp: new Date().toISOString(),
      type: 'settings'
    });

    setTimeout(() => {
      setIsSubmittingAttendance(false);
      setAttendanceFeedback(`Recorded attendance sheet for ${selectedCourse}!`);
      setTimeout(() => {
        setAttendanceFeedback(null);
      }, 3500);
    }, 800);
  };
  
  // Sections Tab State
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSecName, setNewSecName] = useState('');
  const [newSecDept, setNewSecDept] = useState('CSE');
  const [newSecSemester, setNewSecSemester] = useState('Spring 2026');
  const [sectionsList, setSectionsList] = useState([
    { id: 'sec-1', name: 'CSE-A', dept: 'CSE', semester: 'Spring 2026', totalStudents: 45 },
    { id: 'sec-2', name: 'CSE-B', dept: 'CSE', semester: 'Spring 2026', totalStudents: 38 },
    { id: 'sec-3', name: 'EEE-A', dept: 'EEE', semester: 'Spring 2026', totalStudents: 22 },
  ]);

  // Transport state inputs
  const [isAddingBus, setIsAddingBus] = useState(false);
  const [busName, setBusName] = useState('');
  const [busNo, setBusNo] = useState('');
  const [busShifts, setBusShifts] = useState('07:30 AM / 02:30 PM');
  const [busTrack, setBusTrack] = useState('');

  // Staff registry
  const [staffQuery, setStaffQuery] = useState('');
  const [staffList, setStaffList] = useState([
    { id: 's1', name: 'Dr. Tariqul Islam', designation: 'Professor & CSE Head', email: 'tariqul.islam@faculty.edu' },
    { id: 's2', name: 'Prof. Shamim Al Mamun', designation: 'Professor', email: 'shamim.mamun@faculty.edu' },
    { id: 's3', name: 'Dr. Momena Begum', designation: 'Associate Professor', email: 'momena.begum@faculty.edu' },
    { id: 's4', name: 'Dr. Faisal Rahman', designation: 'Assistant Professor', email: 'faisal.rahman@faculty.edu' },
    { id: 's5', name: 'Lec. Sadia Afrin', designation: 'Lecturer', email: 'sadia.afrin@faculty.edu' }
  ]);

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(staffQuery.toLowerCase()) || 
    s.designation.toLowerCase().includes(staffQuery.toLowerCase())
  );

  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName) return;
    const addedSec = {
      id: 'sec-' + Date.now(),
      name: `${newSecDept}-${newSecName.toUpperCase()}`,
      dept: newSecDept,
      semester: newSecSemester,
      totalStudents: 0
    };
    setSectionsList([...sectionsList, addedSec]);
    setNewSecName('');
    setIsCreatingSection(false);

    onAddAuditLog({
      id: 'audit-' + Date.now(),
      actor: `Admin ${currentUser.name.split(' ')[0]}`,
      action: 'Created New Academic Section',
      target: addedSec.name,
      timestamp: new Date().toISOString(),
      type: 'section_edit'
    });
  };

  const handleAddBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busName || !busNo) return;

    onAddBusRoute({
      id: 'bus-' + Date.now(),
      name: busName,
      number: busNo,
      departureTime: busShifts,
      route: busTrack,
      status: 'active'
    });

    setBusName('');
    setBusNo('');
    setBusTrack('');
    setIsAddingBus(false);

    onAddAuditLog({
      id: 'audit-' + Date.now(),
      actor: `Admin ${currentUser.name.split(' ')[0]}`,
      action: 'Updated Transportation Fleet',
      target: `${busName} (${busNo})`,
      timestamp: new Date().toISOString(),
      type: 'transport_edit'
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-fg-1 flex flex-col font-sans pb-24">
      {/* Live Academic Header */}
      <header className="sticky top-0 z-40 bg-white/92 border-b border-subtle backdrop-blur-[24px] px-5 py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse shrink-0" />
            <h2 className="text-sm font-extrabold tracking-wide uppercase text-fg-1 truncate font-sans">
              {currentUser.department || 'Master Academic Coordinator'}
            </h2>
          </div>
          <p className="text-[11px] font-mono text-fg-3 tracking-wider mt-0.5 truncate font-semibold">
            Faculty Secretariat Desk &bull; {currentUser.semester || 'Spring 2026'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('Settings')}
          className="flex items-center gap-2 hover:opacity-90 transition-all text-left cursor-pointer shrink-0"
          title="View Active Profile"
        >
          {/* Amber style avatar for Faculty profile */}
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shrink-0 shadow-1">
            {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'A'}
          </div>
          <span className="text-[10px] text-fg-3 font-mono font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-5 max-w-lg mx-auto w-full space-y-5">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="admin-overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {/* Executive Operational Metrics Card */}
              <div className="bg-surface border border-subtle p-5 rounded-md space-y-4 shadow-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[17px] text-fg-1 font-sans">Faculty Executive Console</h3>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-fg-3 mt-1 font-semibold">Status: Active &bull; Master Mode</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-success-strong animate-pulse shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="bg-sunken border border-subtle rounded-md p-3 font-sans">
                    <span className="text-fg-3 text-[10px] uppercase font-bold font-mono block mb-1">Fleet Status</span>
                    <span className="text-coral font-bold uppercase text-[11px]">Active routines</span>
                  </div>
                  <div className="bg-sunken border border-subtle rounded-md p-3 font-sans">
                    <span className="text-fg-3 text-[10px] uppercase font-bold font-mono block mb-1">Authorization checks</span>
                    <span className="text-success-strong font-semibold uppercase text-[11px]">Ready &bull; Local</span>
                  </div>
                </div>
              </div>

              {/* Activity feed / Audit logs */}
              <div className="bg-surface border border-subtle p-4 rounded-md shadow-1">
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-subtle">
                  <div>
                    <h3 className="font-bold text-xs text-fg-3 uppercase tracking-wider font-mono">Institutional Activity Logs</h3>
                    <p className="text-[10px] text-fg-3 mt-0.5 font-sans">Real-time state logs and campus deployments.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-ink-100 rounded-pill text-[9.5px] font-bold text-fg-1 font-mono tabular-numbers">
                    {auditLogs.length} Records
                  </span>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.length === 0 ? (
                    <p className="text-xs text-fg-3 py-6 text-center italic">No recent transactions recorded.</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="bg-sunken border border-subtle rounded-md p-3.5 space-y-2 font-sans hover:border-coral-100 transition duration-120">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono bg-surface border border-subtle px-1.5 py-0.5 rounded-sm text-fg-3">
                            {log.actor}
                          </span>
                          <span className="text-[9px] text-fg-4 font-mono tabular-numbers">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-fg-1">{log.action}</p>
                          <p className="text-[10.5px] text-fg-3 font-mono mt-0.5">{log.target}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Sections' && (
            <motion.div
              key="admin-sections"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-fg-3 font-mono tracking-wider">Departmental Sections</h3>
                <button
                  onClick={() => setIsCreatingSection(true)}
                  className="py-1.5 px-3 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition duration-120 cursor-pointer flex items-center gap-1 hover:scale-[0.98] active:scale-97"
                >
                  <Plus size={14} strokeWidth={1.75} /> Section Node
                </button>
              </div>

              {/* Create Section Prompt Form */}
              {isCreatingSection && (
                <motion.form 
                  onSubmit={handleCreateSectionSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface border border-subtle rounded-md p-4 space-y-3.5 shadow-1 font-sans"
                >
                  <h4 className="text-xs font-bold text-coral font-mono uppercase tracking-wider">Establish Campus Section</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Department</label>
                      <select
                        value={newSecDept}
                        onChange={(e) => setNewSecDept(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2 text-[11px] text-fg-1 outline-none font-bold"
                      >
                        <option>CSE</option>
                        <option>EEE</option>
                        <option>BBA</option>
                        <option>SWE</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Semester Term</label>
                      <select
                        value={newSecSemester}
                        onChange={(e) => setNewSecSemester(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2 text-[11px] text-fg-1 outline-none font-bold"
                      >
                        <option>Spring 2026</option>
                        <option>Summer 2026</option>
                        <option>Fall 2026</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Section Code Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. C or D"
                      maxLength={1}
                      value={newSecName}
                      onChange={(e) => setNewSecName(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none uppercase font-bold"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 font-sans">
                    <button
                      type="button"
                      onClick={() => setIsCreatingSection(false)}
                      className="px-3.5 py-1.5 bg-ink-100 hover:bg-ink-200 text-fg-1 font-semibold text-xs rounded-pill transition cursor-pointer"
                    >
                      Bypass
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill transition cursor-pointer shadow-coral-glow"
                    >
                      Establish Map
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Sections list */}
              <div className="space-y-2.5 font-sans">
                {sectionsList.map((sec) => (
                  <div key={sec.id} className="bg-surface border border-subtle rounded-md p-4 flex items-center justify-between shadow-1 hover:border-coral-100 transition duration-120">
                    <div>
                      <h4 className="font-semibold text-fg-1 text-sm">{sec.name}</h4>
                      <p className="text-[10px] text-fg-3 font-mono tracking-tight mt-1 font-semibold">
                        Dept: {sec.dept} &bull; {sec.semester}
                      </p>
                    </div>

                    <div className="p-2.5 bg-sunken border border-subtle rounded-md text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-coral block tabular-numbers">{sec.totalStudents}</span>
                      <span className="text-[9px] text-fg-3 uppercase font-mono tracking-wider">Students</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Transport' && (
            <motion.div
              key="admin-transport"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-fg-3 font-mono tracking-wider">Transportation Shuttles</h3>
                <button
                  onClick={() => setIsAddingBus(true)}
                  className="py-1.5 px-3 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition duration-120 cursor-pointer flex items-center gap-1 hover:scale-[0.98] active:scale-97"
                >
                  <Plus size={14} strokeWidth={1.75} /> Register Fleet Bus
                </button>
              </div>

              {/* Add Bus form */}
              {isAddingBus && (
                <motion.form 
                  onSubmit={handleAddBusSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface border border-subtle rounded-md p-4 space-y-3.5 shadow-1 font-sans"
                >
                  <h4 className="text-xs font-bold text-coral font-mono uppercase tracking-wider">Add Shuttle Vehicle</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Route Corridor Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Banani Link"
                        value={busName}
                        onChange={(e) => setBusName(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2 text-xs text-fg-1 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Vehicle ID No.</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bus-22"
                        value={busNo}
                        onChange={(e) => setBusNo(e.target.value)}
                        className="w-full bg-surface border border-border-default rounded-[12px] p-2 text-xs text-fg-1 outline-none font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Shuttle Shifts Timing</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 07:30 AM / 02:30 PM"
                      value={busShifts}
                      onChange={(e) => setBusShifts(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2 text-xs text-fg-1 outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Track Stoppages & Routing Stops</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Dhanmondi -> Karwan Bazar -> Campus"
                      value={busTrack}
                      onChange={(e) => setBusTrack(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingBus(false)}
                      className="px-3.5 py-1.5 bg-ink-100 hover:bg-ink-200 text-fg-1 font-semibold text-xs rounded-pill transition cursor-pointer"
                    >
                      Bypass
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill transition cursor-pointer shadow-coral-glow"
                    >
                      Configure Shuttle
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Bus fleet list */}
              <div className="space-y-2.5 font-sans">
                {busRoutes.map((bus) => (
                  <div key={bus.id} className="bg-surface border border-subtle rounded-md p-4 flex items-center justify-between shadow-1 hover:border-coral-100 transition duration-120">
                    <div>
                      <span className="text-[9.5px] font-mono leading-none bg-ink-100 border border-subtle px-1.5 py-0.5 rounded-sm font-bold text-fg-2 uppercase tracking-wide">
                        {bus.number}
                      </span>
                      <h4 className="font-semibold text-fg-1 text-sm mt-1.5 leading-none">{bus.name}</h4>
                      <p className="text-[10px] text-fg-3 font-mono mt-1 tabular-numbers">{bus.departureTime}</p>
                    </div>

                    <span className="px-2.5 py-0.5 bg-success-bg text-success-strong rounded-pill font-mono font-bold text-[10px] uppercase">
                      {bus.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Attendance' && (
            <motion.div
              key="admin-attendance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Header card */}
              <div className="bg-surface border border-subtle p-4 rounded-md relative overflow-hidden shadow-1">
                <span className="absolute -right-6 -top-6 text-coral/5 scale-[4] select-none pointer-events-none">
                  <BookOpen size={48} />
                </span>
                <h3 className="font-semibold text-sm text-fg-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
                  Class Attendance Management
                </h3>
                <p className="text-xs text-fg-3 font-sans">Review student performance logs or mark current session worksheets.</p>
              </div>

              {/* Take Attendance Section */}
              <div className="bg-surface border border-subtle rounded-md p-5 space-y-4 shadow-1 font-sans">
                <div className="flex items-center justify-between border-b border-subtle pb-3">
                  <h4 className="text-xs font-bold font-mono text-coral uppercase tracking-widest">Mark New Session Sheet</h4>
                  <span className="bg-sunken px-2.5 py-0.5 rounded-pill border border-subtle font-mono text-[10px] text-fg-2 font-bold uppercase">
                    Term: {currentUser.semester || 'Spring 2026'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-fg-3 uppercase font-mono block mb-1 font-bold">Select Active Core Lecture</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        setAttendanceFeedback(null);
                      }}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-3 text-xs text-fg-1 font-mono font-bold focus:border-coral focus:ring-[4px] focus:ring-coral/18 outline-none"
                    >
                      <option value="CSE-3101">CSE-3101: Database Systems</option>
                      <option value="CSE-3103">CSE-3103: Software Engineering</option>
                      <option value="CSE-3105">CSE-3105: Computer Networks</option>
                      <option value="CSE-3107">CSE-3107: Artificial Intelligence</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-fg-3 uppercase font-mono block mb-1 font-bold">Filter Department</label>
                      <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="w-full bg-surface border border-border-default text-fg-1 text-xs rounded-[12px] p-2.5 outline-none font-bold"
                      >
                        <option value="All">All Departments</option>
                        <option value="CSE">CSE (Computer Science)</option>
                        <option value="SWE">SWE (Software Eng.)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-fg-3 uppercase font-mono block mb-1 font-bold">Filter Specific Section</label>
                      <select
                        value={filterSec}
                        onChange={(e) => setFilterSec(e.target.value)}
                        className="w-full bg-surface border border-border-default text-fg-1 text-xs rounded-[12px] p-2.5 outline-none font-bold"
                      >
                        <option value="All">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search field */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                    <Search size={16} strokeWidth={1.75} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search student directory by name or roll ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-surface border border-border-default text-fg-1 pl-10 pr-3.5 py-3 text-xs rounded-[12px] outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18"
                  />
                </div>

                {/* Sub-header controls */}
                <div className="flex items-center justify-between text-[11px] font-mono text-fg-2 bg-sunken px-3.5 py-2.5 rounded-md border border-subtle">
                  <span>Match Total: <strong className="text-fg-1 font-bold font-sans tabular-numbers">{filteredClassmates.length}</strong></span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={markAllPresent}
                      className="text-success-strong hover:text-coral font-bold transition cursor-pointer"
                    >
                      ✓ Present All
                    </button>
                    <span className="text-fg-4">|</span>
                    <button 
                      onClick={markAllAbsent}
                      className="text-danger-fg hover:text-coral font-bold transition cursor-pointer"
                    >
                      ✗ Absent All
                    </button>
                  </div>
                </div>

                {/* Student attendance list */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {filteredClassmates.map(student => {
                    const status = attendanceSheet[student.roll] || 'present';
                    const stats = (attendance[student.roll] && attendance[student.roll][selectedCourse]) || { joined: 12, missed: 1 };
                    const totalClasses = stats.joined + stats.missed;
                    const pct = totalClasses === 0 ? '0%' : `${Math.round((stats.joined / totalClasses) * 100)}%`;

                    return (
                      <div 
                        key={student.id} 
                        className="bg-surface border border-subtle rounded-md p-3.5 flex items-center justify-between gap-3 shadow-1 transition hover:border-coral-100"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 font-sans">
                          <div className="w-[36px] h-[36px] rounded-full bg-coral-100 text-coral flex items-center justify-center font-bold text-xs shrink-0 select-none">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h5 className="text-[14px] font-semibold text-fg-1 truncate pr-1" title={student.name}>
                              {student.name}
                            </h5>
                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-3 truncate pr-1 font-semibold">
                              <span>{student.roll}</span>
                              <span className="text-fg-4">&bull;</span>
                              <span className="text-coral">{student.section}</span>
                            </div>
                            <div className="text-[10px] font-mono text-fg-3 flex items-center gap-1.5 pt-0.5 truncate pr-1 font-semibold">
                              <span>Pres: <strong className="text-success-strong">{stats.joined}</strong></span>
                              <span>&bull;</span>
                              <span>Abs: <strong className="text-danger-fg">{stats.missed}</strong></span>
                              <span className="ml-1 px-1.5 py-0.2 bg-coral-50 rounded font-bold text-coral tabular-numbers">
                                {pct}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Toggle switch selectors */}
                        <div className="flex bg-sunken border border-subtle p-0.5 rounded-pill shrink-0">
                          <button
                            type="button"
                            onClick={() => setAttendanceSheet(p => ({ ...p, [student.roll]: 'present' }))}
                            className={`px-3 py-1.5 text-[9.5px] uppercase font-mono tracking-wider font-extrabold transition-all duration-120 rounded-pill ${
                              status === 'present'
                                ? 'bg-success-bg text-success-strong shadow-1 font-semibold'
                                : 'border-transparent text-fg-3 hover:text-fg-1 cursor-pointer'
                            }`}
                          >
                            ✓ Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceSheet(p => ({ ...p, [student.roll]: 'absent' }))}
                            className={`px-3 py-1.5 text-[9.5px] uppercase font-mono tracking-wider font-extrabold transition-all duration-120 rounded-pill ${
                              status === 'absent'
                                ? 'bg-danger-bg text-danger-fg shadow-1 font-semibold'
                                : 'border-transparent text-fg-3 hover:text-fg-1 cursor-pointer'
                            }`}
                          >
                            ✗ Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredClassmates.length === 0 && (
                    <div className="p-8 text-center border border-subtle bg-sunken border-dashed rounded-md space-y-1">
                      <p className="text-xs text-fg-3 font-semibold">No matching student directories</p>
                      <p className="text-[10px] text-fg-3 font-mono">Verify department and section configurations</p>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                {filteredClassmates.length > 0 && (
                  <button
                    onClick={submitAttendanceForm}
                    disabled={isSubmittingAttendance}
                    className="w-full mt-2 py-3 bg-coral hover:bg-coral-600 font-semibold text-xs rounded-pill shadow-coral-glow transition-all duration-120 uppercase text-white tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingAttendance ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-white" strokeWidth={1.75} />
                        Recording worksheet...
                      </>
                    ) : (
                      <>Submit Session Attendance Sheet ({filteredClassmates.length} Students)</>
                    )}
                  </button>
                )}

                {attendanceFeedback && (
                  <div className="p-3 bg-success-bg border border-success-strong/10 text-success-strong text-xs rounded-md font-semibold flex items-center gap-1.5 font-sans">
                    <CheckCircle size={14} className="shrink-0" strokeWidth={1.75} />
                    <span>✓ {attendanceFeedback}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Staff' && (
            <motion.div
              key="admin-staff"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="space-y-1 bg-surface border border-subtle p-4 rounded-md shadow-1">
                <h3 className="font-semibold text-sm text-fg-1">University staff directory</h3>
                <p className="text-xs text-fg-3">Master database of professors, lab supervisors, and support assistants.</p>
              </div>

              {/* Search staff */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                  <Search size={16} strokeWidth={1.75} />
                </span>
                <input
                   type="text"
                   value={staffQuery}
                   onChange={(e) => setStaffQuery(e.target.value)}
                   placeholder="Filter staff names, designations..."
                   className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none transition-all shadow-1 focus:border-coral focus:ring-[4px] focus:ring-coral/18"
                />
              </div>

              {/* Staff list */}
              <div className="space-y-2.5 font-sans">
                {filteredStaff.map((staff) => (
                  <div key={staff.id} className="bg-surface border border-subtle rounded-md p-4 space-y-2.5 shadow-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-fg-1 text-[15px]">{staff.name}</h4>
                        <span className="text-[10px] font-mono bg-ink-100 border border-subtle px-1.5 py-0.5 mt-2 rounded-sm font-semibold text-fg-1 block leading-none w-fit uppercase">
                          {staff.designation}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-fg-3 bg-sunken border border-subtle px-1.5 py-0.5 rounded-sm shrink-0">
                        Faculty
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-fg-3 pt-2 border-t border-subtle">
                      Staff email: <span className="text-fg-1 font-semibold">{staff.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="admin-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="bg-surface border border-subtle p-4 rounded-md space-y-1 shadow-1">
                <h3 className="font-semibold text-sm text-fg-1">Portal context configuration</h3>
                <p className="text-xs text-fg-3">Modify coordinator credentials and identity loops.</p>
              </div>

              {/* Verification credentials */}
              <div className="bg-surface border border-subtle rounded-md p-4.5 space-y-4 shadow-1 font-sans">
                <h4 className="text-xs font-bold font-mono text-coral uppercase tracking-widest">Active Executive Profile</h4>
                
                <div className="grid grid-cols-2 text-xs font-mono text-fg-3 gap-y-3 gap-x-1 divide-y divide-subtle">
                  <span className="pt-2 font-semibold">Secretariat Lead:</span>
                  <span className="text-right text-fg-1 pt-2 font-sans font-semibold">{currentUser.name}</span>
                  <span className="pt-2 font-semibold">Authorized Desk:</span>
                  <span className="text-right text-fg-1 pt-2">{currentUser.department || 'All'}</span>
                  <span className="pt-2 font-semibold">Active Session:</span>
                  <span className="text-right text-fg-1 pt-2">{currentUser.semester || 'Spring 2026'}</span>
                </div>
              </div>

              {/* Action tools */}
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
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/92 backdrop-blur-[24px] border-t border-subtle flex items-center justify-around shadow-sm safe-bottom py-1.5">
        {[
          { icon: <UserCheck size={22} strokeWidth={1.75} />, label: 'Overview' as const, display: 'Overview' },
          { icon: <Building2 size={22} strokeWidth={1.75} />, label: 'Sections' as const, display: 'Sections' },
          { icon: <BookOpen size={22} strokeWidth={1.75} />, label: 'Attendance' as const, display: 'Attendance' },
          { icon: <Compass size={22} strokeWidth={1.75} />, label: 'Transport' as const, display: 'Transport' },
          { icon: <Users size={22} strokeWidth={1.75} />, label: 'Staff' as const, display: 'Staff' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-sm transition duration-120 cursor-pointer ${
              activeTab === item.label
                ? 'text-coral'
                : 'text-fg-3 hover:text-fg-1'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold uppercase tracking-tight">{item.display}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}
