// src/app/update-password/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [sessionExists, setSessionExists] = useState(false);

    useEffect(() => {
        // Cek jika ada session recovery di URL
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setSessionExists(true);
            }
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        // Gunakan fungsi updateUser untuk mengatur password baru
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(`Gagal memperbarui password: ${error.message}`);
        } else {
            setMessage('Password berhasil diperbarui! Anda akan diarahkan ke halaman login.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
        setLoading(false);
    };
    
    // Tampilkan form hanya jika ada sesi recovery
    if (!sessionExists) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-400">Menunggu sesi pemulihan password...</p>
          </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Atur Password Baru</h1>
                <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-300 mb-2">Password Baru</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </button>
                    {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
                    {message && <p className="mt-4 text-sm text-green-400 text-center">{message}</p>}
                </form>
            </div>
        </div>
    );
}