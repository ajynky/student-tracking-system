'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
    role: string;
}

const studentLinks = [
    { label: 'Dashboard', href: '/student' },
    { label: 'My Grades', href: '/student/grades' },
    { label: 'Attendance', href: '/student/attendance' },
    { label: 'Assignments', href: '/student/assignments' },
];

const teacherLinks = [
    { label: 'Dashboard', href: '/teacher' },
    { label: 'Mark Attendance', href: '/teacher/attendance' },
    { label: 'Grades', href: '/teacher/grades' },
    { label: 'Assignments', href: '/teacher/assignments' },
];

const adminLinks = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Classes', href: '/admin/classes' },
    { label: 'Reports', href: '/admin/reports' },
];

export default function Sidebar({ role }: SidebarProps) {
    const router = useRouter();

    const links = role === 'ADMIN'
        ? adminLinks
        : role === 'TEACHER'
            ? teacherLinks
            : studentLinks;

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
            <div className="mb-8">
                <h2 className="text-lg font-bold text-white">
                    Student Tracking
                </h2>
                <p className="text-gray-400 text-sm">{role}</p>
            </div>

            <nav className="space-y-1">
                {links.map((link) => (
                    <button
                        key={link.href}
                        onClick={() => router.push(link.href)}
                        className="w-full text-left px-3 py-2 rounded-md text-gray-300
              hover:bg-gray-700 hover:text-white transition-colors text-sm"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}