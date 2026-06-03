import React, { useState, useEffect } from 'react';
import { 
  Role, 
  AuthState, 
  User, 
  RoutineEntry, 
  Announcement, 
  BusRoute, 
  NoteResource, 
  Classmate, 
  AuditLog 
} from './types';
import { 
  initialRoutine, 
  initialAnnouncements, 
  initialBusRoutes, 
  initialNotes, 
  initialClassmates, 
  initialPendingUsers, 
  initialAuditLogs 
} from './mockData';
import AuthScreens from './components/AuthScreens';
import StudentShell from './components/StudentShell';
import CRShell from './components/CRShell';
import AdminShell from './components/AdminShell';
import SuperAdminShell from './components/SuperAdminShell';
import FacultyShell from './components/FacultyShell';

export default function App() {
  // Global Session state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Scaffold default user state
    return {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: 'Tanvir Reza Mukto',
      email: 'tanvirrezamukto@gmail.com',
      role: null,
      department: null,
      semester: null,
      section: null,
      isApproved: false
    };
  });
  
  const [authState, setAuthState] = useState<AuthState>('signedOut');

  // Application Data state
  const [routine, setRoutine] = useState<RoutineEntry[]>(initialRoutine);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(initialBusRoutes);
  const [notes, setNotes] = useState<NoteResource[]>(initialNotes);
  const [classmates, setClassmates] = useState<Classmate[]>(initialClassmates);
  const [pendingApps, setPendingApps] = useState(initialPendingUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Stateful Attendance Tracker records
  const [attendance, setAttendance] = useState<Record<string, Record<string, { joined: number; missed: number }>>>(() => {
    const saved = localStorage.getItem('vars_attendance_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    const initial: Record<string, Record<string, { joined: number; missed: number }>> = {};
    const courses = ['CSE-3101', 'CSE-3103', 'CSE-3105', 'CSE-3107'];
    const studentRolls = ['CSE-023-1101', 'CSE-023-1102', 'CSE-023-1103', 'CSE-023-1104', 'CSE-023-1105', 'CSE-023-1106', 'CSE-023-1107'];

    studentRolls.forEach((roll) => {
      initial[roll] = {};
      courses.forEach((course) => {
        // Generate realistic counts
        const joined = 11 + Math.floor(Math.random() * 6); // 11 to 16
        const missed = Math.floor(Math.random() * 3); // 0 to 2
        initial[roll][course] = { joined, missed };
      });
    });
    return initial;
  });

  // LocalStorage persist hook
  useEffect(() => {
    localStorage.setItem('vars_attendance_data', JSON.stringify(attendance));
  }, [attendance]);

  // Quick State Watcher synchronization
  const handleUpdateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // If promoting directly, keep consistent
      return updated;
    });
  };

  // Mutators passed down statefully to child components
  const handleAddNote = (newNote: NoteResource) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleUpdateRoutine = (updatedRoutine: RoutineEntry[]) => {
    setRoutine(updatedRoutine);
  };

  const handleAddClassmate = (newClassmate: Classmate) => {
    setClassmates((prev) => [...prev, newClassmate]);
  };

  const handleAddBusRoute = (newBus: BusRoute) => {
    setBusRoutes((prev) => [...prev, newBus]);
  };

  const handleAddAuditLog = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleUpdateAttendance = (updatedRecords: Record<string, { present: boolean }>, courseId: string) => {
    setAttendance((prev) => {
      const copy = { ...prev };
      Object.entries(updatedRecords).forEach(([roll, { present }]) => {
        if (!copy[roll]) {
          copy[roll] = {
            'CSE-3101': { joined: 0, missed: 0 },
            'CSE-3103': { joined: 0, missed: 0 },
            'CSE-3105': { joined: 0, missed: 0 },
            'CSE-3107': { joined: 0, missed: 0 }
          };
        }
        if (!copy[roll][courseId]) {
          copy[roll][courseId] = { joined: 0, missed: 0 };
        }
        if (present) {
          copy[roll][courseId] = {
            ...copy[roll][courseId],
            joined: copy[roll][courseId].joined + 1
          };
        } else {
          copy[roll][courseId] = {
            ...copy[roll][courseId],
            missed: copy[roll][courseId].missed + 1
          };
        }
      });
      return copy;
    });
  };

  const handleApprovePending = (id: string, name: string, role: string) => {
    // 1. Remove from pending apps list
    setPendingApps((prev) => prev.filter(app => app.id !== id));
    
    // 2. Add as a classmate if student or CR
    if (role === 'Student' || role === 'CR') {
      const newRoll = `CSE-023-${Math.floor(Math.random() * 899) + 101}`;
      setClassmates((prev) => [
        ...prev,
        {
          id: 'c-' + Date.now(),
          name,
          roll: newRoll,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@student.edu`,
          phone: '+880 1711 ' + Math.floor(Math.random() * 900000 + 100000),
          section: 'CSE-A',
          department: 'CSE'
        }
      ]);

      // Initialize default attendance records
      setAttendance((prev) => ({
        ...prev,
        [newRoll]: {
          'CSE-3101': { joined: 0, missed: 0 },
          'CSE-3103': { joined: 0, missed: 0 },
          'CSE-3105': { joined: 0, missed: 0 },
          'CSE-3107': { joined: 0, missed: 0 }
        }
      }));
    }

    // 3. Dynamic Audit logging
    setAuditLogs((prev) => [
      {
        id: 'audit-' + Date.now(),
        actor: currentUser?.role === 'CR' ? 'Class Rep' : 'Faculty Admin',
        action: `Approved Registration Request`,
        target: `${name} (${role})`,
        timestamp: new Date().toISOString(),
        type: 'approval'
      },
      ...prev
    ]);

    // 4. Critically match against current user's name: if we approved our own session, instantly transition state to ready!
    if (currentUser && currentUser.name === name) {
      setCurrentUser((prev) => prev ? { ...prev, isApproved: true } : null);
      setAuthState('ready');
    }
  };

  const handleRejectPending = (id: string) => {
    setPendingApps((prev) => prev.filter(app => app.id !== id));
  };

  const handleLogout = () => {
    setAuthState('signedOut');
    setCurrentUser({
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: 'Tanvir Reza Mukto',
      email: 'tanvirrezamukto@gmail.com',
      role: null,
      department: null,
      semester: null,
      section: null,
      isApproved: false
    });
  };

  const handleChangeContext = () => {
    // Resets application phase so users can pick another role and onboard again
    setAuthState('needsRole');
  };

  // Handle dynamic routing redirects equivalent inside React local state
  useEffect(() => {
    if (currentUser) {
      // Add ourselves to pending list optionally so the applet states look hyper-realistic
      const existsInPending = pendingApps.some(app => app.name === currentUser.name);
      if (authState === 'pending' && !existsInPending && currentUser.role) {
        setPendingApps((prev) => [
          ...prev,
          {
            id: 'self-pending-' + Date.now(),
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            department: currentUser.department || 'CSE',
            semester: currentUser.semester || 'Spring 2026',
            section: currentUser.section || 'CSE-A'
          }
        ]);
      }
    }
  }, [authState]);

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-canvas font-sans selection:bg-coral-100 selection:text-coral-600 antialiased text-fg-1">
      {authState !== 'ready' ? (
        <AuthScreens
          authState={authState}
          onStateChange={setAuthState}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        currentUser && (
          <>
            {currentUser.role === 'Student' && (
              <StudentShell
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                routine={routine}
                announcements={announcements}
                busRoutes={busRoutes}
                notes={notes}
                attendance={attendance}
                classmates={classmates}
                onAddNote={handleAddNote}
                onLogout={handleLogout}
                onChangeContext={handleChangeContext}
              />
            )}

            {currentUser.role === 'CR' && (
              <CRShell
                currentUser={currentUser}
                routine={routine}
                announcements={announcements}
                classmates={classmates}
                pendingApps={pendingApps}
                onAddAnnouncement={handleAddAnnouncement}
                onUpdateRoutine={handleUpdateRoutine}
                onAddClassmate={handleAddClassmate}
                onLogout={handleLogout}
                onChangeContext={handleChangeContext}
                onApprovePending={handleApprovePending}
                onRejectPending={handleRejectPending}
              />
            )}

            {currentUser.role === 'Admin' && (
              <AdminShell
                currentUser={currentUser}
                busRoutes={busRoutes}
                auditLogs={auditLogs}
                pendingApps={pendingApps}
                classmates={classmates}
                attendance={attendance}
                onUpdateAttendance={handleUpdateAttendance}
                onApprovePending={handleApprovePending}
                onRejectPending={handleRejectPending}
                onAddBusRoute={handleAddBusRoute}
                onLogout={handleLogout}
                onChangeContext={handleChangeContext}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {currentUser.role === 'Super Admin' && (
              <SuperAdminShell
                currentUser={currentUser}
                auditLogs={auditLogs}
                classmates={classmates}
                onAddAuditLog={handleAddAuditLog}
                onLogout={handleLogout}
                onChangeContext={handleChangeContext}
              />
            )}

            {(currentUser.role === 'faculty' || currentUser.role === 'Faculty') && (
              <FacultyShell
                currentUser={currentUser}
                onLogout={handleLogout}
                onChangeContext={handleChangeContext}
              />
            )}
          </>
        )
      )}
    </div>
  );
}
