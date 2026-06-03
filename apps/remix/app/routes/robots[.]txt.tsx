import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

const ALLOWED_CRAWLERS = [
  '*',
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  'Slurp',
  'YandexBot',
  'Baiduspider',
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'YouBot',
  'FacebookBot',
  'LinkedInBot',
  'Twitterbot',
];

export function loader() {
  const baseUrl = NEXT_PUBLIC_WEBAPP_URL().replace(/\/$/, '');
  const body = [
    ...ALLOWED_CRAWLERS.flatMap((crawler) => [`User-agent: ${crawler}`, 'Allow: /']),
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
