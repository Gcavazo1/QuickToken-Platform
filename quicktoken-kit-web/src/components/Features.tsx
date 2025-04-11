import React, { useEffect, ComponentType, SVGProps } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  RocketLaunchIcon, 
  CubeIcon, 
  LockClosedIcon, 
  CurrencyDollarIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import AnimatedGlow from './AnimatedGlow';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// This component safely renders icons with enhanced styling
function IconWrapper({ icon: Icon, color }: { icon: IconType; color: GlowColor }) {
  const getGradient = () => {
    switch(color) {
      case 'teal': return 'from-teal-500 to-teal-700';
      case 'cyan': return 'from-cyan-500 to-cyan-700';
      case 'magenta': return 'from-pink-500 to-pink-700';
      case 'green': return 'from-green-500 to-green-700';
      default: return 'from-teal-500 to-teal-700';
    }
  };

  return (
    <div className={`relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${getGradient()} p-3`}>
      <div className="absolute inset-0 rounded-xl opacity-50 animate-pulse-glow" 
        style={{ 
          boxShadow: `0 0 15px var(--feature-color)`,
          '--feature-color': color === 'teal' ? '#45B5C4' : 
                            color === 'cyan' ? '#22D3EE' : 
                            color === 'magenta' ? '#EC4899' : '#22C55E'
        } as React.CSSProperties}></div>
      <Icon className="h-8 w-8 text-white relative z-10" aria-hidden="true" />
    </div>
  );
}

type GlowColor = 'magenta' | 'cyan' | 'teal' | 'green';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
  glowColor: GlowColor;
  index: number;
}

// Enhanced feature card component
function FeatureCard({ title, description, icon, glowColor, index }: FeatureCardProps) {
  // Function to get title color based on glow color
  const getTitleColor = () => {
    switch(glowColor) {
      case 'teal': return 'text-teal';
      case 'cyan': return 'text-cyan';
      case 'magenta': return 'text-pink';
      case 'green': return 'text-green';
      default: return 'text-teal';
    }
  };

  return (
    <div 
      className="relative bg-gray-900 rounded-2xl p-6 shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl border border-gray-800" 
      data-aos="fade-up"
      data-aos-delay={index * 100}
      data-aos-duration="800"
      data-aos-easing="ease-out-cubic"
    >
      <AnimatedGlow color={glowColor} opacity={0.15} />
      
      <div className="relative z-10">
        <div className="mb-5">
          <IconWrapper icon={icon} color={glowColor} />
        </div>
        <h3 className={`text-xl font-bold ${getTitleColor()} mb-2 font-heading`}>{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}

interface Feature {
  title: string;
  description: string;
  icon: IconType;
  glowColor: GlowColor;
}

export default function Features() {
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true, // Changed to true to avoid flickering on scroll
        easing: 'ease-out-cubic',
        offset: 100,
        mirror: false
      });
    }
  }, []);

  // Features array
  const features: Feature[] = [
    {
      title: "No-Code Deployment",
      description: "Launch your token without writing a line of code. Simply fill out a form and deploy directly from your browser.",
      icon: RocketLaunchIcon,
      glowColor: 'teal'
    },
    {
      title: "Configurable Supply",
      description: "Set your token's total supply and distribution parameters to match your specific needs.",
      icon: CubeIcon,
      glowColor: 'cyan'
    },
    {
      title: "Time-Locked Transfers",
      description: "Protect your token with configurable time-locks that prevent transfers until a specified date.",
      icon: LockClosedIcon,
      glowColor: 'magenta'
    },
    {
      title: "Mint Fee Options",
      description: "Configure optional mint fees to generate revenue each time new tokens are created.",
      icon: CurrencyDollarIcon,
      glowColor: 'green'
    },
    {
      title: "Owner Controls",
      description: "Owner-only functions for key management operations like minting and burning tokens.",
      icon: KeyIcon,
      glowColor: 'teal'
    },
    {
      title: "Security Audited",
      description: "Built on OpenZeppelin's battle-tested contracts for maximum security and stability.",
      icon: ShieldCheckIcon,
      glowColor: 'cyan'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-5 z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-heading text-white">Deploy Your Own Token</span> <span className="text-orange">In Minutes, Not Weeks</span>
          </h2>
          <div className="w-36 h-1.5 bg-gradient-to-r from-teal via-orange to-teal mx-auto rounded-full"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              glowColor={feature.glowColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 