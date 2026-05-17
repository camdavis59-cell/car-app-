"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, Camera } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const CATS = ["EXHAUST","WHEELS","SUSPENSION","BRAKES","COOLING","INTERIOR","TIRES","ENGINE","OTHER"];
const CONDITIONS = ["New","Like New","Good","Fair","For Parts"];

const LABEL: React.CSSProperties = { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c", display:"block", marginBottom:"6px" };
const SELECT: React.CSSProperties = { width:"100%", background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit", marginBottom:"16px" };

export default function NewListingPage() {
  const router = useRouter();
  const { addListing } = useStore();
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", price: "", category: "EXHAUST", condition: "Good",
    description: "", compatibleWith: "", location: "Miami, FL",
    image: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    set("image", URL.createObjectURL(f));
  }

  function submit() {
    if (!form.title || !form.price) return;
    addListing({
      id: Date.now().toString(),
      title: form.title,
      price: parseFloat(form.price) || 0,
      category: form.category,
      condition: form.condition,
      seller: "carlosriv59",
      location: form.location,
      image: form.image || `https://picsum.photos/seed/${Date.now()}/400/400`,
      description: form.description,
      compatibleWith: form.compatibleWith,
      posted: "Just now",
    });
    router.push("/market");
  }

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"70px", minHeight:"100dvh", background:"#15151e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>MARKETPLACE</p>
          <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>Create Listing</h1>
        </div>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Photo upload */}
        <p style={LABEL}>PHOTO</p>
        <button onClick={() => photoRef.current?.click()}
          style={{ width:"100%", height:"160px", borderRadius:"4px", border:"2px dashed #2c2c3a", background:"#1e1e2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"16px", cursor:"pointer", overflow:"hidden", position:"relative" }}>
          {form.image
            ? <Image src={form.image} alt="listing" fill style={{ objectFit:"cover" }} />
            : <>
                <Camera size={28} color="#2c2c3a" />
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#4a4a5c" }}>TAP TO ADD PHOTO</span>
              </>
          }
        </button>
        <input ref={photoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />

        <Field label="Listing Title" value={form.title} onChange={v => set("title",v)} placeholder="Borla ATAK Cat-Back Exhaust" />
        <Field label="Price" value={form.price} onChange={v => set("price",v)} type="number" placeholder="850" />

        <label style={LABEL}>Category</label>
        <select value={form.category} onChange={e => set("category", e.target.value)} style={SELECT}>
          {CATS.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
        </select>

        <label style={LABEL}>Condition</label>
        <select value={form.condition} onChange={e => set("condition", e.target.value)} style={SELECT}>
          {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <Field label="Compatible With" value={form.compatibleWith} onChange={v => set("compatibleWith",v)} placeholder="2018-2023 Mustang GT" />
        <Field label="Description" value={form.description} onChange={v => set("description",v)} multiline placeholder="Describe the condition, install history, reason for selling…" />
        <Field label="Your Location" value={form.location} onChange={v => set("location",v)} placeholder="Miami, FL" />

        <button onClick={submit} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer", marginTop:"8px" }}>
          POST LISTING
        </button>
      </div>
    </div>
  );
}
