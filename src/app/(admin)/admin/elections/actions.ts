"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Fungsi helper untuk mendapatkan profil admin dan organization_id
async function getAdminProfile(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Pengguna tidak terotentikasi.");

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', user.id)
        .single();
    
    if (!profile || profile.role !== 'admin' || !profile.organization_id) {
        throw new Error("Akses ditolak: Pengguna bukan admin dari organisasi manapun.");
    }
    return profile;
}

export async function createElection(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    try {
        const profile = await getAdminProfile(supabase);
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const start_date = formData.get('start_date')?.toString();
        const end_date = formData.get('end_date')?.toString();

        if (!name || !start_date || !end_date) return { error: 'Semua field wajib diisi.' };

        const { error } = await supabase.from('elections').insert({
            name, description, start_date, end_date,
            organization_id: profile.organization_id,
            status: 'draft' // Setiap pemilu baru statusnya draft
        });
        if (error) throw error;
        
        revalidatePath('/admin/elections');
        return { success: 'Pemilihan baru berhasil dibuat.' };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateElection(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    try {
        const profile = await getAdminProfile(supabase);
        const id = formData.get('id')?.toString();
        // ... (ambil data form lainnya: name, description, dll.)

        const { error } = await supabase.from('elections')
            .update({ /* data update */ })
            .eq('id', id)
            .eq('organization_id', profile.organization_id); // Pastikan hanya bisa update milik organisasinya
        if (error) throw error;
        
        revalidatePath('/admin/elections');
        return { success: 'Pemilihan berhasil diperbarui.' };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteElection(id: number) {
    const supabase = createServerActionClient({ cookies });
    try {
        const profile = await getAdminProfile(supabase);
        const { error } = await supabase.from('elections')
            .delete()
            .eq('id', id)
            .eq('organization_id', profile.organization_id); // Pastikan hanya bisa hapus milik organisasinya
        if (error) throw error;
        
        revalidatePath('/admin/elections');
        return { success: 'Pemilihan berhasil dihapus.' };
    } catch (error: any) {
        return { error: error.message };
    }
}