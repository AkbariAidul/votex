// src/app/(superadmin)/layout.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';
import SidebarLinks from './SidebarLinks'; // <-- Import komponen baru

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    if (!profile || profile.role !== 'superadmin') redirect('/dashboard');

    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <Link href="/super/dashboard" className="flex ms-2 md:me-24">
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">Votex Superadmin</span>
                        </Link>
                        <UserMenu user={session.user} displayName="Super Admin" />
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 sm:translate-x-0 -translate-x-full bg-gray-800 border-r border-gray-700">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
                    {/* Ganti <ul> lama dengan komponen ini */}
                    <SidebarLinks />
                </div>
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="mt-14">
                    {children}
                </div>
            </div>
        </div>
    );
}