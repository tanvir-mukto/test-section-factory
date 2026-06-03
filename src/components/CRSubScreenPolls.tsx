import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, X, Check, Edit2, Calendar, ClipboardList } from 'lucide-react';

interface PollOption {
  id: string;
  label: string;
  baseVotes: number;
  addedStudentVote: boolean;
  addedCRVote: boolean;
}

interface PollItem {
  id: string;
  status: 'Closing today' | 'Active' | 'Closed';
  closeMeta: string;
  question: string;
  author: string;
  options: PollOption[];
}

const initialPolls: PollItem[] = [
  {
    id: 'poll-1',
    status: 'Closing today',
    closeMeta: 'Closes 6 pm today',
    question: 'Makeup class — Saturday or Sunday?',
    author: 'CR Sadia',
    options: [
      { id: 'p1-opt1', label: 'Saturday 13 Jun', baseVotes: 27, addedStudentVote: true, addedCRVote: false },
      { id: 'p1-opt2', label: 'Sunday 14 Jun', baseVotes: 13, addedStudentVote: false, addedCRVote: false }
    ]
  },
  {
    id: 'poll-2',
    status: 'Active',
    closeMeta: 'Closes 13 Jun 6 pm',
    question: 'Semester study tour destination?',
    author: 'CR Sadia',
    options: [
      { id: 'p2-opt1', label: 'Sajek', baseVotes: 12, addedStudentVote: false, addedCRVote: false },
      { id: 'p2-opt2', label: 'Cox\'s Bazar', baseVotes: 18, addedStudentVote: false, addedCRVote: false },
      { id: 'p2-opt3', label: 'Sundarbans', baseVotes: 7, addedStudentVote: false, addedCRVote: false },
      { id: 'p2-opt4', label: 'Sylhet', baseVotes: 3, addedStudentVote: false, addedCRVote: false }
    ]
  },
  {
    id: 'poll-3',
    status: 'Closed',
    closeMeta: 'Closed 9 Jun',
    question: 'Study circle weekly slot?',
    author: 'CR Sadia',
    options: [
      { id: 'p3-opt1', label: 'Friday 8 pm', baseVotes: 22, addedStudentVote: false, addedCRVote: false },
      { id: 'p3-opt2', label: 'Saturday 6 pm', baseVotes: 12, addedStudentVote: false, addedCRVote: false },
      { id: 'p3-opt3', label: 'Sunday 5 pm', baseVotes: 6, addedStudentVote: false, addedCRVote: false }
    ]
  }
];

