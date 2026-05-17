"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check } from "lucide-react";
import Field from "@/components/ui/Field";
import Image from "next/image";

export default function EditPhotoLocationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { photoLocations, updatePhotoLocation } = useStore();
  const loc = photoLocations.find(p => p.id === id);
  const [form, setForm] = useState(loc ? { name: loc.name, description: loc.description, cover: loc.cover } : null);
  if (!loc || !form) return null;

  function save() {
    if (form) updatePhotoLocation(id, form);
    router.back();
  }

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div className="flex-1">
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>PHOTO LOCATION</p>
          <h1 className="text-[15px] font-black text-white">Edit Location</h1>
        </div>
        <button onClick={save} className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-wide uppercase text-white" style={{ background:"#e10600" }}>
          <Check size={12}/> Save
        </button>
      </div>
      <div className="px-4 py-5">
        {form.cover && (
          <div className="relative h-40 rounded-sm overflow-hidden mb-4" style={{ border:"1px solid #2c2c3a" }}>
            <Image src={form.cover} alt="cover" fill className="object-cover" />
          </div>
        )}
        <Field label="Location Name" value={form.name} onChange={v=>setForm(f=>f?{...f,name:v}:f)} />
        <Field label="Description" value={form.description} onChange={v=>setForm(f=>f?{...f,description:v}:f)} multiline />
        <Field label="Cover Image URL" value={form.cover} onChange={v=>setForm(f=>f?{...f,cover:v}:f)} placeholder="https://picsum.photos/…" />
      </div>
    </div>
  );
}
