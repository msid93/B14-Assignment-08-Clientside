"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "../lib/studios";
import { useResource } from "../lib/use-resource";
import { Empty, Loading, Problem } from "./States";
import StudioCard from "./StudioCard";

const categoryPhotos = [
  "daylight-detail",
  "film-detail",
  "podcast-detail",
  "music-detail",
  "workshop-detail",
];
export default function HomeDirectory() {
  const { data, loading, error, refresh } = useResource("/studios?featured=1");
  return (
    <>
      <section className="shell index-section" id="selected-studios">
        <div className="section-label">
          <span /> The location edit
        </div>
        <div className="section-head">
          <div>
            <h2>
              Selected <em>studios.</em>
            </h2>
            <p>Spaces to shortlist for your next production.</p>
          </div>
          <Link className="line-link" href="/studios">
            View all studios <ArrowUpRight size={16} />
          </Link>
        </div>
        {loading ? (
          <Loading label="Finding featured studios" />
        ) : error ? (
          <Problem error={error} retry={refresh} />
        ) : data.length ? (
          <div className="cards selected-grid">
            {data.map((s, i) => (
              <StudioCard key={s._id} studio={s} index={i} />
            ))}
          </div>
        ) : (
          <Empty
            title="The directory is open."
            message="Be the first host to list a space."
            href="/add-studio"
            action="Host your space"
          />
        )}
      </section>
      <section className="discipline-section">
        <div className="shell index-section">
          <div className="section-label">
            <span /> Space types
          </div>
          <div className="section-head">
            <h2>
              Explore by <em>discipline.</em>
            </h2>
          </div>
          <div className="disciplines">
            {categories.map((c, i) => (
              <Link
                key={c.name}
                href={"/studios?category=" + encodeURIComponent(c.name)}
                className="discipline-card"
              >
                <div className="discipline-photo">
                  <img src={"/photos/" + categoryPhotos[i] + ".webp"} alt="" loading="lazy" />
                  <span>0{i + 1}</span>
                </div>
                <div className="discipline-title">
                  <strong>{c.label}</strong>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
