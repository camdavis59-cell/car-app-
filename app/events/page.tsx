"use client";
import { useState } from "react";
import { events } from "@/lib/mockData";
import { CalendarDays, MapPin, Users, ChevronRight, Filter, Plus } from "lucide-react";

const typeColors: Record<string, string> = {
  meetup: "#3b82f6",
  competition: "#f59e0b",
  cruise: "#10b981",
  show: "#8b5cf6",
  rally: "#e63946",
};

const typeLabels: Record<string, string> = {
  meetup: "Meet", competition: "Competition", cruise: "Cruise", show: "Car Show", rally: "Rally",
};

const filters = ["All", "Meet", "Cruise", "Car Show", "Competition", "Rally"];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());

  const filtered = activeFilter === "All"
    ? events
    : events.filter(e => typeLabels[e.type] === activeFilter);

  const toggleRsvp = (id: string) => {
    setRsvpd(prev => {
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
          <h1 className="text-xl font-bold text-white">Events</h1>
          <button className="flex items-center gap-1.5 bg-[#e63946] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Plus size={13} /> Host Event
          </button>
        </div>
        <p className="text-[#888] text-sm">Miami, FL · Upcoming shows & meets</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-3">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: activeFilter === f ? "#e63946" : "#141414",
              borderColor: activeFilter === f ? "#e63946" : "#2a2a2a",
              color: activeFilter === f ? "#fff" : "#888",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="px-4 flex flex-col gap-3">
        {filtered.map(event => {
          const attending = rsvpd.has(event.id);
          const rsvpCount = event.rsvp + (attending ? 1 : 0);
          const pct = Math.round((rsvpCount / event.max) * 100);
          const color = typeColors[event.type] || "#888";

          return (
            <div key={event.id} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              {/* Color stripe */}
              <div className="h-1" style={{ background: color }} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
                        {typeLabels[event.type]}
                      </span>
                      {event.tags.includes("sponsored") && (
                        <span className="text-[10px] text-[#888] border border-[#2a2a2a] px-2 py-0.5 rounded-full">Sponsored</span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base leading-tight">{event.title}</h3>
                  </div>
                </div>

                <p className="text-[#888] text-xs mb-3 leading-relaxed">{event.description}</p>

                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <CalendarDays size={12} className="text-[#555]" />
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <MapPin size={12} className="text-[#555]" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <Users size={12} className="text-[#555]" />
                    {rsvpCount} / {event.max} going · by {event.organizer}
                  </div>
                </div>

                {/* RSVP progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#555]">Attendance</span>
                    <span className="text-[10px] font-semibold" style={{ color: pct > 80 ? "#e63946" : "#888" }}>
                      {pct}% full{pct > 80 ? " · Almost full!" : ""}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? "#e63946" : color }} />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {event.tags.filter(t => t !== "sponsored").map(tag => (
                    <span key={tag} className="text-[10px] text-[#555] border border-[#2a2a2a] px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>

                <button
                  onClick={() => toggleRsvp(event.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: attending ? `${color}22` : color,
                    color: attending ? color : "#fff",
                    border: `1px solid ${color}`,
                  }}
                >
                  {attending ? "✓ You're Going" : "RSVP"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
