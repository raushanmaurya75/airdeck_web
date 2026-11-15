import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const INITIAL_SCHEDULES = [
  {
    id: 'block-01',
    time: '07:30 - 11:30',
    title: 'Morning Block',
    subtitle: 'Loop: Convocation Keynote Reel • All Paired Displays (Mon – Sat)',
    status: 'ACTIVE',
  },
  {
    id: 'block-02',
    time: '11:30 - 16:30',
    title: 'Afternoon Block',
    subtitle: 'Loop: Dining Hall Daily Specials • Dining & Commons Zones (Mon – Fri)',
    status: 'ACTIVE',
  },
  {
    id: 'block-03',
    time: '16:30 - 22:00',
    title: 'Evening Block',
    subtitle: 'Loop: End-Semester Exam Timetable • Academic & Library Zones (Daily)',
    status: 'ACTIVE',
  },
];

export default function SchedulesWorkspace() {
  const { info } = useToast();
  const [schedules] = useState(INITIAL_SCHEDULES);

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary-token font-sans">
              Dayparting Schedules
            </h1>
            <p className="mt-1 text-xs text-secondary-token font-sans">
              Rules execute deterministically against each Android TV Real-Time Clock.
            </p>
          </div>

          <button
            onClick={() => info('New Time Block', 'Configuring automated dayparting schedule rule.')}
            className="btn-ref-primary flex items-center gap-1.5 px-4 py-2 rounded text-xs sm:text-sm font-medium shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Time Block</span>
          </button>
        </div>

        <div className="space-y-3">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="rounded bg-surface border border-hairline p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
                <div className="px-3 py-1.5 rounded bg-recessed border border-hairline text-xs sm:text-sm font-mono font-bold tracking-wider text-brand-accent shrink-0 self-start sm:self-center">
                  {item.time}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-primary-token font-sans leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-secondary-token mt-1 font-sans truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
