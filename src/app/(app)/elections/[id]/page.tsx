import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle2 } from 'lucide-react';

export default async function ElectionDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/login');
    
    const { data: election } = await supabase.from('elections').select('*, candidates(*)').eq('id', params.id).single();
    if (!election) return <p>Pemilihan tidak ditemukan.</p>;

    const { data: voterStatus } = await supabase.from('eligible_voters').select('has_voted').eq('election_id', params.id).eq('user_id', session.user.id).single();

    const now = new Date();
    const isActive = new Date(election.start_date) <= now && now <= new Date(election.end_date);
    const isFinished = now > new Date(election.end_date);

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">{election.name}</h1>
                <p className="text-lg text-gray-400 mt-2">{election.description}</p>
            </div>

            {voterStatus?.has_voted ? (
                <div className="p-6 text-center bg-green-900/50 border border-green-700 rounded-lg max-w-2xl mx-auto">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white">Terima Kasih!</h3>
                    <p className="text-green-300">Anda sudah memberikan suara pada pemilihan ini.</p>
                    {isFinished && <Link href={`/super/elections/${election.id}/results`} className="mt-4 inline-block text-cyan-400 hover:underline">Lihat Hasil Akhir</Link>}
                </div>
            ) : isFinished ? (
                 <div className="p-6 text-center bg-purple-900/50 border border-purple-700 rounded-lg max-w-2xl mx-auto">
                    <Clock className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white">Pemilihan Telah Selesai</h3>
                     <Link href={`/super/elections/${election.id}/results`} className="mt-4 inline-block text-cyan-400 hover:underline">Lihat Hasil Akhir</Link>
                </div>
            ) : !isActive ? (
                <div className="p-6 text-center bg-gray-800 border border-gray-700 rounded-lg max-w-2xl mx-auto">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white">Pemilihan Belum Dibuka</h3>
                    <p className="text-gray-400">Voting akan dimulai pada {new Date(election.start_date).toLocaleString('id-ID')}</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-10">
                         <Link href={`/vote/${election.id}`} className="px-10 py-4 text-xl font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-transform hover:scale-105">
                            Mulai Voting Sekarang
                        </Link>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {election.candidates.map((candidate: any) => (
                            <div key={candidate.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                                <img src={candidate.photo_url || ''} alt={candidate.name} className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-gray-600"/>
                                <h3 className="text-2xl font-bold text-white">{candidate.name}</h3>
                                <div className="mt-4 text-left">
                                    <h4 className="font-semibold text-cyan-400">Visi:</h4>
                                    <p className="text-sm text-gray-300">{candidate.vision || '-'}</p>
                                    <h4 className="font-semibold text-cyan-400 mt-2">Misi:</h4>
                                    <p className="text-sm text-gray-300">{candidate.mission || '-'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}