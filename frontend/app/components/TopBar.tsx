'use client';

import { useRouter } from 'next/navigation';

interface TopBarProps {
    email: string;
}

export default function TopBar({ email }: TopBarProps) {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = 'token=; path=/; max-age=0';
        document.cookie = 'role=; path=/; max-age=0';
        document.cookie = 'email=; path=/; max-age=0';
        document.cookie = 'userId=; path=/; max-age=0';
        document.cookie = 'studentId=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-3
      flex items-center justify-between">
            <h1 className="text-gray-800 font-medium">
                Student Tracking System
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm">{email}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700
            transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}