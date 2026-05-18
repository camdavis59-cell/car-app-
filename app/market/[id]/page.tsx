"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ArrowLeft, MapPin, Tag, MessageSquare, Share, Trash2 } from "lucide-react";
import Image from "next/image";

const S = {
  label: { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c" },
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const listing = useStore(s => s.market.find(l => l.id === id));
  const deleteListing = useStore(s => s.deleteListing);

  if (!listing) return (
    <div style={{ paddingTop:"56px", minHeight:"100dvh", background:"#15151e", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ color:"#4a4a5c", fontSize:"13px" }}>Listing not found</p>
        <button onClick={() => router.back()} style={{ marginTop:"12px", color:"#e10600", fontSize:"12px", fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>← Go back</button>
      </div>
    </div>
  );

  const CONDITION_COLOR: Record<string, string> = {
    "New": "#00d2be", "Like New": "#00d2be", "Good": "#8888a0", "Fair": "#f59e0b", "For Parts": "#e10600",
  };

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ ...S.label, marginBottom:"2px" }}>{listing.category}</p>
          <h1 style={{ fontSize:"15px", fontWeight:900, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{listing.title}</h1>
        </div>
        <button style={{ width:"32px", height:"32px", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          <Share size={14} color="#8888a0" />
        </button>
      </div>

      {/* Image */}
      <div style={{ position:"relative", width:"100%", aspectRatio:"1/1", background:"#1e1e2a", overflow:"hidden" }}>
        <Image src={listing.image} alt={listing.title} fill style={{ objectFit:"cover" }} />
        <div style={{ position:"absolute", top:"12px", left:"12px", padding:"4px 8px", borderRadius:"3px", background:"rgba(21,21,30,0.9)", border:"1px solid #2c2c3a" }}>
          <span style={{ ...S.label, color: CONDITION_COLOR[listing.condition] ?? "#8888a0", fontSize:"10px" }}>{listing.condition}</span>
        </div>
      </div>

      {/* Price + info */}
      <div style={{ padding:"20px 16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"8px" }}>
          <p style={{ fontSize:"28px", fontWeight:900, color:"#e10600", lineHeight:1 }}>${listing.price.toLocaleString()}</p>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <Tag size={11} color="#4a4a5c" />
            <span style={{ ...S.label }}>{listing.category}</span>
          </div>
        </div>
        <h2 style={{ fontSize:"18px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>{listing.title}</h2>
        {listing.compatibleWith && (
          <p style={{ fontSize:"12px", color:"#4a4a5c", marginBottom:"6px" }}>Fits: {listing.compatibleWith}</p>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px" }}>
          <MapPin size={11} color="#4a4a5c" />
          <span style={{ fontSize:"12px", color:"#4a4a5c" }}>{listing.location}</span>
        </div>
        <p style={{ fontSize:"10px", color:"#2c2c3a", marginTop:"4px" }}>Posted {listing.posted}</p>
      </div>

      {/* Description */}
      {listing.description && (
        <div style={{ padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
          <p style={{ ...S.label, marginBottom:"8px" }}>Description</p>
          <p style={{ fontSize:"13px", color:"#8888a0", lineHeight:1.6 }}>{listing.description}</p>
        </div>
      )}

      {/* Seller */}
      <div style={{ padding:"16px", borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ ...S.label, marginBottom:"12px" }}>Seller</p>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"40px", height:"40px", borderRadius:"4px", background:"#e10600", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:900, color:"#fff" }}>
            {listing.seller.slice(0,2).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize:"14px", fontWeight:900, color:"#fff" }}>{listing.seller}</p>
            <p style={{ fontSize:"11px", color:"#4a4a5c" }}>@{listing.seller}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <button onClick={() => router.push("/messages")} style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <MessageSquare size={15} /> Message Seller
        </button>
        <button style={{ width:"100%", padding:"14px", borderRadius:"4px", background:"transparent", color:"#8888a0", fontSize:"12px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", border:"1px solid #2c2c3a", cursor:"pointer" }}>
          Make Offer
        </button>
        {listing.seller === "@carlosriv59" && (
          <button onClick={() => { deleteListing(id); router.push("/market"); }}
            style={{ width:"100%", padding:"12px", borderRadius:"4px", background:"transparent", border:"1px solid #e10600", color:"#e10600", fontSize:"11px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            <Trash2 size={13} /> Remove Listing
          </button>
        )}
      </div>
    </div>
  );
}
