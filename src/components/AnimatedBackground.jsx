// AnimatedBackground.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Set up Framer Motion scroll-linked parallax outputs
  const { scrollY } = useScroll();

  // Custom translate ratios for depth creation (moves layers 8px to 30px subtly)
  const yLayer1 = useTransform(scrollY, [0, 1000], [0, -15]); // Waves (Layer 1)
  const yLayer2 = useTransform(scrollY, [0, 1000], [0, -10]); // ECG Heartbeats (Layer 2)
  const yLayer3 = useTransform(scrollY, [0, 1000], [0, -25]); // Drifting Crosses (Layer 3)
  const yLayer4 = useTransform(scrollY, [0, 1000], [0, -20]); // Ambient SVGs (Layer 4)
  const yLayer5 = useTransform(scrollY, [0, 1000], [0, -8]);  // Canvas Network (Layer 5)
  const yLayer6 = useTransform(scrollY, [0, 1000], [0, -30]); // Glow Blobs (Layer 6)

  // Canvas Healthcare connection network (Layer 5)
  useEffect(() => {
    if (reducedMotion || !isLanding) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle nodes configuration
    const particles = [];
    const particleCount = 22;

    class Particle {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow movement: -0.15px to 0.15px per frame
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1.5;
        this.type = Math.random() > 0.4 ? 'dot' : 'plus';
        this.opacity = Math.random() * 0.05 + 0.03; // opacity 0.03 to 0.08
      }

      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw() {
        ctx.strokeStyle = `rgba(63, 116, 231, ${this.opacity})`;
        ctx.fillStyle = `rgba(63, 116, 231, ${this.opacity})`;
        ctx.lineWidth = 1.5;

        if (this.type === 'plus') {
          const size = this.radius * 2;
          ctx.beginPath();
          ctx.moveTo(this.x - size, this.y);
          ctx.lineTo(this.x + size, this.y);
          ctx.moveTo(this.x, this.y - size);
          ctx.lineTo(this.x, this.y + size);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      particles.forEach((p) => {
        p.update(w, h);
        p.draw();
      });

      // Digital Healthcare connections
      const maxDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.045; // Faint opacity lines
            ctx.strokeStyle = `rgba(49, 80, 184, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, isLanding]);

  // If user prefers-reduced-motion, render a simple static healthcare gradient
  if (reducedMotion) {
    return (
      <div className="animated-bg-root">
        <div className="glow-blob-layer-item glow-item-1" style={{ top: '-10%', left: '-5%', opacity: 0.03 }} />
        <div className="glow-blob-layer-item glow-item-2" style={{ bottom: '15%', right: '-5%', opacity: 0.03 }} />
      </div>
    );
  }

  return (
    <div className="animated-bg-root">
      
      {/* LAYER 6: Soft radial glows (Pulsing background blobs) */}
      <motion.div className="bg-layer" style={{ y: yLayer6 }}>
        <div className="glow-blob-layer-item glow-item-1" style={{ top: '-10%', left: '-5%' }} />
        <div className="glow-blob-layer-item glow-item-2" style={{ bottom: '15%', right: '-5%' }} />
        <div className="glow-blob-layer-item glow-item-3" style={{ top: '40%', left: '30%' }} />
      </motion.div>

      {/* LAYER 1: Soft flowing blue waves (Morphing SVG waveforms) */}
      <motion.div className="bg-layer layer-waves" style={{ y: yLayer1 }}>
        {/* Soft Blue Wave */}
        <svg className="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <motion.path
            fill="rgba(63, 116, 231, 0.025)"
            d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
            animate={{
              d: [
                "M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z",
                "M0,64L120,53.3C240,43,480,21,720,32C960,43,1200,85,1320,106.7L1440,128L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z",
                "M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>
      
      <motion.div className="bg-layer layer-waves" style={{ y: yLayer1, bottom: '25px' }}>
        {/* Light Teal Wave */}
        <svg className="wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <motion.path
            fill="rgba(223, 248, 245, 0.035)"
            d="M0,64L120,53.3C240,43,480,21,720,32C960,43,1200,85,1320,106.7L1440,128L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
            animate={{
              d: [
                "M0,64L120,53.3C240,43,480,21,720,32C960,43,1200,85,1320,106.7L1440,128L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z",
                "M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z",
                "M0,64L120,53.3C240,43,480,21,720,32C960,43,1200,85,1320,106.7L1440,128L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
              ]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      {/* LAYER 2: ECG heartbeat lines travelling left to right */}
      <motion.div className="bg-layer" style={{ y: yLayer2 }}>
        <div className="layer-ecg-container" style={{ top: '22%' }}>
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              className="ecg-svg-path"
              d="M0,50 L250,50 L270,30 L280,70 L290,10 L300,60 L310,50 L350,50 L650,50 L670,30 L680,70 L690,10 L700,60 L710,50 L1000,50"
            />
          </svg>
        </div>
        <div className="layer-ecg-container" style={{ top: '68%' }}>
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              className="ecg-svg-path"
              style={{ animationDelay: '3.5s' }}
              d="M0,50 L400,50 L420,30 L430,70 L440,10 L450,60 L460,50 L500,50 L850,50 L870,30 L880,70 L890,10 L900,60 L910,50 L1000,50"
            />
          </svg>
        </div>
      </motion.div>

      {/* LAYER 3: Medical cross symbols (slow drift, rotate, fade) */}
      <motion.div className="bg-layer" style={{ y: yLayer3 }}>
        <svg className="floating-cross-element cross-drift-1" style={{ top: '15%', left: '10%', width: '28px', height: '28px' }} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <svg className="floating-cross-element cross-drift-2" style={{ top: '48%', left: '88%', width: '36px', height: '36px', animationDelay: '4s' }} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <svg className="floating-cross-element cross-drift-3" style={{ top: '78%', left: '14%', width: '32px', height: '32px', animationDelay: '8s' }} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.div>

      {/* LAYER 4: Floating outline healthcare icons */}
      <motion.div className="bg-layer" style={{ y: yLayer4 }}>
        {/* 1. Stethoscope outline */}
        <svg className="ambient-outline-icon icon-float-1" style={{ top: '12%', left: '6%', width: '48px', height: '48px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v10m0 0a4 4 0 1 0-8 0m8 0a4 4 0 1 1 8 0M12 12v6m0 0H8m4 0h4" />
        </svg>

        {/* 2. Heart with cross outline */}
        <svg className="ambient-outline-icon icon-float-2" style={{ top: '22%', left: '42%', width: '48px', height: '48px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5v8M8 9h8" />
        </svg>

        {/* 3. Shield outline */}
        <svg className="ambient-outline-icon icon-float-3" style={{ top: '62%', left: '18%', width: '44px', height: '44px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>

        {/* 4. Calendar outline */}
        <svg className="ambient-outline-icon icon-float-1" style={{ top: '82%', right: '12%', width: '40px', height: '40px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        {/* 5. Hospital outline */}
        <svg className="ambient-outline-icon icon-float-2" style={{ top: '48%', left: '74%', width: '56px', height: '56px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21h18M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M10 9h4M12 7v4" />
        </svg>
      </motion.div>

      {/* LAYER 5: Canvas healthcare connection network ecosystem */}
      {isLanding && (
        <motion.div className="bg-layer" style={{ y: yLayer5 }}>
          <canvas ref={canvasRef} className="layer-canvas" />
        </motion.div>
      )}

    </div>
  );
};

export default AnimatedBackground;
