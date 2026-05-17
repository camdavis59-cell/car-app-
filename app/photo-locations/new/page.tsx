"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Field from "@/components/ui/Field";

export default function NewPhotoLocationPage() {
  const router = useRouter();
  const { addPhotoLocation } = useStore();
  const [form, setForm] = useState({ name:"", description:"", lat:"25.7617", lng:"-80.1918", cover:"https://picsum.photos/seed/new/600/400" });
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  function submit() {
    if (!form.name) return;
    const newId = "p" + Date.now();
    addPhotoLocation({ id: newId, lat: parseFloat(form.lat)||25.7617, lng: parseFloat(form.lng)||-80.1918, name: form.name, description: form.description, cover: form.cover, photos: [] });
    router.push(`/photo-locations/${newId}`);
  }

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
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
        <Field label="Location Name" value={form.name} onChange={v=>set("name",v)} placeholder="Wynwood Walls" />
        <Field label="Description" value={form.description} onChange={v=>set("description",v)} multiline placeholder="What makes this spot great for photos?" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" value={form.lat} onChange={v=>set("lat",v)} placeholder="25.7617" />
          <Field label="Longitude" value={form.lng} onChange={v=>set("lng",v)} placeholder="-80.1918" />
        </div>
        <Field label="Cover Image URL" value={form.cover} onChange={v=>set("cover",v)} placeholder="https://picsum.photos/seed/…" />
        <button onClick={submit} className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase text-white mt-2" style={{ background:"#e10600" }}>
          ADD PHOTO LOCATION
        </button>
      </div>
    </div>
  );
}
