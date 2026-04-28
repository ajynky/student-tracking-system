'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalClasses: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [studentsRes, classesRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes')
                ]);

                setStats({
                    totalStudents: studentsRes.data.totalElements || 0,
                    totalClasses: classesRes.data.length || 0,
                    totalUsers: 0
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Welcome Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Manage your institution
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm font-medium">
                            Total Students
                        </p>
                        <p className="text-2xl font-bold text-blue-800 mt-1">
                            {loading ? '...' : stats.totalStudents}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-600 text-sm font-medium">
                            Total Classes
                        </p>
                        <p className="text-2xl font-bold text-green-800 mt-1">
                            {loading ? '...' : stats.totalClasses}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-600 text-sm font-medium">
                            System Status
                        </p>
                        <p className="text-2xl font-bold text-purple-800 mt-1">
                            Active
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Manage Users</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            View and manage all users
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/admin/classes')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Manage Classes</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Create and manage classes
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/admin/reports')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Reports</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            View attendance and grade reports
                        </p>
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}