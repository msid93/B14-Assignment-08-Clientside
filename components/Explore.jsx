"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useResource } from "../lib/use-resource";
import { categories } from "../lib/studios";
import { Empty, Loading, Problem } from "./States";
import StudioCard from "./StudioCard";

export default function Explore() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (q) query.set("q", q);
  const result = useResource("/studios?" + query);
  function filter(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    for (const field of ["q", "category"])
      if (values.get(field)?.trim()) next.set(field, values.get(field).trim());
    router.push("/studios" + (next.size ? "?" + next : ""), { scroll: false });
  }
  return (
    <section className="shell page-block">
      <div className="page-intro directory-intro">
        <div className="section-label">
          <span /> Location directory / Bangladesh
        </div>
        <h1>
          Explore <em>studios.</em>
        </h1>
        <p>Search by space type, studio name or neighbourhood.</p>
      </div>
      <form className="filters" onSubmit={filter} key={query.toString()}>
        <label>
          <span>Search the directory</span>
          <div className="input-icon">
            <Search size={17} />
            <input
              name="q"
              type="search"
              defaultValue={q}
              maxLength={100}
              placeholder="Studio name or location"
            />
          </div>
        </label>
        <label>
          <span>Space type</span>
          <select name="category" defaultValue={category}>
            <option value="">All space types</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button className="btn">
          <SlidersHorizontal size={16} /> Apply filters
        </button>
      </form>
      {result.loading ? (
        <Loading label="Searching the directory" />
      ) : result.error ? (
        <Problem error={result.error} retry={result.refresh} />
      ) : result.data.length ? (
        <>
          <p className="eyebrow results">
            {result.data.length} {result.data.length === 1 ? "space" : "spaces"} on file
          </p>
          <div className="cards">
            {result.data.map((s, i) => (
              <StudioCard key={s._id} studio={s} index={i} />
            ))}
          </div>
        </>
      ) : (
        <Empty
          title="No rooms on this shortlist."
          message="Try a different location or clear the category filter."
          href="/studios"
          action="Clear filters"
        />
      )}
    </section>
  );
}
