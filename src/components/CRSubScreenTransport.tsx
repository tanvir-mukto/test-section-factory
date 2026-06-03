import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bus, 
  Bell, 
  MapPin, 
  ChevronLeft, 
  Phone, 
  Mail, 
  Check, 
  Info,
  CalendarCheck,
  RotateCcw,
  Plus,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';

interface TransportRoute {
  id: string;
  name: string;
  busNumber: string;
  status: 'active' | 'delayed' | 'suspended';
  statusMessage?: string;
  routeStops: string;
  departureTime: string;
  confirmed: number;
  total: number;
  mine: boolean;
  
  // Legacy compatibility fields to not break live countdown card
  corridor: string;
  morning: string;
  last: string;
  gate: string;
}

const INITIAL_ROUTES: TransportRoute[] = [
  { 
    id: '1', 
    name: 'Dhanmondi Express (Route-1)', 
    busNumber: 'BUS-08', 
    status: 'active', 
    routeStops: 'Dhanmondi Robindra Sarobar ➜ Kalabagan ➜ Science Lab ➜ Farmgate ➜ Campus', 
    departureTime: '07:30 AM / 02:30 PM', 
    confirmed: 38, 
    total: 42, 
    mine: false,
    corridor: 'Dhanmondi–Campus',
    morning: '7:30 am',
    last: '2:30 pm',
    gate: 'Gate 2'
  },
  { 
    id: '2', 
    name: 'Uttara Corridor (Route-2)', 
    busNumber: 'BUS-11', 
    status: 'active', 
    routeStops: 'Uttara House Building ➜ Azampur ➜ Khilkhet ➜ Kuril ➜ Campus', 
    departureTime: '07:15 AM / 03:00 PM', 
    confirmed: 29, 
    total: 42, 
    mine: false,
    corridor: 'Uttara–Campus',
    morning: '7:15 am',
    last: '3:00 pm',
    gate: 'Gate 1'
  },
  { 
    id: '5', 
    name: 'Mirpur Link (Route-5)', 
    busNumber: 'BUS-15', 
    status: 'delayed', 
    statusMessage: 'Estimated 15m delay due to flyover construction',
    routeStops: 'Mirpur-10 ➜ Kazipara ➜ Shewrapara ➜ Agargaon ➜ Campus', 
    departureTime: '07:30 AM / 02:00 PM', 
    confirmed: 32, 
    total: 42, 
    mine: false,
    corridor: 'Mirpur–Campus',
    morning: '7:30 am',
    last: '2:00 pm',
    gate: 'Gate 2'
  },
  { 
    id: '7', 
    name: 'Old Dhaka Shuttle (Route-7)', 
    busNumber: 'BUS-03', 
    status: 'suspended', 
    statusMessage: 'Suspended for maintenance today',
    routeStops: 'Sadarghat ➜ Gulisthan ➜ Shahbagh ➜ Karwan Bazar ➜ Campus', 
    departureTime: '07:00 AM / 01:30 PM', 
    confirmed: 31, 
    total: 42, 
    mine: true,
    corridor: 'Mirpur–Campus',
    morning: '7:30 am',
    last: '5:30 pm',
    gate: 'YKSGP'
  },
];

const LEAVE_WINDOW_MIN = 32;

// Custom glyph scale helpers for consistency
const sBus = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <Bus size={props.size || 18} {...props} />
);
const sBell = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <Bell size={props.size || 18} {...props} />
);
const sPin = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <MapPin size={props.size || 18} {...props} style={{ strokeWidth: 1.75 }} />
);

interface QATransportProps {
  currentUser?: User | null;
  onBack: () => void;
  triggerToast?: (msg: string) => void;
}

