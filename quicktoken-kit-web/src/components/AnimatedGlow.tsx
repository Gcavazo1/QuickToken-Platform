import React, { ReactNode } from 'react';

interface AnimatedGlowProps {
  children?: ReactNode;
  className?: string;
  color?: 'magenta' | 'cyan' | 'teal' | 'green' | 'orange' | 'gold' | 'maroon';
  intensity?: 'high' | 'medium' | 'low';
  opacity?: number;
}

export default function AnimatedGlow({ 
  children, 
  className = '', 
  color = 'teal', 
  intensity = 'medium',
  opacity = 0.5
}: AnimatedGlowProps) {
  let selectedColor = '';
  
  switch (color) {
    case 'magenta':
      selectedColor = 'rgba(236, 72, 153, 1)'; // pink-500
      break;
    case 'cyan':
      selectedColor = 'rgba(20, 184, 166, 1)'; // teal-500
      break;
    case 'teal':
      selectedColor = 'rgba(56, 178, 172, 1)'; // teal-400
      break;
    case 'green':
      selectedColor = 'rgba(34, 197, 94, 1)'; // green-500
      break;
    case 'orange':
      selectedColor = 'rgba(249, 115, 22, 1)'; // orange-500
      break;
    case 'gold':
      selectedColor = 'rgba(245, 158, 11, 1)'; // amber-500
      break;
    case 'maroon':
      selectedColor = 'rgba(190, 18, 60, 1)'; // rose-700
      break;
    default:
      selectedColor = 'rgba(56, 178, 172, 1)'; // teal-400
  }
  
  let intensityValue = '';
  
  switch (intensity) {
    case 'high':
      intensityValue = '0 0 20px';
      break;
    case 'medium':
      intensityValue = '0 0 15px';
      break;
    case 'low':
      intensityValue = '0 0 10px';
      break;
    default:
      intensityValue = '0 0 15px';
  }

  return (
    <div 
      className={`absolute inset-0 rounded-2xl ${className}`} 
      style={{
        background: `radial-gradient(circle at 50% 50%, ${selectedColor}05, transparent 60%)`,
        boxShadow: `${intensityValue} ${selectedColor}`,
        animation: 'pulse 3s ease-in-out infinite',
        opacity: opacity
      }}
    />
  );
}
