"use client";
import type { User } from '@supabase/supabase-js';
import { logout } from '@/app/auth/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Komponen ini tidak perlu diubah karena sudah memanggil server action
// yang benar, dan server action tersebut yang akan menangani redirect.

interface UserMenuProps {
    user: User;
    displayName?: string;
}

export default function UserMenu({ user, displayName }: UserMenuProps) {
    return (
        <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm text-white font-semibold">{user.email}</p>
                {displayName && <p className="text-xs text-gray-400">{displayName}</p>}
            </div>
            
            <form action={logout}>
                <button
                    type="submit"
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 flex items-center"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}