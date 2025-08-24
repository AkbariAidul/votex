// src/app/(admin)/UserMenu.tsx
"use client"; // <-- Directive di baris paling atas

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function UserMenu({ user, orgName }: { user: User, orgName?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm text-white font-semibold">{user.email}</p>
                <p className="text-xs text-gray-400">{orgName || 'Admin'}</p>
            </div>
            <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2"
            >
                Logout
            </button>
        </div>
    );
}