"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Mic, MicOff, AlertTriangle, Coffee, Navigation, SkipForward, Bath, Car, ChevronRight, Flag, Zap } from "lucide-react";
import Image from "next/image";

const CAR_COLORS = ["#e10600","#3b82f6","#22c55e","#f59e0b","#a855f7","#06b6d4"];

const MOCK_CONVOY = [
  { pos: 1, handle: "@carlosriv59",  car: "Supra",   status: "ok",      speed: 68, color: "#e10600" },
  { pos: 2, handle: "@miamiturbo",   car: "GT-R",    status: "ok",      speed: 67, color: "#3b82f6" },
  { pos: 3, handle: "@305builds",    car: "Ferrari", status: "ok",      speed: 66, color: "#22c55e" },
  { pos: 4, handle: "@jdmmiami",     car: "S2000",   status: "snack",   speed: 65, color: "#f59e0b" },
  { pos: 5, handle: "@brickellgt",   car: "McLaren", status: "restroom",speed: 63, color: "#a855f7" },
];

const CHECKPOINTS = [
  { name: "Card Sound Road",   pts: 50,  done: true  },
  { name: "Islamorada Stop",   pts: 75,  done: true  },
  { name: "Marathon Rest",     pts: 50,  done: false },
  { name: "Key West Finish",   pts: 200, done: false },
];

