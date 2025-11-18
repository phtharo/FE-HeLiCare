import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  User,
  Activity,
  Pill,
  Calendar,
  MessageSquare,
  Utensils,
  ChefHat,
  Bed,
  AlertTriangle,
  FileText,
  BarChart3,
  UserCircle,
  Menu,
  CreditCard,
  X,
  LogOut,
} from 'lucide-react';

type StaffMenuItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: StaffMenuItem[];
};

const staffMenu: StaffMenuItem[] = [
  { label: "Dashboard", path: "/staff-dashboard", icon: <Home size={20} /> },

  {
    label: "Resident & Health Records",
    children: [
      { label: "Resident List", path: "/list-resident", icon: <Users size={20} /> },
      { label: "Create Resident", path: "/resident-information", icon: <User size={20} /> },
      { label: "Vital Signs Input", path: "/input-vital", icon: <Activity size={20} /> },
      { label: "Medication & Care Plan", path: "/staff-medication-careplan", icon: <Pill size={20} /> },
    ],
  },

  {
    label: "Schedule & Activities",
    children: [
      { label: "Daily Schedule", path: "/staff-manage-event", icon: <Calendar size={20} /> },
    ],
  },

  {
    label: "Visits & Family",
    children: [
      { label: "Family Communication", path: "/newsfeed", icon: <MessageSquare size={20} /> },
    ],
  },

  {
    label: "Nutrition & Diet",
    children: [
      { label: "Diet Plans", path: "/staff-nutrition", icon: <Utensils size={20} /> },
      // { label: "Meal Tracking", path: "/staff/meal-tracking", icon: <ChefHat size={20} /> },
    ],
  },

  {
    label: "Rooms & Beds",
    children: [
      { label: "Room Allocation", path: "/staff-room", icon: <Bed size={20} /> },
    ],
  },

  {
    label: "SOS & Incidents",
    children: [
      { label: "SOS & Incidents", path: "/sos-alerts", icon: <AlertTriangle size={20} /> },
      // { label: "Incident Reports", path: "/staff/incidents", icon: <FileText size={20} /> },
    ],
  },

  {
    label: "Payment",
    children: [
      // { label: "Resident Reports", path: "/staff/resident-reports", icon: <BarChart3 size={20} /> },
      { label: "Service Requests", path: "/staff-payment", icon: <CreditCard size={20} /> },
    ],
  },

  {
    label: "Account & Settings",
    children: [
      { label: "My Profile", path: "/staff/profile", icon: <UserCircle size={20} /> },
    ],
  },
];

const MenuItem: React.FC<{ item: StaffMenuItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
  return (
    <NavLink
      to={item.path || "#"}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md transition-colors
        ${isCollapsed ? "justify-center" : "space-x-3"}
        ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
      }
      title={isCollapsed ? item.label : ""}
    >
      <span>{item.icon}</span>
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

const StaffLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => navigate('/signin');


  // const handleLogout = () => {
  //   // Add logout logic here, e.g., clear tokens, redirect to login
  //   console.log('Logout clicked');
  // };

  return (
    <>
      <div className="fixed inset-0 -z-50 bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)] pointer-events-none"></div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-lg rounded-r-3xl transition-all duration-300 flex flex-col
            ${isCollapsed ? "w-12" : "w-64"}`}
        >
          <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200">
            {!isCollapsed && <div className="text-3xl font-bold text-[#5985d8]">HeLiCare</div>}
            {isCollapsed && <div className="text-xl font-bold text-[#5985d8]">H</div>}
          </div>

          <nav className="mt-4 space-y-1 flex-1">
            {staffMenu.map((section, index) => (
              <div key={index}>
                {/* Render ONLY children → bỏ group label */}
                {section.children
                  ? section.children.map((item, idx) => (
                    <MenuItem key={idx} item={item} isCollapsed={isCollapsed} />
                  ))
                  : <MenuItem item={section} isCollapsed={isCollapsed} />}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors
                ${isCollapsed ? "justify-center" : "space-x-3"}`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 
            ${isCollapsed ? "ml-12" : "ml-64"}`}
        >
          <header className="flex items-center justify-between px-4 py-2 shadow-sm md:hidden">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              {isCollapsed ? <Menu size={24} /> : <X size={24} />}
            </button>

            <h1 className="text-lg font-semibold">Staff Dashboard</h1>
          </header>

          <main className="min-w-max h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default StaffLayout;
