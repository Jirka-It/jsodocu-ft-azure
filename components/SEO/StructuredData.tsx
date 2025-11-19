'use client';

import React from 'react';
import { structuredData } from '../../config/seo';

interface StructuredDataProps {
    data?: object;
}

export default function StructuredData({ data }: StructuredDataProps) {
    const jsonLd = data || structuredData;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

