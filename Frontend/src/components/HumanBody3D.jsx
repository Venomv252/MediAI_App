import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const BodyPart = ({ position, args, type, name, onPartClick }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  // Gentle breathing and pulsing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (name === "Chest" || name === "Torso") {
      meshRef.current.scale.x = 1 + Math.sin(t * 2) * 0.02;
      meshRef.current.scale.z = 1 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onPartClick(name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "crosshair";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {type === "sphere" ? <sphereGeometry args={args} /> : <boxGeometry args={args} />}
      
      {/* Premium Glassmorphism Material for medical scan look */}
      <meshPhysicalMaterial
        color={hovered ? "#3b82f6" : "#e0e7ff"}
        metalness={0.2}
        roughness={0.1}
        transmission={0.95} // glass-like
        thickness={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        ior={1.5}
        emissive={hovered ? "#3b82f6" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
};

const FuturisticMannequin = ({ onPartClick }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1; 
  });

  return (
    <group ref={groupRef}>
      {/* Abstract sleek proportions */}
      <BodyPart name="Head" type="sphere" position={[0, 2.6, 0]} args={[0.35, 64, 64]} onPartClick={onPartClick} />
      <BodyPart name="Neck" type="box" position={[0, 2.0, 0]} args={[0.15, 0.5, 0.15]} onPartClick={onPartClick} />
      <BodyPart name="Torso" type="box" position={[0, 0.8, 0]} args={[1.0, 1.8, 0.5]} onPartClick={onPartClick} />
      
      <BodyPart name="Left Arm" type="box" position={[-0.8, 0.9, 0]} args={[0.25, 1.6, 0.25]} onPartClick={onPartClick} />
      <BodyPart name="Right Arm" type="box" position={[0.8, 0.9, 0]} args={[0.25, 1.6, 0.25]} onPartClick={onPartClick} />

      <BodyPart name="Left Leg" type="box" position={[-0.25, -1.1, 0]} args={[0.3, 1.8, 0.3]} onPartClick={onPartClick} />
      <BodyPart name="Right Leg" type="box" position={[0.25, -1.1, 0]} args={[0.3, 1.8, 0.3]} onPartClick={onPartClick} />
      
      {/* Inner glowing core to make it look sci-fi */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default function HumanBody3D({ onPartClick }) {
  return (
    <div className="w-full h-[600px] relative rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-900 border border-white/10">
      
      {/* Decorative UI Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold tracking-wide text-blue-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          AI Scannner Active
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 z-10 text-white/50 text-xs tracking-widest uppercase align-middle flex items-center gap-2">
        <span>Rotate · Zoom · Select</span>
      </div>

      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        {/* Sleek lighting setup */}
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} color="#ffffff" />
        <spotLight position={[-5, -5, -5]} angle={0.2} penumbra={1} intensity={1} color="#3b82f6" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <FuturisticMannequin onPartClick={onPartClick} />
        </Float>
        
        <Environment preset="night" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.8} scale={15} blur={2.5} far={4} color="#000000" />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
