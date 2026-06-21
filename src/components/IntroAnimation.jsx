// IntroAnimation.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './IntroAnimation.css';

const IntroAnimation = ({ onComplete }) => {
  // Feature pills data
  const pills = [
    { icon: "🩺", text: "Expert Doctors" },
    { icon: "📅", text: "Easy Appointments" },
    { icon: "💙", text: "Patient-First Care" }
  ];

  useEffect(() => {
    // Automatically finish the intro animation after 5 seconds
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Background decoration elements */}
      <div className="bg-decorations">
        {/* Ambient glowing circles */}
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>

        {/* Floating plus icons */}
        <svg className="floating-plus fp-1" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <svg className="floating-plus fp-2" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <svg className="floating-plus fp-3" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <svg className="floating-plus fp-4" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>

        {/* Floating heartbeat lines */}
        <svg className="heartbeat-decor hb-1" viewBox="0 0 100 40">
          <path d="M0 20 L30 20 L35 10 L40 30 L45 5 L50 25 L55 20 L100 20" />
        </svg>
        <svg className="heartbeat-decor hb-2" viewBox="0 0 100 40">
          <path d="M0 20 L40 20 L44 12 L48 28 L52 8 L56 24 L60 20 L100 20" />
        </svg>

        {/* Floating particles */}
        <div className="floating-particle pt-1"></div>
        <div className="floating-particle pt-2"></div>
        <div className="floating-particle pt-3"></div>
        <div className="floating-particle pt-4"></div>
      </div>

      {/* Center content wrapper */}
      <div className="intro-content">
        {/* STAGE 2: Logo and Rotating concentric circles */}
        <motion.div
          className="logo-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [0.8, 1.1, 1] }}
          transition={{
            delay: 1.0,
            duration: 1.0,
            times: [0, 0.6, 1.0],
            ease: "easeOut"
          }}
        >
          <img src="/assets/logo.png" alt="Vanitha Clinic Logo" className="logo-image" />
          <div className="ring-outer" />
          <div className="ring-inner" />
        </motion.div>

        {/* STAGE 3: Brand Name */}
        <motion.h1
          className="intro-brand-name"
          initial={{ opacity: 0, y: 20, letterSpacing: "0.02em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{
            delay: 2.0,
            duration: 1.0,
            ease: "easeOut"
          }}
        >
          Vanitha Clinic
        </motion.h1>

        {/* STAGE 4: Tagline */}
        <motion.p
          className="intro-tagline"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 3.0,
            duration: 1.0,
            ease: "easeOut"
          }}
        >
          Compassionate Care • Trusted Doctors • Better Health
        </motion.p>

        {/* STAGE 5: Feature Pills */}
        <div className="intro-pills">
          {pills.map((pill, idx) => (
            <motion.div
              key={idx}
              className="intro-pill"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 4.0 + idx * 0.1,
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
