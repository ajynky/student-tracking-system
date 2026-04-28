'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const getCookie = (name: string) => {
            return document.cookie
                .split('; ')
                .find(row => row.startsWith(`${name}=`))
                ?.split('=')[1] || '';
        };

        setRole(getCookie('role'));
        setEmail(getCookie('email'));
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col">
                <TopBar email={email} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}