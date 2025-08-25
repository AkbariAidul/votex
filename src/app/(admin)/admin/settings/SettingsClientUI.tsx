"use client";
import { useActionState, useFormStatus } from 'react-dom';
import { updateOrganizationSettings } from './actions';
import { useEffect } from 'react';

function SubmitButton() { /* ... (sama seperti sebelumnya) ... */ }

export default function SettingsClientUI({ organization }: { organization: any }) {
    const [state, formAction] = useActionState(updateOrganizationSettings, null);

    useEffect(() => {
        if (state?.success) alert(state.success);
        if (state?.error) alert(`Error: ${state.error}`);
    }, [state]);

    return (
         <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">⚙️ Pengaturan Organisasi</h1>
            <form action={formAction} className="max-w-xl p-6 bg-gray-800 border border-gray-700 rounded-lg shadow space-y-6">
                 <div>
                    <label htmlFor="org_name" className="block mb-2 text-sm font-medium text-white">Nama Organisasi</label>
                    <input type="text" name="org_name" id="org_name" defaultValue={organization?.name || ''} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5" />
                </div>
                <div>
                    <label htmlFor="logo" className="block mb-2 text-sm font-medium text-white">Logo Organisasi</label>
                    {organization?.logo_url && <img src={organization.logo_url} alt="Logo saat ini" className="w-32 h-auto mb-4 bg-gray-600 p-2 rounded" />}
                    <input type="file" name="logo" id="logo" accept="image/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white" />
                </div>
                <SubmitButton text="Simpan Pengaturan" pendingText="Menyimpan..."/>
            </form>
        </main>
    );
}