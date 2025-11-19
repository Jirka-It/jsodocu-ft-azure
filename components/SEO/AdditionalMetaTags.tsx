'use client';

import React from 'react';
import { seoConfig } from '../../config/seo';

/**
 * Componente para agregar meta tags adicionales que no están directamente soportados
 * en la Metadata API de Next.js 13, pero que son importantes para SEO
 */
export default function AdditionalMetaTags() {
    return (
        <>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="image" content={seoConfig.image} />
            <meta property="image:width" content={seoConfig.imageWidth} />
            <meta property="image:height" content={seoConfig.imageHeight} />
            <link rel="canonical" href={seoConfig.url} />
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="developer" href={seoConfig.developer.url} />
            <meta name="developer" content={seoConfig.developer.name} />
            <meta property="og:developer" content={seoConfig.developer.name} />
            <meta name="developer:url" content={seoConfig.developer.url} />
        </>
    );
}

