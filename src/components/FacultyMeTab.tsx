import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Award, MapPin, Clock, Star, Users, Phone, Mail, LogOut, 
  ChevronRight, ArrowRight, ShieldCheck, Settings, BellRing, 
  Presentation, Key, HelpCircle, X, Camera, Trash2, UserRound
} from 'lucide-react';

interface MeTabProps {
  onTriggerToast: (msg: string) => void;
  onNavigateToSubScreen: (subName: 'office' | 'materials' | 'notifications') => void;
  onSignOut: () => void;
}

export default function FacultyMeTab({ onTriggerToast, onNavigateToSubScreen, onSignOut }: MeTabProps) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Profile photo states
  const [photo, setPhoto] = useState<string | null>(() => {
    return localStorage.getItem('vars_faculty_avatar_photo') || null;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdatePhoto = (newPhoto: string | null) => {
    setPhoto(newPhoto);
    if (newPhoto) {
      localStorage.setItem('vars_faculty_avatar_photo', newPhoto);
    } else {
      localStorage.removeItem('vars_faculty_avatar_photo');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleUpdatePhoto(reader.result);
          setMenuOpen(false);
          onTriggerToast('Profile photo updated');
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-[16px] select-none font-sans text-left">
      {/* Header */}
      <div className="pb-2 border-b border-[#ECEAE5]">
        <h1 className="text-[32px] font-extrabold text-ink-900 tracking-tight leading-none">Profile</h1>
        <p className="font-mono text-[11.5px] text-ink-500 font-semibold mt-2">
          Dr. NSL &middot; Faculty ID #F751101
        </p>
      </div>

      {/* PROFILE DETAIL CARD */}
      <div className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-4.5 flex gap-4.5 items-center">
        {/* TAPPABLE PROFILE AVATAR BLOCK */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Change profile photo"
          id="avatar-change-trigger"
          className="w-[60px] h-[60px] cursor-pointer relative shrink-0 transition-transform active:scale-[0.97] active:opacity-[0.85] duration-120 outline-none border-none bg-transparent p-0 flex items-center justify-center select-none"
        >
          {/* Avatar circle */}
          <div 
            className={`w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center transition-all ${
              photo 
                ? 'border border-[#ECEAE5]' 
                : 'bg-[#FFE7DF]'
            }`}
          >
            {photo ? (
              <img 
                src={photo} 
                alt="Profile" 
                className="w-full h-full object-cover animate-fade-in"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[22px] font-bold font-mono text-[#FF5A36] select-none">NL</span>
            )}
          </div>

          {/* CAMERA BADGE */}
          <div 
            className="absolute -bottom-[2px] -right-[2px] w-[24px] h-[24px] bg-[#FF5A36] rounded-full border-[2.5px] border-[#FAFAF9] flex items-center justify-center shadow-1"
          >
            <Camera size={12} strokeWidth={2} className="text-white" />
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <span className="bg-[#FFF4F0] text-[#FF5A36] text-[10px] font-mono font-bold uppercase tracking-wide rounded-[4px] px-1.5 py-[1.5px]">
            Faculty &middot; Senior Grade
          </span>
          <h2 className="text-xl font-extrabold text-ink-900 tracking-tight mt-[6px] leading-tight">
            Dr. Nazmul Sultan Lipu
          </h2>
          <p className="font-sans text-xs text-ink-500 mt-1 leading-none font-medium flex items-center gap-1.5">
            <MapPin size={12} className="text-[#FF5A36] shrink-0" /> Room UB-704 &middot; SWE Dept
          </p>
        </div>
      </div>

      {/* STATS BENTO MATCH 2x2 PANEL */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'courses', val: '2 courses', desc: 'SE131 & SE132', bg: 'bg-[#FFF4F0]/40' },
          { key: 'sections', val: '3 sections', desc: 'SWE-M, N, O', bg: 'bg-[#E5EFFE]/20' },
          { key: 'students', val: '121 students', desc: 'Active semester reach', bg: 'bg-[#FFF9EC]/50' },
          { key: 'hours', val: '10 hrs/wk', desc: 'Theory & Lab slots', bg: 'bg-[#E5F7EE]/30' }
        ].map(item => (
          <div key={item.key} className={`${item.bg} border border-[#ECEAE5] rounded-[11px] p-3.5 flex flex-col justify-between h-[80px]`}>
            <span className="font-mono text-[16px] font-extrabold text-ink-900 tracking-tight mt-0.5">{item.val}</span>
            <span className="text-[10px] text-ink-500 font-bold uppercase leading-none">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* ACTIONS SETTINGS LIST MAPPED ROWS */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11.5px] font-extrabold tracking-wider text-ink-450 uppercase block font-mono">Manage preferences</span>
        
        <div className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 overflow-hidden divide-y divide-[#ECEAE5]">
          {/* Row 1: Office hours */}
          <div 
            onClick={() => {
              onNavigateToSubScreen('office');
              onTriggerToast('Managing weekly Office Slots');
            }}
            className="p-3.5 flex items-center justify-between cursor-pointer active:bg-[#FAFAF9]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[34px] h-[34px] bg-[#FFF4F0] text-[#FF5A36] rounded-lg flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-ink-900 leading-tight">Weekly Office hours</h4>
                <p className="text-[10.5px] text-ink-450 mt-1 leading-none">Sun-Wed &middot; 2:00 pm – 4:00 pm</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-400" />
          </div>

          {/* Row 2: Shared Materials */}
          <div 
            onClick={() => {
              onNavigateToSubScreen('materials');
              onTriggerToast('Managing handouts & resources');
            }}
            className="p-3.5 flex items-center justify-between cursor-pointer active:bg-[#FAFAF9]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[34px] h-[34px] bg-[#E5EFFE] text-[#2E7CF6] rounded-lg flex items-center justify-center shrink-0">
                <Presentation size={15} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-ink-900 leading-tight">Section Materials</h4>
                <p className="text-[10.5px] text-ink-450 mt-1 leading-none">Slides, Notes, References</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-400" />
          </div>

          {/* Row 3: Push Notification configs */}
          <div 
            onClick={() => onTriggerToast('Notification preferences coming soon')}
            className="p-3.5 flex items-center justify-between cursor-pointer active:bg-[#FAFAF9]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[34px] h-[34px] bg-[#FFF9EC] text-[#FFB020] rounded-lg flex items-center justify-center shrink-0">
                <BellRing size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-ink-900 leading-tight">Push Notification system</h4>
                <p className="text-[10.5px] text-ink-450 mt-1 leading-none">Announce templates &amp; triggers</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-400" />
          </div>

          {/* Row 4: App settings */}
          <div 
            onClick={() => onTriggerToast('Core App settings arriving in v1.1')}
            className="p-3.5 flex items-center justify-between cursor-pointer active:bg-[#FAFAF9]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[34px] h-[34px] bg-ink-100 text-ink-700 rounded-lg flex items-center justify-center shrink-0">
                <Settings size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-ink-900 leading-tight">App preferences</h4>
                <p className="text-[10.5px] text-ink-450 mt-1 leading-none">Theme settings, metrics scale</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-400" />
          </div>
        </div>
      </div>

      {/* SIGN OUT ACTION ROW BUTTON */}
      <button
        onClick={() => setShowSignOutConfirm(true)}
        className="w-full bg-[#FFF1F2] border border-[#FCE8E9] text-[#E5484D] text-xs font-bold py-3.5 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shrink-0"
      >
        <LogOut size={14} />
        <span>Sign Out Account</span>
      </button>

      {/* SIGN OUT CONFIRM POPUP MODAL */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
              onClick={() => setShowSignOutConfirm(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xs bg-white rounded-2xl p-5 shadow-3 text-left space-y-4 z-10 select-none"
            >
              <div>
                <h3 className="text-base font-extrabold text-ink-900 leading-none">Leave Session?</h3>
                <p className="text-xs text-ink-600 leading-relaxed mt-2.5">
                  Are you sure you want to sign out from Section Faculty platform? You can log back in anytime.
                </p>
              </div>

              <div className="flex items-center gap-2 justify-end pt-1">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="bg-transparent text-ink-900 text-xs font-bold py-2 px-3 hover:bg-ink-100 rounded-full border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSignOutConfirm(false);
                    onSignOut();
                  }}
                  className="bg-[#E5484D] text-white text-xs font-bold py-2 px-4.5 rounded-full flex items-center gap-1 border-none cursor-pointer shadow-sm"
                >
                  <LogOut size={13} />
                  <span>Leave</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN INPUT FOR FILE PICKING */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        style={{ display: 'none' }}
      />

      {/* PHOTO ACTION SHEET */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-60 flex flex-col justify-end select-none font-sans overflow-hidden">
            {/* Scrim Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />

            {/* RISING PORTAL WINDOW */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, cubicBezier: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-w-lg mx-auto bg-white rounded-t-[28px] shadow-4 flex flex-col z-10 text-left overflow-hidden pb-8 px-5 pt-2"
              style={{ boxShadow: '0 -8px 32px rgba(14,13,11,0.18)' }}
            >
              {/* Drag handle */}
              <div className="w-[38px] h-[4px] bg-[#D4D2CC] rounded-full mx-auto mt-2 shrink-0 pointer-events-none" />

              {/* Eyebrow label */}
              <div className="mt-4 px-1">
                <span className="text-[13px] font-semibold text-[#75726A] font-sans">
                  Profile photo
                </span>
              </div>

              {/* Action Rows */}
              <div className="mt-2 space-y-1">
                {/* Row 1: See profile photo */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => {
                      setViewerOpen(true);
                    }, 50);
                  }}
                  className="w-full flex items-center gap-[14px] p-3 rounded-[12px] hover:bg-[#F4F4F2]/50 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans"
                >
                  <div className="w-[42px] h-[42px] bg-[#F4F4F2] rounded-[12px] flex items-center justify-center text-[#2F2E2A] shrink-0">
                    <UserRound size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-ink-900 leading-tight">See profile photo</h4>
                    <p className="text-[12px] text-[#75726A] mt-0.5 leading-none font-medium">View your current picture</p>
                  </div>
                  <ChevronRight size={18} className="text-[#A8A59C]" />
                </button>

                {/* Row 2: Upload profile photo */}
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-[14px] p-3 rounded-[12px] hover:bg-[#F4F4F2]/50 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans"
                >
                  <div className="w-[42px] h-[42px] bg-[#FFE7DF] rounded-[12px] flex items-center justify-center text-[#FF5A36] shrink-0">
                    <Camera size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-ink-900 leading-tight">Upload profile photo</h4>
                    <p className="text-[12px] text-[#75726A] mt-0.5 leading-none font-medium">Choose a photo from your device</p>
                  </div>
                  <ChevronRight size={18} className="text-[#A8A59C]" />
                </button>

                {/* Row 3: Remove photo (Conditional) */}
                {photo && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdatePhoto(null);
                      setMenuOpen(false);
                      onTriggerToast('Profile photo removed');
                    }}
                    className="w-full flex items-center gap-[14px] p-3 rounded-[12px] hover:bg-[#FCE8E9]/55 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans text-danger-fg"
                  >
                    <div className="w-[42px] h-[42px] bg-[#FCE8E9] rounded-[12px] flex items-center justify-center text-[#E5484D] shrink-0">
                      <Trash2 size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-bold text-[#E5484D] leading-tight">Remove photo</h4>
                      <p className="text-[12px] text-[#75726A] mt-0.5 leading-none font-medium">Switch back to initials</p>
                    </div>
                    <ChevronRight size={18} className="text-[#A8A59C]" />
                  </button>
                )}
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full mt-3 bg-white border border-[#E0DED8] text-[#0E0D0B] text-[14px] font-semibold py-3 px-[18px] rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-[0.97] active:opacity-85 duration-120"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PHOTO VIEWER */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-[#0E0D0B]/92 z-80 flex flex-col items-center justify-center selection:bg-transparent"
            onClick={() => setViewerOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewerOpen(false);
              }}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all active:scale-95 active:opacity-[0.85] z-90"
              style={{ backgroundColor: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(16px)' }}
            >
              <X size={22} strokeWidth={1.75} className="text-white" />
            </button>

            {/* Center Content Area */}
            <div className="flex flex-col items-center justify-center p-6 text-center select-none max-w-sm w-full">
              {photo ? (
                /* Case 1: photo is present */
                <motion.div
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.92 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[280px] h-[280px] rounded-[24px] bg-white bg-cover bg-center shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-white/10 shrink-0"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              ) : (
                /* Case 2: default fallback initials */
                <motion.div
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.92 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[240px] h-[240px] rounded-full bg-[#FF5A36] flex items-center justify-center shrink-0 select-none cursor-default"
                >
                  <span className="text-[88px] font-bold font-mono text-white leading-none tracking-tight">NL</span>
                </motion.div>
              )}

              {/* Caption */}
              <div className="mt-6 text-center select-none font-sans px-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[17px] font-bold text-white tracking-tight leading-none">
                  Dr. Nazmul Sultan Lipu
                </h3>
                <p className="text-[13px] font-medium text-white/72 mt-1.5 leading-snug">
                  {photo ? "Tap anywhere to close" : "No photo yet · upload one to personalize"}
                </p>
              </div>

              {/* Upload Now CTA Button if photo == null */}
              {!photo && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewerOpen(false);
                    setTimeout(() => {
                      setMenuOpen(true);
                    }, 50);
                  }}
                  className="mt-6 border border-white text-white text-[14px] font-semibold py-2.5 px-[18px] rounded-full bg-transparent shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-[0.97] active:opacity-85 duration-120"
                >
                  Upload now
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

