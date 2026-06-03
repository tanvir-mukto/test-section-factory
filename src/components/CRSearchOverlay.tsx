import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, X, SearchX } from 'lucide-react';
import AppOverlay from './AppOverlay';
import { PostItem } from './CRShell';

interface CRSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activePosts: PostItem[];
}

export default function CRSearchOverlay({
  isOpen,
  onClose,
  activePosts
}: CRSearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  const triggerOverlayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const clearQuery = () => {
    setQuery('');
    setDebouncedQuery('');
    inputRef.current?.focus();
  };

  const handleChipClick = (label: string) => {
    setQuery(label);
    setDebouncedQuery(label);
  };

  // 5 Locked catalog posts
  const baseCorpus: PostItem[] = [
    {
      id: 'base-post-1',
      title: 'MAT102 cancelled today — Slot 3',
      body: 'Dr. DK is unwell. Class rescheduled to Wed same slot, Room 913.',
      tag: 'routine',
      timestamp: '2026-06-10T08:45:00Z',
      timeLabel: '2 hr ago',
      seenCount: 41,
      totalCount: 42,
      likes: 24
    },
    {
      id: 'base-post-2',
      title: 'Bus pickup moved to Gate 2',
      body: 'From tomorrow morning, route 7 picks up from Gate 2 instead of the main entrance.',
      tag: 'transport',
      timestamp: '2026-06-10T06:45:00Z',
      timeLabel: '4 hr ago',
      seenCount: 38,
      totalCount: 42,
      likes: 12
    },
    {
      id: 'base-post-3',
      title: 'Makeup class poll closes 6 pm',
      body: 'Saturday or Sunday for the makeup. Vote now.',
      tag: 'routine',
      timestamp: '2026-06-10T04:45:00Z',
      timeLabel: '6 hr ago',
      seenCount: 37,
      totalCount: 42,
      likes: 15
    },
    {
      id: 'base-post-4',
      title: 'Dr. NSL posted SE131 quiz scope',
      body: 'Chapter 3 + 4. Open book. 30 minutes. Bring your own paper.',
      tag: 'quiz',
      timestamp: '2026-06-09T10:45:00Z',
      timeLabel: 'yesterday',
      seenCount: 40,
      totalCount: 42,
      likes: 19
    },
    {
      id: 'base-post-5',
      title: 'Mid-term schedule released',
      body: 'Mid-terms run 30 Jun – 3 Jul. Check Academic Hub for slot times.',
      tag: 'exams',
      timestamp: '2026-06-09T15:30:00Z',
      timeLabel: 'yesterday',
      seenCount: 42,
      totalCount: 42,
      likes: 21
    }
  ];

  // Map author info for known base posts
  const getAuthorInfo = (post: PostItem) => {
    if (post.id === 'base-post-1' || post.id === 'base-post-2' || post.id === 'base-post-3') {
      return { name: 'Sadia Rahman', role: 'CR', initials: 'SR' };
    }
    if (post.id === 'base-post-4') {
      return { name: 'Dr. NSL', role: 'FACULTY', initials: 'NL' };
    }
    if (post.id === 'base-post-5') {
      return { name: 'Admin Office', role: 'ADMIN', initials: 'AO' };
    }
    return { name: 'Sadia Rahman', role: 'CR', initials: 'SR' };
  };

  // Combine baseline posts with any dynamic state-driven activePosts safely (deduplicate)
  const allCorpus = [...baseCorpus];
  activePosts.forEach(ap => {
    // If and only if it's not already modeled by id or title in baseCorpus, append it
    const isDup = allCorpus.some(bc => bc.title.toLowerCase() === ap.title.toLowerCase());
    if (!isDup) {
      allCorpus.push({
        ...ap,
        id: ap.id || 'dynamic-post-' + Math.random().toString(36).substr(2, 9)
      });
    }
  });

  // Sort results by recency
  const sortedCorpus = [...allCorpus].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Dynamic search matching
  const searchFilter = (p: PostItem) => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return false;
    
    const titleMatch = p.title.toLowerCase().includes(q);
    const bodyMatch = p.body.toLowerCase().includes(q);
    const tagMatch = p.tag.toLowerCase().includes(q);
    const authorMatch = getAuthorInfo(p).name.toLowerCase().includes(q);

    return titleMatch || bodyMatch || tagMatch || authorMatch;
  };

  const results = sortedCorpus.filter(searchFilter);

  // Helper to do case-insensitive word highlight wrapping inside <mark>
  const highlightText = (text: string, searchQ: string) => {
    if (!searchQ.trim()) return text;
    const escapedQ = searchQ.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQ})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((p, index) => 
          p.toLowerCase() === searchQ.trim().toLowerCase() ? (
            <mark key={index} className="bg-[#FFF1D6] px-0.5 rounded-[3px] text-[#0E0D0B] font-medium font-sans">
              {p}
            </mark>
          ) : (
            p
          )
        )}
      </>
    );
  };

  // Inline Search Input ( MIDDLE replacing title text )
  const inlineSearchInput = (
    <div className="w-full relative flex items-center">
      <div className="absolute left-4 flex items-center justify-center text-[#75726A] pointer-events-none">
        <Search size={18} strokeWidth={1.75} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search posts, tags, people…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-11 bg-[#FAFAF9] border border-[#E0DED8] rounded-full pl-11 pr-10 text-[14px] font-medium text-[#0E0D0B] placeholder-[#A8A59C] outline-none focus:border-[#FF5A36] transition-all"
      />
      {query && (
        <button
          onClick={clearQuery}
          className="absolute right-3 w-7 h-7 bg-[#E8E7E3] rounded-full flex items-center justify-center text-[#2F2E2A] hover:bg-[#D4D2CC] cursor-pointer transition-colors outline-none border-none"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <AppOverlay
        isOpen={isOpen}
        onClose={onClose}
        headerContent={inlineSearchInput}
      >
        <div className="space-y-4 pt-1 font-sans">
          
          {/* STATE 1: Query is empty */}
          {!debouncedQuery.trim() && (
            <div className="space-y-3">
              <label className="block text-[11px] font-extrabold text-[#75726A] tracking-[0.04em] uppercase">
                SUGGESTED
              </label>
              
              <div className="flex flex-wrap gap-2 pt-1 pb-6">
                {(['Routine', 'Transport', 'Quiz', 'Room change', 'Cancelled'] as const).map((chip) => (
                  <motion.button
                    key={chip}
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={() => handleChipClick(chip)}
                    className="h-9 px-3.5 bg-white border border-[#E0DED8] text-[#2F2E2A] text-[13px] font-bold rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FAFAF9] transition-colors outline-none"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STATE 2: Query is non-empty */}
          {debouncedQuery.trim() && results.length > 0 && (
            <div className="space-y-4">
              <div className="text-[11px] font-extrabold text-[#75726A] tracking-[0.04em] uppercase select-none">
                {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'}
              </div>

              <div className="space-y-3.5">
                {results.map((post) => {
                  const author = getAuthorInfo(post);
                  return (
                    <motion.div
                      key={post.id}
                      whileTap={{ scale: 0.99, opacity: 0.92 }}
                      onClick={() => triggerOverlayToast(`Open: ${post.title}`)}
                      className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col text-left cursor-pointer transition-transform select-none"
                    >
                      {/* HEAD ROW */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full bg-[#FFE7DF] text-[#FF5A36] text-[14px] font-extrabold flex items-center justify-center font-sans">
                          {author.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[14px] font-semibold text-[#0E0D0B] leading-none truncate">
                              {highlightText(author.name, debouncedQuery)}
                            </span>
                            <span className="bg-[#0E0D0B] text-white font-mono text-[9px] font-black tracking-[0.05em] px-2 py-0.5 rounded-[5px] uppercase">
                              {author.role}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-[#75726A] mt-1 block">
                            {post.timeLabel}
                          </span>
                        </div>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-[15px] font-bold text-[#0E0D0B] leading-snug tracking-tight mb-2">
                        {highlightText(post.title, debouncedQuery)}
                      </h3>

                      {/* BODY */}
                      <p className="text-[14px] font-normal text-[#2F2E2A] leading-relaxed mb-4">
                        {highlightText(post.body, debouncedQuery)}
                      </p>

                      {/* FOOT ROW */}
                      <div className="pt-3 border-t border-[#ECEAE5] flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#75726A] select-none font-mono">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#FF5A36] font-extrabold bg-[#FFF4F0] px-2 py-0.5 rounded-full">
                          #{post.tag}
                        </span>
                        <span>&middot;</span>
                        <span>Seen by {post.seenCount}</span>
                        <span>&middot;</span>
                        <span>{post.likes} reactions</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STATE 3: Query is non-empty and has NO Matches */}
          {debouncedQuery.trim() && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-fade-in">
              <div className="w-16 h-16 bg-[#FAFAF9] border border-[#ECEAE5] rounded-full flex items-center justify-center text-[#75726A] mb-4 shadow-1">
                <SearchX size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-bold text-[#0E0D0B] tracking-tight">
                No results for "{debouncedQuery}"
              </h3>
              <p className="text-[14px] font-medium text-[#75726A] mt-1.5 max-w-[260px] leading-relaxed">
                Try a tag, keyword, or person.
              </p>
            </div>
          )}

        </div>
      </AppOverlay>

      {/* CUSTOM OVERLAY TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-70 bg-[#0E0D0B] text-white text-[13px] font-bold px-[18px] py-[12px] rounded-[12px] shadow-[0_12px_32px_rgba(14,13,11,.28)] font-sans text-center whitespace-nowrap max-w-[340px]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
