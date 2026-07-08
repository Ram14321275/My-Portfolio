"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiArrowUpRight, FiCloud, FiGlobe, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";

const navItems = [
  { label: "About Me", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Designs", href: "#designs" },
  { label: "Art and Crafts", href: "#artworks" },
  { label: "Contact", href: "#contact" }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.__isNavigating = true;
      lenis?.scrollTo(href, { 
        duration: 1.2,
        onComplete: () => {
          // Give a tiny buffer after scroll finishes before re-enabling triggers
          setTimeout(() => {
            window.__isNavigating = false;
          }, 50);
        }
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile pill header */}
      <header className="fixed left-4 right-4 top-4 z-50 md:hidden">
        <div className="flex h-[60px] items-center justify-between rounded-full border border-white/10 bg-[#171717] px-5 shadow-[0_18px_34px_rgba(0,0,0,0.22)]">
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="relative h-9 w-[78px]"
            aria-label="Home"
          >
            <Image
              src="/images/logo.png"
              alt="the ram. WORKS"
              fill
              sizes="78px"
              className="object-contain object-left brightness-0 invert"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 rounded-[1.75rem] bg-[#171717] p-3 shadow-[0_22px_46px_rgba(0,0,0,0.25)]"
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* 
        Absolute header for Logo and Contact. 
      */}
      <header className="absolute top-0 left-0 z-40 hidden h-24 w-full items-center justify-between px-6 py-0 pointer-events-none md:flex">
        <div className="relative w-[120px] h-[50px] pointer-events-auto">
          <Image 
            src="/images/logo.png" 
            alt="the ram. WORKS" 
            fill
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
        </div>

        <Link 
          href="#contact" 
          onClick={(e) => handleNavClick(e, "#contact")}
          className="relative flex items-center gap-1 text-[0.95rem] font-medium group transition-colors duration-300 hover:text-[#fd4107] pointer-events-auto mr-10"
        >
          <span className="text-[0.95rem] font-medium transition-colors pb-0.5">Contact Me.</span>
          <FiArrowUpRight className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out mb-1" />
        </Link>
      </header>

      {/* 
        Fixed Navbar wrapper.
        We use a flex container that shifts from start to center, and let Framer Motion's 'layout' 
        smoothly animate the nav pill's width and position without relying on CSS transforms!
      */}
      <div 
        id="main-navbar"
        className={`fixed top-0 left-0 z-50 hidden h-24 w-full items-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:flex ${
          isScrolled ? "justify-center px-0" : "justify-start pl-36"
        }`}
      >
        <motion.nav 
          layout
          transition={{ type: "tween", ease: [0.19, 1, 0.22, 1], duration: 1.2 }}
          className={`pointer-events-auto flex items-center bg-[#1a1a1a] rounded-full px-6 md:px-8 py-4 shadow-xl border border-white/10 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isScrolled ? "w-[90vw] max-w-[1400px] justify-start md:justify-between" : "w-auto justify-center"
          }`}
        >
          {/* Expanded Mode: Left side (Home) */}
          <AnimatePresence mode="popLayout">
            {isScrolled && (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="flex items-center w-32 px-4"
              >
                <Link 
                  href="#home" 
                  onClick={(e) => handleNavClick(e, "#home")}
                  className="text-white font-bold tracking-wide hover:text-[#fd4107] transition-colors whitespace-nowrap"
                >
                  Home
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded Mode: Center side (Icons) */}
          <AnimatePresence mode="popLayout">
            {isScrolled && (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="hidden lg:flex items-center justify-center gap-4 text-white text-[1.8rem] w-48 px-4"
              >
                <motion.div animate={{ y: [-2, 3, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                  <FiCloud className="hover:text-[#fd4107] transition-colors cursor-pointer" />
                </motion.div>
                
                <motion.div animate={{ y: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
                  <FiCloud className="hover:text-[#fd4107] transition-colors cursor-pointer text-[1.4rem] -mt-5" />
                </motion.div>

                <motion.div animate={{ y: [-3, 2, -3] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
                  <FiCloud className="hover:text-[#fd4107] transition-colors cursor-pointer" />
                </motion.div>

                <motion.div animate={{ y: [-1, 2, -1] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}>
                  <FiGlobe className="hover:text-[#fd4107] transition-colors cursor-pointer ml-2 text-[2rem]" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right side (Links - always visible) */}
          <motion.div layout className="flex items-center space-x-6 md:space-x-7 flex-shrink-0 px-2 pl-4 md:pl-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="group relative text-[0.85rem] font-medium tracking-wide text-[#f0f0f0] hover:text-[#fd4107] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fd4107] transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            ))}
          </motion.div>
        </motion.nav>
      </div>
    </>
  );
}
