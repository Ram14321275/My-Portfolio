import React from "react";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

const mobileIcons = [
  { src: "/images/canva.webp", className: "absolute left-2 top-[35%] w-[18vw] max-w-[82px] -rotate-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.22)]" },
  { src: "/images/filmora.webp", className: "absolute bottom-[18%] left-3 w-[19vw] max-w-[86px] -rotate-12 rounded-[1.35rem] drop-shadow-[0_16px_22px_rgba(0,0,0,0.24)]" },
  { src: "/images/color.png", className: "absolute bottom-[18%] left-[23%] w-[17vw] max-w-[76px] rotate-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.22)]" },
  { src: "/images/ps.png", className: "absolute right-[16%] top-[38%] w-[17vw] max-w-[78px] rotate-12 rounded-[1.25rem] drop-shadow-[0_14px_20px_rgba(0,0,0,0.22)]" },
  { src: "/images/sec.png", className: "absolute right-2 top-[45%] w-[17vw] max-w-[76px] rotate-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.22)]" },
  { src: "/images/vs.webp", className: "absolute bottom-[6%] right-0 w-[24vw] max-w-[108px] rounded-[1.6rem] drop-shadow-[0_18px_26px_rgba(0,0,0,0.25)]" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[100svh] w-full items-center overflow-hidden bg-white md:bg-transparent px-5 pt-24 text-[#111] pointer-events-none md:h-screen md:px-24 md:pt-0"
    >
      <div className="absolute left-16 top-1/2 hidden h-[35vh] w-px -translate-y-1/2 bg-[#333]/30 md:block" />

      <div className="absolute bottom-24 left-16 hidden origin-bottom-left -rotate-90 items-center gap-4 text-[0.85rem] font-medium tracking-widest text-[#333]/60 md:flex">
        2026
      </div>

      <div className="absolute bottom-20 left-32 hidden items-center gap-2 text-[0.85rem] font-medium tracking-wide text-[#111] transition-colors duration-300 hover:text-[#fd4107] md:flex">
        Scroll Down <span className="animate-bounce text-lg">↓</span>
      </div>

      <div className="flex w-full flex-col md:hidden">
        <div className="relative z-20 pointer-events-auto mt-16 md:mt-0">
          <h1 className="font-tan leading-[0.78] tracking-normal flex items-end">
            <AnimatedText />
            <span className="ml-1 text-[30vw] md:hidden">!</span>
          </h1>
          <p className="mt-6 text-[1.05rem] font-semibold leading-tight tracking-normal">
            - It&apos;s Ram Pawar, an AI Solutions Architect
          </p>
        </div>

        <div className="relative mx-auto mt-8 h-[46svh] min-h-[330px] w-full max-w-[440px] pointer-events-auto">
          <Image
            src="/images/portrait.png"
            alt="Ram Pawar"
            fill
            sizes="(max-width: 768px) 92vw"
            className="object-contain object-bottom grayscale"
            priority
          />

          {mobileIcons.map((icon, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
              transition={{
                scale: { type: "spring", bounce: 0.5, duration: 1.2, delay: 0.2 + i * 0.1 },
                opacity: { duration: 0.4, delay: 0.2 + i * 0.1 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 + (i * 0.2) }
              }}
              className={icon.className}
            >
              <Image src={icon.src} alt="" width={112} height={112} className="w-full h-auto object-contain" />
            </motion.div>
          ))}
        </div>

        <a
          href="#contact"
          className="relative z-20 mt-4 flex h-16 w-full items-center justify-center rounded-full bg-[#171717] px-8 text-[1.35rem] font-semibold tracking-normal text-white shadow-[0_16px_30px_rgba(0,0,0,0.18)] pointer-events-auto"
        >
          Contact Me. <span className="ml-2 text-2xl leading-none">↗</span>
        </a>

        <div className="relative z-20 mt-8 flex items-center justify-between pb-4 text-[0.95rem] font-medium text-[#111]">
          <span className="text-[#111]/60">2026</span>
          <span>Scroll Down ↓</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-white">
            N
          </span>
        </div>
      </div>

      <div className="z-20 ml-0 mt-16 hidden w-full flex-col pointer-events-auto md:ml-12 md:flex">
        <div className="relative font-tan leading-none tracking-normal text-[#111] md:[text-shadow:none]">
          <h1 className="flex items-end font-medium">
            <AnimatedText />
            <span className="relative ml-2 hidden h-full flex-col items-center justify-end pb-6 md:inline-flex">
              <div className="mb-4 h-[110px] w-[12px] rounded-full bg-[#111]" />
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#111]"
              >
                <path
                  d="M12 0C12 7.5 16.5 12 24 12C16.5 12 12 16.5 12 24C12 16.5 7.5 12 0 12C7.5 12 12 7.5 12 0Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </h1>
        </div>

        <p className="mt-4 max-w-none text-[1.35rem] font-medium tracking-normal text-[#111] md:[text-shadow:none]">
          - It&apos;s Ram Pawar, an AI Solutions Architect
        </p>
      </div>
    </section>
  );
}
