import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Admin Dashboard
                </h2>
                <p className="text-gray-500">Welcome! Your dashboard is loading...</p>
            </div>
        </DashboardLayout>
    );
} ``