"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    { quote: "Votex mengubah cara kami mengadakan pemilu. Prosesnya jadi 90% lebih cepat dan tingkat partisipasi mahasiswa meroket!", name: "Ahmad Subarjo", role: "Ketua BEM Polihasnur 2024" },
    { quote: "Sebagai panitia, kami tidak perlu lagi pusing menghitung suara manual. Semuanya transparan dan hasilnya bisa dilihat real-time. Luar biasa!", name: "Citra Lestari", role: "Ketua KPU Mahasiswa" },
];

export default function TestimonialSection() {
    return (
        <section id="tentang" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Dipercaya oleh Organisasi Mahasiswa</h2>
                </motion.div>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-gray-800 p-8 rounded-lg border border-gray-700"
                        >
                            <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                            <div className="mt-6 flex items-center">
                                <div>
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-cyan-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}