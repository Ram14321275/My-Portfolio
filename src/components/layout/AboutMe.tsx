"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function AboutMe() {
  const skillsLine1 = [
    "Systems Thinking",
    "Product Thinking",
    "AI Product Building",
    "Prompt Engineering",
    "Software Architecture",
    "System Design",
    "Full-Stack Development",
    "Multi-Agent Systems",
    "Distributed Systems",
    "Backend Engineering",
    "API Design",
  ];
  const skillsLine2 = [
    "Scalable Systems",
    "AI Workflow Design",
    "Agentic AI",
    "LLM Applications",
    "Automation",
    "UI/UX Design",
    "Interaction Design",
    "Creative Problem Solving",
    "User-Centered Design",
    "Rapid Prototyping",
    "Technical Leadership",
    "Cross-Functional Collaboration",
    "Continuous Learning"
  ];

  return (
    <section id="about" className="relative w-full min-h-screen bg-white text-[#111] flex flex-col lg:flex-row z-20">

      {/* LEFT COLUMN */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center py-16 md:py-20 px-6 md:px-10 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-hidden">
        {/* Background Castle Sketch */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none z-0">
          <Image
            src="/images/castle png.png"
            alt="Background Sketch"
            fill
            className="object-cover object-center scale-[1.3]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-sm mt-12">
          {/* Portrait Image */}
          <div className="relative w-[240px] md:w-[280px] h-[280px] md:h-[320px] rounded-[1.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white">
            <Image
              src="/images/about.jpeg"
              alt="Ram Pawar"
              fill
              className="object-cover"
            />
          </div>

          {/* Name & Title */}
          <h2 className="text-3xl md:text-[2.2rem] font-mono font-bold text-[#fd4107] mb-1 tracking-tighter uppercase text-center">
            &lt;RAM PAWAR&gt;
          </h2>
          <h3 className="text-lg md:text-xl font-bold tracking-widest uppercase mb-8 text-center">
            AI/ML ENGINEER
          </h3>

          {/* Email Button */}
          <a href="mailto:sairamnayakvankudoth@gmail.com" className="w-full bg-[#111] text-white text-lg font-bold py-4 px-8 mb-8 hover:bg-[#fd4107] transition-colors duration-300 flex items-center justify-center">
            Email me
          </a>

          {/* Social Icons */}
          <div className="flex gap-8 text-[1.7rem]">
            <a href="https://www.instagram.com/sairamnayak_pawar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" className="hover:text-[#fd4107] transition-colors"><FaInstagram /></a>
            <a href="https://x.com/RAM14321275" className="hover:text-[#fd4107] transition-colors"><FaTwitter /></a>
            <a href="https://github.com/Ram14321275" className="hover:text-[#fd4107] transition-colors"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/sai-ram-nayak-174b2726b/" className="hover:text-[#fd4107] transition-colors"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center bg-[#f7f8fa] py-20 overflow-hidden">

        <div className="px-6 md:px-12 lg:px-24 mb-12 md:mb-16 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-mono mb-6 md:mb-8 tracking-tighter text-[#111]">
            &lt;/About Me&gt;
          </h2>
          <div className="text-[1rem] md:text-lg lg:text-[1.15rem] leading-[1.8] text-[#333] font-sans max-w-2xl">
            I build intelligent products where AI, engineering, and design come together. As a Computer Science student, I&apos;m passionate about transforming complex ideas into scalable, user-focused applications while continuously exploring new technologies and creating experiences that are both functional and visually compelling.
          </div>
        </div>

        {/* Marquees */}
        <div className="w-full bg-[#111] text-white py-4 flex overflow-hidden mb-[1px]">
          <MarqueeRow items={skillsLine1} direction="left" />
        </div>
        <div className="w-full bg-[#111] text-white py-4 flex overflow-hidden mb-16">
          <MarqueeRow items={skillsLine2} direction="right" />
        </div>

        {/* Resume Button */}
        <div className="px-6 md:px-12 lg:px-24 flex justify-center mt-4">
          <button className="w-full sm:w-auto bg-[#111] text-white text-lg font-bold py-4 px-16 hover:bg-[#fd4107] transition-colors duration-300">
            Resume
          </button>
        </div>

      </div>
    </section>
  );
}

// Marquee Component
function MarqueeRow({ items, direction = "left" }: { items: string[], direction?: "left" | "right" }) {
  // Duplicate the items enough times to create a seamless infinite loop
  const content = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <motion.div
      className="flex whitespace-nowrap gap-8 px-4 items-center"
      animate={{
        x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      }}
      transition={{
        ease: "linear",
        duration: items.length * 9, // Dynamic duration based on item count
        repeat: Infinity,
      }}
    >
      {content.map((item, i) => (
        <span key={i} className="text-[1.1rem] font-bold tracking-wide flex items-center gap-8">
          {item}
          <span className="w-[5px] h-[5px] rounded-full bg-white/70"></span>
        </span>
      ))}
    </motion.div>
  );
}
