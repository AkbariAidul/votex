"use client";

import type { User } from '@supabase/supabase-js';
import { logout } from '@/app/auth/actions'; // <-- Import Server Action kita

interface UserMenuProps {
    user: User;
    displayName?: string;
}

export default function UserMenu({ user, displayName }: UserMenuProps) {
    // Kita tidak butuh useRouter atau handleLogout lagi di sini
    
    return (
        <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm text-white font-semibold">{user.email}</p>
                {displayName && <p className="text-xs text-gray-400">{displayName}</p>}
            </div>
            
            {/* Tombol logout sekarang ada di dalam form yang memanggil action */}
            <form action={logout}>
                <button
                    type="submit"
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}