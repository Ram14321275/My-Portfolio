"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = [
  { text: "Hello", size: "text-[25vw] md:text-[12rem]" },
  { text: "नमस्ते", size: "text-[20vw] md:text-[9.5rem]" },
  { text: "హలో", size: "text-[22vw] md:text-[10rem]" },
  { text: "Hola", size: "text-[25vw] md:text-[12rem]" },
  { text: "Hallo", size: "text-[25vw] md:text-[12rem]" },
  { text: "Ciao", size: "text-[25vw] md:text-[12rem]" },
  { text: "Olá", size: "text-[25vw] md:text-[12rem]" },
  { text: "Привет", size: "text-[20vw] md:text-[10rem]" },
  { text: "أهلا", size: "text-[23vw] md:text-[11rem]" },
  { text: "안녕", size: "text-[25vw] md:text-[11rem]" },
  { text: "Jambo", size: "text-[20vw] md:text-[10rem]" },
  { text: "Γεια", size: "text-[23vw] md:text-[11.5rem]" },
  { text: "Salut", size: "text-[25vw] md:text-[12rem]" },
  { text: "Hej", size: "text-[25vw] md:text-[12rem]" }
];

export default function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 2500); 
    return () => clearInterval(interval);
  }, []);

  const currentGreeting = greetings[index] || greetings[0];

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={index}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block whitespace-nowrap ${currentGreeting.size}`}
      >
        {currentGreeting.text}
      </motion.span>
    </AnimatePresence>
  );
}
