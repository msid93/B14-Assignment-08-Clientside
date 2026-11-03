"use client";
import { useState } from "react";
import { toast } from "sonner";
import { memberRequest } from "../lib/api";
import { useResource } from "../lib/use-resource";
import { money, hour, slotTime } from "../lib/studios";
import { Loading, Problem, Empty } from "./States";
import Modal from "./Dialog";

export default function Reservations({ host = false }) {
  const result = useResource("/bookings" + (host ? "?role=host" : ""), memberRequest, 20000);
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  async function update() {
    setBusy(true);
    try {
      await memberRequest("/bookings/" + action.row._id, {
        method: "PATCH",
        body: { status: action.status },
      });
      toast.success("Booking " + action.status.toLowerCase() + ".");
      setAction(null);
      result.refresh();
    } catch (e) {
      toast.error(e.message);
      result.refresh();
      setAction(null);
    } finally {
      setBusy(false);
    }
  }
  if (result.loading) return <Loading label="Retrieving bookings" />;
  if (result.error) return <Problem error={result.error} retry={result.refresh} />;
  if (!result.data.length)
    return (
      <Empty
        title={host ? "No incoming requests yet." : "Your call sheet is clear."}
        message={
          host
            ? "Requests for studios you host will appear here."
            : "Choose a studio and reserve a few hours to get started."
        }
        href={host ? "/my-listings" : "/studios"}
        action={host ? "View my listings" : "Explore studios"}
      />
    );
  return (
    <>
      <div className="records">
        {result.data.map((row) => {
          const pending = row.status === "Pending",
            confirmed = row.status === "Confirmed";
          const canConfirm = host && pending && slotTime(row.day, row.start) > new Date();
          const canComplete = host && confirmed && slotTime(row.day, row.end) <= new Date();
          const canCancel =
            pending || (host && confirmed && slotTime(row.day, row.start) > new Date());
          function button(status, label) {
            return (
              <button
                className="btn outline small"
                onClick={() => setAction({ row, status, label })}
              >
                {label}
              </button>
            );
          }
          return (
            <article className="record" key={row._id}>
              <img src={row.image} alt="" />
              <div>
                <span className={"badge status " + row.status.toLowerCase()}>{row.status}</span>
                <h3>{row.studioTitle}</h3>
                <p>
                  {row.day} · {hour(row.start)}–{hour(row.end)} (UTC+6)
                </p>
                <p>
                  {money(row.rental)} rental + {money(row.deposit)} deposit
                  {host ? " · " + row.guestName : ""}
                </p>
              </div>
              <div className="actions">
                {canConfirm && button("Confirmed", "Confirm")}
                {canComplete && button("Completed", "Mark completed")}
                {canCancel && button("Cancelled", host ? "Cancel request" : "Cancel booking")}
              </div>
            </article>
          );
        })}
      </div>
      <Modal
        open={Boolean(action)}
        onOpenChange={(v) => {
          if (!v && !busy) setAction(null);
        }}
        title={(action?.label || "Update booking") + "?"}
        description={action?.row.studioTitle + " · " + action?.row.day}
      >
        <p>This reservation will be marked {action?.status.toLowerCase()}.</p>
        <div className="dialog-actions">
          <button className="btn outline" disabled={busy} onClick={() => setAction(null)}>
            Go back
          </button>
          <button className="btn" disabled={busy} onClick={update}>
            {action?.label}
          </button>
        </div>
      </Modal>
    </>
  );
}
