// supabase/functions/add-voters/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Definisikan tipe untuk data yang kita terima
interface Voter {
  email: string
}

Deno.serve(async (req) => {
  // Menangani preflight request untuk CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { election_id, voters } = await req.json()
    if (!election_id || !voters) {
      throw new Error("Election ID and voters list are required.")
    }

    // Buat Admin client yang punya hak akses tinggi
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Proses setiap pemilih dalam daftar
    for (const voter of voters) {
      if (!voter.email) continue;

      // Cek apakah user sudah ada
      let { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', voter.email)
        .single()
      
      // Jika user belum ada, undang mereka. Supabase akan mengirim email invite.
      if (!userData) {
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(voter.email);
        if (inviteError) {
          console.warn(`Could not invite user ${voter.email}:`, inviteError.message);
          continue; // Lanjut ke email berikutnya jika gagal
        }
        userData = newUser.user;
      }
      
      // Daftarkan user ke pemilihan di tabel 'eligible_voters'
      // 'upsert' akan mencegah duplikat jika user sudah terdaftar sebelumnya
      const { error: upsertError } = await supabaseAdmin
        .from('eligible_voters')
        .upsert({
          election_id: election_id,
          user_id: userData.id,
          has_voted: false
        }, { onConflict: 'election_id,user_id' }); // Kunci unik untuk mencegah duplikat

      if (upsertError) {
        console.error(`Failed to upsert voter ${voter.email}:`, upsertError.message);
      }
    }

    return new Response(JSON.stringify({ message: 'Voters processed successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})