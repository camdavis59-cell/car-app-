"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPins } from "@/lib/mockData";
import { X, ChevronRight, Navigation } from "lucide-react";

type FilterKey = "photo" | "meetup" | "shop" | "scenic" | "partner";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "photo",   label: "Photo Spots"  },
  { key: "meetup",  label: "Meetups"      },
  { key: "shop",    label: "Shops"        },
  { key: "scenic",  label: "Scenic Roads" },
  { key: "partner", label: "Partners"     },
];

const SHOP_LABEL: Record<string, string> = {
  mod: "MOD SHOP", tires: "TIRES", detail: "DETAIL", mechanic: "MECHANIC", gas: "FUEL",
};

function dot(color: string, ring = false) {
  return L.divIcon({
    html: `<div style="
      width:12px;height:12px;border-radius:50%;
      background:${color};
      ${ring ? `box-shadow:0 0 0 3px rgba(255,255,255,0.08),0 0 0 5px ${color}30` : "box-shadow:0 2px 6px rgba(0,0,0,0.5)"};
      border:1.5px solid rgba(255,255,255,0.2)
    "></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

interface Detail {
  name: string;
  desc?: string;
  meta?: string;
  type: FilterKey;
  badge?: string;
  cta: string;
}

export default function MapClient() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set(["photo", "meetup", "shop", "partner"]));
  const [detail, setDetail] = useState<Detail | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggle = (k: FilterKey) =>
    setActive(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0e0e16" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#e10600", borderTopColor: "transparent" }} />
        <span className="label">Loading Miami</span>
      </div>
    </div>
  );

  const PIN_RED    = dot("#e10600", true);
  const PIN_WHITE  = dot("#ffffff");
  const PIN_GREY   = dot("#8888a0");
  const PIN_DIM    = dot("#4a4a5c");

  return (
    <div className="relative w-full h-full">
      {/* Filters */}
      <div className="absolute top-0 inset-x-0 z-[1000] flex gap-2 px-3 pt-3 pb-2 no-scroll overflow-x-auto"
        style={{ background: "linear-gradient(to bottom, rgba(14,14,22,0.95) 60%, transparent)" }}>
        {FILTERS.map(f => {
          const on = active.has(f.key);
          return (
            <button key={f.key} onClick={() => toggle(f.key)}
              className="whitespace-nowrap px-3 py-1.5 rounded-sm text-[10px] font-bold tracking-[0.1em] uppercase border transition-all"
              style={{
                background: on ? "#e10600" : "rgba(30,30,42,0.9)",
                borderColor: on ? "#e10600" : "#2c2c3a",
                color: on ? "#fff" : "#4a4a5c",
              }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* City + compass */}
      <div className="absolute top-14 left-3 z-[999] pointer-events-none">
        <span className="label" style={{ color: "#2c2c3a" }}>Miami, FL</span>
      </div>
      <button className="absolute top-14 right-3 z-[1000] w-8 h-8 rounded-sm flex items-center justify-center"
        style={{ background: "rgba(30,30,42,0.9)", border: "1px solid #2c2c3a" }}>
        <Navigation size={13} style={{ color: "#4a4a5c" }} />
      </button>

      <MapContainer center={[25.7617, -80.1918]} zoom={12}
        style={{ width: "100%", height: "100%", background: "#0e0e16" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {active.has("photo") && mapPins.photoLocations.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={PIN_WHITE}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, meta: `${p.photos} photos`, badge: "PHOTO SPOT", type: "photo", cta: "View Photos" }) }} />
        )}
        {active.has("meetup") && mapPins.meetupSpots.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={PIN_RED}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, meta: `~${p.regulars} regulars`, badge: "MEETUP", type: "meetup", cta: "I'm Heading Here" }) }} />
        )}
        {active.has("shop") && mapPins.shops.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={p.partner ? PIN_WHITE : PIN_GREY}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, meta: `${p.rating} / 5.0${p.partner ? "  ·  Partner" : ""}`, badge: SHOP_LABEL[p.type] || "SHOP", type: "shop", cta: "View Profile" }) }} />
        )}
        {active.has("scenic") && mapPins.scenicRoads.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={PIN_GREY}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, badge: "SCENIC ROAD", type: "scenic", cta: "Open Route" }) }} />
        )}
        {active.has("partner") && mapPins.partners.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={PIN_RED}
            eventHandlers={{ click: () => setDetail({ name: p.name, desc: p.description, meta: p.deal, badge: "PARTNER", type: "partner", cta: "View Deal" }) }} />
        )}
      </MapContainer>

      {/* Detail panel */}
      {detail && (
        <div className="absolute bottom-0 inset-x-0 z-[1000]"
          style={{ background: "#1e1e2a", borderTop: "1px solid #2c2c3a" }}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-[3px] rounded-full" style={{ background: "#2c2c3a" }} />
          </div>

          <div className="px-5 pb-5 pt-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <span className="label mb-1.5 block">{detail.badge}</span>
                <h3 className="text-[17px] font-black text-white leading-tight tracking-tight">{detail.name}</h3>
                {detail.desc && <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "#8888a0" }}>{detail.desc}</p>}
                {detail.meta && (
                  <p className="text-[12px] font-bold mt-2 tracking-wide" style={{ color: "#e10600" }}>{detail.meta}</p>
                )}
              </div>
              <button onClick={() => setDetail(null)}
                className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "#252532", border: "1px solid #2c2c3a" }}>
                <X size={13} style={{ color: "#4a4a5c" }} />
              </button>
            </div>

            <button className="mt-4 w-full py-3 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-white"
              style={{ background: "#e10600" }}>
              {detail.cta} <ChevronRight size={13} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
