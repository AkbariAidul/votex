import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { election_id, subject, message } = await req.json();
    if(!election_id || !subject || !message) throw new Error("Data tidak lengkap.");

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // 1. Ambil semua email pemilih yang terdaftar di pemilu ini
    const { data: voters, error: votersError } = await supabaseAdmin
      .from('eligible_voters')
      .select('profiles(email)')
      .eq('election_id', election_id);
    if (votersError) throw votersError;

    const recipientEmails = voters.map(v => v.profiles.email);

    // 2. Kirim email menggunakan Resend (contoh - perlu setup API Key)
    // Supabase merekomendasikan provider email pihak ketiga seperti Resend/Sendgrid
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}` // Simpan API Key di Supabase Secrets
      },
      body: JSON.stringify({
        from: 'Votex <noreply@yourdomain.com>', // Ganti dengan domainmu
        to: recipientEmails,
        subject: subject,
        html: `<p>${message}</p>`
      }),
    });

    if(!res.ok) {
        const errorBody = await res.json();
        throw new Error(JSON.stringify(errorBody));
    }

    return new Response(JSON.stringify({ message: 'Notifikasi berhasil dikirim.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    })
  }
})