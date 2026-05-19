"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Loader } from "lucide-react";
import Field from "@/components/ui/Field";
import { geocode } from "@/lib/geocode";

export default function NewPhotoLocationPage() {
  const router = useRouter();
  const { addPhotoLocation } = useStore();
  const [form, setForm] = useState({ name:"", address:"", description:"", cover:"https://picsum.photos/seed/new/600/400" });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle"|"loading"|"found"|"failed">("idle");

  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  async function handleAddressBlur() {
    const query = form.address || form.name;
    if (!query.trim()) return;
    setGeoStatus("loading");
    const result = await geocode(query);
    if (result) { setCoords(result); setGeoStatus("found"); }
    else { setGeoStatus("failed"); }
  }

  function submit() {
    if (!form.name) return;
    const lat = coords?.lat ?? 25.7617;
    const lng = coords?.lng ?? -80.1918;
    const newId = "p" + Date.now();
    addPhotoLocation({ id: newId, lat, lng, name: form.name, description: form.description, cover: form.cover, photos: [] });
    router.push(`/photo-locations/${newId}`);
  }

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>PHOTO SPOTS</p>
          <h1 className="text-[15px] font-black text-white">Add Location</h1>
        </div>
      </div>
      <div className="px-4 py-5">
        <Field label="Spot Name" value={form.name} onChange={v=>{ set("name",v); if(!form.address){ setGeoStatus("idle"); setCoords(null); } }} placeholder="Wynwood Walls" />
        <Field label="Address or Search" value={form.address} onChange={v=>{ set("address",v); setGeoStatus("idle"); setCoords(null); }} onBlur={handleAddressBlur} placeholder="2520 NW 2nd Ave, Miami, FL" />
        {geoStatus === "loading" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <Loader size={11} color="#4a4a5c" />
            <span style={{ fontSize:"11px", color:"#4a4a5c" }}>Finding on map…</span>
          </div>
        )}
        {geoStatus === "found" && coords && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#00d2be" />
            <span style={{ fontSize:"11px", color:"#00d2be" }}>Pinned · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          </div>
        )}
        {geoStatus === "failed" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#f59e0b" />
            <span style={{ fontSize:"11px", color:"#f59e0b" }}>Not found — will pin to Miami center</span>
          </div>
        )}
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline placeholder="What makes this spot great for photos?" />
        <Field label="Cover Image URL" value={form.cover} onChange={v=>set("cover",v)} placeholder="https://picsum.photos/seed/…" />
        <button onClick={submit} className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase text-white mt-2" style={{ background:"#e10600" }}>
          ADD PHOTO LOCATION
        </button>
      </div>
    </div>
  );
}
