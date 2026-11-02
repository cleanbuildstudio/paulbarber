"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function BookingSlider({ onBook, label = "Slide to book" }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [maxDrag, setMaxDrag] = useState(160);
  const [isSuccess, setIsSuccess] = useState(false);

  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Measure track and knob to calculate exact maximum travel distance
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    const trackWidth = trackRef.current.clientWidth;
    // Knob is 36px on mobile, 40px on sm/desktop, padding is 4px on each side (8px total)
    const knobWidth = window.innerWidth < 640 ? 36 : 40;
    const padding = 8;
    const max = Math.max(60, trackWidth - knobWidth - padding);
    setMaxDrag(max);
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [updateMetrics]);

  const triggerSuccess = useCallback(() => {
    setIsSuccess(true);
    setDragX(maxDrag);
    dragXRef.current = maxDrag;

    // Haptic pulse on mobile devices if supported
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(40);
      } catch {}
    }

    // Call booking callback
    onBook?.();

    // Reset smoothly after modal opens
    setTimeout(() => {
      setIsSuccess(false);
      setDragX(0);
      dragXRef.current = 0;
    }, 450);
  }, [maxDrag, onBook]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (isSuccess) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX - dragXRef.current;
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || isSuccess) return;
      const clientX = e.touches[0].clientX;
      const currentX = Math.max(0, Math.min(maxDrag, clientX - startXRef.current));
      dragXRef.current = currentX;
      setDragX(currentX);

      // Prevent page scroll during horizontal slider drag
      if (e.cancelable) {
        e.preventDefault();
      }
    },
    [isSuccess, maxDrag]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragXRef.current >= maxDrag * 0.72) {
      triggerSuccess();
    } else {
      setDragX(0);
      dragXRef.current = 0;
    }
  }, [maxDrag, triggerSuccess]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    if (isSuccess || e.button !== 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX - dragXRef.current;

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const currentX = Math.max(0, Math.min(maxDrag, moveEvent.clientX - startXRef.current));
      dragXRef.current = currentX;
      setDragX(currentX);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      if (dragXRef.current >= maxDrag * 0.72) {
        triggerSuccess();
      } else {
        setDragX(0);
        dragXRef.current = 0;
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Click on track: smoothly slide across to complete and book
  const handleTrackClick = (e) => {
    // If the user already dragged, don't double trigger
    if (dragX > 15) return;
    triggerSuccess();
  };

  // Passive: false touch listener on track to prevent screen jitter
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onTouch = (e) => {
      if (isDraggingRef.current && e.cancelable) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", onTouch, { passive: false });
    return () => el.removeEventListener("touchmove", onTouch);
  }, []);

  const progress = maxDrag > 0 ? Math.min(1, dragX / maxDrag) : 0;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className="relative inline-flex items-center justify-between select-none cursor-pointer rounded-full bg-[#F2F0EB] p-1 w-[205px] xs:w-[215px] sm:w-[230px] h-[44px] sm:h-[48px] overflow-hidden shadow-2xl transition-shadow hover:border-[#]/35 active:scale-[0.99]"
      style={{
        touchAction: "none",
      }}
      role="button"
      tabIndex={0}
      aria-label="Slide to book appointment"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerSuccess();
        }
      }}
    >
      {/* Dynamic Slide Trail Fill */}
      <div
        className="absolute left-0 inset-y-0 bg-[#111111]/10 rounded-full pointer-events-none transition-all"
        style={{
          width: `${dragX + (typeof window !== "undefined" && window.innerWidth < 640 ? 40 : 44)}px`,
        }}
      />

      {/* Center Label (Fades gracefully as knob slides across) */}
      <div
        className="absolute inset-0 flex items-center justify-center pl-7 sm:pl-8 pointer-events-none transition-opacity"
        style={{
          opacity: isSuccess ? 0 : Math.max(0, 1 - progress * 1.6),
        }}
      >
        <span className="text-[13px] sm:text-[14px] font-medium text-[#]/95 tracking-normal [#]space-nowrap">
          {label}
        </span>
      </div>

      {/* The Draggable Knob (Exact Monolog / Modern Slider Pill Circle) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-[#F2F0EB] flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing shrink-0"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {isSuccess ? (
          <svg
            className="w-4 h-4 text-[#F2F0EB] animate-scale-up"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-[#F2F0EB] transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        )}
      </div>

     
    </div>
  );
}
