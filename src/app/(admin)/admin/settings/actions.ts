"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

async function getAdminProfile(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Pengguna tidak terotentikasi.");
    const { data: profile } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin' || !profile.organization_id) {
        throw new Error("Akses ditolak.");
    }
    return profile;
}

export async function updateOrganizationSettings(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    try {
        const profile = await getAdminProfile(supabase);
        const orgName = formData.get('org_name')?.toString();
        const logoFile = formData.get('logo') as File;
        
        const updates: { name?: string, logo_url?: string } = {};

        if (orgName) {
            updates.name = orgName;
        }

        if (logoFile && logoFile.size > 0) {
            const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
            const filePath = `org-logos/${profile.organization_id}-${Date.now()}`;
            
            const { error: uploadError } = await supabaseAdmin.storage
                .from('platform-assets') // Kita gunakan bucket yang sama dengan logo platform
                .upload(filePath, logoFile, { upsert: true });

            if (uploadError) throw new Error(`Gagal upload logo: ${uploadError.message}`);

            const { data: { publicUrl } } = supabaseAdmin.storage.from('platform-assets').getPublicUrl(filePath);
            updates.logo_url = publicUrl;
        }

        if (Object.keys(updates).length > 0) {
            const { error } = await supabase.from('organizations').update(updates).eq('id', profile.organization_id);
            if (error) throw error;
        }

        revalidatePath('/admin/settings');
        return { success: 'Pengaturan berhasil disimpan.' };

    } catch (error: any) {
        return { error: error.message };
    }
}