"use client";
import { duplicateElection, updateElectionStatus } from './actions';
import Link from 'next/link';
import { useState } from 'react';

// Komponen untuk menampilkan status dengan warna yang berbeda
function StatusBadge({ status }: { status: string }) {
    const colors: { [key: string]: string } = {
        draft: 'bg-gray-700 text-gray-300',
        published: 'bg-blue-900 text-blue-300',
        ongoing: 'bg-green-900 text-green-300',
        completed: 'bg-purple-900 text-purple-300',
    };
    return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${colors[status] || 'bg-gray-700'}`}>{status}</span>;
}

export default function ElectionsClientUI({ elections }: { elections: any[] }) {
    const [loadingAction, setLoadingAction] = useState<number | null>(null);

    const handleDuplicate = async (id: number) => {
        if (confirm('Anda yakin ingin menduplikasi pemilu ini?')) {
            setLoadingAction(id);
            const result = await duplicateElection(id);
            if (result?.error) alert(result.error);
            setLoadingAction(null);
        }
    };
    
    // Fungsi untuk mengubah status akan ditambahkan di modal/dropdown nanti

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">🗳️ Manajemen Pemilu (Semua Organisasi)</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Nama Pemilu</th>
                            <th className="px-6 py-3">Organisasi</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Periode</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elections.map(e => (
                            <tr key={e.id} className="border-b bg-gray-800 border-gray-700">
                                <td className="px-6 py-4 text-white font-medium">{e.name}</td>
                                <td className="px-6 py-4">{e.organizations?.name || 'N/A'}</td>
                                <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                                <td className="px-6 py-4 text-xs">{new Date(e.start_date).toLocaleDateString()} - {new Date(e.end_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <Link href={`/super/elections/${e.id}/results`} className="font-medium text-cyan-500 hover:underline">Lihat Hasil</Link>
                                    <button onClick={() => handleDuplicate(e.id)} disabled={loadingAction === e.id} className="font-medium text-yellow-500 hover:underline disabled:opacity-50">
                                        {loadingAction === e.id ? 'Duplicating...' : 'Duplikasi'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}