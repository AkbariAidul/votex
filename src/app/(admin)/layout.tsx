// src/app/(admin)/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, GanttChartSquare } from 'lucide-react';
import UserMenu from '@/components/UserMenu'; // <-- IMPORT DARI LOKASI BARU

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, organizations(name)')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard');
    }

    const orgName = (profile.organizations as { name: string } | null)?.name;

    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/dashboard" className="flex ms-2 md:me-24">
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">Votex Admin</span>
                        </Link>
                        {/* Gunakan komponen terpusat */}
                        <UserMenu user={session.user} displayName={orgName} />
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 sm:translate-x-0 -translate-x-full bg-gray-800 border-r border-gray-700">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link href="/admin/dashboard" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/elections" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group">
                                <GanttChartSquare className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Manajemen Pemilihan</span>
                            </Link>
                        </li>
                    </ul>
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