interface StatProps {
  value: string;
  label: string;
  /** Render for a dark/ink background. */
  onInk?: boolean;
  /** Optional small note under the label (e.g. data year / source). */
  note?: string;
}

/**
 * Instrument-panel statistic: large tabular serif value over a mono uppercase
 * label, sitting on a hairline. The "command center" readout unit.
 */
export default function Stat({ value, label, onInk = false, note }: StatProps) {
  return (
    <div className={`border-t ${onInk ? 'border-ink-700' : 'border-line'} pt-4`}>
      <div className={`stat-value ${onInk ? 'stat-value-ink' : ''} text-[length:var(--text-display-sm)]`}>
        {value}
      </div>
      <div className={`stat-label ${onInk ? 'stat-label-ink' : ''} mt-2`}>{label}</div>
      {note && (
        <div className={`mt-1 text-xs ${onInk ? 'text-steel-500' : 'text-ink-muted/70'}`}>{note}</div>
      )}
    </div>
  );
}
