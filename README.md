# List Tracker

Checklists for everything: hill-bagging and 52-activity challenges, packing lists for any trip or sport, or your own list.

- Challenges that ship with the app: **Try 52** (a new activity a week from 90 activity types), **Wainwrights** (214), **Munros** (282), **Corbetts**, **Grahams**, **Donalds** and **Hewitts** with heights, areas and coordinates
- Tick items off with the date, filter by name or area, and see the closest ones still to do from your location
- Packing lists from templates (day hike, camping, swim, gym, race day, bike ride, match day, climbing, beach, festival, ski, holiday, kids' day out), editable, with untick-all for next time
- Your own lists for anything else
- Data stays in the browser (localStorage). Download a backup file and restore it on any device.

Hill data: Database of British and Irish Hills v18 (CC BY 4.0, hill-bagging.co.uk). Regenerate with `python scripts/hills.py DoBIH_v18_6.csv`.

Two ways this repo ships, from the same `src/`:

| Target | How |
|---|---|
| **GitHub Pages** (`madelinben.github.io/list-tracker/`) | `pnpm build:demo` builds `demo/` into `docs/` (Pages source: `main` / `/docs`) |
| **get-out-there** (Cloudflare) | imported as workspace package `@get-out-there/list` (`ListApp`) |

```bash
pnpm install
pnpm dev          # demo at http://localhost:3107/list-tracker/
pnpm test         # logic unit tests
pnpm build:demo   # static site -> docs/
```

Package rules: no router/auth/app imports; Tailwind default palette only (no custom tokens); host must `@source` this folder. Peer deps: react, react-dom, lucide-react.

Host hook: `<ListApp beforeExport={gate} />` runs `gate(label)` before a backup download or restore (e.g. an ad gate); reject to cancel.
