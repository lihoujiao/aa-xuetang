"use client";

import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  nickname: string;
  phoneMasked: string;
  wechatBound: boolean;
};

type Listener = () => void;

let cached: SessionUser | null | undefined;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export async function refreshMe() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    const data = res.ok ? await res.json() : { user: null };
    cached = data.user ?? null;
  } catch {
    cached = null;
  }
  emit();
  return cached;
}

export function setMe(user: SessionUser | null) {
  cached = user;
  emit();
}

export function useMe() {
  const [user, setUser] = useState<SessionUser | null | undefined>(cached);
  useEffect(() => {
    const listener = () => setUser(cached);
    listeners.add(listener);
    if (cached === undefined) void refreshMe();
    else setUser(cached);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return user;
}

export async function logout() {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  setMe(null);
}
