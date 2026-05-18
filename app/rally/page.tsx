"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, Flag, MapPin, Users, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";

export default function RallyPage() {
  const { rallies } = useStore();
  const router = useRouter();

  return (
    <div className="pt-14 pb-20 min-h-screen" style={{ background:"#15151e" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Rally</h1>
          </div>
          <button onClick={() => router.push("/rally/new")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white"
            style={{ background:"#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Plan Rally
          </button>
        </div>
      </div>

      <div className="flex flex-col" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {rallies.map((rally, i) => (
          <button key={rally.id} onClick={() => router.push(`/rally/${rally.id}`)}
            className="text-left relative"
            style={{ borderBottom: i < rallies.length-1 ? "1px solid #1e1e2a" : "none" }}>
            <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: rally.status==="active" ? "#e10600" : "#2c2c3a" }} />

            {/* Banner */}
            <div className="h-[60px] relative overflow-hidden" style={{ background:"#1e1e2a" }}>
              <Image src={rally.banner} alt={rally.name} fill className="object-cover" style={{ opacity:0.6 }} />
              <div className="absolute inset-0 flex items-center px-5" style={{ background:"linear-gradient(90deg,rgba(21,21,30,0.8) 0%,transparent 70%)" }}>
                <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.15em", color:"#e10600", textTransform:"uppercase" }}>
                  {rally.status === "active" ? "● LIVE" : rally.status === "upcoming" ? "UPCOMING" : "COMPLETED"}
                </span>
              </div>
            </div>

            <div className="pl-5 pr-4 py-4">
              <h2 className="text-[16px] font-black text-white tracking-tight leading-tight mb-2">{rally.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color:"#4a4a5c" }}>
                  <Calendar size={11} /> {new Date(rally.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                </span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color:"#4a4a5c" }}>
                  <MapPin size={11} /> {rally.startLocation} → {rally.endLocation}
                </span>
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color:"#4a4a5c" }}>
                  <Users size={11} /> {rally.members.length} / {rally.maxCars} cars
                </span>
              </div>

              {rally.fundraiser && (
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>FUNDRAISER</span>
                    <span style={{ fontSize:"10px", fontWeight:700, color:"#00d2be" }}>${rally.raised.toLocaleString()} / ${rally.goal.toLocaleString()}</span>
                  </div>
                  <div className="h-[3px] overflow-hidden" style={{ background:"#1e1e2a" }}>
                    <div className="h-full" style={{ width:`${Math.round((rally.raised/rally.goal)*100)}%`, background:"#00d2be" }} />
                  </div>
                </div>
              )}

              <p className="text-[12px] leading-relaxed" style={{ color:"#8888a0" }}>{rally.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* How it works teaser */}
      <div className="px-4 py-6">
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"16px" }}>HOW RALLY WORKS</p>
        {[
          { icon: Flag,    title: "Plan Your Route",    desc: "Set start, stops, and destination. Rally leader controls the pace." },
          { icon: Users,   title: "Invite Your Crew",   desc: "Invite members or open it to the Drive 59 community." },
          { icon: MapPin,  title: "Live Convoy Map",    desc: "See every car on a live map with status indicators while driving." },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ background:"#e10600" }}>
              <Icon size={15} color="#fff" />
            </div>
            <div>
              <p className="text-[13px] font-black text-white">{title}</p>
              <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color:"#8888a0" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
