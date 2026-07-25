import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Info, ZoomIn, ZoomOut } from 'lucide-react';

const PLANETS = [
  {name:'Mercury',r:0.15,d:3,  spd:4.7, color:'#b5b5b5'},
  {name:'Venus',  r:0.35,d:5,  spd:3.5, color:'#e8cda0'},
  {name:'Earth',  r:0.37,d:7,  spd:2.9, color:'#4fa3e0'},
  {name:'Mars',   r:0.22,d:9,  spd:2.4, color:'#c1440e'},
  {name:'Jupiter',r:0.90,d:13, spd:1.3, color:'#c88b3a'},
  {name:'Saturn', r:0.75,d:17, spd:0.97,color:'#e4d191',ring:true},
  {name:'Uranus', r:0.55,d:21, spd:0.68,color:'#7de8e8'},
  {name:'Neptune',r:0.50,d:25, spd:0.54,color:'#3f54ba'},
] as const;

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_,dt)=>{ if(ref.current) ref.current.rotation.y+=dt*0.1; });
  return (
    <group>
      <mesh ref={ref}><sphereGeometry args={[1.5,64,64]}/><meshStandardMaterial color="#FDB813" emissive="#FF6600" emissiveIntensity={0.6}/></mesh>
      <pointLight intensity={3} distance={100} decay={1} color="#FDB813"/>
      <mesh><sphereGeometry args={[1.8,32,32]}/><meshBasicMaterial color="#FF8C00" transparent opacity={0.06} side={THREE.BackSide}/></mesh>
    </group>
  );
}

function OrbitRing({radius}:{radius:number}) {
  const pts = Array.from({length:128},(_,i)=>{
    const a=(i/127)*Math.PI*2;
    return new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius);
  });
  return <line geometry={new THREE.BufferGeometry().setFromPoints(pts)}><lineBasicMaterial color="#ffffff" opacity={0.07} transparent/></line>;
}

function Planet({name,r,d,spd,color,ring}:{name:string;r:number;d:number;spd:number;color:string;ring?:boolean}) {
  const grp = useRef<THREE.Group>(null);
  const ang = useRef(Math.random()*Math.PI*2);
  const [hov,setHov] = useState(false);
  useFrame((_,dt)=>{
    ang.current+=dt*spd*0.05;
    if(grp.current){ grp.current.position.x=Math.cos(ang.current)*d; grp.current.position.z=Math.sin(ang.current)*d; grp.current.rotation.y+=dt*0.4; }
  });
  return (
    <group ref={grp}>
      <mesh onPointerOver={()=>setHov(true)} onPointerOut={()=>setHov(false)}>
        <sphereGeometry args={[r,32,32]}/>
        <meshStandardMaterial color={color} roughness={0.7} emissive={hov?color:'#000'} emissiveIntensity={hov?0.3:0}/>
      </mesh>
      {ring && <mesh rotation={[Math.PI/2.5,0,0]}><ringGeometry args={[r*1.4,r*2.2,64]}/><meshBasicMaterial color="#c8b88a" side={THREE.DoubleSide} transparent opacity={0.6}/></mesh>}
      {hov && <Html center distanceFactor={8}><div className="glass-card px-3 py-1 text-aurora text-xs font-mono whitespace-nowrap pointer-events-none">{name}</div></Html>}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15}/>
      <Stars radius={200} depth={80} count={6000} factor={4} saturation={0} fade speed={0.5}/>
      <Sun/>
      {PLANETS.map(p=>(
        <group key={p.name}>
          <OrbitRing radius={p.d}/>
          <Planet name={p.name} r={p.r} d={p.d} spd={p.spd} color={p.color} ring={'ring' in p?p.ring:undefined}/>
        </group>
      ))}
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={3} maxDistance={80} autoRotate autoRotateSpeed={0.2} enablePan={false}/>
    </>
  );
}

export default function SpaceMapPage() {
  const [info,setInfo]=useState(false);
  return (
    <div className="h-full relative bg-void">
      <Canvas camera={{position:[0,20,40],fov:60}} gl={{antialias:true}} dpr={[1,2]}>
        <Suspense fallback={null}><Scene/></Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-10">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="glass-card px-4 py-3 pointer-events-auto">
          <p className="font-display text-xs text-aurora tracking-widest mb-1">SOLAR SYSTEM</p>
          <p className="text-white/50 text-xs">Drag to orbit · Scroll to zoom</p>
        </motion.div>
        <button onClick={()=>setInfo(v=>!v)} className="glass-card p-3 pointer-events-auto hover:border-aurora/40 transition-colors">
          <Info className="w-4 h-4 text-white/60"/>
        </button>
      </div>
      {info && (
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="absolute top-16 right-4 glass-card p-4 z-10 max-w-xs">
          <p className="font-display text-xs text-aurora tracking-widest mb-3">PLANETS</p>
          <div className="space-y-2">
            {PLANETS.map(p=>(
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:p.color}}/>
                <span className="text-white/70 text-xs">{p.name}</span>
                <span className="text-white/30 text-xs ml-auto">{p.d} AU</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-card px-4 py-2 flex items-center gap-3 text-white/40 text-xs">
          <ZoomIn className="w-4 h-4"/> Scroll to zoom <ZoomOut className="w-4 h-4"/>
        </div>
      </div>
    </div>
  );
}
