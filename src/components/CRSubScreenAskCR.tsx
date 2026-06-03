import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Inbox, Send, Check } from 'lucide-react';

export interface ThreadItem {
  id: string;
  asker: string;
  askerInitials: string;
  timeLabel: string;
  tag: 'GENERAL' | 'ROUTINE' | 'URGENT';
  question: string;
  replied: boolean;
  replyText?: string;
  replyTime?: string;
  isCustomStudent?: boolean; // True if posted by currently toggled Student perspective
}

const initialThreads: ThreadItem[] = [
  {
    id: 't1',
    asker: 'Tahmid Rahman',
    askerInitials: 'TR',
    timeLabel: '23 min ago',
    tag: 'GENERAL',
    question: 'Will the SE131 lecture next Tuesday move to Wednesday?',
    replied: true,
    replyText: 'Yes, Dr. NSL will be at a conference. Class shifts to Wed same slot, Room 1504. I\'ll pin a notice tonight.',
    replyTime: '20 min ago'
  },
  {
    id: 't2',
    asker: 'Nila Akter',
    askerInitials: 'NA',
    timeLabel: '1 hr ago',
    tag: 'URGENT',
    question: 'Is Route 7 confirmed delayed today? Should I take an alternate?',
    replied: false
  },
  {
    id: 't3',
    asker: 'Rakib Hasan',
    askerInitials: 'RH',
    timeLabel: '3 hr ago',
    tag: 'ROUTINE',
    question: 'Quiz 2 syllabus — only chapter 3-4 or also chapter 5?',
    replied: true,
    replyText: 'Only 3-4. Dr. NSL confirmed in class today. I\'ll forward you the slide pack.',
    replyTime: '20 min ago'
  },
  {
    id: 't4',
    asker: 'Tasnim Jahan',
    askerInitials: 'TJ',
    timeLabel: 'Yesterday',
    tag: 'GENERAL',
    question: 'Where can I find the final exam window dates?',
    replied: false
  }
];

