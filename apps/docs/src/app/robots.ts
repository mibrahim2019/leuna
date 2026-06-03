import type { MetadataRoute } from 'next';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOWED_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: '/',
    })),
    host: 'https://docs.leuna.app',
  };
}
