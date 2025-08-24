"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, UserCheck, GanttChartSquare, History, Settings, DatabaseBackup } from 'lucide-react';

const navLinks = [
    { name: 'Dashboard', href: '/super/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Organisasi', href: '/super/organizations', icon: Building2 },
    { name: 'Manajemen Admin', href: '/super/admins', icon: Users },
    { name: 'Manajemen Pemilih', href: '/super/users', icon: UserCheck },
    { name: 'Manajemen Pemilu', href: '/super/elections', icon: GanttChartSquare },
    { name: 'Activity Log', href: '/super/logs', icon: History },
    { name: 'Pengaturan', href: '/super/settings', icon: Settings },
    { name: 'Backup', href: '/super/backup', icon: DatabaseBackup },
];

export default function SidebarLinks() {
    const pathname = usePathname();
    return (
        <ul className="space-y-2 font-medium">
            {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
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