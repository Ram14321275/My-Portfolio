"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiGithub, FiExternalLink, FiX, FiAlertCircle } from "react-icons/fi";
import { useLenis } from "lenis/react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- PROJECT DATA ---
type ProjectData = {
  badge: string;
  title: string;
  desc: string;
  fullDesc: string;
  github: string;
  demo: string;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
  overlayFrom: string;
  image: string;
};

const PROJECTS: ProjectData[] = [
  {
    badge: "AI / ML",
    title: "Aegis Earth",
    desc: "Disaster intelligence & monitoring platform.",
    fullDesc: "**Aegis Earth** is an AI-powered geospatial disaster intelligence platform that analyzes satellite imagery to detect natural hazards and deliver real-time risk insights through interactive visualizations.",
    github: "https://github.com/Ram14321275/aegis-earth", demo: "#",
    bgFrom: "#0a0a0a", bgVia: "#4a4a4a", bgTo: "#cccccc", overlayFrom: "#ff9808",
    image: "/images/projects/aegis_earth.png"
  },
  {
    badge: "Healthcare",
    title: "Eldercare AI",
    desc: "AI-powered healthcare companion.",
    fullDesc: "Eldercare AI is an AI-powered healthcare companion designed to support elderly individuals through intelligent assistance, personalized health guidance, medication reminders, and an intuitive, accessible user experience that promotes independent and connected living.",
    github: "https://github.com/Ram14321275/medcare-app", demo: "https://medcare-app-phi.vercel.app/",
    bgFrom: "#3b82f6", bgVia: "#10b981", bgTo: "#fcd34d", overlayFrom: "#ffffff",
    image: "/images/projects/eldercare_ai.png"
  },
  {
    badge: "AI Assistant",
    title: "Therapy AI",
    desc: "Virtual healthcare assistant for symptom support.",
    fullDesc: "THERAPY AI is an AI-powered virtual healthcare assistant that provides personalized health guidance, symptom support, and intelligent patient interaction through a conversational interface, making healthcare information more accessible and user-friendly.",
    github: "https://github.com/Ram14321275/Therapy-AI", demo: "#",
    bgFrom: "#ff9808", bgVia: "#ffb44a", bgTo: "#ffd2c2", overlayFrom: "#3b82f6",
    image: "/images/projects/therapy_ai.png"
  },
  {
    badge: "System Design",
    title: "EarthnFlow",
    desc: "Autonomous multi-agent AI platform.",
    fullDesc: "EarthnFlow is an autonomous multi-agent AI execution platform that orchestrates specialized AI agents to plan, develop, test, and execute complex workflows through intelligent task routing, distributed orchestration, and scalable system architecture.",
    github: "#", demo: "#",
    bgFrom: "#8b5cf6", bgVia: "#ec4899", bgTo: "#f43f5e", overlayFrom: "#ffffff",
    image: "/images/projects/earthnflow.png"
  },
  {
    badge: "Web App",
    title: "Online Voting System",
    desc: "Secure web-based election platform.",
    fullDesc: "Online Voting System is a secure web-based voting platform that streamlines the election process through authenticated user access, efficient vote management, and real-time result generation while ensuring transparency and reliability.",
    github: "https://github.com/Ram14321275/Online-Voting-System", demo: "#",
    bgFrom: "#14b8a6", bgVia: "#06b6d4", bgTo: "#3b82f6", overlayFrom: "#000000",
    image: "/images/projects/online_voting.png"
  },
  {
    badge: "Java App",
    title: "WeatherForecast",
    desc: "Real-time desktop weather application.",
    fullDesc: "Weather Forecast Application is a Java-based desktop application that delivers real-time weather updates, temperature forecasts, humidity, and wind conditions by integrating with the OpenWeatherMap API through an intuitive and responsive user interface.",
    github: "https://github.com/Ram14321275?tab=repositories", demo: "#",
    bgFrom: "#f43f5e", bgVia: "#f59e0b", bgTo: "#10b981", overlayFrom: "#ffffff",
    image: "/images/projects/weather_forecast.png"
  }
];


