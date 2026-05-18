"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ArrowLeft, Send, Zap } from "lucide-react";

const SCRIPTED = ["Nice car! 🔥","Let's meet up?","Meet at next gas station?","Headed to the meet?","What mods are those?","Let's go for a drive 🛣️","👍","On my way!"];

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { conversations, sendMessage } = useStore();
  const [input, setInput] = useState("");
  const [showScripts, setShowScripts] = useState(false);

  const conv = conversations.find(c => c.id === id);
  if (!conv) return null;

  function send(text: string) {
    if (!text.trim()) return;
    sendMessage(id, { id: Date.now().toString(), from: "me", text: text.trim(), time: "Just now" });
    setInput("");
    setShowScripts(false);
  }

  return (
    <div className="pt-14 pb-20 min-h-screen flex flex-col" style={{ background:"#15151e" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 shrink-0" style={{ borderBottom:"1px solid #2c2c3a" }}>
        <button onClick={() => router.back()} className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background:"#1e1e2a", border:"1px solid #2c2c3a" }}>
          <ArrowLeft size={15} color="#fff" />
        </button>
        <div className="w-9 h-9 rounded-sm flex items-center justify-center text-[12px] font-black text-white shrink-0" style={{ background:"#e10600" }}>
          {conv.avatar}
        </div>
        <div>
          <p className="text-[14px] font-black text-white">{conv.with}</p>
          <p style={{ fontSize:"11px", color:"#4a4a5c" }}>{conv.handle} · {conv.car}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {conv.messages.map(msg => {
          const isMe = msg.from === "me";
          return (
            <div key={msg.id} className={`flex ${isMe?"justify-end":"justify-start"}`}>
              <div className="max-w-[78%]">
                {!isMe && <p style={{ fontSize:"10px", fontWeight:700, color:"#e10600", marginBottom:"4px" }}>{msg.from}</p>}
                <div className="px-3 py-2.5 rounded-sm" style={{
                  background: isMe ? "#e10600" : "#1e1e2a",
                  border: isMe ? "none" : "1px solid #2c2c3a",
                }}>
                  <p style={{ fontSize:"13px", color:"#fff", lineHeight:1.4 }}>{msg.text}</p>
                </div>
                <p style={{ fontSize:"10px", color:"#4a4a5c", marginTop:"3px", textAlign: isMe?"right":"left" }}>{msg.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick scripts */}
      {showScripts && (
        <div className="px-4 pb-3 overflow-x-auto no-scroll" style={{ borderTop:"1px solid #2c2c3a" }}>
          <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#4a4a5c", margin:"10px 0 8px" }}>QUICK SEND</p>
          <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
            {SCRIPTED.map(s => (
              <button key={s} onClick={() => send(s)} className="whitespace-nowrap px-3 py-1.5 rounded-sm text-[11px] font-semibold shrink-0"
                style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", color:"#8888a0" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 flex gap-2 shrink-0" style={{ borderTop:"1px solid #2c2c3a" }}>
        <button onClick={() => setShowScripts(s=>!s)}
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{ background: showScripts?"#e10600":"#1e1e2a", border:`1px solid ${showScripts?"#e10600":"#2c2c3a"}` }}>
          <Zap size={15} style={{ color: showScripts?"#fff":"#4a4a5c" }} />
        </button>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send(input)}
          placeholder="Message…"
          className="flex-1"
          style={{ background:"#1e1e2a", border:"1px solid #2c2c3a", borderRadius:"3px", color:"#fff", fontSize:"13px", padding:"0 12px", outline:"none", fontFamily:"inherit", height:"36px" }} />
        <button onClick={() => send(input)}
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{ background:"#e10600" }}>
          <Send size={14} color="#fff" />
        </button>
      </div>
    </div>
  );
}
