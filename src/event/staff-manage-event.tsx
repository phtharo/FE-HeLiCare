import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Funnel } from "lucide-react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
// Local CareEvent type (staff-sidebar does not export CareEvent)
type CareEvent = {
  id?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  eventName?: string;
  datetimeISO?: string;
  dateISO?: string;
  datetimeLabel?: string;
  staffName?: string;
  location?: string;
  type?: string;
  quantity?: number;
  notes?: string;
  attendees?: any[];
};

import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu"; // Import DropdownMenu components
// import { Badge } from "../components/ui/badge"; 
// import { twMerge } from 'tailwind-merge';
// Define FamilyVisit locally because "./staff-create-event" does not export a named FamilyVisit type
type FamilyVisit = {
  id?: string;
  priority?: string;
  resident?: string;
  datetime?: string;
  datetimeISO?: string;
  date?: string;
  family?: string;
  qr?: boolean;
  quantity?: number;
  notes?: string;
};

type FilterState = {
  from?: string;   // YYYY-MM-DD
  to?: string;     // YYYY-MM-DD
  priority?: "low" | "normal" | "high" | "urgent" | "all";
  staff?: string | "all";
  eventType?: string | "all"; // Added event type filter
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  staffOptions: Array<{ id: string; name: string }>;
  eventTypeOptions: Array<string>; // Added prop for event type options
};

