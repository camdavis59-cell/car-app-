"use client";
import { useState } from "react";
import { userProfile } from "@/lib/mockData";
import { Camera, Plus, Zap, Trophy, Settings } from "lucide-react";

const RANK_TIERS = [
  { name: "Daily Driver",  min: 0,    color: "#555",    next: 500  },
  { name: "Street Cred",  min: 500,   color: "#3b82f6", next: 1500 },
  { name: "Gear Head",    min: 1500,  color: "#f59e0b", next: 5000 },
  { name: "Street Legend",min: 5000,  color: "#e63946", next: null },
];

function getRank(pts: number) {
  return [...RANK_TIERS].reverse().find(t => pts >= t.min) || RANK_TIERS[0];
}

const ACTIVITY = [
  { emoji: "🏁", text: "RSVPd to Wynwood Car Meet",                      time: "2h ago",     pts: 10  },
  { emoji: "📸", text: "Uploaded 3 photos at Brickell City Centre",      time: "Yesterday",  pts: 150 },
  { emoji: "🔧", text: "Checked in at Miami Motorsport",                 time: "2 days ago", pts: 25  },
  { emoji: "🤝", text: "Joined JDMiami",                                 time: "1 week ago", pts: 50  },
  { emoji: "🏆", text: "Attended JDM Only — Hialeah (QR verified)",      time: "2 weeks ago",pts: 100 },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<"garage" | "activity">("garage");
  const p = userProfile;
  const rank = getRank(p.points);
  const nextRank = RANK_TIERS[RANK_TIERS.findIndex(r => r.name === rank.name) + 1];
  const pct = nextRank ? Math.round(((p.points - rank.min) / (nextRank.min - rank.min)) * 100) : 100;

  return (
    <div className="pt-[53px] pb-[72px] min-h-screen bg-[#080808]">
      {/* Banner */}
      <div className="h-32 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0505 0%, #120808 40%, #0d0d0d 100%)" }}>
        {/* Decorative lines */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute h-px bg-[#e63946]/10"
            style={{ top: `${20 + i * 16}%`, left: "-10%", right: "-10%", transform: `rotate(-8deg)` }} />
        ))}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#111]/70 border border-[#222] flex items-center justify-center">
          <Settings size={14} className="text-[#555]" />
        </button>
      </div>

      {/* Avatar overlapping banner */}
      <div className="px-4">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="w-[64px] h-[64px] rounded-full bg-[#e63946] border-[3px] border-[#080808] flex items-center justify-center text-[20px] font-black text-white shadow-lg">
            CR
          </div>
          <button className="bg-[#181818] border border-[#242424] text-[#888] text-[11px] font-semibold px-3 py-1.5 rounded-full">
            Edit Profile
          </button>
        </div>

        <h1 className="font-black text-[18px] text-white">{p.name}</h1>
        <p className="text-[#444] text-[12px] mb-1">{p.handle} · {p.location}</p>

        {/* Stats row */}
        <div className="flex gap-5 mt-2 mb-4">
          {[
            { val: p.followers,       label: "Followers" },
            { val: p.following,       label: "Following" },
            { val: p.eventsAttended,  label: "Events" },
            { val: p.photosUploaded,  label: "Photos" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-[15px] font-black text-white tabular-nums">{s.val}</div>
              <div className="text-[10px] text-[#444] font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Points card */}
        <div className="bg-[#111] border border-[#1c1c1c] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${rank.color}22` }}>
                <Trophy size={15} style={{ color: rank.color }} />
              </div>
              <div>
                <div className="text-[10px] text-[#444] font-medium uppercase tracking-wider">Current Rank</div>
                <div className="text-[13px] font-black" style={{ color: rank.color }}>{rank.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[26px] font-black text-white tabular-nums leading-none">{p.points.toLocaleString()}</div>
              <div className="text-[10px] text-[#444] font-medium">Points</div>
            </div>
          </div>

          {nextRank && (
            <>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-[#333] font-medium">→ {nextRank.name}</span>
                <span className="text-[10px] font-bold" style={{ color: rank.color }}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: rank.color }} />
              </div>
              <p className="text-[10px] text-[#333] mt-1.5">
                {(nextRank.min - p.points).toLocaleString()} points to <span style={{ color: nextRank.color }}>{nextRank.name}</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#141414] px-4">
        {(["garage", "activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 text-[13px] font-bold capitalize border-b-2 transition-all"
            style={{
              color: tab === t ? "#e63946" : "#444",
              borderColor: tab === t ? "#e63946" : "transparent",
            }}>
            {t === "garage" ? "My Garage" : "Activity"}
          </button>
        ))}
      </div>

      {/* Garage */}
      {tab === "garage" && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {p.garage.map(car => (
            <div key={car.id} className="bg-[#111] border border-[#1c1c1c] rounded-2xl overflow-hidden card-hover">
              <div className="h-36 bg-gradient-to-br from-[#181818] to-[#111] flex items-center justify-center relative">
                <span className="text-6xl">🚗</span>
                <span className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[10px] text-[#555] bg-[#0a0a0a]/80 px-2 py-1 rounded-full border border-[#1a1a1a]">
                  <Camera size={9} /> {car.photos}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-black text-white text-[15px]">{car.year} {car.make} {car.model}</h3>
                <p className="text-[#444] text-[11px] mb-3">{car.color}</p>
                <p className="text-[10px] text-[#333] uppercase tracking-wider font-bold mb-2">Mods</p>
                <div className="flex flex-wrap gap-1.5">
                  {car.mods.map(m => (
                    <span key={m} className="text-[10px] text-[#555] border border-[#1e1e1e] px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
                <button className="mt-3 w-full py-2 rounded-xl bg-[#181818] border border-[#222] text-[#444] text-[12px] font-semibold flex items-center justify-center gap-1.5">
                  <Camera size={11} /> Upload Photos
                </button>
              </div>
            </div>
          ))}

          <button className="bg-[#111] border border-dashed border-[#1e1e1e] rounded-2xl p-6 flex flex-col items-center gap-2 text-[#333] hover:border-[#e63946]/40 hover:text-[#e63946]/60 transition-colors">
            <Plus size={22} />
            <span className="text-[12px] font-semibold">Add Another Car</span>
          </button>
        </div>
      )}

      {/* Activity */}
      {tab === "activity" && (
        <div className="px-4 pt-4 flex flex-col gap-2">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="bg-[#111] border border-[#1c1c1c] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[18px]">{a.emoji}</span>
                <div>
                  <p className="text-[13px] text-[#ccc] font-medium">{a.text}</p>
                  <p className="text-[11px] text-[#444]">{a.time}</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-[#22c55e] shrink-0">+{a.pts}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
