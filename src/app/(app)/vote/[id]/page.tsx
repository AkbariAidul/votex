// src/app/vote/[id]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Candidate } from '@/lib/types';
import Link from 'next/link';
import VoteUI from './VoteUI'; // Komponen Client untuk interaksi

// Fungsi untuk mengambil detail pemilihan
async function getElectionDetails(supabase: any, electionId: string) {
    const { data, error } = await supabase.from('elections').select('name').eq('id', electionId).single();
    if (error) throw new Error('Pemilihan tidak ditemukan.');
    return data;
}

// Fungsi untuk mengambil daftar kandidat
async function getCandidates(supabase: any, electionId: string): Promise<Candidate[]> {
    const { data, error } = await supabase.from('candidates').select('*').eq('election_id', electionId);
    if (error) throw new Error('Gagal memuat kandidat.');
    return data || [];
}

// Fungsi validasi utama
async function validateVoter(supabase: any, userId: string, electionId: string) {
    const { data, error } = await supabase
        .from('eligible_voters')
        .select('has_voted')
        .eq('user_id', userId)
        .eq('election_id', electionId)
        .single();

    if (error || !data) throw new Error('Anda tidak terdaftar dalam pemilihan ini.');
    if (data.has_voted) throw new Error('Anda sudah memberikan suara pada pemilihan ini.');
}


export default async function VotePage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const electionId = params.id;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect('/login');
    }

    try {
        // Jalankan semua validasi
        await validateVoter(supabase, session.user.id, electionId);
        const election = await getElectionDetails(supabase, electionId);
        const candidates = await getCandidates(supabase, electionId);

        // Jika semua lolos, tampilkan UI Voting
        return <VoteUI election={election} candidates={candidates} electionId={parseInt(electionId)} />;

    } catch (error: any) {
        // Jika ada validasi yang gagal, tampilkan pesan error
        return (
            <main className="container mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Akses Ditolak</h1>
                <p className="text-gray-300 text-lg">{error.message}</p>
                <Link href="/dashboard" className="mt-6 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                    Kembali ke Dashboard
                </Link>
            </main>
        );
    }
}