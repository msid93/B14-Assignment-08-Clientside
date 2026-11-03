import {
  ArrowUpRight,
  ShieldCheck,
  UserRoundCheck,
  SlidersHorizontal,
  Headphones,
} from "lucide-react";
import Link from "next/link";
const steps = [
  ["Discover spaces", "Shortlist rooms by their light, sound, capacity and equipment."],
  ["Select shoot hours", "Pick an open date and a continuous block of studio hours."],
  ["Book instantly", "Request the slot to hold it. Your host confirms from their desk."],
  ["Create & produce", "Check in with your host, unpack your kit and start the session."],
];
const support = [
  [
    ShieldCheck,
    "Liability protection",
    "Review the studio’s liability terms with the host before your session.",
  ],
  [
    UserRoundCheck,
    "Verified profiles",
    "Listings and booking requests belong to signed-in accounts.",
  ],
  [
    SlidersHorizontal,
    "Equipment safety",
    "Check the kit list before booking and inspect equipment at handover.",
  ],
  [
    Headphones,
    "24/7 host support",
    "Your host desk and booking records are available around the clock.",
  ],
];
export default function BookingGuide() {
  return (
    <>
      <section className="field-guide">
        <div className="shell field-guide-grid">
          <div className="guide-pitch">
            <div className="section-label">
              <span /> Production notes
            </div>
            <h2>
              How booking <em>works.</em>
            </h2>
            <p>Four steps from finding a room to calling the first take.</p>
            <Link className="line-link" href="/studios">
              Find your studio <ArrowUpRight size={16} />
            </Link>
            <img
              src="/photos/music-detail.webp"
              alt="Mixing console in a recording suite"
              loading="lazy"
            />
          </div>
          <ol className="guide-steps">
            {steps.map(([title, desc], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="shell index-section">
        <div className="section-label">
          <span /> Host guarantee
        </div>
        <h2>
          Creator <em>support.</em>
        </h2>
        <div className="support">
          {support.map(([Icon, title, desc]) => (
            <article key={title}>
              <Icon size={22} strokeWidth={1.5} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
