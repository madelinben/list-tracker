import { Backpack, ChevronRight, ListPlus, Mountain, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CHALLENGES, type List, type ListData, newChallenge, newCustom, newPacking, progress, TEMPLATES } from "../lib/lists";
import { Progress } from "./Progress";
import { card, field, primary } from "./ui";

const KIND_LABEL = { challenge: "Challenge", packing: "Packing list", custom: "List" } satisfies Record<List["kind"], string>;

interface Props {
  data: ListData;
  onChange: (d: ListData) => void;
  onOpen: (id: string) => void;
}

export function Home({ data, onChange, onOpen }: Props) {
  const [template, setTemplate] = useState(TEMPLATES[0]?.id ?? "");
  const [packName, setPackName] = useState("");
  const [customName, setCustomName] = useState("");

  const add = (list: List) => {
    onChange({ ...data, lists: [list, ...data.lists] });
    onOpen(list.id);
  };

  return (
    <div className="flex flex-col gap-6">
      {data.lists.length > 0 && (
        <section aria-labelledby="mine-h" className="flex flex-col gap-2">
          <h2 id="mine-h" className="text-xl font-extrabold">
            Your lists
          </h2>
          <ul className="flex flex-col gap-2">
            {data.lists.map((l) => {
              const p = progress(l);
              return (
                <li key={l.id} className={`${card} flex items-center gap-2 p-2`}>
                  <button
                    type="button"
                    onClick={() => onOpen(l.id)}
                    className="flex min-h-12 flex-1 flex-col gap-1 rounded-xl px-2 py-1 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-700"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-bold">{l.name}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                        {KIND_LABEL[l.kind]}
                        <ChevronRight size={16} aria-hidden="true" />
                      </span>
                    </span>
                    <Progress done={p.done} total={p.total} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete ${l.name}?`)) onChange({ ...data, lists: data.lists.filter((x) => x.id !== l.id) });
                    }}
                    aria-label={`Delete ${l.name}`}
                    className="grid size-11 place-items-center rounded-xl text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-700"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="challenge-h" className="flex flex-col gap-2">
        <h2 id="challenge-h" className="flex items-center gap-2 text-xl font-extrabold">
          <Mountain size={20} aria-hidden="true" /> Start a challenge
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CHALLENGES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => add(newChallenge(c))}
                className={`${card} flex h-full w-full flex-col gap-1 text-left hover:ring-teal-600 focus-visible:outline-2 focus-visible:outline-teal-700`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-bold">{c.name}</span>
                  <span className="text-sm tabular-nums text-slate-600">{c.items.length}</span>
                </span>
                <span className="text-sm text-slate-700">{c.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = TEMPLATES.find((x) => x.id === template);
          add(newPacking(packName.trim().slice(0, 60) || t?.name || "Packing list", t));
          setPackName("");
        }}
        className={`${card} flex flex-col gap-3`}
      >
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Backpack size={20} aria-hidden="true" /> Packing list
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Start from
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className={field}>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
              <option value="">Blank list</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Name (optional)
            <input value={packName} onChange={(e) => setPackName(e.target.value)} placeholder="Snowdon weekend" className={field} />
          </label>
        </div>
        <button type="submit" className={primary}>
          <Plus size={16} aria-hidden="true" /> Create packing list
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!customName.trim()) return;
          add(newCustom(customName.trim().slice(0, 60)));
          setCustomName("");
        }}
        className={`${card} flex flex-col gap-3`}
      >
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <ListPlus size={20} aria-hidden="true" /> Your own list
        </h2>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Name
          <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Every lido in London, cathedrals, climbing grades…" className={field} required />
        </label>
        <button type="submit" disabled={!customName.trim()} className={primary}>
          <Plus size={16} aria-hidden="true" /> Create list
        </button>
      </form>
    </div>
  );
}
