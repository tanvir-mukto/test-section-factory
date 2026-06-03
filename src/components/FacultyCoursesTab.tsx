import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, BookOpen, Presentation, FileText, Link2, 
  Trash2, Upload, Plus, Check, ClipboardCheck, X, Ban, 
  ChevronRight, Calendar, Users, Star, Info, CheckCheck, FileMinus
} from 'lucide-react';

interface CourseNode {
  code: string;
  name: string;
  types: string[];
  sectionsCount: number;
  studentsCount: number;
  hoursPerWeek: number;
  sections: string[];
}

const COURSES_MOCK: CourseNode[] = [
  { code: 'SE131', name: 'Data Structure', types: ['Theory', 'Lab'], sectionsCount: 3, studentsCount: 121, hoursPerWeek: 10, sections: ['SWE-M', 'SWE-N', 'SWE-O'] },
  { code: 'SE132', name: 'Lab Data Structure', types: ['Lab'], sectionsCount: 1, studentsCount: 42, hoursPerWeek: 2, sections: ['SWE-M'] }
];

const INITIAL_MATERIALS = [
  { id: 'm1', code: 'SE131', section: 'SWE-M', title: 'Lecture 6 · Trees', type: 'Slides', size: '4.2 MB', date: '2 Jun' },
  { id: 'm2', code: 'SE131', section: 'SWE-M', title: 'BST traversal notes', type: 'Notes', size: '820 KB', date: '2 Jun' },
  { id: 'm3', code: 'SE131', section: 'SWE-M', title: 'MIT 6.006 lecture notes', type: 'Reference', size: 'external', date: '1 Jun' },
  { id: 'm4', code: 'SE131', section: 'SWE-N', title: 'Lecture 6 · Trees', type: 'Slides', size: '4.2 MB', date: '2 Jun' },
  { id: 'm5', code: 'SE131', section: 'SWE-N', title: 'Lab 4 manual · Stacks', type: 'Lab manual', size: '1.1 MB', date: '28 May' },
  { id: 'm6', code: 'SE131', section: 'SWE-O', title: 'Lecture 6 · Trees', type: 'Slides', size: '4.2 MB', date: '2 Jun' },
  { id: 'm7', code: 'SE131', section: 'SWE-O', title: 'Lab 5 manual · Queues', type: 'Lab manual', size: '950 KB', date: '5 Jun' },
  { id: 'm8', code: 'SE132', section: 'SWE-M', title: 'Lab 4 manual · Stacks', type: 'Lab manual', size: '1.1 MB', date: '28 May' }
];

const INITIAL_QUIZZES = [
  { id: 'q1', code: 'SE131', section: 'SWE-M', title: 'Quiz 3 · Trees & BST', date: 'Sun 14 Jun', time: '10:00 am', marks: 15, status: 'Scheduled' },
  { id: 'q2', code: 'SE131', section: 'SWE-N', title: 'Quiz 3 · Trees & BST', date: 'Mon 15 Jun', time: '02:00 pm', marks: 15, status: 'Scheduled' },
  { id: 'q3', code: 'SE131', section: 'SWE-M', title: 'Quiz 2 · Linked lists', date: 'Sat 31 May', time: '09:30 am', marks: 30, status: 'Grading', gradedCount: 18 },
  { id: 'q4', code: 'SE131', section: 'SWE-M', title: 'Quiz 1 · Arrays', date: 'Sat 24 May', time: '09:30 am', marks: 30, status: 'Graded', gradedCount: 42 }
];

const INITIAL_ASSIGNMENTS = [
  { id: 'a1', code: 'SE131', section: 'SWE-M', title: 'Assignment 4 · Hash tables', due: 'Sun 14 Jun', submitted: 28, status: 'Open', toGrade: 28 },
  { id: 'a2', code: 'SE131', section: 'SWE-N', title: 'Assignment 4 · Hash tables', due: 'Tue 16 Jun', submitted: 22, status: 'Open', toGrade: 22 },
  { id: 'a3', code: 'SE131', section: 'SWE-M', title: 'Assignment 3 · Recursion', due: 'Closed 4 Jun', submitted: 41, status: 'Closed', toGrade: 5 }
];

interface CoursesTabProps {
  onTriggerToast: (msg: string) => void;
  onNavigateToSectionRoster: (sectionName: string, coursesTeaching: string) => void;
  preselectedCourse?: string | null;
  onClearedPreselectedCourse?: () => void;
}

