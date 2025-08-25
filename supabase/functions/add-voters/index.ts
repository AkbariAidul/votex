import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { election_id, voters, organization_id } = await req.json(); // Admin harus mengirimkan org_id nya juga
    if (!election_id || !voters || !organization_id) {
      throw new Error("Data tidak lengkap.");
    }

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    for (const voter of voters) {
      if (!voter.email || !voter.identifier_type || !voter.identifier_value) continue;

      let { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(voter.email);
      
      if (!userData.user) {
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(voter.email);
        if (inviteError) { console.warn(`Gagal undang ${voter.email}:`, inviteError.message); continue; }
        userData.user = newUser.user;
        
        // Buat profil HANYA saat user baru pertama kali diundang
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: userData.user.id,
            email: voter.email,
            role: 'user',
            identifier_type: voter.identifier_type,
            identifier_value: voter.identifier_value,
            organization_id: organization_id
        });
        if(profileError) console.error(`Gagal buat profil ${voter.email}:`, profileError.message);

      } else {
         // Jika user sudah ada, cukup update profilnya (jika perlu)
         const { error: profileError } = await supabaseAdmin.from('profiles').update({
            identifier_type: voter.identifier_type,
            identifier_value: voter.identifier_value,
            organization_id: organization_id
         }).eq('id', userData.user.id);
         if(profileError) console.error(`Gagal update profil ${voter.email}:`, profileError.message);
      }
      
      // Daftarkan ke pemilihan
      const { error: upsertError } = await supabaseAdmin.from('eligible_voters').upsert({
          election_id: election_id,
          user_id: userData.user.id,
          organization_id: organization_id
      }, { onConflict: 'election_id,user_id' });
      if (upsertError) console.error(`Gagal daftar pemilih ${voter.email}:`, upsertError.message);
    }

    return new Response(JSON.stringify({ message: 'Proses pendaftaran pemilih selesai!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    })
  }
})