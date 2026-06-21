import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroImg = "/assets/hero.png";
const MotionLink = motion(Link);

const Hero = () => {
  // Check prefers-reduced-motion state
  const [reducedMotion, setReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <section className="relative bg-primary-light bg-opacity-20 py-24 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-4 relative z-10">
        
        {/* Left: Vanitha Clinic Text Card */}
        <motion.div 
          className="md:w-1/2 text-center md:text-left space-y-6 bg-white bg-opacity-65 p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100/50 backdrop-blur-sm"
          animate={reducedMotion ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            Simple Healthcare for Everyone
          </h1>
          <p className="text-lg text-gray-700 max-w-md mx-auto md:mx-0 leading-relaxed">
            Book appointments with trusted doctors in just a few clicks. Manage your health effortlessly.
          </p>
          <MotionLink 
            to="/book-appointment" 
            className="inline-block mt-2 px-6 py-3 bg-primary text-white rounded-xl shadow-md font-semibold hover:bg-primary-dark transition-colors"
            whileHover={reducedMotion ? {} : { y: -3, boxShadow: "0 10px 25px rgba(63, 116, 231, 0.3)" }}
            transition={{ duration: 0.25 }}
          >
            Book Appointment
          </MotionLink>
        </motion.div>

        {/* Right: Floating Doctor Illustration */}
        <motion.div 
          className="md:w-1/2 mt-8 md:mt-0 flex justify-center"
          animate={reducedMotion ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src={heroImg} 
            alt="Clinic hero illustration" 
            className="max-w-full h-auto rounded-3xl shadow-lg border border-slate-100" 
          />
        </motion.div>

      </div>
      
      {/* Subtle decorative gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/10 to-transparent" />
    </section>
  );
};

export default Hero;
