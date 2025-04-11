import { useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Features from '../components/Features';
import UseCaseCard from '../components/UseCaseCard';
import SEO from '../components/SEO';

export default function Home() {
  // Homepage structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app'}/#website`,
    name: 'QuickToken',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app',
    description: 'Create, deploy and manage custom ERC-20 tokens in minutes without writing code.',
    potentialAction: {
      '@type': 'SearchAction',
      'target': `${process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Product structured data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuickToken Kit',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '24'
    },
    description: 'Deploy your own custom ERC-20 token without writing code. Perfect for creators, DAOs, and developers.'
  };

  // Combine all schemas
  const jsonLdData = [websiteSchema, productSchema];

  return (
    <>
      <SEO 
        title="QuickToken Kit - Deploy Your ERC-20 Token in Minutes" 
        description="Create, deploy and manage custom ERC-20 tokens in minutes without writing code. Perfect for creators, DAOs and developers."
        ogType="website"
        jsonLd={jsonLdData}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Hero />
          
          {/* Features Section */}
          <Features />
          
          {/* Use Cases Section */}
          <section className="py-20" id="use-cases">
            <div className="container">
              <h2 className="text-center mb-16">
                Endless <span className="text-orange">Possibilities</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <UseCaseCard 
                  title="Community & Social Tokens"
                  description="Reward your community members, followers, or fans with tokens that represent membership or special access."
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c.37-.06.74-.1 1.13-.1.99 0 1.93.21 2.78.58.56.32 1.04 1.04 1.04 1.85V18h-4.5v-1.61c0-.83-.23-1.61-.63-2.29z" />
                    </svg>
                  }
                />
                
                <UseCaseCard 
                  title="DAO Governance"
                  description="Create governance tokens that allow holders to vote on proposals and participate in decentralized decision-making."
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  }
                />
                
                <UseCaseCard 
                  title="Tokenized Products"
                  description="Turn your products, services, or content into tokens that can be bought, sold, or redeemed within your ecosystem."
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                    </svg>
                  }
                />
                
                <UseCaseCard 
                  title="Fundraising & ICOs"
                  description="Launch your own token sale or initial coin offering to fundraise for your project or startup."
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </section>
          
          {/* Testimonials Section (Optional) */}
          <section className="py-20 bg-charcoal bg-opacity-50 relative overflow-hidden">
            {/* Enhanced parallax background elements */}
            <div className="absolute inset-0 z-0">
              {/* Static visible elements instead of script-dependent ones */}
              <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-teal to-transparent opacity-20 blur-xl"></div>
              <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange to-transparent opacity-20 blur-xl"></div>
              <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-gold to-transparent opacity-20 blur-xl"></div>
            </div>
            
            <div className="container relative z-10">
              <h2 className="text-center mb-16 text-3xl md:text-4xl font-bold font-heading" data-aos="fade-up">
                What Creators Are <span className="text-orange">Saying</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 - Enhanced with stronger animation */}
                <div 
                  className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-dark-teal/50 shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl" 
                  data-aos="fade-up" 
                  data-aos-delay="0"
                  data-aos-duration="800"
                  data-aos-offset="200"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                      <span className="text-lg font-bold">DC</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium text-lg">Digital Creators DAO</h4>
                      <p className="text-sm text-teal/80">Community Token</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-teal opacity-30">"</span>
                    <p className="text-gray-300 relative z-10 pl-4">
                      QuickToken Kit let us launch our community token in a single afternoon without hiring a developer. Our members love it!
                    </p>
                    <span className="absolute -bottom-6 -right-2 text-4xl text-teal opacity-30">"</span>
                  </div>
                </div>
                
                {/* Testimonial 2 - Enhanced with stronger animation */}
                <div 
                  className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-dark-teal/50 shadow-lg transition-all duration-500 hover:translate-y-[-5px] hover:shadow-xl" 
                  data-aos="fade-up" 
                  data-aos-delay="200"
                  data-aos-duration="1000"
                  data-aos-offset="250"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white shadow-md">
                      <span className="text-lg font-bold">VR</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium text-lg">Virtual Reality Studio</h4>
                      <p className="text-sm text-orange/80">Access Token</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-orange opacity-30">"</span>
                    <p className="text-gray-300 relative z-10 pl-4">
                      We needed a way to tokenize access to our VR experiences. QuickToken Kit made it simple to deploy and manage our token economy.
                    </p>
                    <span className="absolute -bottom-6 -right-2 text-4xl text-orange opacity-30">"</span>
                  </div>
                </div>
                
                {/* Testimonial 3 - Enhanced with stronger animation */}
                <div 
                  className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-dark-teal/50 shadow-lg transition-all duration-700 hover:translate-y-[-5px] hover:shadow-xl" 
                  data-aos="fade-up" 
                  data-aos-delay="400"
                  data-aos-duration="1200"
                  data-aos-offset="300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
                      <span className="text-lg font-bold">MF</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-medium text-lg">MetaFund</h4>
                      <p className="text-sm text-gold/80">Investment DAO</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-gold opacity-30">"</span>
                    <p className="text-gray-300 relative z-10 pl-4">
                      The time-lock feature was crucial for our token distribution plan. Saved us thousands in development costs.
                    </p>
                    <span className="absolute -bottom-6 -right-2 text-4xl text-gold opacity-30">"</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <CTA 
            title="Ready to Launch Your Token?"
            description="Get started in minutes with our ready-to-deploy smart contract."
            primaryButtonText="Launch Now"
            primaryButtonLink="/dapp"
            secondaryButtonText="Learn More"
            secondaryButtonLink="#features"
          />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
