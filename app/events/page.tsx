"use client";
import { useState } from "react";
import { events } from "@/lib/mockData";
import { CalendarDays, MapPin, Users, Plus, ChevronRight } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  meetup: "MEET", competition: "COMPETITION", cruise: "CRUISE", show: "SHOW", rally: "RALLY",
};
const FILTERS = ["ALL", "MEET", "CRUISE", "SHOW", "COMPETITION", "RALLY"];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
}

export default function EventsPage() {
  const [filter, setFilter] = useState("ALL");
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());

  const list = filter === "ALL" ? events : events.filter(e => TYPE_LABEL[e.type] === filter);
  const toggle = (id: string) =>
    setRsvpd(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>

      {/* Page header */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="label mb-1">Miami, FL</p>
            <h1 className="text-[22px] font-black text-white tracking-tight">Events</h1>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[11px] font-black tracking-[0.08em] uppercase text-white"
            style={{ background: "#e10600" }}>
            <Plus size={12} strokeWidth={3} /> Host
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-0 no-scroll overflow-x-auto" style={{ borderBottom: "1px solid #2c2c3a" }}>
        {FILTERS.map(f => {
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-3 text-[10px] font-black tracking-[0.12em] transition-all relative whitespace-nowrap"
              style={{ color: on ? "#ffffff" : "#4a4a5c" }}>
              {f}
              {on && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#e10600" }} />}
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div className="flex flex-col" style={{ borderBottom: "1px solid #2c2c3a" }}>
        {list.map((ev, i) => {
          const going = rsvpd.has(ev.id);
          const count = ev.rsvp + (going ? 1 : 0);
          const pct = Math.round((count / ev.max) * 100);
          const filling = pct >= 75;

          return (
            <article key={ev.id} className="relative"
              style={{ borderBottom: i < list.length - 1 ? "1px solid #1e1e2a" : "none" }}>
              {/* Left accent bar */}
              <div className="absolute left-0 top-4 bottom-4 w-[2px]"
                style={{ background: going ? "#e10600" : "#2c2c3a" }} />

              <div className="pl-5 pr-4 py-5">
                {/* Type + date row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="label">{TYPE_LABEL[ev.type]}</span>
                  <span className="text-[10px] font-bold tracking-wide" style={{ color: "#4a4a5c" }}>{fmt(ev.date)}</span>
                </div>

                <h2 className="text-[16px] font-black text-white tracking-tight leading-tight mb-1">{ev.title}</h2>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#6666780" }}>
                  <span style={{ color: "#8888a0" }}>{ev.description}</span>
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#4a4a5c" }}>
                    <CalendarDays size={11} /> {ev.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#4a4a5c" }}>
                    <MapPin size={11} /> {ev.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#4a4a5c" }}>
                    <Users size={11} />
                    <span className="font-bold" style={{ color: filling ? "#e10600" : "#8888a0" }}>{count}</span>
                    <span>/ {ev.max}</span>
                    {filling && <span className="font-bold" style={{ color: "#e10600" }}>· FILLING</span>}
                  </span>
                </div>

                {/* Attendance bar */}
                <div className="mb-4">
                  <div className="h-[3px] rounded-none overflow-hidden" style={{ background: "#1e1e2a" }}>
                    <div className="h-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: filling ? "#e10600" : "#2c2c3a" }} />
                  </div>
                </div>

                {/* RSVP */}
                <button onClick={() => toggle(ev.id)}
                  className="w-full py-2.5 text-[11px] font-black tracking-[0.1em] uppercase transition-all rounded-sm"
                  style={{
                    background: going ? "transparent" : "#e10600",
                    color: going ? "#e10600" : "#ffffff",
                    border: going ? "1px solid #e10600" : "1px solid transparent",
                  }}>
                  {going ? "✓  Attending" : "RSVP"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
