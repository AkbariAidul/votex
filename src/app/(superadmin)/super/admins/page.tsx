// src/app/(superadmin)/super/admins/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AdminsClientUI from './AdminsClientUI';

export default async function ManageAdminsPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: admins } = await supabase.from('profiles').select('*, organizations(name)').eq('role', 'admin');
    const { data: organizations } = await supabase.from('organizations').select('*');

    return <AdminsClientUI initialAdmins={admins || []} organizations={organizations || []} />;
}