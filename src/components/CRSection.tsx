import React, { useState } from 'react';
import { Check, CalendarDays, Bus, Calendar, ChevronRight, Phone, Mail, Pin, Heart } from 'lucide-react';
import { PostItem } from './CRShell';

interface CRSectionProps {
  pinnedPost: PostItem | null;
  onUnpin: () => void;
  onTriggerToast: (msg: string) => void;
  onNavigateSubScreen?: (screen: 'Assignments' | 'AcademicHub' | 'Faculty' | 'Polls' | 'Events' | 'AskCR' | 'Routine' | 'Transport') => void;
}

export default function CRSection({
  pinnedPost,
  onUnpin,
  onTriggerToast,
  onNavigateSubScreen
}: CRSectionProps) {
  // Tour preference poll states inside section screen for modularity and interaction
  const [option1Votes, setOption1Votes] = useState(28);
  const [option2Votes, setOption2Votes] = useState(13);
  const [hasVoted, setHasVoted] = useState<number | null>(null);

  const handleVote = (optionNum: number) => {
    if (hasVoted !== null) {
      onTriggerToast("Your vote is already recorded in aggregate!");
      return;
    }
    setHasVoted(optionNum);
    if (optionNum === 1) {
      setOption1Votes(prev => prev + 1);
      onTriggerToast("Recorded preferences: Saturday 22nd");
    } else {
      setOption2Votes(prev => prev + 1);
      onTriggerToast("Recorded preferences: Sunday 23rd");
    }
  };

  const totalVotes = option1Votes + option2Votes;
  const pct1 = totalVotes > 0 ? Math.round((option1Votes / totalVotes) * 100) : 0;
  const pct2 = totalVotes > 0 ? Math.round((option2Votes / totalVotes) * 100) : 0;

  // Faculty array
  const facultyList = [
    {
      initials: 'KN',
      name: 'Dr. Khondkar Nazmul Ahmed',
      course: 'SE123 &bull; Discrete Mathematics',
      status: 'online' as const,
      phone: '+880 1711 556677',
      email: 'khondkar@faculty.edu'
    },
    {
      initials: 'KR',
      name: 'Dr. Khalid Rahman Yusuf',
      course: 'SE213 &bull; Digital Electronics & Logic',
      status: 'away' as const,
      phone: '+880 1819 112233',
      email: 'khalid@faculty.edu'
    },
    {
      initials: 'DK',
      name: 'Dr. Delowar Karim',
      course: 'MAT102 &bull; Mathematics II',
      status: 'offline' as const,
      phone: '+880 1515 998877',
      email: 'delowar@faculty.edu'
    },
    {
      initials: 'NL',
      name: 'Dr. Nazmul Sultan Lipu',
      course: 'SE131 / SE132 &bull; Data Structure',
      status: 'online' as const,
      phone: '+880 1911 334455',
      email: 'lipu@faculty.edu'
    }
  ];

  return (
    <div className="space-y-6">
      {/* (A) HEADER */}
      <div>
        <h1 className="text-[32px] font-bold text-[#0E0D0B] tracking-tight leading-none">
          Section
        </h1>
        <p className="text-[12px] font-medium text-[#75726A] mt-1.5 uppercase tracking-wider">
          SWE-M &middot; Summer 26
        </p>
      </div>

      {/* (B) SECTION HEALTH */}
      <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase">
            SECTION HEALTH
          </span>
          <div className="w-9 h-9 bg-[#E5F7EE] text-[#19A974] rounded-full flex items-center justify-center">
            <Check size={20} className="stroke-[2.5]" />
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-bold text-[#0E0D0B] leading-none">
            Running smoothly
          </h3>
          <p className="text-[12px] text-[#75726A] mt-1">All streams synched &bull; zero conflicts</p>
        </div>

        <div className="border-t border-[#ECEAE5] pt-3 mt-1.5 grid grid-cols-3 gap-3">
          <div>
            <span className="text-2xl font-bold text-[#0E0D0B] font-mono block">14</span>
            <span className="text-[9px] font-bold text-[#75726A] uppercase tracking-wider mt-0.5 block">
              POSTS THIS WEEK
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#0F6B43] font-mono block">96%</span>
            <span className="text-[9px] font-bold text-[#75726A] uppercase tracking-wider mt-0.5 block">
              AVG REACH
            </span>
          </div>
          <div>
            <span className="text-[13px] font-bold text-[#0E0D0B] font-mono tracking-tight bg-[#F4F4F2] px-2 py-0.5 rounded-full block text-center w-max mt-0.5 leading-tight">
              #routine
            </span>
            <span className="text-[9px] font-bold text-[#75726A] uppercase tracking-wider mt-1 block">
              TOP TAG
            </span>
          </div>
        </div>
      </div>

      {/* (C) ACTIVE RIGHT NOW */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          ACTIVE RIGHT NOW
        </span>

        {/* Card 1: Pinned Post details */}
        {pinnedPost ? (
          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 relative overflow-hidden flex flex-col gap-3">
            <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#FFB020]" />
            
            <div className="pl-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-[#FFF1D6] text-[#7A4A00] px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans">
                  Pinned
                </span>
                <span className="text-[#7A4A00] text-[11px] font-bold font-mono uppercase tracking-wider">
                  20H LEFT
                </span>
              </div>

              <h4 className="text-[15px] font-bold text-[#0E0D0B] leading-snug">
                {pinnedPost.title}
              </h4>
              
              <div className="flex items-center gap-2.5 pt-2">
                <button 
                  onClick={onUnpin}
                  className="bg-white border border-[#E0DED8] text-[#0E0D0B] text-[12px] font-bold px-3 py-1.5 rounded-full active:scale-95 duration-120 hover:bg-[#F4F4F2] transition-colors cursor-pointer shadow-sm"
                >
                  Unpin
                </button>
                <button 
                  onClick={() => onTriggerToast("Extended unpin window by +24 hours!")}
                  className="bg-[#F4F4F2] text-[#0E0D0B] text-[12px] font-bold px-3 py-1.5 rounded-full active:scale-95 duration-120 hover:bg-[#E8E7E3] transition-colors cursor-pointer"
                >
                  Extend
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAFAF9] border border-dashed border-[#E0DED8] rounded-[14px] p-5 text-center text-xs text-[#75726A]">
            No pinned posts active right now
          </div>
        )}

        {/* Card 2: Active poll */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-[#0E0D0B] text-[15px]">Tour weekend preference</h4>
            <span className="text-[#FF5A36] text-[11px] font-bold uppercase tracking-wider">
              Closes 6 pm
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Option 1: Sat 22nd */}
            <div 
              onClick={() => handleVote(1)}
              className="space-y-1.5 cursor-pointer group active:scale-[0.99] transition-transform duration-120"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0E0D0B] group-hover:text-[#FF5A36] transition-colors">
                  Sat 22nd {hasVoted === 1 && "✓"}
                </span>
                <span className="font-mono text-[#0E0D0B]">{option1Votes} class ({pct1}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F4F2] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF5A36] rounded-full transition-all duration-500" 
                  style={{ width: `${pct1}%` }} 
                />
              </div>
            </div>

            {/* Option 2: Sun 23rd */}
            <div 
              onClick={() => handleVote(2)}
              className="space-y-1.5 cursor-pointer group active:scale-[0.99] transition-transform duration-120"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0E0D0B] group-hover:text-[#FF5A36] transition-colors">
                  Sun 23rd {hasVoted === 2 && "✓"}
                </span>
                <span className="font-mono text-[#4D4B45]">{option2Votes} ({pct2}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F4F2] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ECEAE5] rounded-full transition-all duration-500" 
                  style={{ width: `${pct2}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* (D) SECTION CONTENT */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          SECTION CONTENT
        </span>

        <div className="space-y-3">
          {/* Item 1: Routine */}
          <div 
            onClick={() => {
              if (onNavigateSubScreen) {
                onNavigateSubScreen('Routine');
              } else {
                onTriggerToast("Switch to standard routine tab to view layout parameters.");
              }
            }}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center justify-between cursor-pointer hover:border-[#75726A] transition-all duration-120 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[44px] h-[44px] bg-[#FFE7DF] rounded-[8px] flex items-center justify-center text-[#FF5A36]">
                <CalendarDays size={22} />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-[#0E0D0B] block">Routine</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Edit slots, mark cancellations</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A8A59C]" />
          </div>

          {/* Item 2: Transport */}
          <div 
            onClick={() => {
              if (onNavigateSubScreen) {
                onNavigateSubScreen('Transport');
              } else {
                onTriggerToast("Route 7 bus stream updated with 38 bookings matches.");
              }
            }}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center justify-between cursor-pointer hover:border-[#75726A] transition-all duration-120 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[44px] h-[44px] bg-[#FFE7DF] rounded-[8px] flex items-center justify-center text-[#FF5A36]">
                <Bus size={22} />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-[#0E0D0B] block">Transport</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Route 7 &bull; 38/40 confirmed</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A8A59C]" />
          </div>

          {/* Item 3: Events */}
          <div 
            onClick={() => {
              if (onNavigateSubScreen) {
                onNavigateSubScreen('Events');
              } else {
                onTriggerToast("Events schedule sync: CSE programming challenge Mar 18");
              }
            }}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex items-center justify-between cursor-pointer hover:border-[#75726A] transition-all duration-120 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-[44px] h-[44px] bg-[#FFE7DF] rounded-[8px] flex items-center justify-center text-[#FF5A36]">
                <Calendar size={22} />
              </div>
              <div className="text-left">
                <span className="text-[15px] font-bold text-[#0E0D0B] block">Events</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Programming contest, Mar 18</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A8A59C]" />
          </div>
        </div>
      </div>

      {/* (E) FACULTY */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          FACULTY
        </span>

        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] divide-y divide-[#ECEAE5] overflow-hidden">
          {facultyList.map((faculty, fidx) => (
            <div key={fidx} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Avatar with status dot absolute inside frame */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center font-extrabold text-[13px] font-mono shadow-sm">
                    {faculty.initials}
                  </div>
                  {/* Status dot convention */}
                  <span 
                    style={{ 
                      backgroundColor: faculty.status === 'online' ? '#19A974' : faculty.status === 'away' ? '#F59E0B' : '#A8A59C' 
                    }}
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  />
                </div>

                <div className="text-left">
                  <span className="text-[14px] font-bold text-[#0E0D0B] block leading-snug">
                    {faculty.name}
                  </span>
                  <span className="text-[11.5px] text-[#75726A] font-medium font-sans block mt-0.5" dangerouslySetInnerHTML={{ __html: faculty.course }} />
                </div>
              </div>

              {/* Action columns */}
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${faculty.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onTriggerToast(`Initiating call session to Dr. ${faculty.name.split(' ').pop()} at ${faculty.phone}`);
                  }}
                  className="w-8.5 h-8.5 rounded-full bg-[#FAFAF9] border border-[#ECEAE5] hover:border-[#FF5A36] text-[#0E0D0B] hover:text-[#FF5A36] flex items-center justify-center shrink-0 shadow-sm active:scale-90 duration-120 transition-all cursor-pointer"
                >
                  <Phone size={14} className="stroke-[2]" />
                </a>
                
                <a 
                  href={`mailto:${faculty.email}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onTriggerToast(`Launching mail composer to ${faculty.email}`);
                  }}
                  className="w-8.5 h-8.5 rounded-full bg-[#FAFAF9] border border-[#ECEAE5] hover:border-[#FF5A36] text-[#0E0D0B] hover:text-[#FF5A36] flex items-center justify-center shrink-0 shadow-sm active:scale-90 duration-120 transition-all cursor-pointer"
                >
                  <Mail size={14} className="stroke-[2]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
