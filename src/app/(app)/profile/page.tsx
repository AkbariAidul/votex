"use client";
import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { Mail, Fingerprint, Building, Lock, History } from 'lucide-react';

// Server action untuk update password (tetap sama)
async function updatePassword(previousState: any, formData: FormData) {
    // ... (kode server action ini tidak berubah)
}

function SubmitButton() {
    // ... (kode SubmitButton ini tidak berubah)
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [votingHistory, setVotingHistory] = useState<any[]>([]); // State baru untuk riwayat
    const [loading, setLoading] = useState(true);

    const [state, formAction] = useActionState(updatePassword, null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                
                // Ambil data profil dan riwayat secara paralel untuk efisiensi
                const [profileRes, historyRes] = await Promise.all([
                    supabase.from('profiles').select('*, organizations(name)').eq('id', session.user.id).single(),
                    supabase.from('votes').select('created_at, elections(name)').eq('voter_id', session.user.id)
                ]);

                if (profileRes.data) setProfile(profileRes.data);
                if (historyRes.data) setVotingHistory(historyRes.data);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <p className="p-8 text-center">Memuat profil...</p>;
    if (!profile) return <p className="p-8 text-center">Gagal memuat profil. Silakan coba lagi.</p>;

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-3xl">
                    {profile.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">{profile.email}</h1>
                    <span className="bg-blue-900 text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize">{profile.role}</span>
                </div>
            </div>

            {/* STRUKTUR TAB DIMULAI DI SINI */}
            <div className="mb-4 border-b border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                    <li className="me-2" role="presentation">
                        <button className="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Detail Profil</button>
                    </li>
                    <li className="me-2" role="presentation">
                        <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-300 hover:border-gray-300" id="security-tab" data-tabs-target="#security" type="button" role="tab" aria-controls="security" aria-selected="false">Keamanan</button>
                    </li>
                    <li className="me-2" role="presentation">
                        <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-300 hover:border-gray-300" id="history-tab" data-tabs-target="#history" type="button" role="tab" aria-controls="history" aria-selected="false">Riwayat Suara</button>
                    </li>
                </ul>
            </div>
            
            <div id="myTabContent">
                {/* KONTEN TAB 1: DETAIL PROFIL */}
                <div className="hidden p-4 rounded-lg bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-cyan-400"/>
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-lg text-white">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Fingerprint className="w-6 h-6 text-cyan-400"/>
                            <div>
                                <p className="text-sm text-gray-400">NIM / ID</p>
                                <p className="text-lg text-white">{profile.identifier_value || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Building className="w-6 h-6 text-cyan-400"/>
                            <div>
                                <p className="text-sm text-gray-400">Organisasi Utama</p>
                                <p className="text-lg text-white">{profile.organizations?.name || 'Umum'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KONTEN TAB 2: KEAMANAN (UBAH PASSWORD) */}
                <div className="hidden p-4 rounded-lg bg-gray-800" id="security" role="tabpanel" aria-labelledby="security-tab">
                    <div className="max-w-md">
                        <h2 className="text-xl font-semibold text-white mb-4">Ubah Password</h2>
                        <form action={formAction} className="space-y-4">
                            <div>
                                <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-white">Password Baru</label>
                                <input type="password" name="new_password" id="new_password" className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5" required/>
                            </div>
                            <SubmitButton />
                            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                            {state?.success && <p className="text-sm text-green-500">{state.success}</p>}
                        </form>
                    </div>
                </div>

                {/* KONTEN TAB 3: RIWAYAT SUARA */}
                <div className="hidden p-4 rounded-lg bg-gray-800" id="history" role="tabpanel" aria-labelledby="history-tab">
                     <h2 className="text-xl font-semibold text-white mb-4">Riwayat Pemberian Suara</h2>
                     {votingHistory.length > 0 ? (
                        <ul className="divide-y divide-gray-700">
                            {votingHistory.map((vote, index) => (
                                <li key={index} className="py-3 flex items-center gap-4">
                                    <History className="w-5 h-5 text-gray-400"/>
                                    <div>
                                        <p className="text-white">Anda memberikan suara pada pemilihan <span className="font-semibold text-cyan-400">{vote.elections.name}</span></p>
                                        <p className="text-sm text-gray-500">Pada tanggal: {new Date(vote.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                     ) : (
                        <p className="text-gray-400">Anda belum pernah memberikan suara.</p>
                     )}
                </div>
            </div>
        </main>
    );
}