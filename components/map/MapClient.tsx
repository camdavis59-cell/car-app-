"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPins } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Plus, X, ChevronRight, Navigation, Camera, CalendarDays, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FilterKey = "photo" | "events" | "business" | "gas" | "scenic";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "photo",    label: "Photo Spots"  },
  { key: "events",   label: "Events"       },
  { key: "business", label: "Businesses"   },
  { key: "gas",      label: "Gas Stations" },
  { key: "scenic",   label: "Scenic Roads" },
];

const BIZ_LABEL: Record<string, string> = {
  tire: "TIRES", tuning: "TUNING", supercar_dealer: "DEALER", oil_change: "OIL CHANGE", gas: "GAS",
};
const BIZ_COLOR: Record<string, string> = {
  tire: "#f59e0b", tuning: "#8b5cf6", supercar_dealer: "#e10600", oil_change: "#10b981", gas: "#22d3ee",
};

function photoPin(name: string, cover: string) {
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7))">
      <div style="width:54px;height:54px;border-radius:4px;overflow:hidden;border:2.5px solid #ffffff;background:#1e1e2a">
        <img src="${cover}" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
      </div>
      <div style="background:#ffffff;padding:2px 6px;border-radius:2px;font-size:9px;font-weight:800;color:#111;letter-spacing:0.03em;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;text-align:center">${short}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #ffffff;margin-top:-2px"></div>
    </div>`,
    className: "leaflet-interactive",
    iconSize: [90, 80],
    iconAnchor: [45, 80],
  });
}

function eventPin(name: string, banner: string) {
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7))">
      <div style="width:54px;height:54px;border-radius:4px;overflow:hidden;border:2.5px solid #e10600;background:#1e1e2a">
        <img src="${banner}" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
      </div>
      <div style="background:#e10600;padding:2px 6px;border-radius:2px;font-size:9px;font-weight:800;color:#fff;letter-spacing:0.03em;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;text-align:center">${short}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #e10600;margin-top:-2px"></div>
    </div>`,
    className: "leaflet-interactive",
    iconSize: [90, 80],
    iconAnchor: [45, 80],
  });
}

function bizPin(name: string, cover: string, color: string) {
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.7))">
      <div style="width:48px;height:48px;border-radius:4px;overflow:hidden;border:2.5px solid ${color};background:#1e1e2a">
        <img src="${cover}" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
      </div>
      <div style="background:${color};padding:2px 6px;border-radius:2px;font-size:9px;font-weight:800;color:#fff;letter-spacing:0.03em;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;text-align:center">${short}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${color};margin-top:-2px"></div>
    </div>`,
    className: "leaflet-interactive",
    iconSize: [90, 74],
    iconAnchor: [45, 74],
  });
}

function gasPin(name: string) {
  const short = name.length > 12 ? name.slice(0, 11) + "…" : name;
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.6))">
      <div style="width:28px;height:28px;border-radius:50%;background:#22d3ee;border:2px solid #fff;display:flex;align-items:center;justify-content:center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M3 22V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 22h10M3 22H1m12 0h2M7 7h2M7 11h2M17 11v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9l-3-3"/></svg>
      </div>
      <div style="background:#22d3ee;padding:1px 5px;border-radius:2px;font-size:8px;font-weight:800;color:#fff;white-space:nowrap;max-width:80px;overflow:hidden;text-overflow:ellipsis;text-align:center">${short}</div>
    </div>`,
    className: "leaflet-interactive",
    iconSize: [80, 54],
    iconAnchor: [40, 54],
  });
}

function dot(color: string) {
  return L.divIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.25);box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
    className: "leaflet-interactive",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

interface Detail {
  name: string;
  desc?: string;
  meta?: string;
  badge?: string;
  type: FilterKey | "meetup";
  linkTo?: string;
  image?: string;
  subtext?: string;
}

