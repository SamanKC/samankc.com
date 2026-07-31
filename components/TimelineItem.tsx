import type { TimelineEntry } from '@/data/timeline';

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  job: 'Job',
  education: 'Education',
  achievement: 'Achievement',
};

const KIND_DOT: Record<TimelineEntry['kind'], string> = {
  job: 'bg-ember-600 dark:bg-ember-400',
  education: 'border-2 border-ember-600 dark:border-ember-400',
  achievement: 'bg-ink-600 dark:bg-ink-400',
};

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative border-l-2 border-ink-200 pb-10 pl-8 last:pb-0 dark:border-ink-700">
      <span
        className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${KIND_DOT[entry.kind]}`}
        aria-hidden="true"
      />
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-400">
        {KIND_LABEL[entry.kind]} &middot; {entry.dateRange}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold text-ink-950 dark:text-ink-100">{entry.title}</h3>
      <p className="text-sm font-medium text-ember-600 dark:text-ember-400">{entry.organization}</p>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{entry.description}</p>
    </div>
  );
}
