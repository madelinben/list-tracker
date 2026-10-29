import {
  ArrowLeft,
  ChevronRight,
  LocateFixed,
  Navigation,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  type Item,
  itemsOf,
  type List,
  nearestTodo,
  presetById,
  progress,
  toggle,
  untickAll,
} from "../lib/lists";
import { Progress } from "./Progress";
import { field, ghost, primary } from "./ui";

interface Props {
  list: List;
  onChange: (l: List) => void;
  onBack: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function ListView({ list, onChange, onBack }: Props) {
  const [query, setQuery] = useState("");
  const [newItem, setNewItem] = useState("");
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState("");
  const preset = presetById(list.presetId);
  const items = itemsOf(list);
  const p = progress(list);
  const q = query.trim().toLowerCase();
  const shown = q
    ? items.filter((i) => i.name.toLowerCase().includes(q) || i.group?.toLowerCase().includes(q))
    : items;
  const groups = [...new Set(shown.map((i) => i.group ?? ""))];
  const located = items.some((i) => i.lat !== undefined);
  const own = new Set(list.items.map((i) => i.id));

  function locate() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setStatus("Location unavailable.")
    );
  }

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const name = newItem.trim().slice(0, 80);
    if (!name) return;
    onChange({ ...list, items: [...list.items, { id: crypto.randomUUID(), name }] });
    setNewItem("");
  }

  const row = (i: Item) => (
    <li
      key={i.id}
      className="flex items-center gap-1 rounded-xl bg-white pr-1 ring-1 ring-slate-200"
    >
      <label className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-3 px-3">
        <input
          type="checkbox"
          checked={!!list.done[i.id]}
          onChange={() => onChange(toggle(list, i.id, today()))}
          className="size-5 shrink-0 accent-teal-700"
        />
        <span
          className={`min-w-0 flex-1 ${list.done[i.id] ? "text-slate-500 line-through" : "font-semibold"}`}
        >
          {i.name}
        </span>
        {i.detail && (
          <span className="shrink-0 text-sm tabular-nums text-slate-600">{i.detail}</span>
        )}
        {list.done[i.id] && list.kind !== "packing" && (
          <span className="shrink-0 text-xs tabular-nums text-teal-800">
            {list.done[i.id]?.date}
          </span>
        )}
      </label>
      {own.has(i.id) && (
        <button
          type="button"
          onClick={() => onChange({ ...list, items: list.items.filter((x) => x.id !== i.id) })}
          aria-label={`Remove ${i.name}`}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-rose-700"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}
    </li>
  );

  return (
    <section aria-labelledby="list-h" className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold text-teal-800 underline hover:no-underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All lists
      </button>
      <div>
        <h2 id="list-h" className="text-2xl font-extrabold">
          {list.name}
        </h2>
        {preset && <p className="text-sm text-slate-700">{preset.blurb}</p>}
      </div>
      <Progress done={p.done} total={p.total} />

      <div className="flex flex-wrap gap-2">
        {items.length > 12 && (
          <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
            <span className="sr-only">Filter</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or area"
              className={field}
            />
          </label>
        )}
        {located && (
          <button type="button" onClick={locate} className={ghost}>
            <LocateFixed size={16} aria-hidden="true" /> Nearest to me
          </button>
        )}
        {list.kind === "packing" && p.done > 0 && (
          <button type="button" onClick={() => onChange(untickAll(list))} className={ghost}>
            <RotateCcw size={16} aria-hidden="true" /> Untick all for next time
          </button>
        )}
      </div>
      <p role="status" className="text-sm text-slate-700 empty:hidden">
        {status}
      </p>

      {here && (
        <section
          aria-labelledby="near-h"
          className="rounded-2xl bg-teal-50 p-3 ring-1 ring-teal-200"
        >
          <h3 id="near-h" className="mb-2 flex items-center gap-1 font-bold text-teal-900">
            <Navigation size={16} aria-hidden="true" /> Closest still to do
          </h3>
          <ol className="flex flex-col gap-1 text-sm">
            {nearestTodo(list, here).map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${i.lat}&mlon=${i.lng}#map=13/${i.lat}/${i.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  {i.name}
                  <span className="sr-only"> (map, opens in a new tab)</span>
                </a>
                <span className="tabular-nums text-slate-700">{Math.round(i.km)} km</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {groups.map((g) => {
        const inGroup = shown.filter((i) => (i.group ?? "") === g);
        const groupDone = inGroup.filter((i) => list.done[i.id]).length;
        return g ? (
          <details key={g} open={!!q || groups.length <= 3} className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-2 font-bold hover:bg-white focus-visible:outline-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-open:rotate-90 motion-reduce:transition-none"
              />
              <span className="flex-1">{g}</span>
              <span className="text-sm font-semibold tabular-nums text-slate-600">
                {groupDone}/{inGroup.length}
              </span>
            </summary>
            <ul className="mt-1 flex flex-col gap-1">{inGroup.map(row)}</ul>
          </details>
        ) : (
          <ul key="ungrouped" className="flex flex-col gap-1">
            {inGroup.map(row)}
          </ul>
        );
      })}

      <form onSubmit={addItem} className="flex gap-2">
        <label htmlFor="new-item" className="sr-only">
          Add an item
        </label>
        <input
          id="new-item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item"
          className={`${field} flex-1`}
        />
        <button type="submit" className={primary}>
          <Plus size={16} aria-hidden="true" /> Add
        </button>
      </form>
      {preset && <p className="text-xs text-slate-600">Data: {preset.source}.</p>}
    </section>
  );
}
