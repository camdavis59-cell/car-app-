"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, Camera, MapPin, Loader, Check } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { geocode } from "@/lib/geocode";
import { fileToDataUrl } from "@/lib/utils";

const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c", display:"block", marginBottom:"6px" };

export default function NewRallyPage() {
  const router = useRouter();
  const { addRally } = useStore();
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", date: "", startLocation: "", endLocation: "", stops: "", description: "", maxCars: "40", fundraiser: false, goal: "5000" });
  const [banner, setBanner] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle"|"loading"|"found"|"failed">("idle");

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  async function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBanner(await fileToDataUrl(f));
  }

  async function handleStartBlur() {
    if (!form.startLocation.trim()) return;
    setGeoStatus("loading");
    const result = await geocode(form.startLocation);
    if (result) { setCoords(result); setGeoStatus("found"); }
    else { setGeoStatus("failed"); }
  }

  function submit() {
    if (!form.name || !form.date || !form.startLocation || !form.endLocation) return;
    const id = "r" + Date.now();
    addRally({
      id, name: form.name, date: form.date,
      startLocation: form.startLocation, endLocation: form.endLocation,
      stops: form.stops.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description,
      banner: banner || `https://picsum.photos/seed/${id}/800/300`,
      members: ["carlosriv59"],
      maxCars: parseInt(form.maxCars) || 40,
      fundraiser: form.fundraiser,
      goal: parseInt(form.goal) || 5000,
      raised: 0, status: "upcoming",
    });
    router.push(`/rally/${id}`);
  }

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>RALLY</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Plan Rally</h1>
          </div>
        </div>
        <button onClick={submit} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> Create
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Banner upload */}
        <label style={LABEL}>Rally Banner</label>
        <button onClick={() => bannerRef.current?.click()}
          style={{ width:"100%", height:"130px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {banner
            ? <Image src={banner} alt="banner" fill style={{ objectFit:"cover" }} unoptimized />
            : <><Camera size={24} color="#2c2c3a" /><span style={{ fontSize:"11px", fontWeight:700, color:"#4a4a5c", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tap to upload banner</span></>
          }
        </button>
        <input ref={bannerRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBanner} />

        <Field label="Rally Name" value={form.name} onChange={v => set("name", v)} placeholder="Keys Run 2026" />
        <Field label="Date" value={form.date} onChange={v => set("date", v)} type="date" />

        <Field label="Start Location" value={form.startLocation} onChange={v=>{ set("startLocation",v); setGeoStatus("idle"); setCoords(null); }} onBlur={handleStartBlur} placeholder="Bayfront Park, Miami" />
        {geoStatus === "loading" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <Loader size={11} color="#4a4a5c" /><span style={{ fontSize:"11px", color:"#4a4a5c" }}>Finding location…</span>
          </div>
        )}
        {geoStatus === "found" && coords && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#00d2be" /><span style={{ fontSize:"11px", color:"#00d2be" }}>Located · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          </div>
        )}
        {geoStatus === "failed" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#f59e0b" /><span style={{ fontSize:"11px", color:"#f59e0b" }}>Not found — pin will default to Miami</span>
          </div>
        )}

        <Field label="End Location" value={form.endLocation} onChange={v => set("endLocation", v)} placeholder="Key West, FL" />
        <Field label="Stops (comma separated)" value={form.stops} onChange={v => set("stops", v)} placeholder="Key Largo, Islamorada, Marathon" />
        <Field label="Description" value={form.description} onChange={v => set("description", v)} multiline placeholder="Describe the route, vibe, and purpose…" />
        <Field label="Max Cars" value={form.maxCars} onChange={v => set("maxCars", v)} type="number" />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid #1e1e2a", marginBottom: form.fundraiser ? "0" : "24px" }}>
          <div><p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Fundraiser Rally</p><p style={{ fontSize:"11px", color:"#4a4a5c" }}>Collect donations for a cause</p></div>
          <button onClick={() => set("fundraiser", !form.fundraiser)} style={{ width:"48px", height:"24px", borderRadius:"12px", background: form.fundraiser ? "#e10600" : "#2c2c3a", border:"none", position:"relative", cursor:"pointer" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: form.fundraiser ? "calc(100% - 22px)" : "2px", transition:"left 0.15s" }} />
          </button>
        </div>
        {form.fundraiser && <div style={{ marginBottom:"24px" }}><Field label="Fundraiser Goal ($)" value={form.goal} onChange={v => set("goal", v)} type="number" placeholder="5000" /></div>}

        <button onClick={submit} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          CREATE RALLY
        </button>
      </div>
    </div>
  );
}
