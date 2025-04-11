import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal to-dark-charcoal text-white">
      <Head>
        <title>Privacy Policy | QuickToken Kit</title>
        <meta name="description" content="Privacy Policy for QuickToken Kit - How we handle your data" />
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <div className="bg-charcoal rounded-lg p-6 mb-8 border border-dark-teal">
              <h2 className="text-2xl font-semibold mb-4 text-teal">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                At QuickToken Kit, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
              </p>
              <p className="text-gray-300">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We may collect several types of information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li><strong>Wallet Information:</strong> Your Ethereum address when you connect your wallet to our DApp</li>
              <li><strong>Transaction Information:</strong> Details of tokens deployed through our platform</li>
              <li><strong>Usage Information:</strong> How you interact with our website and services</li>
              <li><strong>Technical Information:</strong> IP address, browser type, and device information</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your token deployments and transactions</li>
              <li>Communicate with you about our services</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent fraudulent or unauthorized activities</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">4. Blockchain Data</h2>
            <p className="text-gray-300 mb-6">
              Please note that any information you submit to the blockchain through our services will be publicly available. Blockchain transactions are immutable and cannot be deleted. We are not responsible for the privacy of data that you choose to submit to the blockchain.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 mb-6">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our services may not function properly without cookies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">6. Data Sharing and Disclosure</h2>
            <p className="text-gray-300 mb-4">
              We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>With service providers who perform services on our behalf</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">7. Data Security</h2>
            <p className="text-gray-300 mb-6">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">8. Your Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate information</li>
              <li>The right to erasure (with limitations due to blockchain immutability)</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">9. Children's Privacy</h2>
            <p className="text-gray-300 mb-6">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">10. Changes to this Privacy Policy</h2>
            <p className="text-gray-300 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-teal">11. Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about this Privacy Policy, please contact us at gcavazo1@gmail.com.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 