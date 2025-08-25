import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { useActionState, useFormStatus } from 'react-dom'; // Ini client-side, jadi kita butuh komponen client
import SettingsClientUI from './SettingsClientUI';


export default async function AdminSettingsPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if(!profile) return <p>Profil tidak ditemukan.</p>;

    const { data: organization } = await supabase.from('organizations').select('*').eq('id', profile.organization_id).single();

    return <SettingsClientUI organization={organization} />;
}