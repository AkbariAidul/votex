import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GanttChartSquare, Users, PlusCircle, UserCheck } from 'lucide-react';


// Fungsi untuk mengambil statistik spesifik untuk organisasi admin
async function getAdminStats(supabase: any, orgId: number) {
    const { count: electionCount } = await supabase.from('elections').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
    const { count: candidateCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);
    const { count: voterCount } = await supabase.from('eligible_voters').select('*', { count: 'exact', head: true }).eq('organization_id', orgId);

    return {
        electionCount: electionCount || 0,
        candidateCount: candidateCount || 0,
        voterCount: voterCount || 0,
    };
}

// Fungsi untuk mengambil pemilu terbaru
async function getRecentElections(supabase: any, orgId: number) {
    const { data } = await supabase
        .from('elections')
        .select('id, name, status, created_at')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(5);
    return data || [];
}

// Komponen untuk menampilkan status pemilu
function StatusBadge({ status }: { status: string }) {
    const colors: { [key: string]: string } = {
        draft: 'bg-gray-700 text-gray-300',
        published: 'bg-blue-900 text-blue-300',
        ongoing: 'bg-green-900 text-green-300',
        completed: 'bg-purple-900 text-purple-300',
    };
    return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize ${colors[status] || 'bg-gray-700'}`}>{status}</span>;
}


export default async function AdminDashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase.from('profiles').select('organization_id, organizations(name)').eq('id', session.user.id).single();
    if (!profile?.organization_id) {
        return <p className="p-8">Akun Anda tidak terhubung ke organisasi manapun.</p>;
    }

    const orgId = profile.organization_id;
    const orgName = (profile.organizations as { name: string } | null)?.name;
    const stats = await getAdminStats(supabase, orgId);
    const recentElections = await getRecentElections(supabase, orgId);

    return (
        <main className="container mx-auto p-4 sm:p-8 space-y-8">
            {/* Header yang Diperbarui */}
            <div>
                <h1 className="text-3xl font-bold text-white">Selamat Datang, Admin!</h1>
                <h2 className="text-xl text-cyan-400 font-semibold">{orgName}</h2>
            </div>

            {/* Kartu Statistik yang Diperbarui */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                    <div className="p-3 mr-4 bg-gray-900 rounded-lg"><GanttChartSquare className="w-6 h-6 text-cyan-400" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Pemilihan</p>
                        <h5 className="text-2xl font-bold tracking-tight text-white">{stats.electionCount}</h5>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                    <div className="p-3 mr-4 bg-gray-900 rounded-lg"><Users className="w-6 h-6 text-cyan-400" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Kandidat</p>
                        <h5 className="text-2xl font-bold tracking-tight text-white">{stats.candidateCount}</h5>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                    <div className="p-3 mr-4 bg-gray-900 rounded-lg"><UserCheck className="w-6 h-6 text-cyan-400" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Total Pemilih Terdaftar</p>
                        <h5 className="text-2xl font-bold tracking-tight text-white">{stats.voterCount}</h5>
                    </div>
                </div>
            </div>
            
            {/* Konten Dinamis: Ajakan Aksi atau Aktivitas Terbaru */}
            <div>
                {recentElections.length === 0 ? (
                    // Tampilan jika belum ada pemilu sama sekali
                    <div className="text-center p-10 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg">
                        <h3 className="text-2xl font-bold text-white">Mulai Pemilihan Pertamamu</h3>
                        <p className="text-gray-400 mt-2 mb-6">Sepertinya belum ada pemilihan yang dibuat untuk organisasimu. Ayo mulai sekarang!</p>
                        <Link href="/admin/elections" className="inline-flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            <PlusCircle className="w-5 h-5"/> Buat Pemilihan Baru
                        </Link>
                    </div>
                ) : (
                    // Tampilan jika sudah ada pemilu
                    <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-white mb-4">Aktivitas Pemilihan Terbaru</h3>
                        <ul className="divide-y divide-gray-700">
                            {recentElections.map(election => (
                                <li key={election.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-md font-medium text-white">{election.name}</p>
                                        <p className="text-sm text-gray-400">Dibuat pada {new Date(election.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <StatusBadge status={election.status} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}