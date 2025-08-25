"use client";
import { useActionState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { smartLogin } from "../auth/actions";
import Image from "next/image";

function SubmitButton({ isEmail }: { isEmail: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500">
            {pending ? 'Memproses...' : (isEmail ? 'Login' : 'Kirim Link Login')}
        </button>
    );
}

export default function LoginForm() {
    const [state, formAction] = useActionState(smartLogin, null);
    const [identifier, setIdentifier] = useState('');
    const isEmail = identifier.includes('@');

    // Reset form jika sukses mengirim link
    const formRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="flex justify-center">
                    <Image src="/votex-logo.jpg" alt="Votex Logo" width={150} height={50} priority className="h-auto"/>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Login Votex</h1>
                    <p className="text-gray-400 mt-1">{isEmail ? 'Login sebagai Admin / Super Admin' : 'Login sebagai Pemilih'}</p>
                </div>
                
                <form ref={formRef} action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="identifier" className="block mb-2 text-sm font-medium text-gray-300">NIM / Email</label>
                        <input 
                            type="text" 
                            name="identifier" 
                            id="identifier" 
                            className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5" 
                            placeholder="Masukkan NIM atau Email Anda" 
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    {/* Kolom password hanya muncul jika input adalah email */}
                    {isEmail && (
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-700 border border-gray-600 text-white rounded-lg block w-full p-2.5" 
                                required 
                            />
                        </div>
                    )}
                    
                    {state?.error && <div className="p-3 text-center text-sm text-red-400 bg-red-900/50 rounded-lg">{state.error}</div>}
                    {state?.success && <div className="p-3 text-center text-sm text-green-400 bg-green-900/50 rounded-lg">{state.success}</div>}
                    
                    <SubmitButton isEmail={isEmail} />
                </form>
            </div>
        </div>
    );
}