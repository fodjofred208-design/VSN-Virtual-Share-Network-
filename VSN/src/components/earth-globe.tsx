// VSN — Virtual Share Network: Master Interactive Globe (Three.js implementation)
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';

const networkNodes = [
  { id: 'cm', name: 'Cameroon', lat: 5.96, lng: 10.16, tz: 'Africa/Douala', status: 'active' },
  { id: 'jp', name: 'Japan', lat: 36.20, lng: 138.25, tz: 'Asia/Tokyo', status: 'active' },
  { id: 'fr', name: 'France', lat: 46.23, lng: 2.21, tz: 'Europe/Paris', status: 'active' },
  { id: 'us', name: 'USA', lat: 37.09, lng: -95.71, tz: 'America/New_York', status: 'connecting' },
];

function latLngToV3(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function Earth({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(isDark ? '//unpkg.com/three-globe/example/img/earth-dark.jpg' : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
  }, [isDark]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0.2} />
    </Sphere>
  );
}

export default function InteractiveGlobe() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<any>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!selected) return;
    const iv = setInterval(() => {
      setTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: selected.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(iv);
  }, [selected]);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
        <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
        <Earth isDark={theme === 'dark'} />
        {networkNodes.map(node => (
          <mesh 
            key={node.id} 
            position={latLngToV3(node.lat, node.lng, 2)} 
            onClick={() => setSelected(node)}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={node.status === 'active' ? "#25e64a" : "#D4AF37"} />
          </mesh>
        ))}
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
      </Canvas>

      {selected && (
        <div className="absolute top-0 right-0 w-60 vsn-glass p-5 rounded-2xl border-gold/30 shadow-2xl z-[100] animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-black text-white">{selected.name}</h3>
            <button onClick={() => setSelected(null)} className="text-gold/40 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
             <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <p className="text-[8px] opacity-40 uppercase font-black">Local Time</p>
                <p className="text-2xl font-mono font-black text-gold tracking-tight">{time}</p>
             </div>
             <div className={`flex items-center gap-2 text-[9px] font-black justify-center py-2 rounded-lg ${selected.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                VSN STATUS: {selected.status.toUpperCase()}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
