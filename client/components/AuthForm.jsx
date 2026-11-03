"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { request } from "../lib/api";
import { returnPath } from "../lib/studios";
import { useSession } from "./Session";

export default function AuthForm({ register = false }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = returnPath(params.get("next"));
  const suffix = next === "/" ? "" : "?next=" + encodeURIComponent(next);
  const { refresh } = useSession();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const valid = password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
  async function submit(event) {
    event.preventDefault();
    setError("");
    if (register && !valid) {
      setError("Use 6 or more characters with uppercase and lowercase letters.");
      return;
    }
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      if (register) {
        if (values.image && !/^https:\/\//i.test(values.image))
          throw new Error("Use an HTTPS photo URL.");
        await request("/auth/sign-up/email", { method: "POST", body: values });
        toast.success("Account created. Sign in to open your desk.");
        router.replace("/login" + suffix);
      } else {
        await request("/auth/sign-in/email", { method: "POST", body: values });
        await request("/session/access", { method: "POST" });
        refresh();
        toast.success("Welcome back.");
        router.replace(next);
      }
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError("");
    try {
      const config = await request("/config");
      if (!config.google)
        throw new Error(
          "Google sign-in needs the project’s OAuth credentials. You can use email here.",
        );
      const result = await request("/auth/sign-in/social", {
        method: "POST",
        body: {
          provider: "google",
          callbackURL: window.location.origin + next,
          errorCallbackURL: window.location.origin + "/login?oauth=error",
        },
      });
      if (!result.url) throw new Error("Google sign-in could not start.");
      window.location.assign(result.url);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
      setBusy(false);
    }
  }
  return (
    <section className="shell auth-page">
      <aside className="auth-photo">
        <img
          src={"/photos/" + (register ? "workshop" : "film") + "-detail.webp"}
          alt="Production studio interior"
        />
        <div className="auth-caption">
          <span>Location file / {register ? "Workshop" : "Film stage"}</span>
          <strong>{register ? "Clay & Grain Atelier" : "Framehouse Stage"}</strong>
        </div>
      </aside>
      <div className="auth-body">
        <p className="eyebrow">Member access / {register ? "Join" : "Sign in"}</p>
        <h1>{register ? "Create your account" : "Welcome back."}</h1>
        <p>
          {register
            ? "One account to book hours and host a room of your own."
            : "Sign in to your studio desk."}
        </p>
        <form onSubmit={submit} className="form-stack">
          {register && (
            <label>
              Name
              <input required name="name" autoComplete="name" maxLength={90} />
            </label>
          )}
          <label>
            Email
            <input required name="email" type="email" autoComplete="email" />
          </label>
          {register && (
            <label>
              Photo URL
              <input required type="url" name="image" placeholder="https://…" />
            </label>
          )}
          <label>
            Password
            <span className="password">
              <input
                name="password"
                required
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={register ? "new-password" : "current-password"}
              />
              <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {register ? (
            <small className={password && !valid ? "form-error" : "muted"}>
              Use at least 6 characters with an uppercase and a lowercase letter.
            </small>
          ) : (
            <button
              type="button"
              className="link-btn align-left"
              onClick={() =>
                toast.info(
                  "Password reset is unavailable for this assignment. Examiner accounts are in the client README.",
                )
              }
            >
              Forgot password?
            </button>
          )}
          {(error || params.get("oauth") === "error") && (
            <p className="form-error" role="alert">
              {error || "Google sign-in was interrupted. Please try again."}
            </p>
          )}
          <button className="btn" disabled={busy}>
            {register ? "Register" : "Login"} <ArrowUpRight size={16} />
          </button>
        </form>
        <div className="or">or</div>
        <button className="btn outline full" disabled={busy} onClick={google}>
          <b className="google-g">G</b> Continue with Google
        </button>
        <p className="swap">
          {register ? "Already have an account?" : "New to StudioSpace?"}{" "}
          <Link href={(register ? "/login" : "/register") + suffix}>
            {register ? "Login" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
