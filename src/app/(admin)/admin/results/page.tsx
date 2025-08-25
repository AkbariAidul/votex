import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default async function AdminResultsPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!profile?.organization_id) return <p>Admin tidak terhubung ke organisasi.</p>;

    const { data: elections } = await supabase
        .from('elections')
        .select('id, name, status, candidates(count), eligible_voters(count), votes(count)')
        .eq('organization_id', profile.organization_id)
        .neq('status', 'draft') // Hanya tampilkan pemilu yang sudah berjalan/selesai
        .order('created_at', { ascending: false });

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3"><BarChart3/> Hasil & Analitik</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {elections?.map(election => {
                    const participation = election.eligible_voters[0].count > 0 
                        ? ((election.votes[0].count / election.eligible_voters[0].count) * 100).toFixed(1) 
                        : 0;

                    return (
                        <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white">{election.name}</h3>
                            <span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-blue-900 text-blue-300 capitalize">{election.status}</span>
                            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">{election.candidates[0].count}</p>
                                    <p className="text-sm text-gray-400">Kandidat</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">{election.votes[0].count} / {election.eligible_voters[0].count}</p>
                                    <p className="text-sm text-gray-400">Suara Masuk</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-cyan-400">{participation}%</p>
                                    <p className="text-sm text-gray-400">Partisipasi</p>
                                </div>
                            </div>
                            <div className="mt-6 text-right">
                                <Link href={`/super/elections/${election.id}/results`} className="font-medium text-cyan-500 hover:underline">
                                    Lihat Detail Hasil →
                                </Link>
                            </div>
                        </div>
                    );
                })}
                 {(!elections || elections.length === 0) && <p className="text-gray-400 md:col-span-2">Belum ada data pemilu yang bisa dianalisis.</p>}
            </div>
        </main>
    );
}