export default function CRSubScreenTransport({ currentUser, onBack, triggerToast }: QATransportProps) {
  // Routes State
  const [routes, setRoutes] = useState<TransportRoute[]>(() => {
    const saved = localStorage.getItem('vars_diu_transport_data_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transport data: ', e);
      }
    }
    return INITIAL_ROUTES;
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('vars_diu_transport_data_v3', JSON.stringify(routes));
  }, [routes]);

  // "I ride the campus bus" switch state (default true)
  const [ridesBus, setRidesBus] = useState<boolean>(true);

  // Local Toast notification overlay (similar to Routine toast)
  const [localToast, setLocalToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayToast = (msg: string) => {
    // If parent triggers toast, propagate it
    if (triggerToast) {
      triggerToast(msg);
    }
    
    // Also show local bottom-center/top toast styled beautifully
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setLocalToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setLocalToast(null);
    }, 3000);
  };

  // Countdown Live State
  const [deadlineMs, setDeadlineMs] = useState<number>(() => {
    return Date.now() + LEAVE_WINDOW_MIN * 60 * 1000;
  });
  const [currentMs, setCurrentMs] = useState<number>(Date.now());

  // Handle countdown tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time Calc
  const leftMs = Math.max(0, deadlineMs - currentMs);
  const totalWindowMs = LEAVE_WINDOW_MIN * 60 * 1000;
  const progressRatio = leftMs / totalWindowMs; // depletes from 1.0 to 0.0

  const minsLeft = Math.floor(leftMs / 60000);
  const secsLeft = Math.floor((leftMs % 60000) / 1000);
  const isUrgent = minsLeft < 10;
  const isDeparted = leftMs <= 0;

  // Active route
  const myRoute = routes.find(r => r.mine) || routes[0];

  // Calculated numbers
  const totalPending = routes.reduce((sum, r) => sum + (r.total - r.confirmed), 0);

  // Remind All Action helper
  const handleRemindAll = () => {
    if (totalPending > 0) {
      displayToast(`Reminder sent to ${totalPending} pending riders`);
      // Update our Route 7 confirmation for interaction satisfaction
      setRoutes(prev => prev.map(r => {
        if (r.mine && r.confirmed < r.total) {
          return { ...r, confirmed: Math.min(r.total, r.confirmed + 2) };
        }
        return r;
      }));
    } else {
      displayToast("Everyone has confirmed");
    }
  };

  // Click row trigger
  const handleRouteClick = (route: TransportRoute) => {
    displayToast(`Route ${route.id} · ${route.confirmed}/${route.total} confirmed · last bus ${route.last}`);
  };

  // Debug time adjustments (Interactive premium experience)
  const handleAdjustTimer = (mins: number) => {
    setDeadlineMs(prev => prev + mins * 60 * 1000);
    displayToast(`Timer adjusted by ${mins > 0 ? '+' : ''}${mins} min`);
  };

  // Reset timer
  const handleResetTimer = () => {
    setDeadlineMs(Date.now() + LEAVE_WINDOW_MIN * 60 * 1000);
    displayToast('Countdown timer reset to ' + LEAVE_WINDOW_MIN + ' mins');
  };

  // Set to under 10min for testing the shift.
  const handleSetUrgent = () => {
    setDeadlineMs(Date.now() + 8 * 60 * 1000 + 35 * 1000);
    displayToast('Timer shifted to 8m 35s remaining (urgent state)');
  };

  return (
    <div 
      className="relative flex flex-col min-h-screen bg-[#FAFAF9]"
      style={{ width: '100%', maxWidth: '390px', margin: '0 auto' }}
    >
      {/* 1. SHARED HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#ECEAE5] h-16 px-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-neutral-100 active:scale-95 transition-all outline-none"
          >
            <ChevronLeft size={22} className="text-[#1B1A18] stroke-[1.75]" />
          </button>
          
          <div className="flex flex-col text-left">
            <h1 className="text-[19px] font-bold tracking-tight text-[#1B1A18] leading-none">
              Transport
            </h1>
            <span className="font-mono text-[11px] font-semibold text-[#75726A] mt-1 tracking-tight">
              Campus shuttle &middot; 4 routes
            </span>
          </div>
        </div>

        {/* Right action: bell icon-btn */}
        <button 
          type="button"
          onClick={handleRemindAll}
          className="w-10 h-10 rounded-full bg-white border border-[#ECEAE5] shadow-sm flex items-center justify-center text-[#1B1A18] active:scale-95 duration-120 transition-all cursor-pointer outline-none hover:border-[#FF5A36] hover:text-[#FF5A36]"
          title="Remind pending riders"
        >
          <Bell size={18} className="stroke-[1.75]" />
        </button>
      </header>

      {/* TOAST HOST OVERLAY (BOTTOM-CENTER, ONE AT A TIME) */}
      <AnimatePresence>
        {localToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 15, x: '-50%' }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-[92px] left-1/2 z-50 bg-[#1B1A18] text-white text-xs font-semibold px-4 py-3 rounded-full shadow-md border border-white/10 font-sans tracking-wide text-center whitespace-normal max-w-[320px]"
          >
            {localToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCROLLABLE MAIN BODY */}
      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-4 space-y-4">
        
        {/* 2. "I RIDE THE CAMPUS BUS" TOGGLE PILL ROW */}
        <div className="bg-[#F4F4F2] px-4 py-2.5 rounded-full flex items-center justify-between shadow-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#E8E7E3] text-[#1B1A18] flex items-center justify-center">
              {sBus({ size: 16 })}
            </span>
            <span className="text-[13px] font-bold text-[#1B1A18] font-sans">
              I ride the campus bus
            </span>
          </div>

          {/* iOS toggle switch */}
          <button
            type="button"
            onClick={() => {
              setRidesBus(prev => !prev);
              displayToast(ridesBus ? "Flipped to admin oversight mode" : "Flipped to bus rider countdown mode");
            }}
            className="w-[51px] h-[31px] rounded-full p-1 transition-colors duration-200 outline-none relative"
            style={{ backgroundColor: ridesBus ? '#FF5A36' : '#D4D2CC' }}
          >
            <motion.div 
              className="w-6 h-6 bg-white rounded-full shadow-sm"
              animate={{ x: ridesBus ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* 3. HERO CARD — black #1B1A18 */}
        <div className="bg-[#1B1A18] text-white rounded-[14px] p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col">
          {ridesBus ? (
            /* Mode A: rides bus (live countdown time to leave) */
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2E2A] text-[#FF5A36] flex items-center justify-center shrink-0">
                    {sBus({ size: 20 })}
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-extrabold text-[#A8A59C] tracking-wider uppercase block leading-none">
                      {isDeparted ? 'OFF CAMPUS' : 'LAST BUS OFF CAMPUS'}
                    </span>
                    <h3 className="text-[16px] font-bold text-white tracking-tight leading-none">
                      {isDeparted ? 'Route 7 · Departed' : `Route ${myRoute.id} · ${myRoute.last}`}
                    </h3>
                    <code className="text-[10px] font-mono text-[#A8A59C] font-semibold block leading-none mt-1">
                      {myRoute.gate} &middot; {myRoute.corridor}
                    </code>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0">
                  <span 
                    className="text-[34px] font-extrabold font-mono tracking-tighter leading-none tabular-numbers transition-colors duration-300"
                    style={{ color: isDeparted ? '#A8A59C' : (isUrgent ? '#FF7A5C' : '#FF5A36') }}
                  >
                    {isDeparted ? '—' : minsLeft}
                  </span>
                  <span className="text-[8px] font-black uppercase text-[#A8A59C] tracking-widest mt-1 block leading-none">
                    {isDeparted ? 'departed' : 'min to leave'}
                  </span>
                </div>
              </div>

              {/* Depleting progress bar */}
              <div className="w-full h-1.5 bg-[#2F2E2A] rounded-full overflow-hidden transition-all">
                <div 
                  className="h-full rounded-full transition-all duration-[1000ms] ease-linear"
                  style={{ 
                    width: `${isDeparted ? 0 : progressRatio * 100}%`,
                    backgroundColor: isUrgent ? '#FF7A5C' : '#FF5A36' 
                  }}
                />
              </div>

              {/* Footer text mono, muted */}
              <div className="flex items-center justify-between font-mono text-[10px] text-[#A8A59C] font-semibold mt-1">
                <span>
                  {isDeparted ? 'Last bus has left' : `Leave campus by ${myRoute.last}`}
                </span>
                {!isDeparted && (
                  <span className="text-white">
                    {minsLeft}m {secsLeft.toString().padStart(2, '0')}s left
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Mode B: no bus (managing only overview ratio) */
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#2F2E2A] text-[#FF5A36] flex items-center justify-center shrink-0">
                    <Compass size={20} className="text-[#FF5A36]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#A8A59C] tracking-wider uppercase block leading-none">
                      YOU DON'T RIDE A ROUTE
                    </span>
                    <h3 className="text-[16px] font-bold text-white tracking-tight leading-none">
                      Managing Route {myRoute.id}
                    </h3>
                    <code className="text-[10px] font-mono text-[#A8A59C] font-semibold block leading-none mt-1">
                      Last bus {myRoute.last} &middot; {myRoute.gate}
                    </code>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0 text-white">
                  <span className="text-[28px] font-black font-mono leading-none tracking-tight">
                    {myRoute.confirmed}/{myRoute.total}
                  </span>
                  <span className="text-[8px] font-black uppercase text-[#A8A59C] tracking-widest mt-1 block leading-none">
                    confirmed
                  </span>
                </div>
              </div>

              {/* Confirmation ratio progress bar */}
              <div className="w-full h-1.5 bg-[#2F2E2A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF5A36] rounded-full transition-all duration-[350ms]"
                  style={{ width: `${(myRoute.confirmed / myRoute.total) * 100}%` }}
                />
              </div>

              {/* Footer with meta stats */}
              <div className="flex items-center justify-between font-mono text-[10px] text-[#A8A59C] font-semibold mt-1">
                <span>
                  {Math.round((myRoute.confirmed / myRoute.total) * 100)}% confirmed
                </span>
                <span>
                  {myRoute.total - myRoute.confirmed} pending
                </span>
              </div>
            </>
          )}
        </div>

        {/* 4. SPEED SIMULATOR TOGGLES (CR Helper feature premium design) */}
        <div className="bg-white border border-[#ECEAE5] rounded-[14px] p-3 shadow-xs space-y-2">
          <span className="text-[9px] font-black uppercase text-[#75726A] tracking-wider block text-left">
            Countdown simulation (Testing controls)
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleAdjustTimer(-5)}
              className="px-2 py-1 bg-[#F4F4F2] text-[#1B1A18] text-[10px] font-bold rounded-md active:scale-95"
            >
              -5 Min
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTimer(5)}
              className="px-2 py-1 bg-[#F4F4F2] text-[#1B1A18] text-[10px] font-bold rounded-md active:scale-95"
            >
              +5 Min
            </button>
            <button
              type="button"
              onClick={handleSetUrgent}
              className="px-2 py-1 bg-[#FFE7DF] text-[#FF5A36] text-[10px] font-bold rounded-md active:scale-95"
            >
              Urgent (&lt;10m)
            </button>
            <button
              type="button"
              onClick={() => setDeadlineMs(Date.now())}
              className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-md active:scale-95"
            >
              Depart Now
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="px-2.5 py-1 bg-[#1B1A18] text-white text-[10px] font-bold rounded-md flex items-center gap-1 ml-auto active:scale-95"
            >
              <RotateCcw size={10} />
              Reset Target
            </button>
          </div>
        </div>

        {/* 5. ROUTES SEGMENT TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between select-none">
            <span className="text-[10px] font-extrabold text-[#75726A] tracking-wider uppercase">
              ROUTES
            </span>

            {/* Remind pending badge pill action */}
            <button
              type="button"
              onClick={handleRemindAll}
              className="bg-[#FFE7DF] hover:bg-[#FFD9CD] text-[#FF5A36] border border-[#FFE7DF] font-sans font-bold text-[11px] px-3 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 active:scale-95 leading-none"
            >
              {sBell({ size: 11 })}
              <span>Remind pending</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {routes.map((route) => {
              const matchesMine = route.mine;

              return (
                <div
                  key={route.id}
                  onClick={() => handleRouteClick(route)}
                  className="rounded-[16px] p-4.5 text-left cursor-pointer duration-150 transition-all select-none border bg-white shadow-xs hover:border-[#FF5A36]/40 transform active:scale-[0.985] flex flex-col gap-3"
                  style={{
                    borderColor: matchesMine ? '#FFD9CD' : '#ECEAE5',
                    backgroundColor: matchesMine ? '#FFFBF9' : '#FFFFFF',
                  }}
                >
                  {/* Top row: Bus ID + Status Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#75726A] bg-[#F4F4F2] px-2 py-0.5 rounded-md tracking-wider">
                      {route.busNumber}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase tracking-wider ${
                      route.status === 'active' ? 'bg-[#EAFBF3] text-[#15803D]' :
                      route.status === 'delayed' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  {/* Route Title with Optional User Route label */}
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#1a1a17] text-[15.5px] leading-snug tracking-tight">
                      {route.name}
                    </h4>
                    {matchesMine && (
                      <span className="bg-[#FFE7DF] text-[#FF5A36] text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wide">
                        Your route
                      </span>
                    )}
                  </div>

                  {/* Stops container styled with light gray background and pin icon */}
                  <div className="bg-[#F8F7F4] p-3.5 rounded-[11px] border border-[#ECEAE5]/40 flex items-start gap-2.5 text-left text-[11px] leading-relaxed text-[#5C5A52] font-semibold">
                    <MapPin size={13} className="text-[#A8A59C] mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="font-medium text-ink-700 tracking-wide">
                      {route.routeStops}
                    </span>
                  </div>

                  {/* Divider line before departure layout */}
                  <div className="h-[1px] w-full bg-[#ECEAE5]/60" />

                  {/* Bottom details: Departure Shifts */}
                  <div className="flex items-center justify-between text-[11.5px] font-sans pb-0.5">
                    <span className="text-[#75726A] font-medium">Departure shifts:</span>
                    <strong className="text-[#1B1A18] font-mono tracking-tight text-[12px] font-black">{route.departureTime}</strong>
                  </div>

                  {/* Warning/Status message underneath */}
                  {route.statusMessage && (
                    <div className="flex items-center gap-2 text-[10.5px] text-[#DC2626] bg-[#FFF1F2] px-3 py-2 rounded-lg border border-[#FECDD3]/30 font-mono tracking-tight font-medium leading-normal">
                      <AlertTriangle size={12} className="shrink-0 text-[#E11D48]" strokeWidth={2} />
                      <span>{route.statusMessage}</span>
                    </div>
                  )}

                  {/* Optional booking interactive indicator */}
                  <div className="flex items-center gap-2 text-[10px] text-[#A8A59C] font-mono pt-0.5 justify-end">
                    <span>{route.confirmed} confirmed</span>
                    <span>&middot;</span>
                    <span>{route.total} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Help Card for Students */}
        <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 text-left text-xs text-amber-900">
              <span className="font-bold leading-none block font-sans">CR Bus Management Console</span>
              <p className="leading-normal font-sans pt-0.5">
                Riders must mark confirmations by 5:00 pm. Tap `Remind pending` to dispatch a system-wide push notifications prompt to all inactive students.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { CRSubScreenTransport as QATransport };
