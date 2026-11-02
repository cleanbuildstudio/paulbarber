"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Services from "./Services";
import PaulVector from "./PaulVector";
import BarberVector from "./BarberVector";
import ServicesVector from "./ServicesVector";
import HeroPortraitLoop from "./HeroPortraitLoop";

/**
 * Editorial Gallery Architecture (Inspired by daniellelevitt.com + esrbespoke.au + Figma):
 *
 * Real Scroll Journey with GSAP ScrollTrigger:
 *  - Section 1 (Hero): Straight-line [PaUL] [Profile] [BARber] + bio badge + nav
 *  - Section 2 (Gallery): Centered, stacked PaUL BARber + 12 photos in seamless infinite horizontal drift
 *  - Section 3 (Services): Photos exit simultaneously (Danielle Levitt style), PaUL glides to left guideline,
 *                          BARber crossfades to SerVices, and the numbered services list reveals on the right!
 *  - Section 4 (Footer): Pinned section releases cleanly, flowing naturally down into the Contact / Location / Social footer.
 */

const BACK_PHOTOS = [
  {
    id: "back-1",
    src: "/gallery/photo1.jpg",
    alt: "Skin fade side profile",
    className: "w-[44vw] max-w-[200px] sm:w-[22vw] sm:min-w-[200px] sm:max-w-[280px] aspect-[3/4] top-[8%]",
    leftPercent: 4,
    depth: 14,
  },
  {
    id: "back-4",
    src: "/gallery/photo4.jpg",
    alt: "Mullet fade with beard",
    className: "hidden sm:block w-[30vw] min-w-[280px] max-w-[460px] aspect-[16/10] top-[6%]",
    leftPercent: 44,
    depth: 10,
  },
  {
    id: "back-6",
    src: "/gallery/photo6.jpg",
    alt: "Client in barber chair",
    className: "w-[42vw] max-w-[190px] sm:w-[20vw] sm:min-w-[210px] sm:max-w-[290px] aspect-[4/5] top-[50%]",
    leftPercent: 70,
    depth: 16,
  },
  {
    id: "back-10",
    src: "/gallery/photo10.jpg",
    alt: "Master barber straight razor haircut",
    className: "hidden sm:block w-[29vw] min-w-[280px] max-w-[440px] aspect-[16/10] top-[5%]",
    leftPercent: 124,
    depth: 12,
  },
  {
    id: "back-7",
    src: "/gallery/photo7.jpg",
    alt: "Sharp fade finish",
    className: "w-[40vw] max-w-[180px] sm:w-[19vw] sm:min-w-[200px] sm:max-w-[280px] aspect-[3/4] top-[52%]",
    leftPercent: 182,
    depth: 15,
  },
  {
    id: "back-12",
    src: "/gallery/photo12.jpg",
    alt: "Sharp geometric hairline taper",
    className: "hidden md:block w-[20vw] min-w-[210px] max-w-[290px] aspect-[3/4] top-[9%]",
    leftPercent: 200,
    depth: 18,
  },
];

const FRONT_PHOTOS = [
  {
    id: "front-3",
    src: "/gallery/photo3.jpg",
    alt: "Client in white cape by stairs",
    className: "w-[50vw] max-w-[230px] sm:w-[29vw] sm:min-w-[300px] sm:max-w-[440px] aspect-[16/10] top-[52%]",
    leftPercent: 22,
    depth: 20,
  },
  {
    id: "front-8",
    src: "/gallery/photo8.jpg",
    alt: "Modern textured crop haircut",
    className: "w-[42vw] max-w-[190px] sm:w-[20vw] sm:min-w-[210px] sm:max-w-[300px] aspect-[3/4] top-[10%]",
    leftPercent: 88,
    depth: 24,
  },
  {
    id: "front-9",
    src: "/gallery/photo9.jpg",
    alt: "Barber scissor styling in cape",
    className: "hidden sm:block w-[28vw] min-w-[280px] max-w-[430px] aspect-[16/10] top-[54%]",
    leftPercent: 104,
    depth: 18,
  },
  {
    id: "front-5",
    src: "/gallery/photo5.jpg",
    alt: "Studio taper fade back view",
    className: "hidden sm:block w-[19vw] min-w-[200px] max-w-[280px] aspect-[3/4] top-[47%]",
    leftPercent: 144,
    depth: 22,
  },
  {
    id: "front-2",
    src: "/gallery/photo2.jpg",
    alt: "Textured crop in white cape",
    className: "w-[38vw] max-w-[170px] sm:w-[17vw] sm:min-w-[170px] sm:max-w-[240px] aspect-[9/16] top-[12%]",
    leftPercent: 164,
    depth: 26,
  },
  {
    id: "front-11",
    src: "/gallery/photo11.jpg",
    alt: "Low skin fade crop",
    className: "hidden sm:block w-[28vw] min-w-[280px] max-w-[420px] aspect-[16/10] top-[53%]",
    leftPercent: 218,
    depth: 20,
  },
];

