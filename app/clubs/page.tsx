"use client";
import { useState } from "react";
import { clubs } from "@/lib/mockData";
import { Users, MapPin, Lock, Globe, Plus, ChevronRight } from "lucide-react";

export default function ClubsPage() {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setJoined(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>

      {/* Page header */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="label mb-1">Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Clubs</h1>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white"
            style={{ background: "#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Start
          </button>
        </div>
      </div>

      {/* Club list */}
      <div className="flex flex-col" style={{ borderBottom: "1px solid #2c2c3a" }}>
        {clubs.map((club, i) => {
          const isMember = joined.has(club.id);
          return (
            <article key={club.id} className="relative"
              style={{ borderBottom: i < clubs.length - 1 ? "1px solid #1e1e2a" : "none" }}>

              {/* Left bar — red when member */}
              <div className="absolute left-0 top-4 bottom-4 w-[2px]"
                style={{ background: isMember ? "#e10600" : "#2c2c3a" }} />

              <div className="pl-5 pr-4 py-5">
                {/* Type + privacy */}
                <div className="flex items-center justify-between mb-2">
                  <span className="label">{club.type}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide"
                    style={{ color: "#4a4a5c" }}>
                    {club.public ? <Globe size={10} /> : <Lock size={10} />}
                    {club.public ? "PUBLIC" : "PRIVATE"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-[16px] font-black text-white tracking-tight leading-tight">{club.name}</h2>
                  <div className="text-right shrink-0">
                    <div className="text-[20px] font-black text-white tabular-nums leading-none">
                      {club.members + (isMember ? 1 : 0)}
                    </div>
                    <div className="label mt-0.5">MEMBERS</div>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#8888a0" }}>{club.description}</p>

                <div className="flex gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#4a4a5c" }}>
                    <MapPin size={10} /> {club.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color: club.fee === "Free" ? "#00d2be" : "#4a4a5c" }}>
                    {club.fee}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggle(club.id)}
                    className="flex-1 py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase transition-all"
                    style={{
                      background: isMember ? "transparent" : "#e10600",
                      color: isMember ? "#e10600" : "#ffffff",
                      border: isMember ? "1px solid #e10600" : "1px solid transparent",
                    }}>
                    {isMember ? "✓  Member" : "Join"}
                  </button>
                  <button className="px-3.5 py-2.5 rounded-sm flex items-center justify-center"
                    style={{ background: "#1e1e2a", border: "1px solid #2c2c3a" }}>
                    <ChevronRight size={15} style={{ color: "#4a4a5c" }} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
