import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { money } from "../lib/studios";

export default function StudioCard({ studio, index }) {
  const href = "/studios/" + studio._id;
  return (
    <article className="studio-card">
      <Link href={href} className="cover" aria-label={"View " + studio.title}>
        <img loading="lazy" src={studio.images[0]} alt={studio.title} />
        <span className="chip">{studio.category}</span>
        <span className="photo-action" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="card-info">
        <div className="card-meta">
          <span className="catalog-no">{String(index + 1).padStart(2, "0")}</span>
          <span className="location">
            <MapPin size={12} />
            {studio.location}
          </span>
          <span className="rating">
            <Star size={12} />
            {studio.rating ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <h3>
          <Link href={href}>{studio.title}</Link>
        </h3>
        <div className="card-foot">
          <span>
            <strong>{money(studio.rate)}</strong>
            <small> / hour</small>
          </span>
          <Link className="detail-link" href={href}>
            View details <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
