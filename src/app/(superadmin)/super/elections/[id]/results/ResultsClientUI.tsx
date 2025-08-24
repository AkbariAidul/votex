"use client";
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '@/lib/supabaseClient';
import Papa from 'papaparse'; // Import papaparse
import { Download } from 'lucide-react'; // Import ikon

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Result = { name: string; votes: number };

export default function ResultsClientUI({ initialElection, initialResults }: { initialElection: any, initialResults: Result[] }) {
    const [results, setResults] = useState<Result[]>(initialResults);
    const [totalVotes, setTotalVotes] = useState(initialResults.reduce((sum, r) => sum + r.votes, 0));

    useEffect(() => {
        const channel = supabase.channel(`votes_for_election_${initialElection.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes', filter: `election_id=eq.${initialElection.id}` },
            (payload) => {
                const newVote = payload.new as { candidate_id: number };
                // Logika ini perlu diperbaiki agar benar-benar real-time dan akurat
                // Untuk sekarang, kita akan andalkan refresh manual atau data awal
                console.log('New vote received!', payload);
                // Untuk update real-time yang lebih akurat, lebih baik fetch ulang data
            })
            .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialElection.id]);

    const handleDownloadCSV = () => {
        const csvData = results.map(r => ({
            "Nama Kandidat": r.name,
            "Jumlah Suara": r.votes,
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `hasil_pemilu_${initialElection.name.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const chartData = {
        labels: results.map(r => r.name),
        datasets: [{
            label: 'Jumlah Suara',
            data: results.map(r => r.votes),
            backgroundColor: 'rgba(34, 211, 238, 0.6)',
            borderColor: 'rgba(34, 211, 238, 1)',
            borderWidth: 1,
        }],
    };
    
    // ... (opsi chart tidak berubah)

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">{initialElection.name}</h1>
                    <h2 className="text-xl text-cyan-400">{initialElection.organizations.name}</h2>
                    <p className="text-gray-400 mt-2">Total Suara Masuk: {totalVotes}</p>
                </div>
                <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 text-white bg-gray-600 hover:bg-gray-700 font-medium rounded-lg text-sm px-4 py-2.5 text-center">
                    <Download className="w-4 h-4" />
                    Download Laporan (CSV)
                </button>
            </div>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                <Bar data={chartData} />
            </div>
        </main>
    );
}