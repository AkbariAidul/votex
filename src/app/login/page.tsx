import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPageServer() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile) {
            // PERBAIKAN LOGIKA REDIRECT DI SINI JUGA
            switch (profile.role) {
                case 'superadmin': 
                    redirect('/super/dashboard'); 
                    break;
                case 'admin': 
                    redirect('/admin/dashboard'); 
                    break;
                case 'user':
                    redirect('/'); // Jika user sudah login, arahkan ke landing page
                    break;
                default: 
                    redirect('/'); 
                    break;
            }
        } else {
             redirect('/'); // Fallback jika profil tidak ditemukan
        }
    }

    return <LoginForm />;
}