import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bed,
  Calendar,
  Utensils,
  QrCode,
  AlertTriangle,
  CreditCard,
  BarChart3,
  Brain,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Residents Management', path: '/admin-resident', icon: Users },
  { name: 'Staff Management', path: '/admin-staff', icon: UserCheck },
  { name: 'Rooms & Beds', path: '/admin-room', icon: Bed },
  { name: 'Activities & Schedules', path: '/admin-activities', icon: Calendar },
  { name: 'Nutrition Plans', path: '/admin-nutrition', icon: Utensils },
  { name: 'Visits & QR Check-in', path: '/admin/visits', icon: QrCode },
  { name: 'SOS & Incidents', path: '/admin/sos', icon: AlertTriangle },
  { name: 'Payments & Pricing', path: '/admin-payment', icon: CreditCard },
  { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
  // { name: 'AI Suggestions / Risk Alerts', path: '/admin/ai', icon: Brain },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleLogout = () => navigate('/signin');

  return (
    <>
      {/* Background fixed toàn màn hình nhưng không che main */}
      <div className="fixed inset-0 -z-50 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

      {/* Layout wrapper */}
      <div className="flex min-h-screen relative z-10">

        {/* Overlay mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed md:relative top-0 left-0 h-full bg-white shadow-lg border-r
          overflow-hidden
          z-50 transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}>

        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">HeLiCare Admin</h2>}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden md:flex">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-56px)]">
          <nav className="p-2 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                      flex items-center space-x-3 p-2 rounded-lg transition-colors
                      ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-6 w-6" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="font-bold text-xl">HeLiCare Admin</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-6 w-6" />
          </Button>
        </header>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>

      </main>
    </div >
    </>
  );
};

export default AdminLayout;