// Brandon Yasin Editorial Mobile Gallery
const MOBILE_GALLERY = [
  { id: "mg-1", number: "01", title: "SKIN FADE", src: "/gallery/photo1.jpg", alt: "Skin fade side profile" },
  { id: "mg-2", number: "02", title: "TEXTURED CROP", src: "/gallery/photo3.jpg", alt: "Modern textured crop" },
  { id: "mg-3", number: "03", title: "MULLET TAPER", src: "/gallery/photo4.jpg", alt: "Mullet fade with beard" },
  { id: "mg-4", number: "04", title: "CHAIR SESSION", src: "/gallery/photo6.jpg", alt: "Client in barber chair" },
  { id: "mg-5", number: "05", title: "SHARP FADE", src: "/gallery/photo7.jpg", alt: "Sharp fade finish" },
  { id: "mg-6", number: "06", title: "CLASSIC CROP", src: "/gallery/photo8.jpg", alt: "Classic textured crop" },
  { id: "mg-7", number: "07", title: "SCISSOR WORK", src: "/gallery/photo9.jpg", alt: "Barber scissor styling" },
  { id: "mg-8", number: "08", title: "RAZOR FINISH", src: "/gallery/photo10.jpg", alt: "Master razor haircut" },
];

const TRIPLE_MOBILE_GALLERY = [...MOBILE_GALLERY, ...MOBILE_GALLERY, ...MOBILE_GALLERY];

