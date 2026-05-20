"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, CalendarDays, MapPin, Users, ChevronRight, Flame, Flag } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const TYPE_LABEL: Record<string,string> = { meetup:"MEET", competition:"COMPETITION", cruise:"CRUISE", show:"SHOW", rally:"RALLY" };
const TYPE_FILTERS = ["ALL","MEET","CRUISE","SHOW","COMPETITION","RALLY"];
const DATE_FILTERS = ["UPCOMING","TODAY","THIS WEEK","THIS MONTH"];

function fmt(d: string) { return new Date(d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase(); }

function inDateRange(dateStr: string, range: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "TODAY") return d >= today && d < new Date(today.getTime() + 86400000);
  if (range === "THIS WEEK") { const end = new Date(today.getTime() + 7 * 86400000); return d >= today && d < end; }
  if (range === "THIS MONTH") { const end = new Date(today.getFullYear(), today.getMonth()+1, 1); return d >= today && d < end; }
  return d >= today;
}

export default function EventsPage() {
  const { events, rallies, rsvpdEvents, toggleRsvp } = useStore();
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("UPCOMING");
  const [showCreate, setShowCreate] = useState(false);

  type Item = { kind: "event"; id: string; date: string } | { kind: "rally"; id: string; date: string };

  const allItems: Item[] = [
    ...events.map(e => ({ kind: "event" as const, id: e.id, date: e.date })),
    ...rallies.map(r => ({ kind: "rally" as const, id: r.id, date: r.date })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = allItems.filter(item => {
    if (!inDateRange(item.date, dateFilter)) return false;
    if (typeFilter === "ALL") return true;
    if (typeFilter === "RALLY") return item.kind === "rally";
    if (item.kind === "rally") return false;
    const ev = events.find(e => e.id === item.id);
    return ev && TYPE_LABEL[ev.type] === typeFilter;
  });

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }} onClick={() => showCreate && setShowCreate(false)}>
      {/* Header */}
      <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid #2c2c3a" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Miami, FL</p>
            <h1 style={{ fontSize:"22px", fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>Events</h1>
          </div>
          <div style={{ position:"relative" }}>
            <button onClick={e => { e.stopPropagation(); setShowCreate(v => !v); }}
              style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"3px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
              <Plus size={12} strokeWidth={3} /> Create
            </button>
            {showCreate && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"4px", minWidth:"150px", zIndex:100, overflow:"hidden" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowCreate(false); router.push("/events/new"); }}
                  style={{ width:"100%", padding:"12px 16px", textAlign:"left", background:"none", border:"none", color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", borderBottom:"1px solid #2c2c3a" }}>
                  <CalendarDays size={13} color="#e10600" /> Host Event
                </button>
                <button onClick={() => { setShowCreate(false); router.push("/rally/new"); }}
                  style={{ width:"100%", padding:"12px 16px", textAlign:"left", background:"none", border:"none", color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}>
                  <Flag size={13} color="#e10600" /> Plan Rally
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date filter */}
      <div style={{ display:"flex", gap:"6px", padding:"10px 16px 0", overflowX:"auto" }}>
        {DATE_FILTERS.map(f => {
          const on = dateFilter === f;
          return (
            <button key={f} onClick={() => setDateFilter(f)}
              style={{ padding:"5px 12px", borderRadius:"3px", fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background: on ? "#fff" : "#1e1e2a", color: on ? "#15151e" : "#4a4a5c", border:`1px solid ${on?"#fff":"#2c2c3a"}`, flexShrink:0, cursor:"pointer" }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div style={{ display:"flex", gap:"8px", padding:"8px 16px 12px", borderBottom:"1px solid #2c2c3a", overflowX:"auto" }}>
        {TYPE_FILTERS.map(f => {
          const on = typeFilter === f;
          return (
            <button key={f} onClick={() => setTypeFilter(f)}
              style={{ padding:"6px 14px", borderRadius:"3px", fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background: on ? "#e10600" : "#1e1e2a", color: on ? "#fff" : "#4a4a5c", border:`1px solid ${on?"#e10600":"#2c2c3a"}`, flexShrink:0, cursor:"pointer" }}>
              {f}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding:"48px 16px", textAlign:"center" }}>
          <p style={{ fontSize:"13px", color:"#4a4a5c" }}>No events match this filter</p>
        </div>
      )}

      <div>
        {filtered.map((item, i) => {
          if (item.kind === "rally") {
            const rally = rallies.find(r => r.id === item.id)!;
            return (
              <article key={item.id} onClick={() => router.push(`/rally/${rally.id}`)}
                style={{ borderBottom:"1px solid #1e1e2a", cursor:"pointer", position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"2px", background: rally.status==="active"?"#e10600":"#2c2c3a" }} />
                <div style={{ height:"80px", position:"relative", overflow:"hidden", background:"#1e1e2a" }}>
                  <Image src={rally.banner} alt={rally.name} fill style={{ objectFit:"cover", opacity:0.5 }} unoptimized={rally.banner.startsWith("data:")} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(21,21,30,0.9) 0%,transparent 60%)" }} />
                  <div style={{ position:"absolute", bottom:"8px", left:"18px", right:"12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", color:"#e10600", textTransform:"uppercase" }}>RALLY{rally.fundraiser?" · FUNDRAISER":""}</span>
                    <span style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{fmt(rally.date)}</span>
                  </div>
                </div>
                <div style={{ padding:"12px 16px 14px 18px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"4px" }}>
                    <h2 style={{ fontSize:"16px", fontWeight:900, color:"#fff", lineHeight:1.2 }}>{rally.name}</h2>
                    <ChevronRight size={15} color="#4a4a5c" style={{ flexShrink:0, marginTop:2 }} />
                  </div>
                  <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"#4a4a5c" }}><MapPin size={10}/>{rally.startLocation} → {rally.endLocation}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"#4a4a5c" }}><Users size={10}/>{rally.members.length}/{rally.maxCars} cars</span>
                  </div>
                </div>
              </article>
            );
          }

          const ev = events.find(e => e.id === item.id)!;
          const going = rsvpdEvents.includes(ev.id);
          const pct = Math.round((ev.rsvp / ev.max) * 100);
          const filling = pct >= 75;
          return (
            <article key={item.id} onClick={() => router.push(`/events/${ev.id}`)}
              style={{ borderBottom:"1px solid #1e1e2a", position:"relative", cursor:"pointer" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"2px", background: going?"#e10600":"#2c2c3a" }} />
              <div style={{ height:"110px", position:"relative", overflow:"hidden", background:"#1e1e2a" }}>
                <Image src={ev.banner} alt={ev.title} fill style={{ objectFit:"cover", opacity:0.7 }} unoptimized={ev.banner.startsWith("data:")} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(21,21,30,0.9) 0%, transparent 60%)" }} />
                <div style={{ position:"absolute", bottom:"10px", left:"18px", right:"16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", color:"#e10600", textTransform:"uppercase" }}>{TYPE_LABEL[ev.type]}{ev.private ? " · PRIVATE" : ""}</span>
                  <span style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{fmt(ev.date)}</span>
                </div>
              </div>
              <div style={{ padding:"12px 16px 14px 18px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"4px" }}>
                  <h2 style={{ fontSize:"16px", fontWeight:900, color:"#fff", lineHeight:1.2 }}>{ev.title}</h2>
                  {filling && <span style={{ display:"flex", alignItems:"center", gap:"3px", fontSize:"10px", fontWeight:700, color:"#e10600", flexShrink:0 }}><Flame size={10}/> FILLING</span>}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", marginBottom:"10px" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"#4a4a5c" }}><CalendarDays size={10}/>{ev.time} · {fmt(ev.date)}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"#4a4a5c" }}><MapPin size={10}/>{ev.location}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color: filling?"#e10600":"#4a4a5c" }}><Users size={10}/><b style={{ color: filling?"#e10600":"#fff" }}>{ev.rsvp}</b>/{ev.max} going</span>
                </div>
                <div style={{ height:"3px", background:"#1e1e2a", borderRadius:"2px", overflow:"hidden", marginBottom:"10px" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background: filling?"#e10600":"#2c2c3a" }} />
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={e => { e.stopPropagation(); toggleRsvp(ev.id); }}
                    style={{ flex:1, padding:"9px 0", borderRadius:"3px", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", background: going?"transparent":"#e10600", color: going?"#e10600":"#fff", border: going?"1px solid #e10600":"1px solid transparent", cursor:"pointer" }}>
                    {going ? "✓  Attending" : "RSVP"}
                  </button>
                  <button onClick={e => { e.stopPropagation(); router.push(`/events/${ev.id}`); }}
                    style={{ padding:"9px 14px", borderRadius:"3px", background:"#1e1e2a", border:"1px solid #2c2c3a", cursor:"pointer", display:"flex", alignItems:"center" }}>
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
