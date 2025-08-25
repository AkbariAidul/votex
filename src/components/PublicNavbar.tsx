"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { AlignJustify, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/auth/actions";

export default function PublicNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

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

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0 z-50">
                            <Link href="/">
                                <Image src="/votex-logo.jpg" alt="Votex Logo" width={120} height={40} priority className="h-auto" />
                            </Link>
                        </div>
                        <nav className="hidden md:flex md:space-x-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} className="text-gray-300 hover:text-cyan-400 transition-colors">
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                        <div className="hidden md:block">
                             {session ? (
                                <div>
                                    <button id="user-menu-button" data-dropdown-toggle="user-dropdown" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600" type="button">
                                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                            {session.user.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                    <div id="user-dropdown" className="z-50 hidden my-4 text-base list-none bg-gray-700 divide-y divide-gray-600 rounded-lg shadow">
                                        <div className="px-4 py-3">
                                            <span className="block text-sm text-white">{session.user.email}</span>
                                            <span className="block text-sm text-gray-400 truncate">Pemilih</span>
                                        </div>
                                        <ul className="py-2" aria-labelledby="user-menu-button">
                                            <li><Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Dashboard</Link></li>
                                            <li><Link href="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Profil Saya</Link></li>
                                            <li>
                                                <form action={logout} className="w-full">
                                                    <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white">Logout</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 border rounded-md hover:bg-cyan-700">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="md:hidden fixed top-6 right-4 z-[100]">
                 <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/70">
                    {isMenuOpen ? <X size={28} /> : <AlignJustify size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants} initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg flex flex-col items-center justify-center"
                    >
                        <motion.nav 
                            className="flex flex-col items-center text-center space-y-8"
                            initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}
                        >
                            {navLinks.map((link) => (
                                <motion.a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-3xl font-semibold text-gray-200 hover:text-cyan-400" variants={navItemVariants}>
                                    {link.name}
                                </motion.a>
                            ))}
                            <motion.div variants={navItemVariants} className="pt-8">
                                 {session ? (
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-10 py-3 font-medium text-gray-900 bg-white border rounded-md hover:bg-gray-200">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-10 py-3 font-medium text-white bg-cyan-600 border rounded-md hover:bg-cyan-700">
                                        Login
                                    </Link>
                                )}
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}