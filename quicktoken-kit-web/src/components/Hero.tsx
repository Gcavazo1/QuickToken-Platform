import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax effect for the hero background
  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const translateY = scrollY * 0.4; // Adjust for parallax intensity
      
      // Apply parallax effect to the background image
      const bgElement = heroRef.current.querySelector('.hero-bg') as HTMLElement;
      if (bgElement) {
        bgElement.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center">
      {/* Base Hero Background with Parallax */}
      <div className="absolute inset-0 z-0 hero-bg transition-transform duration-200">
        <Image
          src="/hero.jpg"
          alt="Cyberpunk digital world"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
      </div>
      
      {/* Animated circuit pattern overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 mix-blend-screen bg-circuit-pattern"></div>
      
      {/* Strong left-to-right gradient overlay for text readability */}
      <div 
        className="absolute inset-0 z-[2]" 
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 100%)'
        }}
      ></div>
      
      {/* Bottom gradient for transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary to-transparent z-[2]"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 pt-36">
        <div className="max-w-4xl animate-fade-in">
          <div className="inline-block mb-6 animate-slide-up">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-teal/40 shadow-[0_0_15px_rgba(69,181,196,0.2)]">
              <div className="mr-2 w-2.5 h-2.5 rounded-full bg-teal animate-pulse"></div>
              <span className="text-teal-100 font-mono text-xs tracking-wider">
                ERC-20 TOKEN DEPLOYMENT KIT
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up-delayed tracking-wider">
            <span className="text-white font-heading text-shadow-teal">DEPLOY YOUR TOKEN.</span> <br />
            <span className="text-teal font-heading text-shadow-teal">NO CODE.</span> <br />
            <span className="text-orange relative inline-block font-heading text-shadow-orange">
              NO LIMITS.
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange to-transparent rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl animate-slide-up-delayed-2 font-body tracking-tight">
            The QuickToken-Kit lets you instantly launch a custom ERC-20 token with advanced features. 
            Perfect for creators, DAOs, and developers.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up-delayed-3">
            <Link href="/dapp" className="btn-primary btn-glow transition-transform duration-300 hover:scale-105 font-flynnhollow">
              DEPLOY NOW
            </Link>
            
            <Link 
              href="https://github.com/Gcavazo1/QuickToken-Platform.git" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary transition-transform duration-300 hover:scale-105 font-flynnhollow"
            >
              VIEW ON GITHUB
            </Link>
          </div>
          
          {/* Tech Stack Icons */}
          <div className="mt-16 flex flex-wrap items-center gap-8 animate-fade-in-delayed">
            <p className="text-teal text-sm font-body">POWERED BY:</p>
            
            {/* Ethereum */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9983 0L11.8564 0.474904V16.4218L11.9983 16.5631L19.3711 12.1019L11.9983 0Z" fill="currentColor"/>
                <path d="M11.9968 0L4.62402 12.1019L11.9968 16.5631V8.86868V0Z" fill="currentColor" fillOpacity="0.8"/>
                <path d="M11.9983 17.9543L11.918 18.0484V23.6493L11.9983 23.8873L19.3757 13.4957L11.9983 17.9543Z" fill="currentColor"/>
                <path d="M11.9968 23.8873V17.9543L4.62402 13.4957L11.9968 23.8873Z" fill="currentColor" fillOpacity="0.8"/>
                <path d="M11.9983 16.5631L19.3711 12.1019L11.9983 8.86865V16.5631Z" fill="currentColor" fillOpacity="0.5"/>
                <path d="M4.62402 12.1019L11.9968 16.5631V8.86865L4.62402 12.1019Z" fill="currentColor" fillOpacity="0.6"/>
              </svg>
              <span className="text-white text-xs font-body">ETHEREUM</span>
            </div>
            
            {/* Hardhat */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-110">
              <span className="text-white text-xs font-body">🎩 HARDHAT</span>
            </div>
            
            {/* OpenZeppelin */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-110">
              <span className="text-white text-xs font-body">🛡️ OPENZEPPELIN</span>
            </div>
            
            {/* Ethers.js */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-110">
              <span className="text-white text-xs font-body">📡 ETHERS.JS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
