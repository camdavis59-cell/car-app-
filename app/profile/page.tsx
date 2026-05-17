"use client";
import { useState } from "react";
import { userProfile } from "@/lib/mockData";
import { MapPin, Camera, CalendarDays, Users, Star, Plus, ChevronRight, Zap } from "lucide-react";

const rankColors: Record<string, string> = {
  "Gear Head": "#f59e0b",
  "Street Legend": "#e63946",
  "Daily Driver": "#888",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"garage" | "activity">("garage");
  const p = userProfile;

  return (
    <div className="pt-[53px] pb-[76px] min-h-screen bg-[#0a0a0a]">
      {/* Profile header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-[#1a0a0a] via-[#2a0a0a] to-[#1a1a1a]" />

        {/* Avatar */}
        <div className="absolute left-4 bottom-0 translate-y-1/2">
          <div className="w-16 h-16 rounded-full bg-[#e63946] border-2 border-[#0a0a0a] flex items-center justify-center text-xl font-black text-white">
            CR
          </div>
        </div>
      </div>

      <div className="px-4 pt-10 pb-4 border-b border-[#1e1e1e]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-white text-lg">{p.name}</h1>
            <p className="text-[#555] text-sm">{p.handle}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} className="text-[#555]" />
              <span className="text-xs text-[#555]">{p.location}</span>
            </div>
          </div>
          <button className="bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] text-xs px-3 py-1.5 rounded-full">Edit</button>
        </div>

        {/* Points / Rank */}
        <div className="mt-4 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center">
              <Zap size={16} style={{ color: rankColors[p.rank] || "#888" }} />
            </div>
            <div>
              <div className="text-[10px] text-[#555]">Rank</div>
              <div className="text-sm font-bold" style={{ color: rankColors[p.rank] || "#888" }}>{p.rank}</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-white">{p.points.toLocaleString()}</div>
            <div className="text-[10px] text-[#555]">Drive Points</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">{p.eventsAttended}</div>
            <div className="text-[10px] text-[#555]">Events</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 flex gap-4">
          <div className="text-center">
            <div className="text-base font-bold text-white">{p.followers}</div>
            <div className="text-[10px] text-[#555]">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-white">{p.following}</div>
            <div className="text-[10px] text-[#555]">Following</div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-white">{p.photosUploaded}</div>
            <div className="text-[10px] text-[#555]">Photos</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e1e]">
        {(["garage", "activity"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2"
            style={{
              color: activeTab === tab ? "#e63946" : "#555",
              borderColor: activeTab === tab ? "#e63946" : "transparent",
            }}
          >
            {tab === "garage" ? "My Garage" : "Activity"}
          </button>
        ))}
      </div>

      {/* Garage tab */}
      {activeTab === "garage" && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {p.garage.map(car => (
            <div key={car.id} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              {/* Car photo placeholder */}
              <div className="h-32 bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] flex items-center justify-center relative">
                <span className="text-4xl">🚗</span>
                <div className="absolute bottom-2 right-2">
                  <span className="flex items-center gap-1 text-[10px] text-[#888] bg-[#0a0a0a]/80 px-2 py-0.5 rounded-full">
                    <Camera size={9} /> {car.photos} photos
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-base">{car.year} {car.make} {car.model}</h3>
                <p className="text-[#555] text-xs mb-3">{car.color}</p>
                <div>
                  <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1.5">Mods</p>
                  <div className="flex flex-wrap gap-1.5">
                    {car.mods.map(mod => (
                      <span key={mod} className="text-[10px] text-[#888] border border-[#2a2a2a] px-2 py-0.5 rounded-full">{mod}</span>
                    ))}
                  </div>
                </div>
                <button className="mt-3 w-full py-2 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-[#888] text-xs font-semibold flex items-center justify-center gap-1">
                  <Camera size={12} /> Add Photos
                </button>
              </div>
            </div>
          ))}

          <button className="bg-[#141414] border border-dashed border-[#2a2a2a] rounded-2xl p-6 flex flex-col items-center gap-2 text-[#555]">
            <Plus size={24} />
            <span className="text-sm font-semibold">Add Another Car</span>
          </button>
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "activity" && (
        <div className="px-4 pt-4 flex flex-col gap-2">
          {[
            { icon: "🏁", text: "RSVPd to Wynwood Car Meet", time: "2h ago", pts: "+100" },
            { icon: "📸", text: "Uploaded 3 photos at Brickell City Centre", time: "Yesterday", pts: "+150" },
            { icon: "🔧", text: "Checked in at Miami Motorsport", time: "2 days ago", pts: "+25" },
            { icon: "🤝", text: "Joined JDMiami club", time: "1 week ago", pts: "+50" },
            { icon: "🏆", text: "Attended JDM Only — Hialeah", time: "2 weeks ago", pts: "+100" },
          ].map((item, i) => (
            <div key={i} className="bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm text-white">{item.text}</p>
                  <p className="text-xs text-[#555]">{item.time}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#10b981] shrink-0">{item.pts}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
