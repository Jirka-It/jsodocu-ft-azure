'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// This is for testing only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { data: session, status } = useSession();

    console.log('status', status);

    useEffect(() => {
        if (status === 'authenticated') {
            setIsMounted(true);
        }

        if (status === 'unauthenticated') {
            redirect('/auth/login');
        }
    }, [status]);

    if (!isMounted) return null;

    return children;
};
