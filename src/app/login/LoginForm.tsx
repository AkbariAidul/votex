"use client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Listener ini sekarang HANYA bereaksi jika ada event 'SIGNED_IN' (login baru yang sukses)
            if (event === 'SIGNED_IN' && session) {
                // Daripada redirect, kita refresh halaman.
                // Ini akan memicu ulang 'LoginPageServer' (penjaga kita),
                // yang kemudian akan melakukan redirect yang benar di server.
                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Login Votex</h1>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                    providers={[]}
                    redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
                />
            </div>
        </div>
    );
}