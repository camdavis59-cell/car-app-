import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Drive 59",
  description: "The home base for car culture",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#000", minHeight: "100dvh", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "430px", minHeight: "100dvh", background: "#15151e", position: "relative", display: "flex", flexDirection: "column" }}>
          <Nav />
          <main style={{ flex: 1, overflowX: "hidden" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
