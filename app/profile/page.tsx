"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Camera, Plus, Settings, ChevronRight, Pencil, Check, X } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const RANKS = [
  { name: "Daily Driver",  min: 0,    next: 500  },
  { name: "Street Cred",   min: 500,  next: 1500 },
  { name: "Gear Head",     min: 1500, next: 5000 },
  { name: "Street Legend", min: 5000, next: null },
];
function getRank(pts: number) { return [...RANKS].reverse().find(r => pts >= r.min) ?? RANKS[0]; }

export default function ProfilePage() {
  const router = useRouter();
  const { profile, garage, updateProfile, addCar } = useStore();
  const [tab, setTab] = useState<"garage"|"activity">("garage");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const avatarRef = useRef<HTMLInputElement>(null);

  const rank = getRank(profile.points);
  const nextRank = RANKS[RANKS.findIndex(r => r.name === rank.name) + 1];
  const pct = nextRank ? Math.round(((profile.points - rank.min) / (nextRank.min - rank.min)) * 100) : 100;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    updateProfile({ avatar: url });
  }

  function saveProfile() { updateProfile(draft); setEditing(false); }

  const ACTIVITY = [
    { cat: "EVENT",  text: "RSVPd — Wynwood Car Meet",                  time: "2h ago",     pts: 10  },
    { cat: "PHOTO",  text: "3 photos uploaded at Brickell City Centre", time: "Yesterday",  pts: 150 },
    { cat: "SHOP",   text: "Checked in — Miami Motorsport",             time: "2 days ago", pts: 25  },
    { cat: "CLUB",   text: "Joined JDMiami",                            time: "1 week ago", pts: 50  },
    { cat: "EVENT",  text: "Attended JDM Only — Hialeah",               time: "2 weeks ago",pts: 100 },
  ];

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background: "#15151e" }}>
      {/* Banner */}
      <div className="h-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a0505 0%,#120808 40%,#0d0d0d 100%)" }}>
        {[...Array(4)].map((_,i) => (
          <div key={i} className="absolute h-px" style={{ background:"rgba(225,6,0,0.08)", top:`${20+i*20}%`, left:"-10%", right:"-10%", transform:"rotate(-5deg)" }} />
        ))}
      </div>

      <div className="px-4" style={{ borderBottom: "1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between -mt-7 pb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-sm border-[3px] overflow-hidden flex items-center justify-center text-[17px] font-black text-white"
              style={{ background: "#e10600", borderColor: "#15151e" }}>
              {profile.avatar
                ? <Image src={profile.avatar} alt="avatar" fill className="object-cover" />
                : profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <button onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#e10600", border: "2px solid #15151e" }}>
              <Camera size={9} color="#fff" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex gap-2">
            {editing
              ? <>
                  <button onClick={saveProfile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-black tracking-wide uppercase text-white" style={{ background:"#e10600" }}><Check size={12}/> Save</button>
                  <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-sm text-[11px] font-black" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#888" }}><X size={12}/></button>
                </>
              : <button onClick={() => { setDraft(profile); setEditing(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-black tracking-wide uppercase" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#888" }}><Pencil size={11}/> Edit</button>
            }
          </div>
        </div>

        {editing ? (
          <div className="pb-4">
            <Field label="Name" value={draft.name} onChange={v => setDraft(d=>({...d,name:v}))} />
            <Field label="Handle" value={draft.handle} onChange={v => setDraft(d=>({...d,handle:v}))} />
            <Field label="Location" value={draft.location} onChange={v => setDraft(d=>({...d,location:v}))} />
            <Field label="Bio" value={draft.bio} onChange={v => setDraft(d=>({...d,bio:v}))} multiline />
          </div>
        ) : (
          <div className="pb-4">
            <h1 className="text-[17px] font-black text-white tracking-tight">{profile.name}</h1>
            <p className="text-[12px]" style={{ color:"#4a4a5c" }}>{profile.handle} · {profile.location}</p>
            {profile.bio && <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color:"#8888a0" }}>{profile.bio}</p>}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-0 mb-4" style={{ border:"1px solid #2c2c3a", borderRadius:"3px", overflow:"hidden" }}>
          {[{val:profile.followers,label:"FOLLOWERS"},{val:profile.following,label:"FOLLOWING"},{val:profile.eventsAttended,label:"EVENTS"},{val:profile.photosUploaded,label:"PHOTOS"}].map((s,i) => (
            <div key={s.label} className="flex flex-col items-center py-3" style={{ borderLeft: i>0?"1px solid #2c2c3a":"none" }}>
              <span className="text-[17px] font-black text-white tabular-nums">{s.val}</span>
              <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Points */}
        <div className="p-4 mb-4" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px" }}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"4px" }}>Current Rank</p>
              <p className="text-[14px] font-black text-white tracking-wide uppercase">{rank.name}</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"2px" }}>Points</p>
              <p className="text-[28px] font-black text-white tabular-nums leading-none">{profile.points.toLocaleString()}</p>
            </div>
          </div>
          {nextRank && (
            <>
              <div className="h-[3px] overflow-hidden mb-2" style={{ background:"#252532" }}>
                <div className="h-full" style={{ width:`${pct}%`, background:"#e10600" }} />
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize:"10px", color:"#4a4a5c" }}>{(nextRank.min-profile.points).toLocaleString()} pts to {nextRank.name}</span>
                <span style={{ fontSize:"10px", fontWeight:700, color:"#4a4a5c" }}>{pct}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom:"1px solid #2c2c3a" }}>
        {(["garage","activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 relative"
            style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color: tab===t?"#fff":"#4a4a5c" }}>
            {t==="garage"?"MY GARAGE":"ACTIVITY"}
            {tab===t && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:"#e10600" }} />}
          </button>
        ))}
      </div>

      {tab === "garage" && (
        <div className="flex flex-col" style={{ borderBottom:"1px solid #2c2c3a" }}>
          {garage.map((car, i) => (
            <button key={car.id} onClick={() => router.push(`/garage/${car.id}`)}
              className="px-4 py-4 flex items-center gap-4 text-left w-full relative"
              style={{ borderBottom: i < garage.length-1 ? "1px solid #1e1e2a" : "none" }}>
              <div className="absolute left-0 top-3 bottom-3 w-[2px]" style={{ background:"#e10600" }} />
              <div className="w-16 h-12 rounded-sm overflow-hidden shrink-0" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
                {car.photos[0] && <Image src={car.photos[0]} alt={car.model} width={64} height={48} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase" }}>{car.year} · {car.color}</p>
                <p className="text-[15px] font-black text-white truncate">{car.make} {car.model}</p>
                <p style={{ fontSize:"11px", color:"#4a4a5c" }}>{car.horsepower} HP · {car.photos.length} photos</p>
              </div>
              <ChevronRight size={16} style={{ color:"#4a4a5c", flexShrink:0 }} />
            </button>
          ))}
          <button onClick={() => router.push("/garage/new")}
            className="w-full py-5 flex items-center justify-center gap-2"
            style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", color:"#e10600", borderBottom:"1px solid #1e1e2a", background:"transparent" }}>
            <Plus size={15} /> ADD CAR TO GARAGE
          </button>
        </div>
      )}

      {tab === "activity" && (
        <div className="flex flex-col" style={{ borderBottom:"1px solid #2c2c3a" }}>
          {ACTIVITY.map((a,i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4"
              style={{ borderBottom: i<ACTIVITY.length-1?"1px solid #1e1e2a":"none" }}>
              <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", color:"#4a4a5c", textTransform:"uppercase", width:"60px", flexShrink:0 }}>{a.cat}</span>
              <p className="flex-1 text-[12px] text-white">{a.text}</p>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-black tabular-nums" style={{ color:"#00d2be" }}>+{a.pts}</div>
                <div style={{ fontSize:"10px", color:"#4a4a5c" }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
