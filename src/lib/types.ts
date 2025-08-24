export type Election = {
  id: number;
  created_at: string;
  name: string;
  description: string | null; // Bisa string atau null
  start_date: string;
  end_date: string;
};  

export type Candidate = {
    id: number;
    name: string;
    vision: string | null;
    mission: string | null;
    photo_url: string | null;
};