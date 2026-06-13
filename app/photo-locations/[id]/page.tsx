"use client";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Camera, Heart, Upload, Pencil, X, User } from "lucide-react";
import Image from "next/image";

export default function PhotoLocationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { photoLocations, addPhotoToLocation, profile } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPhotoData, setSelectedPhotoData] = useState<{ user: string; car: string; likes: number } | null>(null);

  const location = photoLocations.find(p => p.id === id);
  if (!location) return null;

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    addPhotoToLocation(id, { id: Date.now().toString(), url, user: profile.handle, car: "2019 Mustang Bullitt", likes: 0, ago: "Just now" });
  }

  const totalLikes = location.photos.reduce((s,p) => s+p.likes, 0);
  const contributors = new Set(location.photos.map(p=>p.user)).size;

  function openPhoto(url: string, user: string, car: string, likes: number) {
    setSelectedPhoto(url);
    setSelectedPhotoData({ user, car, likes });
  }

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      {/* Cover header */}
      <div className="relative h-44 overflow-hidden">
        <Image src={location.cover} alt={location.name} fill className="object-cover" style={{ filter:"brightness(0.5)" }} />
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center z-10" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <button onClick={() => router.push(`/photo-locations/${id}/edit`)} className="absolute top-4 right-4 w-8 h-8 rounded-sm flex items-center justify-center z-10" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <Pencil size={13} color="#fff" />
        </button>
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-8" style={{ background:"linear-gradient(to top,rgba(21,21,30,0.95) 0%,transparent 100%)" }}>
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

      {/* Carousel */}
      {location.photos.length > 0 && (
        <div className="relative" style={{ borderBottom:"1px solid #2c2c3a" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", padding:"12px 16px 8px" }}>RECENT PHOTOS</p>
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scroll" style={{ scrollSnapType:"x mandatory" }}>
            {location.photos.slice(0,8).map(photo => (
              <button key={photo.id} onClick={() => openPhoto(photo.url, photo.user, photo.car, photo.likes)}
                className="relative flex-shrink-0 rounded-sm overflow-hidden"
                style={{ width:"140px", height:"140px", background:"#1e1e2a", scrollSnapAlign:"start" }}>
                <Image src={photo.url} alt={photo.car} fill className="object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-2" style={{ background:"linear-gradient(to top,rgba(15,15,22,0.9) 0%,transparent 100%)" }}>
                  <p style={{ fontSize:"10px", fontWeight:900, color:"#fff", lineHeight:1.2 }}>{photo.car}</p>
                  <p style={{ fontSize:"9px", color:"#8888a0" }}>{photo.user}</p>
                </div>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-sm" style={{ background:"rgba(21,21,30,0.8)" }}>
                  <Heart size={8} style={{ color:"#e10600" }} />
                  <span style={{ fontSize:"8px", fontWeight:700, color:"#fff" }}>{photo.likes}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="px-4 py-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => fileRef.current?.click()} className="w-full py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2" style={{ background:"transparent", border:"1px solid #e10600", color:"#e10600" }}>
          <Upload size={13} /> Upload Your Photo Here
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {/* 3-col Instagram grid */}
      <div className="grid grid-cols-3 gap-[1px]" style={{ background:"#2c2c3a", marginTop:"1px" }}>
        {location.photos.map(photo => (
          <button key={photo.id} onClick={() => openPhoto(photo.url, photo.user, photo.car, photo.likes)}
            className="relative overflow-hidden" style={{ aspectRatio:"1/1", background:"#1e1e2a", display:"block" }}>
            <Image src={photo.url} alt={photo.car} fill className="object-cover" />
          </button>
        ))}
      </div>

      {location.photos.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <Camera size={28} style={{ color:"#2c2c3a" }} />
          <p style={{ fontSize:"12px", color:"#4a4a5c" }}>No photos yet — be the first</p>
        </div>
      )}

      {/* Fullscreen photo modal */}
      {selectedPhoto && selectedPhotoData && (
        <div className="fixed inset-0 z-[2000] flex flex-col" style={{ background:"rgba(0,0,0,0.97)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:"1px solid #1e1e2a" }}>
            <button onClick={() => router.push(selectedPhotoData.user === profile.handle ? "/profile" : `/profile`)}
              className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background:"#e10600", color:"#fff" }}>
                <User size={12} />
              </div>
              <div>
                <p style={{ fontSize:"13px", fontWeight:900, color:"#fff" }}>{selectedPhotoData.user}</p>
                <p style={{ fontSize:"10px", color:"#8888a0" }}>{selectedPhotoData.car}</p>
              </div>
            </button>
            <button onClick={() => { setSelectedPhoto(null); setSelectedPhotoData(null); }} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
              <X size={15} color="#fff" />
            </button>
          </div>
          <div className="flex-1 relative">
            <Image src={selectedPhoto} alt="Photo" fill className="object-contain" />
          </div>
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop:"1px solid #1e1e2a" }}>
            <Heart size={18} style={{ color:"#e10600" }} />
            <span style={{ fontSize:"14px", fontWeight:900, color:"#fff" }}>{selectedPhotoData.likes}</span>
            <span style={{ fontSize:"12px", color:"#8888a0" }}>likes</span>
          </div>
        </div>
      )}
    </div>
  );
}
