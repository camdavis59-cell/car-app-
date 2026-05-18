"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Pencil, Trash2, Check, X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const MAX_PHOTOS = 6;

export default function CarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { garage, addCar, updateCar, deleteCar } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = id === "new";

  const existing = garage.find(c => c.id === id);
  const blank = { id: "", year: new Date().getFullYear(), make: "", model: "", color: "", horsepower: "", engine: "", transmission: "", drivetrain: "RWD", weight: "", description: "", mods: [], photos: [] };

  const [mode, setMode] = useState<"view"|"edit">(isNew ? "edit" : "view");
  const [car, setCar] = useState(existing ?? blank);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [modInput, setModInput] = useState("");

  if (!isNew && !existing) { router.push("/profile"); return null; }

  function set(k: string, v: string | number) { setCar(c => ({ ...c, [k]: v })); }

  function addMod() {
    if (!modInput.trim()) return;
    setCar(c => ({ ...c, mods: [...c.mods, modInput.trim()] }));
    setModInput("");
  }

  function removeMod(i: number) { setCar(c => ({ ...c, mods: c.mods.filter((_,idx) => idx !== i) })); }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (car.photos.length >= MAX_PHOTOS) return;
    const url = URL.createObjectURL(f);
    setCar(c => ({ ...c, photos: [...c.photos, url] }));
    e.target.value = "";
  }

  function removePhoto(i: number) {
    setCar(c => ({ ...c, photos: c.photos.filter((_,idx) => idx !== i) }));
    setPhotoIdx(p => Math.min(p, Math.max(0, car.photos.length - 2)));
  }

  function save() {
    if (isNew) {
      addCar({ ...car, id: Date.now().toString() });
    } else {
      updateCar(id, car);
    }
    router.push("/profile");
  }

  function cancel() {
    if (isNew) { router.push("/profile"); return; }
    setCar(existing!);
    setMode("view");
  }

  function remove() { deleteCar(id); router.push("/profile"); }

  const S = {
    label: { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c" },
  };

  // ─── VIEW MODE ────────────────────────────────────────────────────────────
  if (mode === "view") {
    const photos = car.photos;
    return (
      <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
              <ArrowLeft size={15} color="#fff" />
            </button>
            <div>
              <p style={{ ...S.label, marginBottom:"2px" }}>GARAGE</p>
              <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>{car.make} {car.model}</h1>
            </div>
          </div>
          <button onClick={() => setMode("edit")} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#8888a0", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
            <Pencil size={12} /> Edit Car
          </button>
        </div>

        {/* Photo carousel */}
        <div style={{ position:"relative", width:"100%", aspectRatio:"16/9", background:"#1e1e2a" }}>
          {photos.length > 0 ? (
            <>
              <Image src={photos[photoIdx]} alt="car" fill style={{ objectFit:"cover" }} unoptimized={photos[photoIdx].startsWith("blob:")} />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                    style={{ position:"absolute", left:"8px", top:"50%", transform:"translateY(-50%)", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(21,21,30,0.85)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <ChevronLeft size={16} color="#fff" />
                  </button>
                  <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                    style={{ position:"absolute", right:"8px", top:"50%", transform:"translateY(-50%)", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(21,21,30,0.85)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <ChevronRight size={16} color="#fff" />
                  </button>
                </>
              )}
              {photos.length > 1 && (
                <div style={{ position:"absolute", bottom:"10px", left:0, right:0, display:"flex", justifyContent:"center", gap:"5px" }}>
                  {photos.map((_,i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)} style={{ width: i===photoIdx?"18px":"6px", height:"6px", borderRadius:"3px", background: i===photoIdx?"#e10600":"rgba(255,255,255,0.4)", border:"none", cursor:"pointer", transition:"width 0.2s" }} />
                  ))}
                </div>
              )}
              <div style={{ position:"absolute", top:"10px", right:"10px", padding:"3px 8px", borderRadius:"3px", background:"rgba(21,21,30,0.85)", fontSize:"10px", fontWeight:700, color:"#fff" }}>
                {photoIdx+1}/{photos.length}
              </div>
            </>
          ) : (
            <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}>
              <Camera size={32} color="#2c2c3a" />
              <p style={{ fontSize:"12px", color:"#4a4a5c" }}>No photos yet</p>
            </div>
          )}
        </div>

        {/* Car identity */}
        <div style={{ padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
          <p style={{ ...S.label, marginBottom:"4px" }}>{car.year} · {car.color}</p>
          <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", letterSpacing:"-0.02em", marginBottom:"8px" }}>{car.make} {car.model}</h2>
          {car.description && <p style={{ fontSize:"13px", color:"#8888a0", lineHeight:1.6 }}>{car.description}</p>}
        </div>

        {/* Specs grid */}
        <div style={{ padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
          <p style={{ ...S.label, marginBottom:"12px" }}>Specs</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            {[
              { label:"Horsepower", val: car.horsepower ? `${car.horsepower} HP` : "—" },
              { label:"Engine",     val: car.engine || "—" },
              { label:"Transmission", val: car.transmission || "—" },
              { label:"Drivetrain", val: car.drivetrain || "—" },
              { label:"Weight",     val: car.weight || "—" },
            ].map(s => (
              <div key={s.label} style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"4px", padding:"10px 12px" }}>
                <p style={{ ...S.label, fontSize:"9px", marginBottom:"4px" }}>{s.label}</p>
                <p style={{ fontSize:"12px", fontWeight:700, color:"#fff", lineHeight:1.3 }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mods */}
        {car.mods.length > 0 && (
          <div style={{ padding:"16px" }}>
            <p style={{ ...S.label, marginBottom:"12px" }}>Modifications ({car.mods.length})</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {car.mods.map((m,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 12px", background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px" }}>
                  <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#e10600", flexShrink:0 }} />
                  <span style={{ fontSize:"12px", color:"#8888a0" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── EDIT MODE ────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={cancel} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ ...S.label, marginBottom:"2px" }}>GARAGE</p>
            <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>{isNew ? "Add Car" : "Edit Car"}</h1>
          </div>
        </div>
        <button onClick={save} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
          <Check size={12} /> {isNew ? "Add" : "Save"}
        </button>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Photos — up to 6 */}
        <p style={{ ...S.label, marginBottom:"8px" }}>Photos ({car.photos.length}/{MAX_PHOTOS})</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px", marginBottom:"16px" }}>
          {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
            const photo = car.photos[i];
            return (
              <div key={i} style={{ position:"relative", aspectRatio:"4/3", borderRadius:"4px", overflow:"hidden", background:"#1e1e2a", border:`1px ${photo?"solid":"dashed"} #2c2c3a` }}>
                {photo ? (
                  <>
                    <Image src={photo} alt="car" fill style={{ objectFit:"cover" }} unoptimized={photo.startsWith("blob:")} />
                    <button onClick={() => removePhoto(i)} style={{ position:"absolute", top:"4px", right:"4px", width:"20px", height:"20px", borderRadius:"50%", background:"rgba(21,21,30,0.9)", border:"1px solid #2c2c3a", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <X size={10} color="#fff" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => fileRef.current?.click()} style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px", background:"transparent", border:"none", cursor:"pointer" }}>
                    <Camera size={16} color="#2c2c3a" />
                    <span style={{ fontSize:"9px", color:"#2c2c3a", fontWeight:700 }}>ADD</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />

        {/* Fields */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Make" value={car.make} onChange={v => set("make",v)} placeholder="Ford" />
          </div>
          <Field label="Model" value={car.model} onChange={v => set("model",v)} placeholder="Mustang Bullitt" />
          <Field label="Year" value={String(car.year)} onChange={v => set("year",parseInt(v)||0)} type="number" />
          <Field label="Color" value={car.color} onChange={v => set("color",v)} placeholder="Highland Green" />
          <Field label="Horsepower" value={car.horsepower} onChange={v => set("horsepower",v)} placeholder="480" />
        </div>
        <Field label="Engine" value={car.engine} onChange={v => set("engine",v)} placeholder="5.0L V8 Ti-VCT" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          <Field label="Transmission" value={car.transmission} onChange={v => set("transmission",v)} placeholder="6-Speed Manual" />
          <Field label="Drivetrain" value={car.drivetrain} onChange={v => set("drivetrain",v)} placeholder="RWD" />
        </div>
        <Field label="Weight" value={car.weight} onChange={v => set("weight",v)} placeholder="3,705 lbs" />
        <Field label="Description" value={car.description} onChange={v => set("description",v)} multiline placeholder="Tell us about this build…" />

        {/* Mods */}
        <p style={{ ...S.label, marginBottom:"8px", marginTop:"4px" }}>Modifications</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"10px" }}>
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

        <button onClick={save} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"12px" }}>
          <Check size={14} /> {isNew ? "ADD VEHICLE TO GARAGE" : "SAVE CHANGES"}
        </button>
        {!isNew && (
          <button onClick={remove} style={{ width:"100%", padding:"12px", borderRadius:"4px", background:"transparent", border:"1px solid #e10600", color:"#e10600", fontSize:"11px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            <Trash2 size={13} /> Remove This Car
          </button>
        )}
      </div>
    </div>
  );
}
