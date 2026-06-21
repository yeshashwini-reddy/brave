import React from 'react';
import { Eye, ShieldCheck, HeartPulse } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

const About = () => (
  <div className="container mx-auto max-w-5xl py-6 space-y-10">
    
    {/* Page Header */}
    <ScrollReveal direction="up" duration={0.7}>
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="px-3 py-1 bg-blue-50 text-primary font-semibold text-xs rounded-full uppercase tracking-wider">
          Our Organization
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <HeartPulse className="text-primary" size={32} />
          <span>About Vanitha Clinic</span>
        </h1>
        <p className="text-slate-600 leading-relaxed text-base md:text-lg">
          Vanitha Clinic is a modern clinic management solution designed to simplify appointments, patient records, and doctor schedules. Our mission is to provide seamless, compassionate care through an intuitive digital platform.
        </p>
      </div>
    </ScrollReveal>

    {/* Vision & Values Grid */}
    <StaggerContainer staggerDelay={0.15}>
      <div className="grid md:grid-cols-2 gap-8 pt-4">
        
        {/* Vision Card */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 text-primary rounded-xl">
                <Eye size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Our Vision</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Empowering healthcare clinics with advanced digital solutions to deliver better patient experiences and optimized health outcomes globally.
            </p>
          </div>
        </ScrollReveal>

        {/* Values Card */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Our Values</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Care, Transparency, Professional Integrity, and continuous technological Innovation are the fundamental values guiding our healthcare mission.
            </p>
          </div>
        </ScrollReveal>
        
      </div>
    </StaggerContainer>
  </div>
);

export default About;