export default function RallyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const rally = useStore(s => s.rallies.find(r => r.id === id));
  const [walkie, setWalkie] = useState(false);
  const [myStatus, setMyStatus] = useState<string | null>(null);

  if (!rally) return null;

  const STATUS_ICONS: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    restroom: { icon: <Bath size={16} />,          label: "Restroom",      color: "#3b82f6" },
    snack:    { icon: <Coffee size={16} />,        label: "Snack / Fuel",  color: "#f59e0b" },
    help:     { icon: <AlertTriangle size={16} />, label: "Need Help",     color: "#e10600" },
    pass:     { icon: <SkipForward size={16} />,   label: "Pass Request",  color: "#a855f7" },
  };

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>RALLY · ACTIVE</p>
          <h1 className="text-[15px] font-black text-white truncate">{rally.name}</h1>
        </div>
        <button onClick={() => setWalkie(w => !w)}
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{ background: walkie ? "#e10600" : "#1e1e2a", border:`1px solid ${walkie?"#e10600":"#2c2c3a"}` }}>
          {walkie ? <Mic size={16} color="#fff" /> : <MicOff size={16} style={{ color:"#4a4a5c" }} />}
        </button>
      </div>

      {/* Live map placeholder */}
      <div className="relative h-52 overflow-hidden" style={{ background:"#0e0e16", borderBottom:"1px solid #2c2c3a" }}>
        <Image src={rally.banner} alt={rally.name} fill className="object-cover" style={{ opacity:0.25 }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Navigation size={24} style={{ color:"#e10600" }} />
          <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>Live Convoy Map</p>
          <p style={{ fontSize:"10px", color:"#2c2c3a" }}>(Available on mobile with location permissions)</p>
        </div>
        {/* Car dots scattered */}
        {MOCK_CONVOY.map((car, i) => (
          <div key={car.pos} className="absolute w-3 h-3 rounded-full border-2 border-white"
            style={{ background: car.color, left:`${20+i*14}%`, top:`${35+Math.sin(i)*20}%`, boxShadow:`0 0 8px ${car.color}88` }} />
        ))}
        {walkie && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background:"rgba(225,6,0,0.9)" }}>
            <Mic size={14} color="#fff" />
            <span style={{ fontSize:"11px", fontWeight:700, color:"#fff" }}>Walkie-talkie LIVE — tap to speak</span>
            <div className="ml-auto flex gap-1">{[...Array(4)].map((_,i)=><div key={i} className="w-1 rounded-full animate-pulse" style={{ height:`${8+i*4}px`, background:"rgba(255,255,255,0.7)" }} />)}</div>
          </div>
        )}
      </div>

      {/* Status buttons */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>YOUR STATUS</p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(STATUS_ICONS).map(([key, { icon, label, color }]) => (
            <button key={key} onClick={() => setMyStatus(myStatus===key ? null : key)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-sm transition-all"
              style={{ background: myStatus===key ? `${color}22` : "#1e1e2a", border:`1px solid ${myStatus===key?color:"#2c2c3a"}` }}>
              <div style={{ color: myStatus===key ? color : "#4a4a5c" }}>{icon}</div>
              <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.08em", color: myStatus===key ? color : "#4a4a5c", textTransform:"uppercase", textAlign:"center", lineHeight:1.2 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Convoy order */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>CONVOY ORDER</p>
        <div style={{ border:"1px solid #2c2c3a", borderRadius:"3px", overflow:"hidden" }}>
          {MOCK_CONVOY.map((c, i) => (
            <div key={c.pos} className="flex items-center gap-3 px-3 py-3"
              style={{ borderTop: i>0?"1px solid #1e1e2a":"none" }}>
              <div className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-black" style={{ background: c.color, color:"#fff" }}>{c.pos}</div>
              <div className="flex-1">
                <p style={{ fontSize:"12px", fontWeight:700, color:"#fff" }}>{c.handle}</p>
                <p style={{ fontSize:"10px", color:"#4a4a5c" }}>{c.car}</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize:"12px", fontWeight:700, color:"#fff", fontFamily:"monospace" }}>{c.speed} mph</p>
                {c.status !== "ok" && (
                  <p style={{ fontSize:"9px", fontWeight:700, color: STATUS_ICONS[c.status]?.color ?? "#888", textTransform:"uppercase" }}>
                    {STATUS_ICONS[c.status]?.label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkpoints / points */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>CHECKPOINTS</p>
        {CHECKPOINTS.map((cp, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i<CHECKPOINTS.length-1?"1px solid #1e1e2a":"none" }}>
            <div className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0"
              style={{ background: cp.done ? "#00d2be" : "#1e1e2a", border:`1px solid ${cp.done?"#00d2be":"#2c2c3a"}` }}>
              {cp.done && <span style={{ fontSize:"10px", color:"#000", fontWeight:900 }}>✓</span>}
            </div>
            <p className="flex-1" style={{ fontSize:"13px", color: cp.done ? "#fff" : "#4a4a5c", fontWeight: cp.done ? 700 : 400 }}>{cp.name}</p>
            <div className="flex items-center gap-1" style={{ color: cp.done ? "#00d2be" : "#2c2c3a" }}>
              <Zap size={11} />
              <span style={{ fontSize:"11px", fontWeight:700 }}>+{cp.pts}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fundraiser */}
      {rally.fundraiser && (
        <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
          <div className="flex justify-between mb-2">
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>FUNDRAISER</p>
            <span style={{ fontSize:"10px", fontWeight:700, color:"#00d2be" }}>${rally.raised.toLocaleString()} raised</span>
          </div>
          <div className="h-2 rounded-sm overflow-hidden mb-1" style={{ background:"#1e1e2a" }}>
            <div className="h-full rounded-sm" style={{ width:`${Math.round((rally.raised/rally.goal)*100)}%`, background:"#00d2be" }} />
          </div>
          <p style={{ fontSize:"10px", color:"#4a4a5c" }}>Goal: ${rally.goal.toLocaleString()}</p>
        </div>
      )}

      {/* Rally metrics */}
      <div className="px-4 py-4">
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>RALLY METRICS</p>
        <div className="grid grid-cols-3 gap-2">
          {[{label:"AVG SPEED",val:"66 mph"},{label:"DISTANCE",val:"162 mi"},{label:"TIME",val:"2h 41m"},{label:"ELEVATION",val:"+480 ft"},{label:"CARS",val:`${MOCK_CONVOY.length}`},{label:"YOUR PTS",val:"275"}].map(m => (
            <div key={m.label} className="py-3 rounded-sm flex flex-col items-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
              <span className="text-[15px] font-black text-white tabular-nums">{m.val}</span>
              <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase", marginTop:"2px" }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
