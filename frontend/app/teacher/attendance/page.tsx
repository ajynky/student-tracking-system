'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';
import { getToken } from '../../lib/api';

export default function TeacherAttendance() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch teacher classes on load
    useEffect(() => {
        const fetchClasses = async () => {
            const token = getToken();
            if (!token) return;
            const userId = getCookie('userId');
            if (!userId) return;

            try {
                const response = await api.get(`/classes/teacher/${userId}`);
                setClasses(response.data);
                if (response.data.length > 0) {
                    setSelectedClass(response.data[0].id);
                }
            } catch (err) {
                console.error('Error fetching classes:', err);
            }
        };

        fetchClasses();
    }, []);

    // Fetch students when class changes
    useEffect(() => {
        if (!selectedClass) return;

        const fetchStudents = async () => {
            const token = getToken();
            if (!token) return;
            setLoading(true);
            try {
                const response = await api.get(`/students/class/${selectedClass}`);
                setStudents(response.data);

                // Default all to PRESENT
                const defaultAttendance: { [key: string]: string } = {};
                response.data.forEach((student: any) => {
                    defaultAttendance[student.id] = 'PRESENT';
                });
                setAttendance(defaultAttendance);
            } catch (err) {
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [selectedClass]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage('');

        const userId = getCookie('userId');

        try {
            const records = students.map(student => ({
                studentId: student.id,
                status: attendance[student.id] || 'PRESENT',
                studentName: student.name,
            }));

            await api.post('/attendance/mark-bulk', {
                classId: selectedClass,
                date: selectedDate,
                markedBy: userId,
                records
            });

            setMessage('Attendance marked successfully!');
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Mark Attendance
                    </h2>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            >
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            Students ({students.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : students.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No students in this class
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {students.map((student) => (
                                <div key={student.id} className="p-4 flex items-center
                  justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{student.name}</p>
                                        <p className="text-gray-500 text-sm">
                                            Roll: {student.rollNo}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {['PRESENT', 'ABSENT', 'LATE'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(student.id, status)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium
                          transition-colors ${attendance[student.id] === status
                                                        ? status === 'PRESENT'
                                                            ? 'bg-green-500 text-white'
                                                            : status === 'ABSENT'
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-yellow-500 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    {students.length > 0 && (
                        <div className="p-6 border-t border-gray-200">
                            {message && (
                                <p className={`mb-4 text-sm ${message.includes('success')
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}>
                                    {message}
                                </p>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md
                  hover:bg-blue-700 disabled:opacity-50
                  disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}