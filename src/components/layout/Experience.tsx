"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const lenis = useLenis();

  // Lock scroll forcefully while the animation acts as a video
  useEffect(() => {
    if (isPlaying) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    // Fallback native scroll lock for devices where Lenis might not fully hijack
    const lockScroll = (e: Event) => {
      if (isPlaying) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    if (isPlaying) {
      window.addEventListener('wheel', lockScroll, { passive: false });
      window.addEventListener('touchmove', lockScroll, { passive: false });
      window.addEventListener('keydown', lockScroll, { passive: false });
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener('wheel', lockScroll);
      window.removeEventListener('touchmove', lockScroll);
      window.removeEventListener('keydown', lockScroll);
    };
  }, [isPlaying, lenis]);

  useGSAP(() => {
    let hasPlayed = false;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setIsPlaying(false);
        gsap.set(".experience-overlay", { display: "none" }); // Remove overlay entirely
        gsap.set("#experience-heading", { opacity: 1 });
        gsap.set(".experience-content-body", { opacity: 1, y: 0 });
      }
    });

    gsap.set("#experience-heading", { opacity: 0 });
    gsap.set(".experience-content-body", { opacity: 0, y: 30 });

    // 1. Fade in Overlay (Starts Orange)
    tl.to(".experience-overlay", { 
      opacity: 1, 
      duration: 0.3,
      onComplete: () => {
        if (lenis && containerRef.current) {
          lenis.scrollTo(containerRef.current, { immediate: true });
        } else if (containerRef.current) {
          const topPosition = containerRef.current.getBoundingClientRect().top || 0;
          window.scrollBy({ top: topPosition, behavior: "instant" });
        }
      }
    });

    // 2. Inversion (Orange Background turns White, White Text turns into Hollow Orange Outline)
    tl.to(".experience-overlay", {
      backgroundColor: "#ffffff",
      duration: 0.5,
      ease: "power2.inOut"
    }, "+=0.1");

    tl.to(".journey-center", {
      color: "transparent",
      WebkitTextStroke: "2px #fd4107",
      duration: 0.5,
      ease: "power2.inOut"
    }, "<");

    // 3. Spawning duplicates (They start hollow orange natively via inline styles)
    tl.to(".journey-duplicate", {
      yPercent: (index) => {
        if (index === 0) return -160;
        if (index === 1) return -80;
        if (index === 2) return 80;
        if (index === 3) return 160;
        return 0;
      },
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "+=0.1");

    // 4. Hold
    tl.to({}, { duration: 0.3 });

    // 5. Collapse duplicates
    tl.to(".journey-duplicate", {
      yPercent: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });

    // 6. Center word fills with solid orange
    tl.to(".journey-center", {
      color: "#fd4107",
      WebkitTextStroke: "0px #fd4107",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 7. Morph text to real heading position while fading background
    tl.addLabel("morph", "+=0.1");

    tl.to(".experience-overlay", {
      backgroundColor: "transparent",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to(".journey-center", {
      x: () => {
        const h = document.querySelector("#experience-heading");
        const c = document.querySelector(".journey-center");
        if (!h || !c) return "+=0";
        const deltaX = h.getBoundingClientRect().left - c.getBoundingClientRect().left;
        return "+=" + deltaX;
      },
      y: () => {
        const h = document.querySelector("#experience-heading");
        const c = document.querySelector(".journey-center");
        if (!h || !c) return "+=0";
        const deltaY = h.getBoundingClientRect().top - c.getBoundingClientRect().top;
        return "+=" + deltaY;
      },
      scale: () => {
        const h = document.querySelector("#experience-heading");
        const c = document.querySelector(".journey-center");
        return (h && c) ? h.getBoundingClientRect().width / c.getBoundingClientRect().width : 1;
      },
      transformOrigin: "left top",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    // Crossfade real heading with animated text to hide any sub-pixel layout shifts
    tl.to("#experience-heading", { opacity: 1, duration: 0.1 }, "morph+=0.5");
    tl.to(".journey-center", { opacity: 0, duration: 0.1 }, "morph+=0.5");

    tl.to("#main-navbar", {
      yPercent: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "morph+=0.4");

    // 8. Fade in the rest of the content beautifully AFTER text morph
    tl.to(".experience-content-body", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out"
    }, "morph+=0.5");

    // Scroll trigger to start the video
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 10%", // Trigger when section almost fills the view
      onEnter: () => {
        if (typeof window !== "undefined" && window.__isNavigating) {
          hasPlayed = true;
          gsap.set(".experience-overlay", { display: "none" });
          gsap.set("#experience-heading", { opacity: 1 });
          gsap.set(".experience-content-body", { opacity: 1, y: 0 });
          return;
        }

        if (!hasPlayed) {
          hasPlayed = true;
          setIsPlaying(true);
          tl.play();
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="experience" className="relative w-full bg-white pb-24 pt-32 md:pt-40">

      {/* 
        FIXED FULL-SCREEN OVERLAY VIDEO
        Starts with solid Orange background (#fd4107)
      */}
      <div className="experience-overlay fixed inset-0 z-[100] bg-[#fd4107] flex items-center justify-center opacity-0 pointer-events-none" style={{ display: "flex" }}>

        {/* Container for the stacked words */}
        <div className="relative flex items-center justify-center w-full h-full">

          {/* Top Duplicates (Hollow Orange) */}
          {[0, 1].map((i) => (
            <h2
              key={`above-${i}`}
              className="journey-duplicate absolute text-[15vw] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] uppercase leading-none opacity-0 tracking-tighter font-futura"
              style={{ color: "transparent", WebkitTextStroke: "2px #fd4107" }}
            >
              Journey
            </h2>
          ))}

          {/* Center Main Word (Starts Solid White) */}
          <h2
            className="journey-center absolute text-[15vw] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] uppercase leading-none tracking-tighter font-futura text-white"
            style={{ WebkitTextStroke: '0px' }}
          >
            Journey
          </h2>

          {/* Bottom Duplicates (Hollow Orange) */}
          {[2, 3].map((i) => (
            <h2
              key={`below-${i}`}
              className="journey-duplicate absolute text-[15vw] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] uppercase leading-none opacity-0 tracking-tighter font-futura"
              style={{ color: "transparent", WebkitTextStroke: "2px #fd4107" }}
            >
              Journey
            </h2>
          ))}

        </div>
      </div>

      {/* 
        ACTUAL EXPERIENCE LIST SECTION
        Spacing tightened for a cleaner, premium look
      */}
      <div className="experience-content w-full max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h2 id="experience-heading" className="text-5xl md:text-[6rem] text-[#fd4107] uppercase leading-[0.8] tracking-tighter font-futura opacity-0">
            Journey
          </h2>
        </div>

        {/* Content that fades in AFTER animation */}
        <div className="experience-content-body">
          <p className="font-serif italic text-lg md:text-2xl text-[#111] ml-1 mb-8">
            The complete story starts here.
          </p>

          <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

          {/* Experience Items */}
          <div className="flex flex-col gap-8">

          {/* Item 1 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">01</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Vice Chair</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">IEEE</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">March 2026 - Present</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Leading executive operations for IEEE Sreyas&apos;s main committee, coordinating across departments serving 500+ student members. Deputizing for the Chair in strategic planning, event execution, and inter-department alignment — ensuring zero operational gaps.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">02</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Executive Producer</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">TEDxSreyas</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">December 2025 - July 2026</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Serving as Executive Producer for TEDxSreyas, overseeing vision, team leadership, and full-event strategy for a licensed TEDx event. Directing a multi-functional team across content, production, design, and logistics — setting the standard for execution quality.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">03</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Graphic Designer</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">ViharaTech</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">December 2025 - March 2026</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Produced brand-consistent visual assets for social media, marketing campaigns, and promotional materials. Collaborated cross-functionally to convert brand briefs into high-quality design deliverables under tight deadlines. Maintained visual identity standards across all output.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">04</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Marketing Graphic Designer</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">Vantixio</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">November 2025 - February 2026</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Designed marketing creatives for digital campaigns and social media, ensuring alignment with brand guidelines and campaign goals. Supported content planning and creative strategy alongside the marketing team, improving visual storytelling and audience engagement.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">05</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Production Lead</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">TEDxSreyas</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">February 2025 - June 2025</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Led all technical and visual production for TEDxSreyas: stage design, AV setup, live show coordination, and post-production. Managed a crew of technical volunteers across lighting, audio, and video — delivering a zero-incident live event synced to TEDx standards.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 6 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">06</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Public Relations Officer</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">SREYAS INST.</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">August 2024 - June 2025</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Organized and promoted student council events, managing outreach to maximize participation across the campus community. Led coordination between multiple internal teams to ensure smooth execution of high-visibility events and built strategic media engagements.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

          {/* Item 7 */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-2xl font-futura text-black">07</span>
                <h3 className="text-2xl font-futura tracking-wide text-black font-bold">Webmaster</h3>
                <span className="bg-[#111] text-white text-[0.60rem] font-bold px-2 py-1 uppercase tracking-wider ml-2 rounded-sm font-glacial">IEEE</span>
              </div>
              <span className="text-gray-400 font-medium text-base mt-2 md:mt-0 font-glacial tracking-wide">June 2024 - March 2026</span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-4xl font-glacial tracking-wide">
              Owned end-to-end web operations for IEEE Sreyas — design, production, maintenance, and UX improvements. Created and shipped 20+ campaign graphics balancing information architecture with visual design, contributing to measurable increase in event engagement.
            </p>
            <div className="w-full h-[1px] bg-gray-100 mt-8"></div>
          </div>

        </div>
        </div>
      </div>

    </section>
  );
}
