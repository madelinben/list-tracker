import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHALLENGES,
  itemsOf,
  nearestTodo,
  newChallenge,
  newPacking,
  presetById,
  progress,
  TEMPLATES,
  toggle,
  untickAll,
} from "./lists.ts";

test("hill and activity challenges ship with the app", () => {
  assert.equal(presetById("wainwrights")?.items.length, 214);
  assert.equal(presetById("munros")?.items.length, 282);
  assert.ok((presetById("try-52")?.items.length ?? 0) >= 52);
  assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, CHALLENGES.length);
});

test("ticking a preset item counts towards progress and nearest skips it", () => {
  const preset = presetById("wainwrights");
  assert.ok(preset);
  let list = newChallenge(preset);
  const keswick = { lat: 54.6, lng: -3.13 };
  const [first] = nearestTodo(list, keswick, 1);
  assert.ok(first);
  list = toggle(list, first.id, "2026-10-29");
  assert.deepEqual(progress(list), { done: 1, total: 214 });
  assert.notEqual(nearestTodo(list, keswick, 1)[0]?.id, first.id);
  assert.equal(itemsOf(toggle(list, first.id, "")).length, 214);
  assert.deepEqual(progress(toggle(list, first.id, "")).done, 0);
});

test("packing lists copy the template and reset", () => {
  const t = TEMPLATES.find((x) => x.id === "swim");
  let list = newPacking("Saturday swim", t);
  assert.equal(list.items.length, t?.items.length);
  list = toggle(list, list.items[0]?.id ?? "", "today");
  assert.equal(progress(untickAll(list)).done, 0);
});
