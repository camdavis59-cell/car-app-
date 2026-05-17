"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, Trash2 } from "lucide-react";
import Field from "@/components/ui/Field";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { events, updateEvent, deleteEvent } = useStore();
  const ev = events.find(e => e.id === id);
  const [form, setForm] = useState(ev ? { ...ev, lat: String(ev.lat), lng: String(ev.lng), max: String(ev.max), tags: ev.tags.join(", ") } : null);

  if (!form) return null;
  const set = (k: string, v: string | boolean) => setForm((f:any) => f ? { ...f, [k]: v } : f);

  function save() {
    if (!form) return;
    updateEvent(id, { ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng), max: parseInt(form.max)||100, tags: form.tags.split(",").map((t:string)=>t.trim()).filter(Boolean) });
    router.push(`/events/${id}`);
  }

  function remove() { deleteEvent(id); router.push("/events"); }

  const SELECT: React.CSSProperties = { width:"100%", background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit", marginBottom:"16px" };
  const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", display:"block", marginBottom:"6px" };

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div className="flex-1">
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>EVENTS</p>
          <h1 className="text-[15px] font-black text-white">Edit Event</h1>
        </div>
        <button onClick={save} className="px-3.5 py-2 rounded-sm text-[11px] font-black tracking-wide uppercase text-white" style={{ background:"#e10600" }}>Save</button>
      </div>

      <div className="px-4 py-5">
        <Field label="Event Title" value={form.title} onChange={v=>set("title",v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" value={form.date} onChange={v=>set("date",v)} type="date" />
          <Field label="Time" value={form.time} onChange={v=>set("time",v)} />
        </div>
        <Field label="Location" value={form.location} onChange={v=>set("location",v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" value={form.lat} onChange={v=>set("lat",v)} />
          <Field label="Longitude" value={form.lng} onChange={v=>set("lng",v)} />
        </div>
        <label style={LABEL}>Event Type</label>
        <select value={form.type} onChange={e=>set("type",e.target.value)} style={SELECT}>
          {["meetup","competition","cruise","show","rally"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>
        <Field label="Max Cars" value={form.max} onChange={v=>set("max",v)} type="number" />
        <Field label="Vehicle Types" value={form.vehicleTypes} onChange={v=>set("vehicleTypes",v)} />
        <Field label="Attire" value={form.attire} onChange={v=>set("attire",v)} />
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline />
        <Field label="Rules" value={form.rules} onChange={v=>set("rules",v)} multiline />
        <Field label="Tags (comma separated)" value={form.tags} onChange={v=>set("tags",v)} />
        <Field label="Banner Image URL" value={form.banner} onChange={v=>set("banner",v)} />

        <div className="flex items-center justify-between py-3 mb-2" style={{ borderTop:"1px solid #1e1e2a" }}>
          <p className="text-[13px] font-bold text-white">Private Event</p>
          <button onClick={() => set("private", !form.private)} className="w-12 h-6 rounded-full relative" style={{ background: form.private?"#e10600":"#2c2c3a" }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: form.private?"calc(100% - 22px)":"2px" }} />
          </button>
        </div>
        <div className="flex items-center justify-between py-3 mb-6" style={{ borderTop:"1px solid #1e1e2a" }}>
          <p className="text-[13px] font-bold text-white">Sponsored</p>
          <button onClick={() => set("sponsored", !form.sponsored)} className="w-12 h-6 rounded-full relative" style={{ background: form.sponsored?"#e10600":"#2c2c3a" }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: form.sponsored?"calc(100% - 22px)":"2px" }} />
          </button>
        </div>
        {form.sponsored && <Field label="Sponsor Name" value={form.sponsor} onChange={v=>set("sponsor",v)} />}

        <button onClick={remove} className="w-full py-3 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2 mt-2" style={{ background:"transparent", border:"1px solid #e10600", color:"#e10600" }}>
          <Trash2 size={13} /> Delete Event
        </button>
      </div>
    </div>
  );
}
