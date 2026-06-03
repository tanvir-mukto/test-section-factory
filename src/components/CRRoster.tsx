import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  initials: string;
  roll: string;
  status: 'online' | 'away' | 'offline';
  bus: string;
  lastActive: string;
  isCR?: boolean;
}

interface CRRosterProps {
  onTriggerToast: (msg: string) => void;
}

export default function CRRoster({ onTriggerToast }: CRRosterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Bus 7' | 'Bus 12' | 'Follow-up'>('All');

  // Student array
  const initialStudents: Student[] = [
    {
      id: 'r1',
      name: 'Sadia Ahmed',
      initials: 'SA',
      roll: '2021-1-60-018',
      status: 'online',
      bus: 'Bus 7',
      lastActive: '2m ago'
    },
    {
      id: 'r2',
      name: 'Tahmid Rahman',
      initials: 'TR',
      roll: '2021-1-60-022',
      status: 'online',
      bus: 'Bus 7',
      lastActive: 'now',
      isCR: true
    },
    {
      id: 'r3',
      name: 'Nila Akter',
      initials: 'NA',
      roll: '2021-1-60-031',
      status: 'online',
      bus: 'Bus 12',
      lastActive: '12m ago'
    },
    {
      id: 'r4',
      name: 'Rakib Hasan',
      initials: 'RH',
      roll: '2021-1-60-040',
      status: 'away',
      bus: 'Bus 7',
      lastActive: '3d ago' // flags follow-up (coral)
    },
    {
      id: 'r5',
      name: 'Mehedi Khan',
      initials: 'MK',
      roll: '2021-1-60-045',
      status: 'online',
      bus: 'Walk-in',
      lastActive: '1h ago'
    },
    {
      id: 'r6',
      name: 'Tasnim Jahan',
      initials: 'TJ',
      roll: '2021-1-60-052',
      status: 'online',
      bus: 'Bus 12',
      lastActive: '30m ago'
    },
    {
      id: 'r7',
      name: 'Anik Saha',
      initials: 'AS',
      roll: '2021-1-60-058',
      status: 'offline',
      bus: 'Bus 7',
      lastActive: '12h ago'
    },
    {
      id: 'r8',
      name: 'Samin Yasar',
      initials: 'SY',
      roll: '2021-1-60-061',
      status: 'online',
      bus: 'Walk-in',
      lastActive: '4d ago' // flags follow-up (coral)
    }
  ];

  // Filter & Search logic
  const filteredStudents = initialStudents.filter((student) => {
    // Search
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.roll.includes(searchTerm);

    if (!matchesSearch) return false;

    // Chips
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Active') return student.status === 'online' || student.status === 'away';
    if (selectedFilter === 'Bus 7') return student.bus === 'Bus 7';
    if (selectedFilter === 'Bus 12') return student.bus === 'Bus 12';
    if (selectedFilter === 'Follow-up') {
      return student.lastActive.includes('d ago');
    }

    return true;
  });

  const getActiveTextClass = (lastActive: string) => {
    if (lastActive.includes('d ago')) return 'text-[#FF5A36] font-bold'; // flags follow-up
    if (lastActive.includes('h ago') || lastActive.includes('12h ago')) return 'text-[#75726A] font-semibold';
    return 'text-[#0E0D0B] font-bold';
  };

  return (
    <div className="space-y-6">
      {/* (A) HEADER */}
      <div>
        <h1 className="text-[32px] font-bold text-[#0E0D0B] tracking-tight leading-none">
          Roster
        </h1>
        <p className="text-[12px] font-medium text-[#75726A] mt-1.5 uppercase tracking-wider">
          42 students &bull; 38 active
        </p>
      </div>

      {/* (B) ROSTER STATS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: OPENED APP THIS WEEK */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
          <div>
            <span className="text-3xl font-bold text-[#0E0D0B] font-mono tracking-tight inline-block">
              38
              <span className="text-sm font-semibold text-[#75726A] font-mono ml-0.5">/42</span>
            </span>
            <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
              OPENED APP THIS WEEK
            </span>
          </div>
        </div>

        {/* Card 2: NEED FOLLOW-UP */}
        <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] p-4 flex flex-col justify-between">
          <div>
            <span className="text-3xl font-bold text-[#FF5A36] font-mono tracking-tight block">
              4
            </span>
            <span className="text-[10px] font-bold text-[#75726A] uppercase tracking-wider mt-1.5 block">
              NEED FOLLOW-UP
            </span>
          </div>
        </div>
      </div>

      {/* (C) SEARCH INPUT */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75726A]">
          <Search size={18} strokeWidth={1.75} />
        </span>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or ID"
          className="w-full bg-white border border-[#E0DED8] rounded-[12px] py-3 pl-10 pr-4 text-[15px] focus:border-[#FF5A36] outline-none font-sans shadow-sm"
        />
      </div>

      {/* (D) FILTER CHIP ROW */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-5 px-5 scrollbar-none">
        {/* Chip 'All' */}
        <button 
          onClick={() => setSelectedFilter('All')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-120 whitespace-nowrap cursor-pointer active:scale-95 ${
            selectedFilter === 'All' 
              ? 'bg-[#0E0D0B] text-white border border-[#0E0D0B]' 
              : 'bg-white text-[#75726A] border border-[#E0DED8] hover:border-[#75726A]'
          }`}
        >
          All
        </button>

        {/* Chip 'Active' */}
        <button 
          onClick={() => setSelectedFilter('Active')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-120 whitespace-nowrap cursor-pointer active:scale-95 ${
            selectedFilter === 'Active' 
              ? 'bg-[#0E0D0B] text-white border border-[#0E0D0B]' 
              : 'bg-white text-[#75726A] border border-[#E0DED8] hover:border-[#75726A]'
          }`}
        >
          Active
        </button>

        {/* Chip 'Bus 7' */}
        <button 
          onClick={() => setSelectedFilter('Bus 7')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-120 whitespace-nowrap cursor-pointer active:scale-95 ${
            selectedFilter === 'Bus 7' 
              ? 'bg-[#0E0D0B] text-white border border-[#0E0D0B]' 
              : 'bg-white text-[#75726A] border border-[#E0DED8] hover:border-[#75726A]'
          }`}
        >
          Bus 7
        </button>

        {/* Chip 'Bus 12' */}
        <button 
          onClick={() => setSelectedFilter('Bus 12')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-120 whitespace-nowrap cursor-pointer active:scale-95 ${
            selectedFilter === 'Bus 12' 
              ? 'bg-[#0E0D0B] text-white border border-[#0E0D0B]' 
              : 'bg-white text-[#75726A] border border-[#E0DED8] hover:border-[#75726A]'
          }`}
        >
          Bus 12
        </button>

        {/* Fixed, Amber tinted follow-up chip */}
        <button 
          onClick={() => setSelectedFilter('Follow-up')}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-120 whitespace-nowrap cursor-pointer active:scale-95 bg-[#FFF1D6] text-[#7A4A00] border ${
            selectedFilter === 'Follow-up' 
              ? 'border-[#FF5A36] ring-1 ring-[#FF5A36]' 
              : 'border-[#E0DED8] hover:border-[#7A4A00]'
          }`}
        >
          Follow-up
        </button>
      </div>

      {/* (E) STUDENT LIST */}
      <div className="bg-white border border-[#ECEAE5] shadow-1 rounded-[14px] divide-y divide-[#ECEAE5] overflow-hidden">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Avatar with status dot */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#FFE7DF] text-[#FF5A36] flex items-center justify-center font-extrabold text-[12px] font-mono shadow-sm">
                    {student.initials}
                  </div>
                  <span 
                    style={{ 
                      backgroundColor: student.status === 'online' ? '#19A974' : student.status === 'away' ? '#F59E0B' : '#A8A59C' 
                    }}
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white shadow-sm font-sans"
                  />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[14px] font-bold text-[#0E0D0B] block leading-none">
                      {student.name}
                    </span>
                    {student.isCR && (
                      <span className="bg-[#0E0D0B] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none">
                        CR
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#75726A] font-medium font-mono block mt-1">
                    {student.roll}
                  </span>
                </div>
              </div>

              {/* Right metadata columns */}
              <div className="text-right shrink-0">
                <span className="text-[12px] font-bold text-[#0E0D0B] font-mono block">
                  {student.bus}
                </span>
                <span className={`text-[11px] font-mono block mt-0.5 ${getActiveTextClass(student.lastActive)}`}>
                  {student.lastActive}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-[#75726A]">
            No matching students found in Sweden-M 46 registry database
          </div>
        )}
      </div>
    </div>
  );
}
