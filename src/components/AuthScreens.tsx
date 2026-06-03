import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  School, 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Shield, 
  GraduationCap, 
  Users, 
  Hourglass, 
  CheckCircle,
  Hash,
  Bus,
  Footprints,
  ChevronRight,
  X,
  Search
} from 'lucide-react';
import { Role, AuthState, User } from '../types';

interface AuthScreensProps {
  authState: AuthState;
  onStateChange: (state: AuthState) => void;
  currentUser: User | null;
  onUpdateUser: (updates: Partial<User>) => void;
}

export default function AuthScreens({
  authState,
  onStateChange,
  currentUser,
  onUpdateUser
}: AuthScreensProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  
  // Onboarding local selections
  const [selectedDept, setSelectedDept] = useState<string>('CSE');
  const [selectedSem, setSelectedSem] = useState<string>('Spring 2026');
  const [selectedSec, setSelectedSec] = useState<string>('');
  const [batchInput, setBatchInput] = useState<string>('');
  const [batchError, setBatchError] = useState<boolean>(false);

  // Transport selections
  const [transportMode, setTransportMode] = useState<'bus' | 'walk-in' | 'unset'>('unset');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [isRoutePickerOpen, setIsRoutePickerOpen] = useState<boolean>(false);
  const [pickerSearchQuery, setPickerSearchQuery] = useState<string>('');
  const [localToast, setLocalToast] = useState<string | null>(null);

  const mockRoutes = [
    { id: 'route-7', name: 'Route 7', area: 'Dhanmondi', stops: '8 stops' },
    { id: 'route-9', name: 'Route 9', area: 'Mohammadpur', stops: '6 stops' },
    { id: 'route-12', name: 'Route 12', area: 'Mirpur', stops: '9 stops' },
    { id: 'route-15', name: 'Route 15', area: 'Uttara', stops: '11 stops' },
    { id: 'route-18', name: 'Route 18', area: 'Bashundhara', stops: '5 stops' },
    { id: 'route-22', name: 'Route 22', area: 'Old Dhaka', stops: '7 stops' },
  ];

  const triggerLocalToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => {
      setLocalToast(null);
    }, 2000);
  };

  const isValidBatch = (val: string) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1 && num <= 999;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = email.trim().toLowerCase();
    const isMaster = loginEmail === 'tanvirrezamukto@gmail.com' || (!email && currentUser?.email === 'tanvirrezamukto@gmail.com');
    
    if (isMaster) {
      onUpdateUser({
        name: 'Tanvir Reza Mukto',
        email: 'tanvirrezamukto@gmail.com',
        role: 'Super Admin',
        department: 'Institution',
        semester: 'Spring 2026',
        section: 'Section Factory University',
        isApproved: true,
      });
      onStateChange('ready');
    } else {
      if (isSignUp) {
        onUpdateUser({
          name: name || 'Guest User',
          email: email || 'user@university.edu',
          isApproved: false,
          role: null
        });
      } else {
        onUpdateUser({
          name: currentUser?.name || 'Tanvir Reza Mukto',
          email: email || 'tanvirrezamukto@gmail.com',
          isApproved: false,
          role: null
        });
      }
      onStateChange('needsRole');
    }
  };

  const handleRoleSelect = (role: Role) => {
    onUpdateUser({ role });
    if (role === 'Super Admin') {
      onUpdateUser({
        department: 'Institution',
        semester: 'Spring 2026',
        section: 'Section Factory University',
        isApproved: true,
      });
      onStateChange('ready');
    } else if (role === 'faculty') {
      onUpdateUser({
        name: 'Dr. Nazmul Sultan Lipu',
        email: 'nazmul.lipu@swe.edu',
        role: 'faculty',
        department: 'SWE',
        semester: 'Spring 2026',
        section: 'SWE-M',
        isApproved: true,
      });
      onStateChange('ready');
    } else {
      onStateChange('needsOnboarding');
    }
  };

  const handleOnboardingSubmit = () => {
    onUpdateUser({
      department: selectedDept,
      semester: selectedSem,
      section: `${selectedDept}-${selectedSec.toUpperCase().trim() || 'A'}`,
      batch: batchInput ? parseInt(batchInput, 10) : undefined,
      transport: transportMode === 'bus' ? { mode: 'bus', busRouteId: selectedRouteId } : { mode: 'walk-in' }
    });
    onStateChange('pending');
  };

  return (
    <div className="min-h-screen bg-canvas text-fg-1 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Subtle modern ambient lights in coral tones */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-coral/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-coral-600/5 blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 relative z-10 w-full max-w-md mx-auto py-4">
        <div className="w-10 h-10 bg-coral rounded-md flex items-center justify-center text-white shadow-1">
          <School size={22} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg-1 font-sans">Section Factory</h1>
          <p className="text-[11px] text-fg-3 uppercase font-mono tracking-wider font-semibold">Academic Section Manager</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-8 relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {authState === 'signedOut' && (
            <motion.div
              key="welcome-and-auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              {!isSignUp ? (
                /* Welcome / Login Form */
                <div id="signin-container" className="bg-surface border border-subtle rounded-md p-6 shadow-1 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-fg-1 flex items-center gap-2">
                      <span className="w-1 h-5.5 bg-coral rounded-pill"></span>
                      Welcome back
                    </h2>
                    <p className="text-xs text-fg-3">Enter your credentials to access Section Factory</p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label id="lbl-email" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <Mail size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tanvirrezamukto@gmail.com"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label id="lbl-pwd" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Security Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <Lock size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-pwd"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                        />
                      </div>
                    </div>

                    {/* Pre-fill quick trigger button for fast evaluation */}
                    <div className="flex justify-between items-center text-xs pt-1">
                      <button
                        id="btn-quick-fill"
                        type="button"
                        onClick={() => {
                          setEmail('tanvirrezamukto@gmail.com');
                          setPassword('password123');
                        }}
                        className="text-coral hover:text-coral-600 font-bold transition flex items-center gap-1 cursor-pointer duration-120"
                      >
                        ⚡ Autofill credentials
                      </button>
                    </div>

                    <button
                      id="btn-login-submit"
                      type="submit"
                      className="w-full py-[11px] px-[18px] bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-semibold text-[14px] rounded-pill shadow-coral-glow hover:scale-[0.98] active:scale-97 active:opacity-85 transition-all duration-120 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Authenticate account
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </button>
                  </form>

                  <div className="pt-2 text-center">
                    <button
                      id="btn-goto-signup"
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-xs text-fg-3 hover:text-fg-1 transition font-medium cursor-pointer"
                    >
                      Don't have an account? <span className="text-coral hover:text-coral-600 font-bold underline underline-offset-4">Register here</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Info */
                <div id="signup-container" className="bg-surface border border-subtle rounded-md p-6 shadow-1 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-fg-1 flex items-center gap-2">
                      <span className="w-1 h-5.5 bg-coral rounded-pill"></span>
                      Create account
                    </h2>
                    <p className="text-xs text-fg-3">Establish a new Section Factory digital identity</p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label id="lbl-signup-name" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Full name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <UserIcon size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-signup-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tanvir Reza Mukto"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label id="lbl-signup-email" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Institutional email</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <Mail size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-signup-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tanvirrezamukto@gmail.com"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label id="lbl-signup-roll" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Student roll / id (optional)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <Hash size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-signup-roll"
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="CSE-023-1103"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label id="lbl-signup-pwd" className="text-[11px] font-semibold uppercase tracking-wider text-fg-3 font-mono">Security password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4">
                          <Lock size={16} strokeWidth={1.75} />
                        </span>
                        <input
                          id="inp-signup-pwd"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-10 pr-3.5 text-[15px] text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-signup-submit"
                      type="submit"
                      className="w-full py-[11px] px-[18px] bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white font-semibold text-[14px] rounded-pill shadow-coral-glow hover:scale-[0.98] active:scale-97 active:opacity-85 transition-all duration-120 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Complete registration
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </button>
                  </form>

                  <div className="pt-2 text-center">
                    <button
                      id="btn-goto-signin"
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-xs text-fg-3 hover:text-fg-1 transition font-medium cursor-pointer"
                    >
                      Already have an account? <span className="text-coral hover:text-coral-600 font-bold underline underline-offset-4">Authenticate instead</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {authState === 'needsRole' && (
            <motion.div
              key="role-pick"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="w-full space-y-6"
            >
              <div className="text-center space-y-2 mb-2">
                <div className="w-12 h-12 bg-coral-100 text-coral rounded-full flex items-center justify-center mx-auto shadow-1">
                  <Shield size={26} strokeWidth={1.75} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-fg-1">Select Academic Role</h2>
                <p className="text-xs text-fg-3">Section Factory configures features according to your scope</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    role: 'Student' as Role,
                    title: 'Student Profile',
                    desc: 'View schedules, routines, transport routes, and lecture resources assigned to your section.',
                    icon: <GraduationCap size={20} className="text-coral" strokeWidth={1.75} />,
                    bg: 'hover:border-coral/45 hover:bg-coral-50'
                  },
                  {
                    role: 'CR' as Role,
                    title: 'Class Representative (CR)',
                    desc: 'Manage daily announcements, communicate class alterations, map class routines, and guide students.',
                    icon: <Users size={20} className="text-coral" strokeWidth={1.75} />,
                    bg: 'hover:border-coral/45 hover:bg-coral-50'
                  },
                  {
                    role: 'faculty' as Role,
                    title: 'Faculty Profile (v1.x Preview)',
                    desc: 'Take attendance, post announcements, publish quiz grades, post assignments, manage office hours, and share materials.',
                    icon: <Shield size={20} className="text-coral" strokeWidth={1.75} />,
                    bg: 'hover:border-coral/45 hover:bg-coral-50'
                  },
                  {
                    role: 'Admin' as Role,
                    title: 'Administrator Profile',
                    desc: 'Configure section routines, control transport updates, verify CRs, and monitor overall operations.',
                    icon: <Shield size={20} className="text-coral" strokeWidth={1.75} />,
                    bg: 'hover:border-coral/45 hover:bg-coral-50'
                  }
                ].map((item) => (
                  <button
                    id={`btn-role-${item.role.toLowerCase().replace(' ', '-')}`}
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role)}
                    className={`text-left p-4 rounded-md border border-subtle bg-surface hover:scale-[1.01] hover:-translate-y-[0.5px] cursor-pointer transition-all duration-120 group flex items-start gap-3.5 outline-none ${item.bg} shadow-1`}
                  >
                    <div className="p-2 rounded-sm bg-ink-50 border border-subtle group-hover:bg-surface transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-fg-1 text-sm group-hover:text-coral transition-colors flex items-center gap-1.5 flex-wrap">
                        {item.title}
                      </h3>
                      <p className="text-xs text-fg-3 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  id="btn-role-back"
                  type="button"
                  onClick={() => onStateChange('signedOut')}
                  className="text-xs text-fg-3 hover:text-fg-1 transition font-medium cursor-pointer"
                >
                  ← Return to welcome authentication
                </button>
              </div>
            </motion.div>
          )}

          {authState === 'needsOnboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="w-full bg-surface border border-subtle rounded-md p-6 shadow-1 space-y-6"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-fg-1 flex items-center justify-center gap-2">
                  <span className="w-1 h-5.5 bg-coral rounded-pill"></span>
                  Join Section & Semester
                </h2>
                <p className="text-xs text-fg-3">Map your coordinates to receive tailored routines</p>
              </div>

              {/* Department Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-fg-3 uppercase tracking-wider font-mono">1. Select Department</label>
                <div className="grid grid-cols-4 gap-2">
                  {['CSE', 'EEE', 'BBA', 'SWE'].map((dept) => (
                    <button
                      id={`btn-onboarding-dept-${dept.toLowerCase()}`}
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`py-2 px-3 text-center rounded-pill border text-xs font-semibold transition duration-120 cursor-pointer ${
                        selectedDept === dept
                          ? 'bg-ink-900 border-none text-ink-0 shadow-1'
                          : 'bg-surface border border-border-default text-fg-1 hover:border-ink-400'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-fg-3 uppercase tracking-wider font-mono">2. Select Semester</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Spring 2026', 'Summer 2026', 'Fall 2026'].map((sem) => (
                    <button
                      id={`btn-onboarding-sem-${sem.toLowerCase().replace(' ', '-')}`}
                      key={sem}
                      type="button"
                      onClick={() => setSelectedSem(sem)}
                      className={`py-2 px-2 text-center rounded-pill border text-[11px] font-semibold transition duration-120 cursor-pointer ${
                        selectedSem === sem
                          ? 'bg-ink-900 border-none text-ink-0 shadow-1'
                          : 'bg-surface border border-border-default text-fg-2 hover:border-ink-400'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Code Picker / Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-fg-3 uppercase tracking-wider font-mono">3. Enter Academic Section</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-fg-4 font-mono font-bold text-xs pointer-events-none">
                    {selectedDept}-
                  </span>
                  <input
                    id="inp-onboarding-sec"
                    type="text"
                    required
                    maxLength={10}
                    value={selectedSec}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      const clean = val.replace(/[^A-Z]/g, '');
                      setSelectedSec(clean);
                    }}
                    placeholder="e.g. M"
                    className="w-full bg-surface border border-border-default rounded-[12px] py-3 pl-14 pr-3.5 font-bold text-xs text-fg-1 placeholder:text-fg-4 outline-none focus:border-coral focus:ring-[4px] focus:ring-coral/18 transition-all uppercase"
                  />
                </div>
                <div className="text-[11px] text-fg-3 font-mono flex items-center gap-1 mt-1">
                  <span>System mapping result:</span>
                  <span className="font-bold text-coral bg-coral-50 px-1.5 py-0.5 rounded text-[11px]">
                    {selectedDept}-{selectedSec || '?'}
                  </span>
                </div>
              </div>

              {/* Step 4: ENTER BATCH NUMBER */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-500 font-sans block">
                  4. ENTER BATCH NUMBER
                </label>
                <div className="relative">
                  <input
                    id="inp-onboarding-batch"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={3}
                    value={batchInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      const clean = val.replace(/[^\d]/g, '').slice(0, 3);
                      setBatchInput(clean);
                      if (/[^\d]/.test(val)) {
                        setBatchError(true);
                      } else {
                        setBatchError(false);
                      }
                    }}
                    placeholder="e.g. 46"
                    className="w-full bg-surface border border-[#E0DED8] rounded-[12px] py-3 px-3.5 text-[15px] font-mono font-semibold text-ink-900 placeholder:text-fg-4 outline-none focus:border-[#FF5A36] focus:ring-[4px] focus:ring-[rgba(255,90,54,0.18)] transition-all"
                  />
                </div>
                {batchError && (
                  <p className="text-[12px] font-medium text-[#E5484D] mt-1.5 leading-none font-sans">
                    Batch must be a number
                  </p>
                )}
                {batchInput !== '' && isValidBatch(batchInput) && (
                  <div className="text-[11px] text-fg-3 font-mono flex items-center gap-2 mt-1.5 leading-none">
                    <span>System mapping result:</span>
                    <span className="font-mono text-[12px] font-semibold text-[#FF5A36] bg-[#FFF4F0] px-2.5 py-1 rounded-full text-[12px]">
                      Batch {batchInput}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 5: SELECT YOUR TRANSPORT */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-500 font-sans block">
                  5. SELECT YOUR TRANSPORT
                </label>
                <div className="flex flex-col gap-2.5">
                  {/* OPTION A */}
                  <motion.div
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={() => {
                      setTransportMode('bus');
                      setSelectedRouteId('');
                    }}
                    className={`p-3.5 rounded-[12px] cursor-pointer transition-all ${
                      transportMode === 'bus'
                        ? 'border-[2px] border-[#FF5A36] bg-surface'
                        : 'border border-[#ECEAE5] bg-surface hover:border-ink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio Circle */}
                      <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                        transportMode === 'bus' ? 'border-[#FF5A36] bg-[#FFE7DF]' : 'border-[#CCCCCC] bg-transparent'
                      }`}>
                        {transportMode === 'bus' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-[15px] font-semibold text-ink-900 leading-snug font-sans">
                          I take the bus
                        </h4>
                        <p className="text-[12px] font-medium text-ink-500 leading-none mt-1">
                          Pick your route below
                        </p>
                      </div>
                      <Bus size={22} className="text-[#FF5A36] shrink-0" strokeWidth={1.75} />
                    </div>
                  </motion.div>

                  {/* OPTION B */}
                  <motion.div
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={() => {
                      setTransportMode('walk-in');
                      setSelectedRouteId('');
                    }}
                    className={`p-3.5 rounded-[12px] cursor-pointer transition-all ${
                      transportMode === 'walk-in'
                        ? 'border-[2px] border-[#FF5A36] bg-surface'
                        : 'border border-[#ECEAE5] bg-surface hover:border-ink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio Circle */}
                      <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                        transportMode === 'walk-in' ? 'border-[#FF5A36] bg-[#FFE7DF]' : 'border-[#CCCCCC] bg-transparent'
                      }`}>
                        {transportMode === 'walk-in' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-[15px] font-semibold text-ink-900 leading-snug font-sans">
                          Walk-in / I arrange my own
                        </h4>
                        <p className="text-[12px] font-medium text-ink-500 leading-none mt-1">
                          Rickshaw, CNG, own vehicle &mdash; no bus updates on home
                        </p>
                      </div>
                      <Footprints size={22} className="text-ink-500 shrink-0" strokeWidth={1.75} />
                    </div>
                  </motion.div>
                </div>

                {/* Sub-route picker (only for option A) */}
                <AnimatePresence>
                  {transportMode === 'bus' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        whileTap={{ scale: 0.97, opacity: 0.85 }}
                        onClick={() => {
                          setPickerSearchQuery('');
                          setIsRoutePickerOpen(true);
                        }}
                        className="w-full bg-surface border border-[#ECEAE5] rounded-[12px] p-3.5 flex items-center justify-between cursor-pointer hover:border-ink-300"
                      >
                        <div className="text-left">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-500 leading-none font-sans mb-1.5">
                            Pick route
                          </span>
                          <span className={`block text-[15px] font-semibold font-sans ${
                            selectedRouteId ? 'text-ink-900' : 'text-ink-400'
                          }`}>
                            {selectedRouteId 
                              ? `${mockRoutes.find(r => r.id === selectedRouteId)?.name || ''} · ${mockRoutes.find(r => r.id === selectedRouteId)?.area || ''}`
                              : 'Pick your route'
                            }
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-ink-400 shrink-0" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* System mapping result row */}
                {transportMode !== 'unset' && (transportMode === 'walk-in' || (transportMode === 'bus' && selectedRouteId)) && (
                  <div className="text-[11px] text-fg-3 font-mono flex items-center gap-2 mt-2 leading-none">
                    <span>Transport:</span>
                    <span className="font-mono text-[12px] font-semibold text-[#FF5A36] bg-[#FFF4F0] px-2.5 py-1 rounded-full">
                      {transportMode === 'bus' 
                        ? `${mockRoutes.find(r => r.id === selectedRouteId)?.name || ''} · ${mockRoutes.find(r => r.id === selectedRouteId)?.area || ''}`
                        : 'Walk-in'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="border border-subtle my-2 pt-4 flex items-center justify-between text-xs bg-sunken p-3 rounded-md">
                <span className="text-fg-3 font-mono font-bold uppercase tracking-wider text-[11px]">Mapping Stream:</span>
                <span className="text-[#0E0D0B] font-bold font-mono bg-ink-200 px-2 py-0.5 rounded-pill text-[11px] flex items-center flex-wrap gap-1">
                  <span>{selectedDept}</span>
                  <span>&bull;</span>
                  <span>{selectedSem}</span>
                  <span>&bull;</span>
                  <span>{selectedDept}-{selectedSec || '?'}</span>
                  {batchInput !== '' && isValidBatch(batchInput) && (
                    <>
                      <span>&bull;</span>
                      <span className="font-mono text-[13px] font-semibold text-fg-1">Batch {batchInput}</span>
                    </>
                  )}
                  {transportMode !== 'unset' && (transportMode === 'walk-in' || (transportMode === 'bus' && selectedRouteId)) && (
                    <>
                      <span>&bull;</span>
                      <span className="font-mono text-[12px] font-semibold text-[#FF5A36]">
                        {transportMode === 'bus' ? (mockRoutes.find(r => r.id === selectedRouteId)?.name || 'Bus') : 'Walk-in'}
                      </span>
                    </>
                  )}
                </span>
              </div>

              <button
                id="btn-complete-onboarding"
                type="button"
                disabled={!(selectedDept && selectedSem && selectedSec.trim() !== '' && batchInput !== '' && isValidBatch(batchInput) && (transportMode === 'walk-in' || (transportMode === 'bus' && selectedRouteId)))}
                onClick={handleOnboardingSubmit}
                className={`w-full py-[11px] px-[18px] rounded-pill text-[14px] font-semibold transition-all duration-120 flex items-center justify-center gap-2 ${
                  (selectedDept && selectedSem && selectedSec.trim() !== '' && batchInput !== '' && isValidBatch(batchInput) && (transportMode === 'walk-in' || (transportMode === 'bus' && selectedRouteId)))
                    ? 'bg-coral hover:bg-coral-600 focus:bg-coral-600 text-white shadow-coral-glow hover:scale-[0.98] active:scale-97 active:opacity-85 cursor-pointer'
                    : 'bg-coral text-white opacity-40 pointer-events-none'
                }`}
              >
                Submit Access Application
                <ArrowRight size={16} strokeWidth={1.75} />
              </button>

              <div className="text-center pt-2">
                <button
                  id="btn-onboarding-back"
                  type="button"
                  onClick={() => onStateChange('needsRole')}
                  className="text-xs text-fg-3 hover:text-fg-1 transition font-medium cursor-pointer"
                >
                  ← Pick another academic role
                </button>
              </div>
            </motion.div>
          )}

          {authState === 'pending' && (
            <motion.div
              key="pending-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full bg-surface border border-subtle rounded-md p-6 shadow-1 space-y-6 text-center"
            >
              <div className="relative inline-flex items-center justify-center p-3 bg-amber-50 text-amber border border-amber-100 rounded-md mb-1">
                <Hourglass size={36} strokeWidth={1.75} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-fg-1 flex items-center justify-center gap-2 font-sans">
                  <span className="w-1 h-5.5 bg-coral rounded-pill"></span>
                  Awaiting Approval
                </h2>
                <p className="text-xs text-fg-3 leading-relaxed max-w-xs mx-auto font-sans">
                  {currentUser?.role === 'Student' ? (
                    <>Your profile request for <span className="font-bold text-fg-1">Student</span> has been broadcast to your Section Class Representative (CR). Once your CR approves your profile, your workspace node will be activated.</>
                  ) : (
                    <>Your profile request for <span className="font-bold text-fg-1">{currentUser?.role}</span> has been broadcast to the Admin office. Once validated, your workspace node will be activated.</>
                  )}
                </p>
              </div>

              {/* Coordinate Card */}
              <div className="bg-sunken border border-subtle rounded-md p-4 text-left divide-y divide-subtle space-y-3 font-sans">
                <h3 className="text-[11px] font-mono tracking-wider uppercase text-fg-3 flex items-center gap-1.5 font-bold mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" /> Profile Information
                </h3>
                <div className="grid grid-cols-2 text-xs pt-2 font-mono gap-y-2 text-fg-2">
                  <span className="text-fg-3">Applicant:</span>
                  <span className="text-fg-1 text-right font-sans font-semibold">{currentUser?.name}</span>
                  <span className="text-fg-3">Selected Role:</span>
                  <span className="text-right text-coral font-bold font-sans">{currentUser?.role}</span>
                  <span className="text-fg-3">Department:</span>
                  <span className="text-fg-1 text-right">{currentUser?.department}</span>
                  <span className="text-fg-3">Campus Code/Sec:</span>
                  <span className="text-fg-1 text-right font-semibold font-mono">{currentUser?.section}</span>
                  {currentUser?.batch !== undefined && currentUser?.batch !== null && (
                    <>
                      <span className="text-fg-3">Academic Batch:</span>
                      <span className="text-fg-1 text-right font-semibold font-mono">Batch {currentUser?.batch}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Simulation Admin Box */}
              <div className="border border-dashed border-coral-100 bg-coral-50 rounded-md p-4 space-y-3 font-sans">
                <div className="flex items-center gap-2 justify-center text-xs text-coral-600 font-bold">
                  <CheckCircle size={14} className="text-coral" strokeWidth={1.75} />
                  <span>Evaluation Simulator Sandbox</span>
                </div>
                <p className="text-[11px] text-fg-3 leading-relaxed">
                  {currentUser?.role === 'Student' ? (
                    "Normally, your section Class Representative (CR) must approve your student profile under the Classroom Roster tab. Tap bypass for instant clearance."
                  ) : (
                    "Normally, an Institutional Coordinator must approve your profile under the Admin dashboard overview. Tap bypass for instant clearance."
                  )}
                </p>
                <button
                  id="btn-simulate-admin-approval"
                  type="button"
                  onClick={() => {
                    onUpdateUser({ isApproved: true });
                    onStateChange('ready');
                  }}
                  className="w-full py-2.5 px-4 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition-all duration-120 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ⚡ Authorize and unlock dashboard
                </button>
              </div>

              <div className="text-center font-sans">
                <button
                  id="btn-pending-abort"
                  type="button"
                  onClick={() => {
                    onUpdateUser({ role: null, department: null, section: null });
                    onStateChange('signedOut');
                  }}
                  className="text-xs text-fg-3 hover:text-fg-1 transition font-medium cursor-pointer"
                >
                  Cancel and sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="text-center py-4 relative z-10 w-full max-w-md mx-auto font-sans">
        <p className="text-[10px] text-fg-3 font-mono tracking-tight leading-loose uppercase">
          SECTION FACTORY &bull; INSTITUTION DEPLOYMENT v1.0.4<br />
          DEVELOPED BY TANVIR MUKTO &bull; A PRODUCT OF LANDING FACTORY<br />
          SECURED ENVELOPE END-TO-END VERIFICATION
        </p>
      </div>

      {/* Route Selector Bottom Sheet */}
      <AnimatePresence>
        {isRoutePickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px]">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsRoutePickerOpen(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-canvas rounded-t-[24px] border-t border-[#ECEAE5] p-5 pb-8 shadow-2xl flex flex-col max-h-[85vh] z-10 font-sans text-fg-1"
            >
              {/* Drag Handle / Accent indicator */}
              <div className="w-12 h-1.5 bg-[#E6E4DF] rounded-full mx-auto mb-5 shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-ink-900">Select Bus Route</span>
                <button
                  type="button"
                  onClick={() => setIsRoutePickerOpen(false)}
                  className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-fg-3 hover:text-fg-1 cursor-pointer transition-all active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search input */}
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-4 pointer-events-none">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  placeholder="Search routes"
                  className="w-full bg-surface border border-[#E0DED8] rounded-[12px] py-3 pl-10 pr-3.5 text-sm font-semibold text-ink-900 placeholder:text-fg-4 outline-none focus:border-[#FF5A36] focus:ring-[4px] focus:ring-[rgba(255,90,54,0.18)] transition-all font-sans"
                />
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 min-h-[220px]">
                {mockRoutes
                  .filter(r => 
                    r.name.toLowerCase().includes(pickerSearchQuery.toLowerCase()) || 
                    r.area.toLowerCase().includes(pickerSearchQuery.toLowerCase())
                  )
                  .map((route) => (
                    <motion.div
                      key={route.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedRouteId(route.id);
                        setIsRoutePickerOpen(false);
                      }}
                      className={`flex justify-between items-center bg-white border rounded-[12px] p-3.5 cursor-pointer select-none transition-all ${
                        selectedRouteId === route.id 
                          ? 'border-[#FF5A36] bg-amber-50/10 shadow-sm' 
                          : 'border-[#ECEAE5] hover:border-ink-300'
                      }`}
                    >
                      <div className="text-left font-sans">
                        <span className="font-mono text-[14px] font-bold text-ink-900 block leading-none">
                          {route.name} &bull; {route.area}
                        </span>
                        <span className="text-[12px] font-medium text-ink-500 mt-1.5 block leading-none">
                          {route.stops}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedRouteId === route.id ? 'border-[#FF5A36] bg-[#FF5A36] text-white' : 'border-[#CCCCCC]'
                      }`}>
                        {selectedRouteId === route.id && <CheckCircle size={12} strokeWidth={2.5} />}
                      </div>
                    </motion.div>
                  ))
                }
              </div>

              {/* Bottom Row */}
              <div className="pt-3 border-t border-subtle flex justify-center shrink-0">
                <button
                  type="button"
                  onClick={() => triggerLocalToast("Tell your admin — we'll add it")}
                  className="py-2.5 px-4 bg-white border border-[#E0DED8] text-ink-900 font-semibold text-xs rounded-full hover:bg-ink-50 active:scale-97 cursor-pointer transition-all"
                >
                  My route isn't listed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Local Toast Banner */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -12, x: '-50%' }}
            transition={{ duration: 0.18 }}
            className="fixed top-6 left-1/2 z-[100] bg-ink-900 text-white py-3 px-5 rounded-[12px] shadow-2xl font-sans text-xs font-semibold select-none flex items-center justify-center text-center whitespace-normal pointer-events-none"
            style={{ maxWidth: '345px', width: '310px' }}
          >
            {localToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
