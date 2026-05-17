"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, CalendarDays, Users, User, Gauge } from "lucide-react";

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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Gauge size={20} className="text-[#e63946]" />
          <span className="font-bold text-lg tracking-wider text-white">DRIVE <span className="text-[#e63946]">59</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#888] bg-[#1e1e1e] px-2 py-1 rounded-full">Miami, FL</span>
          <div className="w-8 h-8 rounded-full bg-[#e63946] flex items-center justify-center text-xs font-bold">CR</div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-sm">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors">
              <Icon size={20} className={active ? "text-[#e63946]" : "text-[#555]"} />
              <span className={`text-[10px] font-medium ${active ? "text-[#e63946]" : "text-[#555]"}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
