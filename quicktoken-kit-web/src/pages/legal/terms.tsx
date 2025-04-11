import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal to-dark-charcoal text-white">
      <Head>
        <title>Terms of Service | QuickToken Kit</title>
        <meta name="description" content="Terms of Service for QuickToken Kit - Please read before using our service" />
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <div className="bg-charcoal rounded-lg p-6 mb-8 border border-dark-teal">
              <h2 className="text-2xl font-semibold mb-4 text-teal">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                Welcome to QuickToken Kit ("we," "our," or "us"). By accessing or using our website, DApp, or any of our services, you agree to be bound by these Terms of Service ("Terms").
              </p>
              <p className="text-gray-300">
                Please read these Terms carefully before using our service. If you do not agree with any part of these Terms, you may not use our services.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">2. Services Description</h2>
            <p className="text-gray-300 mb-4">
              QuickToken Kit provides tools for the deployment of ERC-20 tokens on Ethereum and compatible blockchains. Our services include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>Smart contract templates for ERC-20 token deployment</li>
              <li>Web interface for configuring and deploying tokens</li>
              <li>Documentation and supporting resources</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">3. User Responsibilities</h2>
            <p className="text-gray-300 mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>Comply with all applicable laws and regulations</li>
              <li>Be responsible for all activity that occurs under your account or wallet</li>
              <li>Not use our services for any illegal or unauthorized purpose</li>
              <li>Not attempt to circumvent any security features of our platform</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">4. Blockchain Risks</h2>
            <p className="text-gray-300 mb-4">
              By using our services, you acknowledge and accept the following risks:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>Blockchain transactions are irreversible and cannot be undone once confirmed</li>
              <li>Cryptocurrencies and tokens may experience extreme volatility</li>
              <li>Smart contracts may contain bugs or vulnerabilities despite our best efforts</li>
              <li>Regulatory changes may affect the legality or functionality of tokens deployed</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">5. Intellectual Property</h2>
            <p className="text-gray-300 mb-6">
              The code, content, and materials on our platform are owned by or licensed to QuickToken Kit and are protected by copyright, trademark, and other intellectual property laws. You may use our services as permitted by these Terms, but you may not copy, modify, distribute, or create derivative works based on our content without our explicit permission.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">6. Disclaimer of Warranties</h2>
            <p className="text-gray-300 mb-6">
              Our services are provided on an "as is" and "as available" basis. QuickToken Kit makes no warranties, express or implied, regarding the reliability, accuracy, or availability of our services. We do not guarantee that our services will be uninterrupted, secure, or error-free.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-6">
              To the maximum extent permitted by law, QuickToken Kit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, or use, arising out of or related to your use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">8. Governing Law</h2>
            <p className="text-gray-300 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">9. Changes to Terms</h2>
            <p className="text-gray-300 mb-6">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of these Terms. Your continued use of our services after such modifications constitutes your acceptance of the revised Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">10. Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms, please contact us at support@quicktoken-kit.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 