const fs = require('fs');
const path = require('path');

const baseUrl = 'https://mflowpos.com';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
    // Core pages
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/register', priority: 0.9, changefreq: 'monthly' },
    { url: '/login', priority: 0.5, changefreq: 'monthly' },
    { url: '/pricing', priority: 0.9, changefreq: 'monthly' },
    { url: '/features', priority: 0.8, changefreq: 'monthly' },

    // Industry-specific pages (HIGH SEO VALUE)
    { url: '/pos-for-boutiques-kenya', priority: 0.8, changefreq: 'monthly' },
    { url: '/pos-for-electronics-shops', priority: 0.8, changefreq: 'monthly' },
    { url: '/pos-for-spare-parts-shops', priority: 0.8, changefreq: 'monthly' },
    { url: '/pos-for-cosmetics-shops', priority: 0.8, changefreq: 'monthly' },
    { url: '/pos-for-baby-shops', priority: 0.8, changefreq: 'monthly' },
    { url: '/pos-for-laundry-marts', priority: 0.8, changefreq: 'monthly' },
    { url: '/mobile-pos-kenya', priority: 0.8, changefreq: 'monthly' },

    // Location pages
    { url: '/pos-system-nairobi', priority: 0.7, changefreq: 'monthly' },
    { url: '/pos-system-mombasa', priority: 0.7, changefreq: 'monthly' },
    { url: '/pos-system-kisumu', priority: 0.7, changefreq: 'monthly' },

    // Support pages
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/blog', priority: 0.6, changefreq: 'weekly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write to public folder
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log('✅ Sitemap generated successfully at public/sitemap.xml');
console.log(`📄 Total URLs: ${pages.length}`);
console.log(`📅 Last modified: ${currentDate}`);