export default function Hero() {
  const pinWrapperRef = useRef(null);
  const heroStageRef = useRef(null);
  const bioRef = useRef(null);
  const navRef = useRef(null);
  const profileRef = useRef(null);
  const paulRef = useRef(null);
  const barberRef = useRef(null);
  const barberTextRef = useRef(null);
  const servicesTextRef = useRef(null);

  const backTrackRef = useRef(null);
  const frontTrackRef = useRef(null);
  const servicesRef = useRef(null);

  // Mobile Brandon Yasin Gallery Refs
  const mobileGalleryRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const isMobileUserInteractingRef = useRef(false);
  const mobileDriftRafRef = useRef(null);

  const driftTweenRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // Liquid Warp / Disperse on Hover Refs
  const displacementRef = useRef(null);
  const turbulenceRef = useRef(null);
  const activeCardRef = useRef(null);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });

  // Stable Metrics Cache: measured once at baseline (scroll=0) without layout thrashing
  const baseMetricsRef = useRef(null);

  const getBaseMetrics = () => {
    const pEl = paulRef.current;
    const bEl = barberRef.current;
    if (!pEl || !bEl) return null;

    if (baseMetricsRef.current) {
      return baseMetricsRef.current;
    }

    const prevTransformP = pEl.style.transform;
    const prevTransformB = bEl.style.transform;
    pEl.style.transform = "none";
    bEl.style.transform = "none";

    const pRect = pEl.getBoundingClientRect();
    const bRect = bEl.getBoundingClientRect();

    pEl.style.transform = prevTransformP;
    bEl.style.transform = prevTransformB;

    baseMetricsRef.current = { pRect, bRect };
    return baseMetricsRef.current;
  };

  // Helper 1: Calculate metrics for Section 2 (Center Lockup)
  const getTargetDeltas = () => {
    const metrics = getBaseMetrics();
    if (!metrics)
      return { scale: 1.7, dX_Paul: 0, dY_Paul: 0, dX_Barber: 0, dY_Barber: 0 };

    const { pRect, bRect } = metrics;
    const cx = window.innerWidth / 2;
    // On mobile (<768px), lift PaUL BARber into the upper space so the Brandon Yasin carousel has the entire bottom half!
    const cy =
      window.innerWidth < 768
        ? Math.max(window.innerHeight * 0.21, 115)
        : window.innerHeight / 2;
    const scale = window.innerWidth < 480 ? 1.25 : window.innerWidth < 768 ? 1.42 : 1.7;

    const wP = pRect.width * scale;
    const hP = pRect.height * scale;
    const wB = bRect.width * scale;
    const hB = bRect.height * scale;

    const bLeftOffset = wP * 0.33;
    const bTopOffset = hP * 1.06;

    const totalW = bLeftOffset + wB;
    const totalH = bTopOffset + hB;

    const targetP_left = cx - totalW / 2;
    const targetP_top = cy - totalH / 2;
    const targetB_left = targetP_left + bLeftOffset;
    const targetB_top = targetP_top + bTopOffset;

    const p_centerX = pRect.left + pRect.width / 2;
    const p_centerY = pRect.top + pRect.height / 2;
    const targetP_centerX = targetP_left + wP / 2;
    const targetP_centerY = targetP_top + hP / 2;

    const b_centerX = bRect.left + bRect.width / 2;
    const b_centerY = bRect.top + bRect.height / 2;
    const targetB_centerX = targetB_left + wB / 2;
    const targetB_centerY = targetB_top + hB / 2;

    return {
      scale,
      dX_Paul: targetP_centerX - p_centerX,
      dY_Paul: targetP_centerY - p_centerY,
      dX_Barber: targetB_centerX - b_centerX,
      dY_Barber: targetB_centerY - b_centerY,
    };
  };

  // Helper 2: Calculate metrics for Section 3 (Left-Aligned Lockup matching Figma Desktop - 10)
  const getLeftAlignedDeltas = () => {
    const metrics = getBaseMetrics();
    if (!metrics)
      return { scale: 1.55, dX_Paul: 0, dY_Paul: 0, dX_Barber: 0, dY_Barber: 0 };

    const { pRect, bRect } = metrics;
    const cy = window.innerHeight / 2;
    // Responsive scale for "PaUL SerVices":
    // Clean, proportionate editorial section header across ALL devices:
    // - Mobile (<480px): ~110px-125px wide
    // - Tablet (<768px): ~150px-165px wide
    // - Desktop (<1280px): ~180px-200px wide
    // - Large Desktop (>=1280px): ~210px-230px wide (no more huge overlap!)
    const scale =
      window.innerWidth < 480
        ? 1.4
        : window.innerWidth < 768
        ? 0.75
        : window.innerWidth < 1280
        ? 0.55
        : 0.60;

    const wP = pRect.width * scale;
    const hP = pRect.height * scale;
    const wB = bRect.width * scale;
    const hB = bRect.height * scale;

    const leftMargin =
      window.innerWidth < 480
        ? 20
        : window.innerWidth < 768
        ? 28
        : Math.max(window.innerWidth * 0.04, 48);

    const bLeftOffset = 0;
    const bTopOffset = hP * 0.96;

    const totalH = bTopOffset + hB;

    const targetP_left = leftMargin;
    // Pin cleanly below fixed navigation header (~44-50px tall):
    const targetP_top =
      window.innerWidth < 768
        ? Math.max(window.innerHeight * 0.12, 95)
        : Math.max(window.innerHeight * 0.08, 68);
    const targetB_left = leftMargin + bLeftOffset;
    const targetB_top = targetP_top + bTopOffset;

    const p_centerX = pRect.left + pRect.width / 2;
    const p_centerY = pRect.top + pRect.height / 2;
    const targetP_centerX = targetP_left + wP / 2;
    const targetP_centerY = targetP_top + hP / 2;

    const b_centerX = bRect.left + bRect.width / 2;
    const b_centerY = bRect.top + bRect.height / 2;
    const targetB_centerX = targetB_left + wB / 2;
    const targetB_centerY = targetB_top + hB / 2;

    return {
      scale,
      dX_Paul: targetP_centerX - p_centerX,
      dY_Paul: targetP_centerY - p_centerY,
      dX_Barber: targetB_centerX - b_centerX,
      dY_Barber: targetB_centerY - b_centerY,
    };
  };

  useEffect(() => {
    if (!paulRef.current || !barberRef.current || !pinWrapperRef.current || !heroStageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Infinite Horizontal Movement of Floating Photos
      driftTweenRef.current = gsap.to(
        [backTrackRef.current, frontTrackRef.current],
        {
          xPercent: -50,
          duration: 44,
          ease: "none",
          repeat: -1,
          paused: true,
        }
      );

      const allCards = heroStageRef.current?.querySelectorAll(".gallery-card");

      // 2. Primary ScrollTrigger Timeline pinned at the top
      // Creates a natural, continuous scroll journey:
      //  - 0.0 to 0.35: Section 1 (Hero: Straight line)
      //  - 0.35 to 1.15: Transition to Section 2 (Gallery)
      //  - 1.15 to 2.10: Section 2 Hold (Centered stacked typography & floating cards)
      //  - 2.10 to 2.85: Transition to Section 3 (Services)
      //  - 2.85 to 4.0: Section 3 Hold (Left-aligned typography & interactive services list)
      //  - > 4.0: Pin releases naturally -> smooth flow into Section 4 (Footer)!
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: "top top",
          end: isMobile ? "+=2200" : "+=3600",
          pin: heroStageRef.current,
          scrub: isMobile ? 0.4 : 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Interactive pointer-events & visibility on Services (active throughout Section 3)
            if (servicesRef.current) {
              const isServicesActive = p >= 0.52;
              servicesRef.current.style.pointerEvents = isServicesActive ? "auto" : "none";
              servicesRef.current.style.visibility = isServicesActive ? "visible" : "hidden";
            }

            // Infinite photo drift active during Gallery phase
            if (p >= 0.12 && p <= 0.52) {
              if (driftTweenRef.current?.paused()) {
                driftTweenRef.current.play();
              }
            } else {
              if (!driftTweenRef.current?.paused()) {
                driftTweenRef.current.pause();
              }
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger;

      // STEP 0 -> STEP 1: Hero -> Gallery
      tl.to(
        bioRef.current,
        { opacity: 0, y: -28, duration: 0.45, ease: "power2.inOut" },
        0.35
      ).to(
        profileRef.current,
        { opacity: 0, scale: 0.35, duration: 0.45, ease: "power2.inOut" },
        0.35
      );

      // PaUL & BARber glide into Centered Stacked Lockup
      tl.to(
        paulRef.current,
        {
          x: () => getTargetDeltas().dX_Paul,
          y: () => getTargetDeltas().dY_Paul,
          scale: () => getTargetDeltas().scale,
          duration: 0.8,
          ease: "power3.inOut",
          force3D: false,
        },
        0.38
      ).to(
        barberRef.current,
        {
          x: () => getTargetDeltas().dX_Barber,
          y: () => getTargetDeltas().dY_Barber,
          scale: () => getTargetDeltas().scale,
          duration: 0.8,
          ease: "power3.inOut",
          force3D: false,
        },
        0.38
      );

      // Gallery cards unclip from bottom (Desktop)
      if (allCards && allCards.length > 0) {
        tl.fromTo(
          allCards,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, scale: 1.04 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.03,
            ease: "power2.out",
          },
          0.60
        );
      }

      // Mobile Brandon Yasin gallery strip reveal
      if (mobileGalleryRef.current) {
        tl.fromTo(
          mobileGalleryRef.current,
          { opacity: 0, y: 35, pointerEvents: "none" },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", pointerEvents: "auto" },
          0.58
        );
      }

      // STEP 1 -> STEP 2: Gallery -> Services
      // Danielle Levitt synchronized simultaneous exit of all 12 photos
      if (allCards && allCards.length > 0) {
        tl.to(
          allCards,
          {
            opacity: 0,
            scale: 0.82,
            duration: 0.45,
            ease: "power2.inOut",
          },
          2.10
        );
      }

      if (mobileGalleryRef.current) {
        tl.to(
          mobileGalleryRef.current,
          { opacity: 0, y: 30, duration: 0.45, ease: "power2.inOut", pointerEvents: "none" },
          2.10
        );
      }

      tl.to(
        [backTrackRef.current, frontTrackRef.current],
        {
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
        },
        2.10
      );

      // PaUL & BARber glide to Left Guideline (Figma reference)
      tl.to(
        paulRef.current,
        {
          x: () => getLeftAlignedDeltas().dX_Paul,
          y: () => getLeftAlignedDeltas().dY_Paul,
          scale: () => getLeftAlignedDeltas().scale,
          duration: 0.75,
          ease: "power3.inOut",
          force3D: false,
        },
        2.15
      ).to(
        barberRef.current,
        {
          x: () => getLeftAlignedDeltas().dX_Barber,
          y: () => getLeftAlignedDeltas().dY_Barber,
          scale: () => getLeftAlignedDeltas().scale,
          duration: 0.75,
          ease: "power3.inOut",
          force3D: false,
        },
        2.15
      );

      // BARber text fades out, SerVices vector text reveals smoothly
      tl.to(
        barberTextRef.current,
        {
          opacity: 0,
          y: -8,
          duration: 0.38,
          ease: "power2.inOut",
        },
        2.20
      );

      tl.fromTo(
        servicesTextRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        2.35
      );

      // Services list and "Click Here To Book" fade into view
      tl.fromTo(
        servicesRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        2.40
      );

      // Generous hold plateau for Section 3 so services remain stably pinned and interactive
      tl.to({}, { duration: 1.3 }, 3.7);

    }, pinWrapperRef);

   {/* // Mouse parallax for active gallery photos
    const handleMouseMove = (e) => {
      const trigger = scrollTriggerRef.current;
      if (!trigger) return;
      const p = trigger.progress;
      if (p < 0.2 || p > 0.65) return;

      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
      const allCards = heroStageRef.current?.querySelectorAll(".gallery-card");

      allCards?.forEach((el, idx) => {
        const depth = idx % 3 === 0 ? 12 : idx % 3 === 1 ? 22 : 16;
        gsap.to(el, {
          y: yNorm * depth,
          duration: 0.8,
          ease: "power1.out",
          overwrite: "auto",
        });
      });
    };

    */}

    const handleResize = () => {
      baseMetricsRef.current = null;
      ScrollTrigger.refresh();
    };

    const handleRefreshInit = () => {
      baseMetricsRef.current = null;
    };
    ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

    const handleScrollToServices = () => scrollToServices();

{/*
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
*/}
    // Setup Mobile Brandon Yasin Infinite Horizontal Swipe & Drift
    const scrollEl = mobileScrollRef.current;
    let cleanupMobileScroll = () => {};
    if (scrollEl) {
      const initScroll = () => {
        const sW = scrollEl.scrollWidth / 3;
        if (sW > 0) {
          scrollEl.scrollLeft = sW;
        }
      };
      const tId = setTimeout(initScroll, 80);

      const handleInfiniteScroll = () => {
        const sW = scrollEl.scrollWidth / 3;
        if (sW <= 0) return;
        if (scrollEl.scrollLeft >= sW * 2) {
          scrollEl.scrollLeft -= sW;
        } else if (scrollEl.scrollLeft <= sW * 0.1) {
          scrollEl.scrollLeft += sW;
        }
      };

      scrollEl.addEventListener("scroll", handleInfiniteScroll, { passive: true });

      let isWindowScrolling = false;
      let windowScrollTimer = null;
      const onWindowScroll = () => {
        isWindowScrolling = true;
        clearTimeout(windowScrollTimer);
        windowScrollTimer = setTimeout(() => {
          isWindowScrolling = false;
        }, 180);
      };
      window.addEventListener("scroll", onWindowScroll, { passive: true });

      let lastTime = performance.now();
      const autoDrift = (now) => {
        const dt = now - lastTime;
        lastTime = now;
        if (!isMobileUserInteractingRef.current && !isWindowScrolling && scrollTriggerRef.current) {
          const p = scrollTriggerRef.current.progress;
          if (p >= 0.15 && p <= 0.65) {
            scrollEl.scrollLeft += 0.45 * (dt / 16.67);
          }
        }
        mobileDriftRafRef.current = requestAnimationFrame(autoDrift);
      };
      mobileDriftRafRef.current = requestAnimationFrame(autoDrift);

      cleanupMobileScroll = () => {
        clearTimeout(tId);
        clearTimeout(windowScrollTimer);
        window.removeEventListener("scroll", onWindowScroll);
        scrollEl.removeEventListener("scroll", handleInfiniteScroll);
        if (mobileDriftRafRef.current) {
          cancelAnimationFrame(mobileDriftRafRef.current);
        }
      };
    }

    const handleHashCheck = () => {
      const isHash = typeof window !== "undefined" && window.location.hash === "#services";
      const isSession = typeof window !== "undefined" && sessionStorage.getItem("returnToServices") === "true";
      if (isHash || isSession) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("returnToServices");
        }
        scrollToServices(true);
      }
    };

    handleHashCheck();

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashCheck);
    window.addEventListener("scroll-to-services", handleScrollToServices);

    return () => {
      {/*
        window.removeEventListener("mousemove", handleMouseMove);
        */}
      cleanupMobileScroll();
      ScrollTrigger.removeEventListener("refreshInit", handleRefreshInit);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashCheck);
      window.removeEventListener("scroll-to-services", handleScrollToServices);
      ctx.revert();
      driftTweenRef.current?.kill();
    };
  }, []);

  const handlePhotoMouseEnter = (e) => {
    const card = e.currentTarget;
    activeCardRef.current = card;

    if (driftTweenRef.current) {
// Change 0.18 to 0.6 for a gentle, subtle slowdown
gsap.to(driftTweenRef.current, { timeScale: 0.1, duration: 0.9, overwrite: "auto" });
    }

    // Attach hardware-accelerated liquid warp filter
    card.style.filter = "url(#liquid-warp)";

    // Initial subtle ripple wave (gentle 12px amplitude)
    if (displacementRef.current) {
      gsap.fromTo(
        displacementRef.current,
        { attr: { scale: 0 } },
        {
          attr: { scale: 12 },
          duration: 0.22,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(displacementRef.current, {
              attr: { scale: 3 },
              duration: 0.4,
              ease: "power2.inOut",
            });
          },
        }
      );
    }

    // Gentle hover lift
    gsap.to(card, {
      scale: 1.04,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handlePhotoMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const yNorm = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5

    // Track mouse speed to modulate fluid flex
    const now = performance.now();
    const dt = Math.max(1, now - (lastMousePosRef.current.time || now));
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;   
    const speed = Math.hypot(dx, dy) / dt;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

    // Modulate liquid displacement subtly (capped at 14px max)
    if (displacementRef.current && speed > 0.08) {
      const targetScale = Math.min(14, 3 + speed * 8);
      gsap.to(displacementRef.current, {
        attr: { scale: targetScale },
        duration: 0.15,
        ease: "power1.out",
        overwrite: "auto",
      });
    }

    // 3D Magnetic Tilt (subtle 3-4 deg)
    gsap.to(card, {
      rotateY: xNorm * 7,
      rotateX: -yNorm * 7,
      transformPerspective: 900,
      duration: 0.25,
      ease: "power1.out",
      overwrite: "auto",
    });

    // Parallax depth on inner image
    const img = card.querySelector("img");
    if (img) {
      gsap.to(img, {
        x: -xNorm * 10,
        y: -yNorm * 10,
        scale: 1.08,
        duration: 0.25,
        ease: "power1.out",
        overwrite: "auto",
      });
    }
  };

  const handlePhotoMouseLeave = (e) => {
    const card = e.currentTarget;

    if (driftTweenRef.current) {
      gsap.to(driftTweenRef.current, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    }

    // Smooth spring return to flat resting rectangle
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.65,
      ease: "power2.out",
      overwrite: "auto",
    });

    const img = card.querySelector("img");
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Decay liquid displacement to 0 and remove filter
    if (displacementRef.current) {
      gsap.to(displacementRef.current, {
        attr: { scale: 0 },
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (activeCardRef.current === card) {
            card.style.filter = "none";
            activeCardRef.current = null;
          }
        },
      });
    }
  };

  const scrollToServices = (instant = false) => {
    const performScroll = () => {
      const st = scrollTriggerRef.current;
      if (!st) return false;
      if (!st.end || st.end <= st.start) {
        ScrollTrigger.refresh();
      }
      if (!st.end || st.end <= st.start) return false;

      const targetScroll = st.start + (st.end - st.start) * 0.68;
      window.scrollTo({
        top: targetScroll,
        behavior: instant ? "auto" : "smooth",
      });
      return true;
    };

    if (!performScroll()) {
      setTimeout(performScroll, 60);
      setTimeout(performScroll, 180);
      setTimeout(performScroll, 400);
    }
  };

  return (
    <div
      id="top"
      ref={pinWrapperRef}
      data-wave-angle="225"
      className="relative w-full max-w-full bg-transparent overflow-x-clip"
    >   
      {/* Pinned Stage Container */}
      <div
  ref={heroStageRef}
  onMouseEnter={() => {
    if (driftTweenRef.current) {
      gsap.to(driftTweenRef.current, { timeScale: 0.6, duration: 0.5, overwrite: "auto" });
    }   
  }}
  onMouseLeave={() => {
    if (driftTweenRef.current) {
      gsap.to(driftTweenRef.current, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    }
  }}
  className="relative w-full h-screen bg-transparent text-[#F2F0EB] overflow-hidden select-none pointer-events-auto"
>
        {/* Bottom Section - Bio & Baseline Info */}
          <header
            ref={bioRef}
            className="absolute bottom-0 inset-x-0 w-full flex justify-between items-end gap-3 sm:gap-6 z-40 pointer-events-none transition-opacity px-4 pb-3.5 sm:px-8 sm:pb-6 md:px-12 md:pb-8"
          >
            <div className="pointer-events-auto shrink-0">
              <p className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] md:text-[13px] tracking-wider uppercase font-medium text-white/80 leading-tight whitespace-nowrap">
                HAIR AND BEAUTY
              </p>
            </div>

            <div className="pointer-events-auto max-w-[145px] xs:max-w-[175px] sm:max-w-[320px] md:max-w-[420px]">
              <p className="text-[8px] xs:text-[9px] sm:text-[11px] md:text-[13px] lg:text-[14px] font-normal text-white/80 leading-[1.25] text-right sm:text-left">
                Clean cuts, honest conversation, zero judgement. Sharp taper or wild curls, I&apos;ll make it yours. Come as you are.
              </p>
            </div>

            <div className="pointer-events-auto hidden sm:block shrink-0">
              <p className="text-[11px] sm:text-[12px] md:text-[13px] tracking-wider uppercase font-medium text-white/80 leading-tight">
                BARBARESH
              </p>
            </div>
          </header>



        {/* LAYER 1: BACK TRACK (z-10, UNDER PaUL BARber Text, Desktop Only) */}
        <div
          ref={backTrackRef}
          className="hidden md:flex absolute inset-0 pointer-events-none z-10 w-[480vw] h-full items-center will-change-transform transition-opacity"
        >
          {[0, 1].map((cycle) => (
            <div key={`back-cycle-${cycle}`} className="relative w-[240vw] h-full shrink-0">
              {BACK_PHOTOS.map((photo) => (
                <div
                  key={`back-${cycle}-${photo.id}`}
                  onMouseEnter={handlePhotoMouseEnter}
                  onMouseLeave={handlePhotoMouseLeave}
                  style={{
                    left: `${photo.leftPercent}vw`,
                    clipPath: "inset(100% 0% 0% 0%)",
                  }}
                  className={`gallery-card group absolute overflow-hidden shadow-2xl opacity-0 hover:z-50 pointer-events-auto cursor-pointer ${photo.className}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 40vw, (max-width: 1280px) 30vw, 25vw"
                    priority
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LAYER 2: CENTER / LEFT TEXT (z-20, PaUL BARber Typography) */}
        <section className="w-full h-screen flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 relative z-20 pointer-events-none">
          <div className="w-full max-w-[1440px] flex items-center justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-8 relative">
            <div
              ref={paulRef}
              className="w-[30%] sm:w-[28%] md:w-[27%] lg:w-[26%] max-w-[420px] shrink-0 text-[#F2F0EB] origin-center"
            >
              <PaulVector className="w-full h-auto block" fill="#F2F0EB" />
            </div>

            <div
              ref={profileRef}
              className="w-[16%] sm:w-[14%] md:w-[13%] lg:w-[12%] max-w-[185px] shrink-0 origin-center"
            >
              <div className="relative aspect-[172/113] w-full overflow-hidden bg-black/60 shadow-md">
                <HeroPortraitLoop />
              </div>
            </div>

            <div
              ref={barberRef}
              className="w-[38%] sm:w-[36%] md:w-[35%] lg:w-[34%] max-w-[540px] shrink-0 text-[#F2F0EB] origin-center relative"
            >
              {/* 1. BARber text (visible in State 0 & 1, fades out in State 2) */}
              <div ref={barberTextRef} className="w-full h-auto">
                <BarberVector className="w-full h-auto block" fill="#F2F0EB" />
              </div>

              {/* 2. SerVices text (hidden in State 0 & 1, reveals in State 2) */}
              <div
                ref={servicesTextRef}
                className="w-full h-auto absolute top-0 left-0 opacity-0 pointer-events-none"
              >
                <ServicesVector className="w-full h-auto block" fill="#F2F0EB" />
              </div>
            </div>
          </div>
        </section>

        {/* LAYER 3: FRONT TRACK (z-30, OVER PaUL BARber Text, Desktop Only) */}
        <div
          ref={frontTrackRef}
          className="hidden md:flex absolute inset-0 pointer-events-none z-30 w-[480vw] h-full items-center will-change-transform transition-opacity"
        >
          {[0, 1].map((cycle) => (
            <div key={`front-cycle-${cycle}`} className="relative w-[240vw] h-full shrink-0">
              {FRONT_PHOTOS.map((photo) => (
                <div
                  key={`front-${cycle}-${photo.id}`}
                  onMouseEnter={handlePhotoMouseEnter}
                  onMouseMove={handlePhotoMouseMove}
                  onMouseLeave={handlePhotoMouseLeave}
                  style={{
                    left: `${photo.leftPercent}vw`,
                    clipPath: "inset(100% 0% 0% 0%)",
                  }}
                  className={`gallery-card group absolute overflow-hidden shadow-2xl opacity-0 hover:z-50 pointer-events-auto cursor-pointer ${photo.className}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 40vw, (max-width: 1280px) 30vw, 25vw"
                    priority
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LAYER 3-B: MOBILE BRANDON YASIN INFINITE GALLERY (z-30, Mobile only < md) */}
        <div
          ref={mobileGalleryRef}
          className="md:hidden absolute bottom-6 sm:bottom-8 inset-x-0 z-30 pointer-events-none opacity-0 flex flex-col gap-2.5"
        >
          {/* Swipeable Carousel Track with infinite momentum touch */}
          <div
            ref={mobileScrollRef}
            onTouchStart={() => {
              isMobileUserInteractingRef.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                isMobileUserInteractingRef.current = false;
              }, 1200);
            }}
            className="w-full overflow-x-auto scrollbar-none pointer-events-auto flex gap-3.5 px-4 py-1 touch-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TRIPLE_MOBILE_GALLERY.map((item, idx) => (
              <div
                key={`mob-card-${item.id}-${idx}`}
                className="shrink-0 w-[74vw] xs:w-[70vw] sm:w-[60vw] max-w-[320px] flex flex-col gap-2 select-none active:scale-[0.98] transition-transform"
              >
                {/* Minimal Editorial Title above Image (Brandon Yasin style) */}
                <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-semibold text-[#F2F0EB]/90 uppercase px-0.5 tracking-wider">
                  <span className="truncate">{item.title}</span>
                  <span className="text-[#F2F0EB]/40 font-mono text-[10px] tracking-normal">{item.number}</span>
                </div>

                {/* Tall Portrait Card */}
                <div className="relative aspect-[3/4] w-full rounded-[3px] overflow-hidden bg-neutral-900 border border-white/15 shadow-2xl">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 640px) 75vw, 320px"
                    priority={idx < 4}
                  />
                  {/* Subtle editorial gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          
        </div>

        {/* LAYER 4: SERVICES SECTION (z-40, Appears with PaUL SerVices left-aligned in background) */}
        <Services ref={servicesRef} />

        {/* SVG Liquid Disperse / Jelly Warp Filter Definition */}
        <svg
          className="pointer-events-none fixed top-0 left-0 w-0 h-0 overflow-hidden"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="liquid-warp"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency="0.012 0.016"
                numOctaves="1"
                result="noise"
              />
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="noise"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

       
      </div>
    </div>
  );
}
