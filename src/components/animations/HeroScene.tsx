"use client";

import { useRef, Suspense }       from "react";
import { Canvas, useFrame }       from "@react-three/fiber";
import { Float, Environment, Text3D, Center, MeshDistortMaterial } from "@react-three/drei";
import * as THREE                 from "three";

function FloatingGavel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        {/* Gavel head */}
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.5, 0.5]} />
            <MeshDistortMaterial
              color="#F97316"
              metalness={0.8}
              roughness={0.2}
              distort={0.1}
              speed={2}
            />
          </mesh>
          {/* Handle */}
          <mesh position={[0.4, -0.6, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.08, 0.06, 1.2, 8]} />
            <meshStandardMaterial color="#92400E" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      </mesh>
    </Float>
  );
}

function FloatingOrbs() {
  const orbData = [
    { pos: [-3, 2, -2],  color: "#F97316", size: 0.3 },
    { pos: [3, -1, -3],  color: "#EF4444", size: 0.2 },
    { pos: [-2, -2, -1], color: "#EC4899", size: 0.25 },
    { pos: [2.5, 2, -2], color: "#F97316", size: 0.15 },
    { pos: [0, 3, -3],   color: "#EF4444", size: 0.2 },
  ];

  return (
    <>
      {orbData.map((orb, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.8}>
          <mesh position={orb.pos as [number, number, number]}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              metalness={0.9}
              roughness={0.1}
              emissive={orb.color}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function ParticleField() {
  const count   = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = new THREE.Object3D();

  const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 12);

  useFrame((state) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime;
      dummy.position.set(
        positions[i * 3] + Math.sin(t * 0.3 + i) * 0.1,
        positions[i * 3 + 1] + Math.cos(t * 0.2 + i) * 0.1,
        positions[i * 3 + 2]
      );
      dummy.scale.setScalar(0.03 + Math.sin(t + i) * 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#F97316" metalness={0.9} roughness={0.1} emissive="#F97316" emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#F97316" />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#3B82F6" />
          <pointLight position={[0, 0, 3]} intensity={2} color="#F97316" />

          <FloatingGavel />
          <FloatingOrbs />
          <ParticleField />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
