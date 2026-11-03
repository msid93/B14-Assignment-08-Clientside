"use client";
import { useCallback, useEffect, useState } from "react";
import { request } from "./api";

export function useResource(path, fetcher = request, pollMs = 0) {
  const [result, setResult] = useState({});
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((n) => n + 1), []);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    let fetching = false;
    async function load() {
      if (fetching) return;
      fetching = true;
      try {
        const data = await fetcher(path, { signal: controller.signal });
        if (!controller.signal.aborted) setResult({ path, version, data });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ path, version, error });
      } finally {
        fetching = false;
      }
    }
    load();
    // Keep occupied hours and host decisions current while the tab is open.
    function onVisible() {
      if (document.visibilityState === "visible") load();
    }
    let timer;
    if (pollMs) {
      timer = window.setInterval(onVisible, pollMs);
      document.addEventListener("visibilitychange", onVisible);
    }
    return () => {
      controller.abort();
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [path, version, fetcher, pollMs]);
  const current = result.path === path && result.version === version;
  return {
    data: current ? result.data : undefined,
    error: current ? result.error : null,
    loading: !current,
    refresh,
  };
}
