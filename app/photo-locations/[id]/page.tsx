"use client";
import { useParams, useRouter } from "next/navigation";
import { mapPins, locationPhotos } from "@/lib/mockData";
import { ArrowLeft, Camera, Heart, Upload } from "lucide-react";
import Image from "next/image";

export default function PhotoLocationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const location = mapPins.photoLocations.find(p => p.id === id);
  const photos = locationPhotos[id] ?? [];

  if (!location) return (
    <div className="pt-14 pb-[58px] min-h-screen flex items-center justify-center" style={{ background: "#15151e" }}>
      <p className="label">Location not found</p>
    </div>
  );

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>

      {/* Cover photo + header */}
      <div className="relative h-52 overflow-hidden">
        <Image src={location.cover} alt={location.name} fill className="object-cover"
          style={{ filter: "brightness(0.55)" }} />
        {/* Back button */}
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center z-10"
          style={{ background: "rgba(21,21,30,0.85)", border: "1px solid #2c2c3a" }}>
          <ArrowLeft size={15} style={{ color: "#ffffff" }} />
        </button>
        {/* Location info overlay */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-8"
          style={{ background: "linear-gradient(to top, rgba(21,21,30,0.95) 0%, transparent 100%)" }}>
          <span className="label block mb-1">PHOTO SPOT · MIAMI, FL</span>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-tight">{location.name}</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "#8888a0" }}>{location.description}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #2c2c3a" }}>
        {[
          { val: location.photos, label: "PHOTOS"     },
          { val: photos.reduce((s, p) => s + p.likes, 0).toLocaleString(), label: "TOTAL LIKES" },
          { val: new Set(photos.map(p => p.user)).size, label: "CONTRIBUTORS" },
        ].map((s, i) => (
          <div key={s.label} className="flex flex-col items-center py-3"
            style={{ borderLeft: i > 0 ? "1px solid #2c2c3a" : "none" }}>
            <span className="text-[17px] font-black text-white tabular-nums">{s.val}</span>
            <span className="label mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Upload CTA */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <button className="w-full py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2"
          style={{ background: "transparent", border: "1px solid #e10600", color: "#e10600" }}>
          <Upload size={13} /> Upload Your Photo Here
        </button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-[1px] mt-[1px]" style={{ background: "#2c2c3a" }}>
        {photos.map(photo => (
          <div key={photo.id} className="relative aspect-square overflow-hidden group"
            style={{ background: "#1e1e2a" }}>
            <Image src={photo.url} alt={photo.car} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            {/* Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3"
              style={{ background: "linear-gradient(to top, rgba(15,15,22,0.95) 0%, transparent 60%)" }}>
              <p className="text-[11px] font-black text-white leading-tight">{photo.car}</p>
              <p className="text-[10px]" style={{ color: "#8888a0" }}>{photo.user}</p>
            </div>
            {/* Like count */}
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
              style={{ background: "rgba(21,21,30,0.8)" }}>
              <Heart size={9} style={{ color: "#e10600" }} />
              <span className="text-[9px] font-bold text-white tabular-nums">{photo.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Camera size={32} style={{ color: "#2c2c3a" }} />
          <p className="label">No photos yet — be the first</p>
        </div>
      )}
    </div>
  );
}
