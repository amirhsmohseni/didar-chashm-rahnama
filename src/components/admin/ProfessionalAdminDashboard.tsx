
import AdminDashboardStats from './dashboard/AdminDashboardStats';
import QuickActionCards from './dashboard/QuickActionCards';
import RecentActivityList from './dashboard/RecentActivityList';

interface ProfessionalAdminDashboardProps {
  onTabChange: (tab: string) => void;
}

const ProfessionalAdminDashboard = ({ onTabChange }: ProfessionalAdminDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">پنل مدیریت</h1>
            <p className="text-blue-100">
              خوش آمدید! مدیریت سایت را از اینجا انجام دهید
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold">
              {new Date().toLocaleDateString('fa-IR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-blue-200 text-sm mt-1">
              {new Date().toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <AdminDashboardStats />

      {/* Quick Actions */}
      <QuickActionCards onNavigate={onTabChange} />

      {/* Recent Activity */}
      <RecentActivityList />
    </div>
  );
};

export default ProfessionalAdminDashboard;
