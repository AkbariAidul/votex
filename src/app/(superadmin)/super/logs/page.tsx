import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function ActivityLogPage() {
    const supabase = createServerComponentClient({ cookies });

    const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Batasi 100 log terbaru

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">📜 Activity Log</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Waktu</th>
                            <th className="px-6 py-3">Aktor</th>
                            <th className="px-6 py-3">Aksi</th>
                            <th className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs?.map(log => (
                            <tr key={log.id} className="border-b bg-gray-800 border-gray-700">
                                <td className="px-6 py-4 text-white whitespace-nowrap">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4">{log.actor_email}</td>
                                <td className="px-6 py-4"><span className="bg-purple-900 text-purple-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded">{log.action}</span></td>
                                <td className="px-6 py-4 text-xs"><pre><code>{JSON.stringify(log.details, null, 2)}</code></pre></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}