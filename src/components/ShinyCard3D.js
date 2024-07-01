import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import shaders from './shaders';

const useThree = (containerRef, fragmentShader) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: fragmentShader
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 1;

    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.u_resolution.value.x = width;
      material.uniforms.u_resolution.value.y = height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId;

    const animate = (time) => {
      material.uniforms.u_time.value = time / 1000;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [fragmentShader]);
};

const ShaderCard = ({ onClose }) => {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState('Shader Card');
  const [content, setContent] = useState('Edit this content');
  const [currentShaderIndex, setCurrentShaderIndex] = useState(0);

  useThree(containerRef, shaders[currentShaderIndex].code);

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 40;
    const rotateY = -(x - centerX) / 40;

    setRotation({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  const nextShader = useCallback(() => {
    setCurrentShaderIndex((prevIndex) => (prevIndex + 1) % shaders.length);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans p-8">
      <div 
        className="flex-grow bg-white rounded-xl shadow-xl overflow-hidden relative"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={containerRef} className="absolute inset-0" />
        <div className="relative z-10 p-8 h-full flex flex-col">
          <input
            className="text-4xl font-bold mb-4 bg-transparent border-none outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="flex-grow text-lg bg-transparent border-none outline-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              <button
                onClick={nextShader}
                className="bg-white bg-opacity-50 text-gray-800 px-4 py-2 rounded hover:bg-opacity-75 transition-colors"
              >
                Next Shader
              </button>
              <span className="ml-2 text-gray-600">
                Current: {shaders[currentShaderIndex].name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-50 text-gray-800 px-4 py-2 rounded hover:bg-opacity-75 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShaderCard;