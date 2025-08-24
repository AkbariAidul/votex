"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function createLog(supabase: any, action: string, details: object) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('audit_logs').insert({ actor_email: user.email, action, details });
}

export async function createOrganization(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const name = formData.get('name')?.toString();
    if (!name || name.trim() === '') return { error: 'Nama organisasi tidak boleh kosong.' };

    const { data: newOrg, error } = await supabase.from('organizations').insert({ name: name.trim() }).select().single();
    if (error) return { error: `Gagal: ${error.message}` };
    
    await createLog(supabase, 'ORGANIZATION_CREATED', { orgId: newOrg.id, name: newOrg.name });
    revalidatePath('/super/organizations');
    return { success: 'Organisasi berhasil dibuat.' };
}

export async function updateOrganization(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    if (!id || !name || name.trim() === '') return { error: 'Data tidak lengkap.' };

    const { error } = await supabase.from('organizations').update({ name: name.trim() }).eq('id', id);
    if (error) return { error: `Gagal: ${error.message}` };

    await createLog(supabase, 'ORGANIZATION_UPDATED', { orgId: id, newName: name });
    revalidatePath('/super/organizations');
    return { success: 'Organisasi berhasil diperbarui.' };
}

export async function deleteOrganization(id: number) {
    const supabase = createServerActionClient({ cookies });
    const { data: org } = await supabase.from('organizations').select('name').eq('id', id).single();
    
    const { error } = await supabase.from('organizations').delete().eq('id', id);
    if (error) return { error: `Gagal: ${error.message}` };

    await createLog(supabase, 'ORGANIZATION_DELETED', { orgId: id, name: org?.name });
    revalidatePath('/super/organizations');
    return { success: 'Organisasi berhasil dihapus.' };
}