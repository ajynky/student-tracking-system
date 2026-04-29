'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCookie } from '../../lib/cookies';
import api from '../../lib/api';
import { getToken } from '../../lib/api';

export default function TeacherAssignments() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

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

    useEffect(() => {
        if (!selectedClass) return;
        fetchAssignments();
    }, [selectedClass]);

    const fetchAssignments = async () => {
        const token = getToken();
        if (!token) return;
        setLoading(true);
        try {
            const response = await api.get(`/assignments/class/${selectedClass}`);
            setAssignments(response.data);
        } catch (err) {
            console.error('Error fetching assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async () => {
        setMessage('');
        try {
            await api.post('/assignments', {
                classId: selectedClass,
                title: form.title,
                description: form.description,
                dueDate: new Date(form.dueDate).toISOString()
            });
            setMessage('Assignment created successfully!');
            setForm({ title: '', description: '', dueDate: '' });
            fetchAssignments();
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to create assignment');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Manage Assignments
                    </h2>
                </div>

                {/* Class Selector */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Class
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 border border-gray-300
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                </div>

                {/* Create Assignment Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        Create Assignment
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, title: e.target.value }))}
                                placeholder="Assignment title"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, description: e.target.value }))}
                                placeholder="Assignment description"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                value={form.dueDate}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, dueDate: e.target.value }))}
                                className="w-full md:w-64 px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleCreateAssignment}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md
                hover:bg-blue-700 transition-colors text-sm"
                        >
                            Create Assignment
                        </button>
                        {message && (
                            <p className={`text-sm ${message.includes('success')
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Assignments List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            Assignments ({assignments.length})
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : assignments.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No assignments created yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">
                                                {assignment.title}
                                            </h4>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {assignment.description}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-2">
                                                Due: {new Date(assignment.dueDate)
                                                    .toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs
                      font-medium ${new Date(assignment.dueDate) > new Date()
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {new Date(assignment.dueDate) > new Date()
                                                ? 'Active'
                                                : 'Expired'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}