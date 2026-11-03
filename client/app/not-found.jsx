import Link from "next/link";
export default function NotFound() {
  return (
    <section className="shell missing">
      <svg
        role="img"
        aria-label="An empty photography set with a spotlight and stool"
        viewBox="0 0 360 140"
      >
        <rect
          x="1"
          y="1"
          width="358"
          height="138"
          rx="7"
          fill="var(--panel)"
          stroke="var(--line)"
        />
        <path d="M72 105l67-75 62 75" fill="var(--accent)" opacity=".6" />
        <g fill="none" stroke="var(--ink)" strokeLinecap="round" strokeWidth="2.7">
          <path d="M36 113h287M117 53l17-20 19 13-13 19zM143 36l15-12m-48 88 12-56m-23 56 21-19 14 19m95-29h37m-33 1-7 29m33-29 9 29m-45-65h53v28h-53z" />
        </g>
      </svg>
      <p className="eyebrow">Location file / 404</p>
      <h1>This set is empty.</h1>
      <p>The page you’re looking for isn’t on our call sheet.</p>
      <Link href="/" className="btn">
        Return to home ↗
      </Link>
    </section>
  );
}
