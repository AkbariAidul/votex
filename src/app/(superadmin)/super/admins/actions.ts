"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

async function createLog(supabase: any, action: string, details: object) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('audit_logs').insert({ actor_email: user.email, action, details });
}

export async function createAdminUser(previousState: any, formData: FormData) {
    const email = formData.get('email')?.toString();
    const organization_id = formData.get('organization_id')?.toString();
    const supabase = createServerActionClient({ cookies });

    if (!email || !organization_id) {
        return { error: 'Email dan Organisasi wajib diisi.' };
    }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (inviteError) return { error: `Gagal mengundang user: ${inviteError.message}` };

    if (inviteData.user) {
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({ id: inviteData.user.id, email: email, role: 'admin', organization_id: parseInt(organization_id) });
        if (profileError) return { error: `Gagal membuat profil: ${profileError.message}` };
        await createLog(supabase, 'ADMIN_CREATED', { adminEmail: email, orgId: organization_id });
    }

    revalidatePath('/super/admins');
    return { success: 'Admin berhasil didaftarkan dan diundang.' };
}

export async function updateAdmin(previousState: any, formData: FormData) {
    const userId = formData.get('userId')?.toString();
    const organization_id = formData.get('organization_id')?.toString();
    if (!userId || !organization_id) return { error: 'Data tidak lengkap.' };
    
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.from('profiles').update({ organization_id: parseInt(organization_id) }).eq('id', userId);
    if (error) return { error: `Gagal memperbarui admin: ${error.message}` };

    await createLog(supabase, 'ADMIN_UPDATED', { adminId: userId, newOrgId: organization_id });
    revalidatePath('/super/admins');
    return { success: 'Admin berhasil diperbarui.' };
}

export async function deleteAdmin(userId: string) {
    const supabase = createServerActionClient({ cookies });
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).single();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return { error: `Gagal menghapus admin: ${error.message}` };

    await createLog(supabase, 'ADMIN_DELETED', { deletedAdminId: userId, email: profile?.email });
    revalidatePath('/super/admins');
    return { success: 'Admin berhasil dihapus.' };
}