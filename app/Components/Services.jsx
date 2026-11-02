"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import BookingModal from "./BookingModal";
import BookingSlider from "./BookingSlider";

const SERVICES = [
  {
    number: "01",
    title: "Haircut",
    id: "haircut",
    image: "/gallery/photo3.jpg",
  },
  {
    number: "02",
    title: "Skin fade",
    id: "skin-fade",
    image: "/gallery/photo4.jpg",
  },
  {
    number: "03",
    title: "Home Service",
    id: "home-service",
    image: "/gallery/photo6.jpg",
  },
];

const Services = forwardRef(function Services({ className = "", onOpenBooking }, ref) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const imageWrapRef = useRef(null);

  const handleOpenBooking = (serviceId = "haircut") => {
    setBookingService(serviceId);
    onOpenBooking?.(serviceId);
  };

  const handleCloseBooking = () => {
    setBookingService(null);
  };

  useEffect(() => {
    const handleOpenFromHeader = (e) => {
      handleOpenBooking(e.detail || "haircut");
    };
    window.addEventListener("open-booking-modal", handleOpenFromHeader);
    return () => {
      window.removeEventListener("open-booking-modal", handleOpenFromHeader);
    };
  }, []);

  // Helper: calculate exact vertical center of target row relative to container
  const getRowCenterY = (index) => {
    const rowEl = rowRefs.current[index];
    const containerEl = containerRef.current;
    if (!rowEl || !containerEl) return 0;
    const rowRect = rowEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    // Exact Monolog formula: rowRect.top - containerRect.top + rowRect.height / 2
    return rowRect.top - containerRect.top + rowRect.height / 2;
  };

  // Position image at the first item initially on mount & handle window resize
  useEffect(() => {
    const updatePosition = () => {
      if (!imageWrapRef.current) return;
      const targetIdx = activeIndex ?? 0;
      const targetY = getRowCenterY(targetIdx);
      gsap.set(imageWrapRef.current, { yPercent: -50, y: targetY });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeIndex]);

  // When hovering a service row: smoothly slide the image card vertically to match it
  const handleMouseEnter = (index) => {
    setActiveIndex(index);
    const imageEl = imageWrapRef.current;
    if (imageEl) {
      const targetY = getRowCenterY(index);
      // Monolog smooth glide
      gsap.to(imageEl, {
        yPercent: -50,
        y: targetY,
        duration: 0.38,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeaveList = () => {
    setActiveIndex(null);
  };

  return (
    <div
      ref={ref}
      id="services"
      data-wave-angle="315"
      style={{ visibility: "hidden" }}
      className={`absolute inset-0 z-40 w-full h-full flex flex-col justify-between px-5 sm:px-10 md:px-16 lg:px-24 py-6 sm:py-10 md:py-14 select-none pointer-events-none opacity-0 ${className}`}
    >
      {/* Main Row: Left side is open for the left-aligned PaUL SerVices background typography;
          Right side holds the services list and the Monolog-style sliding preview card */}
      <div
        ref={containerRef}
        onMouseLeave={handleMouseLeaveList}
        className="w-full flex justify-end items-center my-auto relative pt-36 sm:pt-44 md:pt-48 lg:pt-44 xl:pt-48 pointer-events-auto"
      >
        {/* Services List with Sibling Dimming on Hover */}
        <div data-wave-rows className="w-full border-[#F2F0EB]/15 relative z-10">
          {SERVICES.map((service, index) => {
            const isHovered = activeIndex === index;

            return (
              <div
                key={service.number}
                data-wave-row
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                onClick={() => handleOpenBooking(service.id)}
                onMouseEnter={() => handleMouseEnter(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenBooking(service.id);
                  }
                }}
                className="group flex items-center py-3 sm:py-4 md:py-4 border-b border-[#F2F0EB]/2 cursor-pointer focus:outline-none"
              >
                {/* Number (01, 02, 03) */}
                <span className="w-10 sm:w-16 shrink-0 text-xs sm:text-base font-bold font-sans tracking-wide text-[#F2F0EB]/90">
                  {service.number}
                </span>

                {/* Title (Haircut, Skin fade, Home Service) */}
                <span
                  className={`text-xl sm:text-3xl md:text-5xl lg:text-[4rem] font-bold font-sans tracking-tight text-[#F2F0EB] transition-transform duration-300 ease-out ${
                    isHovered ? "translate-x-3" : "translate-x-0"
                  }`}
                >
                  {service.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Monolog-Style Floating Image Preview Card:
            - Vertically glides with GSAP to center on whichever row is hovered
            - Sits on z-20 so it covers the horizontal border lines cleanly
            - pointer-events-none so mouse movement is never interrupted */}
        <div
          ref={imageWrapRef}
          aria-hidden="true"
          className={`hidden md:block pointer-events-none absolute right-4 lg:right-16 xl:right-24 top-0 w-[200px] lg:w-[180px] xl:w-[200px] aspect-[4/5] rounded-[2px] overflow-hidden  bg-[#121212] z-20 transition-opacity duration-300 ease-out ${
            activeIndex !== null ? "opacity-100" : "opacity-0"
          }`}
        >
          {SERVICES.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={`preview-${service.id}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-400 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 260px, 280px"
                  priority
                />
                {/* Subtle cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom spacer to preserve exact vertical balance */}
      <div className="w-full h-4" />

      {/* Main booking action: Interactive Slider Pill matching reference image */}
      <div className="text-center text-[#111111] pointer-events-auto flex justify-center items-center py-6 sm:py-8 relative">
        <BookingSlider
          onBook={() => handleOpenBooking("haircut")}
          label="Slide to book"
          labelClassName="text-[#111111]" 
        />
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={Boolean(bookingService)}
        selectedService={bookingService}
        serviceKey={bookingService || "haircut"}
        onClose={handleCloseBooking}
      />
    </div>
  );
});

export default Services;
