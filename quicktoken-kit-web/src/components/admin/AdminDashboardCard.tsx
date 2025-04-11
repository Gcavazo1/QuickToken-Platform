import React from 'react';
import Link from 'next/link';
import AnimatedGlow from '../AnimatedGlow';

interface AdminDashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color?: 'teal' | 'orange' | 'gold' | 'maroon';
}

export default function AdminDashboardCard({
  title,
  description,
  icon,
  link,
  color = 'teal'
}: AdminDashboardCardProps) {
  return (
    <Link href={link} className="block">
      <div className="bg-space-navy rounded-lg p-6 h-full border border-deep-blue hover:border-teal transition-colors duration-200 hover:shadow-neon-blue">
        <div className="flex items-start">
          <AnimatedGlow color={color} intensity="low" className="w-12 h-12 flex items-center justify-center rounded-md mr-4 flex-shrink-0">
            <div className="text-2xl">{icon}</div>
          </AnimatedGlow>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-light-cyan">
              {title}
            </h3>
            
            <p className="text-gray-300 text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
} 