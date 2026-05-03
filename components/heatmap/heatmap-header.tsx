import { CRITERIA_COLUMNS } from '@/lib/constants';

export default function HeatmapHeader() {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
      <div className="w-40 shrink-0" />
      <div className="flex flex-1 gap-2">
        {CRITERIA_COLUMNS.map((col) => (
          <div
            key={col.key}
            className="
              flex-1
              text-center
              text-[11px]
              font-semibold
              tracking-widest
              uppercase
              text-zinc-500
            "
          >
            {col.label}
          </div>
        ))}
        <div className="
          w-16
          shrink-0
          text-center
          text-[11px]
          font-semibold
          tracking-widest
          uppercase
          text-zinc-500
        ">
          Avg
        </div>
      </div>
    </div>
  );
}