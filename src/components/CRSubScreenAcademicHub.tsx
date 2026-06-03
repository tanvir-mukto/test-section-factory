import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, CalendarDays, GraduationCap } from 'lucide-react';

interface AcademicItem {
  id: string;
  day: string;
  month: string;
  code: string;
  name: string;
  detail: string;
  pillText: string;
  pillVariant: 'danger' | 'warning' | 'neutral' | 'info' | 'tba';
}

const quizzesMock: AcademicItem[] = [
  { id: 'q1', day: '12', month: 'JUN', code: 'SE131', name: 'Data Structure', detail: 'Quiz 2 · Chapter 3-4', pillText: 'In 2 days', pillVariant: 'warning' },
  { id: 'q2', day: '18', month: 'JUN', code: 'MAT102', name: 'Mathematics II', detail: 'Quiz 1 · Differential Calculus', pillText: '8 days', pillVariant: 'neutral' },
  { id: 'q3', day: '25', month: 'JUN', code: 'SE123', name: 'Discrete Mathematics', detail: 'Quiz 3 · Graph Theory', pillText: '15 days', pillVariant: 'neutral' }
];

const midtermsMock: AcademicItem[] = [
  { id: 'm1', day: '30', month: 'JUN', code: 'MAT102', name: 'Mathematics II', detail: 'Mid-term · 90 min', pillText: 'Room 913', pillVariant: 'info' },
  { id: 'm2', day: '01', month: 'JUL', code: 'SE131', name: 'Data Structure', detail: 'Mid-term · 90 min', pillText: 'Room 1504', pillVariant: 'info' },
  { id: 'm3', day: '02', month: 'JUL', code: 'SE123', name: 'Discrete Mathematics', detail: 'Mid-term · 90 min', pillText: 'TBA', pillVariant: 'tba' },
  { id: 'm4', day: '03', month: 'JUL', code: 'SE213', name: 'Digital Electronics & Logic', detail: 'Mid-term · 90 min', pillText: 'Room 811', pillVariant: 'info' }
];

const finalsMock: AcademicItem[] = [
  { id: 'f1', day: '16', month: 'JUL', code: 'SE131', name: 'Data Structure', detail: 'Final theory exam · 3 hr', pillText: 'Room 1504', pillVariant: 'info' },
  { id: 'f2', day: '18', month: 'JUL', code: 'SE132', name: 'Lab Data Structure', detail: 'Final lab exam · 2 hr', pillText: 'Room 1504', pillVariant: 'info' },
  { id: 'f3', day: '21', month: 'JUL', code: 'SE123', name: 'Discrete Mathematics', detail: 'Final theory exam · 3 hr', pillText: 'Room 913', pillVariant: 'info' },
  { id: 'f4', day: '23', month: 'JUL', code: 'SE213', name: 'Digital Electronics & Logic', detail: 'Final theory exam · 3 hr', pillText: 'Room 811', pillVariant: 'info' },
  { id: 'f5', day: '26', month: 'JUL', code: 'MAT102', name: 'Mathematics II', detail: 'Final theory exam · 3 hr', pillText: 'Room 913', pillVariant: 'info' }
];

