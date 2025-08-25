"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";

// Ini adalah versi sederhana dari PublicNavbar, khusus untuk pengguna yang login
export default function AppNavbar() {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUserAndProfile = async (session: Session | null) => {
            setSession(session);
            if (session) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setProfile(data);
            } else {
                setProfile(null);
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => fetchUserAndProfile(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => fetchUserAndProfile(session));

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image src="/votex-logo.jpg" alt="Votex Logo" width={120} height={40} priority className="h-auto" />
                        </Link>
                    </div>

                    {/* Menu Pengguna */}
                    <div>
                         {session && (
                            <div>
                                <button id="user-menu-button" data-dropdown-toggle="user-dropdown" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600" type="button">
                                    <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                        {session.user.email?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                <div id="user-dropdown" className="z-50 hidden my-4 text-base list-none bg-gray-700 divide-y divide-gray-600 rounded-lg shadow">
                                    <div className="px-4 py-3">
                                        <span className="block text-sm text-white">{session.user.email}</span>
                                        <span className="block text-sm text-gray-400 truncate">{profile?.role}</span>
                                    </div>
                                    <ul className="py-2" aria-labelledby="user-menu-button">
                                        <li><Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Dashboard</Link></li>
                                        <li><Link href="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Profil Saya</Link></li>
                                        <li><form action={logout}><button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Logout</button></form></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}