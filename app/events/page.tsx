"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, CalendarDays, MapPin, Users, ChevronRight, Flame } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const TYPE_LABEL: Record<string,string> = { meetup:"MEET", competition:"COMPETITION", cruise:"CRUISE", show:"SHOW", rally:"RALLY" };
const FILTERS = ["ALL","MEET","CRUISE","SHOW","COMPETITION","RALLY"];
function fmt(d:string){ return new Date(d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase(); }

export default function EventsPage() {
  const { events, rsvpdEvents, toggleRsvp } = useStore();
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");

  const list = filter==="ALL" ? events : events.filter(e => TYPE_LABEL[e.type]===filter);

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Events</h1>
          </div>
          <button onClick={() => router.push("/events/new")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white"
            style={{ background:"#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Host Event
          </button>
        </div>
      </div>

      <div className="flex no-scroll overflow-x-auto" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {FILTERS.map(f => {
          const on = filter===f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-3 whitespace-nowrap relative"
              style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", color: on?"#fff":"#4a4a5c" }}>
              {f}
              {on && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:"#e10600" }} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {list.map((ev, i) => {
          const going = rsvpdEvents.includes(ev.id);
          const pct = Math.round((ev.rsvp / ev.max) * 100);
          const filling = pct >= 75;
          return (
            <article key={ev.id} className="relative" style={{ borderBottom: i<list.length-1?"1px solid #1e1e2a":"none" }}>
              <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: going?"#e10600":"#2c2c3a" }} />

              {/* Banner */}
              <div className="h-[60px] relative overflow-hidden" style={{ background:"#1e1e2a" }}>
                <Image src={ev.banner} alt={ev.title} fill className="object-cover" style={{ opacity:0.55 }} />
              </div>

              <div className="pl-5 pr-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{TYPE_LABEL[ev.type]}</span>
                    {ev.private && <span style={{ fontSize:"10px", fontWeight:700, color:"#a855f7", textTransform:"uppercase", letterSpacing:"0.08em" }}>PRIVATE</span>}
                    {filling && <span className="flex items-center gap-0.5" style={{ fontSize:"10px", fontWeight:700, color:"#e10600" }}><Flame size={9}/> FILLING</span>}
                  </div>
                  <span style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c" }}>{fmt(ev.date)}</span>
                </div>

                <h2 className="text-[16px] font-black text-white tracking-tight leading-tight mb-1">{ev.title}</h2>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color:"#8888a0" }}>{ev.description}</p>

                <div className="flex flex-col gap-1.5 mb-3">
                  <span className="flex items-center gap-2 text-[11px]" style={{ color:"#4a4a5c" }}><CalendarDays size={11}/> {ev.time}</span>
                  <span className="flex items-center gap-2 text-[11px]" style={{ color:"#4a4a5c" }}><MapPin size={11}/> {ev.location}</span>
                  <span className="flex items-center gap-2 text-[11px]" style={{ color:"#4a4a5c" }}>
                    <Users size={11}/>
                    <span className="font-bold" style={{ color: filling?"#e10600":"#8888a0" }}>{ev.rsvp}</span> / {ev.max} going
                  </span>
                </div>

                <div className="mb-3">
                  <div className="h-[3px] overflow-hidden" style={{ background:"#1e1e2a" }}>
                    <div className="h-full" style={{ width:`${pct}%`, background: filling?"#e10600":"#2c2c3a" }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ev.tags.slice(0,4).map(t => (
                    <span key={t} style={{ fontSize:"10px", color:"#383848", border:"1px solid #1e1e2a", borderRadius:"3px", padding:"2px 8px" }}>#{t}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggleRsvp(ev.id)}
                    className="flex-1 py-2.5 rounded-sm text-[11px] font-black tracking-[0.1em] uppercase"
                    style={{ background: going?"transparent":"#e10600", color: going?"#e10600":"#fff", border: going?"1px solid #e10600":"1px solid transparent" }}>
                    {going ? "✓  Attending" : "RSVP"}
                  </button>
                  <button onClick={() => router.push(`/events/${ev.id}`)}
                    className="px-3.5 py-2.5 rounded-sm flex items-center justify-center"
                    style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
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
