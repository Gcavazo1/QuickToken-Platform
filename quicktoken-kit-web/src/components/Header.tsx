import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AnimatedGlow from './AnimatedGlow';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState('top'); // 'top', 'up' or 'down'
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll direction detection
  useEffect(() => {
    const threshold = 10;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Determine scroll direction
          if (currentScrollY < threshold) {
            setScrollDir('top');
          } else if (currentScrollY > prevScrollY) {
            setScrollDir('down');
          } else if (currentScrollY < prevScrollY) {
            setScrollDir('up');
          }
          
          // Determine if page is scrolled at all (for background opacity)
          setIsScrolled(currentScrollY > 50);
          
          setPrevScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine header visibility class based on scroll direction
  const getHeaderVisibilityClass = () => {
    if (scrollDir === 'down') return 'transform -translate-y-full';
    if (scrollDir === 'up') return 'transform translate-y-0 shadow-lg';
    return 'transform translate-y-0';
  };

  // Determine header background opacity based on scroll position
  const getHeaderBgClass = () => {
    return isScrolled 
      ? 'bg-charcoal bg-opacity-95 backdrop-blur-md'
      : 'bg-charcoal bg-opacity-70 backdrop-blur-sm';
  };

  return (
    <header 
      className={`fixed top-0 w-full py-4 border-b border-dark-teal/30 z-50 transition-all duration-300 ease-in-out ${getHeaderVisibilityClass()} ${getHeaderBgClass()}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105 relative">
          {/* Orange glow effect - static, not hover dependent */}
          <div 
            className="absolute inset-0 -m-1 rounded-full" 
            style={{
              boxShadow: '0 0 10px rgba(242, 100, 48, 0.3), 0 0 20px rgba(242, 100, 48, 0.15)',
              filter: 'blur(6px)'
            }}
          ></div>
          
          <div className="flex items-center relative z-10">
            <Image 
              src="/quicktoken_logo.png" 
              alt="QuickToken Logo" 
              width={40} 
              height={40} 
              className="mr-2"
            />
            <div className="text-2xl font-bold text-white bg-teal/20 px-3 py-1 rounded-lg">
              <span className="text-teal">Quick</span>
              <span className="text-orange">Token</span>
              <span className="text-white ml-2">💥</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`text-sm relative transition-colors duration-300 ${
              router.pathname === '/' 
                ? 'text-orange after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange/70 after:rounded-full' 
                : 'text-teal hover:text-gold'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/#features" 
            className="text-sm text-teal hover:text-gold transition-colors duration-300 relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-gold/70 hover:after:rounded-full"
          >
            Features
          </Link>
          <Link 
            href="/#use-cases" 
            className="text-sm text-teal hover:text-gold transition-colors duration-300 relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-gold/70 hover:after:rounded-full"
          >
            Use Cases
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm relative transition-colors duration-300 ${
              router.pathname === '/pricing' 
                ? 'text-orange after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange/70 after:rounded-full' 
                : 'text-teal hover:text-gold'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/roadmap" 
            className={`text-sm relative transition-colors duration-300 ${
              router.pathname === '/roadmap' 
                ? 'text-orange after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange/70 after:rounded-full' 
                : 'text-teal hover:text-gold'
            }`}
          >
            Roadmap
          </Link>
          <Link 
            href="https://github.com/Gcavazo1/QuickToken-Platform.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-teal hover:text-gold transition-colors duration-300 relative hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-gold/70 hover:after:rounded-full"
          >
            GitHub
          </Link>
          <Link 
            href="/dapp" 
            className="ml-4 btn-primary btn-glow text-sm transition-transform duration-300 hover:scale-105"
          >
            Launch App
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-teal" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-charcoal border-t border-dark-teal/30 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`text-sm ${router.pathname === '/' ? 'text-orange' : 'text-teal'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#features" 
              className="text-sm text-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#use-cases" 
              className="text-sm text-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link 
              href="/pricing" 
              className={`text-sm ${router.pathname === '/pricing' ? 'text-orange' : 'text-teal'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/roadmap" 
              className={`text-sm ${router.pathname === '/roadmap' ? 'text-orange' : 'text-teal'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Roadmap
            </Link>
            <Link 
              href="https://github.com/Gcavazo1/QuickToken-Platform.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-teal"
            >
              GitHub
            </Link>
            <Link 
              href="/dapp" 
              className="text-sm btn-primary btn-glow text-center py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
