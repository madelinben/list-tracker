import { useEffect, useRef, useState } from "react";
import { DataBackup } from "./components/DataBackup";
import { Home } from "./components/Home";
import { ListView } from "./components/ListView";
import { EMPTY, type ListData, parseLists } from "./lib/lists";
import { type BeforeExport, load, save } from "./lib/storage";

const KEY = "list-tracker";

export function ListApp({ beforeExport }: { beforeExport?: BeforeExport }) {
  const [data, setData] = useState<ListData>(EMPTY);
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  // switching view starts at the top
  const go = (id: string | null) => {
    setOpenId(id);
    scroller.current?.scrollTo({ top: 0 });
  };

  // Load after mount: localStorage is unavailable during SSR and would cause a hydration mismatch.
  useEffect(() => {
    setData(parseLists(load<unknown>(KEY, null)) ?? EMPTY);
    setReady(true);
  }, []);

  const update = (next: ListData) => {
    setData(next);
    save(KEY, next);
  };
  const open = data.lists.find((l) => l.id === openId);

  if (!ready) return <div className="h-full animate-pulse bg-slate-100" />;

  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
        {open ? (
          <ListView
            key={open.id}
            list={open}
            onChange={(l) =>
              update({ ...data, lists: data.lists.map((x) => (x.id === l.id ? l : x)) })
            }
            onBack={() => go(null)}
          />
        ) : (
          <>
            <Home data={data} onChange={update} onOpen={go} />
            <DataBackup
              filename="list-tracker.json"
              data={data}
              parse={parseLists}
              onRestore={update}
              beforeExport={beforeExport}
            />
          </>
        )}
      </div>
    </div>
  );
}
