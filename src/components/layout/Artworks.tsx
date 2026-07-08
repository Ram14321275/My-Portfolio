"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}



// Artwork Data
type ArtworkData = {
  id: string;
  image: string;
};

const BASE_ARTWORKS = [
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.13 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.14 PM (1).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.14 PM (2).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.14 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.15 PM (1).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.15 PM (2).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.15 PM (3).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.15 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.16 PM (1).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.16 PM (2).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.16 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.51.17 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.54.36 PM (1).jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.54.36 PM.jpeg",
  "/images/Artworks/WhatsApp Image 2026-07-07 at 8.54.37 PM (1).jpeg",
];

export default function Artworks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(null);
  
  const lenis = useLenis();

  useEffect(() => {
    if (isPlaying || selectedArtwork) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const lockScroll = (e: Event) => {
      if (isPlaying || selectedArtwork) {
        const target = e.target as HTMLElement;
        if (!target.closest('.modal-scrollable-content')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };
    if (isPlaying || selectedArtwork) {
      window.addEventListener('wheel', lockScroll, { passive: false });
      window.addEventListener('touchmove', lockScroll, { passive: false });
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
  }, [isPlaying, selectedArtwork, lenis]);

  useGSAP(() => {
    let hasPlayed = false;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setIsPlaying(false);
        gsap.set(".artworks-overlay", { display: "none" }); 
        gsap.set("#artworks-heading", { opacity: 1 });
        gsap.set(".artworks-content-body", { opacity: 1, y: 0 });
      }
    });

    gsap.set("#artworks-heading", { opacity: 0 });
    gsap.set(".artworks-content-body", { opacity: 0, y: 30 });

    // 1. Hide Navbar and Fade in Overlay
    tl.to("#main-navbar", { yPercent: -150, duration: 0.3 });
    tl.to(".artworks-overlay", { 
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

    // 2. Inversion (White to Teal, Text to Hollow White)
    tl.to(".artworks-overlay", {
      backgroundColor: "#208A89", // The beautiful Teal
      duration: 0.6,
      ease: "power2.inOut"
    }, "+=0.1");
    
    tl.to(".artworks-center", {
      color: "transparent",
      WebkitTextStroke: "2px #ffffff",
      duration: 0.6,
      ease: "power2.inOut"
    }, "<");
    
    // Fade in mandala
    tl.to(".mandala-container", {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, "<");

    // 3. Spawning duplicates
    tl.to(".artworks-duplicate", {
      yPercent: (index) => {
        if (index === 0) return -160; 
        if (index === 1) return -80;  
        if (index === 2) return 80;   
        if (index === 3) return 160;  
        return 0;
      },
      opacity: 1,
      duration: 0.9,
      ease: "power3.out"
    }, "+=0.1");

    // 4. Hold
    tl.to({}, { duration: 0.4 });

    // 5. Collapse duplicates
    tl.to(".artworks-duplicate", {
      yPercent: 0,
      opacity: 0,
      duration: 0.7,
      ease: "power3.inOut"
    });

    // 6. Center word fills with solid white
    tl.to(".artworks-center", {
      color: "#ffffff",
      WebkitTextStroke: "0px #ffffff",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 7. Morph text to real heading position while fading background
    tl.addLabel("morph", "+=0.2");

    tl.to(".artworks-overlay", {
      backgroundColor: "transparent",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to(".artworks-center", {
      x: () => {
        const h = document.querySelector("#artworks-heading");
        const c = document.querySelector(".artworks-center");
        if (!h || !c) return "+=0";
        const deltaX = h.getBoundingClientRect().left - c.getBoundingClientRect().left;
        return "+=" + deltaX;
      },
      y: () => {
        const h = document.querySelector("#artworks-heading");
        const c = document.querySelector(".artworks-center");
        if (!h || !c) return "+=0";
        const deltaY = h.getBoundingClientRect().top - c.getBoundingClientRect().top;
        return "+=" + deltaY;
      },
      scale: () => {
        const h = document.querySelector("#artworks-heading");
        const c = document.querySelector(".artworks-center");
        return (h && c) ? h.getBoundingClientRect().width / c.getBoundingClientRect().width : 1;
      },
      transformOrigin: "left top",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");
    
    // Crossfade real heading with animated text to hide any sub-pixel layout shifts
    tl.to("#artworks-heading", { opacity: 1, duration: 0.1 }, "morph+=0.5");
    tl.to(".artworks-center", { opacity: 0, duration: 0.1 }, "morph+=0.5");

    tl.to("#main-navbar", {
      yPercent: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "morph+=0.4");

    tl.to(".artworks-content-body", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out"
    }, "morph+=0.5");

    // Scroll trigger
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      onEnter: () => {
        if (typeof window !== "undefined" && window.__isNavigating) {
          hasPlayed = true;
          gsap.set(".artworks-overlay", { display: "none" });
          gsap.set("#artworks-heading", { opacity: 1 });
          gsap.set(".artworks-content-body", { opacity: 1, y: 0 });
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

  // Render a column of artworks (doubled for infinite scroll)
  const renderColumn = (direction: "up" | "down", colIndex: number) => {
    // Offset each column by 3 images so they look beautifully randomized and different
    const itemsCount = 6;
    const offset = colIndex * 3;
    const colArtworks: ArtworkData[] = [];
    
    for (let i = 0; i < itemsCount; i++) {
      colArtworks.push({
        id: `col-${colIndex}-art-${i}`,
        image: BASE_ARTWORKS[(offset + i) % BASE_ARTWORKS.length]
      });
    }
    
    // Duplicate the array multiple times for a truly seamless infinite scroll
    const items = [...colArtworks, ...colArtworks, ...colArtworks, ...colArtworks];
    
    return (
      <div className={`${colIndex > 2 ? "hidden md:flex" : "flex"} flex-1 flex-col gap-6 overflow-hidden relative group`} style={{ height: "150vh" }}>
        <div className={`flex flex-col gap-6 w-full ${direction === "up" ? "animate-marquee-vertical" : "animate-marquee-vertical-reverse"} group-hover:[animation-play-state:paused]`}>
          {items.map((art, idx) => (
            <div 
              key={`${art.id}-${idx}`} 
              className="w-full relative mb-6"
            >
              <motion.div
                layoutId={`card-${art.id}`}
                onClick={() => setSelectedArtwork(art)}
                className="w-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 group/card cursor-pointer relative"
              >
                {/* Image Placeholder with Marvelous Bloom Effect */}
                <motion.div layoutId={`image-${art.id}`} className="relative w-full bg-gray-50 transition-colors duration-500 group-hover:bg-[#fff0eb] overflow-hidden">
                   <Image
                     src={art.image}
                     alt="Artwork"
                     width={600}
                     height={800}
                     sizes="(max-width: 768px) 33vw, 20vw"
                     className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#208A8910] to-transparent group-hover:from-[#208A8940] transition-all duration-500 pointer-events-none"></div>
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\\'20\\\' height=\\\'20\\\' viewBox=\\\'0 0 20 20\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cg fill=\\\'%23000000\\\' fill-opacity=\\\'0.4\\\' fill-rule=\\\'evenodd\\\'%3E%3Ccircle cx=\\\'3\\\' cy=\\\'3\\\' r=\\\'3\\\'/%3E%3Ccircle cx=\\\'13\\\' cy=\\\'13\\\' r=\\\'3\\\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section ref={containerRef} id="artworks" className="relative h-[100svh] min-h-[720px] w-full bg-[#208A89] md:h-screen">
      <div className="relative h-full w-full overflow-hidden">
      
      {/* FIXED FULL-SCREEN OVERLAY VIDEO */}
      <div className="artworks-overlay fixed inset-0 z-[100] bg-[#ffffff] flex items-center justify-center opacity-0 pointer-events-none" style={{ display: "flex" }}>
        
        {/* Rotating Mandala Background */}
        <div className="mandala-container absolute inset-0 flex items-center justify-center opacity-0 mix-blend-overlay">
          <Image 
            src="/images/mandala.png" 
            alt="Mandala" 
            width={2000} 
            height={2000} 
            className="w-[200vw] h-[200vw] md:w-[150vw] md:h-[150vw] scale-125 object-contain opacity-40 animate-[spin_40s_linear_infinite]"
          />
        </div>

        <div className="relative flex items-center justify-center w-full h-full z-10">
          {[0, 1].map((i) => (
            <h2 key={`above-${i}`} className="artworks-duplicate absolute text-[13vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-[0.85] opacity-0 tracking-tighter font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Artworks</h2>
          ))}
          <h2 className="artworks-center absolute text-[13vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-[0.85] tracking-tighter font-futura text-[#208A89]" style={{ WebkitTextStroke: '0px' }}>Artworks</h2>
          {[2, 3].map((i) => (
            <h2 key={`below-${i}`} className="artworks-duplicate absolute text-[13vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-[0.85] opacity-0 tracking-tighter font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Artworks</h2>
          ))}
        </div>
      </div>

      {/* Floating Glassmorphism Header Overlay (Sits ABOVE the scrolling columns) */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col pt-32 md:pt-40 px-6 md:px-16">
        <div className="inline-block max-w-fit">
          <div className="flex items-start bg-[#208A89]/40 backdrop-blur-xl p-6 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl">
            <div>
              <h2 id="artworks-heading" className="text-5xl md:text-[5.5rem] lg:text-[7rem] text-white uppercase leading-[0.8] tracking-tighter font-futura drop-shadow-lg opacity-0">
                Artworks
              </h2>
              <div className="artworks-content-body">
                <p className="font-serif italic text-lg md:text-[1.75rem] text-white/90 mt-3 md:mt-4 ml-1">
                  The World of Creation.
                </p>
              </div>
            </div>
            <div className="artworks-content-body w-[3px] bg-white h-16 md:h-24 lg:h-28 ml-6 mt-2 hidden sm:block rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Gradient fades for top and bottom of screen to make the scroll seamless */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#208A89] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#208A89] to-transparent z-10 pointer-events-none"></div>

      {/* Infinite Scrolling Grid */}
      <div className="artworks-content-body absolute inset-0 flex gap-6 px-6 md:px-12 pt-6 transform -rotate-2 scale-105 opacity-0">
        {/* 5 Columns with alternating scroll directions */}
        {renderColumn("up", 0)}
        {renderColumn("down", 1)}
        {renderColumn("up", 2)}
        {renderColumn("down", 3)}
        {renderColumn("up", 4)}
      </div>

      {/* --- SHARED LAYOUT EXPANDED MODAL --- */}
      <AnimatePresence>
        {selectedArtwork && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12">
            
            {/* Blurred Glassmorphism Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedArtwork(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl cursor-pointer"
            />
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedArtwork.image} 
              alt="Selected Artwork" 
              className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl z-50"
            />
            
            {/* The Expanded Card morphing from the grid slot */}
            <motion.div 
              layoutId={`card-${selectedArtwork.id}`}
              className="relative w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[95vh] md:max-h-[80vh]"
            >
              
              {/* Massive Artwork Section */}
              <motion.div layoutId={`image-${selectedArtwork.id}`} className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto md:min-h-[500px] relative bg-[#f0f8f8] shrink-0 overflow-hidden">
                 <Image src={selectedArtwork.image} alt="Artwork" fill className="object-cover" />
                 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20"></div>
                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\\'20\\\' height=\\\'20\\\' viewBox=\\\'0 0 20 20\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cg fill=\\\'%23000000\\\' fill-opacity=\\\'0.4\\\' fill-rule=\\\'evenodd\\\'%3E%3Ccircle cx=\\\'3\\\' cy=\\\'3\\\' r=\\\'3\\\'/%3E%3Ccircle cx=\\\'13\\\' cy=\\\'13\\\' r=\\\'3\\\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                 
                 {/* Floating Close Button */}
                 <button 
                   onClick={() => setSelectedArtwork(null)}
                   className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-black/10 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-black hover:text-white transition-colors z-20"
                 >
                   <FiX className="text-2xl" />
                 </button>
              </motion.div>

              {/* Text Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto modal-scrollable-content custom-scrollbar bg-white">
                
                <motion.div layoutId={`title-${selectedArtwork.id}`} className="self-start mb-8">
                  <span className="inline-block bg-[#208A89] text-white text-[0.8rem] md:text-[0.9rem] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest font-glacial shadow-[0_10px_30px_rgba(32,138,137,0.4)]">
                    ARTWORK
                  </span>
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                  className="text-4xl md:text-6xl lg:text-7xl font-futura uppercase tracking-tighter text-[#111] mb-6 md:mb-8 leading-[0.85]"
                >
                  ARTWORK
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="text-base md:text-xl lg:text-2xl text-gray-600 font-nourd leading-relaxed"
                >
                  A beautiful piece of digital art created with passion, featuring organic shapes, fluid dynamics, and a calming aesthetic that mimics physical canvas.
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </section>
  );
}