export function FilterButton({ value, onChange, staffOptions }: Props) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<FilterState>(value);

  // Sync value to draft when Popover opens
  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const set = (patch: Partial<FilterState>) =>
    setDraft(prev => ({ ...prev, ...patch }));

  const clearDraft = () =>
    setDraft({ from: "", to: "", priority: "all", staff: "all" });

  const apply = () => {
    // Normalize draft before applying
    const normalized: FilterState = {
      from: draft.from || "",
      to: draft.to || "",
      priority: (draft.priority ?? "all") as any,
      staff: (draft.staff ?? "all") as any,
    };
    onChange(normalized);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Funnel className="h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 z-50">
        {/* Time range */}
        <div className="space-y-2">
          <Label className="text-xs">Time range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="from" className="text-[11px] text-slate-500">From</Label>
              <Input
                id="from"
                type="date"
                value={draft.from || ""}
                onChange={e => set({ from: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="to" className="text-[11px] text-slate-500">To</Label>
              <Input
                id="to"
                type="date"
                value={draft.to || ""}
                onChange={e => set({ to: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="mt-3 space-y-2">
          <Label className="text-xs">Priority</Label>
          <Select
            value={draft.priority || "all"}
            onValueChange={(v: string) => set({ priority: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Staff */}
        <div className="mt-3 space-y-2">
          <Label className="text-xs">Staff</Label>
          <Select
            value={(draft.staff as string) || "all"}
            onValueChange={(v: string) => set({ staff: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff</SelectItem>
              {staffOptions.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={clearDraft}>
            Clear
          </Button>
          <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600" onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


export default function StaffManageEvent(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext<{ care?: CareEvent[]; visits?: any[] }>() || {};
  const care = outletContext.care || null;
  const visits = outletContext.visits || [];

  if (!outletContext) {
    console.error("useOutletContext returned undefined. Ensure the parent route provides the expected context.");
    return (
      <div className='text-center text-red-500'>
        Error: Unable to load events. Please contact support.
      </div>
    );
  }

  const [filters, setFilters] = useState<FilterState>({ priority: "all", staff: "all" });
  const [careEvents, setCareEvents] = useState<CareEvent[]>(care || []);
  const [familyVisits, setFamilyVisits] = useState<any[]>(visits); // Changed to any[]
  const [notifications, setNotifications] = useState<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "done" | "edit" | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const byTimeAsc = (a: { datetimeISO?: string; datetime?: string }, b: { datetimeISO?: string; datetime?: string }) => {
    const aTime = a.datetimeISO ?? a.datetime ?? "";
    const bTime = b.datetimeISO ?? b.datetime ?? "";
    return aTime.localeCompare(bTime);
  };


  // Define a clear type for the new event payload
  type NewEventPayload =
    | ({ kind: "care" } & CareEvent)
    | ({ kind: "visit" } & FamilyVisit);

  useEffect(() => {
    const ev = location.state?.newEvent as NewEventPayload | undefined;
    console.log("[Manage] location.state:", location.state);
    console.log("[Manage Event] Location State New Event:", ev);

    if (!ev) return;

    if (ev.kind === "care") {
      const mapped: CareEvent = {
        id: ev.id ?? crypto.randomUUID(),
        priority: ev.priority ?? "normal",
        eventName: ev.eventName ?? "Unknown",
        datetimeISO: ev.datetimeISO!,
        dateISO: ev.dateISO!,
        datetimeLabel: ev.datetimeLabel!,
        staffName: ev.staffName ?? "N/A",
        location: ev.location || "",
        type: ev.type ?? "General",
        quantity: ev.quantity ?? 1,
      };
      setCareEvents((prev: CareEvent[]) =>
        prev.some((x: CareEvent) => x.id === mapped.id) ? prev : [mapped, ...prev]
      );
    } else if (ev.kind === "visit") {
      const mapped: FamilyVisit = {
        id: ev.id ?? crypto.randomUUID(),
        priority: ev.priority ?? "Normal",
        resident: ev.resident ?? "",
        datetime: ev.date ?? ev.datetime ?? ev.datetimeISO ?? "",
        datetimeISO: ev.datetimeISO ?? ev.datetime ?? "",
        family: ev.family ?? "",
        qr: Boolean(ev.qr),
        quantity: (ev as any).quantity ?? 1,
        notes: ev.notes ?? undefined,
      };
      setFamilyVisits((prev: FamilyVisit[]) =>
        prev.some((x: FamilyVisit) => x.id === mapped.id) ? prev : [mapped, ...prev]
      );
    }

    // Clear state to prevent duplicate processing
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, navigate, location.pathname]);

  //filter
  const toNum = (d?: string) => (d ? Number(d.replaceAll("-", "")) : undefined);
  const fNum = toNum(filters.from);
  const tNum = toNum(filters.to);
  const validRange = !fNum || !tNum || fNum <= tNum;

  const filteredCareEvents = careEvents.filter(e => {
    const dNum = toNum(e.dateISO);

    if (validRange) {
      if (fNum && (dNum ?? 0) < fNum) return false;
      if (tNum && (dNum ?? 99999999) > tNum) return false;
    }

    const prOk = !filters.priority || filters.priority === "all" || e.priority === filters.priority;
    const stOk = !filters.staff || filters.staff === "all" || (e.staffName ?? "").toLowerCase() === (filters.staff as string).toLowerCase();
    return prOk && stOk;
  });

  const filteredFamilyVisits = familyVisits.filter(() => true);

  const staffOptions = [
    { id: "s1", name: "Nurse Linh" },
    { id: "s2", name: "Nurse Hoa" },
    { id: "s3", name: "Dr. Nam" },
  ];


  const careSorted = React.useMemo(() => [...filteredCareEvents].sort(byTimeAsc), [filteredCareEvents]);
  const visitsSorted = React.useMemo(() => [...filteredFamilyVisits].sort(byTimeAsc), [filteredFamilyVisits]);

  // Function to add a notification
  const addNotification = (type: string, message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type, message, timestamp: new Date() },
    ]);
  };


  const formatNotificationMessage = (eventType: string, eventName: string | undefined, fromDate: string, toDate: string, reason: string) => {
    const namePart = eventName ? ` '${eventName}'` : "";
    return `${eventType}${namePart} from ${fromDate} to ${toDate} has ${reason}.`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const upcomingEvents = careEvents.filter((e) => {
        // Ensure datetimeISO exists before creating a Date from it
        if (!e.datetimeISO) return false;
        const eventTime = new Date(e.datetimeISO).getTime();
        if (isNaN(eventTime)) return false;
        return eventTime - now <= 15 * 60 * 1000 && eventTime > now;
      });

      upcomingEvents.forEach((event) => {
        addNotification("upcoming", `Event '${event.eventName}' is starting soon.`);
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [careEvents]);


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleActionConfirm = (action: "delete" | "done" | "edit", eventId: string) => {
    if (action === "edit") {
      navigate(`/staff-create-event`, { state: { eventId } });
      return;
    }
    setModalAction(action);
    setSelectedEventId(eventId);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (modalAction === "delete" && selectedEventId) {
      console.log("Event deleted.", selectedEventId);
      // Add delete logic here
    } else if (modalAction === "done" && selectedEventId) {
      console.log("Event marked as done.", selectedEventId);
      // Add mark as done logic here
    }
    setShowConfirmModal(false);
    setSelectedEventId(null);
  };

  const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div className="bg-gray-200 rounded-lg border border-gray-200 shadow-lg p-4 w-96">
          {children}
        </div>
      </div>
    );
  };

  const ModalHeader = ({ children }: { children: React.ReactNode }) => {
    return <div className="text-lg font-bold mb-4">{children}</div>;
  };

  const ModalContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="mb-4">{children}</div>;
  };

  const ModalFooter = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex justify-end gap-2">{children}</div>;
  };

  return (
    <div className="flex-1 min-h-screen overflow-x-auto overflow-y-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

      <div className="relative h-full p-6 lg:p-8 ">
        <main className="flex min-h-full gap-4 lg:gap-6 bg-gray-50 p-4 rounded-2xl min-w-[1100px] w-max">
          <div className="w-full max-w-6xl rounded-xl backdrop-blur border border-black/10 shadow-lg flex flex-col p-4 ">

            {/* HEADER */}
            <div className="pt-6 pb-3 relative z-50 pointer-events-auto">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl text-[#5985d8]">Manage Event</h1>

                <div className="flex items-center gap-4">
                  {/* Add Event Button */}
                  <button
                    type="button"
                    className="relative z-50 h-10 w-10 inline-flex items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-gray-100 focus:outline-none"
                    onClick={() => navigate('/staff-create-event')}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Add Event"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-6 w-6 flex-none"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>

                  {/* Filter Button */}
                  <div className="relative z-50">
                    <FilterButton
                      value={{ ...filters }}
                      onChange={(next) => setFilters(next)}
                      staffOptions={staffOptions}
                      eventTypeOptions={["all", "care", "visit"]}
                    />
                  </div>

                  {/* Notification Icon */}
                  <button
                    className="relative z-50 rounded-full p-2 hover:bg-gray-100"
                    onClick={() => setShowNotifications((p) => !p)}
                    aria-label="Notification"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22.5c1.5 0 2.25-.75 2.25-2.25h-4.5c0 1.5.75 2.25 2.25 2.25zm6.75-6.75v-4.5c0-3.75-2.25-6-6-6s-6 2.25-6 6v4.5l-1.5 1.5v.75h15v-.75l-1.5-1.5z" />
                    </svg>
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotifications && notifications.map((n) => (
                    <div key={n.id}>{n.message}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="pb-2 flex-grow">
              <div className="space-y-10 mb-4">
                {/* Care Events */}
                <div className="mt-6 flex gap-6 mb-4 snap-x snap-mandatory
                                relative z-0 pointer-events-auto">
                  {careSorted.map((e) => (
                    <Card key={e.id} className="rounded-2xl bg-sky-50 ring-1 ring-sky-100 relative min-w-[240px] snap-start">
                      <CardHeader>
                        <CardTitle>Care Event</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => e.id && handleActionConfirm("edit", e.id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => e.id && handleActionConfirm("delete", e.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => e.id && handleActionConfirm("done", e.id)}>Mark as Done</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-left -mt-5">
                          <li><span className="font-medium">Care Type:</span> {e.type || "N/A"}</li>
                          <li><span className="font-medium">Event Name:</span> {e.eventName || "N/A"}</li>
                          <li><span className="font-medium">Quantity:</span> {e.quantity || "N/A"}</li>
                          <li><span className="font-medium">Remaining Seat:</span> {e.quantity || "N/A"}</li>
                          <li className="flex items-center gap-1">
                            <span className="font-medium">Date:</span> {e.datetimeLabel}
                          </li>
                          <li><span className="font-medium">Location:</span> {e.location}</li>
                          <li><span className="font-medium">Staff:</span> {e.staffName || "N/A"}</li>
                          <li><span className="font-medium">Notes:</span> {e.notes || "N/A"}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                  {careSorted.length === 0 && (
                    <p className="text-center text-gray-500">No care events available.</p>
                  )}
                </div>

                {/* Family Visits */}
                <div className="mt-6 flex gap-6 mb-4 snap-x snap-mandatory
                                relative z-0 pointer-events-auto">
                  {visitsSorted.map((v) => (
                    <Card key={v.id} className="rounded-2xl bg-amber-50 ring-1 ring-amber-100 relative min-w-[240px] snap-start">
                      <CardHeader>
                        <CardTitle>Family Visit</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleActionConfirm("edit", v.id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionConfirm("delete", v.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionConfirm("done", v.id)}>Mark as Done</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-left -mt-5">
                          <li><span className="font-medium">Resident:</span> {v.resident || "N/A"}</li>
                          <li><span className="font-medium">Date:</span> {v.datetime || v.date || "N/A"}</li>
                          <li><span className="font-medium">Family:</span> {v.family || "N/A"}</li>
                          <li><span className="font-medium">QR:</span> {v.qr ? "Enabled" : "Disabled"}</li>
                          <li><span className="font-medium">Notes:</span> {v.notes || "No notes available"}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                  {visitsSorted.length === 0 && (
                    <p className="text-center text-gray-500">No family visits available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for confirmation */}
      {showConfirmModal && (
        <Modal>
          <ModalHeader>
            <h2>Confirm Action</h2>
          </ModalHeader>
          <ModalContent>
            <p>
              Are you sure you want to{" "}
              {modalAction === "delete"
                ? "delete this event"
                : modalAction === "done"
                  ? "mark this event as done"
                  : "edit this event"}
              ?
            </p>
          </ModalContent>
          <ModalFooter>
            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
            <button className="text-white bg-[#5985d8]" onClick={confirmAction}>Confirm</button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}