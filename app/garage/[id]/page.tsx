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
  const { garage, addCar, updateCar, deleteCar, addCarPhoto } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const existing = garage.find(c => c.id === id);
  const blank = { id: "", year: new Date().getFullYear(), make: "", model: "", color: "", horsepower: "", engine: "", transmission: "", drivetrain: "RWD", weight: "", description: "", mods: [], photos: [] };
  const [car, setCar] = useState(existing ?? blank);
  const [modInput, setModInput] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (isNew(id)) {
      setCar(c => ({ ...c, photos: [...c.photos, url] }));
    } else {
      addCarPhoto(id, url);
    }
  }

  function save() {
    setSaving(true);
    if (isNew(id)) {
      const newId = Date.now().toString();
      addCar({ ...car, id: newId });
      router.push("/profile");
    } else {
      updateCar(id, car);
      router.back();
    }
  }

  function remove() {
    deleteCar(id);
    router.push("/profile");
  }

  const photos = isNew(id) ? car.photos : (existing?.photos ?? []);

  const S = { label: { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c", marginBottom:"6px" } };

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
            <ArrowLeft size={15} color="#fff" />
          </button>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>GARAGE</p>
            <h1 className="text-[15px] font-black text-white">{isNew(id) ? "Add Car" : `${car.make} ${car.model}`}</h1>
          </div>
        </div>
        <button onClick={save} className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-wide uppercase text-white" style={{ background:"#e10600" }}>
          <Check size={12} /> {isNew(id) ? "Add" : "Save"}
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Photo strip */}
        <div>
          <p style={S.label}>PHOTOS</p>
          <div className="flex gap-2 overflow-x-auto no-scroll pb-2 mb-4">
            {photos.map((url, i) => (
              <div key={i} className="w-24 h-20 rounded-sm overflow-hidden shrink-0 relative" style={{ border:"1px solid #2c2c3a" }}>
                <Image src={url} alt="car" fill className="object-cover" />
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="w-24 h-20 rounded-sm flex flex-col items-center justify-center gap-1 shrink-0"
              style={{ background:"#1e1e2a", border:"1px dashed #2c2c3a" }}>
              <Camera size={18} style={{ color:"#4a4a5c" }} />
              <span style={{ fontSize:"9px", color:"#4a4a5c", fontWeight:700, letterSpacing:"0.08em" }}>ADD PHOTO</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-3">
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Make" value={car.make} onChange={v => set("make",v)} placeholder="Toyota" />
          </div>
          <Field label="Model" value={car.model} onChange={v => set("model",v)} placeholder="Supra" />
          <Field label="Year" value={String(car.year)} onChange={v => set("year",parseInt(v)||0)} type="number" />
          <Field label="Color" value={car.color} onChange={v => set("color",v)} placeholder="Super White" />
          <Field label="Horsepower" value={car.horsepower} onChange={v => set("horsepower",v)} placeholder="600" />
        </div>
        <Field label="Engine" value={car.engine} onChange={v => set("engine",v)} placeholder="2JZ-GTE Inline-6 Twin Turbo" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Transmission" value={car.transmission} onChange={v => set("transmission",v)} placeholder="6-Speed Manual" />
          <Field label="Drivetrain" value={car.drivetrain} onChange={v => set("drivetrain",v)} placeholder="RWD" />
        </div>
        <Field label="Weight" value={car.weight} onChange={v => set("weight",v)} placeholder="3,450 lbs" />
        <Field label="Description" value={car.description} onChange={v => set("description",v)} multiline placeholder="Tell us about this build…" />

        {/* Mods */}
        <p style={S.label}>MODIFICATIONS</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {car.mods.map((m,i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
              <span style={{ fontSize:"11px", color:"#8888a0" }}>{m}</span>
              <button onClick={() => removeMod(i)}><X size={10} style={{ color:"#4a4a5c" }} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          <input value={modInput} onChange={e => setModInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && addMod()}
            placeholder="e.g. Volk TE37 wheels"
            className="flex-1"
            style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"10px 12px", outline:"none", fontFamily:"inherit" }} />
          <button onClick={addMod} className="px-4 rounded-sm text-[11px] font-black text-white" style={{ background:"#e10600" }}>ADD</button>
        </div>

        {/* Delete */}
        {!isNew(id) && (
          <button onClick={remove} className="w-full py-3 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2" style={{ background:"transparent", border:"1px solid #e10600", color:"#e10600" }}>
            <Trash2 size={13} /> Remove This Car
          </button>
        )}
      </div>
    </div>
  );
}
