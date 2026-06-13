"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, MapPin, Phone, Clock, Star, ChevronRight, Tag } from "lucide-react";
import Image from "next/image";

const TYPE_LABEL: Record<string, string> = {
  tire: "TIRE SHOP",
  tuning: "TUNING SHOP",
  supercar_dealer: "SUPERCAR DEALER",
  oil_change: "OIL CHANGE",
  gas: "GAS STATION",
};

const TYPE_COLOR: Record<string, string> = {
  tire: "#f59e0b",
  tuning: "#8b5cf6",
  supercar_dealer: "#e10600",
  oil_change: "#10b981",
  gas: "#22d3ee",
};

export default function BusinessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const businesses = useStore(s => s.businesses);
  const biz = businesses.find(b => b.id === id);

  if (!biz) return (
    <div style={{ paddingTop:"56px", minHeight:"100dvh", background:"#15151e", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"#4a4a5c", fontSize:"13px" }}>Business not found</p>
    </div>
  );

  const color = TYPE_COLOR[biz.type] ?? "#e10600";
  const label = TYPE_LABEL[biz.type] ?? "BUSINESS";

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Cover */}
      <div style={{ position:"relative", height:"210px", overflow:"hidden", background:"#1e1e2a" }}>
        <Image src={biz.cover} alt={biz.name} fill style={{ objectFit:"cover", opacity:0.7 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(21,21,30,0.95) 0%, transparent 55%)" }} />
        <button onClick={() => router.back()} style={{ position:"absolute", top:"16px", left:"16px", width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 16px 16px" }}>
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:color }}>{label}</span>
          <h1 style={{ fontSize:"22px", fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1, marginTop:"3px" }}>{biz.name}</h1>
        </div>
      </div>

      {/* Key info row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 8px", gap:"4px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
            <Star size={13} style={{ color:"#f59e0b" }} fill="#f59e0b" />
            <span style={{ fontSize:"17px", fontWeight:900, color:"#fff" }}>{biz.rating}</span>
          </div>
          <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{biz.reviews} REVIEWS</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 8px", gap:"4px", borderLeft:"1px solid #2c2c3a", borderRight:"1px solid #2c2c3a" }}>
          <Clock size={16} style={{ color:"#00d2be" }} />
          <span style={{ fontSize:"10px", fontWeight:700, color:"#00d2be", textTransform:"uppercase", letterSpacing:"0.05em", textAlign:"center", lineHeight:1.2 }}>{biz.hours.includes("24") ? "24 HRS" : "OPEN"}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 8px", gap:"4px" }}>
          <Phone size={16} style={{ color:"#4a4a5c" }} />
          <span style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c", textTransform:"uppercase", letterSpacing:"0.05em" }}>CALL</span>
        </div>
      </div>

      {/* Drive 59 deal badge */}
      {biz.deal && (
        <div style={{ margin:"16px", padding:"12px 14px", borderRadius:"4px", background:"rgba(225,6,0,0.1)", border:"1px solid rgba(225,6,0,0.3)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"28px", height:"28px", borderRadius:"3px", background:"#e10600", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Tag size={13} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#e10600", marginBottom:"2px" }}>DRIVE 59 DEAL</p>
            <p style={{ fontSize:"13px", fontWeight:700, color:"#fff" }}>{biz.deal}</p>
          </div>
        </div>
      )}

      {/* Address & hours */}
      <div style={{ padding:"0 16px 16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
            <MapPin size={14} style={{ color:"#4a4a5c", flexShrink:0, marginTop:"1px" }} />
            <div>
              <p style={{ fontSize:"13px", color:"#fff", fontWeight:600 }}>{biz.address}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <Clock size={14} style={{ color:"#4a4a5c", flexShrink:0 }} />
            <p style={{ fontSize:"13px", color:"#8888a0" }}>{biz.hours}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <Phone size={14} style={{ color:"#4a4a5c", flexShrink:0 }} />
            <p style={{ fontSize:"13px", color:"#8888a0" }}>{biz.phone}</p>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      {biz.photos.length > 0 && (
        <div style={{ borderBottom:"1px solid #2c2c3a", paddingBottom:"16px" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", padding:"16px 16px 10px" }}>PHOTOS</p>
          <div style={{ display:"flex", gap:"8px", padding:"0 16px", overflowX:"auto" }}>
            {biz.photos.map((photo, i) => (
              <div key={i} style={{ position:"relative", width:"140px", height:"100px", flexShrink:0, borderRadius:"4px", overflow:"hidden", background:"#1e1e2a" }}>
                <Image src={photo} alt={`${biz.name} photo ${i+1}`} fill style={{ objectFit:"cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"8px" }}>ABOUT</p>
        <p style={{ fontSize:"13px", color:"#8888a0", lineHeight:1.7 }}>{biz.description}</p>
      </div>

      {/* Tags */}
      <div style={{ padding:"14px 16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {biz.tags.map(t => (
            <span key={t} style={{ fontSize:"10px", color:"#383848", border:"1px solid #1e1e2a", borderRadius:"3px", padding:"3px 9px" }}>#{t}</span>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <button style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <MapPin size={15} /> Get Directions <ChevronRight size={14} />
        </button>
        <button style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"transparent", color:"#8888a0", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"1px solid #2c2c3a", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <Phone size={15} /> {biz.phone}
        </button>
      </div>
    </div>
  );
}
