import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

export function loader() {
  const baseUrl = NEXT_PUBLIC_WEBAPP_URL().replace(/\/$/, '');
  const body = [`User-agent: *`, `Allow: /`, `Sitemap: ${baseUrl}/sitemap.xml`].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
