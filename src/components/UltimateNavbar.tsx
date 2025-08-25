"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { AlignJustify, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function UltimateNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    // Fungsi logout baru, berjalan sepenuhnya di client
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        }
        // Paksa reload halaman total. Ini akan membersihkan semua state
        // dan memaksa navbar untuk render ulang dalam kondisi sudah logout.
        window.location.reload();
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        
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
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const navLinks = [
        { name: "Tentang", href: "/#tentang" },
        { name: "Berita", href: "/#berita" },
        { name: "Kontak", href: "/#kontak" },
    ];
    
    // ... (sisa kode seperti varian animasi tidak berubah)

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-800' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/">
                            <Image src="/votex-logo.jpg" alt="Votex Logo" width={120} height={40} priority className="h-auto dark:invert" />
                        </Link>

                        {/* Navigasi Desktop Publik */}
                        {!session && (
                             <nav className="hidden md:flex md:space-x-8">
                                {navLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                        )}
                       
                        {/* Tombol Aksi Kanan */}
                        <div className="flex items-center gap-4">
                            {/* Theme Switcher */}
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Sun className="h-5 w-5 dark:hidden" />
                                <Moon className="h-5 w-5 hidden dark:block" />
                            </button>
                            
                            {/* Menu Pengguna atau Tombol Login */}
                            <div className="hidden md:block">
                                {session ? (
                                    <div>
                                        <button id="user-menu-button" data-dropdown-toggle="user-dropdown" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600" type="button">
                                            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                                {session.user.email?.charAt(0).toUpperCase()}
                                            </div>
                                        </button>
                                        <div id="user-dropdown" className="z-50 hidden my-4 text-base list-none bg-white rounded-lg shadow dark:bg-gray-700 divide-y dark:divide-gray-600">
                                            <div className="px-4 py-3">
                                                <span className="block text-sm text-gray-900 dark:text-white">{session.user.email}</span>
                                                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{profile?.role}</span>
                                            </div>
                                            <ul className="py-2">
                                                {/* ... (Link-link dropdown lainnya) ... */}
                                                <li>
                                                    {/* GANTI <form> DENGAN <button onClick> */}
                                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 border rounded-md hover:bg-cyan-700">Login</Link>
                                )}
                            </div>
                        </div>

                        {/* Tombol Hamburger untuk Mobile */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X/> : <AlignJustify/>}</button>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* ... (Kode untuk Mobile Menu Overlay tidak berubah) ... */}
        </>
    );
}