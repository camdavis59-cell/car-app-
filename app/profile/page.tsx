"use client";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Camera, Plus, Pencil, Check, X, ChevronRight, MapPin, Globe, Lock } from "lucide-react";
import Image from "next/image";
import Field from "@/components/ui/Field";

const RANKS = [
  { name: "Daily Driver",  min: 0,    next: 500  },
  { name: "Street Cred",   min: 500,  next: 1500 },
  { name: "Gear Head",     min: 1500, next: 5000 },
  { name: "Street Legend", min: 5000, next: null },
];
function getRank(pts: number) { return [...RANKS].reverse().find(r => pts >= r.min) ?? RANKS[0]; }

const S = {
  label: { fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#4a4a5c" },
  surface: { background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"4px" },
};

const ACTIVITY = [
  { cat: "EVENT",  text: "RSVPd — Wynwood Car Meet",                  time: "2h ago",     pts: 10  },
  { cat: "PHOTO",  text: "3 photos at Brickell City Centre",          time: "Yesterday",  pts: 150 },
  { cat: "SHOP",   text: "Checked in — Miami Motorsport",             time: "2 days ago", pts: 25  },
  { cat: "RALLY",  text: "Completed Keys Run checkpoint",             time: "1 week ago", pts: 150 },
  { cat: "EVENT",  text: "Attended JDM Only — Hialeah",               time: "2 weeks ago",pts: 100 },
];

const TABS = [
  { key: "garage",   label: "GARAGE"   },
  { key: "clubs",    label: "CLUBS"    },
  { key: "msgs",     label: "MSGS"     },
  { key: "activity", label: "ACTIVITY" },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { profile, garage, clubs, conversations, updateProfile } = useStore();
  const [tab, setTab] = useState<"garage"|"clubs"|"msgs"|"activity">("garage");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set());
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const rank = getRank(profile.points);
  const nextRank = RANKS[RANKS.findIndex(r => r.name === rank.name) + 1];
  const pct = nextRank ? Math.round(((profile.points - rank.min) / (nextRank.min - rank.min)) * 100) : 100;

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    updateProfile({ avatar: URL.createObjectURL(f) });
  }

  function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    updateProfile({ banner: URL.createObjectURL(f) });
  }

  function save() { updateProfile(draft); setEditing(false); }

  function toggleClub(id: string) {
    setJoinedClubs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div style={{ paddingTop:"56px", paddingBottom:"80px", minHeight:"100dvh", background:"#15151e" }}>
      {/* Banner */}
      <div style={{ height:"120px", background:"linear-gradient(135deg,#200808 0%,#100505 50%,#0d0d14 100%)", position:"relative", overflow:"hidden" }}>
        <Image src={profile.banner || "https://picsum.photos/seed/profilebanner/800/300"} alt="" fill style={{ objectFit:"cover", opacity: profile.banner ? 0.7 : 0.18 }} />
        <button onClick={() => bannerRef.current?.click()} style={{ position:"absolute", top:"10px", right:"10px", display:"flex", alignItems:"center", gap:"5px", padding:"6px 10px", borderRadius:"3px", background:"rgba(21,21,30,0.85)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>
          <Camera size={11} /> Edit Cover
        </button>
        <input ref={bannerRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBanner} />
      </div>

      <div style={{ padding:"0 16px", borderBottom:"1px solid #2c2c3a" }}>
        {/* Avatar row */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:"-28px", paddingBottom:"12px" }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:"60px", height:"60px", borderRadius:"6px", border:"3px solid #15151e", background:"#e10600", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:900, color:"#fff", overflow:"hidden", flexShrink:0 }}>
              {profile.avatar ? <Image src={profile.avatar} alt="avatar" fill style={{ objectFit:"cover" }} /> : profile.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <button onClick={() => avatarRef.current?.click()} style={{ position:"absolute", bottom:"-4px", right:"-4px", width:"20px", height:"20px", borderRadius:"50%", background:"#e10600", border:"2px solid #15151e", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Camera size={9} color="#fff" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatar} />
          </div>
          {editing
            ? <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={save} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"4px", background:"#e10600", color:"#fff", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", border:"none", cursor:"pointer" }}><Check size={12}/> Save</button>
                <button onClick={() => setEditing(false)} style={{ padding:"8px 12px", borderRadius:"4px", background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#888", cursor:"pointer" }}><X size={12}/></button>
              </div>
            : <button onClick={() => { setDraft(profile); setEditing(true); }} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", borderRadius:"4px", background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#888", fontSize:"11px", fontWeight:700, cursor:"pointer" }}><Pencil size={11}/> Edit</button>
          }
        </div>

        {editing ? (
          <div style={{ paddingBottom:"16px" }}>
            <Field label="Name" value={draft.name} onChange={v=>setDraft(d=>({...d,name:v}))} />
            <Field label="Handle" value={draft.handle} onChange={v=>setDraft(d=>({...d,handle:v}))} />
            <Field label="Location" value={draft.location} onChange={v=>setDraft(d=>({...d,location:v}))} />
            <Field label="Bio" value={draft.bio} onChange={v=>setDraft(d=>({...d,bio:v}))} multiline />
          </div>
        ) : (
          <div style={{ paddingBottom:"16px" }}>
            <p style={{ fontSize:"18px", fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>{profile.name}</p>
            <p style={{ fontSize:"12px", color:"#4a4a5c", marginTop:"2px" }}>{profile.handle} · {profile.location}</p>
            {profile.bio && <p style={{ fontSize:"12px", color:"#8888a0", marginTop:"8px", lineHeight:1.5 }}>{profile.bio}</p>}
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", border:"1px solid #2c2c3a", borderRadius:"4px", overflow:"hidden", marginBottom:"16px" }}>
          {[{val:profile.followers,label:"FOLLOWERS"},{val:profile.following,label:"FOLLOWING"},{val:profile.eventsAttended,label:"EVENTS"},{val:profile.photosUploaded,label:"PHOTOS"}].map((s,i)=>(
            <div key={s.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"12px 0", borderLeft: i>0?"1px solid #2c2c3a":"none" }}>
              <span style={{ fontSize:"17px", fontWeight:900, color:"#fff" }}>{s.val}</span>
              <span style={{ ...S.label, marginTop:"2px", fontSize:"9px" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Points card */}
        <div style={{ ...S.surface, padding:"16px", marginBottom:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"12px" }}>
            <div>
              <p style={{ ...S.label, marginBottom:"4px" }}>Rank</p>
              <p style={{ fontSize:"14px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>{rank.name}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ ...S.label, marginBottom:"2px" }}>Points</p>
              <p style={{ fontSize:"28px", fontWeight:900, color:"#fff", lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{profile.points.toLocaleString()}</p>
            </div>
          </div>
          {nextRank && (
            <>
              <div style={{ height:"3px", background:"#252532", borderRadius:"2px", overflow:"hidden", marginBottom:"6px" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:"#e10600" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ ...S.label, fontSize:"10px" }}>{(nextRank.min-profile.points).toLocaleString()} pts to {nextRank.name}</span>
                <span style={{ ...S.label, fontSize:"10px" }}>{pct}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid #2c2c3a" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, padding:"13px 0", fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:tab===t.key?"#fff":"#4a4a5c", background:"transparent", border:"none", borderBottom:`2px solid ${tab===t.key?"#e10600":"transparent"}`, cursor:"pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* GARAGE TAB */}
      {tab==="garage" && (
        <div>
          {garage.map((car)=>(
            <button key={car.id} onClick={()=>router.push(`/garage/${car.id}`)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"transparent", border:"none", borderBottom:"1px solid #1e1e2a", cursor:"pointer", textAlign:"left", position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:"12px", bottom:"12px", width:"2px", background:"#e10600" }} />
              <div style={{ width:"72px", height:"52px", borderRadius:"4px", overflow:"hidden", flexShrink:0, border:"1px solid #2c2c3a", position:"relative" }}>
                {car.photos[0] && <Image src={car.photos[0]} alt={car.model} fill style={{ objectFit:"cover" }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ ...S.label, marginBottom:"2px" }}>{car.year} · {car.color}</p>
                <p style={{ fontSize:"16px", fontWeight:900, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{car.make} {car.model}</p>
                <p style={{ fontSize:"11px", color:"#4a4a5c", marginTop:"1px" }}>{car.horsepower} HP · {car.photos.length} photos</p>
              </div>
              <ChevronRight size={16} color="#4a4a5c" />
            </button>
          ))}
          <button onClick={()=>router.push("/garage/new")} style={{ width:"100%", padding:"20px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"transparent", border:"none", borderBottom:"1px solid #1e1e2a", color:"#e10600", fontSize:"11px", fontWeight:900, letterSpacing:"0.1em", cursor:"pointer" }}>
            <Plus size={15}/> ADD CAR TO GARAGE
          </button>
        </div>
      )}

      {/* CLUBS TAB */}
      {tab==="clubs" && (
        <div>
          {clubs.map((club, i) => {
            const isMember = joinedClubs.has(club.id);
            return (
              <div key={club.id} style={{ borderBottom: i < clubs.length-1 ? "1px solid #1e1e2a" : "none", position:"relative" }}>
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"2px", background: isMember ? "#e10600" : "#2c2c3a" }} />
                <div style={{ height:"50px", position:"relative", overflow:"hidden", background:"#1e1e2a" }}>
                  <Image src={club.banner} alt={club.name} fill style={{ objectFit:"cover", opacity:0.55 }} />
                </div>
                <div style={{ padding:"12px 16px 14px 18px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"6px" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ ...S.label, marginBottom:"3px" }}>{club.type}</p>
                      <p style={{ fontSize:"15px", fontWeight:900, color:"#fff" }}>{club.name}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontSize:"18px", fontWeight:900, color:"#fff", lineHeight:1 }}>{club.members + (isMember ? 1 : 0)}</p>
                      <p style={{ ...S.label, fontSize:"9px" }}>MEMBERS</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                    <MapPin size={10} color="#4a4a5c" />
                    <span style={{ fontSize:"11px", color:"#4a4a5c" }}>{club.location}</span>
                    {club.public ? <Globe size={10} color="#4a4a5c" /> : <Lock size={10} color="#4a4a5c" />}
                    <span style={{ fontSize:"11px", color:"#4a4a5c" }}>{club.public ? "Public" : "Private"}</span>
                  </div>
                  <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
                    <button onClick={() => toggleClub(club.id)} style={{ flex:1, padding:"9px 0", borderRadius:"3px", fontSize:"11px", fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", background: isMember ? "transparent" : "#e10600", color: isMember ? "#e10600" : "#fff", border: isMember ? "1px solid #e10600" : "1px solid transparent", cursor:"pointer" }}>
                      {isMember ? "✓  Member" : "Join Club"}
                    </button>
                    <button onClick={() => router.push(`/clubs/${club.id}`)} style={{ padding:"9px 12px", borderRadius:"3px", background:"#1e1e2a", border:"1px solid #2c2c3a", display:"flex", alignItems:"center", cursor:"pointer" }}>
                      <ChevronRight size={15} color="#8888a0" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MESSAGES TAB */}
      {tab==="msgs" && (
        <div>
          {conversations.map((conv, i) => {
            const last = conv.messages[conv.messages.length - 1];
            return (
              <button key={conv.id} onClick={() => router.push(`/messages/${conv.id}`)}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"transparent", border:"none", borderBottom: i < conversations.length-1 ? "1px solid #1e1e2a" : "none", cursor:"pointer", textAlign:"left" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"4px", background:"#e10600", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:900, color:"#fff", flexShrink:0 }}>
                  {conv.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"8px", marginBottom:"2px" }}>
                    <p style={{ fontSize:"13px", fontWeight:900, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{conv.with}</p>
                    <span style={{ fontSize:"10px", color:"#4a4a5c", flexShrink:0 }}>{conv.lastSeen}</span>
                  </div>
                  <p style={{ fontSize:"11px", color:"#4a4a5c", marginBottom:"3px" }}>{conv.handle} · {conv.car}</p>
                  <p style={{ fontSize:"12px", color:"#8888a0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{last?.text}</p>
                </div>
                <ChevronRight size={15} color="#4a4a5c" />
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVITY TAB */}
      {tab==="activity" && (
        <div>
          {ACTIVITY.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", borderBottom: i<ACTIVITY.length-1?"1px solid #1e1e2a":"none" }}>
              <span style={{ ...S.label, width:"54px", flexShrink:0 }}>{a.cat}</span>
              <p style={{ flex:1, fontSize:"12px", color:"#fff" }}>{a.text}</p>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:"13px", fontWeight:900, color:"#00d2be", fontVariantNumeric:"tabular-nums" }}>+{a.pts}</div>
                <div style={{ ...S.label, fontSize:"9px" }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
