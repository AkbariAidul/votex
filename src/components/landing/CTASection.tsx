"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section id="kontak" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Siap Mengadakan Pemilu yang Lebih Baik?</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Platform Votex saat ini tersedia gratis untuk organisasi kampus. Daftarkan organisasimu sekarang.
                    </p>
                    <div className="mt-8">
                        <Link href="/login" className="px-8 py-3 text-lg font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
                            Mulai Sekarang
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}