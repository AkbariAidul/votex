"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAdminOrgId(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!profile?.organization_id) throw new Error("Admin not associated with an organization.");

    return profile.organization_id;
}

export async function createElection(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    try {
        const orgId = await getAdminOrgId(supabase);
        const name = formData.get('name')?.toString();
        const description = formData.get('description')?.toString();
        const start_date = formData.get('start_date')?.toString();
        const end_date = formData.get('end_date')?.toString();

        if (!name || !start_date || !end_date) {
            return { error: 'Field wajib tidak boleh kosong.' };
        }

        const { error } = await supabase.from('elections').insert({
            name,
            description,
            start_date,
            end_date,
            organization_id: orgId // <-- Data terhubung ke organisasi admin
        });
        if (error) throw error;
        
        revalidatePath('/admin/elections');
        return { success: 'Pemilihan berhasil dibuat.' };
    } catch (error: any) {
        return { error: error.message };
    }
}

// Tambahkan juga fungsi update dan delete di sini dengan logika yang sama
// (selalu dapatkan orgId dan sertakan di query .eq('organization_id', orgId))