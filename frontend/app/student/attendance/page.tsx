'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';
import { getToken } from '../../lib/api';

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            const token = getToken();
            if (!token) { setLoading(false); return; }
            const studentId = getCookie('studentId');
            if (!studentId) { setLoading(false); return; }

            try {
                const response = await api.get(
                    `/attendance/student/${studentId}`
                );
                setAttendance(response.data);
            } catch (err) {
                console.error('Error fetching attendance:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;
    const percentage = attendance.length > 0
        ? (((present + late) / attendance.length) * 100).toFixed(1)
        : '0';

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Days</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {loading ? '...' : attendance.length}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-600 text-sm">Present</p>
                        <p className="text-2xl font-bold text-green-800">
                            {loading ? '...' : present}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-red-600 text-sm">Absent</p>
                        <p className="text-2xl font-bold text-red-800">
                            {loading ? '...' : absent}
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm">Attendance %</p>
                        <p className="text-2xl font-bold text-blue-800">
                            {loading ? '...' : `${percentage}%`}
                        </p>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Attendance History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : attendance.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No attendance records found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {attendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs
                        font-medium ${record.status === 'PRESENT'
                                                    ? 'bg-green-100 text-green-700'
                                                    : record.status === 'ABSENT'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}