export default function CRSubScreenAskCR({
  onBack,
  triggerToast,
  threads,
  setThreads
}: {
  onBack: () => void;
  triggerToast: (msg: string) => void;
  threads: ThreadItem[];
  setThreads: React.Dispatch<React.SetStateAction<ThreadItem[]>>;
}) {
  const [subRole, setSubRole] = useState<'Student' | 'CR'>('CR');

  // Student Compose States
  const [askText, setAskText] = useState('');
  const [selectedTag, setSelectedTag] = useState<'GENERAL' | 'ROUTINE' | 'URGENT'>('GENERAL');

  // CR inline replies draft states
  const [replyInputText, setReplyInputText] = useState<Record<string, string>>({});

  const handleSendQuestion = () => {
    if (!askText.trim()) {
      triggerToast('Type a question first');
      return;
    }

    const newQuestion: ThreadItem = {
      id: `t-${Date.now()}`,
      asker: 'Tahmid Rahman', // Mocked currently logged in Student
      askerInitials: 'TR',
      timeLabel: 'Just now',
      tag: selectedTag,
      question: askText.trim(),
      replied: false,
      isCustomStudent: true
    };

    setThreads(prev => [newQuestion, ...prev]);
    triggerToast('Sent to CR Sadia — typically replies within 2h');
    setAskText('');
  };

  const handleSendReply = (threadId: string, askerFirstName: string) => {
    const text = replyInputText[threadId]?.trim();
    if (!text) {
      triggerToast('Type a reply first');
      return;
    }

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replied: true,
          replyText: text,
          replyTime: 'Just now'
        };
      }
      return t;
    }));

    triggerToast(`Reply sent to ${askerFirstName}`);

    // Clear draft text
    setReplyInputText(prev => {
      const next = { ...prev };
      delete next[threadId];
      return next;
    });
  };

  const handleReplyTxtChange = (threadId: string, txt: string) => {
    setReplyInputText(prev => ({
      ...prev,
      [threadId]: txt
    }));
  };

  const getTagPillColor = (tag: 'GENERAL' | 'ROUTINE' | 'URGENT') => {
    if (tag === 'GENERAL') return 'bg-[#F4F4F2] text-ink-700';
    if (tag === 'ROUTINE') return 'bg-[#E5EFFE] text-[#1B4B9E]';
    return 'bg-[#FCE8E9] text-[#E5484D]';
  };

  // Student view shows: only threads posted by current user TR (customStudent or initial ones matching initials TR)
  // Let's filter to both initial Tahmid Rahman ones And any custom Student ones
  const studentThreads = threads.filter(t => t.asker === 'Tahmid Rahman' || t.isCustomStudent);
  const unansweredCount = threads.filter(t => !t.replied).length;

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
            <h1 className="text-base font-bold text-[#0E0D0B] tracking-tight leading-none text-left">Ask CR</h1>
            <p className="text-[10px] font-mono text-ink-500 font-medium leading-none mt-1 text-left">
              {subRole === 'Student' ? 'SWE-M &middot; CR Sadia replies' : `SWE-M &middot; ${unansweredCount} awaiting reply`}
            </p>
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerToast('Inbox')}
          className="w-10 h-10 rounded-full text-ink-900 flex items-center justify-center hover:bg-ink-100 cursor-pointer"
        >
          <Inbox size={20} strokeWidth={1.75} />
        </motion.button>
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
                onClick={() => setSubRole(r.id)}
                className={`flex-1 py-1 px-1 rounded-full text-center flex flex-col items-center justify-center transition-all duration-120 cursor-pointer outline-none relative ${
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

        {/* STUDENT ASK COMPOSER */}
        {subRole === 'Student' && (
          <div className="bg-white border border-[#ECEAE5] shadow-2 rounded-[16px] p-5.5 flex flex-col gap-4 font-sans max-w-full overflow-hidden">
            <span className="text-[10px] font-extrabold text-[#75726A] tracking-[0.04em] uppercase block select-none">
              ASK YOUR CR
            </span>

            <textarea
              placeholder="What do you need? Ask Sadia anything."
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              className="w-full bg-white border border-[#E0DED8] focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[10px] p-3.5 text-sm font-normal text-ink-900 transition-all outline-none min-h-[135px] resize-none placeholder:text-ink-400"
            />

            {/* Tag options select */}
            <div className="flex justify-between items-center w-full select-none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {(['GENERAL', 'ROUTINE', 'URGENT'] as const).map((g) => {
                const isS = selectedTag === g;
                const label = g.charAt(0) + g.slice(1).toLowerCase();
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedTag(g)}
                    style={{ padding: '8px 18px' }}
                    className={`rounded-full text-[13px] font-semibold transition-all duration-[120ms] cursor-pointer border active:scale-[0.97] active:opacity-[0.85] ${
                      isS 
                        ? 'bg-ink-900 border-transparent text-white shadow-sm' 
                        : 'bg-white border-[#E0DED8] text-ink-700 hover:bg-ink-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.97, opacity: 0.85 }}
              onClick={handleSendQuestion}
              style={{ 
                backgroundColor: '#FF5A36', 
                boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' 
              }}
              className="relative w-full h-11 rounded-full flex items-center justify-center cursor-pointer border-none text-white transition-all duration-[120ms] outline-none"
            >
              <span className="text-[14px] font-semibold">Send</span>
              <div className="absolute right-[18px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                <Send size={16} strokeWidth={2.0} className="text-white" />
              </div>
            </motion.button>
          </div>
        )}

        {/* THREAD CONTAINER & OVERLINE LABEL */}
        <div className="space-y-3.5 flex-1 overflow-visible">
          
          <div className="flex items-center justify-between select-none px-0.5">
            <span className="text-[10px] font-extrabold text-[#75726A] tracking-[0.04em] uppercase font-sans">
              {subRole === 'Student' ? 'YOUR CONVERSATIONS' : `INBOX · ${threads.length} THREADS · ${unansweredCount} UNANSWERED`}
            </span>
          </div>

          <div className="space-y-4">
            {(subRole === 'Student' ? studentThreads : threads).map((thr) => {
              const askerFirstName = thr.asker.split(' ')[0] || 'Student';

              return (
                <div
                  key={thr.id}
                  className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3 font-sans relative"
                >
                  {/* Card head row */}
                  <div className="flex items-center gap-3 select-none">
                    {/* CR View has asker identity, Student just has initials block metadata */}
                    <div className="w-8 h-8 rounded-full bg-coral-100 text-[#FF5A36] flex items-center justify-center font-bold font-mono text-[11px]">
                      {thr.askerInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink-900 leading-none">
                        {subRole === 'CR' ? thr.asker : `Question by You`}
                      </h4>
                      <span className="font-mono text-[10px] text-ink-400 mt-1 block leading-none">
                        {thr.timeLabel}
                      </span>
                    </div>

                    <div className="ml-auto">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider leading-none ${getTagPillColor(thr.tag)}`}>
                        {thr.tag}
                      </span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="text-xs font-medium text-ink-900 leading-relaxed font-sans select-text select-all">
                    {thr.question}
                  </div>

                  {/* Reply container */}
                  {thr.replied ? (
                    <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-[10px] p-3 flex flex-col gap-2 relative mt-1.5 font-sans">
                      <div className="flex items-center gap-2 select-none">
                        <div className="w-7 h-7 rounded-full bg-coral-100 text-[#FF5A36] font-bold font-mono text-[10px] flex items-center justify-center">
                          SR
                        </div>
                        <span className="text-[11px] font-bold text-[#FF5A36] leading-none">
                          CR Sadia replied
                        </span>
                        <span className="font-mono text-[9px] text-ink-450 ml-auto font-medium">
                          {thr.replyTime}
                        </span>
                      </div>
                      
                      <p className="text-xs font-medium text-ink-900 leading-relaxed pl-1 select-text">
                        {thr.replyText}
                      </p>
                    </div>
                  ) : (
                    // NOT Replied state
                    subRole === 'Student' ? (
                      <p className="text-[11px] text-ink-400 italic pt-1.5 pl-0.5 select-none font-sans mt-0.5">
                        Waiting for CR Sadia to reply…
                      </p>
                    ) : (
                      // CR View unmatched reply composer
                      <div className="bg-ink-50/50 border border-ink-100 rounded-[10px] p-3 space-y-2.5 mt-2.5 font-sans">
                        <span className="text-[9px] font-extrabold text-ink-400 uppercase tracking-widest leading-none select-none">
                          REPLY TO STUDENT
                        </span>
                        
                        <div className="flex flex-col gap-2 select-none">
                          <input
                            type="text"
                            placeholder="Type reply to student…"
                            value={replyInputText[thr.id] || ''}
                            onChange={(e) => handleReplyTxtChange(thr.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendReply(thr.id, askerFirstName);
                              }
                            }}
                            className="bg-white border border-[#E0DED8] rounded-[10px] py-2.5 px-3.5 text-xs font-normal text-ink-900 transition-all outline-none"
                          />
                          
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSendReply(thr.id, askerFirstName)}
                            style={{ backgroundColor: '#FF5A36' }}
                            className="w-full py-2 bg-[#FF5A36] text-white font-bold text-xs rounded-[10px] text-center cursor-pointer outline-none block border-none"
                          >
                            Send reply
                          </motion.button>
                        </div>
                      </div>
                    )
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
