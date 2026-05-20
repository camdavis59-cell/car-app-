"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, MapPin, Loader, Check } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { geocode } from "@/lib/geocode";
import { fileToDataUrl } from "@/lib/utils";

export default function NewPhotoLocationPage() {
  const router = useRouter();
  const { addPhotoLocation } = useStore();
  const coverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name:"", address:"", description:"" });
  const [cover, setCover] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle"|"loading"|"found"|"failed">("idle");

  const set = (k:string, v:string) => setForm(f=>({...f,[k]:v}));

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setCover(await fileToDataUrl(f, 700));
  }

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
    addPhotoLocation({ id: newId, lat, lng, name: form.name, description: form.description, cover: cover || `https://picsum.photos/seed/${newId}/600/400`, photos: [] });
    router.push(`/photo-locations/${newId}`);
  }

  const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", display:"block", marginBottom:"6px" };

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>PHOTO SPOTS</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Add Location</h1>
          </div>
        </div>
        <button onClick={submit} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> Add
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Cover upload */}
        <label style={LABEL}>Cover Photo</label>
        <button onClick={() => coverRef.current?.click()}
          style={{ width:"100%", height:"140px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {cover
            ? <Image src={cover} alt="cover" fill style={{ objectFit:"cover" }} unoptimized />
            : <><Camera size={24} color="#2c2c3a" /><span style={{ fontSize:"11px", fontWeight:700, color:"#4a4a5c", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tap to upload cover photo</span></>
          }
        </button>
        <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCover} />

        <Field label="Spot Name" value={form.name} onChange={v => set("name", v)} placeholder="Wynwood Walls" />
        <Field label="Address or Search" value={form.address} onChange={v=>{ set("address",v); setGeoStatus("idle"); setCoords(null); }} onBlur={handleAddressBlur} placeholder="2520 NW 2nd Ave, Miami" />
        {geoStatus === "loading" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <Loader size={11} color="#4a4a5c" /><span style={{ fontSize:"11px", color:"#4a4a5c" }}>Finding on map…</span>
          </div>
        )}
        {geoStatus === "found" && coords && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#00d2be" /><span style={{ fontSize:"11px", color:"#00d2be" }}>Pinned · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          </div>
        )}
        {geoStatus === "failed" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#f59e0b" /><span style={{ fontSize:"11px", color:"#f59e0b" }}>Not found — will pin to Miami center</span>
          </div>
        )}
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline placeholder="What makes this spot great for photos?" />

        <button onClick={submit} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          ADD PHOTO LOCATION
        </button>
      </div>
    </div>
  );
}
