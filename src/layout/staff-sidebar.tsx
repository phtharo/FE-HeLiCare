import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  User,
  Activity,
  Pill,
  Calendar,
  Plus,
  Settings,
  Eye,
  QrCode,
  MessageSquare,
  Utensils,
  ChefHat,
  Bed,
  Wrench,
  AlertTriangle,
  FileText,
  BarChart3,
  UserCircle,
  Cog,
  Menu,
  X,
} from 'lucide-react'; 
import type { CareEvent } from "../event/staff-create-event";

// Type cho menu item
type StaffMenuItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: StaffMenuItem[];
};


const staffMenu: StaffMenuItem[] = [
  {
    label: "Dashboard",
    path: "/staff/dashboard",
    icon: <Home size={20} />,
  },
  {
    label: "Resident & Health Records",
    children: [
      { label: "Resident List", path: "/list-resident", icon: <Users size={20} /> },
      { label: "Resident Profile", path: "/resident-information", icon: <User size={20} /> },
      { label: "Vital Signs Input", path: "/input-vital", icon: <Activity size={20} /> },
      { label: "Medication & Care Plan", path: "/staff/medication", icon: <Pill size={20} /> },
    ],
  },
  {
    label: "Schedule & Activities",
    children: [
      { label: "Daily Schedule", path: "/staff-manage-event", icon: <Calendar size={20} /> },
      // { label: "Create Event", path: "/staff-create-event", icon: <Plus size={20} /> },
      // { label: "Manage Events", path: "/setting-event", icon: <Settings size={20} /> },
    ],
  },
  {
    label: "Visits & Family",
    children: [
      // { label: "Visit Requests", path: "/staff/visits", icon: <Eye size={20} /> },
      { label: "QR Check-in", path: "/staff/qr-checkin", icon: <QrCode size={20} /> },
      { label: "Family Communication", path: "/newsfeed", icon: <MessageSquare size={20} /> },
    ],
  },
  {
    label: "Nutrition & Diet",
    children: [
      { label: "Diet Plans", path: "/staff/diet-plans", icon: <Utensils size={20} /> },
      { label: "Meal Tracking", path: "/staff/meal-tracking", icon: <ChefHat size={20} /> },
    ],
  },
  {
    label: "Rooms & Beds",
    children: [
      { label: "Room Allocation", path: "/staff/rooms", icon: <Bed size={20} /> },
      // { label: "Maintenance Tickets", path: "/staff/maintenance", icon: <Wrench size={20} /> },
    ],
  },
  {
    label: "SOS & Incidents",
    children: [
      { label: "Live SOS Alerts", path: "/staff/sos-alerts", icon: <AlertTriangle size={20} /> },
      { label: "Incident Reports", path: "/staff/incidents", icon: <FileText size={20} /> },
    ],
  },
  {
    label: "Reports & Analytics",
    children: [
      { label: "Resident Reports", path: "/staff/resident-reports", icon: <BarChart3 size={20} /> },
      { label: "Operations Dashboard", path: "/staff/operations-dashboard", icon: <BarChart3 size={20} /> },
    ],
  },
  {
    label: "Account & Settings",
    children: [
      { label: "My Profile", path: "/staff/profile", icon: <UserCircle size={20} /> },
      { label: "Settings", path: "/staff/settings", icon: <Cog size={20} /> },
    ],
  },
];


const MenuItem: React.FC<{ item: StaffMenuItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center px-4 py-1 text-left hover:bg-gray-100 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? item.label : undefined}
        >
          {item.icon && <span className="mr-3">{item.icon}</span>}
          {!isCollapsed && <span className="flex-1">{item.label}</span>}
          {!isCollapsed && (
            <span className="ml-2 text-gray-500">
              {isOpen ? '▼' : '▶'}
            </span>
          )}
        </button>
        {isOpen && !isCollapsed && (
          <div className="ml-6">
            {item.children.map((child, index) => (
              <NavLink
                key={index}
                to={child.path || '#'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-1 hover:bg-gray-100 transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                  }`
                }
              >
                {child.icon && <span className="mr-3">{child.icon}</span>}
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive }) =>
        `flex items-center px-4 py-1 hover:bg-gray-100 transition-colors ${
          isCollapsed ? 'justify-center' : ''
        } ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`
      }
      title={isCollapsed ? item.label : undefined}
    >
      {item.icon && <span className="mr-3">{item.icon}</span>}
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

// Main component 
const StaffLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [care, setCare] = useState<CareEvent[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const role = "staff";

  // Simple helper to allow child routes to add notifications via Outlet context.
  // Replace console.log with real notification/toast logic as needed.
  const addNotification = (message: string) => {
    console.log('Notification:', message);
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-lg rounded-r-3xl transition-all duration-300 ${
          isCollapsed ? 'w-10' : 'w-64'
        }`}
      >
        {/* Branding */}
        <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200">
          {!isCollapsed && (
            <>
              <div className="text-3xl font-bold text-[#5985d8]">HeLiCare</div>
              {/* <div className="text-sm text-gray-500 ml-2">Staff Console</div> */}
            </>
          )}
          {isCollapsed && <div className="text-xl font-bold text-[#5985d8]">H</div>}
        </div>

        {/* Menu */}
        <nav className="mt-4">
          {staffMenu.map((section, index) => (
            <div key={index} className="mb-4">
              {/* {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {section.label}
                </h3>
              )} */}
              {section.children ? (
                <div>
                  {section.children.map((item, idx) => (
                    <MenuItem key={idx} item={item} isCollapsed={isCollapsed} />
                  ))}
                </div>
              ) : (
                <MenuItem item={section} isCollapsed={isCollapsed} />
              )}
            </div>
          ))}
        </nav>

        {/* Profile Information Display */}
        {role !== "staff" && (
          <div className="profile-info">
            {/* Profile details here */}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header với nút hamburger */}
        <header className="flex items-center justify-between px-4 py-1 shadow-sm md:hidden">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
          <h1 className="text-lg font-semibold">Staff Dashboard</h1>
        </header>

        {/* Outlet cho nested routes */}
        <main className="min-w-max h-full">
          <Outlet context={{ care, setCare, visits, setVisits, addNotification }} />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;