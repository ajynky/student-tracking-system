'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getCookie } from '../lib/cookies';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const router = useRouter();
    const [studentData, setStudentData] = useState<any>(null);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const studentId = getCookie('studentId');

            if (!studentId) {
                setLoading(false);
                return;
            }

            try {
                const [studentRes, gradesRes] = await Promise.all([
                    api.get(`/students/${studentId}`),
                    api.get(`/grades/student/${studentId}/published`)
                ]);

                setStudentData(studentRes.data);
                setGrades(gradesRes.data);
            } catch (err) {
                console.error('Error fetching student data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Welcome Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome, {studentData?.name || 'Student'}!
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Roll No: {studentData?.rollNo || 'N/A'}
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm font-medium">Total Grades</p>
                        <p className="text-2xl font-bold text-blue-800 mt-1">
                            {grades.length}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-600 text-sm font-medium">Average Score</p>
                        <p className="text-2xl font-bold text-green-800 mt-1">
                            {grades.length > 0
                                ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-600 text-sm font-medium">Subjects</p>
                        <p className="text-2xl font-bold text-purple-800 mt-1">
                            {new Set(grades.map(g => g.subject)).size}
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/student/grades')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">My Grades</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            View all your grades
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/student/attendance')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Attendance</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Check your attendance
                        </p>
                    </button>
                    <button
                        onClick={() => router.push('/student/assignments')}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md
              transition-shadow text-left"
                    >
                        <h3 className="font-medium text-gray-800">Assignments</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            View and submit assignments
                        </p>
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}