"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Pencil, Check, X, Users, MapPin, Globe, Lock, Calendar, Shield } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const MOCK_MEMBERS = [
  { handle:"@miamiturbo",   car:"2020 GT-R",        role:"MEMBER" },
  { handle:"@305builds",    car:"Ferrari 488",       role:"MEMBER" },
  { handle:"@carlosriv59",  car:"1994 Supra",        role:"MEMBER" },
  { handle:"@brickellgt",   car:"McLaren 720S",      role:"MEMBER" },
  { handle:"@southbeachv8", car:"Camaro SS",         role:"MEMBER" },
];

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { clubs, updateClub } = useStore();
  const club = clubs.find(c => c.id === id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(club ? { ...club } : null);
  const [joined, setJoined] = useState(false);

  if (!club || !draft) return null;

  function save() { if (draft) updateClub(id, draft); setEditing(false); }

  const set = (k: string, v: string | boolean) => setDraft((d:any) => d ? { ...d, [k]: v } : d);

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      {/* Banner */}
      <div className="relative h-52 overflow-hidden">
        <Image src={editing ? draft.banner : club.banner} alt={club.name} fill className="object-cover" style={{ opacity:0.6 }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(21,21,30,0.95) 0%,transparent 50%)" }} />
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          {editing
            ? <>
                <button onClick={save} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#e10600" }}><Check size={14} color="#fff"/></button>
                <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}><X size={14} color="#fff"/></button>
              </>
            : <button onClick={() => { setDraft({...club}); setEditing(true); }} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}><Pencil size={13} color="#fff"/></button>
          }
        </div>
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}>{club.type}</span>
          <h1 className="text-[20px] font-black text-white tracking-tight">{editing ? draft.name : club.name}</h1>
        </div>
      </div>

      {editing ? (
        <div className="px-4 py-5" style={{ borderBottom:"1px solid #2c2c3a" }}>
          <Field label="Club Name" value={draft.name} onChange={v=>set("name",v)} />
          <Field label="Type" value={draft.type} onChange={v=>set("type",v)} />
          <Field label="Location" value={draft.location} onChange={v=>set("location",v)} />
          <Field label="Description" value={draft.description} onChange={v=>set("description",v)} multiline />
          <Field label="Meet Schedule" value={draft.meetSchedule} onChange={v=>set("meetSchedule",v)} />
          <Field label="Rules" value={draft.rules} onChange={v=>set("rules",v)} multiline />
          <Field label="Fee" value={draft.fee} onChange={v=>set("fee",v)} />
          <Field label="Banner Image URL" value={draft.banner} onChange={v=>set("banner",v)} />
          <Field label="Tags (comma separated)" value={draft.tags.join(", ")} onChange={v=>setDraft((d:any)=>d?{...d,tags:v.split(",").map((t:string)=>t.trim())}:d)} />
          <div className="flex items-center justify-between py-3" style={{ borderTop:"1px solid #1e1e2a" }}>
            <p className="text-[13px] font-bold text-white">Public Club</p>
            <button onClick={() => set("public", !draft.public)} className="w-12 h-6 rounded-full relative" style={{ background: draft.public?"#e10600":"#2c2c3a" }}>
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: draft.public?"calc(100% - 22px)":"2px" }} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
            {[{val:club.members+(joined?1:0),label:"MEMBERS"},{val:club.fee,label:"MEMBERSHIP"},{val:club.public?"Public":"Private",label:"TYPE"}].map((s,i) => (
              <div key={s.label} className="flex flex-col items-center py-3" style={{ borderLeft: i>0?"1px solid #2c2c3a":"none" }}>
                <span className="text-[17px] font-black text-white tabular-nums">{s.val}</span>
                <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color:"#8888a0" }}>{club.description}</p>
            <div className="flex flex-col gap-2 mb-4">
              <span className="flex items-center gap-2 text-[12px]" style={{ color:"#4a4a5c" }}><MapPin size={12}/> {club.location}</span>
              <span className="flex items-center gap-2 text-[12px]" style={{ color:"#4a4a5c" }}><Calendar size={12}/> {club.meetSchedule}</span>
              <span className="flex items-center gap-2 text-[12px]" style={{ color:"#4a4a5c" }}><Shield size={12}/> Admin: {club.adminHandle}</span>
              {club.public ? <span className="flex items-center gap-2 text-[12px]" style={{ color:"#4a4a5c" }}><Globe size={12}/> Public club</span>
                           : <span className="flex items-center gap-2 text-[12px]" style={{ color:"#4a4a5c" }}><Lock size={12}/> Private — request to join</span>}
            </div>
            {club.rules && (
              <div className="p-3 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"6px" }}>RULES</p>
                <p style={{ fontSize:"12px", color:"#8888a0", lineHeight:1.5 }}>{club.rules}</p>
              </div>
            )}
          </div>

          {/* Members */}
          <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>MEMBERS</p>
            <div style={{ border:"1px solid #2c2c3a", borderRadius:"3px", overflow:"hidden" }}>
              {MOCK_MEMBERS.map((m,i) => (
                <div key={m.handle} className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: i>0?"1px solid #1e1e2a":"none" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-black" style={{ background:"#252532", color:"#8888a0" }}>{m.handle.slice(1,3).toUpperCase()}</div>
                    <span style={{ fontSize:"12px", fontWeight:600, color:"#fff" }}>{m.handle}</span>
                  </div>
                  <span style={{ fontSize:"11px", color:"#4a4a5c" }}>{m.car}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="px-4 pt-4">
        <button onClick={() => setJoined(j=>!j)}
          className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase"
          style={{ background: joined?"transparent":"#e10600", color: joined?"#e10600":"#fff", border: joined?"1.5px solid #e10600":"1.5px solid transparent" }}>
          {joined?"✓  You're a Member — Leave":"Join This Club"}
        </button>
      </div>
    </div>
  );
}
