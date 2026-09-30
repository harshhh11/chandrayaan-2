'use client';

import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, X, Radio, ArrowUpRight } from 'lucide-react';
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
    link: '/analysis',
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

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#07111F]/98 border-l border-[#4DEBFF]/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0B1726]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2F80FF]/20 border border-[#4DEBFF]/30 flex items-center justify-center text-[#4DEBFF]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                  MISSION ALERTS & LOGS
                </h3>
                <p className="text-[10px] font-mono text-white/50">
                  {notifications.filter(n => !n.read).length} unacknowledged events
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-mono text-[#4DEBFF] hover:underline px-2 py-1"
              >
                Mark Read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-xs font-mono">
                No active telemetry alerts
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    n.read
                      ? 'bg-white/[0.02] border-white/5 opacity-70'
                      : 'bg-[#0B1726]/80 border-[#4DEBFF]/30 shadow-[0_0_15px_rgba(0,184,255,0.08)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-[#24D99B]" />}
                      {n.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-[#FFB547]" />}
                      {n.type === 'CRITICAL' && <AlertCircle className="w-4 h-4 text-[#FF5C67]" />}
                      {n.type === 'INFO' && <Radio className="w-4 h-4 text-[#4DEBFF]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
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
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-[#4DEBFF] hover:underline mt-2.5"
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
          <div className="p-4 border-t border-white/10 bg-[#050A12] flex items-center justify-between text-[11px] font-mono text-white/40">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#24D99B] animate-ping" />
              TELEMETRY BUS: 100% SYNC
            </span>
            <button
              onClick={clearAll}
              className="hover:text-white transition-colors"
            >
              Clear Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
