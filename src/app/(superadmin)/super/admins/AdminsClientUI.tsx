"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFormStatus, useFormState } from 'react-dom';
import { createAdminUser, deleteAdmin, updateAdmin } from './actions';

// Definisikan tipe data agar lebih rapi
type Admin = {
    id: string;
    email: string;
    role: string;
    organizations: { id: number; name: string; } | null;
};

type Organization = {
    id: number;
    name: string;
};

function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">
            {pending ? pendingText : text}
        </button>
    )
}

export default function AdminsClientUI({ initialAdmins, organizations }: { initialAdmins: Admin[], organizations: Organization[] }) {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

    const createFormRef = useRef<HTMLFormElement>(null);
    const [createState, createFormAction] = useFormState(createAdminUser, null);

    useEffect(() => {
        if (createState?.success) {
            setCreateModalOpen(false); // Tutup modal jika berhasil
            createFormRef.current?.reset(); // Reset form
        }
    }, [createState]);

    const handleEditClick = (admin: Admin) => {
        setSelectedAdmin(admin);
        setEditModalOpen(true);
    };

    const handleDeleteClick = async (admin: Admin) => {
        if (window.confirm(`Yakin ingin menghapus admin ${admin.email}? Aksi ini tidak bisa dibatalkan.`)) {
            const result = await deleteAdmin(admin.id);
            if (result?.error) alert(result.error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">🏢 Manajemen Admin</h1>
                <button onClick={() => setCreateModalOpen(true)} className="block text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    + Tambah Admin
                </button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Organisasi</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialAdmins.map(admin => (
                                <tr key={admin.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">{admin.email}</th>
                                    <td className="px-6 py-4">{admin.organizations?.name || 'N/A'}</td>
                                    <td className="px-6 py-4"><span className="bg-blue-900 text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded">{admin.role}</span></td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => handleEditClick(admin)} className="font-medium text-cyan-500 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteClick(admin)} className="font-medium text-red-500 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {initialAdmins.length === 0 && <p className="text-center p-4">Belum ada admin yang terdaftar.</p>}
                </div>
            </motion.div>
            
            {/* ====================================================== */}
            {/* BAGIAN MODAL TAMBAH ADMIN YANG SEBELUMNYA KOSONG        */}
            {/* ====================================================== */}
            {isCreateModalOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full flex bg-black bg-opacity-50 inset-0">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-600">
                                <h3 className="text-xl font-medium text-white">Daftarkan Admin Baru</h3>
                                <button onClick={() => setCreateModalOpen(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form ref={createFormRef} action={createFormAction} className="p-6 space-y-6">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email Admin</label>
                                    <input type="email" name="email" id="email" className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" placeholder="nama@email.com" required />
                                </div>
                                <div>
                                    <label htmlFor="organization_id" className="block mb-2 text-sm font-medium text-white">Pilih Organisasi</label>
                                    <select name="organization_id" id="organization_id" className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" required>
                                        <option value="">-- Pilih Organisasi --</option>
                                        {organizations.map(org => (
                                            <option key={org.id} value={org.id}>{org.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <SubmitButton text="Daftarkan & Undang Admin" pendingText="Mendaftarkan..." />
                                {createState?.error && <p className="text-sm text-red-500">{createState.error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Admin */}
            {isEditModalOpen && selectedAdmin && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full flex bg-black bg-opacity-50 inset-0">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                <h3 className="text-xl font-medium text-white">Edit Admin: {selectedAdmin.email}</h3>
                                <button onClick={() => setEditModalOpen(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                                </button>
                            </div>
                            <form action={updateAdmin} onSubmit={() => setEditModalOpen(false)} className="p-6 space-y-6">
                                <input type="hidden" name="userId" value={selectedAdmin.id} />
                                <div>
                                    <label htmlFor="organization_id_edit" className="block mb-2 text-sm font-medium text-white">Pindahkan ke Organisasi</label>
                                    <select name="organization_id" id="organization_id_edit" defaultValue={selectedAdmin.organizations?.id} className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5" required>
                                        {organizations.map(org => (<option key={org.id} value={org.id}>{org.name}</option>))}
                                    </select>
                                </div>
                                <SubmitButton text="Simpan Perubahan" pendingText="Menyimpan..." />
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}