export default function CRSubScreenPolls({
  onBack,
  triggerToast,
  polls,
  setPolls
}: {
  onBack: () => void;
  triggerToast: (msg: string) => void;
  polls: PollItem[];
  setPolls: React.Dispatch<React.SetStateAction<PollItem[]>>;
}) {
  const [subRole, setSubRole] = useState<'Student' | 'CR'>('CR');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<PollItem | null>(null);

  // Composer Form States
  const [compQuestion, setCompQuestion] = useState('');
  const [compOptions, setCompOptions] = useState<string[]>(['', '']);
  const [compCloseMeta, setCompCloseMeta] = useState<'1 hour' | 'Today 6 pm' | 'Tomorrow 6 pm' | 'Custom'>('Today 6 pm');
  const [customDateTime, setCustomDateTime] = useState('');

  const handleOpenCreateInput = () => {
    setEditingPoll(null);
    setCompQuestion('');
    setCompOptions(['', '']);
    setCompCloseMeta('Today 6 pm');
    setCustomDateTime('');
    setIsComposerOpen(true);
  };

  const handleOpenEdit = (poll: PollItem) => {
    setEditingPoll(poll);
    setCompQuestion(poll.question);
    setCompOptions(poll.options.map(o => o.label));
    
    if (poll.closeMeta.includes('1 hour')) setCompCloseMeta('1 hour');
    else if (poll.closeMeta.includes('Tomorrow')) setCompCloseMeta('Tomorrow 6 pm');
    else if (poll.closeMeta.includes('Closed')) setCompCloseMeta('Today 6 pm'); 
    else setCompCloseMeta('Today 6 pm');

    setCustomDateTime('');
    setIsComposerOpen(true);
  };

  const handleAddOptionField = () => {
    if (compOptions.length < 6) {
      setCompOptions([...compOptions, '']);
    }
  };

  const handleRemoveOptionField = (idx: number) => {
    if (compOptions.length > 2) {
      setCompOptions(compOptions.filter((_, i) => i !== idx));
    }
  };

  const handleOptionTextChange = (idx: number, text: string) => {
    const nextOpts = [...compOptions];
    nextOpts[idx] = text;
    setCompOptions(nextOpts);
  };

  const handleSavePoll = () => {
    if (!compQuestion.trim()) {
      triggerToast('Enter a poll question');
      return;
    }
    const cleanOpts = compOptions.map(o => o.trim()).filter(Boolean);
    if (cleanOpts.length < 2) {
      triggerToast('Provide at least 2 options');
      return;
    }

    let deadlineString = '';
    if (compCloseMeta === '1 hour') deadlineString = 'Closes in 1 hour';
    else if (compCloseMeta === 'Today 6 pm') deadlineString = 'Closes 6 pm today';
    else if (compCloseMeta === 'Tomorrow 6 pm') deadlineString = 'Closes tomorrow 6 pm';
    else {
      // Custom format parse
      if (customDateTime) {
        const [date, time] = customDateTime.split('T');
        deadlineString = `Closes ${time || '6 pm'} on ${date || 'custom'}`;
      } else {
        deadlineString = 'Closes tomorrow 6 pm';
      }
    }

    if (editingPoll) {
      // Edit own active poll
      setPolls(prev => prev.map(p => {
        if (p.id === editingPoll.id) {
          // Re-map options while preserving base votes
          const nextOptions = cleanOpts.map((label, index) => {
            const existingOpt = p.options.find(o => o.label === label);
            return {
              id: existingOpt ? existingOpt.id : `opt-${Date.now()}-${index}`,
              label,
              baseVotes: existingOpt ? existingOpt.baseVotes : 0,
              addedStudentVote: existingOpt ? existingOpt.addedStudentVote : false,
              addedCRVote: existingOpt ? existingOpt.addedCRVote : false
            };
          });
          return {
            ...p,
            question: compQuestion.trim(),
            closeMeta: deadlineString,
            options: nextOptions
          };
        }
        return p;
      }));
      triggerToast(`Poll updated successfully`);
    } else {
      // Create new poll
      const newPoll: PollItem = {
        id: `poll-${Date.now()}`,
        status: 'Active',
        closeMeta: deadlineString,
        question: compQuestion.trim(),
        author: 'CR Sadia',
        options: cleanOpts.map((label, index) => ({
          id: `opt-${Date.now()}-${index}`,
          label,
          baseVotes: 0,
          addedStudentVote: false,
          addedCRVote: false
        }))
      };
      setPolls(prev => [newPoll, ...prev]);
      triggerToast(`Poll published — 42 students notified`);
    }

    setIsComposerOpen(false);
  };

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        // Find if they already voted in this poll
        const alreadyVoted = subRole === 'Student' 
          ? poll.options.some(o => o.addedStudentVote)
          : poll.options.some(o => o.addedCRVote);

        if (alreadyVoted) {
          triggerToast('You have already voted on this poll');
          return poll;
        }

        const selectedOption = poll.options.find(o => o.id === optionId);
        if (selectedOption) {
          triggerToast(`Vote recorded — ${selectedOption.label}`);
        }

        return {
          ...poll,
          options: poll.options.map(opt => {
            if (opt.id === optionId) {
              return {
                ...opt,
                addedStudentVote: subRole === 'Student' ? true : opt.addedStudentVote,
                addedCRVote: subRole === 'CR' ? true : opt.addedCRVote
              };
            }
            return opt;
          })
        };
      }
      return poll;
    }));
  };

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
            <h1 className="text-base font-bold text-[#0E0D0B] tracking-tight leading-none">Active polls</h1>
            <p className="text-[10px] font-mono text-ink-500 font-medium leading-none mt-1">
              SWE-M &middot; 42 voters
            </p>
          </div>
        </div>
        
        {subRole === 'CR' && (
          <motion.button
            whileTap={{ scale: 0.96, opacity: 0.85 }}
            onClick={handleOpenCreateInput}
            style={{ backgroundColor: '#FF5A36', boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }}
            className="h-9 px-3 text-white font-semibold text-[12px] rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#E84A28]"
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
                onClick={() => setSubRole(r.id)}
                className={`flex-1 py-1 px-1 rounded-full text-center flex flex-col items-center justify-center transition-all duration-120 cursor-pointer outline-none ${
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

        {/* POLL LIST */}
        <div className="space-y-4 flex-1 overflow-visible">
          {polls.map((poll) => {
            // Count current vote state based on active perspective
            const userVotedInOption = subRole === 'Student' 
              ? poll.options.find(o => o.addedStudentVote)
              : poll.options.find(o => o.addedCRVote);
            
            const showResultsResult = !!userVotedInOption || poll.status === 'Closed' || subRole === 'CR';

            // Calculations
            const getOptionVotesCount = (opt: PollOption) => {
              return opt.baseVotes + (opt.addedStudentVote ? 1 : 0) + (opt.addedCRVote ? 1 : 0);
            };

            const totalVotes = poll.options.reduce((sum, o) => sum + getOptionVotesCount(o), 0);
            const turnoutPercent = Math.min(100, Math.round((totalVotes / 42) * 100));

            return (
              <div
                key={poll.id}
                className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3 font-sans"
              >
                {/* Top Row: Pill left & Close Meta right */}
                <div className="flex items-center justify-between select-none">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide leading-none ${
                    poll.status === 'Closing today'
                      ? 'bg-coral-50 text-[#FF5A36]'
                      : poll.status === 'Active'
                      ? 'bg-[#E5EFFE] text-[#1B4B9E]'
                      : 'bg-[#F4F4F2] text-[#4D4B45]'
                  }`}>
                    {poll.status}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-ink-500">
                    {poll.closeMeta}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-15 font-bold text-ink-900 leading-snug">
                  {poll.question}
                </h3>

                {/* Author caption */}
                <p className="text-[11px] text-[#75726A] font-medium leading-none select-none">
                  Posted by <span className="font-bold text-[#E84A28]">{poll.author}</span>
                </p>

                {/* OPTIONS LIST */}
                <div className="space-y-2.5 pt-1">
                  {poll.options.map((opt) => {
                    const optVotes = getOptionVotesCount(opt);
                    const pctShare = totalVotes === 0 ? 0 : Math.round((optVotes / totalVotes) * 100);
                    const isVotedChoice = userVotedInOption?.id === opt.id;

                    if (!showResultsResult) {
                      // NOT VOTED YET VIEW - Action Button
                      return (
                        <motion.button
                          key={opt.id}
                          whileTap={{ scale: 0.99, opacity: 0.92 }}
                          onClick={() => handleVote(poll.id, opt.id)}
                          className="w-full text-left bg-white border border-[#ECEAE5] hover:border-ink-400 rounded-[10px] py-3.5 px-4 text-xs font-semibold text-ink-900 shadow-sm transition-colors cursor-pointer outline-none block"
                        >
                          {opt.label}
                        </motion.button>
                      );
                    } else {
                      // RESULTS VIEW WITH FILL BARS
                      return (
                        <div
                          key={opt.id}
                          className="relative w-full rounded-[10px] border border-[#ECEAE5] overflow-hidden flex items-center justify-between py-3 px-4 min-h-[44px]"
                        >
                          {/* Fill bar overlay background */}
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-[#FFF4F0] z-0 transition-all duration-300"
                            style={{ width: `${pctShare}%` }}
                          />
                          {/* Remainder background */}
                          <div className="absolute inset-0 bg-[#F4F4F2]/20 -z-10" />

                          {/* LEFT: Check circle or spacing */}
                          <div className="relative z-10 flex items-center gap-3 pr-2 flex-1 truncate">
                            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border ${
                              isVotedChoice
                                ? 'bg-[#FF5A36] border-[#FF5A36] text-white'
                                : 'bg-transparent border-ink-300'
                            }`}>
                              {isVotedChoice && <Check size={10} className="text-white" strokeWidth={3.0} />}
                            </div>
                            <span className="text-xs font-semibold text-ink-900 truncate">
                              {opt.label}
                            </span>
                          </div>

                          {/* RIGHT: Percentage share stats */}
                          <span className="relative z-10 font-mono text-[11px] font-bold text-ink-700 shrink-0 pl-1">
                            {pctShare}% &middot; {optVotes}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* FOOTER METRICS AND HINTS ROW */}
                <div className="flex items-center justify-between border-t border-[#ECEAE5] pt-3 select-none">
                  <div className="font-mono text-[11px] font-medium text-ink-500">
                    {totalVotes} votes &middot; {turnoutPercent}% turnout
                  </div>

                  {/* Right side State hints */}
                  {(() => {
                    if (poll.status === 'Closed') {
                      return (
                        <span className="text-[11px] font-medium text-ink-400">
                          Voting closed
                        </span>
                      );
                    }

                    if (userVotedInOption) {
                      return (
                        <span className="text-[11px] font-extrabold text-[#19A974] flex items-center gap-1">
                          <Check size={12} strokeWidth={2.5} />
                          <span>Voted</span>
                        </span>
                      );
                    }

                    if (subRole === 'CR') {
                      return (
                        <button
                          onClick={() => handleOpenEdit(poll)}
                          className="text-[11px] font-extrabold text-[#FF5A36] hover:underline"
                        >
                          You posted this &middot; Edit
                        </button>
                      );
                    }

                    return (
                      <span className="text-[11px] font-medium text-ink-400">
                        Tap to vote
                      </span>
                    );
                  })()}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* CREATE / EDIT POLL SHEET COMPOSER */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-55 flex flex-col justify-end overflow-hidden font-sans">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setIsComposerOpen(false)}
              className="absolute inset-0 bg-[#0E0D0B]/55"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-h-[92%] bg-white rounded-t-[28px] shadow-4 flex flex-col z-10 overflow-hidden text-left pb-safe"
            >
              <div className="w-10 h-1 bg-ink-300 rounded-full mx-auto mt-2 shrink-0 pointer-events-none" />

              <div className="flex items-start justify-between px-5 pt-4 pb-2 shrink-0 select-none">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-ink-900 tracking-tight leading-none">
                    {editingPoll ? 'Edit own poll' : 'Create a poll'}
                  </h2>
                  <p className="font-mono text-[11px] font-medium text-ink-500 uppercase tracking-wide leading-none pt-0.5 mt-1">
                    SWE-M &middot; 42 students notified
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="w-9 h-9 rounded-full bg-ink-100/50 flex items-center justify-center text-[#0E0D0B] cursor-pointer"
                >
                  <X size={18} strokeWidth={2.0} />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 font-sans select-none">
                
                {/* 1. KEY QUESTION */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    QUESTION
                  </label>
                  <textarea
                    placeholder="e.g. Next Saturday makeup class slot study preferences..."
                    value={compQuestion}
                    onChange={(e) => setCompQuestion(e.target.value)}
                    className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[12px] p-3 text-sm font-semibold text-ink-900 transition-all outline-none min-h-[64px]"
                  />
                </div>

                {/* 2. NUMBERED MULTIPLE CHOICE OPTIONS */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase mb-1">
                    OPTIONS (2 - 6 MAXIMUM)
                  </label>
                  
                  <div className="space-y-2">
                    {compOptions.map((optText, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="font-mono text-xs font-bold text-ink-400 select-none w-4">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          maxLength={64}
                          placeholder={`Option ${index + 1}`}
                          value={optText}
                          onChange={(e) => handleOptionTextChange(index, e.target.value)}
                          className="flex-1 bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[10px] py-2 px-3 text-xs font-medium text-ink-900 transition-all outline-none placeholder:text-ink-300"
                        />
                        {compOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionField(index)}
                            className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center text-ink-500 hover:text-danger-fg active:bg-ink-100 cursor-pointer"
                          >
                            <X size={15} strokeWidth={2.0} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {compOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="w-full mt-1 bg-transparent hover:bg-ink-100/30 border border-dashed border-ink-300 rounded-[10px] py-2.5 px-4 text-center text-xs font-bold text-ink-600 transition-colors cursor-pointer outline-none"
                    >
                      + Add option
                    </button>
                  )}
                </div>

                {/* 3. CLOSING / DEADLINE CONFIG */}
                <div className="space-y-2 select-none">
                  <label className="block text-[11px] font-extrabold text-ink-500 tracking-[0.04em] uppercase">
                    CLOSING DEADLINE
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {(['1 hour', 'Today 6 pm', 'Tomorrow 6 pm', 'Custom'] as const).map((opt) => {
                      const isActive = compCloseMeta === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCompCloseMeta(opt)}
                          className={`py-3 px-3 rounded-[10px] text-xs font-bold transition-all duration-120 cursor-pointer text-center outline-none ${
                            isActive
                              ? 'bg-ink-900 text-white font-semibold'
                              : 'bg-white border border-[#E0DED8] text-ink-900 font-medium'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {compCloseMeta === 'Custom' && (
                    <div className="pt-1">
                      <input
                        type="datetime-local"
                        value={customDateTime}
                        onChange={(e) => setCustomDateTime(e.target.value)}
                        className="w-full bg-white border border-[#E0DED8] hover:border-ink-400 focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/18 rounded-[10px] py-2.5 px-3.5 text-xs font-medium font-mono text-ink-900 transition-all outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 4. REAL-TIME LIVE RENDER PREVIEW CARD */}
                <div className="border border-dashed border-[#ECEAE5] rounded-[14px] p-4 bg-ink-50/50 space-y-2.5">
                  <span className="text-[9px] font-extrabold text-ink-400 uppercase tracking-widest leading-none select-none">
                    Live Composer Preview
                  </span>

                  <div className="bg-white border border-[#ECEAE5] rounded-[10px] p-3 space-y-2 opacity-80 pointer-events-none">
                    <span className="bg-coral-50 text-[#FF5A36] px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
                      Preview Active
                    </span>
                    <h4 className="text-xs font-bold text-ink-900 pt-0.5">
                      {compQuestion.trim() || 'Type your question...'}
                    </h4>
                    <div className="space-y-1.5 pt-1">
                      {compOptions.filter(o => o.trim()).map((oTxt, i) => (
                        <div key={i} className="bg-ink-100/40 p-2 text-[11px] font-semibold text-ink-800 rounded border border-[#ECEAE5]">
                          {oTxt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* sticky footer */}
              <div className="bg-white border-t border-[#ECEAE5] py-3 px-5 flex items-center justify-between shrink-0 font-sans">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="border border-[#E0DED8] rounded-full py-2 px-4 bg-transparent text-ink-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={{ scale: 0.97, opacity: 0.85 }}
                  type="button"
                  onClick={handleSavePoll}
                  style={{ backgroundColor: '#FF5A36', boxShadow: '0 8px 20px rgba(255, 90, 54, 0.28)' }}
                  className="rounded-full py-2.5 px-4 bg-[#FF5A36] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border-none"
                >
                  <Check size={14} strokeWidth={2.0} />
                  <span>Publish &middot; 42 students notified</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
