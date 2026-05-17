"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, CalendarDays, User, Flag, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/",         label: "MAP",      icon: Map          },
  { href: "/events",   label: "EVENTS",   icon: CalendarDays },
  { href: "/rally",    label: "RALLY",    icon: Flag         },
  { href: "/market",   label: "MARKET",   icon: ShoppingBag  },
  { href: "/profile",  label: "GARAGE",   icon: User         },
];

export default function Nav() {
  const path = usePathname();
  const points = useStore(s => s.profile.points);
  const initials = useStore(s => s.profile.name.split(" ").map(n => n[0]).join("").slice(0,2));

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: "rgba(21,21,30,0.97)", borderBottom: "1px solid #2c2c3a", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-[3px]">
            <div className="w-4 h-[2px] rounded-full" style={{ background: "#e10600" }} />
            <div className="w-2.5 h-[2px] rounded-full" style={{ background: "#e10600", opacity: 0.35 }} />
          </div>
          <span className="text-[15px] font-black tracking-[0.08em] text-white uppercase">Drive</span>
          <span className="text-[11px] font-black text-white bg-[#e10600] px-1.5 py-[3px] rounded-[3px] tracking-wider leading-none">59</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "#1e1e2a", border: "1px solid #2c2c3a" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e10600" }} />
            <span className="text-[11px] font-black text-white tabular-nums tracking-wide">{points.toLocaleString()}</span>
            <span className="text-[9px] font-bold tracking-[0.1em] uppercase" style={{ color: "#4a4a5c" }}>PTS</span>
          </div>
          <Link href="/profile">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: "#e10600" }}>
              {initials}
            </div>
          </Link>
        </div>
      </header>

      <nav className="fixed bottom-0 inset-x-0 z-50 h-[58px] flex"
        style={{ background: "rgba(21,21,30,0.97)", borderTop: "1px solid #2c2c3a", backdropFilter: "blur(12px)" }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const on = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
              <Icon size={17} strokeWidth={on ? 2.5 : 1.8} style={{ color: on ? "#e10600" : "#4a4a5c" }} />
              <span className="text-[9px] font-bold tracking-[0.1em]" style={{ color: on ? "#e10600" : "#4a4a5c" }}>{label}</span>
              {on && <div className="absolute bottom-0 w-8 h-[2px] rounded-t-sm" style={{ background: "#e10600" }} />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
