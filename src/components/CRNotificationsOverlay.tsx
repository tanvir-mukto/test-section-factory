import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Signal, Heart, MessageCircle, SquareCheckBig, UsersRound } from 'lucide-react';
import AppOverlay from './AppOverlay';

export interface NotificationItem {
  id: string;
  kind: 'reach' | 'reaction' | 'ask' | 'poll' | 'faculty';
  unread: boolean;
  title: string;
  sub: string;
  when: string;
}

interface CRNotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNotificationsChange: (notifs: NotificationItem[]) => void;
}

type KindStyles = {
  bg: string;
  iconColor: string;
  icon: React.ReactNode;
};

export default function CRNotificationsOverlay({
  isOpen,
  onClose,
  notifications,
  onNotificationsChange
}: CRNotificationsOverlayProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const triggerOverlayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    onNotificationsChange(updated);
    triggerOverlayToast("Marked all as read");
  };

  const handleNotificationTap = (id: string, title: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    onNotificationsChange(updated);
    triggerOverlayToast(`Opened: ${title}`);
  };

  // Reusable tile mapper
  const getKindStyles = (kind: string): KindStyles => {
    switch (kind) {
      case 'reach':
        return {
          bg: 'bg-[#FFF4F0]', // coral 50
          iconColor: 'text-[#FF5A36]', // coral
          icon: <Signal size={18} strokeWidth={1.75} />
        };
      case 'reaction':
        return {
          bg: 'bg-[#FCE8E9]', // danger bg
          iconColor: 'text-[#E5484D]', // danger
          icon: <Heart size={18} strokeWidth={1.75} />
        };
      case 'ask':
        return {
          bg: 'bg-[#F4F4F2]', // ink 100
          iconColor: 'text-[#2F2E2A]', // ink 700
          icon: <MessageCircle size={18} strokeWidth={1.75} />
        };
      case 'poll':
        return {
          bg: 'bg-[#FFF1D6]', // amber 100
          iconColor: 'text-[#7A4A00]', // amber fg
          icon: <SquareCheckBig size={18} strokeWidth={1.75} />
        };
      case 'faculty':
        return {
          bg: 'bg-[#E5EFFE]', // info bg
          iconColor: 'text-[#1B4B9E]', // info fg
          icon: <UsersRound size={18} strokeWidth={1.75} />
        };
      default:
        return {
          bg: 'bg-[#F4F4F2]',
          iconColor: 'text-[#75726A]',
          icon: <Signal size={18} strokeWidth={1.75} />
        };
    }
  };

  const rightActionElement = unreadCount > 0 ? (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleMarkAllRead}
      className="text-[#FF5A36] text-[14px] font-extrabold px-3 py-2 bg-transparent hover:bg-[#FFE7DF]/20 rounded-lg cursor-pointer outline-none border-none transition-colors"
    >
      Mark all read
    </motion.button>
  ) : null;

  const subtitleText = unreadCount > 0 ? `${unreadCount} unread` : 'All caught up';

  return (
    <>
      <AppOverlay
        isOpen={isOpen}
        onClose={onClose}
        title="Notifications"
        subtitle={subtitleText}
        rightAction={rightActionElement}
      >
        <div className="space-y-2.5 font-sans">
          {notifications.map((item) => {
            const styles = getKindStyles(item.kind);
            
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.99, opacity: 0.92 }}
                onClick={() => handleNotificationTap(item.id, item.title)}
                className={`flex gap-3 px-4 py-3.5 items-start rounded-[14px] text-left border cursor-pointer select-none transition-all ${
                  item.unread 
                    ? 'bg-[#FFF4F0] border-[#FFE7DF] shadow-sm' 
                    : 'bg-white border-[#ECEAE5] shadow-1'
                }`}
              >
                {/* LEFT: 38x38 square icon tile */}
                <div className={`w-[38px] h-[38px] rounded-[10px] ${styles.bg} ${styles.iconColor} flex items-center justify-center shrink-0`}>
                  {styles.icon}
                </div>

                {/* MIDDLE */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-[15px] font-bold text-[#0E0D0B] tracking-tight leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[13px] font-medium text-[#4D4B45] mt-1 leading-relaxed line-clamp-2">
                    {item.sub}
                  </p>
                  <span className="font-mono text-[11px] font-semibold text-[#75726A] mt-2 block tracking-tight">
                    {item.when}
                  </span>
                </div>

                {/* RIGHT: Optional unread dot indicator */}
                {item.unread && (
                  <div className="flex items-center justify-center pt-2">
                    <span className="w-2 h-2 bg-[#FF5A36] rounded-full shrink-0" />
                  </div>
                )}
              </motion.div>
            );
          })}
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
