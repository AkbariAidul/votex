// Komponen ini akan menggunakan data dummy untuk saat ini
// Nantinya bisa dihubungkan ke database atau CMS

const dummyNews = [
    { id: 1, title: "Votex Resmi Diluncurkan untuk Pemilihan Kampus", excerpt: "Platform e-voting baru ini menjanjikan proses yang lebih efisien dan transparan bagi organisasi mahasiswa.", category: "Peluncuran Produk", date: "24 Agu 2025" },
    { id: 2, title: "Keamanan Data Menjadi Prioritas Utama di Votex", excerpt: "Dengan enkripsi end-to-end dan arsitektur modern, Votex memastikan setiap suara aman dan rahasia.", category: "Teknologi", date: "22 Agu 2025" },
    { id: 3, title: "Studi Kasus: BEM ULM Sukses Gelar Pemilu dengan 95% Partisipasi", excerpt: "Tingkat partisipasi pemilih meningkat drastis setelah BEM ULM beralih menggunakan platform digital Votex.", category: "Studi Kasus", date: "20 Agu 2025" },
];

export default function NewsSection() {
    return (
        <section id="berita" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Berita & Informasi</h2>
                    <p className="text-lg text-gray-400 mt-2">Update terbaru dari dunia Votex.</p>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {dummyNews.map(news => (
                        <article key={news.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <div className="p-6 flex-grow">
                                <span className="text-xs font-semibold text-cyan-400 uppercase">{news.category}</span>
                                <h3 className="mt-2 text-xl font-bold text-white hover:text-cyan-400 transition-colors">
                                    <a href="#">{news.title}</a>
                                </h3>
                                <p className="mt-3 text-sm text-gray-400">{news.excerpt}</p>
                            </div>
                             <div className="px-6 pb-4 text-xs text-gray-500">
                                <span>{news.date}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}