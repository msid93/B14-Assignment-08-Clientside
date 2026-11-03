"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Aperture, ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { toast } from "sonner";
import { request } from "../lib/api";
import { useSession } from "./Session";

const main = [
  ["Home", "/"],
  ["Explore studios", "/studios"],
  ["How it works", "/how-it-works"],
  ["About us", "/about"],
];
export const deskLinks = [
  ["Dashboard", "/dashboard"],
  ["Add new studio", "/add-studio"],
  ["My studio listings", "/my-listings"],
  ["My bookings", "/my-bookings"],
];
export function Brand() {
  return (
    <Link href="/" className="brand">
      <Aperture aria-hidden="true" strokeWidth={2.1} />
      <span>
        StudioSpace<span className="wordmark-dot">.</span>
      </span>
    </Link>
  );
}
export default function Header() {
  const { user, loading, refresh } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const box = useRef(null);
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  useEffect(() => {
    setMenu(false);
    setProfile(false);
  }, [pathname]);
  useEffect(() => {
    function close(event) {
      if (!box.current?.contains(event.target) || event.key === "Escape") setProfile(false);
      if (event.key === "Escape") setMenu(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  function theme() {
    const value = dark ? "light" : "dark";
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem("studio-theme", value);
    } catch {}
    setDark(!dark);
  }
  async function logout() {
    try {
      await request("/auth/sign-out", { method: "POST", body: {} });
      await request("/session/access", { method: "DELETE" }).catch(() => {});
      setProfile(false);
      refresh();
      router.replace("/");
      toast.success("You’ve signed out.");
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <header className="mast">
      <div className="shell nav">
        <Brand />
        <nav className={menu ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          {main.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || (href === "/studios" && pathname.startsWith("/studios/"))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={theme}
          >
            {dark ? <Sun /> : <Moon />}
          </button>
          {loading ? (
            <span className="nav-placeholder" aria-label="Checking session" />
          ) : user ? (
            <div className="account" ref={box}>
              <button
                className="profile-btn"
                onClick={() => setProfile(!profile)}
                aria-expanded={profile}
                aria-label="Open account menu"
              >
                {user.image ? (
                  <img src={user.image} alt="" />
                ) : (
                  <span className="avatar">{user.name.slice(0, 1)}</span>
                )}
                <ChevronDown size={14} />
              </button>
              {profile && (
                <div className="dropdown">
                  <strong>{user.name}</strong>
                  {deskLinks.map(([label, href]) => (
                    <Link key={href} href={href} onClick={() => setProfile(false)}>
                      {label}
                    </Link>
                  ))}
                  <button onClick={logout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="login-link" href="/login">
                Login
              </Link>
              <Link className="btn small register-btn" href="/register">
                Register <ArrowUpRight size={13} />
              </Link>
            </>
          )}
          <button
            className="icon mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
