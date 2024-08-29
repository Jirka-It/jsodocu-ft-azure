import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/auth/login', '/auth/register']
 
// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)

    /*if (!isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
    }*/
}

// Stop Middleware running on static files
export const config = { matcher: '/((?!.*\\.).*)' }