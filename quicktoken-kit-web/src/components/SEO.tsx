import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'QuickToken - Deploy ERC-20 Tokens Without Code',
  description = 'Create, deploy and manage custom ERC-20 tokens in minutes without writing code. Perfect for creators, DAOs and developers.',
  canonical = process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app',
  ogImage = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app'}/quick-token-cover.jpg`,
  ogType = 'website',
  twitterHandle = '@quicktoken',
  jsonLd,
  noIndex = false,
}) => {
  const fullTitle = title.includes('QuickToken') ? title : `${title} | QuickToken`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="QuickToken" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
    </Head>
  );
};

export default SEO; 