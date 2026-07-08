"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Portrait() {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);
  const [aspect, setAspect] = useState(6 / 7);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/images/portrait.png",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
        if (tex.image) {
          setAspect(tex.image.width / tex.image.height);
        }
      },
      undefined,
      () => {
        setError(true);
      }
    );
  }, []);

  useGSAP(() => {
    if (groupRef.current) {
      // Slide up into place reliably using fromTo
      gsap.fromTo(groupRef.current.position, 
        { y: -15 },
        {
          y: -0.2,
          duration: 1.6,
          ease: "power4.out", // Smoother deceleration
          delay: 0.1
        }
      );
    }
  }, { scope: groupRef });

  return (
    <group ref={groupRef}>
      {texture && !error ? (
        <mesh>
          <planeGeometry args={[8.5 * aspect, 8.5]} />
          <meshBasicMaterial map={texture} transparent={true} />
        </mesh>
      ) : (
        <mesh>
          <planeGeometry args={[8.5 * aspect, 8.5]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
