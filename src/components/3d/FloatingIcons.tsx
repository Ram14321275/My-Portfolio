"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface IconData {
  id: string;
  targetPos: [number, number, number];
  targetRot: [number, number, number];
  imageId: string;
  width: number;
}

export default function FloatingIcons() {
  const groupRef = useRef<THREE.Group>(null);
  const iconsRef = useRef<(THREE.Mesh | null)[]>([]);
  const [textures, setTextures] = useState<Record<string, { tex: THREE.Texture, aspect: number }>>({});

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const files = [
      { id: "canva", url: "/images/canva.webp" },
      { id: "color", url: "/images/color.png" },
      { id: "filmora", url: "/images/filmora.webp" },
      { id: "ps", url: "/images/ps.png" },
      { id: "sec", url: "/images/sec.png" },
      { id: "vs", url: "/images/vs.webp" }
    ];
    
    files.forEach((file) => {
      loader.load(file.url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const aspect = tex.image ? tex.image.width / tex.image.height : 1;
        setTextures((prev) => ({ ...prev, [file.id]: { tex, aspect } }));
      });
    });
  }, []);

  const iconsData: IconData[] = [
    { id: "canva", targetPos: [-1.8, 1.5, 0.5], targetRot: [0, 0, -0.1], imageId: "canva", width: 1.5 },
    { id: "color", targetPos: [-1.2, 0.2, 1], targetRot: [0, 0, 0.2], imageId: "color", width: 1.2 },
    { id: "filmora", targetPos: [-2.0, -0.8, 0.2], targetRot: [0, 0, -0.1], imageId: "filmora", width: 1.6 },
    { id: "ps", targetPos: [1.8, 1.6, -0.5], targetRot: [0, 0, 0.15], imageId: "ps", width: 1.5 },
    { id: "sec", targetPos: [2.2, 0.4, 0.8], targetRot: [0, 0, -0.2], imageId: "sec", width: 1.2 },
    { id: "vs", targetPos: [2.0, -1.0, 0.5], targetRot: [0, 0, 0.1], imageId: "vs", width: 1.6 }
  ];

  useGSAP(() => {
    // Initial state: hide behind portrait
    iconsRef.current.forEach((mesh) => {
      if (!mesh) return;
      gsap.set(mesh.position, { x: 0, y: 0, z: -2 });
      gsap.set(mesh.scale, { x: 0, y: 0, z: 0 }); // Start at 0 for a true blast
    });

    // Burst animation
    const tl = gsap.timeline({ delay: 0.6 });
    
    iconsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const data = iconsData[index];
      
      // The Blast! Everything happens simultaneously at exactly 0 offset
      tl.to(mesh.position, {
        x: data.targetPos[0],
        y: data.targetPos[1],
        z: data.targetPos[2],
        duration: 2.5, // Long duration for the smooth tail
        ease: "expo.out", // Explosive start, extremely smooth deceleration
      }, 0); 
      
      tl.to(mesh.scale, {
        x: 1, y: 1, z: 1,
        duration: 2.0,
        ease: "expo.out",
      }, 0);

      tl.to(mesh.rotation, {
        x: data.targetRot[0],
        y: data.targetRot[1],
        z: data.targetRot[2],
        duration: 2.5,
        ease: "expo.out",
      }, 0);
    });
  }, { scope: groupRef, dependencies: [textures] }); // Re-run if textures load slowly

  // Continuous subtle floating
  useFrame((state) => {
    iconsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime + index * 10;
      mesh.position.y += Math.sin(t) * 0.002;
      mesh.rotation.z += Math.sin(t * 0.5) * 0.001; // changed to z for 2D planes
    });
  });

  return (
    <group ref={groupRef}>
      {iconsData.map((data, index) => {
        const textureData = textures[data.imageId];
        return (
          <mesh 
            key={data.id} 
            ref={(el) => { iconsRef.current[index] = el; }}
          >
            {textureData ? (
              <>
                <planeGeometry args={[data.width, data.width / textureData.aspect]} />
                <meshBasicMaterial map={textureData.tex} transparent={true} />
              </>
            ) : null}
          </mesh>
        );
      })}
    </group>
  );
}
