import { CRITERIA_COLUMNS } from '@/lib/constants';

export default function HeatmapHeader() {
  return (
    <div className="flex items-center pb-2 border-b border-zinc-800">
      <div className="flex-1 min-w-0" />
      <div className="flex gap-3 w-81 shrink-0 items-center">
        {CRITERIA_COLUMNS.map((col) => (
          <div
            key={col.key}
            className="w-12 text-center text-[11px] font-medium tracking-wide whitespace-nowrap text-zinc-500"
          >
            {col.label}
          </div>
        ))}

        {/* Avg header cell */}
        <div className="pl-7 text-center text-[11px] font-medium tracking-wide text-zinc-500">
          Average
        </div>
      </div>
    </div>
  );
}