// src/app/vote/[id]/VoteUI.tsx
"use client";

import { useState } from 'react';
import type { Candidate } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface VoteUIProps {
    election: { name: string };
    candidates: Candidate[];
    electionId: number;
}

export default function VoteUI({ election, candidates, electionId }: VoteUIProps) {
    const router = useRouter();
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        if (!selectedCandidateId) {
            setError('Silakan pilih salah satu kandidat terlebih dahulu.');
            return;
        }

        if (!window.confirm('Apakah Anda yakin dengan pilihan Anda? Suara yang sudah masuk tidak dapat diubah.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Panggil Edge Function 'cast-vote' yang akan kita buat
            const { error: functionError } = await supabase.functions.invoke('cast-vote', {
                body: {
                    election_id: electionId,
                    candidate_id: selectedCandidateId,
                },
            });

            if (functionError) throw functionError;

            alert('Terima kasih! Suara Anda telah berhasil dicatat.');
            router.push('/dashboard'); // Arahkan kembali ke dashboard
            router.refresh(); // Refresh data di dashboard

        } catch (err: any) {
            setError(`Terjadi kesalahan: ${err.message || 'Gagal mencatat suara.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-2 text-white">{election.name}</h1>
            <p className="text-center text-gray-400 mb-8">Pilih kandidat kepercayaan Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidateId(candidate.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedCandidateId === candidate.id 
                                ? 'border-cyan-400 bg-gray-700 shadow-lg scale-105' 
                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                            }`
                        }
                    >
                        <img src={candidate.photo_url || ''} alt={candidate.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-600"/>
                        <h3 className="text-2xl font-bold text-center text-white">{candidate.name}</h3>
                        <div className="mt-4 p-3 bg-gray-900 rounded-md">
                            <h4 className="font-semibold text-cyan-400">Visi:</h4>
                            <p className="text-sm text-gray-300 line-clamp-3">{candidate.vision || '-'}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={handleVote}
                    disabled={loading || !selectedCandidateId}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-10 rounded-lg text-xl transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {loading ? 'Mengirim Suara...' : 'Kirim Suara Saya'}
                </button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </main>
    );
}