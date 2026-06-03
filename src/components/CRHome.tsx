import React from 'react';
import { 
  Volume2, Search, ThumbsUp, MoreVertical, Bell, Plus, 
  FileSpreadsheet, GraduationCap, Contact, BarChart3, CalendarDays, HelpCircle, Calendar, Bus
} from 'lucide-react';
import { motion } from 'motion/react';
import { PostItem } from './CRShell';

interface CRHomeProps {
  systemTime: Date;
  pinnedPost: PostItem | null;
  recentPosts: PostItem[];
  onUnpin: () => void;
  onSelectTemplate: (templateName: 'cancelled' | 'room' | 'bus' | 'custom') => void;
  onLikePost: (postId: string, isPinned: boolean) => void;
  onNavigateSubScreen: (screen: 'Assignments' | 'AcademicHub' | 'Faculty' | 'Polls' | 'Events' | 'AskCR' | 'Routine' | 'Transport') => void;
  assignmentsCount: number;
  quizzesCount: number;
  facultyCount: number;
  pollsCount: number;
  eventsCount: number;
  unansweredCount: number;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

const SignalGraphic = ({ activeIndex, activeColor }: { activeIndex: number; activeColor: string }) => {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[8, 12, 10, 14, 11, 15, 13, 16].map((h, i) => (
        <span 
          key={i} 
          style={{ 
            height: `${h}px`, 
            backgroundColor: i === activeIndex ? activeColor : '#E8E7E3' 
          }} 
          className="w-[3px] rounded-full"
        />
      ))}
    </div>
  );
};

