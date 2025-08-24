"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resendInvite } from "./actions"; // Import action
import { Send } from "lucide-react";

export default function UsersClientUI({ users, count, searchQuery, currentPage, limit }: { users: any[], count: number, searchQuery: string, currentPage: number, limit: number }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const totalPages = Math.ceil(count / limit);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = e.currentTarget.search.value;
        router.push(`/super/users?q=${query}`);
    };

    const handleResend = async (userId: string) => {
        setLoadingId(userId);
        const result = await resendInvite(userId);
        if (result.success) alert(result.success);
        if (result.error) alert(result.error);
        setLoadingId(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">👥 Manajemen Pemilih</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <input type="text" name="search" defaultValue={searchQuery} placeholder="Cari berdasarkan email atau NIM..." className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2 w-full max-w-md"/>
            </form>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Email</th><th className="px-6 py-3">NIM</th>
                            <th className="px-6 py-3">Organisasi</th><th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b bg-gray-800 border-gray-700">
                                <td className="px-6 py-4 text-white">{user.email}</td>
                                <td className="px-6 py-4">{user.nim}</td>
                                <td className="px-6 py-4">{user.organizations?.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleResend(user.id)}
                                        disabled={loadingId === user.id}
                                        className="font-medium text-cyan-500 hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                                    >
                                        <Send className="w-3 h-3"/> {loadingId === user.id ? 'Mengirim...' : 'Reset/Undang'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">Menampilkan {users.length} dari {count} pemilih</span>
                <div className="inline-flex mt-2 xs:mt-0">
                    <button disabled={currentPage <= 1} onClick={() => router.push(`/super/users?q=${searchQuery}&page=${currentPage - 1}`)} className="flex items-center justify-center px-4 h-10 font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50">Prev</button>
                    <button disabled={currentPage >= totalPages} onClick={() => router.push(`/super/users?q=${searchQuery}&page=${currentPage + 1}`)} className="flex items-center justify-center px-4 h-10 font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
}