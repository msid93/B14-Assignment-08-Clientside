"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { memberRequest } from "../lib/api";
import { categories } from "../lib/studios";
import { useResource } from "../lib/use-resource";
import { useSession, Private } from "./Session";
import { Loading, Problem, Empty } from "./States";

function PhotoFields({ images, onChange, disabled, onBusy }) {
  const [working, setWorking] = useState(false);
  async function upload(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return toast.error("Choose a JPG, PNG or WebP photo under 2 MB.");
    setWorking(true);
    onBusy(true);
    try {
      const encoded = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("This photo could not be read."));
        reader.readAsDataURL(file);
      });
      const { url } = await memberRequest("/uploads", { method: "POST", body: { image: encoded } });
      onChange([...images.filter((s) => s.trim()), url]);
      toast.success("Photo uploaded.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setWorking(false);
      onBusy(false);
    }
  }
  return (
    <fieldset disabled={disabled || working}>
      <legend>
        <Camera size={17} /> Gallery
      </legend>
      <label>
        Image URLs, one per line
        <textarea
          rows="3"
          value={images.join("\n")}
          required
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder="https://…"
        />
      </label>
      <small>The first photo is your cover. Add up to six URLs or upload an image.</small>
      <label className="upload">
        <Upload size={16} />
        {working ? "Uploading…" : "Upload a photo to ImgBB"}
        <input
          aria-label="Upload a photo to ImgBB"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={images.filter(Boolean).length >= 6}
          onChange={(e) => {
            upload(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </label>
    </fieldset>
  );
}

function Editor({ studio }) {
  const { user } = useSession();
  const router = useRouter();
  const [images, setImages] = useState(studio?.images || [""]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...form,
      rate: Number(form.rate),
      deposit: Number(form.deposit),
      capacity: Number(form.capacity),
      images: images.map((url) => url.trim()).filter(Boolean),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };
    try {
      await memberRequest(studio ? "/studios/" + studio._id : "/studios", {
        method: studio ? "PUT" : "POST",
        body,
      });
      toast.success(studio ? "Listing updated." : "Your studio is on the directory.");
      router.push("/my-listings");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="shell form-page">
      <div className="page-intro">
        <p className="eyebrow">Host desk / Listings</p>
        <h1>{studio ? "Edit studio" : "Add a new studio"}</h1>
        <p>Give visiting creators enough detail to plan the session before they arrive.</p>
      </div>
      <form className="form-stack surface" onSubmit={save}>
        <label>
          Studio name
          <input required name="title" defaultValue={studio?.title} minLength={3} maxLength={90} />
        </label>
        <div className="fields-two">
          <label>
            Space type
            <select name="category" defaultValue={studio?.category} required>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Maximum capacity
            <input
              type="number"
              min="1"
              max="1000"
              required
              name="capacity"
              defaultValue={studio?.capacity}
            />
          </label>
        </div>
        <div className="fields-two">
          <label>
            Hourly rate (USD)
            <input
              required
              type="number"
              min="1"
              max="10000"
              step=".01"
              name="rate"
              defaultValue={studio?.rate}
            />
          </label>
          <label>
            Refundable deposit (USD)
            <input
              required
              type="number"
              min="0"
              max="100000"
              step=".01"
              name="deposit"
              defaultValue={studio?.deposit ?? 0}
            />
          </label>
        </div>
        <label>
          Location / address in Bangladesh
          <input
            required
            name="location"
            minLength={3}
            maxLength={160}
            defaultValue={studio?.location}
            placeholder="Neighbourhood, city"
          />
        </label>
        <PhotoFields images={images} onChange={setImages} disabled={busy} onBusy={setUploading} />
        <label>
          Amenity tags
          <input
            name="amenities"
            defaultValue={studio?.amenities.join(", ")}
            placeholder="North light, C-stands, Changing area"
          />
          <small>Separate each amenity with a comma.</small>
        </label>
        <label>
          Detailed overview
          <textarea
            name="overview"
            rows="5"
            required
            minLength={20}
            maxLength={3000}
            defaultValue={studio?.overview}
          />
        </label>
        <div className="fields-two">
          <label>
            Host name
            <input readOnly value={user.name} />
          </label>
          <label>
            Host email
            <input readOnly value={user.email} />
          </label>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn" disabled={busy || uploading}>
          {busy ? "Saving…" : studio ? "Save changes" : "Publish studio"}
        </button>
      </form>
    </section>
  );
}
function OwnedEditor({ id }) {
  const result = useResource("/studios/" + id);
  const { user } = useSession();
  if (result.loading) return <Loading />;
  if (result.error) return <Problem error={result.error} retry={result.refresh} />;
  if (user.id !== result.data.ownerId)
    return (
      <Empty
        title="This is another host’s studio."
        message="Choose a listing from your own desk to edit."
        href="/my-listings"
        action="My listings"
      />
    );
  return <Editor studio={result.data} />;
}
export default function StudioForm({ id }) {
  return <Private>{id ? <OwnedEditor id={id} /> : <Editor />}</Private>;
}
