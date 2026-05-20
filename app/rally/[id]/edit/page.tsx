"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check, Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { fileToDataUrl } from "@/lib/utils";

export default function EditRallyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { rallies, updateRally } = useStore();
  const rally = rallies.find(r => r.id === id);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(rally ? {
    name: rally.name, date: rally.date,
    startLocation: rally.startLocation, endLocation: rally.endLocation,
    stops: rally.stops.join(", "), description: rally.description,
    maxCars: String(rally.maxCars), banner: rally.banner,
    fundraiser: rally.fundraiser, goal: String(rally.goal),
  } : null);

  if (!rally || !form) return null;
  const set = (k: string, v: string | boolean) => setForm(f => f ? { ...f, [k]: v } : f);

  async function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = await fileToDataUrl(f);
    setForm(prev => prev ? { ...prev, banner: url } : prev);
  }

  function save() {
    if (!form) return;
    updateRally(id, {
      name: form.name, date: form.date,
      startLocation: form.startLocation, endLocation: form.endLocation,
      stops: form.stops.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description,
      maxCars: parseInt(form.maxCars) || 40,
      banner: form.banner,
      fundraiser: form.fundraiser,
      goal: parseInt(form.goal) || 0,
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
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Edit Rally</h1>
          </div>
        </div>
        <button onClick={save} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> Save
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"8px" }}>Banner</p>
        <button onClick={() => bannerRef.current?.click()}
          style={{ width:"100%", height:"130px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {form.banner
            ? <Image src={form.banner} alt="banner" fill style={{ objectFit:"cover" }} unoptimized={form.banner.startsWith("data:")} />
            : <><Camera size={24} color="#2c2c3a" /><span style={{ fontSize:"11px", fontWeight:700, color:"#4a4a5c" }}>Tap to upload</span></>
          }
        </button>
        <input ref={bannerRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBanner} />

        <Field label="Rally Name" value={form.name} onChange={v=>set("name",v)} />
        <Field label="Date" value={form.date} onChange={v=>set("date",v)} type="date" />
        <Field label="Start Location" value={form.startLocation} onChange={v=>set("startLocation",v)} />
        <Field label="End Location" value={form.endLocation} onChange={v=>set("endLocation",v)} />
        <Field label="Stops (comma separated)" value={form.stops} onChange={v=>set("stops",v)} />
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline />
        <Field label="Max Cars" value={form.maxCars} onChange={v=>set("maxCars",v)} type="number" />

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderTop:"1px solid #1e1e2a", marginBottom: form.fundraiser?"0":"24px" }}>
          <div><p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>Fundraiser</p></div>
          <button onClick={() => set("fundraiser", !form.fundraiser)} style={{ width:"48px", height:"24px", borderRadius:"12px", background: form.fundraiser?"#e10600":"#2c2c3a", border:"none", position:"relative", cursor:"pointer" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"2px", left: form.fundraiser?"calc(100% - 22px)":"2px", transition:"left 0.15s" }} />
          </button>
        </div>
        {form.fundraiser && <div style={{ marginBottom:"24px" }}><Field label="Goal ($)" value={form.goal} onChange={v=>set("goal",v)} type="number" /></div>}

        <button onClick={save} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
