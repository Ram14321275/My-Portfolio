"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import Scene from "@/components/3d/Scene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutMe from "@/components/layout/AboutMe";
import Experience from "@/components/layout/Experience";
import Projects from "@/components/layout/Projects";
import Designs from "@/components/layout/Designs";
import Artworks from "@/components/layout/Artworks";
import Contact from "@/components/layout/Contact";

declare global {
  interface Window {
    __isNavigating?: boolean;
  }
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Ensure we start at the top, without fighting ScrollTrigger during mount
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let refreshTimer: number | null = null;

    const scheduleRefresh = () => {
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
      }

      refreshTimer = window.setTimeout(() => {
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 120);
    };

    const handleAssetLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) {
        scheduleRefresh();
      }
    };

    const resizeObserver = new ResizeObserver(scheduleRefresh);

    if (mainRef.current) {
      resizeObserver.observe(mainRef.current);
    }

    window.addEventListener("load", scheduleRefresh);
    document.addEventListener("load", handleAssetLoad, true);
    scheduleRefresh();

    return () => {
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
      }
      resizeObserver.disconnect();
      window.removeEventListener("load", scheduleRefresh);
      document.removeEventListener("load", handleAssetLoad, true);
    };
  }, []);

  return (
    <main ref={mainRef} className="relative min-h-screen w-full bg-white overflow-x-hidden">
      <Header />
      {/* Hero / Top Section Wrapper */}
      <div className="relative flex w-full max-w-[1920px] mx-auto h-screen">
        <Hero />
        <Scene />
      </div>

      {/* About Me Section */}
      <AboutMe />
      <Experience />
      <Projects />
      <Designs />
      <Artworks />
      <Contact />
    </main>
  );
}
