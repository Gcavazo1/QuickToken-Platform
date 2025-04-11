import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import AnimatedGlow from '../components/AnimatedGlow';

export default function Pricing() {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // Set the promotion end date (beta period ends May 25, 2025)
  const promotionEndDate = new Date('2025-05-25T23:59:59');
  
  // Calculate time remaining for promotion
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = promotionEndDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining('Promotion ended');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeRemaining(`${days} days, ${hours} hours remaining`);
    };
    
    // Calculate initial time
    calculateTimeRemaining();
    
    // Update every hour
    const timer = setInterval(calculateTimeRemaining, 1000 * 60 * 60);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Pricing & Fee Structure | QuickToken Kit</title>
        <meta name="description" content="Transparent pricing and fee structure for the QuickToken Platform. Deploy your ERC-20 token with our revenue-sharing model." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="mb-20 text-center">
              <div className="relative inline-block mb-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white relative z-10">
                  Transparent <span className="text-orange">Pricing</span>
                </h1>
                <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-teal/20 blur-xl -z-0"></div>
              </div>
              <p className="text-gray-300 md:text-xl max-w-3xl mx-auto">
                Our simple, fair fee structure ensures everyone wins. Deploy your token with no upfront costs during our beta period.
              </p>
            </section>
            
            {/* Beta Promotion */}
            <section className="mb-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-teal/10 rounded-3xl"></div>
              <div className="relative bg-charcoal/50 border border-teal/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-6 md:mb-0 md:max-w-2xl">
                    <span className="inline-block bg-orange/20 text-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                      Limited Time Offer
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      Free Deployment During Beta
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Take advantage of our beta period to deploy your token with no upfront costs. Only pay when your token is minted, with 80% of mint fees going directly to you.
                    </p>
                    
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="flex-none">
                        <span className="block text-4xl font-bold text-teal">$0</span>
                        <span className="text-sm text-gray-400">Deployment Fee</span>
                      </div>
                      <div className="w-px h-12 bg-gray-700"></div>
                      <div className="flex-none">
                        <span className="block text-4xl font-bold text-teal">80%</span>
                        <span className="text-sm text-gray-400">Creator Revenue</span>
                      </div>
                      <div className="w-px h-12 bg-gray-700"></div>
                      <div className="flex-none">
                        <span className="block text-4xl font-bold text-teal">20%</span>
                        <span className="text-sm text-gray-400">Platform Fee</span>
                      </div>
                    </div>
                    
                    <Link 
                      href="/dapp"
                      className="btn-primary btn-glow inline-flex items-center"
                    >
                      Deploy Your Token
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-black/40 p-6 rounded-2xl border border-teal/30 flex flex-col items-center">
                    <span className="text-lg font-semibold text-gold">Beta Period Ends</span>
                    <div className="my-4 bg-gradient-to-r from-orange to-teal bg-clip-text text-transparent">
                      <span className="text-2xl md:text-4xl font-bold">May 25, 2025</span>
                    </div>
                    <div className="bg-black/30 rounded-xl px-4 py-2 text-yellow-400">
                      {timeRemaining}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* After Beta Plans */}
            <section className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                Future Pricing Plans
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                After our beta period concludes, choose between two flexible pricing models
                designed to fit different needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Standard Plan */}
                <div className="relative bg-charcoal/50 border border-gold/30 rounded-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-orange"></div>
                  <AnimatedGlow color="teal" opacity={0.1} />
                  
                  <div className="p-8 relative z-10">
                    <h3 className="text-gold text-xl font-bold mb-2">Standard Plan</h3>
                    <div className="flex items-end mb-6">
                      <span className="text-4xl font-bold text-white">$40-80</span>
                      <span className="text-gray-400 ml-2 mb-1">ETH</span>
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-300">Platform Revenue Share</span>
                        <span className="text-white font-bold">18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Creator Revenue Share</span>
                        <span className="text-white font-bold">82%</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Lower percentage on ongoing mint fees</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Better for high-volume tokens</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Higher share of revenue for creator</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Priority support</span>
                      </li>
                    </ul>
                    
                    <p className="text-xs text-gray-500 italic">
                      *Ideal for tokens expecting significant minting activity
                    </p>
                  </div>
                </div>
                
                {/* Zero Upfront Plan */}
                <div className="relative bg-charcoal/50 border border-teal/30 rounded-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal to-cyan-500"></div>
                  <AnimatedGlow color="teal" opacity={0.1} />
                  
                  <div className="p-8 relative z-10">
                    <h3 className="text-teal text-xl font-bold mb-2">Zero Upfront Plan</h3>
                    <div className="flex items-end mb-6">
                      <span className="text-4xl font-bold text-white">$0</span>
                      <span className="text-gray-400 ml-2 mb-1">ETH</span>
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-gray-800">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-300">Platform Revenue Share</span>
                        <span className="text-white font-bold">25-30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Creator Revenue Share</span>
                        <span className="text-white font-bold">70-75%</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">No upfront deployment fee</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Ideal for uncertain token adoption</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Risk-free deployment</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Standard support</span>
                      </li>
                    </ul>
                    
                    <p className="text-xs text-gray-500 italic">
                      *Perfect for projects testing the market or with uncertain demand
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-6">
                Final pricing will be determined at beta conclusion based on market conditions.
              </p>
            </section>
            
            {/* How Revenue Sharing Works */}
            <section className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                How Revenue Sharing <span className="text-orange">Works</span>
              </h2>
              
              <div className="bg-charcoal/50 border border-teal/20 rounded-xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-teal text-xl font-semibold mb-4">The Revenue Model</h3>
                    <p className="text-gray-300 mb-6">
                      When you deploy a token through our platform, you set a mint fee that users pay when minting new tokens. This mint fee is split between you (the token creator) and QuickToken Platform according to your plan's percentages.
                    </p>
                    
                    <h4 className="text-gold text-lg font-semibold mb-3">Example Calculation</h4>
                    <p className="text-gray-300 mb-4">
                      For a token with a 0.01 ETH mint fee during the beta period:
                    </p>
                    
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Mint 1 token</span>
                          <span className="text-white">0.01 ETH</span>
                        </div>
                        <div className="pl-4 border-l-2 border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Platform (20%)</span>
                            <span className="text-teal">0.002 ETH</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Creator (80%)</span>
                            <span className="text-gold">0.008 ETH</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Mint 10 tokens</span>
                          <span className="text-white">0.1 ETH</span>
                        </div>
                        <div className="pl-4 border-l-2 border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Platform (20%)</span>
                            <span className="text-teal">0.02 ETH</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Creator (80%)</span>
                            <span className="text-gold">0.08 ETH</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Mint 100 tokens</span>
                          <span className="text-white">1 ETH</span>
                        </div>
                        <div className="pl-4 border-l-2 border-gray-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Platform (20%)</span>
                            <span className="text-teal">0.2 ETH</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Creator (80%)</span>
                            <span className="text-gold">0.8 ETH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-teal text-xl font-semibold mb-4">Technical Implementation</h3>
                    <p className="text-gray-300 mb-6">
                      The fee distribution is handled automatically by the smart contract in real-time during each minting transaction.
                    </p>
                    
                    <div className="bg-black/40 text-sm font-mono p-4 rounded-lg overflow-x-auto mb-6">
                      <pre className="text-gray-300"><code>{`// Platform fee configuration
address public platformFeeAddress;
uint256 public platformFeePercentage; // out of 100

// Fee distribution logic in the mint function
function mint(address to, uint256 amount) public payable {
  // ...
  uint256 requiredFee = (mintFee * amount) / 1e18;
  
  // Calculate fee split
  uint256 platformAmount = 
    (requiredFee * platformFeePercentage) / 100;
  uint256 ownerAmount = requiredFee - platformAmount;
  
  // Transfer fees to platform and owner
  // ...
}`}</code></pre>
                    </div>
                    
                    <h4 className="text-gold text-lg font-semibold mb-3">Fee Transparency</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">All fees are clearly disclosed on the token deployment page</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Fee structure is documented and public</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-teal flex-shrink-0 mr-2" />
                        <span className="text-gray-300">Revenue splits are verifiable in the smart contract code</span>
                      </li>
                    </ul>
                    
                    <div className="bg-teal/10 border border-teal/30 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        <span className="text-teal font-semibold">Note:</span> QuickToken Platform reserves the right to adjust fee percentages for new token deployments (but never exceeding 30% platform share for existing deployments).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to <span className="text-orange">Deploy</span> Your Token?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Take advantage of our free beta period to launch your token with no upfront costs.
              </p>
              <Link 
                href="/dapp" 
                className="btn-primary btn-glow text-lg px-8 py-3 inline-flex items-center"
              >
                Launch Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 