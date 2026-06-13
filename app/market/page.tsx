"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Search, Plus, SlidersHorizontal, X, MapPin } from "lucide-react";
import Image from "next/image";

const CATS = [
  { key: "ALL",        label: "All Categories" },
  { key: "EXHAUST",    label: "Exhaust"        },
  { key: "WHEELS",     label: "Wheels"         },
  { key: "SUSPENSION", label: "Suspension"     },
  { key: "BRAKES",     label: "Brakes"         },
  { key: "COOLING",    label: "Cooling"        },
  { key: "INTERIOR",   label: "Interior"       },
  { key: "TIRES",      label: "Tires"          },
  { key: "ENGINE",     label: "Engine"         },
];

const CONDITIONS = ["Any Condition","New","Used - Like New","Used - Excellent","Used - Good","Used - Fair"];

export default function MarketPage() {
  const { market } = useStore();
  const router = useRouter();
  const [cat, setCat] = useState("ALL");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [condition, setCondition] = useState("Any Condition");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = market.filter(l => {
    const catMatch = cat === "ALL" || l.category.toUpperCase() === cat;
    const queryMatch = !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.compatibleWith.toLowerCase().includes(query.toLowerCase()) || l.category.toLowerCase().includes(query.toLowerCase());
    const conditionMatch = condition === "Any Condition" || l.condition.includes(condition.replace("Used - ",""));
    const priceMatch = !maxPrice || l.price <= parseInt(maxPrice);
    return catMatch && queryMatch && conditionMatch && priceMatch;
  });

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>South Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Marketplace</h1>
          </div>
          <button onClick={() => router.push("/market/new")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white" style={{ background:"#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Sell
          </button>
        </div>
        {/* Search + Filter row */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
            <Search size={14} style={{ color:"#4a4a5c" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search parts, wheels, exhausts…"
              style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#fff", width:"100%", fontFamily:"inherit" }} />
            {query && <button onClick={() => setQuery("")}><X size={12} style={{ color:"#4a4a5c" }} /></button>}
          </div>
          <button onClick={() => setShowFilters(v=>!v)} className="px-3 py-2 rounded-sm flex items-center gap-1.5" style={{ background: showFilters?"#e10600":"#1e1e2a", border:`1px solid ${showFilters?"#e10600":"#2c2c3a"}` }}>
            <SlidersHorizontal size={14} style={{ color: showFilters?"#fff":"#4a4a5c" }} />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="px-4 py-4" style={{ background:"#1e1e2a", borderBottom:"1px solid #2c2c3a" }}>
          <div className="mb-4">
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"10px" }}>CATEGORY</p>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ background: cat===c.key?"#e10600":"#252532", color: cat===c.key?"#fff":"#8888a0", border:`1px solid ${cat===c.key?"#e10600":"#2c2c3a"}` }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"10px" }}>CONDITION</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button key={c} onClick={() => setCondition(c)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ background: condition===c?"#e10600":"#252532", color: condition===c?"#fff":"#8888a0", border:`1px solid ${condition===c?"#e10600":"#2c2c3a"}` }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"10px" }}>MAX PRICE</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-sm w-40" style={{ background:"#252532", border:"1px solid #2c2c3a" }}>
              <span style={{ color:"#4a4a5c", fontSize:"13px" }}>$</span>
              <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="No limit" type="number"
                style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#fff", width:"100%", fontFamily:"inherit" }} />
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {(cat !== "ALL" || condition !== "Any Condition" || maxPrice) && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scroll" style={{ borderBottom:"1px solid #2c2c3a" }}>
          {cat !== "ALL" && <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background:"rgba(225,6,0,0.15)", color:"#e10600", border:"1px solid #e10600" }}>{cat} <button onClick={()=>setCat("ALL")}><X size={10}/></button></span>}
          {condition !== "Any Condition" && <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background:"rgba(225,6,0,0.15)", color:"#e10600", border:"1px solid #e10600" }}>{condition} <button onClick={()=>setCondition("Any Condition")}><X size={10}/></button></span>}
          {maxPrice && <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background:"rgba(225,6,0,0.15)", color:"#e10600", border:"1px solid #e10600" }}>Under ${maxPrice} <button onClick={()=>setMaxPrice("")}><X size={10}/></button></span>}
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-2.5" style={{ borderBottom:"1px solid #1e1e2a" }}>
        <p style={{ fontSize:"11px", color:"#4a4a5c", fontWeight:600 }}>{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Listings grid — Facebook Marketplace style */}
      <div className="grid grid-cols-2 gap-[1px]" style={{ background:"#2c2c3a" }}>
        {filtered.map(item => (
          <button key={item.id} onClick={() => router.push(`/market/${item.id}`)}
            className="flex flex-col text-left" style={{ background:"#15151e" }}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio:"1/1", background:"#1e1e2a" }}>
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-sm" style={{ background:"rgba(21,21,30,0.9)" }}>
                <span style={{ fontSize:"9px", fontWeight:700, color:"#8888a0", textTransform:"uppercase", letterSpacing:"0.08em" }}>{item.condition}</span>
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p className="text-[16px] font-black leading-none mb-1" style={{ color:"#e10600" }}>${item.price.toLocaleString()}</p>
              <p className="text-white font-bold leading-snug mb-1" style={{ fontSize:"13px" }}>{item.title}</p>
              <p style={{ fontSize:"10px", color:"#4a4a5c" }}>{item.compatibleWith || item.category}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin size={9} style={{ color:"#4a4a5c" }} />
                <span style={{ fontSize:"10px", color:"#4a4a5c" }}>{item.location}</span>
              </div>
              <p style={{ fontSize:"9px", color:"#2c2c3a", marginTop:"3px" }}>{item.posted}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <Search size={28} style={{ color:"#2c2c3a" }} />
          <p style={{ fontSize:"12px", color:"#4a4a5c" }}>No listings found</p>
          <button onClick={() => { setCat("ALL"); setQuery(""); setCondition("Any Condition"); setMaxPrice(""); }} style={{ fontSize:"11px", color:"#e10600", fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
