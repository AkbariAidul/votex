// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const { data: { session } } = await supabase.auth.getSession();

    // Jika user belum login dan mencoba akses halaman yang dilindungi (selain login)
    if (!session && req.nextUrl.pathname !== '/login') {
        // Arahkan ke halaman login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
}

// Konfigurasi path mana saja yang akan dijaga oleh middleware ini
export const config = {
    matcher: [
        /*
        * Cocokkan semua path, kecuali:
        * - path yang dimulai dengan `_next/static` (file statis)
        * - path yang dimulai dengan `_next/image` (optimisasi gambar)
        * - path `favicon.ico` (file ikon)
        */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};