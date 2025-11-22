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
  Pill,
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
  { name: 'Visits & QR Check-in', path: '/admin-visit-qrcheckin', icon: QrCode },
  { name: 'SOS & Incidents', path: '/admin-sos-incident', icon: AlertTriangle },
  { name: 'Payments & Pricing', path: '/admin-payment', icon: CreditCard },
  { name: 'Reports & Analytics', path: '/admin-report-analytics', icon: BarChart3 },
  { name: 'Medication Management', path: '/medication-management', icon: Pill },
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
          className={`fixed left-0 top-0 w-60 h-screen bg-white/80 backdrop-blur shadow-lg border-r rounded-r-xl flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {!isCollapsed && <h2 className="text-2xl font-bold text-[#5985d8]">HeLiCare</h2>}
          <div className="flex items-center space-x-2 text-gray-600">
            {/* <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden md:flex text-gray-600">
              <Menu className="h-5 w-5" />
            </Button> */}
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
                      ${isActive ? 'bg-blue-100 text-black' : 'text-gray-700 hover:bg-gray-100'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" />
                  {!isCollapsed && <span className="text-left whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-black hover:bg-transparent">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="font-bold text-xl">HeLiCare Admin</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-black hover:bg-transparent">
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
