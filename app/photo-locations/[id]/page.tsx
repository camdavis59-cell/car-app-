"use client";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Camera, Heart, Upload, Pencil, Plus } from "lucide-react";
import Image from "next/image";

export default function PhotoLocationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { photoLocations, addPhotoToLocation } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const location = photoLocations.find(p => p.id === id);
  if (!location) return null;

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    addPhotoToLocation(id, { id: Date.now().toString(), url, user: "@carlosriv59", car: "1994 Supra", likes: 0, ago: "Just now" });
  }

  const totalLikes = location.photos.reduce((s,p) => s+p.likes, 0);
  const contributors = new Set(location.photos.map(p=>p.user)).size;

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      {/* Cover */}
      <div className="relative h-52 overflow-hidden">
        <Image src={location.cover} alt={location.name} fill className="object-cover" style={{ filter:"brightness(0.55)" }} />
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center z-10" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <button onClick={() => router.push(`/photo-locations/${id}/edit`)} className="absolute top-4 right-4 w-8 h-8 rounded-sm flex items-center justify-center z-10" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <Pencil size={13} color="#fff" />
        </button>
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-8" style={{ background:"linear-gradient(to top,rgba(21,21,30,0.95) 0%,transparent 100%)" }}>
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>PHOTO SPOT · MIAMI, FL</span>
          <h1 className="text-[20px] font-black text-white tracking-tight">{location.name}</h1>
          <p className="text-[12px] mt-0.5" style={{ color:"#8888a0" }}>{location.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {[{val:location.photos.length,label:"PHOTOS"},{val:totalLikes.toLocaleString(),label:"TOTAL LIKES"},{val:contributors,label:"CONTRIBUTORS"}].map((s,i) => (
          <div key={s.label} className="flex flex-col items-center py-3" style={{ borderLeft: i>0?"1px solid #2c2c3a":"none" }}>
            <span className="text-[17px] font-black text-white tabular-nums">{s.val}</span>
            <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Upload */}
      <div className="px-4 py-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => fileRef.current?.click()} className="w-full py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2" style={{ background:"transparent", border:"1px solid #e10600", color:"#e10600" }}>
          <Upload size={13} /> Upload Your Photo Here
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-[1px]" style={{ background:"#2c2c3a", marginTop:"1px" }}>
        {location.photos.map(photo => (
          <div key={photo.id} className="relative aspect-square overflow-hidden group" style={{ background:"#1e1e2a" }}>
            <Image src={photo.url} alt={photo.car} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3" style={{ background:"linear-gradient(to top,rgba(15,15,22,0.95) 0%,transparent 60%)" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#fff" }}>{photo.car}</p>
              <p style={{ fontSize:"10px", color:"#8888a0" }}>{photo.user}</p>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-sm" style={{ background:"rgba(21,21,30,0.8)" }}>
              <Heart size={9} style={{ color:"#e10600" }} />
              <span style={{ fontSize:"9px", fontWeight:700, color:"#fff" }}>{photo.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {location.photos.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <Camera size={28} style={{ color:"#2c2c3a" }} />
          <p style={{ fontSize:"12px", color:"#4a4a5c" }}>No photos yet — be the first</p>
        </div>
      )}
    </div>
  );
}
