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

// --- DESIGN DATA ---
type DesignData = {
  id: string;
  badge: string;
  title: string;
  desc: string;
  heightClass: string;
  image: string;
};

const DESIGNS: DesignData[] = [
  { id: "d1", badge: "CONCEPT", title: "Ministry of Secrets", desc: "A cinematic, Harry Potter-inspired poster design featuring Hogwarts castle, dementors, and the golden snitch with custom typography for 'Ram'.", heightClass: "aspect-[4/5] max-h-[500px] min-h-[300px]", image: "/images/Designs/HARRYPOTTER.png" },
  { id: "d2", badge: "FAN ART", title: "One Last Adventure", desc: "A thrilling Stranger Things Season 5 concept poster featuring an ominous red sky and a creepy clock tower.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/Stranger Things POster.png" },
  { id: "d3", badge: "ADVERT", title: "Porsche GT3 RS", desc: "A sleek automotive advertisement for the all-new Porsche GT3 RS featuring dynamic yellow color blocking and clean, modern typography.", heightClass: "aspect-[4/3] max-h-[400px] min-h-[250px]", image: "/images/Designs/PORSCHE.png" },
  { id: "d4", badge: "EVENT", title: "TEDx Season 2", desc: "A high-octane event poster for TEDx Sreyas Institute featuring a speeding Formula 1 car and bold red graphics.", heightClass: "aspect-[3/4] max-h-[550px] min-h-[350px]", image: "/images/Designs/tedx1.png" },
  { id: "d5", badge: "COVER", title: "Unsent Messages", desc: "A beautiful, romantic novel cover design featuring the silhouettes of a couple standing under a starry night and crescent moon.", heightClass: "aspect-[2/3] max-h-[450px] min-h-[300px]", image: "/images/Designs/NOVEL.png" },
  { id: "d6", badge: "MOVIE", title: "The OG's", desc: "A massive sci-fi cinematic poster featuring a cast of five heroes, a futuristic cityscape, and a fighter jet soaring through the sky.", heightClass: "aspect-[4/5] max-h-[600px] min-h-[300px]", image: "/images/Designs/OG POSTER.png" },
  { id: "d7", badge: "FEST", title: "Sriyam 2025", desc: "A vibrant college fest poster incorporating futuristic UI elements, a 3D guitar graphic, and energetic concert photography.", heightClass: "aspect-[3/4] max-h-[550px] min-h-[350px]", image: "/images/Designs/sriyam20256.png" },
  { id: "d8", badge: "BANNER", title: "TEDx Speakers", desc: "An expansive event banner showcasing a lineup of 11 speakers in black and white against a dramatic red gradient background.", heightClass: "aspect-video max-h-[350px] min-h-[200px]", image: "/images/Designs/tedall.png" },
  { id: "d9", badge: "TYPO", title: "Live Sharp", desc: "An edgy, bold typography poster featuring stylized text seemingly clawed out from a dark, grunge background.", heightClass: "aspect-[4/5] max-h-[500px] min-h-[300px]", image: "/images/Designs/1.png" },
  { id: "d10", badge: "SPOOKY", title: "Scary Night", desc: "A spooky Halloween-themed illustration featuring a creepy zombie against a full moon backdrop.", heightClass: "aspect-[3/4] max-h-[500px] min-h-[300px]", image: "/images/Designs/2.png" },
  { id: "d11", badge: "MONSTER", title: "Ready!", desc: "A dark, high-contrast, greyscale illustration of a fierce, horned beast looking menacingly into the camera.", heightClass: "aspect-[3/4] max-h-[550px] min-h-[350px]", image: "/images/Designs/3.png" },
  { id: "d12", badge: "REAPER", title: "Time's Up", desc: "A chilling depiction of the Grim Reaper wielding a scythe, set against a blood-red splattered background.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/4.png" },
  { id: "d13", badge: "CUTE", title: "Fright Night All Right", desc: "A cute and playful Halloween design featuring a friendly ghost on a seamless bat pattern background.", heightClass: "aspect-[3/4] max-h-[500px] min-h-[300px]", image: "/images/Designs/5.png" },
  { id: "d14", badge: "SKELETON", title: "Boo!", desc: "A charming, family-friendly Halloween illustration of a little skeleton wearing a classic black witch's hat.", heightClass: "aspect-[3/4] max-h-[450px] min-h-[300px]", image: "/images/Designs/6.png" },
  { id: "d15", badge: "MINIMAL", title: "TEDx Identity", desc: "A sleek, minimalist promotional design for TEDx Sreyas Institute featuring a glowing red 'X' over a dark geometric pattern.", heightClass: "aspect-[3/4] max-h-[550px] min-h-[350px]", image: "/images/Designs/7.png" },
  { id: "d16", badge: "PACKAGING", title: "Chekodi", desc: "An authentic food packaging design for CountryBite's Chekodi snack, featuring warm, inviting colors and traditional patterns.", heightClass: "aspect-[4/3] max-h-[400px] min-h-[250px]", image: "/images/Designs/d1.png" },
  { id: "d17", badge: "PACKAGING", title: "Sakinalu", desc: "A premium, elegant packaging design for CountryBite's traditional Sakinalu snack, blending earthy tones with elegant typography.", heightClass: "aspect-[4/3] max-h-[400px] min-h-[250px]", image: "/images/Designs/d2.png" },
  { id: "d18", badge: "PACKAGING", title: "Murukulu", desc: "A rich, appetizing product packaging design for CountryBite's Murukulu, incorporating traditional Indian design motifs.", heightClass: "aspect-[4/3] max-h-[400px] min-h-[250px]", image: "/images/Designs/d3.png" },
  { id: "d19", badge: "PACKAGING", title: "Chekkalu", desc: "A vibrant, eye-catching packaging design for CountryBite's Chekkalu snack, ensuring the product pops on the shelf.", heightClass: "aspect-[4/3] max-h-[400px] min-h-[250px]", image: "/images/Designs/d4.png" },
  { id: "d20", badge: "SCI-FI", title: "Prodian of World", desc: "An epic, Marvel Studios-style sci-fi movie poster featuring a 3D animated hero in a high-tech space suit amidst a cosmic battle.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/m1.png" },
  { id: "d21", badge: "ACTION", title: "Power House", desc: "A gritty, action-packed movie poster for 'Coolie', starring Ram Pawar in a stylish black suit, featuring intense, blood-splattered typography.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/m2.png" },
  { id: "d22", badge: "POSTER", title: "18 Ragalu", desc: "Event poster for 'The Ultimate Musical Night' featuring a vinyl record, guitar, mic, and piano keys with vintage warm tones.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/l1.png" },
  { id: "d23", badge: "CONCERT", title: "Afzal Syed Live", desc: "Concert poster for 18 Ragalu featuring singer Afzal Syed performing live, set against a dark, atmospheric background.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/l2.png" },
  { id: "d24", badge: "EVENT", title: "Musical Night Lineup", desc: "A music player themed event poster for 18 Ragalu featuring multiple track listings and an artist performance shot.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/l3.png" },
  { id: "d25", badge: "MUSIC", title: "Navya Live", desc: "Event poster for 18 Ragalu Vol.2 featuring artist Navya with elegant typography and a blurred bokeh background.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/WhatsApp Image 2026-07-07 at 8.54.35 PM (1).jpeg" },
  { id: "d26", badge: "MUSIC", title: "Jhonny Live", desc: "Event poster for 18 Ragalu Vol.2 featuring guitarist Jhonny playing live.", heightClass: "aspect-[3/4] max-h-[600px] min-h-[400px]", image: "/images/Designs/WhatsApp Image 2026-07-07 at 8.54.35 PM.jpeg" },
];

