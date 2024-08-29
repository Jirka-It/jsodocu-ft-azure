"use client"

import { redirect, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

// This is for testing only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

    const [isMounted, setIsMounted] = useState(false);

    const path = usePathname();

    useEffect(() => {

        const token = !window.localStorage.getItem('test');

        if (token) {
            let redirectTo = `?redirectTo=${encodeURIComponent(path)}`;
            if(path === "/") redirectTo = "";
            redirect(`/auth/login${redirectTo}`);
        }

        setIsMounted(true);

    }, []);

    if(!isMounted) return null;

    return children;
};