export default function CRSubScreenAcademicHub({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'Quizzes' | 'Mid-terms' | 'Finals'>('Quizzes');

  const renderPill = (variant: 'danger' | 'warning' | 'neutral' | 'info' | 'tba', text: string) => {
    let classes = '';
    if (variant === 'danger') classes = 'bg-[#FCE8E9] text-[#E5484D]';
    else if (variant === 'warning') classes = 'bg-[#FFF4DB] text-[#8A5A00]';
    else if (variant === 'neutral') classes = 'bg-[#F4F4F2] text-[#4D4B45]';
    else if (variant === 'info') classes = 'bg-[#E5EFFE] text-[#1B4B9E] font-mono';
    else if (variant === 'tba') classes = 'bg-[#F4F4F2] text-[#A8A59C] font-mono';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold leading-none capitalize ${classes}`}>
        {text}
      </span>
    );
  };

  const getItems = () => {
    if (activeTab === 'Quizzes') return quizzesMock;
    if (activeTab === 'Mid-terms') return midtermsMock;
    return finalsMock;
  };

  return (
    <div className="flex flex-col min-h-screen text-[#0E0D0B] bg-[#FAFAF9]" style={{ width: '100%' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-[#ECEAE5] flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0E0D0B] active:bg-ink-100 cursor-pointer"
          >
            <ArrowLeft size={22} strokeWidth={1.75} />
          </motion.button>
          <div>
            <h1 className="text-base font-bold text-[#0E0D0B] tracking-tight leading-none">Academic Hub</h1>
            <p className="text-[10px] font-mono text-ink-500 font-medium leading-none mt-1">
              SWE-M &middot; Batch 46
            </p>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full text-ink-700 flex items-center justify-center hover:bg-ink-100 cursor-pointer"
        >
          <Bell size={18} strokeWidth={1.75} />
        </motion.button>
      </header>

      {/* Screen Content */}
      <div className="p-4 space-y-4 flex-1 pb-24">
        
        {/* SUMMARY HERO */}
        <div className="bg-coral-50 border border-coral-100 rounded-[14px] p-4 flex items-center justify-between select-none shadow-sm gap-2">
          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-ink-900 tabular-numbers">
              3
            </span>
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#75726A] mt-1.5 text-center leading-none">
              quizzes
            </span>
            <span className="text-[9px] text-[#A8A59C] mt-1">this month</span>
          </div>

          <div className="w-[1px] h-10 bg-coral-100 shrink-0" />

          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-ink-900 tabular-numbers">
              4
            </span>
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#75726A] mt-1.5 text-center leading-none">
              mid-terms
            </span>
            <span className="text-[9px] text-[#A8A59C] mt-1">this semester</span>
          </div>

          <div className="w-[1px] h-10 bg-coral-100 shrink-0" />

          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#FF5A36] tabular-numbers border-b border-coral/25 pb-0.5 px-1 leading-none">
              5
            </span>
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#75726A] mt-1 text-center leading-none">
              finals
            </span>
            <span className="text-[9px] text-[#A8A59C] mt-1.5">upcoming</span>
          </div>
        </div>

        {/* TABS segmented */}
        <div className="grid grid-cols-3 gap-1 bg-ink-100 p-1.5 rounded-full text-center shrink-0">
          {(['Quizzes', 'Mid-terms', 'Finals'] as const).map((tabItem) => {
            const isActive = activeTab === tabItem;
            return (
              <button
                key={tabItem}
                onClick={() => setActiveTab(tabItem)}
                className={`py-2 px-1 rounded-full text-[12px] font-semibold transition-all duration-[120ms] shrink-0 cursor-pointer outline-none ${
                  isActive
                    ? 'bg-white text-ink-900 font-bold shadow-1'
                    : 'bg-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                {tabItem}
              </button>
            );
          })}
        </div>

        {/* FINALS OVERLAY STICKY NOTICE HEADER */}
        {activeTab === 'Finals' && (
          <div className="bg-coral-50 border border-coral-100 rounded-[14px] p-3 flex.col items-start gap-2 shadow-sm selection:bg-transparent">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-[#FF5A36] shrink-0" strokeWidth={1.75} />
              <span className="text-sm font-bold text-ink-900 leading-none">
                Final Exam Window
              </span>
            </div>
            <p className="text-xs text-[#4D4B45] leading-relaxed mt-1 font-mono">
              15 Jul &ndash; 28 Jul 2026
            </p>
          </div>
        )}

        {/* LIST STACK */}
        <div className="space-y-3 flex-1 overflow-visible">
          {getItems().map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex gap-3.5 align-items-start"
            >
              <div className="w-14 h-14 rounded-[10px] p-2 flex flex-col justify-center items-center shrink-0 bg-ink-50 text-ink-800 select-none">
                <span className="font-mono text-lg font-bold leading-none tracking-tight">
                  {item.day}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1 leading-none text-ink-500">
                  {item.month}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-ink-9EC bg-ink-100 px-1.5 py-0.5 rounded border border-[#ECEAE5] leading-none shrink-0 uppercase">
                    {item.code}
                  </span>
                  <span className="text-[12px] text-ink-400 font-light">&middot;</span>
                  <span className="text-xs font-semibold text-ink-900 truncate block">
                    {item.name}
                  </span>
                </div>

                <p className="text-xs font-medium text-ink-500 mt-2.5 leading-snug">
                  {item.detail}
                </p>
              </div>

              <div className="shrink-0 flex items-start">
                {renderPill(item.pillVariant, item.pillText)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
