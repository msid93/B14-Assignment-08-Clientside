import Link from "next/link";
export const metadata = { title: "About us" };
export default function About() {
  return (
    <section className="shell editorial">
      <div>
        <p className="eyebrow">StudioSpace / About</p>
        <h1>
          Good work starts with <em>a room.</em>
        </h1>
        <p>
          StudioSpace connects independent hosts in Bangladesh with people looking for somewhere to
          shoot, record, rehearse or make things by hand.
        </p>
        <p>
          A photographer can scout the light before travelling. A producer can share an hourly
          estimate with the crew. A host can see each request alongside the hours already held.
        </p>
        <Link className="btn" href="/studios">
          Find your studio ↗
        </Link>
      </div>
      <img src="/photos/workshop.webp" alt="Artist’s workbenches in a daylight workshop" />
    </section>
  );
}
