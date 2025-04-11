import React from 'react';
import Link from 'next/link';
import AnimatedGlow from './AnimatedGlow';

interface CTAProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export default function CTA({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}: CTAProps) {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient and decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-black z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dark-teal via-teal to-dark-teal"></div>
      <div className="absolute -top-5 left-1/4 w-40 h-40 rounded-full bg-orange opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-20 right-1/3 w-60 h-60 rounded-full bg-teal opacity-10 blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <AnimatedGlow color="teal" intensity="low" className="inline-block mb-8">
          <div className="h-1 w-16 bg-orange mx-auto rounded-full"></div>
        </AnimatedGlow>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-xl mx-auto">
          {title}
        </h2>
        
        <p className="text-lg text-gray-300 mb-12 max-w-xl mx-auto">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href={primaryButtonLink} className="btn-primary btn-glow">
            {primaryButtonText}
          </Link>
          
          {secondaryButtonText && secondaryButtonLink && (
            <Link href={secondaryButtonLink} className="btn-secondary">
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
