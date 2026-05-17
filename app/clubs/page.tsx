"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Users, MapPin, Lock, Globe, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ClubsPage() {
  const { clubs } = useStore();
  const router = useRouter();
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const toggle = (id:string) => setJoined(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Clubs</h1>
          </div>
          <button onClick={() => alert("Coming soon!")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white" style={{ background:"#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Start
          </button>
        </div>
      </div>

      <div className="flex flex-col" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {clubs.map((club, i) => {
          const isMember = joined.has(club.id);
          return (
            <article key={club.id} className="relative" style={{ borderBottom: i<clubs.length-1?"1px solid #1e1e2a":"none" }}>
              <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: isMember?"#e10600":"#2c2c3a" }} />

              {/* Banner */}
              <div className="h-[60px] relative overflow-hidden" style={{ background:"#1e1e2a" }}>
                <Image src={club.banner} alt={club.name} fill className="object-cover" style={{ opacity:0.55 }} />
              </div>

              <div className="pl-5 pr-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{club.type}</span>
                  <span className="flex items-center gap-1" style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c" }}>
                    {club.public ? <Globe size={9}/> : <Lock size={9}/>} {club.public?"PUBLIC":"PRIVATE"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-[16px] font-black text-white tracking-tight leading-tight">{club.name}</h2>
                  <div className="text-right shrink-0">
                    <div className="text-[20px] font-black text-white tabular-nums leading-none">{club.members+(isMember?1:0)}</div>
                    <div style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>MEMBERS</div>
                  </div>
                </div>

                <p className="text-[12px] leading-relaxed mb-3" style={{ color:"#8888a0" }}>{club.description}</p>

                <div className="flex gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color:"#4a4a5c" }}><MapPin size={10}/> {club.location}</span>
                  <span className="text-[11px] font-semibold" style={{ color: club.fee==="Free"?"#00d2be":"#4a4a5c" }}>{club.fee}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {club.tags.map(t => <span key={t} style={{ fontSize:"10px", color:"#383848", border:"1px solid #1e1e2a", borderRadius:"3px", padding:"2px 8px" }}>#{t}</span>)}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggle(club.id)} className="flex-1 py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase"
                    style={{ background: isMember?"transparent":"#e10600", color: isMember?"#e10600":"#fff", border: isMember?"1px solid #e10600":"1px solid transparent" }}>
                    {isMember?"✓  Member":"Join Club"}
                  </button>
                  <button onClick={() => router.push(`/clubs/${club.id}`)} className="px-3.5 py-2.5 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
                    <ChevronRight size={15} style={{ color:"#8888a0" }} />
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
