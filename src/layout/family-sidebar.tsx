// FamilySidebar.tsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  Heart,
  Calendar,
  Utensils,
  Building,
  CalendarCheck,
  BookOpen,
  Bell,
  MessageSquare,
  CreditCard,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';

const navigationItems = [
  { to: '/family/home', label: 'Dashboard / Overview', icon: Home },
  { to: '/family/residents', label: 'My Residents', icon: Users },
  { to: '/family/health', label: 'Health & Care', icon: Heart },
  { to: '/family-register-visit', label: 'Schedule & Activities', icon: Calendar },
  { to: '/family/meals', label: 'Meals & Nutrition', icon: Utensils },
  { to: '/family/room', label: 'Room & Facility', icon: Building },
  { to: '/family/visits', label: 'Visits', icon: CalendarCheck },
  { to: '/newsfeed', label: 'Family Diary', icon: BookOpen },
  { to: '/family/notifications', label: 'Notifications', icon: Bell },
  { to: '/family/feedback', label: 'Feedback & Support', icon: MessageSquare },
  { to: '/family/billing', label: 'Billing & Payments', icon: CreditCard },
];

const FamilySidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const familyMemberName = 'John Doe';

  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-0 -z-10 pointer-events-none
        bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
      <aside
        className="fixed left-0 top-0 w-64 h-screen bg-white/80 backdrop-blur shadow-lg border-r rounded-r-xl flex flex-col">

        {/* Logo */}
        <div className="p-6 text-center">
          <h1 className="text-lg font-bold text-[#5985d8] mb-4">HeLiCare</h1>
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-4 p-4">
          <Avatar>
            <AvatarFallback>
              {familyMemberName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{familyMemberName}</p>
            <p className="text-xs text-gray-500">Family Member</p>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <h1 className="text-xl font-bold text-gray-900">HeLiCare</h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </header>

        {/* Routed pages */}
        <section className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default FamilySidebar;
