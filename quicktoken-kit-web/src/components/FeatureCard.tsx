import React, { ReactNode } from 'react';
import AnimatedGlow from './AnimatedGlow';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color?: 'blue' | 'magenta' | 'cyan';
}

export default function FeatureCard({ title, description, icon, color = 'blue' }: FeatureCardProps) {
  return (
    <div className="card card-glow transition-all duration-300 hover:-translate-y-1">
      <AnimatedGlow color={color} intensity="low" className="w-14 h-14 flex items-center justify-center mb-6 rounded-lg">
        <div className="text-3xl">
          {icon}
        </div>
      </AnimatedGlow>
      
      <h3 className="text-xl font-semibold mb-3 text-light-cyan">
        {title}
      </h3>
      
      <p className="text-gray-300 text-sm">
        {description}
      </p>
    </div>
  );
} 