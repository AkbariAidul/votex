"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function resendInvite(userId: string) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: user, error: getError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (getError || !user) return { error: 'Gagal menemukan user.' };

    // Fungsi inviteUserByEmail juga berfungsi sebagai pengirim ulang undangan/reset password
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(user.user.email!);

    if (error) return { error: `Gagal mengirim undangan: ${error.message}` };
    
    return { success: `Email undangan/reset password berhasil dikirim ke ${user.user.email}.` };
}

export async function deleteUser(userId: string) {
    // Implementasi hapus user (sama seperti deleteAdmin)
}