"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPins } from "@/lib/mockData";
import { Camera, Users, Wrench, Route, Coffee, Star, X } from "lucide-react";

type FilterType = "photo" | "meetup" | "shop" | "scenic" | "partner";

const filters: { key: FilterType; label: string; color: string; icon: React.ReactNode }[] = [
  { key: "photo", label: "Photo Spots", color: "#f59e0b", icon: <Camera size={12} /> },
  { key: "meetup", label: "Meetups", color: "#3b82f6", icon: <Users size={12} /> },
  { key: "shop", label: "Shops", color: "#10b981", icon: <Wrench size={12} /> },
  { key: "scenic", label: "Scenic Roads", color: "#8b5cf6", icon: <Route size={12} /> },
  { key: "partner", label: "Partners", color: "#e63946", icon: <Coffee size={12} /> },
];

function makeIcon(emoji: string, color: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid rgba(255,255,255,0.25);box-shadow:0 2px 8px rgba(0,0,0,0.5)">${emoji}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const shopTypeIcon: Record<string, string> = {
  mod: "🔧", tires: "🛞", detail: "✨", mechanic: "🔩", gas: "⛽",
};

interface PinDetail {
  name: string;
  description?: string;
  extra?: string;
  type: FilterType;
}

export default function MapClient() {
  const [active, setActive] = useState<Set<FilterType>>(new Set(["photo", "meetup", "shop", "partner"]));
  const [selected, setSelected] = useState<PinDetail | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggle = (key: FilterType) => {
    setActive(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (!mounted) return <div className="w-full h-full bg-[#111] flex items-center justify-center text-[#555] text-sm">Loading map…</div>;

  return (
    <div className="relative w-full h-full">
      {/* Filter bar */}
      <div className="absolute top-3 left-0 right-0 z-[1000] flex gap-2 px-3 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
            style={{
              background: active.has(f.key) ? f.color : "rgba(10,10,10,0.85)",
              borderColor: active.has(f.key) ? f.color : "#2a2a2a",
              color: active.has(f.key) ? "#fff" : "#888",
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      <MapContainer
        center={[25.7617, -80.1918]}
        zoom={12}
        style={{ width: "100%", height: "100%", background: "#111" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {active.has("photo") && mapPins.photoLocations.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon("📸", "#f59e0b")}
            eventHandlers={{ click: () => setSelected({ name: p.name, description: p.description, extra: `${p.photos} photos uploaded`, type: "photo" }) }}
          />
        ))}

        {active.has("meetup") && mapPins.meetupSpots.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon("🚗", "#3b82f6")}
            eventHandlers={{ click: () => setSelected({ name: p.name, description: p.description, extra: `~${p.regulars} regulars`, type: "meetup" }) }}
          />
        ))}

        {active.has("shop") && mapPins.shops.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(shopTypeIcon[p.type] || "🔧", p.partner ? "#10b981" : "#4b5563")}
            eventHandlers={{ click: () => setSelected({ name: p.name, description: p.description, extra: `⭐ ${p.rating}${p.partner ? " · Verified Partner" : ""}`, type: "shop" }) }}
          />
        ))}

        {active.has("scenic") && mapPins.scenicRoads.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon("🛣️", "#8b5cf6")}
            eventHandlers={{ click: () => setSelected({ name: p.name, description: p.description, type: "scenic" }) }}
          />
        ))}

        {active.has("partner") && mapPins.partners.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon("🤝", "#e63946")}
            eventHandlers={{ click: () => setSelected({ name: p.name, description: p.description, extra: p.deal, type: "partner" }) }}
          />
        ))}
      </MapContainer>

      {/* Pin detail card */}
      {selected && (
        <div className="absolute bottom-6 left-3 right-3 z-[1000] bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-white text-base">{selected.name}</p>
              {selected.description && <p className="text-[#888] text-sm mt-0.5">{selected.description}</p>}
              {selected.extra && <p className="text-[#e63946] text-xs mt-1.5 font-semibold">{selected.extra}</p>}
            </div>
            <button onClick={() => setSelected(null)} className="text-[#555] hover:text-white transition-colors shrink-0 mt-0.5">
              <X size={18} />
            </button>
          </div>
          {selected.type === "meetup" && (
            <button className="mt-3 w-full py-2 rounded-xl bg-[#3b82f6] text-white text-sm font-semibold">I&apos;m Heading Here</button>
          )}
          {selected.type === "shop" && (
            <button className="mt-3 w-full py-2 rounded-xl bg-[#10b981] text-white text-sm font-semibold">View Shop Profile</button>
          )}
          {selected.type === "photo" && (
            <button className="mt-3 w-full py-2 rounded-xl bg-[#f59e0b] text-black text-sm font-semibold">See All Photos</button>
          )}
          {selected.type === "partner" && (
            <button className="mt-3 w-full py-2 rounded-xl bg-[#e63946] text-white text-sm font-semibold">Claim Deal</button>
          )}
        </div>
      )}
    </div>
  );
}
