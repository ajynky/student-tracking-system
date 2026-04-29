'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';
import { getToken } from '../../lib/api';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
        role: 'STUDENT'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const token = getToken();
        if (!token) { setLoading(false); return; }
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setMessage('');
        try {
            await api.post('/auth/register', {
                email: form.email,
                password: form.password,
                role: form.role
            });
            setMessage('User registered successfully!');
            setForm({ email: '', password: '', role: 'STUDENT' });
            fetchUsers();
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Failed to register user');
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-700';
            case 'TEACHER':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Manage Users
                    </h2>
                </div>

                {/* Register User Form */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        Register New User
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, email: e.target.value }))}
                                placeholder="user@example.com"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, password: e.target.value }))}
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium
                text-gray-700 mb-1">Role</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm(prev =>
                                    ({ ...prev, role: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300
                  rounded-md focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="TEACHER">Teacher</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleRegister}
                        className="mt-4 bg-blue-600 text-white px-4 py-2
              rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Register User
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

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">
                            All Users ({users.length})
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium
                    text-gray-500 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs
                        font-medium ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
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