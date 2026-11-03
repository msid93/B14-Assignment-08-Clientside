"use client";
import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useResource } from "../lib/use-resource";
import { Loading, Problem } from "./States";

const Session = createContext(null);
export function SessionProvider({ children }) {
  const state = useResource("/auth/get-session");
  return (
    <Session.Provider value={{ ...state, user: state.data?.user }}>{children}</Session.Provider>
  );
}
export const useSession = () => useContext(Session);

export function Private({ children }) {
  const { user, loading, error, refresh } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !error && !user) {
      const next = pathname + window.location.search;
      router.replace("/login?next=" + encodeURIComponent(next));
    }
  }, [loading, error, user, pathname, router]);
  if (error) return <Problem error={error} retry={refresh} />;
  if (loading || !user) return <Loading label="Checking your studio pass" />;
  return children;
}
