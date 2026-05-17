"use client";
import { useState } from "react";
import { events } from "@/lib/mockData";
import { CalendarDays, MapPin, Users, Plus, ChevronRight, Flame } from "lucide-react";

const TYPE_COLOR: Record<string, string> = {
  meetup: "#3b82f6", competition: "#f59e0b", cruise: "#22c55e", show: "#a855f7", rally: "#e63946",
};
const TYPE_LABEL: Record<string, string> = {
  meetup: "Meet", competition: "Competition", cruise: "Cruise", show: "Car Show", rally: "Rally",
};
const TYPE_EMOJI: Record<string, string> = {
  meetup: "🚗", competition: "🏆", cruise: "🛣️", show: "🎪", rally: "🏁",
};

const ALL_FILTERS = ["All", "Meet", "Cruise", "Car Show", "Competition", "Rally"];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());

  const list = filter === "All" ? events : events.filter(e => TYPE_LABEL[e.type] === filter);

  const toggle = (id: string) =>
    setRsvpd(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="pt-[53px] pb-[72px] min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="px-4 pt-5 pb-1">
        <div className="flex items-center justify-between mb-0.5">
          <div>
            <h1 className="text-[22px] font-black text-white tracking-tight">Events</h1>
            <p className="text-[#555] text-[12px] font-medium">Miami, FL · {events.length} upcoming</p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#e63946] text-white text-[12px] font-bold px-3.5 py-2 rounded-full">
            <Plus size={13} strokeWidth={2.5} /> Host Event
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {ALL_FILTERS.map(f => {
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all"
              style={{
                background: on ? "#e63946" : "#111",
                borderColor: on ? "#e63946" : "#242424",
                color: on ? "#fff" : "#555",
              }}>
              {f}
            </button>
          );
        })}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {list.map(ev => {
          const going = rsvpd.has(ev.id);
          const count = ev.rsvp + (going ? 1 : 0);
          const pct = Math.round((count / ev.max) * 100);
          const hot = pct >= 80;
          const color = TYPE_COLOR[ev.type];

          return (
            <article key={ev.id} className="bg-[#111] border border-[#1c1c1c] rounded-2xl overflow-hidden card-hover">
              {/* Top accent line */}
              <div className="h-[3px]" style={{ background: color }} />

              <div className="p-4">
                {/* Row 1: type badge + hot tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${color}1a`, color }}>
                    {TYPE_EMOJI[ev.type]} {TYPE_LABEL[ev.type]}
                  </span>
                  {hot && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#e63946] bg-[#e6394618] px-2 py-0.5 rounded-full">
                      <Flame size={9} /> Filling up
                    </span>
                  )}
                  {ev.tags.includes("sponsored") && (
                    <span className="text-[10px] text-[#444] border border-[#222] px-2 py-0.5 rounded-full">Sponsored</span>
                  )}
                </div>

                <h2 className="text-[16px] font-black text-white leading-tight mb-1">{ev.title}</h2>
                <p className="text-[#555] text-[12px] leading-relaxed mb-3">{ev.description}</p>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <CalendarDays size={12} className="text-[#333]" />
                    <span>{formatDate(ev.date)} · {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <MapPin size={12} className="text-[#333]" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#555]">
                    <Users size={12} className="text-[#333]" />
                    <span><span className="text-[#888] font-semibold">{count}</span> / {ev.max} going · by <span className="text-[#888]">{ev.organizer}</span></span>
                  </div>
                </div>

                {/* Attendance bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-[#333] font-medium uppercase tracking-wider">Attendance</span>
                    <span className="text-[10px] font-bold" style={{ color: hot ? "#e63946" : "#444" }}>{pct}%</span>
                  </div>
                  <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: hot ? "#e63946" : color }} />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {ev.tags.filter(t => t !== "sponsored").map(t => (
                    <span key={t} className="text-[10px] text-[#383838] border border-[#1e1e1e] px-2 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>

                {/* RSVP button */}
                <button onClick={() => toggle(ev.id)}
                  className="w-full py-3 rounded-xl text-[13px] font-black transition-all"
                  style={{
                    background: going ? `${color}18` : color,
                    color: going ? color : (ev.type === "competition" ? "#000" : "#fff"),
                    border: `1.5px solid ${going ? color : "transparent"}`,
                  }}>
                  {going ? `✓  You're Going` : "RSVP  →"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
