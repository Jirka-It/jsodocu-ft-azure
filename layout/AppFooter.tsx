'use client';

import React from 'react';

import { useContext } from 'react';

import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer text-center">
            <p>
                2024 - Desarrollado por{' '}
                <Link href="https://www.jirka.co/" target="_blank" className="text-primary hover:underline cursor-pointer font-medium">
                    Jirka
                </Link>
            </p>
        </div>
    );
};

export default AppFooter;
