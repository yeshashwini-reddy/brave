// ScrollReveal.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ children, direction = 'up', delay = 0, duration = 0.6, once = true }) => {
  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 25 : direction === 'down' ? -25 : 0,
      x: direction === 'left' ? 25 : direction === 'right' ? -25 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1], // Premium cubic-bezier easeOut
      }
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, staggerDelay = 0.1, delay = 0, once = true }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};
export default ScrollReveal;
