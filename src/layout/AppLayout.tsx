import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export type CareEvent = {
  id: string;
  priority: string;
  resident: string;
  datetimeISO: string;
  dateISO: string;
  datetimeLabel: string;
  staffName: string;
  location: string;
  type?: string;
};

export type FamilyVisit = {
  id: string;
  priority: string;
  resident: string;
  datetime: string;
  family: string;
  qr: boolean;
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