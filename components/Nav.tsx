"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, CalendarDays, Users, User } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "/", label: "Map", icon: Map },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/profile", label: "Garage", icon: User },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[53px] flex items-center justify-between px-4 border-b border-[#1a1a1a] bg-[#080808]/96 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-0">
          {/* Speed lines */}
          <div className="flex flex-col gap-[3px] mr-2.5">
            <div className="w-5 h-[3px] bg-[#e63946] rounded-full" />
            <div className="w-3.5 h-[2px] bg-[#e63946]/40 rounded-full" />
          </div>
          <span className="font-black text-[17px] tracking-tight text-white uppercase">Drive</span>
          <span className="ml-1.5 bg-[#e63946] text-white font-black text-[13px] px-1.5 py-0.5 rounded-[5px] leading-tight tracking-tight">59</span>
        </div>

        {/* Right: points + avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#242424] px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
            <span className="text-xs font-bold text-white tabular-nums">2,840</span>
            <span className="text-[10px] text-[#555] font-medium">PTS</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#e63946] flex items-center justify-center text-[11px] font-black text-white tracking-tight">CR</div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-[60px] flex border-t border-[#1a1a1a] bg-[#080808]/96 backdrop-blur-md">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors">
              <Icon
                size={19}
                className="transition-colors"
                style={{ color: active ? "#e63946" : "#444" }}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-semibold tracking-wide transition-colors"
                style={{ color: active ? "#e63946" : "#444" }}
              >
                {label}
              </span>
              {active && <div className="absolute bottom-0 w-6 h-[2px] bg-[#e63946] rounded-t-full" style={{ position: "static" }} />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
