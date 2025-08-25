"use client";
import { useState } from 'react';
import type { Candidate } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

export default function VoteUI({ election, candidates, electionId }: { election: { name: string }, candidates: Candidate[], electionId: number }) {
    const router = useRouter();
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = () => {
        if (!selectedCandidate) {
            setError('Silakan pilih salah satu kandidat terlebih dahulu.');
            return;
        }
        setShowConfirmModal(true);
    };

    const handleVote = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: functionError } = await supabase.functions.invoke('cast-vote', {
                body: { election_id: electionId, candidate_id: selectedCandidate!.id },
            });
            if (functionError) throw functionError;
            
            alert('Terima kasih! Suara Anda telah berhasil dicatat.');
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(`Terjadi kesalahan: ${err.message || 'Gagal mencatat suara.'}`);
            setShowConfirmModal(false); // Tutup modal jika gagal
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="container mx-auto p-4 sm:p-8">
                <h1 className="text-4xl font-bold text-center mb-2 text-white">{election.name}</h1>
                <p className="text-center text-gray-400 mb-8">Pilih kandidat kepercayaan Anda.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${selectedCandidate?.id === candidate.id ? 'border-cyan-400 bg-gray-700 scale-105' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                            {selectedCandidate?.id === candidate.id && <div className="absolute top-2 right-2 bg-cyan-500 text-white rounded-full p-1"><Check size={16} /></div>}
                            <img src={candidate.photo_url || ''} alt={candidate.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-600"/>
                            <h3 className="text-2xl font-bold text-center text-white">{candidate.name}</h3>
                        </div>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <button onClick={handleConfirm} disabled={!selectedCandidate} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-10 rounded-lg text-xl transition disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Kirim Suara Saya
                    </button>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </div>
            </main>

            {/* Modal Konfirmasi */}
            {showConfirmModal && selectedCandidate && (
                <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-75">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                             <div className="p-6 text-center">
                                <h3 className="mb-2 text-2xl font-bold text-white">Konfirmasi Pilihan Anda</h3>
                                <p className="mb-5 text-lg font-normal text-gray-400">Anda akan memilih:</p>
                                <div className="mb-6 p-4 bg-gray-800 rounded-lg inline-block">
                                    <img src={selectedCandidate.photo_url || ''} alt={selectedCandidate.name} className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-cyan-400"/>
                                    <p className="font-bold text-xl mt-2 text-white">{selectedCandidate.name}</p>
                                </div>
                                <p className="mb-6 text-sm text-yellow-400">Peringatan: Pilihan ini tidak dapat diubah setelah dikirim.</p>
                                <button disabled={loading} onClick={handleVote} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2 disabled:bg-cyan-800">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? 'Mengirim...' : 'Ya, Saya Yakin'}
                                </button>
                                <button disabled={loading} onClick={() => setShowConfirmModal(false)} className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5">
                                    Tidak, Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}