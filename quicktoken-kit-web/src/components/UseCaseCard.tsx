import React, { ReactNode } from 'react';

interface UseCaseCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export default function UseCaseCard({ title, description, icon, className = '' }: UseCaseCardProps) {
  return (
    <div className={`flex items-start gap-5 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 bg-magenta bg-opacity-20 rounded-full flex items-center justify-center text-magenta">
        {icon}
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          {title}
        </h3>
        
        <p className="text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
} 