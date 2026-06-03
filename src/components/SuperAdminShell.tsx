import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Database, 
  ShieldAlert, 
  History, 
  Plus, 
  CheckCircle, 
  Cpu, 
  RefreshCw, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { User, AuditLog, Classmate } from '../types';

interface SuperAdminShellProps {
  currentUser: User;
  auditLogs: AuditLog[];
  classmates: Classmate[];
  onAddAuditLog: (log: AuditLog) => void;
  onLogout: () => void;
  onChangeContext: () => void;
}

export default function SuperAdminShell({
  currentUser,
  auditLogs,
  classmates,
  onAddAuditLog,
  onLogout,
  onChangeContext
}: SuperAdminShellProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Depts' | 'Admins' | 'Audit' | 'Settings'>('Overview');
  
  // Custom Departments stateful list
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptTitle, setNewDeptTitle] = useState('');
  const [deptsList, setDeptsList] = useState([
    { code: 'CSE', title: 'Computer Science and Engineering', activeSections: 3 },
    { code: 'EEE', title: 'Electrical and Electronic Engineering', activeSections: 1 },
    { code: 'BBA', title: 'Bachelor of Business Administration', activeSections: 1 },
    { code: 'SWE', title: 'Software Engineering', activeSections: 1 }
  ]);

  // Admin promotions list
  const [pioneersAdmins, setPioneersAdmins] = useState([
    { email: 'office.admin@university.edu', name: 'Academic Office Coordinator', isSuper: false },
    { email: 'dean.cse@university.edu', name: 'Dean Office Secretariat', isSuper: false }
  ]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);

  // Health Stats Sim
  const serverLatency = '14 ms';
  const dbHealth = 'Optimal';

  const handleCreateDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode || !newDeptTitle) return;

    const addedDept = {
      code: newDeptCode.toUpperCase(),
      title: newDeptTitle,
      activeSections: 0
    };
    setDeptsList([...deptsList, addedDept]);
    setNewDeptCode('');
    setNewDeptTitle('');
    setIsAddingDept(false);

    onAddAuditLog({
      id: 'audit-' + Date.now(),
      actor: 'Super Admin',
      action: 'Registered Department Stream',
      target: `${addedDept.code} — ${addedDept.title}`,
      timestamp: new Date().toISOString(),
      type: 'section_edit'
    });
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) return;

    const addedAdmin = {
      email: newAdminEmail,
      name: newAdminName,
      isSuper: false
    };
    setPioneersAdmins([...pioneersAdmins, addedAdmin]);
    setNewAdminEmail('');
    setNewAdminName('');
    setIsPromoting(false);

    onAddAuditLog({
      id: 'audit-' + Date.now(),
      actor: 'Super Admin',
      action: 'Promoted Executive Administrator',
      target: `${addedAdmin.name} (${addedAdmin.email})`,
      timestamp: new Date().toISOString(),
      type: 'approval'
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-fg-1 flex flex-col font-sans pb-24">
      {/* Live Head */}
      <header className="sticky top-0 z-40 bg-white/92 border-b border-subtle backdrop-blur-[24px] px-5 py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse shrink-0" />
            <h2 className="text-sm font-extrabold tracking-wide uppercase text-fg-1 truncate font-sans">
              Institutional Root Cluster
            </h2>
          </div>
          <p className="text-[11px] font-mono text-fg-3 tracking-wider mt-0.5 truncate font-semibold">
            Super Administrator Executive Desk &bull; Session Live
          </p>
        </div>
        <button
          onClick={() => setActiveTab('Settings')}
          className="flex items-center gap-2 hover:opacity-90 transition-all text-left cursor-pointer shrink-0"
          title="View Active Profile"
        >
          {/* Amber style avatar for Super admin - Faculty designation */}
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-1">
            {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SA'}
          </div>
          <span className="text-[10px] text-fg-3 font-mono font-semibold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-5 max-w-lg mx-auto w-full space-y-5">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="super-overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              {/* Server Engine stats cards matching */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-surface border border-subtle p-3.5 rounded-md flex flex-col justify-between shadow-1 hover:border-coral-100 transition duration-110">
                  <span className="text-[9px] text-fg-3 uppercase font-mono tracking-wider font-bold block">Root Node</span>
                  <span className="text-xs font-mono font-bold text-success-strong mt-2 block truncate">SYSTEM OK</span>
                </div>
                <div className="bg-surface border border-subtle p-3.5 rounded-md flex flex-col justify-between shadow-1 hover:border-coral-100 transition duration-110">
                  <span className="text-[9px] text-fg-3 uppercase font-mono tracking-wider font-bold block">Latency</span>
                  <span className="text-xs font-mono font-bold text-coral mt-2 block truncate tabular-numbers">{serverLatency}</span>
                </div>
                <div className="bg-surface border border-subtle p-3.5 rounded-md flex flex-col justify-between shadow-1 hover:border-coral-100 transition duration-110">
                  <span className="text-[9px] text-fg-3 uppercase font-mono tracking-wider font-bold block">DB Pool</span>
                  <span className="text-xs font-mono font-bold text-coral mt-2 block truncate">{dbHealth}</span>
                </div>
              </div>

              {/* Bento informational block */}
              <div className="bg-ink-900 text-fg-inverse rounded-md p-5 relative overflow-hidden space-y-3 shadow-2">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-coral pointer-events-none">
                  <Cpu size={120} />
                </div>
                <h3 className="text-xs uppercase font-mono tracking-wider text-coral font-bold">Super-Admin Root Authority</h3>
                <p className="text-xs text-ink-350 leading-relaxed font-sans">
                  You are verified in the System Kernel with complete institutional override capabilities. Add master discipline pipelines, inspect administrative change audits, elevate secondary admins, and review logs without state limit constraints.
                </p>
                <button
                  onClick={() => setActiveTab('Audit')}
                  className="py-2 px-4 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow cursor-pointer transition-all duration-120 hover:scale-[0.98] active:scale-97"
                >
                  Inspect Audit Stream
                </button>
              </div>

              {/* Stats overview registry counts */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-fg-3 font-mono">Master System Registry</h3>
                <div className="bg-surface border border-subtle rounded-md p-4 divide-y divide-subtle shadow-1 font-sans">
                  <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-fg-2 font-semibold">Departments Monitored:</span>
                    <span className="text-right text-coral font-mono font-bold tabular-numbers">{deptsList.length} global streams</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs pt-2">
                    <span className="text-fg-2 font-semibold">Elevated Coordinators:</span>
                    <span className="text-right text-coral font-mono font-bold tabular-numbers">{pioneersAdmins.length} active scopes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs pt-2">
                    <span className="text-fg-2 font-semibold">Aggregated Action Logs:</span>
                    <span className="text-right text-coral font-mono font-bold tabular-numbers">{auditLogs.length} logs counted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Depts' && (
            <motion.div
              key="super-depts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-fg-3 font-mono tracking-wider">Academic Streams</h3>
                <button
                  onClick={() => setIsAddingDept(true)}
                  className="py-1.5 px-3 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition duration-120 cursor-pointer flex items-center gap-1 hover:scale-[0.98] active:scale-97"
                >
                  <Plus size={14} strokeWidth={1.75} /> Stream Node
                </button>
              </div>

              {/* Add Custom Department streams */}
              {isAddingDept && (
                <motion.form 
                  onSubmit={handleCreateDeptSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface border border-subtle rounded-md p-4.5 space-y-3.5 shadow-1 font-sans"
                >
                  <h4 className="text-xs font-bold text-coral font-mono uppercase tracking-wider">Establish Department Stream</h4>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Department Identifier Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MCE or CE"
                      maxLength={4}
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none uppercase font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Full Department Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mechanical Engineering"
                      value={newDeptTitle}
                      onChange={(e) => setNewDeptTitle(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 font-sans">
                    <button
                      type="button"
                      onClick={() => setIsAddingDept(false)}
                      className="px-3.5 py-1.5 bg-ink-100 hover:bg-ink-200 text-fg-1 font-semibold text-xs rounded-pill transition cursor-pointer"
                    >
                      Bypass
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill transition cursor-pointer shadow-coral-glow"
                    >
                      Write discipline
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Department stream list */}
              <div className="space-y-2.5 font-sans">
                {deptsList.map((dep) => (
                  <div key={dep.code} className="bg-surface border border-subtle rounded-md p-4 flex items-center justify-between shadow-1 hover:border-coral-100 transition duration-120">
                    <div>
                      <h4 className="font-semibold text-fg-1 text-[15px] font-mono tracking-tight">{dep.code}</h4>
                      <p className="text-[11px] text-fg-3 mt-1.5 leading-relaxed">{dep.title}</p>
                    </div>

                    <div className="p-2.5 bg-sunken border border-subtle rounded-md text-center shrink-0">
                      <span className="text-xs font-bold font-mono text-coral block tabular-numbers">{dep.activeSections}</span>
                      <span className="text-[8.5px] text-fg-3 uppercase font-mono tracking-wider font-semibold">Sections</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Admins' && (
            <motion.div
              key="super-admins"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-fg-3 font-mono tracking-wider font-bold">Executive Supervisors</h3>
                <button
                  onClick={() => setIsPromoting(true)}
                  className="py-1.5 px-3 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill shadow-coral-glow transition duration-120 cursor-pointer flex items-center gap-1 hover:scale-[0.98] active:scale-97"
                >
                  <Plus size={14} strokeWidth={1.75} /> Promote Executive
                </button>
              </div>

              {/* Form trigger to promote standard users directly */}
              {isPromoting && (
                <motion.form 
                  onSubmit={handlePromoteSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface border border-subtle rounded-md p-4.5 space-y-3.5 shadow-1 font-sans"
                >
                  <h4 className="text-xs font-bold text-coral font-mono uppercase tracking-wider">Elevate Admin role</h4>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Supervisor Persona Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Registrar lead"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-fg-3 font-mono font-bold uppercase tracking-wider">Authorized Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="office@university.edu"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-surface border border-border-default rounded-[12px] p-2.5 text-xs text-fg-1 placeholder:text-fg-4 outline-none font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsPromoting(false)}
                      className="px-3.5 py-1.5 bg-ink-100 hover:bg-ink-200 text-fg-1 font-semibold text-xs rounded-pill transition cursor-pointer"
                    >
                      Bypass
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-coral hover:bg-coral-600 text-white font-semibold text-xs rounded-pill transition cursor-pointer shadow-coral-glow"
                    >
                      Grant Override Access
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Admin registry logs */}
              <div className="space-y-2.5 font-sans">
                {pioneersAdmins.map((ad) => (
                  <div key={ad.email} className="bg-surface border border-subtle rounded-md p-4 flex items-center justify-between gap-4 shadow-1 hover:border-coral-100 transition duration-120">
                    <div>
                      <h4 className="font-semibold text-fg-1 text-sm leading-snug">{ad.name}</h4>
                      <p className="text-[10px] text-fg-3 font-mono mt-1 font-semibold">{ad.email}</p>
                    </div>

                    <span className="px-2 py-0.5 bg-coral-50 border border-coral-100 text-coral rounded font-mono font-bold text-[9px] uppercase tracking-wider">
                      Admin
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Audit' && (
            <motion.div
              key="super-audit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <div className="bg-surface border border-subtle p-4 rounded-md flex items-center justify-between shadow-1">
                <div>
                  <h3 className="font-semibold text-sm text-fg-1">System Activity Audit Log</h3>
                  <p className="text-xs text-fg-3 mt-0.5 font-sans">Central security logging tracking administrators actions.</p>
                </div>
                <History size={18} className="text-fg-3" strokeWidth={1.75} />
              </div>

              {/* Audit timelines mapping */}
              <div className="space-y-2.5 font-sans">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-surface border border-subtle rounded-md p-4 space-y-2.5 shadow-1 hover:border-coral-100 transition duration-120">
                    <div className="flex items-start justify-between gap-4 text-xs font-semibold">
                      <span className="text-fg-2 uppercase font-mono text-[9px] bg-sunken border border-subtle px-1.5 py-0.5 rounded-sm">
                        {log.actor}
                      </span>
                      <span className="text-[9px] text-fg-4 font-mono tabular-numbers">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs text-fg-1 font-sans mt-0.5">
                      Action committed: <strong className="text-fg-1 font-semibold font-sans">{log.action}</strong>
                    </div>

                    <div className="text-[10.5px] font-mono leading-none text-coral pt-1.5 border-t border-subtle font-semibold">
                      Target identity: <span className="text-fg-3 font-medium">{log.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="super-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              <div className="bg-surface border border-subtle p-4.5 rounded-md space-y-1 shadow-1">
                <h3 className="font-semibold text-sm text-fg-1">Super Kernel Config</h3>
                <p className="text-xs text-fg-3">Access master administrative controls.</p>
              </div>

              {/* Active super admin status */}
              <div className="bg-surface border border-subtle rounded-md p-4.5 space-y-4 shadow-1 font-sans">
                <h4 className="text-xs font-bold font-mono text-coral uppercase tracking-widest">Global Master Profile</h4>

                <div className="grid grid-cols-2 text-xs font-mono text-fg-3 gap-y-3 gap-x-1 divide-y divide-subtle">
                  <span className="pt-2 font-semibold">Super Admin:</span>
                  <span className="text-right text-fg-1 pt-2 font-sans font-semibold">{currentUser.name}</span>
                  <span className="pt-2 font-semibold">Administrative Level:</span>
                  <span className="text-right text-fg-1 pt-2">Full Master Access Code</span>
                  <span className="pt-2 font-semibold">Current Context Session:</span>
                  <span className="text-right text-coral font-bold uppercase">{currentUser.semester || 'Spring 2026'}</span>
                </div>
              </div>

              {/* Actions mapping */}
              <div className="space-y-2">
                <button
                  onClick={onChangeContext}
                  className="w-full py-3 border border-border-default hover:border-ink-400 bg-surface text-fg-1 font-semibold rounded-pill hover:bg-ink-50 transition cursor-pointer text-xs flex items-center justify-center gap-2 shadow-1 duration-120 active:scale-97 active:opacity-85"
                >
                  <RefreshCw size={14} className="text-coral" strokeWidth={1.75} />
                  Change Academic Role (Onboarding Loop)
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-3 bg-surface border border-danger-bg hover:bg-danger-bg hover:text-danger-fg text-danger-fg font-semibold rounded-pill transition cursor-pointer text-xs flex items-center justify-center gap-2 duration-120 active:scale-97"
                >
                  <LogOut size={14} strokeWidth={1.75} />
                  Terminate Connection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/92 backdrop-blur-[24px] border-t border-subtle flex items-center justify-around shadow-sm safe-bottom py-1.5">
        {[
          { icon: <Network size={22} strokeWidth={1.75} />, label: 'Overview' as const, display: 'Overview' },
          { icon: <Database size={22} strokeWidth={1.75} />, label: 'Depts' as const, display: 'Depts' },
          { icon: <ShieldAlert size={22} strokeWidth={1.75} />, label: 'Admins' as const, display: 'Admins' },
          { icon: <History size={22} strokeWidth={1.75} />, label: 'Audit' as const, display: 'Audit' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-sm transition duration-120 cursor-pointer ${
              activeTab === item.label
                ? 'text-coral'
                : 'text-fg-3 hover:text-fg-1'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold uppercase tracking-tight">{item.display}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}
