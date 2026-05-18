"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Plus, Trash2, Check, X, Camera } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const isNew = (id: string) => id === "new";

export default function CarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { garage, addCar, updateCar, deleteCar } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const existing = garage.find(c => c.id === id);
  const blank = { id: "", year: new Date().getFullYear(), make: "", model: "", color: "", horsepower: "", engine: "", transmission: "", drivetrain: "RWD", weight: "", description: "", mods: [], photos: [] };
  const [car, setCar] = useState(existing ?? blank);
  const [modInput, setModInput] = useState("");

  function set(k: string, v: string | number) { setCar(c => ({ ...c, [k]: v })); }

  function addMod() {
    if (!modInput.trim()) return;
    setCar(c => ({ ...c, mods: [...c.mods, modInput.trim()] }));
    setModInput("");
  }

  function removeMod(i: number) { setCar(c => ({ ...c, mods: c.mods.filter((_,idx) => idx !== i) })); }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setCar(c => ({ ...c, photos: [...c.photos, url] }));
  }

  function save() {
    if (isNew(id)) {
      const newId = Date.now().toString();
      addCar({ ...car, id: newId });
    } else {
      updateCar(id, car);
    }
    router.push("/profile");
  }

  function remove() {
    deleteCar(id);
    router.push("/profile");
  }

  const S = { label: { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c", marginBottom:"6px" } };

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>GARAGE</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>{isNew(id) ? "Add Car" : `${car.make} ${car.model}`}</h1>
          </div>
        </div>
        <button onClick={save} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> {isNew(id) ? "Add" : "Save"}
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Photo strip */}
        <p style={S.label}>PHOTOS</p>
        <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"8px", marginBottom:"16px" }}>
          {car.photos.map((url, i) => (
            <div key={i} style={{ width:"96px", height:"80px", borderRadius:"4px", overflow:"hidden", flexShrink:0, border:"1px solid #2c2c3a", position:"relative" }}>
              <Image src={url} alt="car" fill style={{ objectFit:"cover" }} />
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} style={{ width:"96px", height:"80px", borderRadius:"4px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px", flexShrink:0, background:"#1e1e2a", border:"1px dashed #2c2c3a", cursor:"pointer" }}>
            <Camera size={18} color="#4a4a5c" />
            <span style={{ fontSize:"9px", color:"#4a4a5c", fontWeight:700, letterSpacing:"0.08em" }}>ADD PHOTO</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
        </div>

        {/* Note: photos are saved when you tap Save/Add Vehicle below */}
        {car.photos.length === 0 && (
          <p style={{ fontSize:"11px", color:"#4a4a5c", marginBottom:"16px", marginTop:"-8px" }}>Tap ADD PHOTO then hit Save to keep your photos.</p>
        )}

        {/* Basic info */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Make" value={car.make} onChange={v => set("make",v)} placeholder="Ford" />
          </div>
          <Field label="Model" value={car.model} onChange={v => set("model",v)} placeholder="Mustang" />
          <Field label="Year" value={String(car.year)} onChange={v => set("year",parseInt(v)||0)} type="number" />
          <Field label="Color" value={car.color} onChange={v => set("color",v)} placeholder="Highland Green" />
          <Field label="Horsepower" value={car.horsepower} onChange={v => set("horsepower",v)} placeholder="480" />
        </div>
        <Field label="Engine" value={car.engine} onChange={v => set("engine",v)} placeholder="5.0L V8" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          <Field label="Transmission" value={car.transmission} onChange={v => set("transmission",v)} placeholder="6-Speed Manual" />
          <Field label="Drivetrain" value={car.drivetrain} onChange={v => set("drivetrain",v)} placeholder="RWD" />
        </div>
        <Field label="Weight" value={car.weight} onChange={v => set("weight",v)} placeholder="3,705 lbs" />
        <Field label="Description" value={car.description} onChange={v => set("description",v)} multiline placeholder="Tell us about this build…" />

        {/* Mods */}
        <p style={S.label}>MODIFICATIONS</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"12px" }}>
          {car.mods.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", borderRadius:"3px", background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
              <span style={{ fontSize:"11px", color:"#8888a0" }}>{m}</span>
              <button onClick={() => removeMod(i)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}><X size={10} color="#4a4a5c" /></button>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
          <input value={modInput} onChange={e => setModInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && addMod()}
            placeholder="e.g. Borla ATAK exhaust"
            style={{ flex:1, background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit" }} />
          <button onClick={addMod} style={{ padding:"0 16px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, border:"none", cursor:"pointer" }}>ADD</button>
        </div>

        {/* Bottom save */}
        <button onClick={save} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"12px" }}>
          <Check size={14} /> {isNew(id) ? "ADD VEHICLE TO GARAGE" : "SAVE CHANGES"}
        </button>

        {!isNew(id) && (
          <button onClick={remove} style={{ width:"100%", padding:"12px", borderRadius:"4px", background:"transparent", border:"1px solid #e10600", color:"#e10600", fontSize:"11px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            <Trash2 size={13} /> Remove This Car
          </button>
        )}
      </div>
    </div>
  );
}
