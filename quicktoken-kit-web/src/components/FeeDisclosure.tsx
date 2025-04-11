import React, { useState, useEffect } from 'react';
import feeConfig from '../utils/feeConfig';
import { shortenAddress } from '../utils/web3';
import { InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface FeeDisclosureProps {
  mintFee: string;
  showDetails?: boolean;
}

export default function FeeDisclosure({ mintFee, showDetails = false }: FeeDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showFuturePlans, setShowFuturePlans] = useState(false);
  
  // Get fee splits from centralized config
  const platformPercentage = feeConfig.platformFeePercentage;
  const ownerPercentage = feeConfig.creatorFeePercentage;
  
  // Set the promotion end date (45 days from a fixed date, e.g., April 10, 2025)
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
  
  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleFuturePlans = () => {
    setShowFuturePlans(!showFuturePlans);
  };
  
  return (
    <div className="bg-deep-blue/50 rounded-lg border border-teal-500/20 overflow-hidden">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" />
          <h3 className="text-light-cyan text-sm font-medium">Fee Structure</h3>
        </div>
        <button
          onClick={toggleDetails}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-sans"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="border-t border-teal-500/20 px-4 py-3">
          <table className="w-full">
            <tbody className="divide-y divide-gray-800/30">
              <tr className="flex justify-between py-2">
                <td className="text-gray-300 text-sm">Token Deployment Fee</td>
                <td className="text-yellow-400 font-sans relative group">
                  <span>Free during beta</span>
                  <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-teal-500/30 rounded-lg px-3 py-2 w-64 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <p className="text-xs text-white mb-1">🎉 Limited Time Promotion</p>
                    <p className="text-xs text-gray-300">Deploy tokens for free during our beta period!</p>
                    <p className="text-xs text-teal-400 mt-1">{timeRemaining}</p>
                  </div>
                </td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-gray-300 text-sm">Token Mint Fee (per token)</td>
                <td className="text-white font-sans">{mintFee} ETH</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-gray-300 text-sm">Platform Revenue Share</td>
                <td className="text-white font-sans">{platformPercentage}%</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-gray-300 text-sm">Token Owner Revenue Share</td>
                <td className="text-white font-sans">{ownerPercentage}%</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-gray-300 text-sm relative group">
                  <span className="flex items-center">
                    Network Gas Fees
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 ml-1" />
                  </span>
                  <div className="absolute top-full mt-2 left-0 bg-gray-900 border border-teal-500/30 rounded-lg px-3 py-2 w-64 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <p className="text-xs text-white mb-1">About Gas Fees</p>
                    <p className="text-xs text-gray-300">Gas fees are network transaction costs determined by blockchain congestion and complexity, not by our dApp. These fees go directly to network validators and vary based on network conditions.</p>
                  </div>
                </td>
                <td className="text-white font-sans">Varies by network</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-4 border-t border-gray-800/30 pt-4">
            <h4 className="text-cyan-400 text-sm mb-2 font-sans">How fees work</h4>
            <p className="text-gray-300 text-sm font-sans leading-relaxed">
              When you deploy a token through our platform, you set a mint fee that users pay when minting new tokens. This mint 
              fee is split between you (the token creator) and QuickToken Platform according to the above percentages. For 
              example, if you set a mint fee of <span className="font-sans">{mintFee}</span> ETH and someone mints <span className="font-sans">100</span> tokens, they will pay <span className="font-sans">{parseFloat(mintFee) * 100}</span> ETH. <span className="font-sans">{platformPercentage}%</span> goes to the 
              platform, and <span className="font-sans">{ownerPercentage}%</span> goes to you as the token owner.
            </p>
          </div>
          
          <div className="mt-4 border-t border-gray-800/30 pt-4">
            <h4 className="text-cyan-400 text-sm mb-2 font-sans">Platform Fee Address</h4>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center">
                <span className="text-gray-300 text-sm">Address:</span>
                <span className="ml-2 text-white font-mono text-sm">{shortenAddress(feeConfig.platformWalletAddress)}</span>
              </div>
              <p className="text-gray-400 text-xs">
                This address receives {platformPercentage}% of all mint fees from tokens deployed through this platform.
                When users mint tokens from your contract, this address will automatically receive the platform's portion.
              </p>
            </div>
          </div>
          
          <div className="mt-4 border-t border-gray-800/30 pt-4 bg-teal-900/10 p-3 rounded">
            <div className="flex items-center">
              <span className="text-teal-400 text-sm font-semibold">Limited Time Offer</span>
              <span className="ml-auto text-yellow-400 text-xs">{timeRemaining}</span>
            </div>
            <p className="text-gray-300 text-xs mt-1">
              We're waiving the token deployment fee during our beta period! After the promotion ends, a standard deployment fee will apply.
            </p>
            <button 
              onClick={toggleFuturePlans}
              className="mt-2 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors flex items-center"
            >
              {showFuturePlans ? 'Hide future pricing' : 'View future pricing options'}
              <svg className={`ml-1 h-4 w-4 transition-transform ${showFuturePlans ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFuturePlans && (
              <div className="mt-3 border-t border-teal-500/20 pt-3">
                <h4 className="text-white text-sm mb-3">After Beta: Choose Your Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Standard Plan */}
                  <div className="bg-deep-blue/50 border border-gold/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-gold text-sm font-medium">Standard Plan</h5>
                      <span className="text-white text-sm font-bold">$40-80 ETH</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <span className="text-gray-300">Platform Mint Fee:</span>
                      <span className="text-white">18%</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Lower percentage on ongoing mint fees</span>
                      </li>
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Better for high-volume tokens</span>
                      </li>
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Higher share of revenue for creator</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Free Plan */}
                  <div className="bg-deep-blue/50 border border-teal-500/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-teal-400 text-sm font-medium">Zero Upfront Plan</h5>
                      <span className="text-white text-sm font-bold">$0 ETH</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <span className="text-gray-300">Platform Mint Fee:</span>
                      <span className="text-white">25-30%</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>No upfront deployment fee</span>
                      </li>
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Ideal for uncertain token adoption</span>
                      </li>
                      <li className="text-xs text-gray-300 flex items-start">
                        <CheckCircleIcon className="h-3 w-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Risk-free deployment</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">
                  *Final pricing will be determined at beta conclusion based on market conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 