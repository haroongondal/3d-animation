// components/Loader.js
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

const Loader = ({ onComplete }) => {
  const loaderRef = useRef();
  const threeCanvasRef = useRef();
  const [phase, setPhase] = useState(1);
  const totalPhases = 5;

  useEffect(() => {
    // Setup Three.js scene for a subtle rotating shape
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    threeCanvasRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animateThree = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animateThree);
    };
    animateThree();

    // Animate numerical progress (simulate phase changes)
    const interval = setInterval(() => {
      setPhase(prev => {
        if (prev < totalPhases) return prev + 1;
        clearInterval(interval);
        // When done, animate loader exit
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: onComplete
        });
        return prev;
      });
    }, 800); // each phase lasts 800ms

    return () => clearInterval(interval);
  }, [onComplete, totalPhases]);

  return (
    <div
      ref={loaderRef}
      className='fixed inset-0 flex flex-col items-center justify-center bg-white z-50'
    >
      <div ref={threeCanvasRef} className='mb-4'></div>
      <div className='text-2xl font-mono'>
        {phase}/{totalPhases}
      </div>
    </div>
  );
};

export default Loader;
