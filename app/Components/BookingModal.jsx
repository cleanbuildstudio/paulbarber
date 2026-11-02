"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { getCalApi } from "@calcom/embed-react";

// Cal.com Links mapped to your actual events
export const CAL_LINKS = {
  haircut: "adnan-21vvji/haircut",
  "skin-fade": "adnan-21vvji/skin-fade",
  "home-service": "adnan-21vvji/home-service",
};

export const SERVICES = [
  { id: "haircut", label: "Haircut", number: "01" },
  { id: "skin-fade", label: "Skin fade", number: "02" },
  { id: "home-service", label: "Home Service", number: "03" },
];

export const SERVICE_DISPLAY_NAMES = {
  haircut: "haircut",
  "skin-fade": "skin fade",
  "home-service": "home service",
};

// Dynamically import Cal to ensure smooth client-only rendering
const Cal = dynamic(() => import("@calcom/embed-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center gap-3 text-neutral-500 bg-white rounded-[6px]">
      <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest font-mono">Loading calendar...</span>
    </div>
  ),
});

export default function BookingModal({ isOpen, onClose, selectedService, serviceKey }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(selectedService || serviceKey || "haircut");
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync active tab whenever modal opens or service prop updates
  useEffect(() => {
    const s = selectedService || serviceKey;
    if (s && CAL_LINKS[s]) {
      setActiveTab(s);
    }
  }, [selectedService, serviceKey, isOpen]);

  // Initialize Cal.com UI theme & brand settings
  useEffect(() => {
    (async function initCal() {
      try {
        const cal = await getCalApi();
        cal("ui", {
          theme: "light",
          styles: {
            branding: {
              brandColor: "#111111",
            },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch (err) {
        console.error("Failed to initialize Cal.com UI:", err);
      }
    })();
  }, []);

  // Lock page scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.stop();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Resolve link and formatted service name
  const calLink = CAL_LINKS[activeTab] || CAL_LINKS.haircut;
  const currentServiceObj = SERVICES.find((s) => s.id === activeTab) || SERVICES[0];
  const waMessage = `Hi Paul, I'd like to book a ${currentServiceObj.label}`;
  const whatsappUrl = `https://wa.me/917356526028?text=${encodeURIComponent(waMessage)}`;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      data-lenis-prevent
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6 bg-black/85 backdrop-blur-[12px] animate-booking-backdrop overflow-y-auto select-auto"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Book an Appointment"
    >
      <div className="w-full max-w-[460px] sm:max-w-[540px] md:max-w-[580px] my-auto flex flex-col items-center">
        {/* Top Control Bar: Service Tabs + Close Button */}
        <div className="w-full flex items-center justify-between gap-2 mb-2.5 sm:mb-3 px-0.5">
          {/* Service Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            {SERVICES.map((s) => {
              const isActive = activeTab === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveTab(s.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#F2F0EB] text-[#111111] shadow-md font-semibold"
                      : "bg-[#1f1f1f] text-neutral-300 hover:text-white hover:bg-neutral-800 border border-white/10"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Minimalist Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking popup"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Monolog-Style Editorial Booking Card */}
        <div
          ref={cardRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-[80vh] max-h-[640px] min-h-[460px] bg-[#ddddd5] rounded-[6px] shadow-2xl flex flex-col p-3 sm:p-3.5 pb-0 animate-booking-card overflow-hidden"
          style={{
            backgroundColor: "#ddddd5",
            borderRadius: "0.35rem",
          }}
        >
          {/* Cal.com Booking Widget Area - Light Monolog Theme */}
          <div data-lenis-prevent className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden rounded-[6px] bg-white">
            <Cal
              key={calLink}
              calLink={calLink}
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

        {/* WhatsApp Link Under Card (Monolog Editorial Style) */}
        <div className="mt-3 text-center text-xs text-[#F2F0EB]/80 font-sans tracking-wide">
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
    </div>,
    document.body
  );
}
