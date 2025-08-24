import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getAdminStats(supabase: any, orgId: number) {
    // Ambil total pemilihan untuk organisasi ini
    const { count: electionCount } = await supabase.from('elections').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
    
    // Ambil total kandidat untuk organisasi ini
    const { count: candidateCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
    
    // Ambil total pemilih terdaftar untuk organisasi ini
    const { count: voterCount } = await supabase.from('eligible_voters').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);

    return {
        electionCount: electionCount || 0,
        candidateCount: candidateCount || 0,
        voterCount: voterCount || 0,
    };
}

export default async function AdminDashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        redirect('/login');
    }

    // Ambil organization_id dari profil admin
    const { data: profile } = await supabase.from('profiles').select('organization_id, organizations(name)').eq('id', session.user.id).single();
    
    if (!profile?.organization_id) {
        return <p className="p-8">Akun Anda tidak terhubung ke organisasi manapun.</p>;
    }

    const stats = await getAdminStats(supabase, profile.organization_id);
    const orgName = Array.isArray(profile.organizations) && profile.organizations.length > 0
        ? profile.organizations[0].name
        : null;

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Dashboard Admin</h1>
            <h2 className="text-xl text-cyan-400 mb-6">{orgName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{stats.electionCount}</h5>
                    <p className="font-normal text-gray-400">Total Pemilihan</p>
                </div>
                <div className="block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{stats.candidateCount}</h5>
                    <p className="font-normal text-gray-400">Total Kandidat</p>
                </div>
                <div className="block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{stats.voterCount}</h5>
                    <p className="font-normal text-gray-400">Total Pemilih Terdaftar</p>
                </div>
            </div>

            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-white mb-4">Aktivitas Terbaru</h3>
                <p className="text-gray-400">Area untuk aktivitas atau chart mendatang...</p>
            </div>
        </main>
    );
}