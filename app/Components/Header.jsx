"use client";

import Link from "next/link";

export default function Header() {
  const handleServicesClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("scroll-to-services"));
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: "haircut" }));
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full max-w-full flex justify-end items-center p-3 sm:p-5 md:p-6 z-50 pointer-events-none">
      {/* Sleek Navigation Capsule */}
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto inline-flex items-center gap-3 sm:gap-4 md:gap-5 select-none"
      >
        {/* Services Link */}
        <button
          type="button"
          onClick={handleServicesClick}
          className="group relative inline-flex items-center cursor-pointer select-none py-1 focus:outline-none"
        >
          <div className="overflow-hidden h-[12px] sm:h-[14px] md:h-[15px] flex flex-col justify-start">
            <span className="block text-white text-[10px] sm:text-xs md:text-[13px] font-montserrat transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:-translate-y-full">
              Services
            </span>
            <span
              className="block text-white text-[10px] sm:text-xs md:text-[13px] font-montserrat transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:-translate-y-full select-none"
              aria-hidden="true"
            >
              Services
            </span>
          </div>
        </button>

        {/* Inset Sub-Tile: Compact Book Now Ticket */}
        <button
          type="button"
          onClick={handleBookClick}
          className="group relative inline-flex items-center gap-1.5 sm:gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-[2px] bg-[#e8e8e3] transition-all duration-300 active:scale-[0.96] cursor-pointer select-none focus:outline-none"
        >
          {/* Rolling Text */}
          <div className="overflow-hidden h-[12px] sm:h-[14px] md:h-[15px] flex flex-col justify-start">
            <span className="block text-[#080807] text-[10px] sm:text-xs md:text-[13px] font-montserrat font-medium transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:-translate-y-full">
              Book Now
            </span>
            <span
              className="block text-[#080807] text-[10px] sm:text-xs md:text-[13px] font-montserrat font-medium transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:-translate-y-full select-none"
              aria-hidden="true"
            >
              Book Now
            </span>
          </div>

          {/* Aside Square Badge */}
          <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-[2px] bg-[#080807] flex items-center justify-center overflow-hidden transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:scale-[0.88]">
            {/* Primary Arrow */}
            <svg
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white absolute transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-0"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2.5" y1="9.5" x2="9.5" y2="2.5" />
              <polyline points="4.5 2.5 9.5 2.5 9.5 7.5" />
            </svg>

            {/* Secondary Arrow */}
            <svg
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white absolute -translate-x-6 translate-y-6 opacity-0 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.35,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2.5" y1="9.5" x2="9.5" y2="2.5" />
              <polyline points="4.5 2.5 9.5 2.5 9.5 7.5" />
            </svg>
          </div>
        </button>
      </nav>
    </header>
  );
}
