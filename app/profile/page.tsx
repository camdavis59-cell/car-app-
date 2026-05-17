"use client";
import { useState } from "react";
import { userProfile } from "@/lib/mockData";
import { Camera, Plus, Settings, ChevronRight } from "lucide-react";

const RANKS = [
  { name: "Daily Driver",   min: 0,    next: 500  },
  { name: "Street Cred",    min: 500,  next: 1500 },
  { name: "Gear Head",      min: 1500, next: 5000 },
  { name: "Street Legend",  min: 5000, next: null },
];

function getRank(pts: number) {
  return [...RANKS].reverse().find(r => pts >= r.min) ?? RANKS[0];
}

const ACTIVITY = [
  { cat: "EVENT",    text: "RSVPd — Wynwood Car Meet",                  time: "2h ago",      pts: 10  },
  { cat: "PHOTO",    text: "3 photos uploaded at Brickell City Centre", time: "Yesterday",   pts: 150 },
  { cat: "SHOP",     text: "Checked in — Miami Motorsport",             time: "2 days ago",  pts: 25  },
  { cat: "CLUB",     text: "Joined JDMiami",                            time: "1 week ago",  pts: 50  },
  { cat: "EVENT",    text: "Attended JDM Only — Hialeah",               time: "2 weeks ago", pts: 100 },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<"garage" | "activity">("garage");
  const p = userProfile;
  const rank = getRank(p.points);
  const nextRank = RANKS[RANKS.findIndex(r => r.name === rank.name) + 1];
  const pct = nextRank ? Math.round(((p.points - rank.min) / (nextRank.min - rank.min)) * 100) : 100;

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>

      {/* Profile block */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-sm flex items-center justify-center text-[17px] font-black text-white flex-shrink-0"
              style={{ background: "#e10600" }}>
              CR
            </div>
            <div>
              <h1 className="text-[17px] font-black text-white tracking-tight">{p.name}</h1>
              <p className="text-[12px]" style={{ color: "#4a4a5c" }}>{p.handle}</p>
              <p className="text-[11px]" style={{ color: "#4a4a5c" }}>{p.location}</p>
            </div>
          </div>
          <button className="p-2 rounded-sm" style={{ background: "#1e1e2a", border: "1px solid #2c2c3a" }}>
            <Settings size={14} style={{ color: "#4a4a5c" }} />
          </button>
        </div>

        {/* Stats row — like constructor standings */}
        <div className="grid grid-cols-4 gap-0 mb-4" style={{ border: "1px solid #2c2c3a", borderRadius: "3px", overflow: "hidden" }}>
          {[
            { val: p.followers,      label: "FOLLOWERS" },
            { val: p.following,      label: "FOLLOWING" },
            { val: p.eventsAttended, label: "EVENTS"    },
            { val: p.photosUploaded, label: "PHOTOS"    },
          ].map((s, i) => (
            <div key={s.label} className="flex flex-col items-center py-3"
              style={{ borderLeft: i > 0 ? "1px solid #2c2c3a" : "none" }}>
              <span className="text-[17px] font-black text-white tabular-nums">{s.val}</span>
              <span className="label mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Points / Championship block */}
        <div className="p-4" style={{ background: "#1e1e2a", border: "1px solid #2c2c3a", borderRadius: "3px" }}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="label mb-1">Current Rank</p>
              <p className="text-[14px] font-black text-white tracking-wide uppercase">{rank.name}</p>
            </div>
            <div className="text-right">
              <p className="label mb-0.5">Points</p>
              <p className="text-[28px] font-black text-white tabular-nums leading-none">{p.points.toLocaleString()}</p>
            </div>
          </div>

          {nextRank && (
            <>
              <div className="h-[3px] rounded-none overflow-hidden mb-2" style={{ background: "#252532" }}>
                <div className="h-full transition-all" style={{ width: `${pct}%`, background: "#e10600" }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "#4a4a5c" }}>
                  {(nextRank.min - p.points).toLocaleString()} pts to {nextRank.name}
                </span>
                <span className="label">{pct}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid #2c2c3a" }}>
        {(["garage", "activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 text-[10px] font-black tracking-[0.12em] uppercase relative"
            style={{ color: tab === t ? "#ffffff" : "#4a4a5c" }}>
            {t === "garage" ? "MY GARAGE" : "ACTIVITY"}
            {tab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#e10600" }} />}
          </button>
        ))}
      </div>

      {/* Garage tab */}
      {tab === "garage" && (
        <div className="flex flex-col" style={{ borderBottom: "1px solid #2c2c3a" }}>
          {p.garage.map((car, i) => (
            <div key={car.id} className="px-4 py-5 relative"
              style={{ borderBottom: "1px solid #1e1e2a" }}>
              <div className="absolute left-0 top-4 bottom-4 w-[2px]" style={{ background: "#e10600" }} />

              {/* Car "photo" placeholder */}
              <div className="h-32 rounded-sm mb-4 flex items-center justify-center relative overflow-hidden"
                style={{ background: "#1e1e2a", border: "1px solid #2c2c3a" }}>
                <span className="text-[48px] opacity-20">🚗</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase rounded-sm"
                    style={{ background: "rgba(21,21,30,0.9)", border: "1px solid #2c2c3a", color: "#4a4a5c" }}>
                    <Camera size={11} /> Add Photo
                  </button>
                </div>
                <span className="absolute bottom-2 right-3 text-[10px] font-bold"
                  style={{ color: "#4a4a5c" }}>{car.photos} PHOTOS</span>
              </div>

              <p className="label mb-1">{car.year} · {car.color}</p>
              <h3 className="text-[16px] font-black text-white tracking-tight mb-3">{car.make} {car.model}</h3>

              <p className="label mb-2">Modifications</p>
              <div className="flex flex-wrap gap-1.5">
                {car.mods.map(m => (
                  <span key={m} className="text-[10px] font-semibold px-2.5 py-1 rounded-sm"
                    style={{ background: "#1e1e2a", border: "1px solid #2c2c3a", color: "#8888a0" }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Add car */}
          <button className="w-full py-5 flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.1em] uppercase transition-colors"
            style={{ color: "#2c2c3a", borderBottom: "1px solid #1e1e2a" }}>
            <Plus size={16} /> Add Car to Garage
          </button>
        </div>
      )}

      {/* Activity tab */}
      {tab === "activity" && (
        <div className="flex flex-col" style={{ borderBottom: "1px solid #2c2c3a" }}>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4"
              style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid #1e1e2a" : "none" }}>
              <span className="label w-[68px] shrink-0">{a.cat}</span>
              <p className="flex-1 text-[12px] text-white font-medium">{a.text}</p>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-black tabular-nums" style={{ color: "#00d2be" }}>+{a.pts}</div>
                <div className="label">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
