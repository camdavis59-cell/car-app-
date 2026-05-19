"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Loader } from "lucide-react";
import Field from "@/components/ui/Field";
import { geocode } from "@/lib/geocode";

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useStore();
  const [form, setForm] = useState({ title:"", date:"", time:"7:00 PM", location:"", type:"meetup", max:"100", description:"", rules:"", attire:"Casual", vehicleTypes:"All welcome", tags:"", banner:"https://picsum.photos/seed/new1/800/200", sponsor:"", private:false, sponsored:false });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle"|"loading"|"found"|"failed">("idle");

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

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
      organizer: "carlosriv59", banner: form.banner,
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
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>EVENTS</p>
          <h1 className="text-[15px] font-black text-white">Create Event</h1>
        </div>
      </div>

      <div className="px-4 py-5">
        <Field label="Event Title" value={form.title} onChange={v=>set("title",v)} placeholder="Wynwood Car Meet" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" value={form.date} onChange={v=>set("date",v)} type="date" />
          <Field label="Time" value={form.time} onChange={v=>set("time",v)} placeholder="7:00 PM" />
        </div>

        {/* Location with geocode */}
        <Field label="Location" value={form.location} onChange={v=>{ set("location",v); setGeoStatus("idle"); setCoords(null); }} onBlur={handleLocationBlur} placeholder="Wynwood Walls, Miami" />
        {geoStatus === "loading" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <Loader size={11} color="#4a4a5c" className="animate-spin" />
            <span style={{ fontSize:"11px", color:"#4a4a5c" }}>Finding location…</span>
          </div>
        )}
        {geoStatus === "found" && coords && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#00d2be" />
            <span style={{ fontSize:"11px", color:"#00d2be" }}>Located · {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          </div>
        )}
        {geoStatus === "failed" && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"-10px", marginBottom:"16px" }}>
            <MapPin size={11} color="#f59e0b" />
            <span style={{ fontSize:"11px", color:"#f59e0b" }}>Location not found — will default to Miami center</span>
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
        <Field label="Banner Image URL" value={form.banner} onChange={v=>set("banner",v)} placeholder="https://…" />

        <div className="flex items-center justify-between py-3 mb-2" style={{ borderTop:"1px solid #1e1e2a" }}>
          <div>
            <p className="text-[13px] font-bold text-white">Private Event</p>
            <p style={{ fontSize:"11px", color:"#4a4a5c" }}>Only visible via invite link</p>
          </div>
          <button onClick={() => set("private", !form.private)}
            className="w-12 h-6 rounded-full relative transition-all"
            style={{ background: form.private?"#e10600":"#2c2c3a" }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: form.private?"calc(100% - 22px)":"2px" }} />
          </button>
        </div>
        <div className="flex items-center justify-between py-3 mb-6" style={{ borderTop:"1px solid #1e1e2a" }}>
          <div>
            <p className="text-[13px] font-bold text-white">Sponsored</p>
            <p style={{ fontSize:"11px", color:"#4a4a5c" }}>Has a sponsor attached</p>
          </div>
          <button onClick={() => set("sponsored", !form.sponsored)}
            className="w-12 h-6 rounded-full relative transition-all"
            style={{ background: form.sponsored?"#e10600":"#2c2c3a" }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: form.sponsored?"calc(100% - 22px)":"2px" }} />
          </button>
        </div>
        {form.sponsored && <Field label="Sponsor Name" value={form.sponsor} onChange={v=>set("sponsor",v)} placeholder="Prestige Auto Group" />}

        <button onClick={submit} className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase text-white" style={{ background:"#e10600" }}>
          CREATE EVENT
        </button>
      </div>
    </div>
  );
}
