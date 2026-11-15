"use client";

import { useSyncExternalStore } from "react";

const KEY = "aa-user";
const EVENT = "aa-session";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function snapshot() {
  return localStorage.getItem(KEY);
}

export function useUser() {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

export function signIn(name: string) {
  localStorage.setItem(KEY, name.trim() || "学员");
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
