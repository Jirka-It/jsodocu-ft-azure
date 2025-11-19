import { MetadataRoute } from 'next';
import { seoConfig } from '../config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = seoConfig.url;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: `${baseUrl}/landing`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9
        }
    ];
}

