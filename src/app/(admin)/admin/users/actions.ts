"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// FUNGSI HELPER YANG DIPERBARUI
async function getAdminProfile(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Jika tidak ada user/sesi, langsung gagalkan
        throw new Error("Sesi tidak valid. Silakan login kembali.");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', user.id)
        .single();
    
    // PERBAIKAN: Tambahkan pengecekan eksplisit jika profil tidak ditemukan atau tidak valid
    if (!profile || profile.role !== 'admin' || !profile.organization_id) {
        throw new Error("Akses ditolak. Akun Anda bukan admin yang valid atau tidak terhubung ke organisasi.");
    }
    
    return profile;
}

export async function createVoterUserWithPassword(previousState: any, formData: FormData) {
    // Kita gunakan createServerActionClient di sini agar konsisten
    const supabase = createServerActionClient({ cookies });
    try {
        // Panggil fungsi helper yang sudah diperbaiki
        const profile = await getAdminProfile(supabase);

        const identifier_type = formData.get('identifier_type')?.toString();
        const identifier_value = formData.get('identifier_value')?.toString();
        const password = formData.get('password')?.toString();

        if (!identifier_type || !identifier_value || !password) {
            return { error: 'Semua field wajib diisi.' };
        }
        if (password.length < 6) return { error: 'Password minimal 6 karakter.' };
        
        const proxyEmail = `${identifier_value}@votex.app`;

        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: proxyEmail,
            password: password,
            email_confirm: true,
        });
        if (authError) throw new Error(authError.message);

        if (authData.user) {
            const { error: profileError } = await supabaseAdmin.from('profiles').insert({
                id: authData.user.id,
                email: proxyEmail,
                role: 'user',
                identifier_type,
                identifier_value,
                organization_id: profile.organization_id // <-- Sekarang 'profile' dijamin tidak null
            });
            if (profileError) throw new Error(profileError.message);
        }
        revalidatePath('/admin/users');
        return { success: `Pemilih dengan ID ${identifier_value} berhasil dibuat.` };
    } catch (error: any) {
        return { error: error.message };
    }
}