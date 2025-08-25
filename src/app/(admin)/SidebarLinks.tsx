"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GanttChartSquare, Users, BarChart3, UserCircle } from 'lucide-react';

const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Pemilihan', href: '/admin/elections', icon: GanttChartSquare },
    { name: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
    { name: 'Hasil & Analitik', href: '/admin/results', icon: BarChart3 },
    { name: 'Profil Saya', href: '/profile', icon: UserCircle },
];

export default function SidebarLinks() {
    const pathname = usePathname();
    return (
        <ul className="space-y-2 font-medium">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className={`flex items-center p-2 rounded-lg text-white group ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                        >
                            <link.icon className={`w-5 h-5 transition duration-75 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className="ms-3">{link.name}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}