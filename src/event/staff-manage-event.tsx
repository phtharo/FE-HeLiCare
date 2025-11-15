import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
// import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
// import { Calendar } from "../components/ui/calendar";
// import { CalendarIcon, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";

// import { Checkbox } from '../components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CareEvent } from "./staff-create-event";
// Removed redundant local declaration of FamilyVisit
// Ensure only the imported type is used

// Define TypeScript types
// type HealthLevel = "low" | "medium" | "high";

type EventStatus = "upcoming" | "ongoing" | "ended" | "cancelled";

function getEventStatus(
  startTime: string,
  endTime: string,
  cancelled: boolean = false
): EventStatus {
  if (cancelled) return "cancelled";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "upcoming";
  if (now >= start && now < end) return "ongoing";
  return "ended";
}

type StaffEvent = {
  id: string;
  name: string;
  // description?: string;
  type: "care" | "family";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  staffName?: string;
  capacity: number;
  registeredCount: number;
  createdBy: string;
  status: EventStatus;
  careType?: string;
};

// Zod schema for form validation
const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // description: z.string().optional(),
  type: z.enum(["care", "family"]),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  careType: z.string().optional(),
  staffName: z.string().optional(),
  status: z.enum(["upcoming", "ongoing", "ended", "cancelled"]),
});

// Adjusted `defaultValues` to match the schema and removed `registeredCount` from form handling
const defaultValues = {
  name: "",
  // description: "",
  type: "care" as "care" | "family",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  capacity: 1,
  staffName: "",
  status: "upcoming" as "upcoming" | "ongoing" | "ended" | "cancelled",
  careType: "",
};

// Mock data for demonstration
const mockEvents: StaffEvent[] = [
  {
    id: "1",
    name: "Dưỡng sinh sáng",
    // description: "Morning tai chi session",
    type: "care",
    careType: "vital_check",
    date: "2025-10-15",
    startTime: "07:00",
    endTime: "08:00",
    staffName: "Tran Thi B",
    location: "Garden",
    capacity: 20,
    registeredCount: 15,
    createdBy: "Nguyen Van A",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Yoga nhẹ",
    // description: "Gentle yoga for seniors",
    type: "care",
    careType: "therapy",
    date: "2025-10-16",
    startTime: "09:00",
    endTime: "10:00",
    staffName: "Le Van C",
    location: "Yoga Room",
    capacity: 15,
    registeredCount: 10,
    createdBy: "Tran Thi B",
    status: "ongoing",
  },
  {
    id: "3",
    name: "Đi dạo công viên",
    // description: "Park walk",
    type: "care",
    careType: "hygiene",
    date: "2025-10-14",
    startTime: "14:00",
    endTime: "15:30",
    location: "Local Park",
    capacity: 25,
    registeredCount: 20,
    staffName: "Le Van C",
    createdBy: "Le Van C",
    status: "ended",
  },
  {
    id: "4",
    name: "Văn nghệ cuối tuần",
    // description: "Weekend entertainment show",
    type: "care",
    careType: "entertainment",
    date: "2025-10-20",
    startTime: "18:00",
    endTime: "20:00",
    staffName: "Pham Thi D",
    location: "Auditorium",
    capacity: 50,
    registeredCount: 45,
    createdBy: "Pham Thi D",
    status: "cancelled",
  },
];

// mock API faker staff list
const staffList: string[] = [
  "Nguyen Van A",
  "Tran Thi B",
  "Le Van C",
  "Pham Thi D",
];

const StaffEventManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<StaffEvent[]>(mockEvents);
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCareType, setFilterCareType] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [filterFrom, setFilterFrom] = useState<string>("");
  const [filterTo, setFilterTo] = useState<string>("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  // sync local hour/minute with form's startTime
  const startTimeValue = form.watch("startTime");
  useEffect(() => {
    const st = startTimeValue || "";
    if (st && st.includes(":")) {
      st.split(":"); // Split the time string without assigning unused variables
    }
  }, [startTimeValue]);

  // Replace fetchEvents with mockEvents
  useEffect(() => {

    setEvents(mockEvents);
  }, []);

  // Imported `CareEvent` type to resolve type errors
  // Ensured `mapCareEventToStaffEvent` is used where necessary to avoid unused declaration
  useEffect(() => {
    if (!location.state) return;

    const data = location.state.newEvent;
    console.log("Received newEvent in Manage Event:", data); // Log the received data

    if (!data) return;

    let mappedEvent: StaffEvent;

    if (data.type === "care") {
      mappedEvent = mapCareEventToStaffEvent(data);
    } else if (data.type === "family") {
      mappedEvent = mapVisitEventToStaffEvent(data as FamilyVisit);
    } else {
      return;
    }

    setEvents(prev => [...prev, mappedEvent]);
  }, [location.state]);

  // Filter events based on criteria
  const filteredEvents = events.filter(e => {
    const statusOk = filterStatus === "all" || e.status === filterStatus;
    const typeOk = filterType === "all" || e.type === filterType;

    const careTypeOk =
      e.type !== "care" ||
      filterCareType === "all" ||
      e.careType === filterCareType;

    const dateOk = (() => {
      const eventDate = new Date(e.date).getTime();
      const from = filterFrom ? new Date(filterFrom).getTime() : null;
      const to = filterTo ? new Date(filterTo).getTime() : null;

      if (from && to) return eventDate >= from && eventDate <= to;
      if (from) return eventDate >= from;
      if (to) return eventDate <= to;

      return true;
    })();

    return statusOk && typeOk && careTypeOk && dateOk;
  });

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(e => e.id !== id));
      setToastMessage("Event deleted");
    } catch {
      setToastMessage("Error deleting event");
    }
  };

  const openEditDialog = (event: StaffEvent) => {
    setEditingEventId(event.id);

    form.reset({
      name: event.name,
      // description: event.description || "",
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      capacity: event.capacity,
      staffName: event.staffName || "",
      status: event.status,
      careType: event.type === "care" ? event.careType || "" : "",
    });

    setDialogOpen(true);
  };

  const saveUpdateEvent = (values: z.infer<typeof eventSchema>) => {
    if (!editingEventId) return;

    setEvents(prev =>
      prev.map(ev =>
        ev.id === editingEventId
          ? {
            ...ev,
            ...values,
            careType: values.type === "care" ? values.careType : "",
          }
          : ev
      )
    );

    setDialogOpen(false);
    setToastMessage("Event updated successfully");
  };

  // Notification Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const upcoming = events.filter(e => {
        const start = new Date(`${e.date}T${e.startTime}`).getTime();
        return start - now <= 15 * 60 * 1000 && start > now;
      });
      if (upcoming.length)
        setToastMessage(`Upcoming: ${upcoming[0].name}`);
    }, 60_000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
      <div className="container max-w-full mx-auto p-4 bg-white rounded-lg border border-gray-200 space-y-6">
        <h1 className="text-2xl font-bold">Staff Event Management</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterStatus} onValueChange={(value: string) => setFilterStatus(value as EventStatus | "all")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="care">Care Event</SelectItem>
              <SelectItem value="family">Family Visit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCareType} onValueChange={setFilterCareType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by Care Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Care Types</SelectItem>
              <SelectItem value="vital_check">Vital Check</SelectItem>
              <SelectItem value="therapy">Therapy</SelectItem>
              <SelectItem value="hygiene">Hygiene</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col sm:flex-row gap-4 relative bg-white">
            <div className="relative cursor-pointer" onClick={() => {
              const input = document.getElementById("filter-from") as HTMLInputElement;
              input?.showPicker?.();
            }}>
              <CalendarIcon
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer z-10"
                onClick={() => {
                  const input = document.getElementById("filter-from") as HTMLInputElement;
                  input?.showPicker?.();
                }}
              />
              <Input
                id="filter-from"
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="pl-8 bg-white"
              />
            </div>

            <div className="relative cursor-pointer" onClick={() => {
              const input = document.getElementById("filter-to") as HTMLInputElement;
              input?.showPicker?.();
            }}>
              <CalendarIcon
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer z-10"
                onClick={() => {
                  const input = document.getElementById("filter-to") as HTMLInputElement;
                  input?.showPicker?.();
                }}
              />
              <Input
                id="filter-to"
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="pl-8 bg-white"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <Button
            className="bg-gray-400 text-white hover:bg-gray-600"
            onClick={() => {
              setFilterStatus("all");
              setFilterType("all");
              setFilterCareType("all");
              setFilterFrom("");
              setFilterTo("");
            }}
          >
            Clear
          </Button>
        </div>

        {/* Add Event Button */}
        <Button
          className="bg-blue-500 text-white hover:bg-blue-500"
          onClick={() => navigate("/staff-create-event")}
        >
          Add New Event
        </Button>


        {/* Events Table */}
        <div className="overflow-visible">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center'>Name</TableHead>
                <TableHead className='text-center'>Type</TableHead>
                <TableHead className='text-center'>Date</TableHead>
                <TableHead className='text-center'>Time</TableHead>
                <TableHead className='text-center'>Location</TableHead>
                <TableHead className='text-center'>Staff</TableHead>
                <TableHead className='text-center'>Capacity</TableHead>
                <TableHead className='text-center'>Registered</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map(event => (
                <TableRow key={event.id}>
                  <TableCell className='text-left whitespace-pre-line'>{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {event.type === "care"
                        ? event.careType || "General"
                        : event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.startTime} - {event.endTime}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.staffName}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>{event.registeredCount}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        event.status === "upcoming"
                          ? "bg-blue-500 text-white hover:bg-blue-500"
                          : event.status === "ongoing"
                            ? "bg-green-500 text-white hover:bg-green-500"
                            : event.status === "ended"
                              ? "bg-gray-400 text-white hover:bg-gray-400 "
                              : "bg-red-500 text-white hover:bg-red-500"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="grid grid-cols-3 ">
                    <Button variant="outline" size="sm" className='bg-gray-200' onClick={() => openEditDialog(event)}>Edit</Button>
                    <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                    {event.type === "family" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 bg-blue-400"
                        onClick={() => navigate(`/booking-status-qr/${event.id}`)}
                      >
                        QR
                      </Button>
                    ) : (
                      <div />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Toast for notifications */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded shadow">
            {toastMessage}
          </div>
        )}

        {/* Edit Event Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg space-y-6">

              <h2 className="text-2xl font-bold text-center">Edit Event</h2>

              <form
                onSubmit={form.handleSubmit(saveUpdateEvent)}
                className="space-y-4"
              >

                {/* 1. NAME */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Name</label>
                  <Input {...form.register("name")} className="flex-1" />
                </div>

                {/* 2. TYPE */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Type</label>
                  <Select
                    value={form.watch("type")}
                    onValueChange={(v) => form.setValue("type", v as any)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="care">Care Event</SelectItem>
                      <SelectItem value="family">Family Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2.1 CARE TYPE (if type=care) */}
                {form.watch("type") === "care" && (
                  <div className="flex items-center gap-4">
                    <label className="w-36 text-sm font-medium">Care Type</label>
                    <Select
                      value={form.watch("careType")}
                      onValueChange={(v) => form.setValue("careType", v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choose care type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vital_check">Vital Check</SelectItem>
                        <SelectItem value="therapy">Therapy</SelectItem>
                        <SelectItem value="hygiene">Hygiene</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 3. DATE */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Date</label>
                  <Input type="date" {...form.register("date")} className="flex-1" />
                </div>

                {/* 4. TIME */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Time</label>
                  <div className="flex gap-2 flex-1">
                    <Input type="time" {...form.register("startTime")} />
                    <Input type="time" {...form.register("endTime")} />
                  </div>
                </div>

                {/* 5. LOCATION */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Location</label>
                  <Input {...form.register("location")} className="flex-1" />
                </div>

                {/* 6. STAFF NAME */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Staff</label>

                  <Select
                    onValueChange={(value) => form.setValue("staffName", value)}
                    defaultValue={form.watch("staffName")}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>

                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                {/* 7. CAPACITY */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Capacity</label>
                  <Input
                    type="number"
                    {...form.register("capacity", { valueAsNumber: true })}
                    className="flex-1"
                  />
                </div>

                {/* 8. REGISTERED (readonly) */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Registered</label>
                  <Input
                    value={editingEventId ? events.find(e => e.id === editingEventId)?.registeredCount : ""}
                    disabled
                    className="flex-1 bg-gray-100"
                  />
                </div>

                {/* 9. STATUS */}
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-medium">Status</label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) => form.setValue("status", v as any)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-500 text-white hover:bg-blue-500" type="submit">
                    Save Changes
                  </Button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};




function mapCareEventToStaffEvent(ce: CareEvent): StaffEvent {
  const start = new Date(ce.datetimeISO);
  const startTime = start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return {
    id: ce.id,
    name: ce.name, 
    // description: ce.notes || "",
    type: "care",
    careType: ce.type || "",
    date: ce.dateISO,
    startTime,
    endTime: "", 
    location: ce.location, 
    capacity: ce.quantity ?? 1,
    registeredCount: 0,
    createdBy: ce.staffName, 
    status: "upcoming",
  };
}

// Update FamilyVisit type to include `type`
export type FamilyVisit = {
  id: string;
  type: "family";
  resident: string;
  visitor: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

function mapVisitEventToStaffEvent(v: FamilyVisit): StaffEvent {
  console.log("MAP VISIT INPUT:", v); // Debugging log
  return {
    id: v.id,
    name: `Resident: ${v.resident} \n Visitor: ${v.visitor}`,
    type: "family",
    date: v.date,
    startTime: v.startTime,
    endTime: v.endTime,
    location: v.location,
    capacity: 1,
    registeredCount: 0,
    createdBy: v.visitor,
    status: "upcoming",
  };
}

export default StaffEventManagementPage;