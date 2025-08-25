"use client";
// PERBAIKAN: Tambahkan 'Building2' ke dalam daftar import
import { ShieldCheck, BarChart3, Users, Clock, Zap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { icon: ShieldCheck, title: "Keamanan Terjamin", description: "Setiap suara dienkripsi dan dicatat secara aman, menjamin integritas dan kerahasiaan hasil pemilihan." },
    { icon: BarChart3, title: "Hasil Real-Time", description: "Pantau perolehan suara secara langsung. Super Admin dan Admin bisa melihat statistik pemilu saat voting berlangsung." },
    { icon: Users, title: "Manajemen Fleksibel", description: "Kelola berbagai jenis pemilih (NIM, NIDN, NIK) dengan mudah melalui sistem impor CSV yang efisien." },
    { icon: Clock, title: "Setup Cepat", description: "Buat dan konfigurasikan event pemilihan baru hanya dalam hitungan menit melalui panel admin yang intuitif." },
    { icon: Zap, title: "Antarmuka Modern", description: "Pengalaman memilih yang cepat, responsif, dan mudah diakses dari perangkat apa pun, baik desktop maupun mobile." },
    { icon: Building2, title: "Multi-Organisasi", description: "Didesain untuk skalabilitas, Votex bisa menangani banyak organisasi klien dalam satu platform terpusat." },
];

export default function FeaturesSection() {
    return (
        <section id="fitur" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Kenapa Memilih Votex?</h2>
                    <p className="text-lg text-gray-400 mt-2">Platform e-voting dengan semua fitur yang Anda butuhkan.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-900 p-6 rounded-lg border border-gray-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-700 p-3 rounded-full">
                                    <feature.icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                            </div>
                            <p className="mt-4 text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}