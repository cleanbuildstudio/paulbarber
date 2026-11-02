import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import WaveBackground from "./Components/WaveBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Paul Barber",
  description: "Clean cuts, honest conversation, zero judgement. Sharp taper or wild curls, I'll make it yours. Come as you are.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body
        className="min-h-full text-white flex flex-col font-sans overflow-x-hidden max-w-full"
        style={{ backgroundColor: "#111111" }}
      >
        <WaveBackground look="dark" cursor={true} />
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
