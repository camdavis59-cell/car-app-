"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPins } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Plus } from "lucide-react";
import { X, ChevronRight, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Photo card pin — white box with image thumbnail + location name below
function photoPin(name: string, cover: string) {
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7))">
        <div style="width:54px;height:54px;border-radius:4px;overflow:hidden;border:2.5px solid #ffffff;background:#1e1e2a">
          <img src="${cover}" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
        </div>
        <div style="background:#ffffff;padding:2px 6px;border-radius:2px;font-size:9px;font-weight:800;color:#111;letter-spacing:0.03em;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;text-align:center">
          ${short}
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #ffffff;margin-top:-2px"></div>
      </div>`,
    className: "",
    iconSize: [90, 80],
    iconAnchor: [45, 80],
  });
}

// Meetup/event red box pin
function meetupPin(name: string) {
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7))">
        <div style="width:44px;height:44px;border-radius:4px;border:2.5px solid #e10600;background:#e10600;display:flex;align-items:center;justify-content:center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6l3 6-3 6M21 6l-3 6 3 6"/></svg>
        </div>
        <div style="background:#e10600;padding:2px 7px;border-radius:2px;font-size:9px;font-weight:800;color:#fff;letter-spacing:0.05em;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;text-align:center">
          ${short}
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #e10600;margin-top:-2px"></div>
      </div>`,
    className: "",
    iconSize: [90, 74],
    iconAnchor: [45, 74],
  });
}

// Small dot for shops / scenic / partners
function dot(color: string) {
  return L.divIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.25);box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

interface Detail {
  name: string;
  desc?: string;
  meta?: string;
  badge?: string;
  type: FilterKey;
  linkTo?: string;
}

export default function MapClient() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set(["photo", "meetup", "shop", "partner"]));
  const [detail, setDetail] = useState<Detail | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { photoLocations, events: storeEvents } = useStore();

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

      {/* Compass + add photo location */}
      <div className="absolute top-14 right-3 z-[1000] flex flex-col gap-2">
        <button className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "rgba(30,30,42,0.9)", border: "1px solid #2c2c3a" }}>
          <Navigation size={13} style={{ color: "#4a4a5c" }} />
        </button>
        <button onClick={() => router.push("/photo-locations/new")} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "#e10600" }}>
          <Plus size={14} style={{ color: "#fff" }} />
        </button>
      </div>

      <MapContainer center={[25.7617, -80.1918]} zoom={12}
        style={{ width: "100%", height: "100%", background: "#0e0e16" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {active.has("photo") && photoLocations.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={photoPin(p.name, p.cover)}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description, meta: `${p.photos.length} photos`,
              badge: "PHOTO SPOT", type: "photo", linkTo: `/photo-locations/${p.id}`,
            }) }} />
        )}

        {active.has("meetup") && mapPins.meetupSpots.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={meetupPin(p.name)}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description, meta: `~${p.regulars} regulars`,
              badge: "MEETUP", type: "meetup",
            }) }} />
        )}

        {active.has("meetup") && storeEvents.filter(e => e.lat).map(e =>
          <Marker key={`ev-${e.id}`} position={[e.lat, e.lng]} icon={meetupPin(e.title)}
            eventHandlers={{ click: () => setDetail({
              name: e.title, desc: e.description, meta: `${e.rsvp} going · ${e.date}`,
              badge: "EVENT", type: "meetup", linkTo: `/events/${e.id}`,
            }) }} />
        )}

        {active.has("shop") && mapPins.shops.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={dot(p.partner ? "#ffffff" : "#4a4a5c")}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description,
              meta: `${p.rating} / 5.0${p.partner ? "  ·  Partner" : ""}`,
              badge: SHOP_LABEL[p.type] || "SHOP", type: "shop",
            }) }} />
        )}

        {active.has("scenic") && mapPins.scenicRoads.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={dot("#4a4a5c")}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description,
              badge: "SCENIC ROAD", type: "scenic",
            }) }} />
        )}

        {active.has("partner") && mapPins.partners.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={dot("#e10600")}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description, meta: p.deal,
              badge: "PARTNER", type: "partner",
            }) }} />
        )}
      </MapContainer>

      {/* Detail panel */}
      {detail && (
        <div className="absolute bottom-0 inset-x-0 z-[1000]"
          style={{ background: "#1e1e2a", borderTop: "1px solid #2c2c3a" }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-[3px] rounded-full" style={{ background: "#2c2c3a" }} />
          </div>
          <div className="px-5 pb-5 pt-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {detail.badge && <span className="label mb-1.5 block">{detail.badge}</span>}
                <h3 className="text-[17px] font-black text-white leading-tight tracking-tight">{detail.name}</h3>
                {detail.desc && <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "#8888a0" }}>{detail.desc}</p>}
                {detail.meta && <p className="text-[12px] font-bold mt-2" style={{ color: "#e10600" }}>{detail.meta}</p>}
              </div>
              <button onClick={() => setDetail(null)}
                className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
                style={{ background: "#252532", border: "1px solid #2c2c3a" }}>
                <X size={13} style={{ color: "#4a4a5c" }} />
              </button>
            </div>
            {detail.linkTo ? (
              <button onClick={() => { setDetail(null); router.push(detail.linkTo!); }}
                className="mt-4 w-full py-3 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-white"
                style={{ background: "#e10600" }}>
                {detail.linkTo.startsWith("/events") ? "View Event" : "View Photos"} <ChevronRight size={13} strokeWidth={3} />
              </button>
            ) : (
              <button className="mt-4 w-full py-3 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-white"
                style={{ background: "#e10600" }}>
                {detail.type === "shop" ? "View Profile" : detail.type === "scenic" ? "Open Route" : detail.type === "partner" ? "View Deal" : "Details"}
                <ChevronRight size={13} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
