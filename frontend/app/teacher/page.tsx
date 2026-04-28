'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getCookie } from '../lib/cookies';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
    const router = useRouter();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const userId = getCookie('userId');
            if (!userId) return;

            try {
                const response = await api.get(`/classes/teacher/${userId}`);
                setClasses(response.data);
            } catch (err) {
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Welcome Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Teacher Dashboard
                    </h2>
                    <p className="text-gray-500 mt-1">
                        You have {classes.length} class(es) assigned
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm font-medium">My Classes</p>
                        <p className="text-2xl font-bold text-blue-800 mt-1">
                            {classes.length}
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/teacher/attendance')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Mark Attendance</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Mark attendance for your classes
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/teacher/grades')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Manage Grades</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Add and publish student grades
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/teacher/assignments')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Assignments</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Create and manage assignments
                        </p>
                    </button>
                </div>

                {/* Classes List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">My Classes</h3>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : classes.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No classes assigned yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {classes.map((cls) => (
                                <div key={cls.id} className="p-4 flex items-center
                  justify-between">
                                    <span className="text-gray-800 font-medium">{cls.name}</span>
                                    <button
                                        onClick={() => router.push('/teacher/attendance')}
                                        className="text-blue-600 text-sm hover:text-blue-800"
                                    >
                                        Mark Attendance →
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}