// src/app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link'; // Jangan lupa import Link

type Election = {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
};

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: elections } = await supabase
    .from('elections')
    .select<"*, Election[]">('*')
    .order('created_at', { ascending: false });

  return (
    <main className="container mx-auto p-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-4 text-white">Selamat Datang di Votex!</h1>
        <p className="text-lg text-gray-400">Platform E-Voting Modern untuk Organisasi Anda.</p>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-cyan-400 border-b-2 border-cyan-400 pb-2">Daftar Pemilihan Aktif</h2>

      {(!elections || elections.length === 0) ? (
        <div className="text-center p-10 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Belum ada pemilihan yang dibuat saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div key={election.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2 text-white">{election.name}</h3>
              <p className="text-gray-400 mb-4 text-sm h-16 overflow-hidden">{election.description || 'Tidak ada deskripsi.'}</p>
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                <p>Mulai: {new Date(election.start_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                <p>Selesai: {new Date(election.end_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              </div>
              <Link href={`/login`} className="mt-4 inline-block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Login untuk Vote
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}