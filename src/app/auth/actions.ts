"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Fungsi login utama yang baru
export async function smartLogin(previousState: any, formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const identifier = formData.get('identifier')?.toString();
    const password = formData.get('password')?.toString(); // Bisa jadi null

    if (!identifier) return { error: 'Input tidak boleh kosong.' };

    // Skenario 1: Login Admin / Super Admin (dengan password)
    if (identifier.includes('@')) {
        if (!password) return { error: 'Password harus diisi untuk login via email.' };

        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
            email: identifier,
            password: password,
        });

        if (signInError) return { error: 'Email atau Password salah.' };
        
        if (session) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile?.role === 'superadmin') redirect('/super/dashboard');
            if (profile?.role === 'admin') redirect('/admin/dashboard');
        }
        // Jika rolenya 'user' atau tidak terduga, tendang ke dashboard biasa
        redirect('/dashboard');
    } 
    // Skenario 2: Login Pemilih (tanpa password, via Magic Link)
    else {
        const { data: profileData } = await supabase.from('profiles').select('email').eq('identifier_value', identifier).single();
        if (!profileData) return { error: 'ID (NIM/NIDN/NIK) tidak terdaftar.' };

        const { error } = await supabase.auth.signInWithOtp({
            email: profileData.email,
            options: {
                shouldCreateUser: false,
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });

        if (error) return { error: `Gagal mengirim link: ${error.message}` };
        
        return { success: `Link login telah dikirim ke email yang terhubung dengan ID Anda. Silakan periksa inbox.` };
    }
}

// ... (fungsi logout tetap sama)
export async function logout() {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}