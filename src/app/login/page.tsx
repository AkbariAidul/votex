import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm'; // Import komponen form dari file yang kita rename

export default async function LoginPageServer() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    // Jika sesi SUDAH ADA saat user mencoba mengakses halaman login...
    if (session) {
        // ...lakukan "smart redirect" di sini, di sisi server.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            switch (profile.role) {
                case 'superadmin':
                    redirect('/super/dashboard');
                    break; // break ditambahkan untuk best practice
                case 'admin':
                    redirect('/admin/dashboard');
                    break;
                default:
                    redirect('/dashboard');
                    break;
            }
        } else {
             redirect('/dashboard'); // Fallback jika profil tidak ditemukan
        }
    }

    // Jika TIDAK ADA sesi, maka tampilkan komponen form login
    return <LoginForm />;
}