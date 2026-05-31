import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

const buildSitemap = (baseUrl: string) => {
  const today = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
};

export function loader() {
  const baseUrl = NEXT_PUBLIC_WEBAPP_URL().replace(/\/$/, '');
  const xml = buildSitemap(baseUrl);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