export default function Designs() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<DesignData | null>(null);
  
  const lenis = useLenis();

  // Lock scroll forcefully while the animation acts as a video, or if modal is open
  useEffect(() => {
    if (isPlaying || selectedDesign) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    const lockScroll = (e: Event) => {
      if (isPlaying || selectedDesign) {
        // Only block if trying to scroll the background (allow scrolling inside the modal)
        const target = e.target as HTMLElement;
        if (!target.closest('.modal-scrollable-content')) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    if (isPlaying || selectedDesign) {
      window.addEventListener('wheel', lockScroll, { passive: false });
      window.addEventListener('touchmove', lockScroll, { passive: false });
      if (isPlaying) {
        window.addEventListener('keydown', lockScroll, { passive: false });
      }
    }
    return () => {
      lenis?.start();
      window.removeEventListener('wheel', lockScroll);
      window.removeEventListener('touchmove', lockScroll);
      window.removeEventListener('keydown', lockScroll);
    };
  }, [isPlaying, selectedDesign, lenis]);

  // GSAP Cinematic Intro
  useGSAP(() => {
    let hasPlayed = false;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setIsPlaying(false);
        gsap.set(".designs-overlay", { display: "none" }); // Remove overlay entirely
        gsap.set("#designs-heading", { opacity: 1 });
        gsap.set(".designs-content-body", { opacity: 1, y: 0 });
      }
    });

    gsap.set("#designs-heading", { opacity: 0 });
    gsap.set(".designs-content-body", { opacity: 0, y: 30 });

    // 1. Hide Navbar and Fade in Overlay (Starts White)
    tl.to("#main-navbar", { yPercent: -150, duration: 0.3 });
    tl.to(".designs-overlay", { 
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
    tl.to(".designs-overlay", {
      backgroundColor: "#fd4107",
      duration: 0.5,
      ease: "power2.inOut"
    }, "+=0.1");
    
    tl.to(".designs-center", {
      color: "transparent",
      WebkitTextStroke: "2px #ffffff",
      duration: 0.5,
      ease: "power2.inOut"
    }, "<");

    // 3. Spawning duplicates
    tl.to(".designs-duplicate", {
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
    tl.to(".designs-duplicate", {
      yPercent: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });

    // 6. Center word fills with solid white
    tl.to(".designs-center", {
      color: "#ffffff",
      WebkitTextStroke: "0px #ffffff",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 7. Morph text to real heading position while fading background
    tl.addLabel("morph", "+=0.1");

    tl.to(".designs-overlay", {
      backgroundColor: "transparent",
      duration: 0.6,
      ease: "power2.out"
    }, "morph");

    tl.to(".designs-center", {
      x: () => {
        const h = document.querySelector("#designs-heading");
        const c = document.querySelector(".designs-center");
        const section = containerRef.current;
        if (!h || !c || !section) return 0;
        const deltaX = (h.getBoundingClientRect().left - section.getBoundingClientRect().left) - c.getBoundingClientRect().left;
        return "+=" + deltaX;
      },
      y: () => {
        const h = document.querySelector("#designs-heading");
        const c = document.querySelector(".designs-center");
        const section = containerRef.current;
        if (!h || !c || !section) return 0;
        const deltaY = (h.getBoundingClientRect().top - section.getBoundingClientRect().top) - c.getBoundingClientRect().top;
        return "+=" + deltaY;
      },
      scale: () => {
        const h = document.querySelector("#designs-heading");
        const c = document.querySelector(".designs-center");
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

    tl.to(".designs-content-body", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out"
    }, "morph+=0.2");

    // 8. Animate the masonry cards sliding in from left and right
    // We already fade in the container, but the cards can still stagger in
    tl.fromTo(".design-card-wrapper", 
      { 
        x: (index) => (index % 2 === 0 ? -150 : 150), // Evens from left, odds from right
        opacity: 0 
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      },
      "morph+=0.3" // Start sliding in just as the container fades in
    );

    // Scroll trigger to start the video
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%", // Trigger when section enters view
      onEnter: () => {
        if (typeof window !== "undefined" && window.__isNavigating) {
          hasPlayed = true;
          gsap.set(".designs-overlay", { display: "none" });
          gsap.set("#designs-heading", { opacity: 1 });
          gsap.set(".design-card-wrapper", { opacity: 1, x: 0 });
          gsap.set(".designs-content-body", { opacity: 1, y: 0 });
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
    <section ref={containerRef} id="designs" className="relative w-full bg-[#fd4107] pb-32 pt-32 md:pt-40 overflow-hidden">
      
      {/* FIXED FULL-SCREEN OVERLAY VIDEO */}
      <div className="designs-overlay fixed inset-0 z-[100] bg-[#ffffff] flex items-center justify-center opacity-0 pointer-events-none" style={{ display: "flex" }}>
        <div className="relative flex items-center justify-center w-full h-full">
          {[0, 1].map((i) => (
            <h2 key={`above-${i}`} className="designs-duplicate absolute text-[13vw] sm:text-[8rem] lg:text-[10rem] uppercase leading-none opacity-0 tracking-tighter font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Designs</h2>
          ))}
          <h2 className="designs-center absolute text-[13vw] sm:text-[8rem] lg:text-[10rem] uppercase leading-none tracking-tighter font-futura text-[#fd4107]" style={{ WebkitTextStroke: '0px' }}>Designs</h2>
          {[2, 3].map((i) => (
            <h2 key={`below-${i}`} className="designs-duplicate absolute text-[13vw] sm:text-[8rem] lg:text-[10rem] uppercase leading-none opacity-0 tracking-tighter font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Designs</h2>
          ))}
        </div>
      </div>

      {/* ACTUAL DESIGNS SECTION */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-start">
            <div>
              <h2 id="designs-heading" className="text-5xl md:text-[6rem] lg:text-[7.5rem] text-white uppercase leading-[0.8] tracking-tighter font-futura opacity-0">
                Designs
              </h2>
              <div className="designs-content-body">
                <p className="font-serif italic text-lg md:text-[1.75rem] text-white mt-3 md:mt-4 ml-1">
                  The World of Ideas.
                </p>
              </div>
            </div>
            <div className="designs-content-body w-[3px] bg-white h-16 md:h-24 lg:h-32 ml-4 mt-2 hidden sm:block rounded-full"></div>
          </div>
        </div>

        {/* Masonry Card Grid (CSS Columns) */}
        <div className="designs-content-body columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          
          {DESIGNS.map((design) => (
            <div 
              key={design.id} 
              className="design-card-wrapper w-full break-inside-avoid relative opacity-0 mb-6"
            >
              {/* The actual morphing card */}
              <motion.div
                layoutId={`card-${design.id}`}
                onClick={() => setSelectedDesign(design)}
                className="w-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 group cursor-pointer relative"
              >
                {/* Image Placeholder with Marvelous Bloom Effect */}
                <motion.div layoutId={`image-${design.id}`} className={`relative w-full ${design.heightClass} bg-gray-50 transition-colors duration-500 group-hover:bg-[#fff0eb] overflow-hidden`}>
                   <Image
                     src={design.image}
                     alt={design.title}
                     fill
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                     className="object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#fd410710] to-transparent group-hover:from-[#fd410740] transition-all duration-500 pointer-events-none"></div>
                </motion.div>
                
                {/* Badge (Bottom Left) */}
                <motion.div layoutId={`badge-${design.id}`} className="absolute bottom-4 left-4 z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2">
                  <span className="inline-block bg-black text-white text-[0.8rem] md:text-[0.9rem] font-black px-4 py-2 rounded-xl uppercase tracking-widest font-glacial shadow-md group-hover:bg-[#fd4107] group-hover:shadow-[0_10px_30px_rgba(253,65,7,0.5)] transition-all duration-500">
                    {design.badge}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          ))}

        </div>
      </div>

      {/* --- SHARED LAYOUT EXPANDED MODAL --- */}
      <AnimatePresence>
        {selectedDesign && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-12">
            
            {/* Blurred Glassmorphism Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedDesign(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl cursor-pointer"
            />
            
            {/* The Expanded Card morphing from the grid slot */}
            <motion.div 
              layoutId={`card-${selectedDesign.id}`}
              className="relative w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[95vh] md:max-h-[80vh]"
            >
              
              {/* Massive Artwork Section */}
              <motion.div layoutId={`image-${selectedDesign.id}`} className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto md:min-h-[500px] relative bg-[#fff0eb] shrink-0 overflow-hidden">
                 <Image src={selectedDesign.image} alt={selectedDesign.title} fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#fd410720] to-transparent"></div>
                 
                 {/* Floating Close Button */}
                 <button 
                   onClick={() => setSelectedDesign(null)}
                   className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20"
                 >
                   <FiX className="text-2xl" />
                 </button>
              </motion.div>

              {/* Text Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto modal-scrollable-content custom-scrollbar bg-white">
                
                <motion.div layoutId={`badge-${selectedDesign.id}`} className="self-start mb-8">
                  <span className="inline-block bg-[#fd4107] text-white text-[0.8rem] md:text-[0.9rem] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest font-glacial shadow-[0_10px_30px_rgba(253,65,7,0.4)]">
                    {selectedDesign.badge}
                  </span>
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                  className="text-4xl md:text-6xl lg:text-7xl font-futura uppercase tracking-tighter text-[#111] mb-6 leading-[0.85]"
                >
                  {selectedDesign.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="text-base md:text-xl lg:text-2xl text-gray-600 font-nourd leading-relaxed"
                >
                  {selectedDesign.desc}
                </motion.p>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
