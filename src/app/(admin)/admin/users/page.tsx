import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UsersClientUI from './UsersClientUI';

export default async function ManageOrgUsersPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: adminProfile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!adminProfile?.organization_id) return <p>Anda tidak terhubung ke organisasi.</p>;

    const { data: users } = await supabase.from('profiles').select('*').eq('organization_id', adminProfile.organization_id).order('role');

    return <UsersClientUI initialUsers={users || []} />;
}