"use client";
import { useParams, useRouter } from "next/navigation";
import { events } from "@/lib/mockData";
import { ArrowLeft, CalendarDays, MapPin, Users, ChevronRight, MessageSquare } from "lucide-react";
import { useState } from "react";

const TYPE_LABEL: Record<string, string> = {
  meetup: "MEET", competition: "COMPETITION", cruise: "CRUISE", show: "SHOW", rally: "RALLY",
};

const MOCK_CHAT = [
  { user: "@miamiturbo",   msg: "Who's bringing the GT-R? 👀",                        ago: "1h"  },
  { user: "@305builds",    msg: "I'll be there with the Ferrari. See you all at 7.",  ago: "45m" },
  { user: "@jdmmiami",     msg: "Coming from Hialeah, parking situation?",            ago: "30m" },
  { user: "@brickellgt",   msg: "North side lot is usually wide open.",               ago: "20m" },
  { user: "@carlosriv59",  msg: "See you all there. Supra is freshly detailed.",      ago: "5m"  },
];

const MOCK_ATTENDEES = [
  { handle: "@miamiturbo",   car: "2020 GT-R" },
  { handle: "@305builds",    car: "Ferrari 488" },
  { handle: "@carlosriv59",  car: "1994 Supra" },
  { handle: "@brickellgt",   car: "McLaren 720S" },
  { handle: "@southbeachv8", car: "Camaro SS" },
];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rsvpd, setRsvpd] = useState(false);

  const ev = events.find(e => e.id === id);
  if (!ev) return (
    <div className="pt-14 pb-[58px] min-h-screen flex items-center justify-center" style={{ background: "#15151e" }}>
      <p className="label">Event not found</p>
    </div>
  );

  const count = ev.rsvp + (rsvpd ? 1 : 0);
  const pct = Math.round((count / ev.max) * 100);
  const filling = pct >= 75;

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>

      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <button onClick={() => router.back()}
          className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
          style={{ background: "#1e1e2a", border: "1px solid #2c2c3a" }}>
          <ArrowLeft size={15} style={{ color: "#ffffff" }} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="label block">{TYPE_LABEL[ev.type]}</span>
          <h1 className="text-[15px] font-black text-white tracking-tight truncate">{ev.title}</h1>
        </div>
      </div>

      {/* Event hero block */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <h2 className="text-[22px] font-black text-white tracking-tight leading-tight mb-1">{ev.title}</h2>
        <p className="text-[13px] leading-relaxed" style={{ color: "#8888a0" }}>{ev.description}</p>

        {/* Meta */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[12px]" style={{ color: "#8888a0" }}>
            <CalendarDays size={13} style={{ color: "#4a4a5c" }} />
            <span>{fmt(ev.date)} · {ev.time}</span>
          </div>
          <div className="flex items-center gap-3 text-[12px]" style={{ color: "#8888a0" }}>
            <MapPin size={13} style={{ color: "#4a4a5c" }} />
            <span>{ev.location}</span>
          </div>
          <div className="flex items-center gap-3 text-[12px]" style={{ color: "#8888a0" }}>
            <Users size={13} style={{ color: "#4a4a5c" }} />
            <span>
              <span className="font-bold" style={{ color: filling ? "#e10600" : "#ffffff" }}>{count}</span>
              {" "}/ {ev.max} going
              {filling && <span className="font-bold ml-1" style={{ color: "#e10600" }}>· FILLING FAST</span>}
            </span>
          </div>
        </div>

        {/* Attendance bar */}
        <div className="mt-4 mb-1">
          <div className="h-[3px] overflow-hidden" style={{ background: "#1e1e2a" }}>
            <div className="h-full transition-all duration-500"
              style={{ width: `${pct}%`, background: filling ? "#e10600" : "#2c2c3a" }} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {ev.tags.map(t => (
            <span key={t} className="text-[10px] font-semibold px-2.5 py-1 rounded-sm"
              style={{ background: "#1e1e2a", border: "1px solid #2c2c3a", color: "#8888a0" }}>
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Organiser */}
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: "#e10600" }}>
            {ev.organizer.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="label block">ORGANISER</span>
            <span className="text-[13px] font-bold text-white">@{ev.organizer}</span>
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-sm text-[10px] font-black tracking-wide uppercase"
          style={{ background: "#1e1e2a", border: "1px solid #2c2c3a", color: "#8888a0" }}>
          Follow
        </button>
      </div>

      {/* Attending */}
      <div className="px-4 pt-4 pb-1" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="label">ATTENDING ({count})</span>
          <button className="label" style={{ color: "#e10600" }}>SEE ALL</button>
        </div>
        <div className="flex flex-col gap-0" style={{ border: "1px solid #2c2c3a", borderRadius: "3px", overflow: "hidden" }}>
          {MOCK_ATTENDEES.map((a, i) => (
            <div key={a.handle} className="flex items-center justify-between px-3 py-2.5"
              style={{ borderTop: i > 0 ? "1px solid #1e1e2a" : "none" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-black"
                  style={{ background: "#252532", color: "#8888a0" }}>
                  {a.handle.slice(1, 3).toUpperCase()}
                </div>
                <span className="text-[12px] font-semibold text-white">{a.handle}</span>
              </div>
              <span className="text-[11px]" style={{ color: "#4a4a5c" }}>{a.car}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] py-3 text-center" style={{ color: "#2c2c3a" }}>
          + {count - MOCK_ATTENDEES.length} more registered
        </p>
      </div>

      {/* Event chat */}
      <div className="px-4 pt-4 pb-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="label flex items-center gap-1.5">
            <MessageSquare size={11} /> EVENT CHAT
          </span>
          <button className="label" style={{ color: "#e10600" }}>OPEN CHAT</button>
        </div>
        <div className="flex flex-col gap-0" style={{ border: "1px solid #2c2c3a", borderRadius: "3px", overflow: "hidden" }}>
          {MOCK_CHAT.slice(-3).map((m, i) => (
            <div key={i} className="px-3 py-2.5 flex items-start gap-2"
              style={{ borderTop: i > 0 ? "1px solid #1e1e2a" : "none" }}>
              <span className="text-[10px] font-black shrink-0 mt-0.5" style={{ color: "#e10600" }}>{m.user}</span>
              <span className="text-[12px] flex-1" style={{ color: "#8888a0" }}>{m.msg}</span>
              <span className="text-[9px] shrink-0 mt-0.5" style={{ color: "#2c2c3a" }}>{m.ago}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP sticky footer */}
      <div className="px-4 pt-4">
        <button onClick={() => setRsvpd(p => !p)}
          className="w-full py-3.5 rounded-sm text-[12px] font-black tracking-[0.1em] uppercase transition-all"
          style={{
            background: rsvpd ? "transparent" : "#e10600",
            color: rsvpd ? "#e10600" : "#ffffff",
            border: rsvpd ? "1.5px solid #e10600" : "1.5px solid transparent",
          }}>
          {rsvpd ? "✓  You're Attending — Cancel RSVP" : "RSVP TO THIS EVENT"}
        </button>
      </div>
    </div>
  );
}
