import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sodocu.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/configuration/',
                    '/dashboard-banking/',
                    '/documents/',
                    '/documents-types/',
                    '/templates/',
                    '/categories/',
                    '/auth/'
                ]
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`
    };
}

