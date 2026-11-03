import Link from "next/link";
import { Aperture, ArrowUpRight, RotateCcw } from "lucide-react";

export function Loading({ label = "Opening the studio desk" }) {
  return (
    <div className="state" role="status">
      <span className="loader">
        <Aperture size={28} />
      </span>
      <p>{label}…</p>
    </div>
  );
}
export function Problem({ error, retry }) {
  return (
    <div className="state" role="alert">
      <p className="eyebrow">Studio desk</p>
      <h2>We couldn’t load this.</h2>
      <p>{error?.message}</p>
      {retry && (
        <button className="btn outline" onClick={retry}>
          <RotateCcw size={16} /> Try again
        </button>
      )}
    </div>
  );
}
export function Empty({ title, message, href, action }) {
  return (
    <div className="state">
      <Aperture size={32} />
      <h2>{title}</h2>
      <p>{message}</p>
      <Link className="btn outline" href={href}>
        {action}
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
