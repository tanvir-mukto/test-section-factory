import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface AppOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  headerContent?: React.ReactNode; // Replaces Middle title block
  children: React.ReactNode;
}

export default function AppOverlay({
  isOpen,
  onClose,
  title,
  subtitle,
  rightAction,
  headerContent,
  children
}: AppOverlayProps) {
  // Add ESC key listener for Android-like hard back button equivalent
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} 
          className="absolute inset-x-0 top-0 bottom-[72px] z-[60] bg-white flex flex-col font-sans overflow-hidden border-b border-[#ECEAE5] shadow-3"
        >
          {/* Header 64px Bar */}
          <div className="h-16 border-b border-[#ECEAE5] px-4 flex items-center justify-between shrink-0 bg-white select-none">
            {/* LEFT Back Chevron */}
            <motion.button
              whileTap={{ scale: 0.95, opacity: 0.85 }}
              onClick={onClose}
              className="w-11 h-11 rounded-[10px] bg-transparent flex items-center justify-center text-[#0E0D0B] cursor-pointer outline-none border-none hover:bg-[#F4F4F2]"
            >
              <ChevronLeft size={22} strokeWidth={1.75} />
            </motion.button>

            {/* MIDDLE (Flex 1) */}
            <div className="flex-1 mx-3 px-1 min-w-0">
              {headerContent ? (
                headerContent
              ) : (
                <div className="text-left">
                  <h2 className="text-[20px] font-bold text-[#0E0D0B] tracking-tight leading-none leading-tight truncate">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-[12px] font-medium text-[#75726A] mt-1 leading-none truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT Action (if any) */}
            <div className="flex items-center justify-end shrink-0 min-w-max">
              {rightAction}
            </div>
          </div>

          {/* Body content scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 text-left">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
