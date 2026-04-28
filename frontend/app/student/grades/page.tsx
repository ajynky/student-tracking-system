'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';

export default function StudentGrades() {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            const studentId = getCookie('studentId');
            if (!studentId) return;

            try {
                const response = await api.get(
                    `/grades/student/${studentId}/published`
                );
                setGrades(response.data);
            } catch (err) {
                console.error('Error fetching grades:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">My Grades</h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : grades.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No grades published yet
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase">Semester</th>
                                <th className="px-6 py-3 text-left text-xs font-medium
                  text-gray-500 uppercase">Published</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {grades.map((grade) => (
                                <tr key={grade.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {grade.subject}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${grade.score >= 75
                                                ? 'text-green-600'
                                                : grade.score >= 50
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}>
                                            {grade.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {grade.semester}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(grade.publishedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}