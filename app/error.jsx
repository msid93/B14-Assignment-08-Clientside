"use client";
import { Problem } from "../components/States";
export default function ErrorPage({ reset }) {
  return <Problem error={{ message: "The page could not be opened." }} retry={reset} />;
}
