"use client";
import Link from "next/link";
import { Plus, LayoutGrid, CalendarDays, ArrowUpRight } from "lucide-react";
import { Private, useSession } from "./Session";
import Reservations from "./Reservations";

function Desk() {
  const { user } = useSession();
  return (
    <section className="shell page-block">
      <div className="page-intro desk-intro">
        <div className="section-label">
          <span /> Member desk / Overview
        </div>
        <h1>
          {user.name.split(" ")[0]}’s <em>studio desk.</em>
        </h1>
        <p>Manage your spaces and review requests from visiting creators.</p>
      </div>
      <div className="desk-links">
        {[
          [Plus, "Add a new studio", "/add-studio"],
          [LayoutGrid, "My studio listings", "/my-listings"],
          [CalendarDays, "My bookings", "/my-bookings"],
        ].map(([Icon, title, href]) => (
          <Link href={href} key={href}>
            <Icon />
            <strong>{title}</strong>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
      <p className="eyebrow">Host inbox</p>
      <h2>Incoming bookings</h2>
      <Reservations host />
    </section>
  );
}
export function MyBookings() {
  return (
    <Private>
      <section className="shell page-block">
        <div className="page-intro">
          <p className="eyebrow">Creator desk / Reservations</p>
          <h1>My bookings</h1>
          <p>Check your hours, estimated cost and host confirmation.</p>
        </div>
        <Reservations />
      </section>
    </Private>
  );
}
export default function Dashboard() {
  return (
    <Private>
      <Desk />
    </Private>
  );
}
