// src/app/(superadmin)/super/organizations/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OrganizationsClientUI from './OrganizationsClientUI'; // Import komponen client

export default async function ManageOrganizationsPageServer() {
    const supabase = createServerComponentClient({ cookies });

    const { data: organizations, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Gagal fetch organisasi di server:", error);
    }

    // Render komponen client dan oper data awal sebagai props
    return <OrganizationsClientUI initialOrganizations={organizations || []} />;
}