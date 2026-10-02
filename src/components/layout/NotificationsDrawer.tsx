'use client';

import React, { useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, X, Radio, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'INFO' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  link?: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'SUCCESS',
    title: 'Registration Job Completed',
    message: 'Pair REG-20260930-001 (OHRC ↔ TMC-2) reached 92.7% confidence with 0.72px median error.',
    timestamp: '2 mins ago',
    link: '/correspondence',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'WARNING',
    title: 'High Sun-Angle Delta Detected',
    message: 'Dataset pair in Boguslawsky Crater exhibits 35.7° solar elevation divergence. Phase congruency normalization enabled.',
    timestamp: '14 mins ago',
    link: '/analytics',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'INFO',
    title: 'Chandrayaan-2 Orbital Pass',
    message: 'AOS (Acquisition of Signal) with ISTRAC Ground Station (Byalalu) scheduled in 12m 34s.',
    timestamp: '28 mins ago',
    link: '/dashboard',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'SUCCESS',
    title: 'New PDS4 Optical Swaths Indexed',
    message: '24 new Level-2 calibrated OHRC and TMC-2 products added to the local repository.',
    timestamp: '1 hour ago',
    link: '/datasets',
    read: true,
  }
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Click-outside backdrop with z-[70] */}
      <div 
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px] transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Aerospace Notification Popover */}
      <div 
        className="fixed top-16 right-3 sm:right-6 z-[80] w-[calc(100vw-1.5rem)] sm:w-[440px] max-h-[calc(100vh-5rem)] bg-[#07111D]/98 border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mission Alerts and Telemetry Logs"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#0B1728]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38A8FF]/15 border border-[#38A8FF]/30 flex items-center justify-center text-[#38A8FF] shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                  MISSION ALERTS & LOGS
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#EF4444] text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-white/50">
                {unreadCount} unacknowledged telemetry events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-mono text-[#38A8FF] hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors"
                title="Mark all as acknowledged"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Close notifications (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-white/40 text-xs font-mono">
              <Bell className="w-6 h-6 mx-auto mb-2 text-white/20" />
              No active telemetry alerts
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  n.read
                    ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:border-white/10'
                    : 'bg-[#0B182B]/80 border-[#38A8FF]/30 shadow-[0_0_15px_rgba(56,168,255,0.08)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-[#24D99B]" />}
                    {n.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-[#FFB547]" />}
                    {n.type === 'CRITICAL' && <AlertCircle className="w-4 h-4 text-[#FF5C67]" />}
                    {n.type === 'INFO' && <Radio className="w-4 h-4 text-[#38A8FF]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 mt-1 font-sans leading-relaxed">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#38A8FF] hover:text-white hover:underline mt-2.5 transition-colors"
                      >
                        <span>Open Telemetry View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-[#050B14] flex items-center justify-between text-[11px] font-mono text-white/40">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#24D99B] animate-pulse" />
            TELEMETRY BUS: 100% SYNC
          </span>
          <button
            onClick={clearAll}
            className="hover:text-white transition-colors text-[10px] uppercase tracking-wider"
          >
            Clear Log
          </button>
        </div>
      </div>
    </>
  );
};

