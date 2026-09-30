'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { apiClient } from '@/lib/api';
import { RegistrationJob } from '@/types/api';

export default function ProcessingJobsPage() {
  const [jobs, setJobs] = useState<RegistrationJob[]>([]);

  useEffect(() => {
    apiClient.listJobs().then((items) => {
      if (items.length > 0) setJobs(items);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8 font-mono">
        <div className="flex flex-col gap-1 pb-6 border-b border-white/10">
          <span className="text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            AUDIT LOG // ASYNCHRONOUS ENGINE QUEUE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            PROCESSING JOBS & EXECUTION TRACE
          </h1>
        </div>

        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="text-xs text-[#00C8FF] font-bold uppercase pb-2 border-b border-white/10">
            RECENT REGISTRATION JOBS
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px]">
                  <th className="py-3">JOB ID</th>
                  <th>SOURCE SENSOR</th>
                  <th>REFERENCE SENSOR</th>
                  <th>STATUS</th>
                  <th>INLIERS</th>
                  <th>RMSE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {jobs.length > 0 ? (
                  jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 text-[#00C8FF] font-bold">{j.id}</td>
                      <td>{j.source_sensor}</td>
                      <td>{j.reference_sensor}</td>
                      <td>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-bold">
                          {j.status}
                        </span>
                      </td>
                      <td className="text-emerald-400">{j.metrics?.inlier_count || '—'}</td>
                      <td className="text-white">{j.metrics?.rmse_px ? `${j.metrics.rmse_px} px` : '—'}</td>
                      <td>
                        <Link
                          href={`/match?job=${j.id}`}
                          className="text-[#00C8FF] hover:underline text-[11px]"
                        >
                          INSPECT →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-white/40">
                      NO ACTIVE JOBS FOUND. INITIALIZE A NEW REGISTRATION TO VIEW TRACES.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
