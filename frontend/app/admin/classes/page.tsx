'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';

export default function AdminClasses() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        name: '',
        teacherId: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/classes');
            // handle both paginated and plain array response
            setClasses(response.data.content || response.data);
        } catch (err) {
            console.error('Error fetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = async () => {
        setMessage('');
        try {
            await api.post('/classes', {
                name: form.name,
                teacherId: form.teacherId || null
            });
            setMessage('Class created successfully!');
            setForm({ name: '', teacherId: '' });
            fetchClasses();
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to create class');
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return;
        try {
            await api.delete(`/classes/${classId}`);
            setMessage('Class deleted successfully!');
            fetchClasses();
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to delete class');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Manage Classes
                    </h2>
                </div>

                {/* Create Class Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        Create New Class
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Class Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. 10th Grade A"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Teacher ID (optional)</label>
                            <input
                                type="text"
                                value={form.teacherId}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, teacherId: e.target.value }))}
                                placeholder="Teacher UUID"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCreateClass}
                        className="mt-4 bg-blue-600 text-white px-4 py-2
              rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Create Class
                    </button>
                    {message && (
                        <p className={`mt-3 text-sm ${message.includes('success')
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Classes List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            All Classes ({classes.length})
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : classes.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No classes found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Class Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Teacher ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium
                      text-gray-800">{cls.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {cls.teacherId || 'Not assigned'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(cls.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeleteClass(cls.id)}
                                                className="text-red-500 text-sm hover:text-red-700"
                                            >
                                                Delete
                                            </button>
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