"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function duplicateElection(electionId: number) {
    const supabase = createServerActionClient({ cookies });

    // 1. Ambil data pemilu asli dan kandidatnya
    const { data: originalElection, error: electionError } = await supabase
        .from('elections')
        .select('*, candidates(*)')
        .eq('id', electionId)
        .single();

    if (electionError) return { error: `Gagal menemukan pemilu asli: ${electionError.message}` };

    // 2. Buat data pemilu baru
    const { candidates, id, created_at, ...newElectionData } = originalElection;
    newElectionData.name = `(DUPLIKAT) ${newElectionData.name}`;
    newElectionData.status = 'draft'; // Selalu set duplikat sebagai draft

    const { data: newElection, error: newElectionError } = await supabase
        .from('elections')
        .insert(newElectionData)
        .select()
        .single();

    if (newElectionError) return { error: `Gagal membuat duplikat pemilu: ${newElectionError.message}` };

    // 3. Buat duplikat kandidat untuk pemilu baru
    if (candidates && candidates.length > 0) {
        const newCandidates = candidates.map(c => {
            const { id, election_id, created_at, ...candidateData } = c;
            return { ...candidateData, election_id: newElection.id, organization_id: newElection.organization_id };
        });
        const { error: newCandidatesError } = await supabase.from('candidates').insert(newCandidates);
        if (newCandidatesError) return { error: `Gagal duplikasi kandidat: ${newCandidatesError.message}` };
    }

    revalidatePath('/super/elections');
    return { success: 'Pemilu berhasil diduplikasi.' };
}

export async function updateElectionStatus(electionId: number, status: string) {
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.from('elections').update({ status }).eq('id', electionId);
    if (error) return { error: `Gagal update status: ${error.message}` };
    
    revalidatePath('/super/elections');
    return { success: 'Status berhasil diubah.' };
}