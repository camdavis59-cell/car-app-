"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPins } from "@/lib/mockData";
import { Camera, Users, Wrench, Route, Coffee, X, Star, Navigation, ChevronRight } from "lucide-react";

type FilterKey = "photo" | "meetup" | "shop" | "scenic" | "partner";

const FILTERS: { key: FilterKey; label: string; emoji: string; color: string }[] = [
  { key: "photo",   label: "Photo Spots",   emoji: "📸", color: "#f59e0b" },
  { key: "meetup",  label: "Meetups",        emoji: "🚗", color: "#3b82f6" },
  { key: "shop",    label: "Shops",          emoji: "🔧", color: "#22c55e" },
  { key: "scenic",  label: "Scenic Roads",   emoji: "🛣️", color: "#a855f7" },
  { key: "partner", label: "Partners",       emoji: "🤝", color: "#e63946" },
];

const SHOP_EMOJI: Record<string, string> = {
  mod: "🔧", tires: "🛞", detail: "✨", mechanic: "🔩", gas: "⛽",
};

function pin(emoji: string, color: string, size = 34) {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      display:flex;align-items:center;justify-content:center;
      font-size:${size * 0.42}px;
      border:2px solid rgba(255,255,255,0.15);
      box-shadow:0 3px 12px rgba(0,0,0,0.6),0 0 0 4px ${color}33
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface Detail {
  name: string;
  desc?: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  cta?: string;
  ctaColor?: string;
  type: FilterKey;
}

export default function MapClient() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set(["photo", "meetup", "shop", "partner"]));
  const [detail, setDetail] = useState<Detail | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggle = (k: FilterKey) =>
    setActive(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  if (!mounted) return (
    <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#555] text-sm">Loading Miami map…</span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* Filter pills */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex gap-2 px-3 pt-3 pb-2 overflow-x-auto scrollbar-hide" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)" }}>
        {FILTERS.map(f => {
          const on = active.has(f.key);
          return (
            <button key={f.key} onClick={() => toggle(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all"
              style={{
                background: on ? f.color : "rgba(17,17,17,0.9)",
                borderColor: on ? f.color : "#282828",
                color: on ? "#fff" : "#666",
                boxShadow: on ? `0 0 10px ${f.color}44` : "none",
              }}
            >
              <span className="text-[12px]">{f.emoji}</span> {f.label}
            </button>
          );
        })}
      </div>

      {/* Location button */}
      <button className="absolute top-14 right-3 z-[1000] w-9 h-9 rounded-full bg-[#111]/90 border border-[#282828] flex items-center justify-center">
        <Navigation size={15} className="text-[#888]" />
      </button>

      <MapContainer
        center={[25.7617, -80.1918]}
        zoom={12}
        style={{ width: "100%", height: "100%", background: "#0d0d0d" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {active.has("photo") && mapPins.photoLocations.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin("📸", "#f59e0b")}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, sub: `${p.photos} photos uploaded`, badge: "Photo Spot", badgeColor: "#f59e0b", cta: "See All Photos", ctaColor: "#f59e0b", type: "photo" }) }} />
        )}
        {active.has("meetup") && mapPins.meetupSpots.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin("🚗", "#3b82f6")}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, sub: `~${p.regulars} regulars`, badge: "Meetup Spot", badgeColor: "#3b82f6", cta: "I'm Heading Here", ctaColor: "#3b82f6", type: "meetup" }) }} />
        )}
        {active.has("shop") && mapPins.shops.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin(SHOP_EMOJI[p.type] || "🔧", p.partner ? "#22c55e" : "#4b5563")}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, sub: `★ ${p.rating}${p.partner ? "  ·  Verified Partner" : ""}`, badge: p.type.charAt(0).toUpperCase() + p.type.slice(1), badgeColor: p.partner ? "#22c55e" : "#555", cta: "View Profile", ctaColor: "#22c55e", type: "shop" }) }} />
        )}
        {active.has("scenic") && mapPins.scenicRoads.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin("🛣️", "#a855f7")}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, badge: "Scenic Road", badgeColor: "#a855f7", cta: "Open Route", ctaColor: "#a855f7", type: "scenic" }) }} />
        )}
        {active.has("partner") && mapPins.partners.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin("🤝", "#e63946")}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, sub: p.deal, badge: "Drive 59 Partner", badgeColor: "#e63946", cta: "Claim Deal", ctaColor: "#e63946", type: "partner" }) }} />
        )}
      </MapContainer>

      {/* City label */}
      <div className="absolute top-14 left-3 z-[999] pointer-events-none">
        <span className="text-[10px] font-bold text-[#333] uppercase tracking-widest">Miami, FL</span>
      </div>

      {/* Detail panel */}
      {detail && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[1000] bg-[#111] border-t border-[#222] rounded-t-3xl p-5 shadow-2xl"
          style={{ boxShadow: `0 -8px 40px rgba(0,0,0,0.8), 0 0 0 1px #1e1e1e` }}
        >
          {/* Handle bar */}
          <div className="w-10 h-1 bg-[#2a2a2a] rounded-full mx-auto mb-4" />

          <div className="flex items-start gap-3">
            <div className="flex-1">
              {detail.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: `${detail.badgeColor}22`, color: detail.badgeColor }}>
                  {detail.badge}
                </span>
              )}
              <h3 className="font-black text-white text-[17px] leading-tight mb-1">{detail.name}</h3>
              {detail.desc && <p className="text-[#666] text-[13px] leading-relaxed">{detail.desc}</p>}
              {detail.sub && <p className="text-[13px] font-semibold mt-1.5" style={{ color: detail.badgeColor }}>{detail.sub}</p>}
            </div>
            <button onClick={() => setDetail(null)} className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center shrink-0">
              <X size={14} className="text-[#666]" />
            </button>
          </div>

          {detail.cta && (
            <button
              className="mt-4 w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5"
              style={{ background: detail.ctaColor, color: detail.type === "photo" ? "#000" : "#fff" }}
            >
              {detail.cta} <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
