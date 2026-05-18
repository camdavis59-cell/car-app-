"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import Field from "@/components/ui/Field";

const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c", display:"block", marginBottom:"6px" };
const SELECT: React.CSSProperties = { width:"100%", background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit", marginBottom:"16px" };

export default function NewRallyPage() {
  const router = useRouter();
  const { addRally } = useStore();

  const [form, setForm] = useState({
    name: "", date: "", startLocation: "", endLocation: "",
    stops: "", description: "", maxCars: "40",
    banner: "https://picsum.photos/seed/rally-new/800/300",
    fundraiser: false, goal: "5000",
  });

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.name || !form.date || !form.startLocation || !form.endLocation) return;
    const id = "r" + Date.now();
    addRally({
      id,
      name: form.name,
      date: form.date,
      startLocation: form.startLocation,
      endLocation: form.endLocation,
      stops: form.stops.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description,
      banner: form.banner,
      members: ["carlosriv59"],
      maxCars: parseInt(form.maxCars) || 40,
      fundraiser: form.fundraiser,
      goal: parseInt(form.goal) || 5000,
      raised: 0,
      status: "upcoming",
    });
    router.push(`/rally/${id}`);
  }

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>RALLY</p>
          <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Plan Rally</h1>
        </div>
      </div>

      <div style={{ padding:"20px 16px" }}>
        <Field label="Rally Name" value={form.name} onChange={v => set("name", v)} placeholder="Keys Run 2026" />
        <Field label="Date" value={form.date} onChange={v => set("date", v)} type="date" />
        <Field label="Start Location" value={form.startLocation} onChange={v => set("startLocation", v)} placeholder="Bayfront Park, Miami" />
        <Field label="End Location" value={form.endLocation} onChange={v => set("endLocation", v)} placeholder="Key West, FL" />
        <Field label="Stops (comma separated)" value={form.stops} onChange={v => set("stops", v)} placeholder="Key Largo, Islamorada, Marathon" />
        <Field label="Description" value={form.description} onChange={v => set("description", v)} multiline placeholder="Describe the route, vibe, and purpose of this rally…" />
        <Field label="Max Cars" value={form.maxCars} onChange={v => set("maxCars", v)} type="number" />
        <Field label="Banner Image URL" value={form.banner} onChange={v => set("banner", v)} placeholder="https://picsum.photos/seed/…" />

        {/* Fundraiser toggle */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid #1e1e2a", marginBottom: form.fundraiser ? "0" : "24px" }}>
          <div>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Fundraiser Rally</p>
            <p style={{ fontSize:"11px", color:"#4a4a5c" }}>Collect donations for a cause</p>
          </div>
          <button onClick={() => set("fundraiser", !form.fundraiser)}
            style={{ width:"48px", height:"24px", borderRadius:"12px", background: form.fundraiser ? "#e10600" : "#2c2c3a", border:"none", position:"relative", cursor:"pointer" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: form.fundraiser ? "calc(100% - 22px)" : "2px", transition:"left 0.15s" }} />
          </button>
        </div>

        {form.fundraiser && (
          <div style={{ marginBottom:"24px" }}>
            <Field label="Fundraiser Goal ($)" value={form.goal} onChange={v => set("goal", v)} type="number" placeholder="5000" />
          </div>
        )}

        <button onClick={submit} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          CREATE RALLY
        </button>
      </div>
    </div>
  );
}
