"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Module-level variables to track assets immediately upon module import
let threeTotal = 0;
let threeLoaded = 0;
let threeComplete = false;
let pageLoaded = false;

if (typeof window !== "undefined") {
  // Bind immediately to default loading manager to catch child components' texture loads
  THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    threeLoaded = itemsLoaded;
    threeTotal = itemsTotal;
    threeComplete = false;
  };

  THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    threeLoaded = itemsLoaded;
    threeTotal = itemsTotal;
  };

  THREE.DefaultLoadingManager.onLoad = () => {
    threeComplete = true;
  };

  THREE.DefaultLoadingManager.onError = () => {
    // Avoid blocking on errors
  };

  if (document.readyState === "complete") {
    pageLoaded = true;
  } else {
    window.addEventListener("load", () => {
      pageLoaded = true;
    });
  }
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let finishTimer = 0;
    const startedAt = performance.now();
    let currentProgress = 0;

    const finish = () => {
      setProgress(100);

      finishTimer = window.setTimeout(() => {
        if (counterRef.current) {
          counterRef.current.style.transition = "all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)";
          counterRef.current.style.transform = "translateY(50px)";
          counterRef.current.style.opacity = "0";
        }

        setTimeout(() => {
          setIsLoaded(true);
        }, 400);
      }, 120);
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;

      // Base animation-based progress reaches 95% in 1500ms
      const baseProgress = Math.min(95, Math.round((elapsed / 1500) * 95));

      if (currentProgress < baseProgress) {
        currentProgress = baseProgress;
      }

      if (currentProgress >= 95) {
        // 1. Check HTML images in document (excluding lazy-loaded ones)
        const images = typeof document !== "undefined" ? Array.from(document.images) : [];
        const criticalImages = images.filter((img) => img.getAttribute("loading") !== "lazy");
        const imagesFinished = criticalImages.every((img) => img.complete);

        // 2. Check window load status
        const pageFinished = pageLoaded || (typeof document !== "undefined" && document.readyState === "complete");

        // 3. Check ThreeJS textures
        const threeFinished = threeComplete || threeTotal === 0 || (threeLoaded >= threeTotal);

        if (imagesFinished && pageFinished && threeFinished) {
          currentProgress += 1;
          if (currentProgress > 100) {
            currentProgress = 100;
          }
        } else {
          // Stay stuck at 95% until all assets are complete
          currentProgress = 95;
        }
      }

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        finish();
        return;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(finishTimer);
    };
  }, []);

  // 5 Vertical Panels
  const panels = [0, 1, 2, 3, 4];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex w-full h-full pointer-events-none">
          
          {/* Background Panels */}
          {panels.map((i) => (
            <motion.div
              key={`panel-${i}`}
              className="h-full bg-[#111111] border-r border-[#222] last:border-r-0"
              style={{ width: "20vw" }}
              initial={{ y: 0 }}
              exit={{ 
                y: "-100vh", 
                transition: { 
                  duration: 0.8, 
                  ease: [0.76, 0, 0.24, 1], // Custom heavy ease
                  delay: i * 0.08 // Stagger effect
                } 
              }}
            />
          ))}

          {/* Center Counter & Logo */}
          <motion.div 
            ref={counterRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-[#fbfbfb]"
            exit={{ opacity: 0 }}
          >
            <div className="relative w-[240px] h-[90px] mb-8 invert">
              <Image 
                src="/images/logo.png" 
                alt="the ram. WORKS" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            <div className="flex items-end font-sans font-bold overflow-hidden">
              <span className="text-[25vw] md:text-[10rem] leading-none tracking-tighter">{progress}</span>
              <span className="text-2xl md:text-4xl mb-2 md:mb-4 text-[#fd4107] ml-2">%</span>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