export default function CRHome({
  systemTime,
  pinnedPost,
  recentPosts,
  onUnpin,
  onSelectTemplate,
  onLikePost,
  onNavigateSubScreen,
  assignmentsCount,
  quizzesCount,
  facultyCount,
  pollsCount,
  eventsCount,
  unansweredCount,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount
}: CRHomeProps) {
  // Format Date: e.g. Wed 10 Jun
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = daysShort[systemTime.getDay()];
  const dateNum = systemTime.getDate();
  const monthName = monthsShort[systemTime.getMonth()];

  return (
    <div className="space-y-6">
      {/* (A) HEADER ROW */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#0E0D0B] tracking-tight leading-none">
            Today, {dayName} {dateNum} {monthName}
          </h1>
          <p className="text-[12px] font-medium text-[#75726A] mt-1.5 uppercase tracking-wider">
            SWE-M &middot; You're CR
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full bg-white border border-[#ECEAE5] shadow-1 flex items-center justify-center text-[#0E0D0B] hover:border-[#75726A] active:scale-[0.97] duration-120 transition-all cursor-pointer outline-none"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
          <button 
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-[#ECEAE5] shadow-1 flex items-center justify-center text-[#0E0D0B] hover:border-[#75726A] relative active:scale-[0.97] duration-120 transition-all cursor-pointer outline-none"
          >
            <Bell size={18} strokeWidth={1.75} />
            {unreadNotificationsCount !== undefined && unreadNotificationsCount > 0 && (
              <span 
                className="absolute w-[8px] h-[8px] bg-[#FF5A36] rounded-full" 
                style={{ top: '-2px', right: '-2px', boxShadow: '0 0 0 2px #FFFFFF' }}
              />
            )}
          </button>
        </div>
      </div>

      {/* (B) STATS ROW */}
      <div className="grid grid-cols-3 gap-3">
        {/* Stat 1: POSTS TODAY */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <SignalGraphic activeIndex={3} activeColor="#FF5A36" />
            <span className="text-[10px] font-bold text-[#FF5A36] bg-[#FFF4F0] px-1.5 py-0.5 rounded-full font-mono">
              +18%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight block">2</span>
            <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1 block">POSTS TODAY</span>
          </div>
        </div>

        {/* Stat 2: AVG REACH */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <SignalGraphic activeIndex={5} activeColor="#19A974" />
            <span className="text-[9px] font-bold text-[#0F6B43] bg-[#E5F7EE] px-1.5 py-0.5 rounded-full">
              STRONG
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0F6B43] font-mono tracking-tight block">96%</span>
            <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1 block">AVG REACH</span>
          </div>
        </div>

        {/* Stat 3: AVG SEEN-BY */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <SignalGraphic activeIndex={1} activeColor="#75726A" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8A59C]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight block">2.1m</span>
            <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1 block">AVG SEEN-BY</span>
          </div>
        </div>
      </div>

      {/* (C) QUICK POST CARD */}
      <div className="bg-[#0E0D0B] rounded-[14px] p-5 space-y-4 shadow-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#FF5A36] tracking-widest uppercase">QUICK POST</span>
          <span className="w-2 h-2 rounded-full bg-[#19A974] animate-pulse" />
        </div>
        
        <div 
          onClick={() => onSelectTemplate('custom')}
          className="w-full bg-[#1B1A18] text-[#A8A59C] rounded-[12px] p-3.5 text-xs text-left cursor-pointer active:scale-[0.98] duration-120 transition-all border border-[#ECEAE5]/10"
        >
          What does the section need to know?
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#ECEAE5]/10">
          <button 
            onClick={() => onSelectTemplate('cancelled')}
            className="bg-white text-[#0E0D0B] px-3.5 py-2 rounded-full text-[12px] font-semibold active:scale-[0.95] duration-120 transition-all cursor-pointer hover:bg-[#F4F4F2]"
          >
            Class cancelled
          </button>
          <button 
            onClick={() => onSelectTemplate('room')}
            className="bg-white text-[#0E0D0B] px-3.5 py-2 rounded-full text-[12px] font-semibold active:scale-[0.95] duration-120 transition-all cursor-pointer hover:bg-[#F4F4F2]"
          >
            Room change
          </button>
          <button 
            onClick={() => onSelectTemplate('bus')}
            className="bg-white text-[#0E0D0B] px-3.5 py-2 rounded-full text-[12px] font-semibold active:scale-[0.95] duration-120 transition-all cursor-pointer hover:bg-[#F4F4F2]"
          >
            Bus update
          </button>
        </div>
      </div>

      {/* (F) QUICK ACCESS FEATURE GRID */}
      <div className="space-y-4">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block select-none">
          QUICK ACCESS
        </span>

        <div className="grid grid-cols-2 gap-3.5 font-sans">
          
          {/* Tile 1: Assignments */}
          <button
            onClick={() => onNavigateSubScreen('Assignments')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#FFF4F0] text-[#FF5A36] flex items-center justify-center shrink-0">
              <FileSpreadsheet size={20} strokeWidth={1.75} />
            </div>
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Assignments</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {assignmentsCount} due &middot; CR view
              </span>
            </div>
          </button>

          {/* Tile 2: Academic Hub */}
          <button
            onClick={() => onNavigateSubScreen('AcademicHub')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none"
          >
            <div className="w-9 h-9 rounded-[10px] bg-coral-50 text-[#FF5A36] flex items-center justify-center shrink-0">
              <GraduationCap size={20} strokeWidth={1.75} />
            </div>
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Academic Hub</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {quizzesCount} quizzes &middot; labs
              </span>
            </div>
          </button>

          {/* Tile 3: Faculty Directory */}
          <button
            onClick={() => onNavigateSubScreen('Faculty')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#FFF4F0] text-[#FF5A36] flex items-center justify-center shrink-0">
              <Contact size={20} strokeWidth={1.75} />
            </div>
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Faculty directory</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {facultyCount} profiles &middot; status
              </span>
            </div>
          </button>

          {/* Tile 4: Active Polls */}
          <button
            onClick={() => onNavigateSubScreen('Polls')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none"
          >
            <div className="w-9 h-9 rounded-[10px] bg-coral-50 text-[#FF5A36] flex items-center justify-center shrink-0">
              <BarChart3 size={20} strokeWidth={1.75} />
            </div>
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Active polls</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {pollsCount} active &middot; vote
              </span>
            </div>
          </button>

          {/* Tile 5: Events */}
          <button
            onClick={() => onNavigateSubScreen('Events')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#FFF4F0] text-[#FF5A36] flex items-center justify-center shrink-0">
              <CalendarDays size={20} strokeWidth={1.75} />
            </div>
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Events</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {eventsCount} upcoming &middot; RSVP
              </span>
            </div>
          </button>

          {/* Tile 6: Ask CR */}
          <button
            onClick={() => onNavigateSubScreen('AskCR')}
            className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between items-start text-left cursor-pointer active:scale-[0.97] duration-[120ms] transition-all select-none h-[112px] w-full outline-none relative"
          >
            <div className="w-9 h-9 rounded-[10px] bg-coral-50 text-[#FF5A36] flex items-center justify-center shrink-0">
              <HelpCircle size={20} strokeWidth={1.75} />
            </div>
            {unansweredCount > 0 && (
              <span className="absolute top-4 right-4 bg-coral-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full z-10 leading-none">
                {unansweredCount}
              </span>
            )}
            <div className="mt-2.5">
              <h4 className="text-[13px] font-bold text-[#0E0D0B] leading-none">Ask CR</h4>
              <span className="font-mono text-[10px] text-[#75726A] font-semibold block mt-1">
                {unansweredCount > 0 ? `${unansweredCount} waiting` : 'Inbox &middot; support'}
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* (D) PINNED SECTION */}
      {pinnedPost && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase">
              PINNED &bull; AUTO-UNPINS IN
            </span>
            <span className="text-[11px] font-bold text-[#0E0D0B] font-mono">20H</span>
          </div>

          <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 relative overflow-hidden flex flex-col gap-3">
            {/* 6px amber bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#FFB020]" />
            
            <div className="pl-2 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E5F7EE] text-[#0F6B43] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Posted by you
                  </span>
                  <span className="text-[#75726A] text-[12px] font-semibold">#{pinnedPost.tag}</span>
                </div>
                <span className="text-[#75726A] text-[11px] font-medium font-mono">
                  {pinnedPost.timeLabel}
                </span>
              </div>

              <div>
                <h4 className="text-[17px] font-bold text-[#0E0D0B] leading-snug">
                  {pinnedPost.title}
                </h4>
                <p className="text-[15px] font-normal text-[#4D4B45] mt-1 leading-relaxed">
                  {pinnedPost.body}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ECEAE5] flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-2 max-w-[140px] sm:max-w-none">
                  <div className="flex-1 h-1.5 bg-[#F4F4F2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#19A974] rounded-full" style={{ width: '98%' }} />
                  </div>
                  <span className="text-[11px] text-[#75726A] font-bold font-mono shrink-0">
                    41/42
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onLikePost(pinnedPost.id, true)}
                    className="flex items-center gap-1.5 text-[#75726A] hover:text-[#FF5A36] text-[12px] font-bold font-mono transition-colors active:scale-95 cursor-pointer"
                  >
                    <ThumbsUp size={14} className="stroke-[2]" />
                    <span>{pinnedPost.likes}</span>
                  </button>
                  <button 
                    onClick={onUnpin}
                    className="text-[#75726A] hover:text-[#0E0D0B] p-1 rounded transition-colors cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* (E) RECENT POSTS */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          RECENT POSTS
        </span>

        <div className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#75726A] text-[12px] font-semibold">#{post.tag}</span>
                <span className="text-[#75726A] text-[11px] font-medium font-mono">{post.timeLabel}</span>
              </div>

              <div>
                <h4 className="text-[16px] font-bold text-[#0E0D0B] leading-snug">
                  {post.title}
                </h4>
                <p className="text-[14px] font-normal text-[#4D4B45] mt-1 leading-relaxed">
                  {post.body}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#ECEAE5] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#75726A] font-semibold uppercase tracking-wider">seen</span>
                  <span className="text-[12px] text-[#0E0D0B] font-bold font-mono">
                    {post.seenCount}/{post.totalCount}
                  </span>
                </div>

                <button 
                  onClick={() => onLikePost(post.id, false)}
                  className="flex items-center gap-1.5 text-[#75726A] hover:text-[#FF5A36] text-[12px] font-bold font-mono transition-colors active:scale-95 cursor-pointer"
                >
                  <ThumbsUp size={14} className="stroke-[2]" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
