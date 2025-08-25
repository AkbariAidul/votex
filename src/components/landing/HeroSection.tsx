export default function HeroSection() {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center text-center bg-gray-900 overflow-hidden">
             <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
             <div className="relative z-10 px-4">
                {/* Ukuran teks lebih kecil di mobile, lebih besar di desktop */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white">
                    Demokrasi Digital, <br /> <span className="text-cyan-400">Mudah & Terpercaya</span>
                </h1>
                <p className="max-w-xl md:max-w-2xl mx-auto mt-6 text-base sm:text-lg text-gray-300">
                    Votex adalah platform e-voting modern yang dirancang untuk menyederhanakan proses pemilihan di organisasi Anda, dari kampus hingga komunitas.
                </p>
                {/* Tombol akan menumpuk di mobile dan berdampingan di desktop */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <a href="#pemilihan" className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
                        Lihat Pemilihan Aktif
                    </a>
                    <a href="#kontak" className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600">
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </section>
    );
}