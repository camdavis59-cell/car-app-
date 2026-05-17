"use client";
import { useState } from "react";
import { clubs } from "@/lib/mockData";
import { Users, MapPin, Lock, Globe, Plus, ChevronRight } from "lucide-react";

export default function ClubsPage() {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggleJoin = (id: string) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="pt-[53px] pb-[76px] min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Car Clubs</h1>
          <button className="flex items-center gap-1.5 bg-[#e63946] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Plus size={13} /> Start a Club
          </button>
        </div>
        <p className="text-[#888] text-sm">Find your people in Miami</p>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {clubs.map(club => {
          const isMember = joined.has(club.id);
          return (
            <div key={club.id} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              {/* Banner placeholder */}
              <div className="h-16 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-[#2a2a2a] tracking-wider uppercase">{club.name}</span>
                </div>
                <div className="absolute top-3 right-3">
                  {club.public
                    ? <span className="flex items-center gap-1 text-[10px] text-[#888] bg-[#0a0a0a]/60 px-2 py-0.5 rounded-full"><Globe size={9} /> Public</span>
                    : <span className="flex items-center gap-1 text-[10px] text-[#888] bg-[#0a0a0a]/60 px-2 py-0.5 rounded-full"><Lock size={9} /> Private</span>
                  }
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{club.name}</h3>
                    <span className="text-[10px] text-[#e63946] font-semibold">{club.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">{club.members + (isMember ? 1 : 0)}</div>
                    <div className="text-[10px] text-[#555]">members</div>
                  </div>
                </div>

                <p className="text-[#888] text-xs mb-3 leading-relaxed">{club.description}</p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#555]">
                    <MapPin size={11} /> {club.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#555]">
                    <Users size={11} /> {club.fee}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap mb-4">
                  {club.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-[#555] border border-[#2a2a2a] px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleJoin(club.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: isMember ? "#10b98122" : "#e63946",
                      color: isMember ? "#10b981" : "#fff",
                      border: isMember ? "1px solid #10b981" : "1px solid #e63946",
                    }}
                  >
                    {isMember ? "✓ Joined" : "Join Club"}
                  </button>
                  <button className="px-4 py-2.5 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-[#888]">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
