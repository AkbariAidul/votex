"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js"; // Import createClient

export async function updateSettings(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const platformName = formData.get('platform_name')?.toString();
    const logoFile = formData.get('logo') as File;

    const updates: { platform_name?: string, platform_logo_url?: string } = {};

    if (platformName) {
        updates.platform_name = platformName;
    }

    if (logoFile && logoFile.size > 0) {
        // BUAT ADMIN CLIENT KHUSUS UNTUK STORAGE
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // Gunakan service key
        );
        
        const filePath = `logo-${Date.now()}`;
        // Lakukan upload menggunakan admin client
        const { error: uploadError } = await supabaseAdmin.storage
            .from('platform-assets')
            .upload(filePath, logoFile, { upsert: true });

        if (uploadError) return { error: `Gagal upload logo: ${uploadError.message}` };

        const { data: { publicUrl } } = supabaseAdmin.storage.from('platform-assets').getPublicUrl(filePath);
        updates.platform_logo_url = publicUrl;
    }

    if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from('settings').update(updates).eq('id', 1);
        if (error) return { error: `Gagal menyimpan pengaturan: ${error.message}` };
    }

    revalidatePath('/super/settings');
    return { success: 'Pengaturan berhasil disimpan.' };
}