export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);

  const lenis = useLenis();

  // Arrow Controls
  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Lock scroll forcefully while the animation acts as a video, OR if the modal is open
  useEffect(() => {
    if (isPlaying || selectedProject) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    // Fallback native scroll lock
    const lockScroll = (e: Event) => {
      if (isPlaying || selectedProject) {
        // Only block if trying to scroll the background (allow scrolling inside the modal)
        const target = e.target as HTMLElement;
        if (!target.closest('.modal-scrollable-content')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };
    if (isPlaying || selectedProject) {
      window.addEventListener('wheel', lockScroll, { passive: false });
      window.addEventListener('touchmove', lockScroll, { passive: false });
      // We don't block keydown for modal so they can still type/tab, only for video
      if (isPlaying) {
        window.addEventListener('keydown', lockScroll, { passive: false });
      }
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener('wheel', lockScroll);
      window.removeEventListener('touchmove', lockScroll);
      window.removeEventListener('keydown', lockScroll);
    };
  }, [isPlaying, selectedProject, lenis]);

  // GSAP Animation Sequence
  useGSAP(() => {
    let hasPlayed = false;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setIsPlaying(false);
        gsap.set(".projects-overlay", { display: "none" }); // Remove overlay entirely
        gsap.set("#projects-heading", { opacity: 1 });
        gsap.set(".projects-content-body", { opacity: 1, y: 0 });
      }
    });

    gsap.set("#projects-heading", { opacity: 0 });
    gsap.set(".projects-content-body", { opacity: 0, y: 30 });

    // 1. Hide Navbar and Fade in Overlay (Starts White)
    tl.to("#main-navbar", { yPercent: -150, duration: 0.3 });
    tl.to(".projects-overlay", { 
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
    }, "<");

    // 2. Inversion (White Background turns Orange, Orange Text turns into Hollow White Outline)
    tl.to(".projects-overlay", {
      backgroundColor: "#ff9808",
      duration: 0.5,
      ease: "power2.inOut"
    }, "+=0.1");

    tl.to(".projects-center", {
      color: "transparent",
      WebkitTextStroke: "2px #ffffff",
      duration: 0.5,
      ease: "power2.inOut"
    }, "<");

    // 3. Spawning duplicates (They start hollow white natively via inline styles)
    tl.to(".projects-duplicate", {
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
    tl.to(".projects-duplicate", {
      yPercent: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });

    // 6. Center word fills with solid white
    tl.to(".projects-center", {
      color: "#ffffff",
      WebkitTextStroke: "0px #ffffff",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 7. Morph text to real heading position while fading background
    tl.addLabel("morph", "+=0.1");

    tl.to(".projects-overlay", {
      backgroundColor: "transparent",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to(".projects-center", {
      x: () => {
        const h = document.querySelector("#projects-heading");
        const c = document.querySelector(".projects-center");
        const section = containerRef.current;
        if (!h || !c || !section) return 0;
        const deltaX = (h.getBoundingClientRect().left - section.getBoundingClientRect().left) - c.getBoundingClientRect().left;
        return "+=" + deltaX;
      },
      y: () => {
        const h = document.querySelector("#projects-heading");
        const c = document.querySelector(".projects-center");
        const section = containerRef.current;
        if (!h || !c || !section) return 0;
        const deltaY = (h.getBoundingClientRect().top - section.getBoundingClientRect().top) - c.getBoundingClientRect().top;
        return "+=" + deltaY;
      },
      scale: () => {
        const h = document.querySelector("#projects-heading");
        const c = document.querySelector(".projects-center");
        return (h && c) ? h.getBoundingClientRect().width / c.getBoundingClientRect().width : 1;
      },
      transformOrigin: "left top",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to("#main-navbar", {
      yPercent: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to(".projects-content-body", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out"
    }, "morph+=0.2");

    // Scroll trigger to start the video
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 10%", // Trigger when section enters view
      onEnter: () => {
        if (typeof window !== "undefined" && window.__isNavigating) {
          hasPlayed = true;
          gsap.set(".projects-overlay", { display: "none" });
          gsap.set("#projects-heading", { opacity: 1 });
          gsap.set(".projects-content-body", { opacity: 1, y: 0 });
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
    <section ref={containerRef} id="projects" className="relative w-full bg-[#ff9808] pb-24 pt-32 md:pt-40 overflow-hidden">

      {/* 
        TOPOGRAPHIC WAVE BACKGROUND 
        Pure CSS SVG Pattern to mimic the design
      */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 250 10 500 50 T 1000 50 T 1500 50' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M0 150 Q 200 110 400 150 T 800 150 T 1200 150' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0 250 Q 300 190 600 250 T 1200 250 T 1800 250' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M0 350 Q 250 310 500 350 T 1000 350 T 1500 350' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M0 450 Q 200 410 400 450 T 800 450 T 1200 450' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0 550 Q 300 490 600 550 T 1200 550 T 1800 550' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M0 650 Q 250 610 500 650 T 1000 650 T 1500 650' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0 750 Q 200 710 400 750 T 800 750 T 1200 750' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* 
        FIXED FULL-SCREEN OVERLAY VIDEO
        Starts with solid White background (#ffffff)
      */}
      <div className="projects-overlay fixed inset-0 z-[100] bg-[#ffffff] flex items-center justify-center opacity-0 pointer-events-none" style={{ display: "flex" }}>

        {/* Container for the stacked words */}
        <div className="relative flex items-center justify-center w-full h-full">

          {/* Top Duplicates (Hollow White) */}
          {[0, 1].map((i) => (
            <h2
              key={`above-${i}`}
              className="projects-duplicate absolute text-[13vw] sm:text-[7rem] lg:text-[9rem] uppercase leading-none opacity-0 tracking-tighter font-futura"
              style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}
            >
              Projects
            </h2>
          ))}

          {/* Center Main Word (Starts Solid Orange) */}
          <h2
            className="projects-center absolute text-[13vw] sm:text-[7rem] lg:text-[9rem] uppercase leading-none tracking-tighter font-futura text-[#ff9808]"
            style={{ WebkitTextStroke: '0px' }}
          >
            Projects
          </h2>

          {/* Bottom Duplicates (Hollow White) */}
          {[2, 3].map((i) => (
            <h2
              key={`below-${i}`}
              className="projects-duplicate absolute text-[13vw] sm:text-[7rem] lg:text-[9rem] uppercase leading-none opacity-0 tracking-tighter font-futura"
              style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}
            >
              Projects
            </h2>
          ))}

        </div>
      </div>

      {/* 
        ACTUAL PROJECTS SECTION
        Solid Orange Background with White Text
      */}
      <div className="projects-content w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h2 id="projects-heading" className="text-5xl md:text-[6rem] lg:text-[7rem] text-white uppercase leading-[0.85] tracking-tighter font-futura opacity-0">
            Projects
          </h2>
        </div>

        <div className="projects-content-body">
          {/* Subtitle & Arrows */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="font-serif italic text-lg md:text-3xl text-white ml-1 md:ml-2">
                The World of Innovation.
              </p>
            </div>

            {/* Modern Navigation Arrows */}
            <div className="flex items-center gap-4 mt-6 md:mt-0 mr-4">
              <button
                onClick={scrollLeft}
                className="w-14 h-14 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-[#ff9808] transition-colors duration-300"
              >
                <FiArrowLeft className="text-2xl" />
              </button>
              <button
                onClick={scrollRight}
                className="w-14 h-14 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-[#ff9808] transition-colors duration-300"
              >
                <FiArrowRight className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Project Cards Auto-Scroller */}
          <div className="relative w-full pb-12 pt-4">

            <div
              ref={scrollerRef}
              className="flex overflow-x-auto gap-6 md:gap-8 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {PROJECTS.map((project, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedProject(project)}
                  className="w-[85vw] md:w-[400px] snap-center shrink-0 bg-white rounded-3xl p-3 flex flex-col shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                >
                  {/* Project Image */}
                  <div className="w-full h-48 sm:h-56 md:h-64 rounded-2xl bg-gray-200 overflow-hidden relative mb-4">
                    <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-0" style={{ backgroundImage: `linear-gradient(to bottom right, ${project.bgFrom}, ${project.bgVia}, ${project.bgTo})` }}></div>
                  </div>

                  {/* Badge & Info */}
                  <div className="px-3 pb-4">
                    <span className="inline-block bg-black text-white text-[0.7rem] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 font-glacial">
                      {project.badge}
                    </span>
                    <p className="text-black text-lg md:text-xl font-nourd font-medium">
                      {project.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* --- PROJECT DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">

            {/* Blurred Glassmorphism Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header Image */}
              <div className="w-full h-40 sm:h-72 relative bg-gray-200 shrink-0">
                <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" />
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: `linear-gradient(to bottom right, ${selectedProject.bgFrom}, ${selectedProject.bgVia}, ${selectedProject.bgTo})` }}></div>

                {/* Floating Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-10 overflow-y-auto modal-scrollable-content custom-scrollbar flex flex-col flex-1 min-h-0">

                <span className="inline-block bg-[#ff9808] text-white text-[0.8rem] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 font-glacial">
                  {selectedProject.badge}
                </span>

                <h3 className="text-3xl md:text-6xl font-futura uppercase tracking-tighter text-[#111] mb-4 md:mb-6 leading-[0.9]">
                  {selectedProject.title}
                </h3>

                <p className="text-base md:text-xl text-gray-600 font-nourd leading-relaxed mb-8 md:mb-10">
                  {selectedProject.fullDesc}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <a
                    href={selectedProject.github !== "#" ? selectedProject.github : "#"}
                    target={selectedProject.github !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (selectedProject.github === "#") {
                        e.preventDefault();
                        setShowOfflinePopup(true);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#111] text-white py-4 rounded-full font-glacial font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors group"
                  >
                    <FiGithub className="text-2xl group-hover:scale-110 transition-transform" />
                    View Source
                  </a>
                  <a
                    href={selectedProject.demo !== "#" ? selectedProject.demo : "#"}
                    target={selectedProject.demo !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (selectedProject.demo === "#") {
                        e.preventDefault();
                        setShowOfflinePopup(true);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#ff9808] text-white py-4 rounded-full font-glacial font-bold uppercase tracking-wider hover:bg-[#e08500] transition-colors group"
                  >
                    <FiExternalLink className="text-2xl group-hover:scale-110 transition-transform" />
                    Live Preview
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- OFFLINE POPUP --- */}
      <AnimatePresence>
        {showOfflinePopup && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfflinePopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-[#ff9808]/20 rounded-full flex items-center justify-center mb-6">
                <FiAlertCircle className="text-3xl text-[#ff9808]" />
              </div>
              <h4 className="text-2xl font-futura uppercase tracking-tight text-[#111] mb-2">Link Unavailable</h4>
              <p className="text-gray-600 font-nourd mb-8">ERROR 420: Ram Not Found!</p>

              <button
                onClick={() => setShowOfflinePopup(false)}
                className="w-full bg-[#111] text-white py-3 rounded-full font-glacial font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
