'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';
import { getToken } from '../../lib/api';

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [classId, setClassId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            if (!token) return;
            const studentId = getCookie('studentId');
            if (!studentId) return;

            try {
                // Get student to find classId
                const studentRes = await api.get(`/students/${studentId}`);
                const cId = studentRes.data.classId;
                setClassId(cId);

                const [assignRes, subRes] = await Promise.all([
                    api.get(`/assignments/class/${cId}`),
                    api.get(`/assignments/submissions/student/${studentId}`)
                ]);

                setAssignments(assignRes.data);
                setSubmissions(subRes.data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const isSubmitted = (assignmentId: string) => {
        return submissions.some(s => s.assignmentId === assignmentId);
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Assignments
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : assignments.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No assignments found
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {assignment.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {assignment.description}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-2">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs
                    font-medium ${isSubmitted(assignment.id)
                                            ? 'bg-green-100 text-green-700'
                                            : new Date(assignment.dueDate) < new Date()
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {isSubmitted(assignment.id)
                                            ? 'Submitted'
                                            : new Date(assignment.dueDate) < new Date()
                                                ? 'Overdue'
                                                : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}