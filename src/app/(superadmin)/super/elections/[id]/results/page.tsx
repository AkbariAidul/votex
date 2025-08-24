import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ResultsClientUI from './ResultsClientUI';

async function getElectionResults(supabase: any, electionId: string) {
    const { data: election, error: electionError } = await supabase
        .from('elections')
        .select('*, organizations(name)')
        .eq('id', electionId)
        .single();
    if (electionError) throw new Error("Pemilu tidak ditemukan.");

    const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('id, name')
        .eq('election_id', electionId);
    if (candidatesError) throw new Error("Gagal mengambil kandidat.");

    const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('election_id', electionId);
    if (votesError) throw new Error("Gagal mengambil suara.");

    const results = candidates.map(candidate => {
        const voteCount = votes.filter(v => v.candidate_id === candidate.id).length;
        return { name: candidate.name, votes: voteCount };
    });

    return { election, results };
}

export default async function ElectionResultsPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    try {
        const { election, results } = await getElectionResults(supabase, params.id);
        return <ResultsClientUI initialElection={election} initialResults={results} />;
    } catch (error: any) {
        return <p className="p-8 text-red-500">{error.message}</p>;
    }
}