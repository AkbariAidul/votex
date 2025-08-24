// src/app/dashboard/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe data yang akan kita terima dari query
type EligibleElection = {
    has_voted: boolean;
    elections: {
        id: number;
        name: string;
        description: string | null;
        start_date: string;
        end_date: string;
    }[];
};

export default async function VoterDashboard() {
    const supabase = createServerComponentClient({ cookies });

    // 1. Dapatkan sesi user yang sedang login
    const { data: { session } } = await supabase.auth.getSession();

    // Jika tidak ada sesi (user belum login), tendang ke halaman login
    if (!session) {
        redirect('/login');
    }

    // 2. Ambil semua data pemilihan di mana user ini terdaftar
        const { data: eligibleElections, error } = await supabase
        .from('eligible_voters')
        .select(`
            has_voted,
            elections ( id, name, description, start_date, end_date )
        `)
        .eq('user_id', session.user.id);

    if (error) {
        console.error('Error fetching elections:', error);
        return <p className="p-8 text-red-500">Gagal memuat data pemilihan Anda.</p>;
    }
    
    // Fungsi untuk memeriksa apakah pemilihan sedang berlangsung
    const isElectionActive = (startDate: string, endDate: string) => {
        const now = new Date();
        return new Date(startDate) <= now && now <= new Date(endDate);
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Dashboard Pemilih</h1>
            <p className="text-lg text-gray-400 mb-8">Selamat datang, {session.user.email}!</p>

            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Pemilihan yang Anda Ikuti</h2>
            <div className="space-y-4">
                {eligibleElections.length > 0 ? (
                    eligibleElections.map((item: EligibleElection) => {
                        if (!item.elections || item.elections.length === 0) return null; // Lewati jika data pemilihan tidak ada
                        // Karena elections sekarang array, kita render untuk setiap election
                        return item.elections.map((election) => {
                            const isActive = isElectionActive(election.start_date, election.end_date);
                            return (
                                <div key={election.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{election.name}</h3>
                                        <p className="text-gray-400">
                                            Periode: {new Date(election.start_date).toLocaleDateString('id-ID')} - {new Date(election.end_date).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        {item.has_voted ? (
                                            <span className="py-2 px-4 rounded-full bg-green-800 text-green-300 font-semibold text-sm">
                                                ✅ Anda Sudah Memilih
                                            </span>
                                        ) : (
                                            <Link 
                                                href={`/vote/${election.id}`}
                                                className={`py-2 px-5 rounded-lg font-bold transition-colors
                                                    ${isActive 
                                                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                aria-disabled={!isActive}
                                                onClick={(e) => !isActive && e.preventDefault()}
                                            >
                                                {isActive ? 'Vote Sekarang' : 'Voting Ditutup'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        });
                    })
                ) : (
                    <p className="text-gray-400">Anda belum terdaftar dalam pemilihan manapun.</p>
                )}
            </div>
        </main>
    );
}