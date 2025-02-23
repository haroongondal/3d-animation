import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import gsap from 'gsap';

export default function LiquidScene() {
  const canvasRef = useRef(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  let foxModel, liquidShaderPass;
  let scrollProgress = 0;
  let mouse = new THREE.Vector2(-10, -10);
  let lastMouseMove = 0;
  let cursorRef = useRef(null);

  useEffect(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Load HDR/EXR Room as Background
    new RGBELoader().load('/models/room.hdr', texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    // Load Fox Model
    new GLTFLoader().load('/models/Fox.glb', gltf => {
      foxModel = gltf.scene;
      foxModel.scale.set(10, 10, 10);
      foxModel.position.set(0, -3, 0);
      scene.add(foxModel);
    });

    // Camera Position
    camera.position.set(0, 1, 5);

    // Scroll-Based Camera Rotation
    const handleScroll = event => {
      const delta = event.deltaY * 0.0005;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress + delta));
    };

    window.addEventListener('wheel', handleScroll);

    // Post-Processing: Liquid Distortion Shader
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    liquidShaderPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uIntensity: { value: 0 } // Controls ripple strength
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          float dist = distance(vUv, uMouse);
          float ripple = exp(-dist * 20.0) * sin(dist * 50.0 - uTime * 5.0) * uIntensity;
          
          vec2 uvDistorted = vUv + ripple * normalize(vUv - uMouse);
          gl_FragColor = texture2D(tDiffuse, uvDistorted);
        }
      `,
      transparent: true
    });

    composer.addPass(liquidShaderPass);

    // Mouse Movement for Liquid Effect
    const handleMouseMove = event => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight;

      gsap.to(liquidShaderPass.uniforms.uMouse.value, {
        x,
        y,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(liquidShaderPass.uniforms.uIntensity, {
        value: 0.05, // Increase intensity when moving
        duration: 0.2
      });

      lastMouseMove = Date.now();

      // Move custom cursor
      gsap.to(cursorRef.current, {
        x: event.clientX - 15,
        y: event.clientY - 15,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      liquidShaderPass.uniforms.uTime.value += 0.02; // Update liquid animation

      // Gradually reduce intensity when mouse stops moving
      if (Date.now() - lastMouseMove > 100) {
        gsap.to(liquidShaderPass.uniforms.uIntensity, {
          value: 0, // Fade out ripples
          duration: 1.0
        });
      }

      // Rotate Camera Around Fox
      const angle = scrollProgress * Math.PI * 2;
      camera.position.x = Math.cos(angle) * 5;
      camera.position.z = Math.sin(angle) * 5;
      camera.lookAt(foxModel ? foxModel.position : new THREE.Vector3(0, 0, 0));

      composer.render();
    };

    animate();

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          cursor: 'none' // Hide default cursor
        }}
      />
      {/* Custom Cursor */}
      {/* <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '2px solid white',
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}
      /> */}
    </>
  );
}
