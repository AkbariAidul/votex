import { DatabaseBackup } from "lucide-react";

export default function BackupPage() {
    // Dapatkan Project ID dari environment variable untuk membuat link
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].split('//')[1];
    const backupLink = `https://supabase.com/dashboard/project/${projectId}/database/backups`;

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <DatabaseBackup /> Backup & Restore
            </h1>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow space-y-4 text-gray-300">
                <h2 className="text-xl font-semibold text-white">Kebijakan Backup Supabase</h2>
                <p>
                    Platform Votex menggunakan Supabase sebagai penyedia database. Sesuai dengan kebijakan Supabase, database untuk proyekmu secara otomatis di-backup setiap hari.
                </p>
                <p>
                    Backup ini mencakup semua data di dalam database-mu, termasuk organisasi, pemilihan, kandidat, pemilih, dan hasil suara.
                </p>

                <h2 className="text-xl font-semibold text-white mt-4">Akses Backup</h2>
                <p>
                    Kamu bisa melihat, mengelola, dan me-restore backup historis langsung dari dashboard Supabase. Fitur Point-in-Time Recovery (PITR) juga tersedia di paket berbayar untuk restore ke titik waktu yang lebih spesifik.
                </p>
                
                <a 
                    href={backupLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Buka Dashboard Backup Supabase
                </a>
            </div>
        </main>
    );
}