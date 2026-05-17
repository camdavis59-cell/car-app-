"use client";
import { useState } from "react";
import { clubs } from "@/lib/mockData";
import { Users, MapPin, Lock, Globe, Plus, ChevronRight, Shield } from "lucide-react";

const CLUB_COLOR = ["#e63946", "#3b82f6", "#f59e0b", "#a855f7"];

export default function ClubsPage() {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setJoined(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="pt-[53px] pb-[72px] min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="px-4 pt-5 pb-1">
        <div className="flex items-center justify-between mb-0.5">
          <div>
            <h1 className="text-[22px] font-black text-white tracking-tight">Car Clubs</h1>
            <p className="text-[#555] text-[12px] font-medium">Miami · Find your people</p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#e63946] text-white text-[12px] font-bold px-3.5 py-2 rounded-full">
            <Plus size={13} strokeWidth={2.5} /> Start a Club
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {clubs.map((club, i) => {
          const isMember = joined.has(club.id);
          const accent = CLUB_COLOR[i % CLUB_COLOR.length];

          return (
            <article key={club.id} className="bg-[#111] border border-[#1c1c1c] rounded-2xl overflow-hidden card-hover">
              {/* Banner */}
              <div className="h-[72px] relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${accent}22 0%, #111 60%)` }}>
                {/* Large ghosted name */}
                <span className="absolute inset-0 flex items-center px-4 text-[28px] font-black uppercase tracking-widest pointer-events-none"
                  style={{ color: `${accent}18` }}>
                  {club.name}
                </span>
                {/* Accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: accent }} />
                {/* Privacy badge */}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#0a0a0a]/70 px-2 py-1 rounded-full border border-[#1e1e1e]"
                    style={{ color: club.public ? "#22c55e" : "#888" }}>
                    {club.public ? <Globe size={9} /> : <Lock size={9} />}
                    {club.public ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="font-black text-white text-[16px] leading-tight">{club.name}</h2>
                    <span className="text-[11px] font-bold" style={{ color: accent }}>{club.type}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[20px] font-black text-white tabular-nums">
                      {club.members + (isMember ? 1 : 0)}
                    </div>
                    <div className="text-[10px] text-[#444] font-medium">members</div>
                  </div>
                </div>

                <p className="text-[#555] text-[12px] leading-relaxed mb-3">{club.description}</p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#444]">
                    <MapPin size={10} /> {club.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#444]">
                    <Shield size={10} /> {club.fee}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap mb-4">
                  {club.tags.map(t => (
                    <span key={t} className="text-[10px] text-[#383838] border border-[#1e1e1e] px-2 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggle(club.id)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all"
                    style={{
                      background: isMember ? `${accent}18` : accent,
                      color: isMember ? accent : "#fff",
                      border: `1.5px solid ${isMember ? accent : "transparent"}`,
                    }}>
                    {isMember ? "✓  Member" : "Join Club"}
                  </button>
                  <button className="px-3.5 py-2.5 rounded-xl bg-[#181818] border border-[#242424] text-[#444] hover:text-[#888] transition-colors">
                    <ChevronRight size={16} />
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
