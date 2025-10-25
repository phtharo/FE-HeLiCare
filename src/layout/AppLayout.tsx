import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

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
  notes?: string; // Added notes field
  status?: "upcoming" | "ongoing" | "done" | "cancelled"; // Added status field
};

export type FamilyVisit = {
  id: string;
  priority: string;
  resident: string;
  date: string; 
  family: string;
  qr: boolean;
  datetime?: string; // Added datetime field
  datetimeISO?: string; // Added datetimeISO field
  endDatetime?: string; 
  notes?: string; 
};

export type VisitEvent = {
  id: string;
  resident_id: number;
  name: string; 
  start_time: string; 
  end_time: string; 
  capacity: number; 
  attendees: Array<{
    family_user_id: number;
    status: "invited" | "confirmed" | "checked_in" | "cancelled";
    qr_code?: string; 
  }>;
  notes?: string;
  recurrence?: string | null; 
  created_by_staff_id: number;
};

export function AppLayout() {
  const [care, setCare] = useState<CareEvent[]>([]);
  const [visits, setVisits] = useState<FamilyVisit[]>([]);

  // Persist care and visits data in local storage
  useEffect(() => {
    const storedCare = localStorage.getItem("careEvents");
    const storedVisits = localStorage.getItem("familyVisits");

    if (storedCare) {
      setCare(JSON.parse(storedCare));
    }

    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("careEvents", JSON.stringify(care));
    localStorage.setItem("familyVisits", JSON.stringify(visits));
  }, [care, visits]);

  return (
    <Outlet context={{ care, setCare, visits, setVisits }} />
  );
}