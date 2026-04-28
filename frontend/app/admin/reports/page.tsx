'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';

export default function AdminReports() {
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [attendanceReport, setAttendanceReport] = useState<any>(null);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, classesRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes')
                ]);
                const studentList = studentsRes.data.content || studentsRes.data;
                const classList = classesRes.data.content || classesRes.data; // ← fix
                setStudents(studentList);
                setClasses(classList);                                         // ← fix
                if (studentList.length > 0) {
                    setSelectedStudent(studentList[0].id);
                }
                if (classList.length > 0) {
                    setSelectedClass(classList[0].id);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const fetchReport = async () => {
        if (!selectedStudent || !selectedClass) return;
        setLoading(true);
        try {
            const [attendanceRes, gradesRes] = await Promise.all([
                api.get(`/attendance/student/${selectedStudent}/class/${selectedClass}/percentage`),
                api.get(`/grades/student/${selectedStudent}`)
            ]);
            setAttendanceReport(attendanceRes.data);
            setGrades(gradesRes.data);
        } catch (err) {
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Select Student</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            >
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Select Class</label>
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
                        <div className="flex items-end">
                            <button
                                onClick={fetchReport}
                                className="w-full bg-blue-600 text-white px-4 py-2
                  rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Report */}
                {attendanceReport && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Attendance Report
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-gray-500 text-xs">Total Days</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {attendanceReport.totalDays}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-green-600 text-xs">Present</p>
                                <p className="text-xl font-bold text-green-800">
                                    {attendanceReport.presentDays}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                <p className="text-red-600 text-xs">Absent</p>
                                <p className="text-xl font-bold text-red-800">
                                    {attendanceReport.absentDays}
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-blue-600 text-xs">Attendance %</p>
                                <p className="text-xl font-bold text-blue-800">
                                    {attendanceReport.attendancePercentage}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grades Report */}
                {grades.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Grades Report</h3>
                        </div>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {grades.map((grade) => (
                                    <tr key={grade.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {grade.subject}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium
                      text-gray-800">{grade.score}</td>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}