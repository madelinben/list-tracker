import activities from "../data/activities.json" with { type: "json" };
import hills from "../data/hills.json" with { type: "json" };

export interface Item {
  id: string;
  name: string;
  group?: string;
  /** Extra detail, e.g. "978 m" */
  detail?: string;
  lat?: number;
  lng?: number;
}

/** A finished item: when, and an optional note */
export interface Tick {
  date: string;
  note?: string;
}

export type Kind = "challenge" | "packing" | "custom";

export interface List {
  id: string;
  name: string;
  kind: Kind;
  /** Built-in challenge whose items ship with the app (not copied into storage) */
  presetId?: string;
  /** Own items: packing lists, custom lists, extras added to a preset */
  items: Item[];
  done: Record<string, Tick>;
  createdAt: string;
}

export interface ListData {
  version: 1;
  lists: List[];
}

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  source: string;
  items: Item[];
}

export interface Template {
  id: string;
  name: string;
  items: string[];
}

export const EMPTY: ListData = { version: 1, lists: [] };

export const CHALLENGES: readonly Preset[] = [
  {
    id: "try-52",
    name: "Try 52",
    blurb: "A new activity every week for a year. Pick any 52 of these, or go for the lot.",
    source: activities.source,
    items: activities.items.map(([id, name, group]) => ({ id, name, group })),
  },
  ...hills.lists.map((l) => ({
    id: l.id,
    name: l.name,
    blurb: l.blurb,
    source: hills.source,
    items: l.items.map(([n, name, lat, lng, metres, region]) => ({
      id: String(n),
      name: String(name),
      group: String(region),
      detail: `${metres} m`,
      lat: Number(lat),
      lng: Number(lng),
    })),
  })),
];

/** Starting points only: every template is copied into the list and can be edited */
export const TEMPLATES: readonly Template[] = [
  {
    id: "day-hike",
    name: "Day hike",
    items: [
      "Waterproof jacket",
      "Warm layer",
      "Walking boots",
      "Map and compass",
      "Phone and power bank",
      "Water (1.5 L)",
      "Lunch and snacks",
      "Hat and gloves",
      "Sun cream",
      "First aid kit",
      "Head torch",
      "Whistle",
    ],
  },
  {
    id: "camping",
    name: "Camping",
    items: [
      "Tent, poles and pegs",
      "Sleeping bag",
      "Sleeping mat",
      "Pillow",
      "Stove and gas",
      "Lighter",
      "Pan, mug and spork",
      "Water bottle and filter",
      "Head torch",
      "Warm layers",
      "Toiletries and towel",
      "Rubbish bag",
      "Toilet roll and trowel",
      "First aid kit",
    ],
  },
  {
    id: "swim",
    name: "Swim (pool or open water)",
    items: [
      "Swimsuit",
      "Goggles",
      "Swim cap",
      "Towel",
      "Flip-flops",
      "Padlock or £1 coin",
      "Shampoo",
      "Tow float (open water)",
      "Changing robe (open water)",
      "Warm drink (open water)",
    ],
  },
  {
    id: "gym",
    name: "Gym bag",
    items: [
      "Trainers",
      "Shorts or leggings",
      "Top",
      "Water bottle",
      "Towel",
      "Headphones",
      "Padlock",
      "Membership card",
      "Shower kit",
      "Snack",
    ],
  },
  {
    id: "run-race",
    name: "Race day (run)",
    items: [
      "Race number and pins",
      "Timing chip",
      "Running shoes",
      "Race kit",
      "Watch charged",
      "Gels",
      "Vaseline",
      "Throwaway layer",
      "Post-race clothes",
      "Cash and card",
    ],
  },
  {
    id: "bike-ride",
    name: "Bike ride",
    items: [
      "Helmet",
      "Lights (front and rear)",
      "Spare tube",
      "Tyre levers",
      "Pump or CO2",
      "Multi-tool",
      "Water bottles",
      "Snacks",
      "Rain jacket",
      "Lock",
      "Phone and card",
    ],
  },
  {
    id: "team-match",
    name: "Match day (team sport)",
    items: [
      "Kit and socks",
      "Boots or court shoes",
      "Shin pads / gum shield",
      "Water bottle",
      "Subs or match fee",
      "Towel",
      "Spare laces",
      "Snack",
    ],
  },
  {
    id: "climbing",
    name: "Climbing",
    items: [
      "Shoes",
      "Harness",
      "Chalk bag",
      "Belay device and screwgate",
      "Helmet",
      "Water",
      "Tape",
      "Snacks",
    ],
  },
  {
    id: "beach",
    name: "Beach day",
    items: [
      "Swimwear",
      "Towel",
      "Sun cream",
      "Sunglasses",
      "Hat",
      "Water",
      "Snacks",
      "Windbreak",
      "Bag for wet things",
      "Bucket and spade",
    ],
  },
  {
    id: "festival",
    name: "Festival",
    items: [
      "Ticket",
      "Tent and sleeping bag",
      "Wellies",
      "Waterproof",
      "Power bank",
      "Wet wipes",
      "Toilet roll",
      "Ear plugs",
      "Sun cream",
      "Reusable cup",
      "Cash and card",
    ],
  },
  {
    id: "ski",
    name: "Ski trip",
    items: [
      "Ski jacket and trousers",
      "Base layers",
      "Gloves",
      "Goggles",
      "Helmet",
      "Neck warmer",
      "Ski socks",
      "Sun cream and lip balm",
      "Lift pass",
      "Insurance details",
    ],
  },
  {
    id: "holiday",
    name: "Holiday abroad",
    items: [
      "Passport",
      "Tickets and boarding passes",
      "Travel insurance",
      "Bank card and currency",
      "Adapter plug",
      "Chargers",
      "Medication",
      "Toiletries",
      "Sunglasses",
      "Clothes for each day",
    ],
  },
  {
    id: "day-out-kids",
    name: "Day out with kids",
    items: [
      "Nappies and wipes",
      "Change of clothes",
      "Snacks",
      "Water bottles",
      "Sun cream",
      "Hats",
      "Plasters",
      "Entertainment for the car",
      "Raincoats",
    ],
  },
];

