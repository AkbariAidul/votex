import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ElectionsClientUI from './ElectionsClientUI';

export default async function SuperManageElectionsPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: elections } = await supabase
        .from('elections')
        .select('*, organizations(name)')
        .order('created_at', { ascending: false });

    return <ElectionsClientUI elections={elections || []} />;
}