
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  Home,
  Calendar,
  Users,
  Utensils,
  Heart,
  MessageCircle,
  Bed,
  Bell,
  AlertTriangle,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home",              icon: Home,          path: "/home" },
  { label: "My Day",            icon: Calendar,      path: "/resident-schedule" },
  { label: "Activities",        icon: Users,         path: "/newsfeed" },
  { label: "Meals & Nutrition", icon: Utensils,      path: "/meals" },
  { label: "My Health",         icon: Heart,         path: "/health" },
  { label: "Family",            icon: MessageCircle, path: "/family" },
  { label: "My Room",           icon: Bed,           path: "/room" },
  { label: "Notifications",     icon: Bell,          path: "/notifications" },
  { label: "Settings",          icon: Settings,      path: "/settings" },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    if (location.pathname !== path) navigate(path);
  };

  return (
    <div className="relative min-h-screen">
      
      <div
        className="fixed inset-0 -z-10 pointer-events-none
        bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"
      />

      {/* SIDEBAR FIXED */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white/80 backdrop-blur shadow-lg border-r rounded-r-xl flex flex-col">
        {/* Top: logo + resident info */}
        <div className="p-6 text-center">
          <h1 className="text-lg font-bold text-blue-700 mb-4">HeLiCare</h1>
          <div className="flex items-center justify-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={undefined} alt="Resident avatar" />
              <AvatarFallback className="bg-blue-200 text-blue-800 text-lg">
                User
              </AvatarFallback>
            </Avatar>
            <p className="text-xl text-gray-800">Hello, Unknown Resident</p>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Nav items */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-left text-lg py-3 px-4 rounded-lg ${
                  isActive
                    ? "bg-blue-200 text-blue-900"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
                onClick={() => handleNavClick(item.path)}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <Separator className="my-2" />

        {/* Bottom: SOS + Settings */}
        <div className="px-4 pb-6 space-y-2">
          <Button
            variant="destructive"
            className="w-full text-lg py-4 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow-md"
            onClick={() => alert("SOS Help activated!")}
          >
            <AlertTriangle className="w-6 h-6 mr-3" />
            SOS Help
          </Button>
          {/* <Button
            variant="outline"
            className="w-full justify-start text-left text-lg py-3 px-4 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => handleNavClick("/settings")}
          >
            <Settings className="w-6 h-6 mr-3" />
            Settings
          </Button> */}
        </div>
      </aside>

      {/* MAIN CONTENT – giống AppLayout: ml-64 + Outlet */}
      <main className="ml-64 w-[calc(100vw-16rem)] min-w-0 p-6">
        <Outlet />
      </main>
    </div>
  );
};
