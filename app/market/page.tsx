"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Search, Plus, Tag, MapPin } from "lucide-react";
import Image from "next/image";

const CATS = ["ALL","EXHAUST","WHEELS","SUSPENSION","BRAKES","COOLING","INTERIOR","TIRES","ENGINE"];

export default function MarketPage() {
  const { market } = useStore();
  const router = useRouter();
  const [cat, setCat] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = market.filter(l =>
    (cat === "ALL" || l.category.toUpperCase() === cat) &&
    (!query || l.title.toLowerCase().includes(query.toLowerCase()) || l.compatibleWith.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Marketplace</h1>
          </div>
          <button onClick={() => router.push("/market/new")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white" style={{ background:"#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Sell
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <Search size={14} style={{ color:"#4a4a5c" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search parts, wheels, exhausts…"
            style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#fff", width:"100%", fontFamily:"inherit" }} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-0 no-scroll overflow-x-auto" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {CATS.map(c => {
          const on = cat === c;
          return (
            <button key={c} onClick={() => setCat(c)}
              className="px-3.5 py-3 whitespace-nowrap relative"
              style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color: on?"#fff":"#4a4a5c" }}>
              {c}
              {on && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:"#e10600" }} />}
            </button>
          );
        })}
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-2 gap-[1px]" style={{ background:"#2c2c3a", marginTop:"1px" }}>
        {filtered.map(item => (
          <div key={item.id} className="flex flex-col" style={{ background:"#15151e" }}>
            <div className="relative aspect-square overflow-hidden" style={{ background:"#1e1e2a" }}>
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-sm" style={{ background:"rgba(21,21,30,0.9)" }}>
                <span style={{ fontSize:"9px", fontWeight:700, color:"#8888a0", textTransform:"uppercase", letterSpacing:"0.08em" }}>{item.condition}</span>
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"3px" }}>{item.category}</p>
              <p className="text-white font-black leading-tight mb-1" style={{ fontSize:"13px" }}>{item.title}</p>
              <p style={{ fontSize:"10px", color:"#4a4a5c", marginBottom:"8px" }}>{item.compatibleWith}</p>
              <div className="mt-auto">
                <p className="text-[16px] font-black" style={{ color:"#e10600" }}>${item.price.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={9} style={{ color:"#4a4a5c" }} />
                  <span style={{ fontSize:"10px", color:"#4a4a5c" }}>{item.location}</span>
                </div>
              </div>
              <button onClick={() => router.push(`/market/${item.id}`)} className="mt-2 w-full py-2 rounded-sm text-[10px] font-black tracking-wide uppercase text-white" style={{ background:"#e10600" }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <Tag size={28} style={{ color:"#2c2c3a" }} />
          <p style={{ fontSize:"12px", color:"#4a4a5c" }}>No listings found</p>
        </div>
      )}
    </div>
  );
}
