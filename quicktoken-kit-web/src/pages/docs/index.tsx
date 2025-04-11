import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal to-dark-charcoal text-white">
      <Head>
        <title>Documentation | QuickToken Kit</title>
        <meta name="description" content="QuickToken Kit Documentation - Learn how to deploy and customize your ERC-20 tokens" />
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            <span className="text-teal">Quick</span>
            <span className="text-orange">Token</span> Documentation
          </h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 text-lg mb-8">
              Welcome to the QuickToken Kit documentation. Here you'll find everything you need to know about deploying and managing your ERC-20 tokens.
            </p>
            
            <div className="bg-charcoal rounded-lg p-6 mb-8 border border-dark-teal">
              <h2 className="text-2xl font-semibold mb-4 text-teal">Getting Started</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Connect your wallet through our DApp</li>
                <li>Configure your token parameters (name, symbol, supply, etc.)</li>
                <li>Deploy your token to your chosen network</li>
                <li>Verify your token on blockchain explorers</li>
                <li>Start using your token for your project</li>
              </ol>
            </div>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4 text-teal">Smart Contract Features</h2>
            <p className="text-gray-300 mb-4">
              Our QuickToken contract is built on the latest OpenZeppelin ERC-20 implementation and includes additional features:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8">
              <li>Customizable minting functionality</li>
              <li>Time-lock mechanism for token releases</li>
              <li>Burning capabilities</li>
              <li>Owner-only privileged functions</li>
              <li>Optional mint fees for monetization</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4 text-teal">Network Support</h2>
            <p className="text-gray-300 mb-4">
              QuickToken Kit supports the following EVM-compatible networks:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-gold mb-2">Ethereum Mainnet</h3>
                <p className="text-sm text-gray-400">Production deployments for live tokens</p>
              </div>
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-purple-400 mb-2">Polygon</h3>
                <p className="text-sm text-gray-400">Low-fee alternative for high-volume applications</p>
              </div>
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-red-400 mb-2">Optimism</h3>
                <p className="text-sm text-gray-400">Layer 2 solution with Ethereum security</p>
              </div>
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-blue-500 mb-2">Base</h3>
                <p className="text-sm text-gray-400">Coinbase-backed L2 with low fees</p>
              </div>
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-blue-400 mb-2">Sepolia Testnet</h3>
                <p className="text-sm text-gray-400">Testing environment for Ethereum</p>
              </div>
              <div className="bg-dark-charcoal p-4 rounded-lg border border-dark-teal">
                <h3 className="font-semibold text-green-400 mb-2">Mumbai Testnet</h3>
                <p className="text-sm text-gray-400">Testing environment for Polygon</p>
              </div>
            </div>
            
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-teal">Need More Help?</h2>
              <div className="bg-teal bg-opacity-10 rounded-lg p-6 border border-teal">
                <p className="text-gray-300 mb-4">
                  For more detailed documentation and tutorials, please check our GitHub repository or join our community channels.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="https://github.com/Gcavazo1/QuickToken-Platform.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    GitHub Repository
                  </Link>
                  <Link 
                    href="/dapp"
                    className="inline-flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Try The DApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 