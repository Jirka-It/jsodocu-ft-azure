import React from 'react';
import { Metadata } from 'next';
import { seoConfig } from '../../config/seo';

interface FullPageLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: seoConfig.fullTitle,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: seoConfig.author }],
    robots: { index: true, follow: true },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: seoConfig.type,
        title: seoConfig.fullTitle,
        url: seoConfig.url,
        description: seoConfig.description,
        siteName: seoConfig.siteName,
        locale: seoConfig.locale,
        images: [
            {
                url: seoConfig.image,
                width: parseInt(seoConfig.imageWidth),
                height: parseInt(seoConfig.imageHeight),
                alt: seoConfig.siteName
            }
        ]
    },
    twitter: {
        card: seoConfig.twitter.card,
        site: seoConfig.twitter.site,
        creator: seoConfig.twitter.creator,
        title: seoConfig.fullTitle,
        description: seoConfig.description,
        images: [seoConfig.image]
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico'
    },
    alternates: {
        canonical: seoConfig.url
    },
    other: {
        'X-UA-Compatible': 'IE=edge',
        'apple-mobile-web-app-capable': 'yes',
        'image': seoConfig.image,
        'image:width': seoConfig.imageWidth,
        'image:height': seoConfig.imageHeight,
        'developer': seoConfig.developer.name,
        'developer:url': seoConfig.developer.url,
        'og:developer': seoConfig.developer.name
    }
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}
