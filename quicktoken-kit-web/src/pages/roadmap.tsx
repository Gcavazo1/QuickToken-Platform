import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

export default function Roadmap() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const roadmapItems = [
    {
      title: "Beta Launch",
      description: "Initial platform release with token deployment functionality and admin dashboard",
      timeframe: "April 10, 2025",
      status: "completed",
    },
    {
      title: "Token Minting Interface",
      description: "Mint tokens directly through the platform with fee distribution and transaction tracking",
      timeframe: "May 1, 2025",
      status: "in-progress",
    },
    {
      title: "Multi-Wallet Integration",
      description: "Support for Phantom, Coinbase and additional wallet providers for broader accessibility",
      timeframe: "May 10, 2025",
      status: "planned",
    },
    {
      title: "Presale Contract Deployment",
      description: "Launch token presales with customizable parameters, whitelisting, and vesting schedules",
      timeframe: "May 20, 2025",
      status: "planned",
    },
    {
      title: "Full Production Release",
      description: "Complete platform launch with all core features, optimizations, and enhanced UI/UX",
      timeframe: "May 25, 2025",
      status: "planned",
    },
    {
      title: "Staking Contracts",
      description: "Simple staking mechanisms for ERC-20 tokens and ETH with reward distribution",
      timeframe: "Q2 2025",
      status: "planned",
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics for token performance, market metrics, and user engagement",
      timeframe: "Q3 2025",
      status: "planned",
    }
  ];

  if (!mounted) {
    // Return a placeholder to avoid hydration mismatch
    return <div className="min-h-screen bg-primary"></div>;
  }

  return (
    <>
      <Head>
        <title>QuickToken | Platform Roadmap</title>
        <meta name="description" content="QuickToken platform roadmap and development timeline - from beta to full production launch" />
        <meta property="og:title" content="QuickToken Platform Roadmap" />
        <meta property="og:description" content="View our development timeline and upcoming features for the QuickToken platform." />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="QuickToken Platform Roadmap" />
        <meta property="twitter:description" content="Track our progress from beta to full production with our interactive roadmap." />
      </Head>

      <Header />

      <main className="pt-24 pb-16 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 
              className="text-4xl font-heading tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
              style={{
                color: theme === 'dark' ? 'transparent' : '',
                backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #5eead4, #60a5fa, #f472b6)' : '',
                WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                backgroundClip: theme === 'dark' ? 'text' : '',
              }}
            >
              Platform Roadmap
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Tracking our journey from beta to full production
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -ml-0.5 hidden md:block"></div>

            <div className="space-y-16">
              {roadmapItems.map((item, index) => (
                <div key={index} className={`relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:flex`}>
                  {/* Circle indicator */}
                  <div className="hidden md:block absolute left-1/2 -ml-3 mt-6 bg-primary z-10">
                    {item.status === 'completed' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
                    ) : item.status === 'in-progress' ? (
                      <div className="relative">
                        <ClockIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping"></span>
                      </div>
                    ) : (
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-gray-400 dark:border-gray-500"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} py-4`}>
                    <div className="admin-dashboard-card shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex items-center mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 
                          item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                        </span>
                        
                        {/* Mobile-only indicator */}
                        <div className="md:hidden ml-2">
                          {item.status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                          ) : item.status === 'in-progress' ? (
                            <ClockIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                          ) : null}
                        </div>
                      </div>
                      
                      <h3 
                        className="text-xl font-bold text-gray-900"
                        style={{
                          color: theme === 'dark' ? 'transparent' : '',
                          backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #5eead4, #60a5fa, #f472b6)' : '',
                          WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                          backgroundClip: theme === 'dark' ? 'text' : '',
                        }}
                      >
                        {item.title}
                      </h3>
                      
                      <time className="block mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.timeframe}
                      </time>
                      
                      <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 card card-glow p-8">
            <div className="text-center">
              <h2 
                className="text-2xl font-heading font-bold text-gray-900"
                style={{
                  color: theme === 'dark' ? 'transparent' : '',
                  backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #5eead4, #60a5fa)' : '',
                  WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                  backgroundClip: theme === 'dark' ? 'text' : '',
                }}
              >
                Have Feature Suggestions?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We're constantly improving QuickToken based on community feedback.
              </p>
              <a 
                href="mailto:feedback@quicktoken.io" 
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gradient-to-r dark:from-blue-600 dark:to-teal-400 dark:hover:from-blue-700 dark:hover:to-teal-500 btn-glow"
              >
                Share Your Ideas
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="admin-dashboard-card p-6">
              <h3 
                className="text-lg font-semibold text-gray-900 mb-3"
                style={{
                  color: theme === 'dark' ? 'transparent' : '',
                  backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #60a5fa, #5eead4)' : '',
                  WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                  backgroundClip: theme === 'dark' ? 'text' : '',
                }}
              >Beta Phase Benefits</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Early access to platform features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Reduced platform fees during beta</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Direct feedback channel to developers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Beta tester recognition on launch</span>
                </li>
              </ul>
            </div>

            <div className="admin-dashboard-card p-6">
              <h3 
                className="text-lg font-semibold text-gray-900 mb-3"
                style={{
                  color: theme === 'dark' ? 'transparent' : '',
                  backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #60a5fa, #5eead4)' : '',
                  WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                  backgroundClip: theme === 'dark' ? 'text' : '',
                }}
              >Technology Stack</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Solidity smart contracts (^0.8.20)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Next.js frontend with TypeScript</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ethers.js v6 for blockchain integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Supabase for secure data storage</span>
                </li>
              </ul>
            </div>

            <div className="admin-dashboard-card p-6">
              <h3 
                className="text-lg font-semibold text-gray-900 mb-3"
                style={{
                  color: theme === 'dark' ? 'transparent' : '',
                  backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #60a5fa, #5eead4)' : '',
                  WebkitBackgroundClip: theme === 'dark' ? 'text' : '',
                  backgroundClip: theme === 'dark' ? 'text' : '',
                }}
              >Get Involved</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Join our Discord community</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Follow us on Twitter for updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Subscribe to our newsletter</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Report bugs and request features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 