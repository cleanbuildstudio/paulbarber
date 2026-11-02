"use client";

import React, { useEffect, useRef, useState } from "react";

// Text mask component replicating the smooth Matthieu Givelet scroll reveal
function RevealLine({ children, isVisible, delay = 0, className = "" }) {
  return (
    <span className="block overflow-hidden py-[2px]">
      <span
        className={`inline-block transition-transform duration-[1100ms] ease-[cubic-bezier(0.18,0.66,0.18,1)] will-change-transform ${className}`}
        style={{
          transform: isVisible ? "translateY(0%)" : "translateY(115%)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15, // Triggers when 15% of the footer is visible on screen
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer 
      ref={footerRef}
      data-wave-angle="225"
      className="w-full max-w-full overflow-hidden min-h-screen bg-transparent text-[#F2F0EB] px-6 pt-16 pb-10 sm:px-10 sm:pt-20 md:px-14 md:pt-24 md:pb-14 flex flex-col justify-between selection:bg-[#FF3B1D] selection:text-[#F2F0EB] font-sans"
    >
      
      {/* Main Editorial Body (Danielle Levitt Staggered Layout) */}
      <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
        
        {/* Section 1: Contact (Offset to the Right) */}
        <div className="md:ml-[30%] lg:ml-[36%] flex flex-col items-start max-w-full">
          <RevealLine isVisible={isVisible} delay={100}>
            <span className="text-xs sm:text-sm font-bold uppercase text-neutral-400 mb-2.5">
              Contact:
            </span>
          </RevealLine>
          
          <div className="flex flex-col font-bold leading-[1.02]">
            <RevealLine isVisible={isVisible} delay={180}>
              <a 
                href="tel:7356526028" 
                className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl hover:opacity-75 transition-opacity whitespace-nowrap"
              >
                (91) 73565 26028
              </a>
            </RevealLine>
            <RevealLine isVisible={isVisible} delay={260}>
              <a 
                href="mailto:hello@barbaresh.com" 
                className="text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl mt-1.5 hover:text-[#FF3B1D] transition-colors whitespace-nowrap"
              >
                hello@barbaresh.com
              </a>
            </RevealLine>
          </div>
        </div>

        {/* Section 2: Location (Offset to the Left) */}
        <div className="md:ml-[4%] lg:ml-[6%] max-w-3xl flex flex-col items-start">
          <RevealLine isVisible={isVisible} delay={200}>
            <span className="text-xs sm:text-sm font-bold uppercase text-neutral-400 mb-2.5">
              Location:
            </span>
          </RevealLine>
          
          <address className="not-italic text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] flex flex-col text-white max-w-full">
            <RevealLine isVisible={isVisible} delay={280}>
              <span className="break-words sm:whitespace-nowrap">Kurisadi Road, Near Arthunkal</span>
            </RevealLine>
            <RevealLine isVisible={isVisible} delay={360}>
              <span className="break-words sm:whitespace-nowrap">Village Office, Arthunkal,</span>
            </RevealLine>
            <RevealLine isVisible={isVisible} delay={440}>
              <span className="break-words sm:whitespace-nowrap">Alappuzha 688530, Kerala</span>
            </RevealLine>
          </address>
        </div>

        {/* Section 3: Social Links (Offset to Far Right) */}
        <div className="md:ml-[48%] lg:ml-[54%] flex flex-col items-start">
          <RevealLine isVisible={isVisible} delay={300}>
            <span className="text-xs sm:text-sm font-bold uppercase text-neutral-400 mb-2.5">
              Social:
            </span>
          </RevealLine>

          <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] flex flex-col">
            <RevealLine isVisible={isVisible} delay={380}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-[#FF3B1D] transition-colors inline-block whitespace-nowrap"
              >
                Instagram
              </a>
            </RevealLine>
            <RevealLine isVisible={isVisible} delay={460}>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-[#FF3B1D] transition-colors inline-block whitespace-nowrap mt-1"
              >
                YouTube
              </a>
            </RevealLine>
          </div>
        </div>

      </div>

      {/* Bottom Subtle Bar */}
      <div className="w-full flex flex-col xs:flex-row justify-between items-start xs:items-end gap-2 xs:gap-0 pt-16 sm:pt-20 text-[11px] sm:text-xs md:text-sm font-bold uppercase text-neutral-500">
        <RevealLine isVisible={isVisible} delay={520}>
          <span>© 2026 BARBARESH</span>
        </RevealLine>
        <RevealLine isVisible={isVisible} delay={580}>
          <span>ALL RIGHTS RESERVED</span>
        </RevealLine>
      </div>

    </footer>
  );
}