import type { TimelineEntry } from '@/data/timeline';

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  job: 'Job',
  education: 'Education',
  achievement: 'Achievement',
};

const KIND_COLOR: Record<TimelineEntry['kind'], string> = {
  job: 'bg-violet-600',
  education: 'bg-cyan-500',
  achievement: 'bg-fuchsia-500',
};

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative border-l-2 border-slate-200 pb-10 pl-8 last:pb-0 dark:border-white/10">
      <span
        className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${KIND_COLOR[entry.kind]}`}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {KIND_LABEL[entry.kind]} &middot; {entry.dateRange}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
      <p className="text-sm font-medium text-violet-600 dark:text-cyan-400">{entry.organization}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.description}</p>
    </div>
  );
}
