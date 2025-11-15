import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card } from '../components/ui/card';
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
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Residents Management', path: '/admin/residents', icon: Users },
  { name: 'Staff Management', path: '/admin/staff', icon: UserCheck },
  { name: 'Rooms & Beds', path: '/admin/rooms', icon: Bed },
  { name: 'Activities & Schedules', path: '/admin/activities', icon: Calendar },
  { name: 'Nutrition Plans', path: '/admin/nutrition', icon: Utensils },
  { name: 'Visits & QR Check-in', path: '/admin/visits', icon: QrCode },
  { name: 'SOS & Incidents', path: '/admin/sos', icon: AlertTriangle },
  { name: 'Payments & Pricing', path: '/admin-payment', icon: CreditCard },
  { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
  { name: 'AI Suggestions / Risk Alerts', path: '/admin/ai', icon: Brain },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'} md:block`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && <h2 className="text-base font-bold text-gray-800">HeLiCare Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden md:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-full">
          <nav className="p-2 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  onClick={() => setIsSidebarOpen(false)} // Close on mobile
                >
                  <Icon className="h-6 w-6 flex-shrink-0" />
                  {!isCollapsed && <span className="text-base font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header for mobile toggle */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">HeLiCare Admin</h1>
          <div /> {/* Spacer */}
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-6">
          <Card className="min-h-full bg-white shadow-sm">
            <div className="p-6">
              <Outlet />
            </div>
          </Card>
        </ScrollArea>
      </main>
    </div>
  );
};

export default AdminLayout;
