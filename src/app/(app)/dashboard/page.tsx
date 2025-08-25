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
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Dashboard Pemilih</h1>
            <p className="text-lg text-gray-400 mb-8">Selamat datang, {session.user.email}!</p>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Pemilihan yang Anda Ikuti</h2>
            <div className="space-y-4">
                {eligibleElections.length > 0 ? (
                    eligibleElections.map((item: any) => { // Tipe any untuk sementara
                        if (!item.elections) return null;
                        const isActive = isElectionActive(item.elections.start_date, item.elections.end_date);
                        const isFinished = new Date() > new Date(item.elections.end_date);
                        
                        let button;
                        if (item.has_voted) {
                            button = <span className="py-2 px-4 rounded-full bg-green-800 text-green-300 font-semibold text-sm">✅ Anda Sudah Memilih</span>;
                        } else if (isActive) {
                            button = <Link href={`/elections/${item.elections.id}`} className="py-2 px-5 rounded-lg font-bold transition-colors bg-cyan-600 hover:bg-cyan-700 text-white">Lihat Detail & Vote</Link>;
                        } else if (isFinished) {
                             button = <Link href={`/elections/${item.elections.id}`} className="py-2 px-5 rounded-lg font-bold transition-colors bg-purple-600 hover:bg-purple-700 text-white">Lihat Hasil</Link>;
                        } else {
                            button = <span className="py-2 px-5 rounded-lg font-bold bg-gray-600 text-gray-400 cursor-not-allowed">Voting Belum Dibuka</span>
                        }

                        return (
                            <div key={item.elections.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{item.elections.name}</h3>
                                    <p className="text-gray-400">Periode: {new Date(item.elections.start_date).toLocaleDateString('id-ID')} - {new Date(item.elections.end_date).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div className="shrink-0">{button}</div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-gray-400">Anda belum terdaftar dalam pemilihan manapun.</p>
                )}
            </div>
        </main>
    );
}