"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, MapPin, Loader, Check } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { geocode } from "@/lib/geocode";
import { fileToDataUrl } from "@/lib/utils";

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useStore();
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title:"", date:"", time:"7:00 PM", location:"", type:"meetup", max:"100", description:"", rules:"", attire:"Casual", vehicleTypes:"All welcome", tags:"", sponsor:"", private:false, sponsored:false });
  const [banner, setBanner] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle"|"loading"|"found"|"failed">("idle");

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  async function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBanner(await fileToDataUrl(f));
  }

  async function handleLocationBlur() {
    if (!form.location.trim()) return;
    setGeoStatus("loading");
    const result = await geocode(form.location);
    if (result) { setCoords(result); setGeoStatus("found"); }
    else { setGeoStatus("failed"); }
  }

  function submit() {
    if (!form.title || !form.date) return;
    const lat = coords?.lat ?? 25.7617;
    const lng = coords?.lng ?? -80.1918;
    addEvent({
      id: Date.now().toString(),
      title: form.title, date: form.date, time: form.time,
      location: form.location, lat, lng,
      type: form.type, rsvp: 0, max: parseInt(form.max)||100,
      organizer: "carlosriv59",
      banner: banner || `https://picsum.photos/seed/${Date.now()}/800/200`,
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
      description: form.description, rules: form.rules,
      attire: form.attire, vehicleTypes: form.vehicleTypes,
      private: form.private, sponsored: form.sponsored, sponsor: form.sponsor,
    });
    router.push("/events");
  }

  const SELECT: React.CSSProperties = { width:"100%", background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit", marginBottom:"16px" };
  const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", display:"block", marginBottom:"6px" };

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>EVENTS</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Create Event</h1>
          </div>
        </div>
        <button onClick={submit} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> Create
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Banner upload */}
        <label style={LABEL}>Event Banner</label>
        <button onClick={() => bannerRef.current?.click()}
          style={{ width:"100%", height:"140px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {banner
            ? <Image src={banner} alt="banner" fill style={{ objectFit:"cover" }} unoptimized />
            : <><Camera size={24} color="#2c2c3a" /><span style={{ fontSize:"11px", fontWeight:700, color:"#4a4a5c", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tap to upload banner</span></>
          }
        </button>
        <input ref={bannerRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBanner} />

        <Field label="Event Title" value={form.title} onChange={v=>set("title",v)} placeholder="Wynwood Car Meet" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          <Field label="Date" value={form.date} onChange={v=>set("date",v)} type="date" />
          <Field label="Time" value={form.time} onChange={v=>set("time",v)} placeholder="7:00 PM" />
        </div>

        <Field label="Location" value={form.location} onChange={v=>{ set("location",v); setGeoStatus("idle"); setCoords(null); }} onBlur={handleLocationBlur} placeholder="Wynwood Walls, Miami" />
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
            <MapPin size={11} color="#f59e0b" /><span style={{ fontSize:"11px", color:"#f59e0b" }}>Not found — defaulting to Miami center</span>
          </div>
        )}

        <label style={LABEL}>Event Type</label>
        <select value={form.type} onChange={e=>set("type",e.target.value)} style={SELECT}>
          {["meetup","competition","cruise","show","rally"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>

        <Field label="Max Cars" value={form.max} onChange={v=>set("max",v)} type="number" />
        <Field label="Vehicle Types" value={form.vehicleTypes} onChange={v=>set("vehicleTypes",v)} placeholder="All welcome / JDM only / etc." />
        <Field label="Attire" value={form.attire} onChange={v=>set("attire",v)} placeholder="Casual" />
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline placeholder="Tell people what to expect…" />
        <Field label="Rules" value={form.rules} onChange={v=>set("rules",v)} multiline placeholder="No burnouts. Respect the location." />
        <Field label="Tags (comma separated)" value={form.tags} onChange={v=>set("tags",v)} placeholder="JDM, photography, cruise" />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid #1e1e2a" }}>
          <div><p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Private Event</p><p style={{ fontSize:"11px", color:"#4a4a5c" }}>Only visible via invite</p></div>
          <button onClick={() => set("private", !form.private)} style={{ width:"48px", height:"24px", borderRadius:"12px", background: form.private?"#e10600":"#2c2c3a", border:"none", position:"relative", cursor:"pointer" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: form.private?"calc(100% - 22px)":"2px", transition:"left 0.15s" }} />
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid #1e1e2a", marginBottom:"24px" }}>
          <div><p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Sponsored</p><p style={{ fontSize:"11px", color:"#4a4a5c" }}>Has a sponsor attached</p></div>
          <button onClick={() => set("sponsored", !form.sponsored)} style={{ width:"48px", height:"24px", borderRadius:"12px", background: form.sponsored?"#e10600":"#2c2c3a", border:"none", position:"relative", cursor:"pointer" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: form.sponsored?"calc(100% - 22px)":"2px", transition:"left 0.15s" }} />
          </button>
        </div>
        {form.sponsored && <Field label="Sponsor Name" value={form.sponsor} onChange={v=>set("sponsor",v)} placeholder="Prestige Auto Group" />}

        <button onClick={submit} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          CREATE EVENT
        </button>
      </div>
    </div>
  );
}
