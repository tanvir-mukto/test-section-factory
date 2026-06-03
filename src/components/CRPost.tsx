import React, { useRef, useEffect } from 'react';
import { X, CalendarX, DoorOpen, Volume2, PenLine, Paperclip, Image, CalendarPlus, Pin, Bell, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface CRPostProps {
  postTitle: string;
  setPostTitle: (v: string) => void;
  postBody: string;
  setPostBody: (v: string) => void;
  selectedTemplate: 'cancelled' | 'room' | 'bus' | 'custom';
  onSelectTemplate: (v: 'cancelled' | 'room' | 'bus' | 'custom') => void;
  pinToTop: boolean;
  setPinToTop: (v: boolean) => void;
  sendPush: boolean;
  setSendPush: (v: boolean) => void;
  scheduleLater: boolean;
  setScheduleLater: (v: boolean) => void;
  onPostNow: () => void;
  onCancel: () => void;
}

const CustomToggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => {
  return (
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer shrink-0 ${
        checked ? 'bg-[#FF5A36]' : 'bg-[#E8E7E3]'
      }`}
    >
      <span 
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-1 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default function CRPost({
  postTitle,
  setPostTitle,
  postBody,
  setPostBody,
  selectedTemplate,
  onSelectTemplate,
  pinToTop,
  setPinToTop,
  sendPush,
  setSendPush,
  scheduleLater,
  setScheduleLater,
  onPostNow,
  onCancel
}: CRPostProps) {
  return (
    <div className="space-y-6 pb-20">
      {/* (A) TOP BAR */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[26px] font-bold text-[#0E0D0B] tracking-tight">New post</h2>
          <p className="text-[12px] font-medium text-[#75726A] mt-0.5">
            Draft saved &bull; 12s ago
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="w-9 h-9 rounded-full bg-white border border-[#ECEAE5] shadow-1 flex items-center justify-center text-[#0E0D0B] hover:bg-[#F4F4F2] active:scale-95 duration-120 transition-all cursor-pointer"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* (B) POSTING-TO HERO CARD */}
      <div className="bg-[#FFF4F0] border border-[#FFE7DF] rounded-xl p-4 flex items-center justify-between shadow-1">
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
          <div className="flex -space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#FFE7DF] text-[#FF5A36] border border-white flex items-center justify-center font-bold text-[10px] font-mono shadow-sm">
              SA
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FFF1D6] text-[#7A4A00] border border-white flex items-center justify-center font-bold text-[10px] font-mono shadow-sm">
              NA
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FFE7DF] text-[#FF5A36] border border-white flex items-center justify-center font-bold text-[10px] font-mono shadow-sm">
              RH
            </div>
          </div>

          <div>
            <h4 className="text-[15px] font-bold text-[#0E0D0B] leading-none">Posting to SWE-M</h4>
            <p className="text-[12px] text-[#75726A] mt-1">42 students &bull; push enabled</p>
          </div>
        </div>

        <div className="h-6 px-3 bg-[#FF5A36] text-white flex items-center justify-center rounded-full text-[12px] font-extrabold font-mono shadow-md">
          42
        </div>
      </div>

      {/* (C) START FROM */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          START FROM
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Option 1: Class cancelled */}
          <div 
            onClick={() => onSelectTemplate('cancelled')}
            className={`border rounded-[14px] p-3.5 flex flex-col gap-2.5 cursor-pointer text-left transition-all duration-120 hover:scale-[0.98] ${
              selectedTemplate === 'cancelled' 
                ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] ring-1 ring-[#FF5A36]' 
                : 'bg-white border-[#ECEAE5] text-[#0E0D0B] shadow-1 hover:border-[#75726A]'
            }`}
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#FFE7DF] flex items-center justify-center text-[#FF5A36] shrink-0">
              <CalendarX size={20} />
            </div>
            <div>
              <span className="text-[13px] font-bold block leading-tight">Class cancelled</span>
              <span className="text-[10px] text-[#75726A] font-medium block mt-1">Used 24&times; this term</span>
            </div>
          </div>

          {/* Option 2: Room change */}
          <div 
            onClick={() => onSelectTemplate('room')}
            className={`border rounded-[14px] p-3.5 flex flex-col gap-2.5 cursor-pointer text-left transition-all duration-120 hover:scale-[0.98] ${
              selectedTemplate === 'room' 
                ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] ring-1 ring-[#FF5A36]' 
                : 'bg-white border-[#ECEAE5] text-[#0E0D0B] shadow-1 hover:border-[#75726A]'
            }`}
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#FFE7DF] flex items-center justify-center text-[#FF5A36] shrink-0">
              <DoorOpen size={20} />
            </div>
            <div>
              <span className="text-[13px] font-bold block leading-tight">Room change</span>
              <span className="text-[10px] text-[#75726A] font-medium block mt-1">Used 8&times;</span>
            </div>
          </div>

          {/* Option 3: Bus update */}
          <div 
            onClick={() => onSelectTemplate('bus')}
            className={`border rounded-[14px] p-3.5 flex flex-col gap-2.5 cursor-pointer text-left transition-all duration-120 hover:scale-[0.98] ${
              selectedTemplate === 'bus' 
                ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] ring-1 ring-[#FF5A36]' 
                : 'bg-white border-[#ECEAE5] text-[#0E0D0B] shadow-1 hover:border-[#75726A]'
            }`}
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#FFE7DF] flex items-center justify-center text-[#FF5A36] shrink-0">
              <Volume2 size={20} />
            </div>
            <div>
              <span className="text-[13px] font-bold block leading-tight">Bus update</span>
              <span className="text-[10px] text-[#75726A] font-medium block mt-1">Used 6&times;</span>
            </div>
          </div>

          {/* Option 4: Custom post */}
          <div 
            onClick={() => onSelectTemplate('custom')}
            className={`border rounded-[14px] p-3.5 flex flex-col gap-2.5 cursor-pointer text-left transition-all duration-120 hover:scale-[0.98] ${
              selectedTemplate === 'custom' 
                ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36] ring-1 ring-[#FF5A36]' 
                : 'bg-white border-[#ECEAE5] text-[#0E0D0B] shadow-1 hover:border-[#75726A]'
            }`}
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#FFE7DF] flex items-center justify-center text-[#FF5A36] shrink-0">
              <PenLine size={20} />
            </div>
            <div>
              <span className="text-[13px] font-bold block leading-tight">Custom post</span>
              <span className="text-[10px] text-[#75726A] font-medium block mt-1">Blank canvas</span>
            </div>
          </div>
        </div>
      </div>

      {/* (D) MESSAGE */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          MESSAGE
        </span>

        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3">
          <input 
            type="text" 
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-[17px] font-bold text-[#0E0D0B] placeholder-[#A8A59C] bg-transparent outline-none border-b border-[#F4F4F2] pb-2 font-sans"
          />

          <textarea 
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="Add details students need to know"
            rows={4}
            maxLength={500}
            className="w-full text-[15px] font-normal text-[#4D4B45] placeholder-[#A8A59C] bg-transparent outline-none resize-none leading-relaxed font-sans"
          />

          <div className="pt-2 border-t border-[#F4F4F2] flex items-center justify-between">
            <div className="flex items-center gap-3.5 text-[#75726A]">
              <button type="button" className="hover:text-[#0E0D0B] transition-colors cursor-pointer">
                <Paperclip size={18} strokeWidth={1.75} />
              </button>
              <button type="button" className="hover:text-[#0E0D0B] transition-colors cursor-pointer">
                <Image size={18} strokeWidth={1.75} />
              </button>
              <button type="button" className="hover:text-[#0E0D0B] transition-colors cursor-pointer">
                <CalendarPlus size={18} strokeWidth={1.75} />
              </button>
            </div>
            <span className="text-[11px] font-semibold text-[#75726A] font-mono">
              {postBody.length}/500
            </span>
          </div>
        </div>
      </div>

      {/* (E) DELIVERY */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          DELIVERY
        </span>

        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] divide-y divide-[#ECEAE5] overflow-hidden">
          {/* Row 1: Pin to top */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FFE7DF] rounded-[8px] flex items-center justify-center text-[#FF5A36] shrink-0">
                <Pin size={18} />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-bold text-[#0E0D0B] block">Pin to top</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Stays at the top for 24 hr.</span>
              </div>
            </div>
            <CustomToggle checked={pinToTop} onChange={setPinToTop} />
          </div>

          {/* Row 2: Push */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FFE7DF] rounded-[8px] flex items-center justify-center text-[#FF5A36] shrink-0">
                <Bell size={18} />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-bold text-[#0E0D0B] block">Send push notification</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Wakes up all 42 students.</span>
              </div>
            </div>
            <CustomToggle checked={sendPush} onChange={setSendPush} />
          </div>

          {/* Row 3: Schedule */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#F4F4F2] rounded-[8px] flex items-center justify-center text-[#75726A] shrink-0">
                <Calendar size={18} />
              </div>
              <div className="text-left">
                <span className="text-[14px] font-bold text-[#0E0D0B] block">Schedule for later</span>
                <span className="text-[11px] text-[#75726A] font-medium block mt-0.5">Send right away</span>
              </div>
            </div>
            <CustomToggle checked={scheduleLater} onChange={setScheduleLater} />
          </div>
        </div>
      </div>

      {/* (F) PREVIEW CONTAINER */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase block">
          PREVIEW
        </span>

        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col gap-3 relative overflow-hidden">
          {pinToTop && <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#FFB020]" />}
          
          <div className={`${pinToTop ? 'pl-2' : ''} space-y-2.5`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0E0D0B] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                CR &bull; Tahmid
              </span>
              {pinToTop && (
                <span className="bg-[#FFF1D6] text-[#7A4A00] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Pinned
                </span>
              )}
              <span className="text-[#75726A] text-[12px] font-semibold">
                #{selectedTemplate === 'custom' ? 'announcement' : selectedTemplate === 'cancelled' ? 'routine' : selectedTemplate === 'room' ? 'routine' : 'transport'}
              </span>
            </div>

            <h4 className="text-[17px] font-bold text-[#0E0D0B] leading-snug">
              {postTitle || 'No title entered'}
            </h4>
            <p className="text-[15px] font-normal text-[#4D4B45] leading-relaxed">
              {postBody || 'No description entered'}
            </p>
          </div>
        </div>
      </div>

      {/* (G) STICKY COMPOSER ACTIONS BAR */}
      <div className="sticky bottom-[12px] left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border border-[#ECEAE5] shadow-3 rounded-2xl p-3 flex items-center justify-between gap-4 mt-8">
        <button 
          onClick={onCancel}
          className="bg-[#F4F4F2] text-[#0E0D0B] px-4 py-2.5 rounded-full text-[13px] font-bold active:scale-95 duration-120 transition-all cursor-pointer whitespace-nowrap"
        >
          Draft
        </button>

        <button 
          onClick={onPostNow}
          className="flex-1 bg-[#FF5A36] text-white font-bold py-3 px-5 rounded-full text-[15px] shadow-coral-glow transition-all active:scale-[0.98] duration-120 cursor-pointer text-center"
        >
          Post now &bull; 42 will be notified
        </button>
      </div>
    </div>
  );
}
