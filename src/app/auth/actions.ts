"use server"; // Menandakan ini adalah file khusus Server Action

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const supabase = createServerActionClient({ cookies });
    
    // Hancurkan sesi di level server
    await supabase.auth.signOut();

    // Lakukan redirect di level server ke halaman login
    redirect('/login');
}