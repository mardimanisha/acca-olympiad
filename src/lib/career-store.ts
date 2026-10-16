"use client";

import { useSyncExternalStore } from "react";
import { CAREER_BY_ID } from "./careers";

/** Selected career for the explorer, shared with the hero compass and mirrored in `#career=<id>`. */
const DEFAULT_ID = "ca";
const listeners = new Set<() => void>();
let picked: string | null = null;

function fromHash() {
  const m = window.location.hash.match(/career=([a-z]+)/);
  return m && CAREER_BY_ID[m[1]] ? m[1] : null;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onHash = () => {
    picked = fromHash() ?? picked;
    fn();
  };
  window.addEventListener("hashchange", onHash);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("hashchange", onHash);
  };
}

const getSnapshot = () => picked ?? fromHash() ?? DEFAULT_ID;
const getServerSnapshot = () => DEFAULT_ID;

export function useSelectedCareer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function selectCareer(id: string, opts: { scroll?: boolean } = {}) {
  if (!CAREER_BY_ID[id]) return;
  picked = id;
  window.history.replaceState(null, "", `#career=${id}`);
  listeners.forEach((fn) => fn());
  if (opts.scroll) document.getElementById("s05")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
