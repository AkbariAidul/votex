"use client";
// ======================================================
// PERBAIKAN DI IMPORT INI
// ======================================================
import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { createElection, updateElection, deleteElection } from './actions';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

type Election = {
    id: number;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
};

function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="w-full text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">{pending ? pendingText : text}</button>
}

function StatusBadge({ status }: { status: string }) {
    const colors: { [key: string]: string } = {
        draft: 'bg-gray-700 text-gray-300',
        published: 'bg-blue-900 text-blue-300',
        ongoing: 'bg-green-900 text-green-300',
        completed: 'bg-purple-900 text-purple-300',
    };
    return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize ${colors[status] || 'bg-gray-700'}`}>{status}</span>;
}

export default function ElectionsClientUI({ initialElections }: { initialElections: Election[] }) {
    const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
    const [selectedElection, setSelectedElection] = useState<Election | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    const [createState, createFormAction] = useActionState(createElection, null);
    const [updateState, updateFormAction] = useActionState(updateElection, null);

    useEffect(() => {
        if (createState?.success || updateState?.success) {
            handleCloseModal();
        }
    }, [createState, updateState]);

    const handleOpenModal = (type: 'create' | 'edit' | 'delete', election?: Election) => {
        setSelectedElection(election || null);
        setModal(type);
    };

    const handleCloseModal = () => {
        setModal(null);
        setSelectedElection(null);
        formRef.current?.reset();
    };

    const handleDelete = async () => {
        if (selectedElection) {
            const result = await deleteElection(selectedElection.id);
            if (result.error) alert(result.error);
            handleCloseModal();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">🗳️ Manajemen Pemilihan</h1>
                <button onClick={() => handleOpenModal('create')} className="inline-flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <Plus className="w-4 h-4" />
                    Buat Pemilihan
                </button>
            </div>

            {initialElections.length === 0 ? (
                <div className="text-center p-10 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg">
                    <h3 className="text-2xl font-bold text-white">Belum Ada Pemilihan</h3>
                    <p className="text-gray-400 mt-2 mb-6">Mulai buat pemilihan pertamamu untuk organisasimu.</p>
                </div>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Nama Pemilihan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Periode</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialElections.map(election => (
                                <tr key={election.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-white">{election.name}</td>
                                    <td className="px-6 py-4"><StatusBadge status={election.status} /></td>
                                    <td className="px-6 py-4 text-xs">{new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={`/admin/elections/${election.id}`} className="font-medium text-cyan-500 hover:underline">Kelola</Link>
                                        <button onClick={() => handleOpenModal('edit', election)} className="font-medium text-yellow-500 hover:underline">Edit</button>
                                        <button onClick={() => handleOpenModal('delete', election)} className="font-medium text-red-500 hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(modal === 'create' || modal === 'edit') && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-60">
                    <div className="relative p-4 w-full max-w-lg">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 border-b border-gray-600">
                                <h3 className="text-xl font-medium text-white">{modal === 'create' ? 'Buat Pemilihan Baru' : 'Edit Pemilihan'}</h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:bg-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">X</button>
                            </div>
                            <form ref={formRef} action={modal === 'create' ? createFormAction : updateFormAction} className="p-6 space-y-4">
                                <input type="hidden" name="id" value={selectedElection?.id || ''} />
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Nama Pemilihan</label>
                                    <input type="text" name="name" id="name" defaultValue={selectedElection?.name || ''} className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5" required/>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">Deskripsi</label>
                                    <textarea name="description" id="description" rows={3} defaultValue={selectedElection?.description || ''} className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5"></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-white">Tanggal Mulai</label>
                                        <input type="datetime-local" name="start_date" id="start_date" defaultValue={selectedElection ? new Date(new Date(selectedElection.start_date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().substring(0, 16) : ''} className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5" required/>
                                    </div>
                                    <div>
                                        <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-white">Tanggal Selesai</label>
                                        <input type="datetime-local" name="end_date" id="end_date" defaultValue={selectedElection ? new Date(new Date(selectedElection.end_date).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().substring(0, 16) : ''} className="bg-gray-600 border-gray-500 text-white rounded-lg block w-full p-2.5" required/>
                                    </div>
                                </div>
                                <SubmitButton text={modal === 'create' ? 'Buat Pemilihan' : 'Simpan Perubahan'} pendingText="Menyimpan..." />
                                {(createState?.error && modal === 'create') && <p className="text-sm text-red-500">{createState.error}</p>}
                                {(updateState?.error && modal === 'edit') && <p className="text-sm text-red-500">{updateState.error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {modal === 'delete' && selectedElection && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-60">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-gray-700 rounded-lg shadow">
                            <div className="p-6 text-center">
                                <Trash2 className="mx-auto mb-4 text-gray-400 w-12 h-12" />
                                <h3 className="mb-5 text-lg font-normal text-gray-400">Anda yakin ingin menghapus pemilu "{selectedElection.name}"?</h3>
                                <button onClick={handleDelete} className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">Ya, saya yakin</button>
                                <button onClick={handleCloseModal} className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5">Tidak, batalkan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}