export default function MapClient() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set(["photo", "events", "business", "gas"]));
  const [detail, setDetail] = useState<Detail | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const router = useRouter();
  const { photoLocations, events: storeEvents, businesses } = useStore();

  useEffect(() => { setMounted(true); }, []);

  const toggle = (k: FilterKey) =>
    setActive(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0e0e16" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#e10600", borderTopColor: "transparent" }} />
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#4a4a5c" }}>Loading Miami</span>
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
              style={{ background: on ? "#e10600" : "rgba(30,30,42,0.9)", borderColor: on ? "#e10600" : "#2c2c3a", color: on ? "#fff" : "#4a4a5c" }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <div className="absolute top-14 right-3 z-[1000] flex flex-col gap-2">
        <button className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "rgba(30,30,42,0.9)", border: "1px solid #2c2c3a" }}>
          <Navigation size={13} style={{ color: "#4a4a5c" }} />
        </button>
        {fabOpen && (
          <>
            <button onClick={() => { setFabOpen(false); router.push("/photo-locations/new"); }} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "rgba(30,30,42,0.95)", border: "1px solid #2c2c3a" }} title="Add Photo Spot"><Camera size={13} style={{ color: "#fff" }} /></button>
            <button onClick={() => { setFabOpen(false); router.push("/events/new"); }} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "rgba(30,30,42,0.95)", border: "1px solid #2c2c3a" }} title="Add Event"><CalendarDays size={13} style={{ color: "#fff" }} /></button>
            <button onClick={() => { setFabOpen(false); router.push("/market/new"); }} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "rgba(30,30,42,0.95)", border: "1px solid #2c2c3a" }} title="Add Listing"><Store size={13} style={{ color: "#fff" }} /></button>
          </>
        )}
        <button onClick={() => setFabOpen(v => !v)} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: fabOpen ? "#2c2c3a" : "#e10600", transition: "background 0.15s" }}>
          {fabOpen ? <X size={14} style={{ color: "#fff" }} /> : <Plus size={14} style={{ color: "#fff" }} />}
        </button>
      </div>

      <MapContainer center={[25.7617, -80.1918]} zoom={12} style={{ width: "100%", height: "100%", background: "#0e0e16" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Photo locations */}
        {active.has("photo") && photoLocations.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={photoPin(p.name, p.cover)}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description,
              meta: `${p.photos.length} photos · ${new Set(p.photos.map(ph=>ph.user)).size} contributors`,
              badge: "PHOTO SPOT", type: "photo", image: p.cover, linkTo: `/photo-locations/${p.id}`,
            }) }} />
        )}

        {/* Events */}
        {active.has("events") && storeEvents.filter(e => e.lat).map(e =>
          <Marker key={`ev-${e.id}`} position={[e.lat, e.lng]} icon={eventPin(e.title, e.banner)}
            eventHandlers={{ click: () => setDetail({
              name: e.title, desc: e.description,
              meta: `${e.rsvp}/${e.max} going · ${e.time}`,
              badge: e.type.toUpperCase(), type: "events", image: e.banner, linkTo: `/events/${e.id}`,
              subtext: e.location,
            }) }} />
        )}

        {/* Businesses (tire, tuning, dealer, oil change) */}
        {active.has("business") && businesses.filter(b => b.type !== "gas").map(b =>
          <Marker key={b.id} position={[b.lat, b.lng]} icon={bizPin(b.name, b.cover, BIZ_COLOR[b.type] ?? "#e10600")}
            eventHandlers={{ click: () => setDetail({
              name: b.name, desc: b.description,
              meta: `★ ${b.rating}  (${b.reviews} reviews)${b.deal ? `  ·  ${b.deal}` : ""}`,
              badge: BIZ_LABEL[b.type] ?? "SHOP", type: "business", image: b.cover, linkTo: `/businesses/${b.id}`,
              subtext: b.address,
            }) }} />
        )}

        {/* Gas stations */}
        {active.has("gas") && businesses.filter(b => b.type === "gas").map(b =>
          <Marker key={b.id} position={[b.lat, b.lng]} icon={gasPin(b.name)}
            eventHandlers={{ click: () => setDetail({
              name: b.name, desc: b.description,
              meta: b.hours,
              badge: "GAS STATION", type: "gas", image: b.cover, linkTo: `/businesses/${b.id}`,
              subtext: b.address,
            }) }} />
        )}

        {/* Scenic roads */}
        {active.has("scenic") && mapPins.scenicRoads.map(p =>
          <Marker key={p.id} position={[p.lat, p.lng]} icon={dot("#4a4a5c")}
            eventHandlers={{ click: () => setDetail({
              name: p.name, desc: p.description, badge: "SCENIC ROAD", type: "scenic",
            }) }} />
        )}
      </MapContainer>

      {/* Detail panel */}
      {detail && (
        <div className="absolute bottom-0 inset-x-0 z-[1000]" style={{ background: "#1e1e2a", borderTop: "1px solid #2c2c3a" }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-[3px] rounded-full" style={{ background: "#2c2c3a" }} />
          </div>

          {/* Image preview (clickable) */}
          {detail.image && detail.linkTo && (
            <button onClick={() => { setDetail(null); router.push(detail.linkTo!); }} className="w-full relative overflow-hidden" style={{ height: "110px", display: "block", background: "#0e0e16" }}>
              <Image src={detail.image} alt={detail.name} fill className="object-cover" style={{ opacity: 0.75 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,30,42,0.9) 0%, transparent 60%)" }} />
              <div className="absolute bottom-2 left-3">
                {detail.badge && <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e10600" }}>{detail.badge}</span>}
                <p className="text-white font-black text-[15px] leading-tight">{detail.name}</p>
                {detail.subtext && <p style={{ fontSize:"11px", color:"#8888a0", marginTop:"1px" }}>{detail.subtext}</p>}
              </div>
            </button>
          )}

          <div className="px-4 pb-4 pt-3">
            {!detail.image && (
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  {detail.badge && <span className="label mb-1.5 block">{detail.badge}</span>}
                  <h3 className="text-[17px] font-black text-white leading-tight tracking-tight">{detail.name}</h3>
                  {detail.desc && <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "#8888a0" }}>{detail.desc}</p>}
                </div>
                <button onClick={() => setDetail(null)} className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0" style={{ background: "#252532", border: "1px solid #2c2c3a" }}>
                  <X size={13} style={{ color: "#4a4a5c" }} />
                </button>
              </div>
            )}
            {detail.image && (
              <div className="flex items-center justify-between mb-2">
                {detail.meta && <p className="text-[12px] font-bold" style={{ color: "#e10600" }}>{detail.meta}</p>}
                <button onClick={() => setDetail(null)} className="w-7 h-7 rounded-sm flex items-center justify-center ml-auto" style={{ background: "#252532", border: "1px solid #2c2c3a" }}>
                  <X size={13} style={{ color: "#4a4a5c" }} />
                </button>
              </div>
            )}
            {!detail.image && detail.meta && <p className="text-[12px] font-bold mb-3" style={{ color: "#e10600" }}>{detail.meta}</p>}

            {detail.linkTo ? (
              <button onClick={() => { setDetail(null); router.push(detail.linkTo!); }} className="w-full py-3 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-white" style={{ background: "#e10600" }}>
                {detail.type === "photo" ? "View Photo Spot" : detail.type === "events" ? "View Event" : detail.type === "business" || detail.type === "gas" ? "View Business" : "Details"}
                <ChevronRight size={13} strokeWidth={3} />
              </button>
            ) : (
              <button className="w-full py-3 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-white" style={{ background: "#e10600" }}>
                {detail.type === "scenic" ? "Open Route" : "Details"} <ChevronRight size={13} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
