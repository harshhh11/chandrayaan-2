'use client';

import React from 'react';

export const IntelligenceSection: React.FC = () => {
  const capabilities = [
    {
      num: '01',
      title: 'MONITORING',
      desc: 'Real-time telemetry streaming and state tracking across every physical and orbital asset.',
    },
    {
      num: '02',
      title: 'ANALYTICS',
      desc: 'High-throughput temporal analysis and deep performance metrics calculated on-the-fly.',
    },
    {
      num: '03',
      title: 'PREDICTION',
      desc: 'Machine learning forecasting models predicting degradation and system load curves hours in advance.',
    },
    {
      num: '04',
      title: 'ANOMALY DETECTION',
      desc: 'Autonomous multi-variate anomaly classifiers detecting micro-deviations before threshold breaches.',
    },
    {
      num: '05',
      title: 'DEPENDENCY ANALYSIS',
      desc: 'Topological impact mapping identifying systemic vulnerabilities across complex interconnected graphs.',
    },
    {
      num: '06',
      title: 'AI COPILOT',
      desc: 'On-demand natural language query engine providing instant operational root-cause synthesis.',
    },
    {
      num: '07',
      title: 'ALERTS',
      desc: 'Intelligent triage and priority dispatch with deterministic escalation rules and zero alert fatigue.',
    },
    {
      num: '08',
      title: 'ASSET MANAGEMENT',
      desc: 'Comprehensive lifecycle, configuration state, and cryptographic provenance tracking per component.',
    },
    {
      num: '09',
      title: 'INCIDENT MANAGEMENT',
      desc: 'Automated remediation playbooks and coordinated multi-team operational dispatch protocols.',
    },
    {
      num: '10',
      title: 'ENERGY MONITORING',
      desc: 'Dynamic solar array yield optimization, battery impedance modeling, and power bus load balancing.',
    },
    {
      num: '11',
      title: '3D VISUALIZATION',
      desc: 'High-fidelity spatial orientation, structural thermal mapping, and orbital trajectory rendering.',
    },
    {
      num: '12',
      title: 'REAL-TIME SYNC',
      desc: 'Sub-millisecond state synchronization across distributed orbital ground station nodes.',
    },
  ];

  return (
    <section id="intelligence" className="relative w-full min-h-screen bg-[#07111a] text-white px-6 sm:px-12 lg:px-20 py-28 flex flex-col justify-between border-t border-white/[0.06] select-none">
      {/* Top Section Label */}
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-sky-400">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
        <span>02 // INTELLIGENCE</span>
      </div>

      {/* Main Heading */}
      <div className="max-w-4xl flex flex-col gap-6 my-12">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.035em] text-white uppercase leading-[0.92]">
          FROM DATA<br />
          TO DECISIONS.
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/70 font-sans font-light max-w-xl leading-relaxed">
          Transform raw sensor feeds into autonomous operational awareness and high-confidence decision support.
        </p>
      </div>

      {/* 6 Minimalist Editorial Capability Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-12 border-y border-white/10">
        {capabilities.map((cap) => (
          <div key={cap.title} className="flex flex-col gap-3 group">
            <div className="text-[10px] font-mono tracking-widest text-sky-400">
              {cap.num} // CAPABILITY
            </div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-sky-300 transition-colors">
              {cap.title}
            </h3>
            <p className="text-xs text-white/55 font-sans leading-relaxed">
              {cap.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div id="monitoring" className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 pt-6 border-t border-white/5">
        <div>SYSTEM INTELLIGENCE SUITE</div>
        <div>PREDICTIVE OPERATIONAL ENGINE</div>
      </div>
    </section>
  );
};
