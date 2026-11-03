"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { memberRequest } from "../lib/api";
import { useResource } from "../lib/use-resource";
import { money } from "../lib/studios";
import { Loading, Problem, Empty } from "./States";
import Modal from "./Dialog";
import { Private } from "./Session";

function Listings() {
  const result = useResource("/studios/mine", memberRequest);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove() {
    setBusy(true);
    try {
      await memberRequest("/studios/" + selected._id, { method: "DELETE" });
      toast.success("Listing deleted.");
      setSelected(null);
      result.refresh();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="shell page-block">
      <div className="page-intro">
        <p className="eyebrow">Host desk / Inventory</p>
        <div className="section-head">
          <h1>My studio listings</h1>
          <Link href="/add-studio" className="btn">
            <Plus size={16} /> Add new studio
          </Link>
        </div>
        <p>Update your spaces, rates and kit list here.</p>
      </div>
      {result.loading ? (
        <Loading />
      ) : result.error ? (
        <Problem error={result.error} retry={result.refresh} />
      ) : !result.data.length ? (
        <Empty
          title="Your first room starts here."
          message="Add photos, rates and the details visiting creators need."
          href="/add-studio"
          action="List a studio"
        />
      ) : (
        <div className="records">
          {result.data.map((s) => (
            <article className="record" key={s._id}>
              <img src={s.images[0]} alt="" />
              <div>
                <p className="eyebrow">{s.category}</p>
                <h3>
                  <Link href={"/studios/" + s._id}>{s.title}</Link>
                </h3>
                <p>
                  {s.location} · {money(s.rate)} / hr
                </p>
              </div>
              <div className="actions">
                <Link className="btn outline small" href={"/studios/edit/" + s._id}>
                  Update
                </Link>
                <button className="btn danger small" onClick={() => setSelected(s)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        onOpenChange={(v) => {
          if (!v && !busy) setSelected(null);
        }}
        title="Delete this studio?"
        description={selected?.title + " will leave the public directory."}
      >
        <div className="dialog-actions">
          <button disabled={busy} className="btn outline" onClick={() => setSelected(null)}>
            Keep listing
          </button>
          <button disabled={busy} className="btn danger" onClick={remove}>
            Delete studio
          </button>
        </div>
      </Modal>
    </section>
  );
}
export default function MyListings() {
  return (
    <Private>
      <Listings />
    </Private>
  );
}
