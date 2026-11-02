"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Frames can be string paths or objects with custom position:
// e.g. "object-top", "object-[center_10%]", "object-center", etc.
export const HERO_PORTRAIT_FRAMES = [
  { src: "/profile/profile1.jpg", position: "object-top" },
  { src: "/profile/profile2.jpg", position: "object-top" },
  { src: "/profile/profile3.jpg", position: "object-center" },
];

export default function HeroPortraitLoop({
  frames = HERO_PORTRAIT_FRAMES,
  interval = 3500, // Calm interval per photo
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!frames || frames.length <= 1) return;

    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, interval);

    return () => clearInterval(timer);
  }, [frames, interval]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {frames.map((item, idx) => {
        const src = typeof item === "string" ? item : item.src;
        const position = typeof item === "string" ? "object-top" : item.position || "object-top";
        const isActive = idx === currentIndex;

        return (
          <div
            key={`portrait-frame-${src}-${idx}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 w-full h-full ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={src}
              alt={`Paul frame ${idx + 1}`}
              fill
              className={`object-cover ${position} grayscale contrast-115 brightness-95`}
              sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 12vw"
              priority
            />
          </div>
        );
      })}
    </div>
  );
}
