"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const CAL_LINKS: Record<string, string> = {
  haircut: "adnan-21vvji/haircut",
  "skin-fade": "adnan-21vvji/skin-fade",
  "home-service": "adnan-21vvji/home-service",
};

const SERVICES = [
  { id: "haircut", label: "Haircut", number: "01" },
  { id: "skin-fade", label: "Skin fade", number: "02" },
  { id: "home-service", label: "Home Service", number: "03" },
];

const Cal = dynamic(() => import("@calcom/embed-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center gap-3 text-neutral-600 bg-white rounded-[6px]">
      <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest font-mono">Loading calendar...</span>
    </div>
  ),
});

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "haircut";
  const [selectedService, setSelectedService] = useState(
    CAL_LINKS[initialService] ? initialService : "haircut"
  );

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("returnToServices", "true");
      if (window.history.length > 1) {
        router.back();
        return;
      }
    }
    router.push("/#services");
  };

  useEffect(() => {
    const s = searchParams.get("service");
    if (s && CAL_LINKS[s]) {
      setSelectedService(s);
    }
  }, [searchParams]);

  const activeLink = CAL_LINKS[selectedService] || CAL_LINKS.haircut;
  const currentServiceObj = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
  const waMessage = `Hi Paul, I'd like to book a ${currentServiceObj.label}`;
  const whatsappUrl = `https://wa.me/917356526028?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="min-h-screen w-full bg-[#111111] text-[#F2F0EB] flex flex-col justify-between selection:bg-[#FF3B1D] selection:text-white pb-12">
      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5">
        <Link
          href="/#services"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("returnToServices", "true");
            }
          }}
          className="text-xs sm:text-sm font-bold tracking-widest uppercase hover:opacity-80 transition-opacity"
        >
          PaUL BARber
        </Link>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer select-none"
        >
          <span>←</span>
          <span>Back to Services</span>
        </button>
      </header>

      {/* Main Section: Monolog-Style Editorial Booking */}
      <div className="w-full max-w-[580px] mx-auto px-3.5 sm:px-6 pt-6 sm:pt-10 flex flex-col items-center">
        {/* Monolog Heading Block */}
        <div className="w-full text-start mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-2.5">
            Next steps start<br />with a cut.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-[42ch] leading-relaxed">
            Clean cuts, honest conversation, zero judgement. Sharp taper or wild curls, I&apos;ll make it yours.
          </p>
        </div>

        {/* Service Switcher Tabs */}
        <div className="w-full flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {SERVICES.map((s) => {
            const isActive = selectedService === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedService(s.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#F2F0EB] text-[#111111] shadow-md font-semibold"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Monolog-Style Exact Beige Embed Card */}
        <div
          className="relative w-full rounded-[6px] shadow-2xl flex flex-col p-3 sm:p-3.5 pb-0 overflow-hidden"
          style={{
            backgroundColor: "#ddddd5",
            borderRadius: "0.35rem",
          }}
        >
          {/* Inner Light Frame for Cal.com */}
          <div className="w-full min-h-[500px] h-[72vh] max-h-[660px] overflow-y-auto overflow-x-hidden rounded-[6px] bg-white">
            <Cal
              key={activeLink}
              calLink={activeLink}
              config={{
                layout: "month_view",
                theme: "light",
              }}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                overflow: "auto",
              }}
            />
          </div>
        </div>

        {/* Monolog-Style Bottom WhatsApp Option */}
        <div className="mt-4 text-center text-xs text-neutral-400 font-sans tracking-wide">
          Prefer WhatsApp?{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#C6FF3D] underline underline-offset-4 font-semibold transition-colors inline-flex items-center gap-1 group cursor-pointer"
          >
            <span>Message Paul</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>

      <div />
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#111111] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
