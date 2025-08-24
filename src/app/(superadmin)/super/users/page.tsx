import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import UsersClientUI from './UsersClientUI';

export default async function ManageUsersPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const searchQuery = searchParams.q || '';
    const page = parseInt(searchParams.page || '1') - 1;
    const limit = 10; // 10 pemilih per halaman
    const start = page * limit;
    const end = start + limit - 1;

    let query = supabase
        .from('profiles')
        .select('*, organizations(name)', { count: 'exact' })
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .range(start, end);

    if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,nim.ilike.%${searchQuery}%`);
    }

    const { data: users, count, error } = await query;
    if (error) console.error("Error fetching users:", error);

    return <UsersClientUI 
        users={users || []} 
        count={count || 0}
        searchQuery={searchQuery}
        currentPage={page + 1}
        limit={limit}
    />;
}