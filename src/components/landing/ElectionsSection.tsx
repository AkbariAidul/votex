import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

// ... (definisi tipe Election tidak berubah)

export default async function ElectionsSection() {
    const supabase = createServerComponentClient({ cookies });
    const { data: elections } = await supabase.from('elections').select('*').order('created_at', { ascending: false });

    return (
        <section id="pemilihan" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Pemilihan yang Sedang Berlangsung</h2>
                 {(!elections || elections.length === 0) ? (
                    <div className="text-center p-10 bg-gray-800 rounded-lg"><p className="text-gray-400">Belum ada pemilihan yang dibuat saat ini.</p></div>
                 ) : (
                    // Grid akan 1 kolom di mobile, 2 di tablet, dan 3 di desktop
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {elections.map((election) => (
                            <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col">
                                <h3 className="text-xl font-bold mb-2 text-white">{election.name}</h3>
                                <p className="text-gray-400 text-sm flex-grow min-h-[6rem]">{election.description || 'Tidak ada deskripsi.'}</p>
                                <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 mt-4">
                                    <p>Periode: {new Date(election.start_date).toLocaleDateString('id-ID')} - {new Date(election.end_date).toLocaleDateString('id-ID')}</p>
                                </div>
                                <Link href="/login" className="mt-4 inline-block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                    Login untuk Vote
                                </Link>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </section>
    );
}