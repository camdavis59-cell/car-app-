"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, CalendarDays, MapPin, Users, MessageSquare, Pencil } from "lucide-react";
import Image from "next/image";

const TYPE_LABEL: Record<string,string> = { meetup:"MEET", competition:"COMPETITION", cruise:"CRUISE", show:"SHOW", rally:"RALLY" };

const MOCK_ATTENDEES = [
  { handle:"@miamiturbo",   car:"2020 GT-R"        },
  { handle:"@305builds",    car:"Ferrari 488"       },
  { handle:"@brickellgt",   car:"McLaren 720S"      },
  { handle:"@southbeachv8", car:"Camaro SS"         },
  { handle:"@jdmmiami",     car:"Honda S2000"       },
];
const MOCK_CHAT = [
  { user:"@miamiturbo",   msg:"Saw your Supra at Wynwood last night 🔥",           ago:"1h"  },
  { user:"@305builds",    msg:"I'll be there with the Ferrari. See you all at 7.",  ago:"45m" },
  { user:"@jdmmiami",     msg:"Parking situation?",                                 ago:"20m" },
];

function fmt(d:string){ return new Date(d).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}); }

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { events, rsvpdEvents, toggleRsvp } = useStore();
  const ev = events.find(e => e.id === id);
  if (!ev) return null;

  const going = rsvpdEvents.includes(ev.id);
  const pct = Math.round((ev.rsvp/ev.max)*100);
  const filling = pct>=75;

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      {/* Banner */}
      <div className="relative h-52 overflow-hidden">
        <Image src={ev.banner} alt={ev.title} fill className="object-cover" style={{ opacity:0.6 }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(21,21,30,0.95) 0%,transparent 50%)" }} />
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <button onClick={() => router.push(`/events/${id}/edit`)} className="absolute top-4 right-4 w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"rgba(21,21,30,0.85)", border:"1px solid #2c2c3a" }}>
          <Pencil size={13} color="#fff" />
        </button>
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e10600" }}>{TYPE_LABEL[ev.type]}{ev.private?" · PRIVATE":""}{ev.sponsored?` · SPONSORED BY ${ev.sponsor.toUpperCase()}`:""}</span>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-tight mt-0.5">{ev.title}</h1>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color:"#8888a0" }}>{ev.description}</p>
        <div className="flex flex-col gap-2 mb-4">
          <span className="flex items-center gap-2 text-[12px]" style={{ color:"#8888a0" }}><CalendarDays size={13} style={{ color:"#4a4a5c" }}/> {fmt(ev.date)} · {ev.time}</span>
          <span className="flex items-center gap-2 text-[12px]" style={{ color:"#8888a0" }}><MapPin size={13} style={{ color:"#4a4a5c" }}/> {ev.location}</span>
          <span className="flex items-center gap-2 text-[12px]" style={{ color:"#8888a0" }}>
            <Users size={13} style={{ color:"#4a4a5c" }}/>
            <span className="font-bold" style={{ color: filling?"#e10600":"#fff" }}>{ev.rsvp+(going?1:0)}</span> / {ev.max} going {filling&&<span style={{ color:"#e10600" }}>· FILLING FAST</span>}
          </span>
        </div>
        <div className="h-[3px] mb-4" style={{ background:"#1e1e2a" }}>
          <div className="h-full" style={{ width:`${pct}%`, background: filling?"#e10600":"#2c2c3a" }} />
        </div>
        {(ev.rules||ev.attire||ev.vehicleTypes) && (
          <div className="grid grid-cols-1 gap-3 p-3 mb-4 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
            {ev.vehicleTypes && <div><p style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c", textTransform:"uppercase", letterSpacing:"0.1em" }}>VEHICLES</p><p className="text-[12px] text-white mt-0.5">{ev.vehicleTypes}</p></div>}
            {ev.attire && <div><p style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c", textTransform:"uppercase", letterSpacing:"0.1em" }}>ATTIRE</p><p className="text-[12px] text-white mt-0.5">{ev.attire}</p></div>}
            {ev.rules && <div><p style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c", textTransform:"uppercase", letterSpacing:"0.1em" }}>RULES</p><p className="text-[12px] text-white mt-0.5">{ev.rules}</p></div>}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {ev.tags.map(t => <span key={t} style={{ fontSize:"10px", color:"#383848", border:"1px solid #1e1e2a", borderRadius:"3px", padding:"2px 8px" }}>#{t}</span>)}
        </div>
      </div>

      {/* Attendees */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"12px" }}>ATTENDING</p>
        <div style={{ border:"1px solid #2c2c3a", borderRadius:"3px", overflow:"hidden" }}>
          {MOCK_ATTENDEES.map((a,i) => (
            <div key={a.handle} className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: i>0?"1px solid #1e1e2a":"none" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-black" style={{ background:"#252532", color:"#8888a0" }}>{a.handle.slice(1,3).toUpperCase()}</div>
                <span className="text-[12px] font-semibold text-white">{a.handle}</span>
              </div>
              <span style={{ fontSize:"11px", color:"#4a4a5c" }}>{a.car}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat preview */}
      <div className="px-4 py-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c" }}><MessageSquare size={10} style={{ display:"inline", marginRight:"5px" }}/>EVENT CHAT</p>
          <button style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#e10600", textTransform:"uppercase" }}>OPEN</button>
        </div>
        <div style={{ border:"1px solid #2c2c3a", borderRadius:"3px", overflow:"hidden" }}>
          {MOCK_CHAT.map((m,i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2.5" style={{ borderTop: i>0?"1px solid #1e1e2a":"none" }}>
              <span style={{ fontSize:"10px", fontWeight:900, color:"#e10600", flexShrink:0, paddingTop:"1px" }}>{m.user}</span>
              <span className="flex-1 text-[12px]" style={{ color:"#8888a0" }}>{m.msg}</span>
              <span style={{ fontSize:"9px", color:"#2c2c3a", flexShrink:0 }}>{m.ago}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <button onClick={() => toggleRsvp(ev.id)}
          className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase"
          style={{ background: going?"transparent":"#e10600", color: going?"#e10600":"#fff", border: going?"1.5px solid #e10600":"1.5px solid transparent" }}>
          {going ? "✓  You're Attending — Cancel RSVP" : "RSVP TO THIS EVENT"}
        </button>
      </div>
    </div>
  );
}
