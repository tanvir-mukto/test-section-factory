import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Pin, LogOut, RefreshCw, ChevronRight, UserRound, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface CRMeProps {
  onTriggerToast: (msg: string) => void;
  onChangeContext: () => void;
  onLogout: () => void;
  currentUser?: User;
}

const crCamIcon = ({ size = 12, className = '', strokeWidth = 1.75 }: { size?: number; className?: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export default function CRMe({
  onTriggerToast,
  onChangeContext,
  onLogout,
  currentUser
}: CRMeProps) {
  // Profile photo states
  const [photo, setPhoto] = useState<string | null>(() => {
    return localStorage.getItem('vars_cr_avatar_photo') || null;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showCrToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg(null);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // normalized helper definitions to support checking correct role representation
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
      const p = secStr.split('-');
      return (p[p.length - 1] || '').trim().toUpperCase();
    }
    return secStr;
  };

  const getBatchVal = (u: any): number => {
    if (!u || u.batch === undefined || u.batch === null) return NaN;
    const b = parseInt(u.batch, 10);
    return b;
  };

  const deptCode = getDeptCode(currentUser);
  const sectionCode = getSectionCode(currentUser);
  const batchVal = getBatchVal(currentUser);
  const isCR = currentUser?.role?.toUpperCase() === 'CR';
  const isFeatureVisible = !currentUser || (isCR && deptCode === 'SWE' && sectionCode === 'M' && batchVal === 46);

  const handleUpdatePhoto = (newPhoto: string | null) => {
    setPhoto(newPhoto);
    if (newPhoto) {
      localStorage.setItem('vars_cr_avatar_photo', newPhoto);
    } else {
      localStorage.removeItem('vars_cr_avatar_photo');
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
          showCrToast('Profile photo updated');
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBackupChoose = () => {
    onTriggerToast("Appointed Nila Akter as secondary backup co-CR successfully!");
  };

  return (
    <div className="space-y-6">
      {/* (A) TITLE */}
      <div>
        <h1 className="text-[32px] font-bold text-[#0E0D0B] tracking-tight leading-none">
          Me
        </h1>
      </div>

      {/* (B) PROFILE CARD */}
      <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center gap-4">
        {/* Avatar */}
        {isFeatureVisible ? (
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Change profile photo"
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
                <span className="text-[22px] font-extrabold font-mono text-[#FF5A36] select-none leading-none">TR</span>
              )}
            </div>

            {/* CAMERA BADGE */}
            <div 
              className="absolute -bottom-[2px] -right-[2px] w-[24px] h-[24px] bg-[#FF5A36] rounded-full border-[2.5px] border-[#FFFFFF] flex items-center justify-center shadow-1"
            >
              {crCamIcon({ size: 12, className: 'text-white', strokeWidth: 2 })}
            </div>
          </button>
        ) : (
          <div className="w-[60px] h-[60px] rounded-full bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center font-extrabold text-[22px] font-mono shadow-sm shrink-0">
            TR
          </div>
        )}

        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-bold text-[#0E0D0B] leading-none">
              Tahmid Rahman
            </span>
            <span className="bg-[#0E0D0B] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none">
              CR
            </span>
          </div>
          
          <p className="text-[12px] font-medium text-[#75726A] font-sans">
            <span className="font-mono font-bold">2021-1-60-022</span> &middot; SWE-M
          </p>

          <p className="text-[12px] font-medium text-[#75726A]">
            CR term ends Aug 26 &middot; <span className="text-[#FF5A36] font-bold">5 months left</span>
          </p>
        </div>
      </div>

      {/* (C) ACHIEVEMENTS CARD */}
      <div className="bg-[#0E0D0B] rounded-[14px] p-5 space-y-4 shadow-2">
        <div className="flex items-center gap-4 text-left">
          {/* Streak indicator */}
          <div className="w-[44px] h-[44px] rounded-[10px] bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center font-extrabold text-[22px] font-mono shrink-0">
            12
          </div>
          <div>
            <h4 className="font-bold text-white text-[15px] leading-snug">
              12-day on-time streak
            </h4>
            <p className="text-[12px] text-[#A8A59C] font-medium block mt-0.5">
              Every post within 5 min of class change
            </p>
          </div>
        </div>

        {/* Action badges under wrap row */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#ECEAE5]/10">
          <div className="bg-[#1B1A18] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-white/5">
            <Target size={13} className="text-[#FF5A36]" />
            <span>100% reach &times; 5</span>
          </div>

          <div className="bg-[#1B1A18] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-white/5">
            <Zap size={13} className="text-amber-400" />
            <span>First responder</span>
          </div>

          <div className="bg-[#1B1A18] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-white/5">
            <Pin size={13} className="text-[#FF5A36]" />
            <span>Pinning pro</span>
          </div>
        </div>
      </div>

      {/* (D) CR ACTIVITY */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          CR ACTIVITY
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Stat 1 */}
          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight block">
                38
              </span>
              <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
                POSTS THIS MONTH
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-bold text-[#0F6B43] font-mono tracking-tight block">
                96%
              </span>
              <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
                AVG SEEN RATE
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight block">
                2.1m
              </span>
              <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
                AVG POST TIME
              </span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight block">
                42/42
              </span>
              <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
                SECTION REACH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* (E) HANDOFF & BACKUP */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          HANDOFF &amp; BACKUP
        </span>

        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center font-extrabold text-[13px] font-mono shadow-sm shrink-0">
              NA
            </div>
            <div className="text-left">
              <span className="text-[14px] font-bold text-[#0E0D0B] block leading-snug">
                Set a co-CR
              </span>
              <span className="text-[11.5px] text-[#75726A] font-medium font-sans block mt-0.5">
                Backup poster when you're unavailable.
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleBackupChoose}
            className="bg-white border border-[#E0DED8] text-[#0E0D0B] text-[12px] font-bold px-3.5 py-1.5 rounded-full active:scale-95 duration-120 hover:bg-[#F4F4F2] transition-colors cursor-pointer shadow-sm"
          >
            Choose
          </button>
        </div>
      </div>

      {/* ROLE MANAGEMENT CORE ACTIONS */}
      <div className="pt-2 border-t border-[#ECEAE5] space-y-2.5">
        <button 
          onClick={onChangeContext}
          className="w-full py-3.5 bg-white border border-[#E0DED8] hover:border-[#0E0D0B] text-[#0E0D0B] font-bold text-xs rounded-full active:scale-[0.97] transition-all duration-[120ms] cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className="text-[#FF5A36]" />
          <span>Change Academic Role (Onboarding Loop)</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full py-3.5 bg-[#FCE8E9] border border-[#FCE8E9] hover:bg-red-100 text-[#E5484D] font-bold text-xs rounded-full active:scale-[0.97] transition-all duration-[120ms] cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          <span>Terminate Connection</span>
        </button>
      </div>

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
          <div className="fixed inset-0 z-[70] flex flex-col justify-end select-none font-sans overflow-hidden">
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
              transition={{ duration: 0.3, cubicBezier: [0.34, 1.3, 0.64, 1] }}
              className="relative w-full max-w-lg mx-auto bg-white rounded-t-[28px] shadow-4 flex flex-col z-10 text-left overflow-hidden pb-6 px-5 pt-2"
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
                  className="w-full flex items-center gap-[14px] p-3.5 rounded-[12px] hover:bg-[#F4F4F2]/50 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans"
                >
                  <div className="w-[42px] h-[42px] bg-[#F4F4F2] rounded-[12px] flex items-center justify-center text-[#2F2E2A] shrink-0">
                    <UserRound size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-[#0E0D0B] leading-tight">See profile photo</h4>
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
                  className="w-full flex items-center gap-[14px] p-3.5 rounded-[12px] hover:bg-[#F4F4F2]/50 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans"
                >
                  <div className="w-[42px] h-[42px] bg-[#FFE7DF] rounded-[12px] flex items-center justify-center text-[#FF5A36] shrink-0">
                    {crCamIcon({ size: 20, strokeWidth: 1.75, className: 'text-[#FF5A36]' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-[#0E0D0B] leading-tight">Upload profile photo</h4>
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
                      showCrToast('Profile photo removed');
                    }}
                    className="w-full flex items-center gap-[14px] p-3.5 rounded-[12px] hover:bg-[#FCE8E9]/55 active:scale-[0.97] active:opacity-85 duration-120 outline-none border-none bg-transparent cursor-pointer text-left font-sans text-[#E5484D]"
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
            className="fixed inset-0 bg-[#0E0D0B]/92 z-[80] flex flex-col items-center justify-center selection:bg-transparent"
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
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(16px)' }}
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
                  transition={{ duration: 0.26, ease: "easeOut" }}
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
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-[240px] h-[240px] rounded-full bg-[#FFE7DF] flex items-center justify-center shrink-0 select-none cursor-default"
                >
                  <span className="text-[88px] font-extrabold font-mono text-[#FF5A36] leading-none tracking-tight">TR</span>
                </motion.div>
              )}

              {/* Caption */}
              <div className="mt-6 text-center select-none font-sans px-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-[17px] font-bold text-white tracking-tight leading-none">
                  Tahmid Rahman
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

      {/* LOCAL TOAST SYSTEM */}
      <AnimatePresence>
        {toastMsg && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] pointer-events-none w-full max-w-[358px] px-4">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-[#0E0D0B] text-white text-[13px] font-bold px-[18px] py-3 rounded-[12px] shadow-[0_12px_32px_rgba(14,13,11,0.28)] font-sans flex items-center justify-center text-center leading-none"
            >
              {toastMsg}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
