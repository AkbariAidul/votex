// supabase/functions/cast-vote/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Buat client dengan hak akses user yang memanggil fungsi ini
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Dapatkan data user dari token-nya
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const { election_id, candidate_id } = await req.json();
    if (!election_id || !candidate_id) throw new Error("Election and Candidate ID are required.");

    // Buat Admin client untuk melakukan operasi database
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Panggil fungsi 'record_vote' di database (ini akan kita buat)
    // Ini memastikan kedua operasi (insert vote & update status) terjadi bersamaan atau tidak sama sekali
    const { error: rpcError } = await supabaseAdmin.rpc('record_vote', {
      p_election_id: election_id,
      p_candidate_id: candidate_id,
      p_voter_id: user.id
    });

    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ message: "Vote cast successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})