"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import Portrait from "./Portrait";
import FloatingIcons from "./FloatingIcons";

export default function Scene() {
  return (
    <div className="absolute right-0 top-0 z-0 hidden h-screen w-full pointer-events-none md:block lg:w-[62%]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <group position={[1, -1, 0]}>
            <Portrait />
            <FloatingIcons />
            <ContactShadows 
              position={[0, -3.5, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={2} 
              far={4.5} 
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
