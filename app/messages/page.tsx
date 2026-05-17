"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";

export default function MessagesPage() {
  const { conversations } = useStore();
  const router = useRouter();

  const SCRIPTED = ["Nice car! 🔥","Let's meet up?","Meet at next gas station?","Headed to the meet?","What mods are those?","Let's go for a drive 🛣️"];

  return (
    <div className="pt-14 pb-[58px] min-h-screen" style={{ background:"#15151e" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <div className="flex items-end justify-between mb-3">
          <h1 className="text-[22px] font-black text-white tracking-tight">Messages</h1>
          <button className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
            <Plus size={15} style={{ color:"#8888a0" }} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <Search size={14} style={{ color:"#4a4a5c" }} />
          <input placeholder="Search conversations…" style={{ background:"transparent", border:"none", outline:"none", fontSize:"13px", color:"#fff", width:"100%", fontFamily:"inherit" }} />
        </div>
      </div>

      {/* Quick scripts */}
      <div className="px-4 py-3" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4a4a5c", marginBottom:"10px" }}>QUICK MESSAGES — SAFE WHILE DRIVING</p>
        <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
          {SCRIPTED.map(s => (
            <button key={s} className="whitespace-nowrap px-3 py-1.5 rounded-sm text-[11px] font-semibold"
              style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#8888a0", flexShrink:0 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex flex-col">
        {conversations.map((conv, i) => {
          const last = conv.messages[conv.messages.length - 1];
          return (
            <button key={conv.id} onClick={() => router.push(`/messages/${conv.id}`)}
              className="flex items-center gap-3 px-4 py-4 text-left w-full"
              style={{ borderBottom: i < conversations.length-1 ? "1px solid #1e1e2a" : "none" }}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center text-[13px] font-black text-white shrink-0"
                style={{ background:"#e10600" }}>
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-black text-white truncate">{conv.with}</p>
                  <span style={{ fontSize:"10px", color:"#4a4a5c", flexShrink:0 }}>{conv.lastSeen}</span>
                </div>
                <p style={{ fontSize:"11px", color:"#4a4a5c", marginTop:"1px" }}>{conv.handle} · {conv.car}</p>
                <p className="truncate mt-1" style={{ fontSize:"12px", color:"#8888a0" }}>{last?.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
