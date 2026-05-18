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
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Header */}
      <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 style={{ fontSize:"22px", fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>Events</h1>
          </div>
          <button onClick={() => router.push("/events/new")} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
            <Plus size={12} strokeWidth={3} /> Host Event
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:"8px", padding:"12px 16px", borderBottom:"1px solid #2c2c3a", overflowX:"auto" }}>
        {FILTERS.map(f => {
          const on = filter===f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"6px 14px", borderRadius:"3px", fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background: on ? "#e10600" : "#1e1e2a", color: on ? "#fff" : "#4a4a5c", border:`1px solid ${on?"#e10600":"#2c2c3a"}`, flexShrink:0, cursor:"pointer" }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div style={{ borderBottom:"1px solid #2c2c3a" }}>
        {list.map((ev, i) => {
          const going = rsvpdEvents.includes(ev.id);
          const pct = Math.round((ev.rsvp / ev.max) * 100);
          const filling = pct >= 75;
          return (
            <article key={ev.id}
              onClick={() => router.push(`/events/${ev.id}`)}
              style={{ borderBottom: i<list.length-1?"1px solid #1e1e2a":"none", position:"relative", cursor:"pointer" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"2px", background: going?"#e10600":"#2c2c3a" }} />

              {/* Banner image */}
              <div style={{ height:"120px", position:"relative", overflow:"hidden", background:"#1e1e2a" }}>
                <Image src={ev.banner} alt={ev.title} fill style={{ objectFit:"cover", opacity:0.7 }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(21,21,30,0.9) 0%, transparent 60%)" }} />
                <div style={{ position:"absolute", bottom:"10px", left:"18px", right:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", color:"#e10600", textTransform:"uppercase" }}>{TYPE_LABEL[ev.type]}{ev.private ? " · PRIVATE" : ""}</span>
                  <span style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{fmt(ev.date)}</span>
                </div>
              </div>

              <div style={{ padding:"14px 16px 16px 18px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"6px" }}>
                  <h2 style={{ fontSize:"17px", fontWeight:900, color:"#fff", lineHeight:1.2, letterSpacing:"-0.01em" }}>{ev.title}</h2>
                  {filling && <span style={{ display:"flex", alignItems:"center", gap:"3px", fontSize:"10px", fontWeight:700, color:"#e10600", flexShrink:0 }}><Flame size={10}/> FILLING</span>}
                </div>
                <p style={{ fontSize:"12px", color:"#8888a0", lineHeight:1.5, marginBottom:"12px" }}>{ev.description}</p>

                <div style={{ display:"flex", flexDirection:"column", gap:"5px", marginBottom:"12px" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", color:"#4a4a5c" }}><CalendarDays size={11} color="#4a4a5c"/> {ev.time} · {fmt(ev.date)}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", color:"#4a4a5c" }}><MapPin size={11} color="#4a4a5c"/> {ev.location}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"11px", color: filling ? "#e10600" : "#4a4a5c" }}>
                    <Users size={11} color={filling ? "#e10600" : "#4a4a5c"}/>
                    <span style={{ fontWeight:700, color: filling ? "#e10600" : "#fff" }}>{ev.rsvp}</span> / {ev.max} going
                  </span>
                </div>

                <div style={{ height:"3px", background:"#1e1e2a", borderRadius:"2px", overflow:"hidden", marginBottom:"12px" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background: filling ? "#e10600" : "#2c2c3a" }} />
                </div>

                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"12px" }}>
                  {ev.tags.slice(0,4).map(t => <span key={t} style={{ fontSize:"10px", color:"#383848", border:"1px solid #1e1e2a", borderRadius:"3px", padding:"2px 8px" }}>#{t}</span>)}
                </div>

                <div style={{ display:"flex", gap:"8px" }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggleRsvp(ev.id); }}
                    style={{ flex:1, padding:"10px 0", borderRadius:"3px", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", background: going ? "transparent" : "#e10600", color: going ? "#e10600" : "#fff", border: going ? "1px solid #e10600" : "1px solid transparent", cursor:"pointer" }}>
                    {going ? "✓  Attending" : "RSVP"}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); router.push(`/events/${ev.id}`); }}
                    style={{ padding:"10px 14px", borderRadius:"3px", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer", display:"flex", alignItems:"center" }}>
                    <ChevronRight size={15} color="#8888a0" />
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
