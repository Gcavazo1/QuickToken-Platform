import { GetServerSideProps } from 'next';

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quick-token-platform.vercel.app';
  
  // List all pages that should be indexed
  const pages = [
    '',
    '/dapp',
    '/pricing',
    '/roadmap',
    '/docs',
    '/connect'
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${page === '' ? 'weekly' : 'monthly'}</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 