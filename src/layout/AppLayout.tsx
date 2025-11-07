import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export type CareEvent = {
  id: string;
  priority: string;
  resident?: string;
  datetimeISO: string;
  dateISO: string;
  datetimeLabel: string;
  staffName: string;
  location: string;
  type?: string;
  eventName: string;
  quantity: number;
  notes?: string;
  status?: "upcoming" | "ongoing" | "done" | "cancelled";
};

export type FamilyVisit = {
  id: string;
  priority: string;
  resident: string;
  date: string;
  family: string;
  qr: boolean;
  datetime?: string;
  datetimeISO?: string;
  endDatetime?: string;
  notes?: string;
};

export function AppLayout() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [care, setCare] = useState<CareEvent[]>([]);
  const [visits, setVisits] = useState<FamilyVisit[]>([]);

  useEffect(() => {
    const storedCare = localStorage.getItem("careEvents");
    const storedVisits = localStorage.getItem("familyVisits");
    if (storedCare) setCare(JSON.parse(storedCare));
    if (storedVisits) setVisits(JSON.parse(storedVisits));
  }, []);

  useEffect(() => {
    localStorage.setItem("careEvents", JSON.stringify(care));
    localStorage.setItem("familyVisits", JSON.stringify(visits));
  }, [care, visits]);

  const handleButtonClick = (path: string) => {
    setActiveButton(path); 
    navigate(path); 
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 pointer-events-none
        bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

      {/* Sidebar FIXED */}
      <aside className="fixed left-0 top-0 rounded-3xl w-64 bg-white/70 backdrop-blur border-r">
        <nav className="p-4 space-y-2">
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/list-resident' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/list-resident')}
          >
            Resident Profile Management
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/input-vital' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/input-vital')}
          >
            Medical & Health Record Management
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/staff-manage-event' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/staff-manage-event')}
          >
            Schedule & Events Management
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/nutrition' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/nutrition')}
          >
            Daily Life & Nutrition Management
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/incident' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/incident')}
          >
            Incident & Emergency Handling
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/room' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/room')}
          >
            Room & Facility Management
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/communication' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/communication')}
          >
            Communication & Reporting
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/visitation' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/visitation')}
          >
            Visitation & Access Control
          </button>
          <button
            type="button"
            className={`w-full text-left px-4 py-2 font-semibold text-gray-700 ${activeButton === '/resident-management/payments' ? 'bg-[#5895d8] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleButtonClick('/resident-management/payments')}
          >
            Payments & Additional Services
          </button>
        </nav>
      </aside>

      {/* Main content pushed right */}
      <main className="ml-64 w-[calc(100vw-16rem)] min-w-0 p-0">
        <Outlet context={{ care, setCare, visits, setVisits }} />
      </main>
    </div>
  );
}
