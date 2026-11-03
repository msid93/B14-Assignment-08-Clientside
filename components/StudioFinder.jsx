import Form from "next/form";
import { Aperture, ArrowRight, MapPin, Search, ScanLine } from "lucide-react";
import { categories } from "../lib/studios";

export default function StudioFinder() {
  return (
    <section className="finder-section" aria-label="Find a studio">
      <Form action="/studios" className="shell finder">
        <div className="finder-heading">
          <ScanLine size={25} />
          <strong>Find a space</strong>
        </div>
        <label className="finder-control">
          <span>
            <Aperture size={13} /> Space type
          </span>
          <select name="category" defaultValue="">
            <option value="">All studio types</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="finder-control">
          <span>
            <MapPin size={13} /> Location
          </span>
          <input name="q" type="search" maxLength={100} placeholder="City or neighbourhood" />
        </label>
        <button className="btn find-button">
          <Search size={16} /> Search studios <ArrowRight size={16} />
        </button>
      </Form>
    </section>
  );
}
