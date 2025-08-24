import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DashboardClientUI from './DashboardClientUI';

async function getStats(supabase: any) {
    const { count: orgCount } = await supabase.from('organizations').select('*', { count: 'exact', head: true });
    const { count: electionCount } = await supabase.from('elections').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user');

    return {
        orgCount: orgCount || 0,
        electionCount: electionCount || 0,
        userCount: userCount || 0,
    };
}

export default async function SuperAdminDashboard() {
    const supabase = createServerComponentClient({ cookies });
    const stats = await getStats(supabase);

    // PANGGIL FUNGSI RPC UNTUK DATA CHART ASLI
    const { data: monthlyData, error: rpcError } = await supabase.rpc('get_monthly_election_counts');
    if (rpcError) console.error("Error fetching chart data:", rpcError);

    // Format data untuk dikirim ke komponen client
    const chartData = {
        labels: monthlyData?.map(d => d.month_name) || [],
        values: monthlyData?.map(d => d.election_count) || []
    };

    return <DashboardClientUI stats={stats} chartData={chartData} />;
}