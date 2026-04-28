'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';

export default function TeacherGrades() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        studentId: '',
        subject: '',
        score: '',
        semester: '',
        publish: false
    });

    useEffect(() => {
        const fetchClasses = async () => {
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

    useEffect(() => {
        if (!selectedClass) return;
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/students/class/${selectedClass}`);
                setStudents(response.data);
                if (response.data.length > 0) {
                    setForm(prev => ({ ...prev, studentId: response.data[0].id }));
                    fetchGrades(response.data[0].id);
                }
            } catch (err) {
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [selectedClass]);

    const fetchGrades = async (studentId: string) => {
        try {
            const response = await api.get(`/grades/student/${studentId}`);
            setGrades(response.data);
        } catch (err) {
            console.error('Error fetching grades:', err);
        }
    };

    const handleStudentChange = (studentId: string) => {
        setForm(prev => ({ ...prev, studentId }));
        fetchGrades(studentId);
    };

    const handleAddGrade = async () => {
        setMessage('');
        try {
            await api.post('/grades', {
                studentId: form.studentId,
                subject: form.subject,
                score: parseFloat(form.score),
                semester: form.semester,
                publish: form.publish
            });
            setMessage('Grade added successfully!');
            setForm(prev => ({ ...prev, subject: '', score: '', semester: '' }));
            fetchGrades(form.studentId);
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to add grade');
        }
    };

    const handlePublish = async (gradeId: string) => {
        try {
            await api.put(`/grades/${gradeId}/publish`);
            setMessage('Grade published successfully!');
            fetchGrades(form.studentId);
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to publish grade');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Manage Grades
                    </h2>
                </div>

                {/* Class and Student Selector */}
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
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Student
                            </label>
                            <select
                                value={form.studentId}
                                onChange={(e) => handleStudentChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            >
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.rollNo})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Add Grade Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">Add Grade</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, subject: e.target.value }))}
                                placeholder="e.g. Mathematics"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Score
                            </label>
                            <input
                                type="number"
                                value={form.score}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, score: e.target.value }))}
                                placeholder="0 - 100"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Semester
                            </label>
                            <input
                                type="text"
                                value={form.semester}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, semester: e.target.value }))}
                                placeholder="e.g. SEM1"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.publish}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, publish: e.target.checked }))}
                                className="rounded"
                            />
                            Publish immediately
                        </label>
                        <button
                            onClick={handleAddGrade}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md
                hover:bg-blue-700 transition-colors text-sm"
                        >
                            Add Grade
                        </button>
                    </div>

                    {message && (
                        <p className={`mt-3 text-sm ${message.includes('success')
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            Grades for Selected Student
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : grades.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No grades found
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
                    text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {grades.map((grade) => (
                                    <tr key={grade.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {grade.subject}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium
                      text-gray-800">
                                            {grade.score}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {grade.semester}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs
                        font-medium ${grade.publishedAt
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {grade.publishedAt ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {!grade.publishedAt && (
                                                <button
                                                    onClick={() => handlePublish(grade.id)}
                                                    className="text-blue-600 text-sm hover:text-blue-800"
                                                >
                                                    Publish
                                                </button>
                                            )}
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