export default function FacultyCoursesTab({ onTriggerToast, onNavigateToSectionRoster, preselectedCourse, onClearedPreselectedCourse }: CoursesTabProps) {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<'Schedule' | 'Materials' | 'Quizzes' | 'Assignments' | 'Roster'>('Schedule');

  // Multi-state tables
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  // Subfilters inside course page
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [quizStatusFilter, setQuizStatusFilter] = useState<'Upcoming' | 'Past'>('Upcoming');

  // Subsheets tracers
  const [activeCourseSheet, setActiveCourseSheet] = useState<'upload' | 'quiz' | 'assignment' | null>(null);
  const [materialsTrashTargetSet, setMaterialsTrashTargetSet] = useState<any | null>(null);

  // Upload Form factors
  const [uploadSelectedSections, setUploadSelectedSections] = useState<string[]>([]);
  const [uploadType, setUploadType] = useState<string>('Slides');
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [simulatedFile, setSimulatedFile] = useState<any | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadingProgressTriggered, setIsUploadingProgressTriggered] = useState(false);

  // Last dismissed draft state container for UNDO loop
  const [lastDiscardedDraft, setLastDiscardedDraft] = useState<any | null>(null);

  // Quiz Form items
  const [newQuizSections, setNewQuizSections] = useState<string[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState<string>('');
  const [newQuizDate, setNewQuizDate] = useState<string>('');
  const [newQuizTime, setNewQuizTime] = useState<string>('10:00 am');
  const [newQuizMarks, setNewQuizMarks] = useState<string>('15');

  // Assignment Form factors
  const [newAssignSections, setNewAssignSections] = useState<string[]>([]);
  const [newAssignTitle, setNewAssignTitle] = useState<string>('');
  const [newAssignDueDate, setNewAssignDueDate] = useState<string>('');

  // Handle preselection
  useEffect(() => {
    if (preselectedCourse) {
      setActiveCourseId(preselectedCourse);
      setSelectedSubTab('Schedule');
      if (onClearedPreselectedCourse) onClearedPreselectedCourse();
    }
  }, [preselectedCourse]);

  // Suggest title helpers on Type select change
  useEffect(() => {
    if (!uploadTitle) {
      if (uploadType === 'Slides') {
        const nextSlideNum = materials.filter(m => m.code === activeCourseId && m.type === 'Slides').length + 1;
        // set temporary suggestion in state placeholder passive
      }
    }
  }, [uploadType, activeCourseId]);

  const activeCourseNode = COURSES_MOCK.find(c => c.code === activeCourseId);

  // Filter styles helper mapping
  const getSectionColorStyle = (sect: string) => {
    if (sect === 'SWE-M') return 'bg-[#FFF4F0] text-[#FF5A36] border-[#FFE7DF]';
    if (sect === 'SWE-N') return 'bg-[#E5EFFE] text-[#1B4B9E] border-[#C2EAD5]/10';
    return 'bg-[#FFF1D6] text-[#7A4A00] border-[#FFD9CD]/10';
  };

  const getSectionDotColor = (sect: string) => {
    if (sect === 'SWE-M') return 'bg-[#FF5A36]';
    if (sect === 'SWE-N') return 'bg-[#2E7CF6]';
    return 'bg-[#FFB020]';
  };

  // Upload Progress simulator trigger
  const handlePerformSimulatedUpload = () => {
    if (uploadSelectedSections.length === 0) {
      onTriggerToast('Pick at least one section');
      return;
    }
    if (!uploadTitle.trim()) {
      onTriggerToast('Add a title');
      return;
    }
    if (!simulatedFile) {
      onTriggerToast('Choose a file to upload');
      return;
    }

    setIsUploadingProgressTriggered(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          // perform integration list insert
          const newEntries = uploadSelectedSections.map(sect => ({
            id: `usr_${Date.now()}_${sect}`,
            code: activeCourseId || 'SE131',
            section: sect,
            title: uploadTitle,
            type: uploadType,
            size: simulatedFile.size,
            date: 'Just now'
          }));
          
          setMaterials(old => [...newEntries, ...old]);
          
          // Compute student count multiplier
          const scopeCount = uploadSelectedSections.reduce((acc, curr) => {
            if (curr === 'SWE-M') return acc + 42;
            if (curr === 'SWE-N') return acc + 38;
            return acc + 41;
          }, 0);

          onTriggerToast(`Uploaded to ${uploadSelectedSections.join(', ')} · ${scopeCount} students notified`);
          
          // Done resetters
          handleResetUploadFields(false);
          return 100;
        }
        return oldProgress + 20;
      });
    }, 150);
  };

  const handleResetUploadFields = (withResetData = true) => {
    if (withResetData) {
      // capture values inside a draft before clean
      if (uploadTitle.trim() || uploadDescription.trim() || simulatedFile) {
        setLastDiscardedDraft({
          uploadSelectedSections,
          uploadType,
          uploadTitle,
          uploadDescription,
          simulatedFile
        });
        onTriggerToast('Draft discarded · Undo');
      }
    }
    setUploadSelectedSections([]);
    setUploadType('Slides');
    setUploadTitle('');
    setUploadDescription('');
    setSimulatedFile(null);
    setUploadProgress(0);
    setIsUploadingProgressTriggered(false);
    setActiveCourseSheet(null);
  };

  // Undo triggers
  const handleResponsiveUndoDraftRestore = () => {
    if (lastDiscardedDraft) {
      setUploadSelectedSections(lastDiscardedDraft.uploadSelectedSections);
      setUploadType(lastDiscardedDraft.uploadType);
      setUploadTitle(lastDiscardedDraft.uploadTitle);
      setUploadDescription(lastDiscardedDraft.uploadDescription);
      setSimulatedFile(lastDiscardedDraft.simulatedFile);
      setLastDiscardedDraft(null);
      setActiveCourseSheet('upload');
      onTriggerToast('Upload draft restored');
    }
  };

  // Submit New Quiz
  const handleSubmitQuizPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuizSections.length === 0) {
      onTriggerToast('Pick at least one section');
      return;
    }
    if (!newQuizTitle.trim()) {
      onTriggerToast('Add a title');
      return;
    }
    if (!newQuizDate.trim()) {
      onTriggerToast('Pick a date');
      return;
    }

    const quizAdds = newQuizSections.map(sect => ({
      id: `qz_${Date.now()}_${sect}`,
      code: activeCourseId || 'SE131',
      section: sect,
      title: newQuizTitle,
      date: newQuizDate,
      time: newQuizTime,
      marks: parseInt(newQuizMarks) || 15,
      status: 'Scheduled'
    }));

    setQuizzes(old => [...quizAdds, ...old]);
    setNewQuizSections([]);
    setNewQuizTitle('');
    setNewQuizDate('');
    setActiveCourseSheet(null);
    onTriggerToast(`Quiz scheduled · ${newQuizSections.join(', ')}`);
  };

  // Submit New Assignment
  const handleSubmitNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignSections.length === 0) {
      onTriggerToast('Pick at least one section');
      return;
    }
    if (!newAssignTitle.trim()) {
      onTriggerToast('Add a title');
      return;
    }
    if (!newAssignDueDate.trim()) {
      onTriggerToast('Pick a due date');
      return;
    }

    const taskAdds = newAssignSections.map(sect => ({
      id: `asg_${Date.now()}_${sect}`,
      code: activeCourseId || 'SE131',
      section: sect,
      title: newAssignTitle,
      due: `Due ${newAssignDueDate}`,
      submitted: 0,
      status: 'Open',
      toGrade: sect === 'SWE-M' ? 42 : sect === 'SWE-N' ? 38 : 41
    }));

    setAssignments(old => [...taskAdds, ...old]);
    setNewAssignSections([]);
    setNewAssignTitle('');
    setNewAssignDueDate('');
    setActiveCourseSheet(null);
    onTriggerToast(`Assignment posted · ${newAssignSections.length} sections notified`);
  };

  const getDayRoutineSlotsForCourse = (dayName: string): any[] => {
    // Return all static timetable items for this course + day
    const slots = [];
    if (activeCourseId === 'SE131') {
      if (dayName === 'Sat') {
        slots.push({ id: 'cs1', section: 'SWE-O', room: 'Room 411', time: '9:00 am – 10:30 am', type: 'Theory' });
        slots.push({ id: 'cs2', section: 'SWE-N', room: 'Room 308', time: '11:00 am – 12:30 pm', type: 'Theory' });
      }
      if (dayName === 'Sun') {
        slots.push({ id: 'cs3', section: 'SWE-O', room: 'Lab-5', time: '8:30 am – 10:00 am', type: 'Lab' });
      }
      if (dayName === 'Tue') {
        slots.push({ id: 'cs4', section: 'SWE-M', room: 'Room 1504', time: '9:00 am – 10:30 am', type: 'Theory' });
        slots.push({ id: 'cs5', section: 'SWE-N', room: 'Lab-3', time: '11:00 am – 12:30 pm', type: 'Lab' });
      }
      if (dayName === 'Wed') {
        slots.push({ id: 'cs6', section: 'SWE-M', room: 'Room 1504', time: '10:00 am – 11:30 am', type: 'Theory' });
      }
    } else {
      // SE132
      if (dayName === 'Sun') {
        slots.push({ id: 'cs7', section: 'SWE-M', room: 'Room 710', time: '10:00 am – 11:30 am', type: 'Lab' });
      }
      if (dayName === 'Wed') {
        slots.push({ id: 'cs8', section: 'SWE-M', room: 'Room 710', time: '8:30 am – 10:00 am', type: 'Lab' });
        slots.push({ id: 'cs9', section: 'SWE-M', room: 'Room AB3-106', time: '1:00 pm – 2:30 pm', type: 'Lab' });
      }
    }
    return slots;
  };

  return (
    <div className="select-none font-sans text-left">
      <AnimatePresence mode="wait">
        {!activeCourseId ? (
          /* COURSE LIST PANEL */
          <motion.div
            key="course-list-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-[16px]"
          >
            {/* Header */}
            <div className="pb-2 border-b border-[#ECEAE5]">
              <h1 className="text-[32px] font-extrabold text-ink-900 tracking-tight leading-none">Courses</h1>
              <p className="font-mono text-[12px] text-ink-500 font-semibold mt-2">
                Dr. NSL &middot; 2 courses &middot; Summer 2026
              </p>
            </div>

            {/* Courses listing */}
            <div className="space-y-3">
              {COURSES_MOCK.map((crs) => (
                <div
                  key={crs.code}
                  onClick={() => {
                    setActiveCourseId(crs.code);
                    setSelectedSubTab('Schedule');
                  }}
                  className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-[16px] cursor-pointer active:scale-[0.97] transition-all duration-120"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-base font-extrabold text-ink-900 tracking-tight">{crs.code}</span>
                    <div className="flex gap-1.5">
                      {crs.types.map(t => (
                        <span key={t} className={`text-[9px] font-bold uppercase rounded px-1.5 py-[1.5px] ${
                          t === 'Theory' ? 'bg-ink-100 text-ink-700' : 'bg-[#E5EFFE] text-[#1B4B9E]'
                        }`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-ink-900 mt-[6px] tracking-tight">{crs.name}</h3>

                  {/* Stats Grid rows */}
                  <div className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-[#FAFAF9]">
                    <div>
                      <div className="font-mono text-[13.5px] font-bold text-ink-900">{crs.sectionsCount} sections</div>
                      <div className="text-[10px] text-ink-400 font-bold uppercase mt-0.5">ACROSS</div>
                    </div>
                    <div>
                      <div className="font-mono text-[13.5px] font-bold text-ink-900">{crs.studentsCount} students</div>
                      <div className="text-[10px] text-ink-400 font-bold uppercase mt-0.5">TOTAL REACH</div>
                    </div>
                    <div>
                      <div className="font-mono text-[13.5px] font-bold text-ink-900">{crs.hoursPerWeek} hrs/wk</div>
                      <div className="text-[10px] text-ink-400 font-bold uppercase mt-0.5">TEACHING</div>
                    </div>
                  </div>

                  {/* Section Badges */}
                  <div className="flex gap-1.5 flex-wrap mt-[12px]">
                    {crs.sections.map(sec => (
                      <span key={sec} className={`px-2 py-[2.5px] font-mono text-[10px] font-bold uppercase rounded-[5px] ${
                        sec === 'SWE-M' ? 'bg-[#FFF4F0] text-[#FF5A36]' : sec === 'SWE-N' ? 'bg-[#E5EFFE] text-[#1B4B9E]' : 'bg-[#FFF1D6] text-[#7A4A00]'
                      }`}>
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Float restoration UNDO banner for materials */}
            {lastDiscardedDraft && (
              <div className="bg-[#0E0D0B] text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-4 mt-2">
                <span>Upload draft discarded</span>
                <button 
                  onClick={handleResponsiveUndoDraftRestore}
                  className="text-[#FF5A36] bg-transparent border-none font-bold hover:underline cursor-pointer"
                >
                  Undo
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* COURSE DETAIL INTEGRATED TABBED PORTAL */
          <motion.div
            key="course-detail-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-[16px]"
          >
            {/* Detail Header back-to */}
            <div className="flex items-start justify-between pb-2 border-b border-[#ECEAE5]">
              <div className="flex items-start gap-1">
                <button
                  onClick={() => setActiveCourseId(null)}
                  className="w-9 h-9 hover:bg-ink-100 rounded-full flex items-center justify-center text-ink-900 -ml-1 cursor-pointer border-none bg-transparent"
                >
                  <ChevronLeft size={22} />
                </button>
                <div>
                  <h1 className="text-[22px] font-extrabold text-ink-900 tracking-tight leading-tight">
                    {activeCourseNode?.code} &middot; {activeCourseNode?.name}
                  </h1>
                  <p className="font-mono text-xs text-ink-500 font-semibold mt-0.5">
                    {activeCourseNode?.sectionsCount} sections &middot; {activeCourseNode?.studentsCount} students
                  </p>
                </div>
              </div>

              {/* Dynamic trigger button per SubTab option */}
              {selectedSubTab === 'Materials' && (
                <button 
                  onClick={() => {
                    setUploadSelectedSections(selectedSectionFilter === 'all' ? [] : [selectedSectionFilter]);
                    setActiveCourseSheet('upload');
                  }}
                  className="bg-[#FF5A36] text-white text-[11.5px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow shrink-0 border-none flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Upload size={12} />
                  <span>+ Upload</span>
                </button>
              )}
              {selectedSubTab === 'Quizzes' && (
                <button 
                  onClick={() => {
                    setNewQuizSections(selectedSectionFilter === 'all' ? [] : [selectedSectionFilter]);
                    setActiveCourseSheet('quiz');
                  }}
                  className="bg-[#FF5A36] text-white text-[11.5px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow shrink-0 border-none flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus size={13} />
                  <span>+ Schedule</span>
                </button>
              )}
              {selectedSubTab === 'Assignments' && (
                <button
                  onClick={() => {
                    setNewAssignSections(selectedSectionFilter === 'all' ? [] : [selectedSectionFilter]);
                    setActiveCourseSheet('assignment');
                  }}
                  className="bg-[#FF5A36] text-white text-[11.5px] font-bold py-1.5 px-3 rounded-full shadow-coral-glow shrink-0 border-none flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus size={13} />
                  <span>+ New</span>
                </button>
              )}
            </div>

            {/* STICKY TAB STRIP CONTAINER */}
            <div className="bg-ink-100 p-1 rounded-full flex overflow-x-auto no-scrollbar gap-1">
              {(['Schedule', 'Materials', 'Quizzes', 'Assignments', 'Roster'] as const).map((tab) => {
                const isActive = selectedSubTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setSelectedSubTab(tab);
                      setSelectedSectionFilter('all');
                    }}
                    className={`flex-1 py-1 px-2.5 text-center text-xs font-bold rounded-full border-none transition-all cursor-pointer whitespace-nowrap ${
                      isActive ? 'bg-white text-ink-900 shadow-sm' : 'bg-transparent text-ink-500 font-medium'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* SECTION SELECT FILTER CHIPS for detail panels (excluding Roster, because roster uses cards) */}
            {selectedSubTab !== 'Roster' && activeCourseNode && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => setSelectedSectionFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border cursor-pointer ${
                    selectedSectionFilter === 'all' ? 'bg-ink-900 text-white border-ink-900' : 'bg-white border-[#E0DED8] text-ink-700'
                  }`}
                >
                  All sections
                </button>
                {activeCourseNode.sections.map((secName) => {
                  const isSectActive = selectedSectionFilter === secName;
                  let selectedSectStyle = 'bg-ink-900 text-white border-ink-900';
                  if (isSectActive && secName === 'SWE-M') selectedSectStyle = 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36]';
                  if (isSectActive && secName === 'SWE-N') selectedSectStyle = 'bg-[#E5EFFE] border-[#1B4B9E] text-[#1B4B9E]';
                  if (isSectActive && secName === 'SWE-O') selectedSectStyle = 'bg-[#FFF1D6] border-[#7A4A00] text-[#7A4A00]';

                  return (
                    <button
                      key={secName}
                      onClick={() => setSelectedSectionFilter(secName)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 border cursor-pointer ${
                        isSectActive ? selectedSectStyle : 'bg-white border-[#E0DED8] text-ink-700'
                      }`}
                    >
                      {secName}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENTS PANELS */}
            <div className="pt-2">

              {/* 1. SCHEDULE SUBTAB */}
              {selectedSubTab === 'Schedule' && (
                <div className="space-y-[16px]">
                  {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dayKey) => {
                    const daySlots = getDayRoutineSlotsForCourse(dayKey).filter(s => selectedSectionFilter === 'all' || s.section === selectedSectionFilter);
                    const isOff = daySlots.length === 0;

                    return (
                      <div key={dayKey} className="text-left">
                        <div className="flex items-center justify-between border-b border-[#ECEAE5] pb-1 px-1 mb-1.5">
                          <span className="text-[11.5px] font-extrabold font-mono tracking-wide text-ink-900 uppercase">
                            {dayKey === 'Sat' ? 'SATURDAY' : dayKey === 'Sun' ? 'SUNDAY' : dayKey === 'Mon' ? 'MONDAY' : dayKey === 'Tue' ? 'TUESDAY' : dayKey === 'Wed' ? 'WEDNESDAY' : dayKey === 'Thu' ? 'THURSDAY' : 'FRIDAY'}
                          </span>
                          <span className="text-[10.5px] font-mono text-ink-500 font-bold">
                            {isOff ? 'No slots' : `${daySlots.length} instances`}
                          </span>
                        </div>

                        {isOff ? (
                          <div className="bg-[#FAFAF9] border border-dashed border-[#ECEAE5] rounded-[10px] p-2 text-center text-xs text-ink-400 italic">
                            No {activeCourseId} classes scheduled
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {daySlots.map(it => (
                              <div
                                key={it.id}
                                onClick={() => onTriggerToast(`Routine slot Details &middot; ${activeCourseId}`)}
                                className="bg-white border border-[#ECEAE5] rounded-[12px] p-3 flex gap-2.5 items-center cursor-pointer hover:border-ink-400 shadow-sm"
                              >
                                <span className="font-mono text-xs font-bold text-[#FF5A36] shrink-0">{it.time.split(' – ')[0]}</span>
                                <span className="w-[1px] h-[14px] bg-ink-200 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`px-1.5 py-[1px] rounded font-mono text-[9px] font-extrabold ${getSectionColorStyle(it.section)}`}>{it.section}</span>
                                    <span className="text-[10px] bg-ink-100 text-ink-700 font-bold font-sans rounded px-1.5 py-0.5">{it.type.toUpperCase()}</span>
                                  </div>
                                </div>
                                <span className="text-[11.5px] font-sans font-bold text-ink-800">Room {it.room.replace('Room ', '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. MATERIALS SUBTAB */}
              {selectedSubTab === 'Materials' && (
                <div className="space-y-4">
                  {/* File groups logic: 
                      If selectedSectionFilter === 'all', group by SECTION.
                      If specific section active, group by TYPE. */}
                  {(() => {
                    const scopedFiles = materials.filter(m => m.code === activeCourseId && (selectedSectionFilter === 'all' || m.section === selectedSectionFilter));
                    
                    if (scopedFiles.length === 0) {
                      return (
                        <div className="bg-white rounded-[14px] border border-[#ECEAE5] p-8 text-center flex flex-col items-center justify-center gap-1.5 shadow-1">
                          <FileMinus size={28} className="text-ink-400" />
                          <span className="text-sm font-bold text-ink-900 leading-none">No materials uploaded yet</span>
                          <span className="text-[11.5px] text-ink-500 mt-1 max-w-[280px]">Tap Upload to share slides, notes, or PDFs with your section.</span>
                        </div>
                      );
                    }

                    if (selectedSectionFilter === 'all') {
                      // Group by section
                      const sectionsList = activeCourseNode?.sections || [];
                      return sectionsList.map(sect => {
                        const sFiles = scopedFiles.filter(f => f.section === sect);
                        if (sFiles.length === 0) return null;
                        return (
                          <div key={sect} className="space-y-2">
                            <div className="flex items-center gap-1.5 border-l-[3px] pl-2" style={{ borderLeftColor: sect === 'SWE-M' ? '#FF5A36' : sect === 'SWE-N' ? '#2E7CF6' : '#FFB020' }}>
                              <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-ink-900">{sect}</span>
                              <span className="text-[10px] text-ink-400 font-bold font-mono">&middot; {sFiles.length} FILES</span>
                            </div>

                            <div className="space-y-2">
                              {sFiles.map(file => (
                                <div
                                  key={file.id}
                                  onClick={() => onTriggerToast(`Open file: ${file.title}`)}
                                  className="bg-white rounded-[12px] border border-[#ECEAE5] shadow-sm p-3.5 flex items-center gap-3.5 cursor-pointer active:scale-[0.99]"
                                >
                                  {/* Type icon wrapper */}
                                  <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${
                                    file.type === 'Slides' ? 'bg-[#FFF4F0] text-[#FF5A36]' :
                                    file.type === 'Notes' ? 'bg-[#FFF9EC] text-[#7A4A00]' : 'bg-[#E5EFFE] text-[#1B4B9E]'
                                  }`}>
                                    {file.type === 'Slides' && <Presentation size={18} />}
                                    {file.type === 'Notes' && <FileText size={18} />}
                                    {(file.type === 'Reference' || file.type === 'Lab manual') && <Link2 size={18} />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-extrabold text-ink-900 leading-tight truncate">{file.title}</h4>
                                    <p className="font-mono text-[10.5px] text-ink-500 mt-1 leading-none">
                                      {file.type} &middot; {file.size} &middot; {file.date}
                                    </p>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMaterialsTrashTargetSet(file);
                                    }}
                                    className="w-8 h-8 rounded-full hover:bg-ink-100 flex items-center justify-center text-ink-400 hover:text-red-500 shrink-0 border-none bg-transparent cursor-pointer"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    } else {
                      // Group by Type (Slides, Notes, Reference, Lab manual)
                      const typesList = ['Slides', 'Notes', 'Reference', 'Lab manual'];
                      return typesList.map(tGroup => {
                        const tFiles = scopedFiles.filter(f => f.type === tGroup);
                        if (tFiles.length === 0) return null;
                        return (
                          <div key={tGroup} className="space-y-2">
                            <span className="font-mono text-[11px] font-extrabold uppercase tracking-wide text-ink-500 block">
                              {tGroup.toUpperCase()} &middot; {tFiles.length} FILES
                            </span>

                            <div className="space-y-2">
                              {tFiles.map(file => (
                                <div
                                  key={file.id}
                                  onClick={() => onTriggerToast(`Open file: ${file.title}`)}
                                  className="bg-white rounded-[12px] border border-[#ECEAE5] shadow-sm p-3... py-3 px-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99]"
                                >
                                  {/* Section badge dot */}
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getSectionDotColor(file.section)}`} />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-bold text-ink-900 leading-snug truncate">{file.title}</h4>
                                    <p className="font-mono text-[10px] text-ink-500 mt-0.5 leading-none">
                                      {file.section} &middot; {file.size} &middot; {file.date}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMaterialsTrashTargetSet(file);
                                    }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-red-500 hover:bg-ink-100 border-none bg-transparent cursor-pointer shrink-0"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    }
                  })()}
                </div>
              )}

              {/* 3. QUIZZES SUBTAB */}
              {selectedSubTab === 'Quizzes' && (
                <div className="space-y-4 text-left">
                  {/* Segment toggle status */}
                  <div className="bg-ink-100 p-1 rounded-full flex select-none">
                    {['Upcoming', 'Past'].map(st => (
                      <button
                        key={st}
                        onClick={() => setQuizStatusFilter(st as any)}
                        className={`flex-1 py-1 text-center text-xs font-bold rounded-full border-none transition-all cursor-pointer ${
                          quizStatusFilter === st ? 'bg-white text-ink-900 shadow-sm' : 'bg-transparent text-ink-500 font-medium'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Quizzes cards */}
                  {(() => {
                    const scopedQuizzes = quizzes.filter(q => q.code === activeCourseId && (selectedSectionFilter === 'all' || q.section === selectedSectionFilter));
                    const filteredList = scopedQuizzes.filter(q => {
                      if (quizStatusFilter === 'Upcoming') return q.status === 'Scheduled';
                      return q.status === 'Grading' || q.status === 'Graded';
                    });

                    if (filteredList.length === 0) {
                      return (
                        <p className="text-xs text-ink-400 text-center select-none py-4 italic font-sans">
                          No {quizStatusFilter.toLowerCase()} quizzes found.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {filteredList.map(qz => (
                          <div key={qz.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 space-y-2 select-none">
                            <div className="flex justify-between items-start">
                              <span className={`px-1.5 py-[1px] rounded font-mono text-[9px] font-extrabold ${getSectionColorStyle(qz.section)}`}>
                                {qz.section}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide leading-none ${
                                qz.status === 'Scheduled' ? 'bg-[#E5EFFE] text-[#1B4B9E]' :
                                qz.status === 'Grading' ? 'bg-[#FFF4DB] text-[#8A5A00]' : 'bg-[#E5F7EE] text-[#0F6B43]'
                              }`}>
                                {qz.status}
                              </span>
                            </div>

                            <h4 className="text-xs font-extrabold text-ink-900 leading-snug">{qz.title}</h4>
                            
                            <div className="flex items-center gap-1 text-[11px] font-mono text-ink-500">
                              <Calendar size={12} className="shrink-0" />
                              <span>{qz.date} &middot; {qz.time} &middot; {qz.marks} marks</span>
                            </div>

                            {quizStatusFilter === 'Past' && (
                              <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5] text-[11px]">
                                <span className="font-mono font-semibold text-ink-500">{qz.gradedCount || 42}/42 graded</span>
                                <div>
                                  {qz.status === 'Grading' ? (
                                    <button
                                      onClick={() => {
                                        setQuizzes(old => old.map(q => q.id === qz.id ? { ...q, status: 'Graded', gradedCount: 42 } : q));
                                        onTriggerToast(`Grades published · ${qz.code} ${qz.title}`);
                                      }}
                                      className="bg-[#FF5A36] select-none text-white font-sans text-[11px] font-bold py-1 px-2.5 rounded-full shadow-coral-glow border-none cursor-pointer"
                                    >
                                      Publish grades
                                    </button>
                                  ) : (
                                    <span className="text-[#0F6B43] font-bold font-sans inline-flex items-center gap-0.5">
                                      <Check size={12} /> Published
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 4. ASSIGNMENTS SUBTAB */}
              {selectedSubTab === 'Assignments' && (
                <div className="space-y-3">
                  {(() => {
                    const scopedAss = assignments.filter(a => a.code === activeCourseId && (selectedSectionFilter === 'all' || a.section === selectedSectionFilter));
                    
                    if (scopedAss.length === 0) {
                      return (
                        <p className="text-xs text-ink-400 text-center select-none py-4 italic font-sans">
                          No assignments currently.
                        </p>
                      );
                    }

                    return scopedAss.map(as => {
                      const totalStudents = as.section === 'SWE-M' ? 42 : as.section === 'SWE-N' ? 38 : 41;
                      const isOpened = as.status === 'Open';

                      return (
                        <div key={as.id} className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 space-y-2 select-none text-left">
                          <div className="flex justify-between items-start">
                            <span className={`px-1.5 py-[1px] rounded font-mono text-[9px] font-extrabold ${getSectionColorStyle(as.section)}`}>
                              {as.section}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wide leading-none ${
                              isOpened ? 'bg-[#FFF4F0] text-[#FF5A36]' : 'bg-[#E8E7E3] text-ink-700'
                            }`}>
                              {as.status}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-ink-900 leading-snug">{as.title}</h4>
                          <p className="font-mono text-[10.5px] text-ink-500 font-semibold">{as.due}</p>

                          {/* Submission Slider details */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-[#75726A]">
                              <span>Submission rate</span>
                              <span>{as.submitted}/{totalStudents}</span>
                            </div>
                            <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                              <div className="bg-[#FF5A36] h-full" style={{ width: `${(as.submitted / totalStudents) * 100}%` }} />
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#ECEAE5] text-[11px]">
                            <span className={`font-semibold ${as.toGrade > 0 ? 'text-[#8A5A00]' : 'text-ink-500'}`}>
                              {as.toGrade > 0 ? `${as.toGrade} to grade` : 'All graded'}
                            </span>
                            <button
                              onClick={() => onTriggerToast(`${as.submitted} submissions · ${as.code}`)}
                              className="bg-white border border-[#E0DED8] text-ink-900 font-sans text-[11px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 active:scale-95 duration-120 cursor-pointer"
                            >
                              <FileText size={12} />
                              <span>Review submissions</span>
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* 5. ROSTER SUBTAB */}
              {selectedSubTab === 'Roster' && activeCourseNode && (
                <div className="space-y-3 text-left">
                  {activeCourseNode.sections.map((sectName) => {
                    // Sim values for each section card
                    let size = 42;
                    let att = 94;
                    let quizScore = 78;

                    if (sectName === 'SWE-N') { size = 38; att = 89; quizScore = 82; }
                    if (sectName === 'SWE-O') { size = 41; att = 92; quizScore = 75; }

                    return (
                      <div
                        key={sectName}
                        onClick={() => onNavigateToSectionRoster(sectName, `${activeCourseId} Theory, ${activeCourseId} Lab`)}
                        className="bg-white rounded-[14px] border border-[#ECEAE5] shadow-1 p-3.5 flex gap-3.5 items-stretch cursor-pointer active:scale-[0.99] hover:border-ink-400"
                      >
                        {/* Section highlight anchor color card bar left */}
                        <div className="w-1 rounded-sm shrink-0" style={{ backgroundColor: getSectionDotColor(sectName) }} />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-extrabold text-ink-900 leading-none">{sectName}</h4>
                          <p className="text-[12px] text-ink-500 font-medium mt-1 leading-none">
                            {size} students &middot; {activeCourseId} Assignment, quiz metrics
                          </p>

                          <div className="flex items-center gap-4 text-[11px] font-mono text-[#75726A] mt-3">
                            <span className="flex items-center gap-1"><Users size={12} /> Avg Attendance: {att}%</span>
                            <span className="flex items-center gap-1"><Star size={12} /> Avg Quiz: {quizScore}%</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-center p-1 text-ink-400">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RISING PORTALS DIALOG BOTTOM SHEETS */}
      <AnimatePresence>
        {activeCourseSheet && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end select-none font-sans overflow-hidden">
            {/* Dark Scrim overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
              onClick={() => {
                if (activeCourseSheet === 'upload') handleResetUploadFields(true);
                else setActiveCourseSheet(null);
              }}
            />

            {/* Rising Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, cubicBezier: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-w-lg mx-auto bg-white rounded-t-[28px] max-h-[85%] overflow-y-auto no-scrollbar shadow-4 flex flex-col z-10 text-left pb-10"
            >
              <div className="w-[40px] h-[4px] bg-[#D4D2CC] rounded-full mx-auto my-2.5 shrink-0" />

              {/* A. UPLOAD MATERIAL */}
              {activeCourseSheet === 'upload' && (
                <div className="px-5 space-y-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-ink-900 tracking-tight leading-none">Upload material</h2>
                    <p className="font-mono text-[11.5px] text-ink-500 font-semibold mt-1">Shared with picked sections instantly</p>
                  </div>

                  {/* 1. SECTIONS ROW */}
                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase tracking-wide block">Sections (Multi-select)</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                      {activeCourseId === 'SE131' ? (
                        <>
                          {['SWE-M', 'SWE-N', 'SWE-O'].map(sc => {
                            const isIncluded = uploadSelectedSections.includes(sc);
                            let customBadge = 'bg-white border-[#E0DED8] text-ink-800';
                            if (isIncluded && sc === 'SWE-M') customBadge = 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36]';
                            if (isIncluded && sc === 'SWE-N') customBadge = 'bg-[#E5EFFE] border-[#1B4B9E] text-[#1B4B9E]';
                            if (isIncluded && sc === 'SWE-O') customBadge = 'bg-[#FFF1D6] border-[#7A4A00] text-[#7A4A00]';

                            return (
                              <button
                                key={sc}
                                onClick={() => {
                                  if (isIncluded) setUploadSelectedSections(old => old.filter(x => x !== sc));
                                  else setUploadSelectedSections(old => [...old, sc]);
                                }}
                                className={`px-4 py-2 border rounded-full text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${customBadge}`}
                              >
                                {isIncluded && <Check size={12} />}
                                <span>{sc}</span>
                              </button>
                            );
                          })}
                          <button
                            onClick={() => {
                              if (uploadSelectedSections.length === 3) setUploadSelectedSections([]);
                              else setUploadSelectedSections(['SWE-M', 'SWE-N', 'SWE-O']);
                            }}
                            className={`px-3.5 py-2 border rounded-full text-xs font-bold cursor-pointer ${
                              uploadSelectedSections.length === 3 ? 'bg-ink-900 text-white border-ink-900' : 'bg-white border-[#E0DED8] text-ink-700'
                            }`}
                          >
                            All sections
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            if (uploadSelectedSections.includes('SWE-M')) setUploadSelectedSections([]);
                            else setUploadSelectedSections(['SWE-M']);
                          }}
                          className={`px-4 py-2 border rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer ${
                            uploadSelectedSections.includes('SWE-M') ? 'bg-[#FFF4F0] border-[#FF5A36] text-[#FF5A36]' : 'bg-white border-[#E0DED8] text-[#1b1a18]'
                          }`}
                        >
                          {uploadSelectedSections.includes('SWE-M') && <Check size={12} />}
                          <span>SWE-M</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. TYPE ROW */}
                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase tracking-wide block">Type (Single-select)</span>
                    <div className="flex gap-2">
                      {['Slides', 'Notes', 'Reference', 'Lab manual'].map(tp => {
                        const isTpActive = uploadType === tp;
                        return (
                          <button
                            key={tp}
                            onClick={() => setUploadType(tp)}
                            className={`px-3.5 py-2 rounded-full border text-xs font-extrabold shrink-0 cursor-pointer ${
                              isTpActive ? 'bg-[#FFE7DF] text-[#FF5A36] border-[#FF5A36]' : 'bg-white border-[#E0DED8] text-ink-700'
                            }`}
                          >
                            {tp}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. TITLE INPUT */}
                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase tracking-wide block">Title</span>
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value.slice(0, 80))}
                      placeholder={uploadType === 'Slides' ? 'e.g. Lecture 7 · Heaps' : uploadType === 'Lab manual' ? 'e.g. Lab 4 manual · Stacks' : 'Add slides title'}
                      className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-semibold rounded-xl text-ink-900 focus:border-[#FF5A36] outline-none"
                    />
                  </div>

                  {/* 4. FILE UPLOADER TARGET SPLIT */}
                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase tracking-wide block">Upload File</span>
                    {!simulatedFile ? (
                      <div
                        onClick={() => {
                          onTriggerToast('File picker (demo)');
                          setSimulatedFile({ name: `${uploadTitle || 'Trees'}.pdf`, size: '2.4 MB' });
                        }}
                        className="border-2 border-dashed border-[#D4D2CC] rounded-xl p-5 text-center flex flex-col items-center justify-center gap-1 cursor-pointer bg-[#FAFAF9] hover:border-[#FF5A36]"
                      >
                        <div className="w-[38px] h-[38px] bg-[#FFE7DF] text-[#FF5A36] rounded-full flex items-center justify-center mb-1">
                          <Upload size={16} />
                        </div>
                        <span className="text-xs font-semibold text-ink-800">Tap to choose a PDF or image</span>
                        <span className="text-[10px] text-ink-400 mt-0.5">Max 25 MB &middot; PDF, PNG, JPG</span>
                      </div>
                    ) : (
                      <div className="border border-[#ECEAE5] rounded-xl p-3.5 flex items-center justify-between bg-white relative overflow-hidden">
                        {isUploadingProgressTriggered && (
                          <div className="absolute top-0 left-0 bg-[#FFD9CD] h-1 transition-all" style={{ width: `${uploadProgress}%` }} />
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-[32px] h-[32px] bg-green-500/10 text-green-600 rounded-full flex items-center justify-center shrink-0">
                            <Check size={16} />
                          </div>
                          <div>
                            <span className="block text-xs font-extrabold text-ink-900 truncate max-w-[190px]">{simulatedFile.name}</span>
                            <span className="font-mono text-[10px] text-ink-400 font-semibold">{simulatedFile.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSimulatedFile(null)}
                          className="bg-transparent text-[#FF5A36] font-sans text-xs font-semibold border-none cursor-pointer hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 5. DESCRIPTION */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#75726A]">
                      <span className="font-sans text-[11.5px] font-extrabold uppercase tracking-wide">Description (Optional)</span>
                      <span className="font-mono text-[10.5px] font-semibold">{uploadDescription.length}/200</span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={200}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Add notes for students — when to read, what to focus on..."
                      className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-medium rounded-xl text-ink-900 focus:border-[#FF5A36] outline-none"
                    />
                  </div>

                  {/* Sticky rising executor footer buttons */}
                  <div className="flex items-center justify-between border-t border-[#ECEAE5] pt-3 bg-white">
                    <button
                      onClick={() => handleResetUploadFields(true)}
                      className="bg-transparent border border-[#E0DED8] px-5 py-2.5 rounded-full text-xs font-bold text-ink-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePerformSimulatedUpload}
                      disabled={uploadSelectedSections.length === 0 || !uploadTitle.trim() || !simulatedFile || isUploadingProgressTriggered}
                      className={`text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1 border-none cursor-pointer text-white shadow-coral-glow ${
                        uploadSelectedSections.length > 0 && uploadTitle.trim() && simulatedFile && !isUploadingProgressTriggered
                          ? 'bg-[#FF5A36]'
                          : 'bg-coral-100 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      <Upload size={13} />
                      <span>{isUploadingProgressTriggered ? `Uploading (${uploadProgress}%)` : 'Upload'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* B. QUIZ SCHEDULE SHEET */}
              {activeCourseSheet === 'quiz' && (
                <form onSubmit={handleSubmitQuizPublish} className="px-5 space-y-4 font-sans text-left">
                  <div>
                    <h2 className="text-xl font-extrabold text-ink-900 tracking-tight leading-none">Schedule a quiz</h2>
                    <p className="font-mono text-[11.5px] text-ink-500 mt-1">Students are notified on publish</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Sections</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 select-none">
                      {activeCourseNode?.sections.map(scName => {
                        const isInc = newQuizSections.includes(scName);
                        return (
                          <button
                            type="button"
                            key={scName}
                            onClick={() => {
                              if (isInc) setNewQuizSections(old => old.filter(x => x !== scName));
                              else setNewQuizSections(old => [...old, scName]);
                            }}
                            className={`px-3 py-1.5 border rounded-full text-xs font-extrabold cursor-pointer ${
                              isInc ? 'bg-[#FFE7DF] text-[#FF5A36] border-[#FF5A36]' : 'bg-white border-[#E0DED8]'
                            }`}
                          >
                            {scName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Quiz Title</span>
                    <input
                      type="text"
                      required
                      value={newQuizTitle}
                      onChange={(e) => setNewQuizTitle(e.target.value)}
                      placeholder="e.g. Quiz 3 · Trees & BST"
                      className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-semibold rounded-xl text-ink-900 focus:border-[#FF5A36] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Date</span>
                      <input
                        type="text"
                        required
                        value={newQuizDate}
                        onChange={(e) => setNewQuizDate(e.target.value)}
                        placeholder="Sun 14 Jun"
                        className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-mono font-semibold rounded-xl text-ink-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Marks</span>
                      <input
                        type="text"
                        required
                        value={newQuizMarks}
                        onChange={(e) => setNewQuizMarks(e.target.value)}
                        placeholder="15"
                        className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-mono font-semibold rounded-xl text-ink-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#ECEAE5] pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveCourseSheet(null)}
                      className="bg-transparent border border-[#E0DED8] px-5 py-2 rounded-full text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={newQuizSections.length === 0 || !newQuizTitle.trim() || !newQuizDate.trim()}
                      className={`text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center border-none text-white shadow-coral-glow cursor-pointer ${
                        newQuizSections.length > 0 && newQuizTitle.trim() && newQuizDate.trim()
                          ? 'bg-[#FF5A36]'
                          : 'bg-coral-100 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      + Schedule quiz
                    </button>
                  </div>
                </form>
              )}

              {/* C. ASSIGNMENT SCHEDULE SHEET */}
              {activeCourseSheet === 'assignment' && (
                <form onSubmit={handleSubmitNewAssignment} className="px-5 space-y-4 font-sans text-left">
                  <div>
                    <h2 className="text-xl font-extrabold text-ink-900 tracking-tight leading-none">New assignment</h2>
                    <p className="font-mono text-[11.5px] text-ink-500 mt-1">Submit to multi-sections instantly</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Sections</span>
                    <div className="flex gap-2">
                      {activeCourseNode?.sections.map(sc => {
                        const isSectInc = newAssignSections.includes(sc);
                        return (
                          <button
                            type="button"
                            key={sc}
                            onClick={() => {
                              if (isSectInc) setNewAssignSections(old => old.filter(x => x !== sc));
                              else setNewAssignSections(old => [...old, sc]);
                            }}
                            className={`px-3 py-1.5 border rounded-full text-xs font-extrabold cursor-pointer ${
                              isSectInc ? 'bg-[#FFE7DF] text-[#FF5A36] border-[#FF5A36]' : 'bg-white border-[#E0DED8]'
                            }`}
                          >
                            {sc}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Assignment Title</span>
                    <input
                      type="text"
                      required
                      value={newAssignTitle}
                      onChange={(e) => setNewAssignTitle(e.target.value)}
                      placeholder="Assignment 4 · Hash tables"
                      className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-semibold rounded-xl text-ink-900 focus:border-[#FF5A36] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-sans text-[11.5px] font-extrabold text-[#75726A] uppercase block">Due Date</span>
                    <input
                      type="text"
                      required
                      value={newAssignDueDate}
                      onChange={(e) => setNewAssignDueDate(e.target.value)}
                      placeholder="Sun 14 Jun"
                      className="w-full bg-white border border-[#E0DED8] p-3 text-xs font-semibold rounded-xl text-ink-900"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#ECEAE5] pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveCourseSheet(null)}
                      className="bg-transparent border border-[#E0DED8] px-5 py-2.5 rounded-full text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={newAssignSections.length === 0 || !newAssignTitle.trim() || !newAssignDueDate.trim()}
                      className={`text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center text-white border-none shadow-coral-glow cursor-pointer ${
                        newAssignSections.length > 0 && newAssignTitle.trim() && newAssignDueDate.trim()
                          ? 'bg-[#FF5A36]'
                          : 'bg-coral-100 opacity-45 cursor-not-allowed'
                      }`}
                    >
                      + Post assignment
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MATERIALS REMOVE CONFIRM DIALOG CENTER MODAL */}
      <AnimatePresence>
        {materialsTrashTargetSet && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E0D0B]/55 cursor-pointer"
              onClick={() => setMaterialsTrashTargetSet(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xs bg-white rounded-2xl p-5 shadow-3 text-left space-y-4 z-10 select-none"
            >
              <div>
                <h3 className="text-base font-extrabold text-ink-900 leading-none">Remove this material?</h3>
                <p className="text-xs text-ink-600 leading-relaxed mt-2.5">
                  "{materialsTrashTargetSet?.title}" will be unshared from {materialsTrashTargetSet?.section}. Students lose access immediately.
                </p>
              </div>

              <div className="flex items-center gap-2.5 justify-end">
                <button
                  onClick={() => setMaterialsTrashTargetSet(null)}
                  className="bg-transparent text-ink-900 text-xs font-bold py-2 px-3 hover:bg-ink-100 rounded-full border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const scrap = materialsTrashTargetSet;
                    setMaterials(old => old.filter(f => f.id !== scrap.id));
                    setMaterialsTrashTargetSet(null);
                    onTriggerToast(`Material removed from ${scrap.section}`);
                  }}
                  className="bg-[#E5484D] text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1 border-none shadow-sm cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
