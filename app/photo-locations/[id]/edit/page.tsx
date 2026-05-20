"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check, Camera } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { fileToDataUrl } from "@/lib/utils";

export default function EditPhotoLocationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { photoLocations, updatePhotoLocation } = useStore();
  const loc = photoLocations.find(p => p.id === id);
  const coverRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(loc ? { name: loc.name, description: loc.description, cover: loc.cover } : null);
  if (!loc || !form) return null;

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = await fileToDataUrl(f, 700);
    setForm(prev => prev ? { ...prev, cover: url } : prev);
  }

  function save() {
    if (form) updatePhotoLocation(id, form);
    router.back();
  }

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>PHOTO LOCATION</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Edit Location</h1>
          </div>
        </div>
        <button onClick={save} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> Save
        </button>
      </div>
      <div style={{ padding:"20px 16px" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"8px" }}>Cover Photo</p>
        <button onClick={() => coverRef.current?.click()}
          style={{ width:"100%", height:"140px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {form.cover
            ? <Image src={form.cover} alt="cover" fill style={{ objectFit:"cover" }} unoptimized={form.cover.startsWith("data:") || form.cover.startsWith("blob:")} />
            : <><Camera size={24} color="#2c2c3a" /><span style={{ fontSize:"11px", fontWeight:700, color:"#4a4a5c" }}>Tap to upload</span></>
          }
        </button>
        <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCover} />
        <Field label="Location Name" value={form.name} onChange={v=>setForm(f=>f?{...f,name:v}:f)} />
        <Field label="Description" value={form.description} onChange={v=>setForm(f=>f?{...f,description:v}:f)} multiline />
        <button onClick={save} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
