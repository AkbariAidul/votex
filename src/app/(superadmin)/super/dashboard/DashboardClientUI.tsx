// src/app/(superadmin)/super/dashboard/DashboardClientUI.tsx
"use client";

import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Building2, GanttChartSquare, Users } from 'lucide-react'; // Import ikon

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardProps {
    stats: {
        orgCount: number;
        electionCount: number;
        userCount: number; // Pastikan ini sudah benar
    };
    chartData: {
        labels: string[];
        values: number[];
    };
}

export default function DashboardClientUI({ stats, chartData }: DashboardProps) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Jumlah',
                data: chartData.values,
                backgroundColor: 'rgba(34,211,238,0.6)', // cyan-400 with opacity
                borderColor: 'rgba(34,211,238,1)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Statistik Pemilihan',
                color: '#fff',
                font: { size: 18 },
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255,255,255,0.1)' },
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#fff' },
                grid: { color: 'rgba(255,255,255,0.1)' },
            },
        },
    };

    return (
        <main className="container mx-auto p-4 sm:p-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-8 text-white"
            >
                👋 Selamat Datang, Super Admin!
            </motion.h1>

            {/* Stat Cards yang diperbarui */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Card Organisasi */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                        <div className="p-3 mr-4 bg-gray-900 rounded-lg">
                            <Building2 className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total Organisasi</p>
                            <h5 className="text-2xl font-bold tracking-tight text-white">{stats.orgCount}</h5>
                        </div>
                    </div>
                </motion.div>
                {/* Card Pemilihan */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                     <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                         <div className="p-3 mr-4 bg-gray-900 rounded-lg">
                            <GanttChartSquare className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total Pemilihan</p>
                            <h5 className="text-2xl font-bold tracking-tight text-white">{stats.electionCount}</h5>
                        </div>
                    </div>
                </motion.div>
                 {/* Card Pemilih */}
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
                     <div className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
                        <div className="p-3 mr-4 bg-gray-900 rounded-lg">
                            <Users className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400">Total Pemilih</p>
                            <h5 className="text-2xl font-bold tracking-tight text-white">{stats.userCount}</h5>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Chart Section */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow">
                     <Bar options={options} data={data} />
                </div>
            </motion.div>
        </main>
    );
}