"use client";
import { useState, useRef, useEffect, useActionState } from 'react'; // <-- PERBAIKAN DI SINI
import { useFormStatus } from 'react-dom';                              // <-- DAN DI SINI
import { motion } from 'framer-motion';
import { createOrganization, updateOrganization, deleteOrganization } from './actions';
import { Plus, Trash2, Edit } from 'lucide-react';

type Organization = {
    id: number;
    name: string;
    created_at: string;
};

function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">
            {pending ? pendingText : text}
        </button>
    );
}

export default function OrganizationsClientUI({ initialOrganizations }: { initialOrganizations: Organization[] }) {
    const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

    const createFormRef = useRef<HTMLFormElement>(null);
    const editFormRef = useRef<HTMLFormElement>(null);

    const [createState, createFormAction] = useActionState(createOrganization, null);
    const [updateState, updateFormAction] = useActionState(updateOrganization, null);

    useEffect(() => {
        if (createState?.success || updateState?.success) {
            handleCloseModal();
        }
    }, [createState, updateState]);

    const handleOpenModal = (type: 'create' | 'edit' | 'delete', org?: Organization) => {
        setSelectedOrg(org || null);
        setModal(type);
    };

    const handleCloseModal = () => {
        setModal(null);
        setSelectedOrg(null);
        // Reset state error secara manual
        // Ini adalah cara sederhana, bisa dibuat lebih canggih jika perlu
        if(createState) createState.error = undefined;
        if(updateState) updateState.error = undefined;
        createFormRef.current?.reset();
        editFormRef.current?.reset();
    };

    const handleDelete = async () => {
        if (selectedOrg) {
            const result = await deleteOrganization(selectedOrg.id);
            if (result.error) alert(result.error);
            handleCloseModal();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">👑 Manajemen Organisasi</h1>
                <button onClick={() => handleOpenModal('create')} className="inline-flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <Plus className="w-4 h-4" />
                    Tambah Organisasi
                </button>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Nama Organisasi</th>
                                <th scope="col" className="px-6 py-3">Tanggal Dibuat</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialOrganizations.map(org => (
                                <tr key={org.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-white">{org.id}</td>
                                    <td className="px-6 py-4">{org.name}</td>
                                    <td className="px-6 py-4">{new Date(org.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => handleOpenModal('edit', org)} className="font-medium text-cyan-500 hover:underline"><Edit className="inline w-4 h-4"/></button>
                                        <button onClick={() => handleOpenModal('delete', org)} className="font-medium text-red-500 hover:underline"><Trash2 className="inline w-4 h-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {initialOrganizations.length === 0 && <p className="text-center p-4">Belum ada organisasi yang ditambahkan.</p>}
                </div>
            </motion.div>

            {(modal === 'create' || modal === 'edit') && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                <h3 className="text-xl font-medium text-white">{modal === 'create' ? 'Tambah Organisasi Baru' : 'Edit Organisasi'}</h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">X</button>
                            </div>
                            <form ref={modal === 'create' ? createFormRef : editFormRef} action={modal === 'create' ? createFormAction : updateFormAction} className="p-6 space-y-6">
                                {modal === 'edit' && <input type="hidden" name="id" value={selectedOrg?.id} />}
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Nama Organisasi</label>
                                    <input type="text" name="name" id="name" defaultValue={selectedOrg?.name || ''} className="bg-gray-600 border border-gray-500 text-white rounded-lg block w-full p-2.5" required />
                                </div>
                                <SubmitButton text={modal === 'create' ? 'Tambah' : 'Simpan Perubahan'} pendingText="Menyimpan..." />
                                {(createState?.error && modal === 'create') && <p className="text-sm text-red-500">{createState.error}</p>}
                                {(updateState?.error && modal === 'edit') && <p className="text-sm text-red-500">{updateState.error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && selectedOrg && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="p-6 text-center">
                                <Trash2 className="mx-auto mb-4 text-gray-400 w-12 h-12" />
                                <h3 className="mb-5 text-lg font-normal text-gray-400">Anda yakin ingin menghapus organisasi "{selectedOrg.name}"?</h3>
                                <button onClick={handleDelete} className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                    Ya, saya yakin
                                </button>
                                <button onClick={handleCloseModal} className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5">
                                    Tidak, batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}