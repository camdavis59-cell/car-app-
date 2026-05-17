"use client";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/map/MapClient"), { ssr: false });

export default function MapPage() {
  return (
    <div className="fixed inset-0 pt-[53px] pb-[60px]">
      <MapClient />
    </div>
  );
}
