"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { FiMail, FiInstagram, FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const lenis = useLenis();

  // Scroll lock during cinematic intro
  useEffect(() => {
    if (isPlaying) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

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
        gsap.set(".contact-overlay", { display: "none" }); 
      }
    });

    // 1. Hide Navbar and Fade in Overlay (Starts White)
    tl.to("#main-navbar", { yPercent: -150, duration: 0.3 });
    tl.to(".contact-overlay", { 
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

    // 2. Inversion (White to #1e1e1e, Text to Hollow White)
    tl.to(".contact-overlay", {
      backgroundColor: "#1e1e1e",
      duration: 0.6,
      ease: "power2.inOut"
    }, "+=0.1");
    
    tl.to(".contact-center", {
      color: "transparent",
      WebkitTextStroke: "2px #ffffff",
      duration: 0.6,
      ease: "power2.inOut"
    }, "<");

    // 3. Spawning duplicates
    tl.to(".contact-duplicate", {
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
    tl.to(".contact-duplicate", {
      yPercent: 0,
      opacity: 0,
      duration: 0.7,
      ease: "power3.inOut"
    });

    // 6. Center word fills with solid white
    tl.to(".contact-center", {
      color: "#ffffff",
      WebkitTextStroke: "0px #ffffff",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // 7. Fade overlay out and bring Navbar back to reveal content
    tl.to(".contact-overlay", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "+=0.2");
    
    tl.to("#main-navbar", {
      yPercent: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "<");

    // Scroll trigger
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      onEnter: () => {
        if (typeof window !== "undefined" && window.__isNavigating) {
          hasPlayed = true;
          gsap.set(".contact-overlay", { display: "none" });
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
    <section ref={containerRef} id="contact" className="relative w-full bg-white flex flex-col pt-32">
      
      {/* 
        FIXED FULL-SCREEN OVERLAY VIDEO
      */}
      <div className="contact-overlay fixed inset-0 z-[100] bg-[#ffffff] flex items-center justify-center opacity-0 pointer-events-none" style={{ display: "flex" }}>
        <div className="relative flex items-center justify-center w-full h-full z-10">
          {[0, 1].map((i) => (
            <h2 key={`above-${i}`} className="contact-duplicate absolute text-[15vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-none opacity-0 tracking-widest font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Contact</h2>
          ))}
          <h2 className="contact-center absolute text-[15vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-none tracking-widest font-futura text-[#1e1e1e]" style={{ WebkitTextStroke: '0px' }}>Contact</h2>
          {[2, 3].map((i) => (
            <h2 key={`below-${i}`} className="contact-duplicate absolute text-[15vw] sm:text-[7rem] lg:text-[9.5rem] uppercase leading-none opacity-0 tracking-widest font-futura" style={{ color: "transparent", WebkitTextStroke: "2px #ffffff" }}>Contact</h2>
          ))}
        </div>
      </div>

      {/* 
        ACTUAL CONTACT SECTION CONTENT 
      */}
      
      {/* Background Marquee to fill negative space */}
      <div className="absolute top-1/2 left-0 w-[200vw] -translate-y-1/2 flex overflow-hidden pointer-events-none opacity-[0.03] z-0 select-none">
        <div className="whitespace-nowrap animate-marquee flex items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[10rem] md:text-[20rem] lg:text-[30rem] font-futura uppercase px-12">
              Let&apos;s Work Together &bull;
            </span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 flex-1 flex flex-col justify-center py-20 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-8">
          
          {/* Left Side: Hollow-to-Solid "GET IN TOUCH" */}
          <div className="flex flex-col select-none cursor-crosshair group/text mb-12 lg:mb-0 w-full lg:w-auto text-center lg:text-left">
            <h2 className="text-[22vw] sm:text-[10rem] md:text-[14rem] lg:text-[17rem] xl:text-[20rem] leading-[0.72] tracking-tighter font-futura uppercase text-transparent transition-colors duration-700 hover:text-[#1e1e1e] stroke-text-thin md:stroke-text-thick">
              GET IN
            </h2>
            <h2 className="text-[22vw] sm:text-[10rem] md:text-[14rem] lg:text-[17rem] xl:text-[20rem] leading-[0.72] tracking-tighter font-futura uppercase text-transparent transition-colors duration-700 hover:text-[#1e1e1e] stroke-text-thin md:stroke-text-thick">
              TOUCH
            </h2>
          </div>

          {/* Right Side: Quote, Logo, Socials */}
          <div className="flex flex-col items-center justify-center text-center mt-12 lg:mt-0 lg:ml-12 z-10">
            
            {/* Italic Serif Quote */}
            <p className="font-serif italic text-xl md:text-2xl text-gray-800 max-w-md mb-8">
              The truth is out here... but the collaborations starts here.
            </p>

            {/* The ram. WORKS Logo Image */}
            <div className="flex flex-col items-center justify-center w-full mb-10">
              <Image 
                src="/images/logo.png" 
                alt="the ram. WORKS Logo" 
                width={600} 
                height={240} 
                className="w-full max-w-[320px] md:max-w-[450px] lg:max-w-[550px] object-contain"
              />
            </div>

            {/* Social Icons Row */}
            <div className="flex gap-6 items-center">
              {[
                { icon: FiMail, href: "mailto:sairamnayakvankudoth@gmail.com" },
                { icon: FiInstagram, href: "https://www.instagram.com/sairamnayak_pawar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" },
                { icon: FiTwitter, href: "https://x.com/RAM14321275" },
                { icon: FiGithub, href: "https://github.com/Ram14321275" },
                { icon: FiLinkedin, href: "https://www.linkedin.com/in/sai-ram-nayak-174b2726b/" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#1e1e1e] flex items-center justify-center text-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 group"
                >
                  <social.icon className="text-2xl md:text-3xl" />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* 
        THE FOOTER
      */}
      <footer className="w-full bg-[#1e1e1e] text-white rounded-t-[3rem] px-6 py-12 flex flex-col items-center justify-center mt-auto">
        <h3 className="text-xl md:text-3xl font-nourd font-bold tracking-tight mb-4 text-center">
          Made with <span className="text-red-500 animate-pulse inline-block">♥</span> by the Ram Pawar
        </h3>
        <p className="text-sm md:text-base text-gray-400 font-sans tracking-wide text-center">
          Copyright &copy; {new Date().getFullYear()} theRamWorks | Code released under tRW license
        </p>
      </footer>

    </section>
  );
}
