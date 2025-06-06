
import AdminStats from './AdminStats';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

interface NewAdminDashboardProps {
  onTabChange: (tab: string) => void;
}

const NewAdminDashboard = ({ onTabChange }: NewAdminDashboardProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">خوش آمدید به پنل مدیریت</h2>
        <p className="text-gray-600">نمای کلی از عملکرد سایت و اقدامات سریع</p>
      </div>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions onTabChange={onTabChange} />
        <RecentActivity />
      </div>
    </div>
  );
};

export default NewAdminDashboard;
