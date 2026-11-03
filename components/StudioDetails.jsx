"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  MapPin,
  Users,
  Star,
} from "lucide-react";
import { useResource } from "../lib/use-resource";
import { Loading, Problem } from "./States";
import BookingPanel from "./BookingPanel";
import Modal from "./Dialog";

export default function StudioDetails({ id }) {
  const { data: s, error, loading, refresh } = useResource("/studios/" + id);
  const [photo, setPhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (loading) return <Loading />;
  if (error)
    return (
      <div className="shell page-block">
        <Link className="line-link" href="/studios">
          ← Back to directory
        </Link>
        <Problem error={error} retry={refresh} />
      </div>
    );
  const n = s.images.length;
  function show(i) {
    setPhoto(i);
    setLightbox(true);
  }
  return (
    <section className="shell page-block dossier">
      <Link className="breadcrumb" href="/studios">
        <ArrowLeft size={14} /> Studio directory
      </Link>
      <div className="dossier-intro">
        <div>
          <div className="section-label">
            <span /> Location file · {s.category}
          </div>
          <h1>{s.title}</h1>
        </div>
        <div className="meta">
          <span>
            <MapPin size={15} />
            {s.location}
          </span>
          <span>
            <Users size={15} />
            {s.capacity} guests
          </span>
          <span>
            <Star size={15} />
            {s.rating ? s.rating.toFixed(1) : "New listing"}
          </span>
        </div>
      </div>
      <div className={n > 1 ? "photo-spread" : "photo-spread single"}>
        {s.images.slice(0, 2).map((src, i) => (
          <button
            key={i}
            onClick={() => show(i)}
            aria-label={"Open " + s.title + " photo " + (i + 1)}
          >
            <img src={src} alt={s.title + " — view " + (i + 1)} />
            {i === 0 ? (
              <span className="shot-tag">01 / Overview</span>
            ) : (
              <span className="shot-tag">
                <ImageIcon size={14} /> Gallery · {n} photos
              </span>
            )}
          </button>
        ))}
      </div>
      <Modal
        open={lightbox}
        onOpenChange={setLightbox}
        title={s.title}
        description={"Studio photography · view " + (photo + 1) + " of " + n}
        wide
      >
        <div className="viewer">
          <img src={s.images[photo]} alt={s.title + " — gallery view " + (photo + 1)} />
        </div>
        {n > 1 && (
          <div className="viewer-nav">
            <button
              className="icon"
              aria-label="Previous photo"
              onClick={() => setPhoto((photo + n - 1) % n)}
            >
              <ArrowLeft size={17} />
            </button>
            <span>
              {photo + 1} / {n}
            </span>
            <button
              className="icon"
              aria-label="Next photo"
              onClick={() => setPhoto((photo + 1) % n)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </Modal>
      <div className="details-grid">
        <div className="dossier-content">
          <div className="detail-block">
            <div className="section-label">
              <span /> Studio notes
            </div>
            <h2>
              Inside the <em>space.</em>
            </h2>
            <p className="preline">{s.overview}</p>
          </div>
          <div className="detail-block">
            <h2>Amenities</h2>
            <div className="amenities">
              {s.amenities.length ? (
                s.amenities.map((a) => (
                  <span key={a}>
                    <Check size={15} />
                    {a}
                  </span>
                ))
              ) : (
                <p>Ask the host about available kit.</p>
              )}
            </div>
          </div>
          <div className="detail-block">
            <h2>Your host</h2>
            <div className="host-line">
              {s.ownerImage ? (
                <img src={s.ownerImage} alt="" />
              ) : (
                <span className="avatar">{s.ownerName[0]}</span>
              )}
              <strong>{s.ownerName}</strong>
            </div>
          </div>
          <div className="detail-block">
            <h2>Creator reviews</h2>
            {s.reviews.length ? (
              s.reviews.map((r, i) => (
                <blockquote key={i}>
                  <span className="rating">
                    <Star size={13} />
                    {r.stars} / 5
                  </span>
                  <p>“{r.text}”</p>
                  <cite>{r.name}</cite>
                </blockquote>
              ))
            ) : (
              <p>This space is waiting for its first review.</p>
            )}
          </div>
        </div>
        <BookingPanel studio={s} />
      </div>
    </section>
  );
}
