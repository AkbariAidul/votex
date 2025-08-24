"use client";
// PERBAIKAN 1: Import dari 'react', bukan 'react-dom'
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSettings } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5">{pending ? 'Menyimpan...' : 'Simpan Pengaturan'}</button>
}

export default function SettingsClientUI({ settings }: { settings: any }) {
    // PERBAIKAN 2: Ganti nama hook menjadi useActionState
    const [state, formAction] = useActionState(updateSettings, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            alert('Sukses! Pengaturan telah disimpan.');
        }
        if (state?.error) {
            alert(`Error: ${state.error}`);
        }
    }, [state]);

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">⚙️ Pengaturan Platform</h1>
            <form ref={formRef} action={formAction} className="max-w-xl p-6 bg-gray-800 border border-gray-700 rounded-lg shadow space-y-6">
                <div>
                    <label htmlFor="platform_name" className="block mb-2 text-sm font-medium text-white">Nama Platform</label>
                    <input type="text" name="platform_name" id="platform_name" defaultValue={settings?.platform_name || ''} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" />
                </div>
                <div>
                    <label htmlFor="logo" className="block mb-2 text-sm font-medium text-white">Logo Platform (Upload baru jika ingin ganti)</label>
                    {settings?.platform_logo_url && <img src={settings.platform_logo_url} alt="Logo saat ini" className="w-32 h-auto mb-4 bg-gray-600 p-2 rounded" />}
                    <input type="file" name="logo" id="logo" accept="image/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white" />
                </div>
                <SubmitButton />
            </form>
        </main>
    );
}