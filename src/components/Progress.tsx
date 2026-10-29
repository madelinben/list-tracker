export function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums text-slate-700">
        {done}/{total}
      </span>
    </div>
  );
}
