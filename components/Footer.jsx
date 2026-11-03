"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import { categories } from "../lib/studios";
import { request } from "../lib/api";
import { Brand } from "./Header";

export default function Footer() {
  const [busy, setBusy] = useState(false);
  const [site, setSite] = useState("");
  useEffect(() => setSite(encodeURIComponent(window.location.origin)), []);
  async function subscribe(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      await request("/newsletter", { method: "POST", body: { email: form.elements.email.value } });
      toast.success("You’re on the studio dispatch list.");
      form.reset();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <footer>
      <div className="shell foot-grid">
        <div>
          <Brand />
          <p>A desk for independent creators to find a room, book the hours and get to work.</p>
          <div className="social">
            <a
              href={"https://x.com/intent/tweet?text=StudioSpace&url=" + site}
              aria-label="Share StudioSpace on X"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2h3.7l-8.1 9.3L24 22h-7.4l-5.8-7.6L4.2 22H.5l8.6-9.8L0 2h7.6l5.2 6.9L18.9 2Zm-1.3 18h2L6.5 3.9H4.3L17.6 20Z" />
              </svg>
            </a>
            <a
              href={"https://www.facebook.com/sharer/sharer.php?u=" + site}
              aria-label="Share StudioSpace on Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Share2 size={17} />
            </a>
          </div>
        </div>
        <div>
          <h3>Directory</h3>
          <Link href="/studios">Explore studios</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/about">About us</Link>
          <Link href="/add-studio">Host your space</Link>
        </div>
        <div>
          <h3>Space types</h3>
          {categories.map((c) => (
            <Link key={c.name} href={"/studios?category=" + encodeURIComponent(c.name)}>
              {c.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>The studio dispatch</h3>
          <p>Sign up for new spaces and notes from the desk.</p>
          <form className="newsletter" onSubmit={subscribe}>
            <input
              required
              name="email"
              type="email"
              aria-label="Newsletter email"
              placeholder="Your email address"
            />
            <button disabled={busy} aria-label="Subscribe">
              <ArrowRight size={19} />
            </button>
          </form>
        </div>
      </div>
      <div className="shell footer-signature" aria-hidden="true">
        StudioSpace<span>.</span>
      </div>
      <div className="shell foot-end">
        <span>© {new Date().getFullYear()} StudioSpace</span>
        <Link href="/terms">Terms of use</Link>
      </div>
    </footer>
  );
}
