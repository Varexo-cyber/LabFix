import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/geheim-admin',
          '/geheim-admin/*',
          '/api/*',
          '/account/*',
          '/cart',
          '/checkout/*',
        ],
      },
    ],
    sitemap: 'https://labfix.nl/sitemap.xml',
    host: 'https://labfix.nl',
  };
}
