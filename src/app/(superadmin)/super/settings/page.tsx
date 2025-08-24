import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SettingsClientUI from './SettingsClientUI';

export default async function SettingsPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

    return <SettingsClientUI settings={settings} />;
}