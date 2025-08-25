"use client";
import { useState, useRef, useEffect, useActionState } from 'react'; // <-- Import useActionState dari 'react'
import { useFormStatus } from 'react-dom';                       // <-- Import useFormStatus dari 'react-dom'
import { createVoterUserWithPassword } from './actions';
import { resendInvite } from '@/app/(superadmin)/super/users/actions';
import { Send, Loader2, PlusCircle } from 'lucide-react';

function RoleBadge({ role }: { role: string }) {
    const colors: { [key: string]: string } = {
        admin: 'bg-blue-900 text-blue-300',
        user: 'bg-green-900 text-green-300',
    };
    return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize ${colors[role] || 'bg-gray-700'}`}>{role}</span>;
}

function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-500">{pending ? pendingText : text}</button>
}

export default function UsersClientUI({ initialUsers }: { initialUsers: any[] }) {
    const [showModal, setShowModal] = useState(false);
    const [state, formAction] = useActionState(createVoterUserWithPassword, null);
    const formRef = useRef<HTMLFormElement>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

     useEffect(() => {
        if (state?.success) {
            alert(state.success);
            setShowModal(false);
            formRef.current?.reset();
        }
        if (state?.error) {
            alert(`Gagal: ${state.error}`);
        }
    }, [state]);

    const handleResend = async (userId: string) => {
        setLoadingId(userId);
        const result = await resendInvite(userId);
        if (result.success) alert(result.success);
        if (result.error) alert(result.error);
        setLoadingId(null);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">👥 Manajemen Pengguna Organisasi</h1>
                <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg text-sm px-5 py-2.5">
                    <PlusCircle className="w-4 h-4"/>
                    Tambah Pemilih
                </button>
            </div>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">NIM / ID</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialUsers.map((profile: any) => (
                            <tr key={profile.id} className="border-b bg-gray-800 border-gray-700">
                                <td className="px-6 py-4 font-medium text-white">{profile.email}</td>
                                <td className="px-6 py-4">{profile.identifier_value || '-'}</td>
                                <td className="px-6 py-4"><RoleBadge role={profile.role} /></td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleResend(profile.id)}
                                        disabled={loadingId === profile.id}
                                        className="font-medium text-cyan-500 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                                    >
                                        {loadingId === profile.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-3 h-3"/>}
                                        {loadingId === profile.id ? 'Mengirim...' : 'Reset/Undang'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {initialUsers.length === 0 && <p className="text-center p-4">Belum ada pengguna di organisasimu.</p>}
            </div>

            {/* Modal Tambah Pemilih */}
            {showModal && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-60">
                    <div className="relative p-4 w-full max-w-lg">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                <h3 className="text-xl font-medium text-white">Daftarkan Pemilih Baru</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">X</button>
                            </div>
                            <form ref={formRef} action={formAction} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="identifier_type" className="block mb-2 text-sm font-medium text-white">Tipe ID</label>
                                        <select name="identifier_type" id="identifier_type" className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5">
                                            <option>NIM</option>
                                            <option>NIDN</option>
                                            <option>NIK</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="identifier_value" className="block mb-2 text-sm font-medium text-white">Nomor ID</label>
                                        <input type="text" name="identifier_value" id="identifier_value" className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5" required/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password Awal</label>
                                    <input type="password" name="password" id="password" className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5" placeholder="Min. 6 karakter" required/>
                                </div>
                                <SubmitButton text="Daftarkan Pemilih" pendingText="Mendaftarkan..."/>
                                {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}