export const presetById = (id: string | undefined) => CHALLENGES.find((c) => c.id === id);

/** Preset items plus the list's own items */
export function itemsOf(list: List): Item[] {
  return [...(presetById(list.presetId)?.items ?? []), ...list.items];
}

export function progress(list: List): { done: number; total: number } {
  const items = itemsOf(list);
  return { done: items.filter((i) => list.done[i.id]).length, total: items.length };
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Closest items still to do, for lists with locations */
export function nearestTodo(list: List, from: { lat: number; lng: number }, limit = 5) {
  return itemsOf(list)
    .flatMap((i) =>
      i.lat !== undefined && i.lng !== undefined && !list.done[i.id]
        ? [{ ...i, km: distanceKm(from, { lat: i.lat, lng: i.lng }) }]
        : []
    )
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

const base = (kind: Kind, name: string): List => ({
  id: crypto.randomUUID(),
  name,
  kind,
  items: [],
  done: {},
  createdAt: new Date().toISOString(),
});

export const newChallenge = (preset: Preset): List => ({
  ...base("challenge", preset.name),
  presetId: preset.id,
});

export const newPacking = (name: string, template?: Template): List => ({
  ...base("packing", name),
  items: (template?.items ?? []).map((n) => ({ id: crypto.randomUUID(), name: n })),
});

export const newCustom = (name: string): List => base("custom", name);

/** Packing lists reset for the next trip */
export const untickAll = (list: List): List => ({ ...list, done: {} });

export function toggle(list: List, itemId: string, today: string): List {
  const { [itemId]: was, ...rest } = list.done;
  return { ...list, done: was ? rest : { ...list.done, [itemId]: { date: today } } };
}

export function parseLists(raw: unknown): ListData | null {
  if (typeof raw !== "object" || raw === null) return null;
  const d = raw as Partial<ListData>;
  return d.version === 1 && Array.isArray(d.lists) ? { version: 1, lists: d.lists } : null;
}
