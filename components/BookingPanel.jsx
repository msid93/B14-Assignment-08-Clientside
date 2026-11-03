"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { memberRequest } from "../lib/api";
import { localDay, money, hour, slotTime } from "../lib/studios";
import { useResource } from "../lib/use-resource";
import { useSession } from "./Session";
import Modal from "./Dialog";

const hours = Array.from({ length: 17 }, (_, i) => i + 6);
export default function BookingPanel({ studio }) {
  const router = useRouter();
  const { user, loading, error: sessionError, refresh: retrySession } = useSession();
  const [day, setDay] = useState(localDay);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const slots = useResource(
    day ? "/studios/" + studio._id + "/availability?day=" + day : null,
    undefined,
    20000,
  );
  useEffect(() => {
    if (
      user &&
      user.id !== studio.ownerId &&
      new URLSearchParams(window.location.search).get("book") === "1"
    )
      setOpen(true);
  }, [user, studio.ownerId]);
  function changeDay(value) {
    setDay(value);
    setStart("");
    setEnd("");
    setMessage("");
  }
  function free(h) {
    return (
      Boolean(slots.data) &&
      slotTime(day, h) > new Date() &&
      !slots.data.some((b) => b.start < h + 1 && b.end > h)
    );
  }
  const ends = [];
  if (start !== "") for (let h = Number(start); h < 23 && free(h); h++) ends.push(h + 1);
  const rental =
    start && end ? Math.round(studio.rate * 100 * (Number(end) - Number(start))) / 100 : 0;
  function begin() {
    if (!user)
      return router.push("/login?next=" + encodeURIComponent("/studios/" + studio._id + "?book=1"));
    setMessage("");
    setOpen(true);
  }
  async function book(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await memberRequest("/bookings", {
        method: "POST",
        body: { studioId: studio._id, day, start: Number(start), end: Number(end) },
      });
      toast.success("Hours held. Your booking is pending host confirmation.");
      setOpen(false);
      router.push("/my-bookings");
    } catch (e) {
      setMessage(e.message);
      toast.error(e.message);
      if (e.status === 409) {
        slots.refresh();
        setStart("");
        setEnd("");
      }
    } finally {
      setBusy(false);
    }
  }
  const dateField = (
    <label>
      Session date
      <input
        type="date"
        min={localDay()}
        required
        value={day}
        onChange={(e) => changeDay(e.target.value)}
      />
    </label>
  );
  const openHours = hours.filter(free);
  const availabilityMessage = !day
    ? "Choose a date."
    : slots.loading
      ? "Checking available hours…"
      : slots.error?.message || (!openHours.length ? "No open hours on this date." : "");
  return (
    <aside className="booking-panel">
      <p className="eyebrow">
        <CalendarDays size={15} /> Booking desk
      </p>
      <p className="big-rate">
        {money(studio.rate)}
        <small> / hr</small>
      </p>
      <p>
        Refundable deposit <strong>{money(studio.deposit)}</strong>
      </p>
      <hr />
      {dateField}
      <p className="eyebrow top-gap">Available start times</p>
      <div className="hours-available" aria-live="polite">
        {availabilityMessage ? (
          <p>{availabilityMessage}</p>
        ) : (
          openHours.map((h) => <span key={h}>{hour(h)}</span>)
        )}
      </div>
      {slots.error && (
        <button className="link-btn" onClick={slots.refresh}>
          Retry availability
        </button>
      )}
      <p className="micro">Bangladesh time · UTC+6 · USD rates</p>
      {sessionError ? (
        <button className="btn full" onClick={retrySession}>
          Retry login check
        </button>
      ) : (
        <button
          className="btn full"
          disabled={loading || user?.id === studio.ownerId}
          onClick={begin}
        >
          {user?.id === studio.ownerId ? "Your studio listing" : "Book workspace now"}
          <ArrowUpRight size={16} />
        </button>
      )}
      <Modal
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
        title="Reserve a workspace"
        description={studio.title + " · " + studio.location}
      >
        <form className="form-stack" onSubmit={book}>
          {dateField}
          <div className="fields-two">
            <label>
              Start time
              <select
                required
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setEnd("");
                }}
              >
                <option value="">Select start</option>
                {hours.filter(free).map((h) => (
                  <option key={h} value={h}>
                    {hour(h)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              End time
              <select required value={end} onChange={(e) => setEnd(e.target.value)}>
                <option value="">Select end</option>
                {ends.map((h) => (
                  <option key={h} value={h}>
                    {hour(h)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <small className="muted">
            Bangladesh local time (UTC+6).{" "}
            {slots.loading
              ? "Checking availability…"
              : slots.error
                ? slots.error.message
                : !hours.some(free)
                  ? "No open hours on this date."
                  : ""}
          </small>
          <div className="estimate">
            <p>
              <span>
                Rental {rental ? "(" + (end - start) + " hr × " + money(studio.rate) + ")" : ""}
              </span>
              <strong>{money(rental)}</strong>
            </p>
            <p>
              <span>Refundable security deposit</span>
              <strong>{money(studio.deposit)}</strong>
            </p>
            <p>
              <b>Total including deposit</b>
              <b>{rental ? money(rental + studio.deposit) : "—"}</b>
            </p>
          </div>
          {message && (
            <p className="form-error" role="alert">
              {message}
            </p>
          )}
          <button className="btn" disabled={busy || !end || !ends.includes(Number(end))}>
            {busy ? "Holding your hours…" : "Request booking"}
          </button>
          <small>Your request appears in My bookings as Pending.</small>
        </form>
      </Modal>
    </aside>
  );
}
