import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ElectionsClientUI from './ElectionsClientUI';

export default async function ManageElectionsPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Ambil organization_id dari profil admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
    
    // Jika profilnya tidak ada ATAU organization_id nya kosong (NULL)...
    if (!profile?.organization_id) { 
        // ...maka tampilkan pesan ini.
        return <p>Admin tidak terhubung ke organisasi manapun.</p>;
    }
    
    const { data: elections } = await supabase
        .from('elections')
        .select('*')
        .eq('organization_id', profile.organization_id) // <-- Query terfilter
        .order('created_at', { ascending: false });

    return <ElectionsClientUI initialElections={elections || []} />;
}