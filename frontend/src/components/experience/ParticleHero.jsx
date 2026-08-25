import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "./Shared";

const Field = ({ count, entering }) => {
  const points = useRef();
  const group = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // cylindrical tunnel distribution so the "fly-through" feels real
      const r = 2.2 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = Math.sin(theta) * r;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.02;
    // mouse parallax
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.25, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.18, 0.05);
    // particles drift toward camera; accelerate hard when entering
    const speed = entering.current ? 14 : 0.6;
    const pos = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let z = pos.getZ(i) + speed * delta;
      if (z > 6) z = -24;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#00F0FF" transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <Processor entering={entering} />
    </group>
  );
};

const Processor = ({ entering }) => {
  const outer = useRef();
  const inner = useRef();
  const ring = useRef();
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const spin = entering.current ? 6 : 1;
    outer.current.rotation.y += delta * 0.15 * spin;
    outer.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    inner.current.rotation.y -= delta * 0.3 * spin;
    ring.current.rotation.z += delta * 0.1 * spin;
    const s = entering.current ? 1 + Math.min(t * 0, 0) : 1;
    outer.current.scale.setScalar(s);
  });
  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial wireframe color="#00F0FF" transparent opacity={0.35} />
      </mesh>
      <mesh ref={inner}>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshBasicMaterial wireframe color="#FF9D00" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.006, 8, 90]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

const ParticleHero = ({ entering }) => {
  const mobile = useIsMobile();
  return (
    <div className="absolute inset-0" data-testid="hero-particle-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 62 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Field count={mobile ? 450 : 1400} entering={entering} />
      </Canvas>
    </div>
  );
};

export default ParticleHero;
