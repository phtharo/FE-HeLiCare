//family & resident can register/cancel events, view calendar


import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandItem,
//   CommandEmpty,
// } from "../components/ui/command";
import { fetchFamilyVisits, createFamilyVisit } from "../lib/api";
import { useOutletContext } from "react-router-dom";
type FamilyVisit = {
  id: string;
  date: string;
  start?: string;
  end?: string;
  resident?: string;
  family?: string;
  qr?: boolean;
  notes?: string;
  [key: string]: any;
};
import { useNavigate } from "react-router-dom";

//API function
const fetchCareEvents = async (): Promise<any[]> => {

  return new Promise((resolve) => setTimeout(() => resolve(events), 200));
};

// --- mock data
const events = [
  {
    id: "e1",
    date: "2025-10-22",
    start: "09:00",
    end: "10:00",
    name: "Vital check",
    type: "care" as const,
    location: "Room 101 / Bed 1",
    staff: "Nurse Linh",
    capacity: 3,
    registered: 1,
    note: "Bring medical records",
  },
  {
    id: "e2",
    date: "2025-10-22",
    start: "15:00",
    end: "15:30",
    name: "Family visit",
    type: "visit" as const,
    location: "Lobby A",
    staff: "Frontdesk",
    capacity: 5,
    registered: 5,
    note: "",
  },
  {
    id: "e3",
    date: "2025-10-23",
    start: "11:00",
    end: "12:00",
    name: "Therapy session",
    type: "care" as const,
    location: "Therapy Rm 2",
    staff: "Dr. Nam",
    capacity: 2,
    registered: 0,
    note: "Patient requires special attention",
  },
];


const myResidents = [
  { id: "r1", name: "John Doe" },
  { id: "r2", name: "Jane Smith" },
];

// ---------- state lịch
function useCalendarState() {
  const [view, setView] = React.useState<"day" | "week">("week");
  const [cursor, setCursor] = React.useState<Date>(new Date());
  const [resident, setResident] = React.useState<string>("all");
  const startOfWeek = (d: Date) => {
    const copy = new Date(d);
    const day = (copy.getDay() + 6) % 7; // Mon=0
    copy.setDate(copy.getDate() - day);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const days = React.useMemo(() => {
    if (view === "day") return [new Date(cursor)];
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 86400000));
  }, [cursor, view]);
  const label = React.useMemo(() => {
    if (view === "day")
      return cursor.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    const first = days[0];
    const last = days[6];
    return `${first.toLocaleDateString(undefined, { day: "2-digit", month: "short" })} – ${last.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}`;
  }, [cursor, view, days]);
  return { view, setView, cursor, setCursor, days, label, resident, setResident };
}

function Calendar() {
  const { view, setView, cursor, setCursor, days, label, resident, setResident } = useCalendarState();
  const { setVisits } = useOutletContext<{ setVisits: React.Dispatch<React.SetStateAction<FamilyVisit[]>> }>();

  type CareEvent = {
    id: string;
    date: string;
    start: string;
    end: string;
    name: string;
    type: "care" | "visit";
    location: string;
    staff: string;
    capacity: number;
    registered: number;
    note: string;
    remainingSeats?: number;
  };

  const [eventsState, setEventsState] = useState<CareEvent[]>([]);

  useEffect(() => {
    // Fetch care events from API or shared state
    fetchCareEvents().then((events: CareEvent[]) => setEventsState(events));
  }, []);

  const handleSubmit = (newVisit: FamilyVisit) => {
    const startStr = String(
      (newVisit as any).start ?? (newVisit as any).time ?? (newVisit as any).startTime ?? "00:00"
    );
    const startHour = Number(startStr.split(":"[0]));
    if (startHour < 8 || startHour >= 17) {
      alert("Visits can only be scheduled between 08:00 and 17:00.");
      return;
    }

    createFamilyVisit(newVisit)
      .then((createdVisit) => {
        const cv = createdVisit as any;
        const familyVisit = {
          id: String(cv.id ?? `e${Date.now()}`),
          date: cv.date ?? newVisit.date,
          start: cv.start ?? (newVisit as any).start,
          end: cv.end ?? (newVisit as any).end,
          resident: cv.resident ?? newVisit.resident,
          family: cv.family ?? "Unknown",
          qr: cv.qr ?? false,
          notes: cv.notes ?? "",
        } as unknown as FamilyVisit;

        setVisits((prevVisits) => [...prevVisits, familyVisit]);
        setEventsState((prevEvents) => [
          ...prevEvents,
          {
            id: familyVisit.id,
            date: familyVisit.date,
            start: (familyVisit as any).start,
            end: (familyVisit as any).end,
            name: "Family visit",
            type: "visit",
            location: "Lobby A",
            staff: "Frontdesk",
            capacity: 1,
            registered: 1,
            note: familyVisit.notes || "",
          } as CareEvent,
        ]);
        alert("New family visit added successfully!");
      })
      .catch((err) => {
        console.error("Failed to create family visit:", err);
        alert("Failed to add visit. Please try again.");
      });
  };

  return (
    <div className="space-y-4 border border-gray-500 rounded-md">
      <Toolbar
        view={view}
        setView={setView}
        label={label}
        onPrev={() => setCursor(new Date(cursor.getTime() - (view === "day" ? 1 : 7) * 86400000))}
        onNext={() => setCursor(new Date(cursor.getTime() + (view === "day" ? 1 : 7) * 86400000))}
        onToday={() => setCursor(new Date())}
        resident={resident}
        setResident={setResident}
      />
      <div className="grid grid-cols-7 border-t border-gray-500">
        {days.map((d) => (
          <DayColumn
            key={d.toDateString()}
            date={d}
            items={eventsState}
            addEvent={(ev) => {

              const fv = {
                id: ev.id ?? `e${Date.now()}`,
                date: ev.date,
                start: (ev as any).start,
                end: (ev as any).end,

                resident: myResidents[0]?.id ?? "unknown",
                family: "Unknown",
                qr: false,
                priority: "0",
                notes: (ev as any).note ?? "",
              } as unknown as FamilyVisit;
              handleSubmit(fv);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- toolbar
function Toolbar({ view, setView, label, onPrev, onNext, onToday, resident, setResident, eventTypeFilter, setEventTypeFilter }: any) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between " style={{ width: '100%', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" onClick={onToday}>
          Today
        </Button>
        <div className="text-lg font-semibold ml-2">{label}</div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={view} onValueChange={(v: string) => setView(v as any)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resident} onValueChange={setResident}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="All residents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All residents</SelectItem>
            <SelectItem value="john">John Doe</SelectItem>
            <SelectItem value="jane">Jane Smith</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Input placeholder="Search events…" className="pl-9 w-[220px]" />
          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-[150px] flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span>Filter</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="care">Care</SelectItem>
            <SelectItem value="visit">Visit</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

const DAILY_VISIT_LIMIT = 5;

function EmptySlot({
  time, date, activeSlot, setActiveSlot, addEvent, events, disabled = false
}: {
  time: string;
  date: Date;
  activeSlot: string | null;
  setActiveSlot: React.Dispatch<React.SetStateAction<string | null>>;
  addEvent: (ev: {
    id: string; date: string; start: string; end: string; name: string;
    type: "care" | "visit"; location: string; staff: string;
    capacity: number; registered: number; note: string;
  }) => void;
  events: Array<{ id: string; date: string; start: string; end: string; type: "care" | "visit"; capacity: number; registered: number; name: string; location: string; staff: string; note: string; }>;
  disabled?: boolean;
}) {
  const isActive = activeSlot === time;
  const dayISO = date.toISOString().slice(0, 10);

  const dailyVisitCount = events.filter(e => e.date === dayISO && e.type === "visit").length;
  const isVisitLimitReached = dailyVisitCount >= DAILY_VISIT_LIMIT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVisitLimitReached) return;

    const startHour = Number(time.split(":")[0]);
    if (startHour < 8 || startHour >= 17) {
      alert("Visits can only be scheduled between 08:00 và 17:00.");
      return;
    }

    addEvent({
      id: `e${Date.now()}`,
      date: dayISO,
      start: time,
      end: `${String(Number(time.split(":")[0]) + 1).padStart(2, "0")}:00`,
      name: "Family visit",
      type: "visit",
      location: "Lobby A",
      staff: "Frontdesk",
      capacity: 1,
      registered: 1,
      note: "",
    });
    setActiveSlot(null);
  };

  return (
    <div className="h-16 border-t text-[11px] text-slate-400 pl-1 flex items-start">
      <button
        className={`w-full h-full bg-transparent hover:bg-blue-50 ${disabled ? "pointer-events-none hover:bg-transparent" : ""}`}
        onClick={() => !disabled && setActiveSlot(time)}
        disabled={disabled || isVisitLimitReached}
      >
        {time}
      </button>

      {isActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg p-6 rounded-md w-[300px] relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setActiveSlot(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold">Schedule a Visit</h3>
            {isVisitLimitReached ? (
              <div className="text-red-500 text-sm">Maximum daily visits reached.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="date" defaultValue={dayISO} required />
                <Input type="time" defaultValue={time} required />
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select resident" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Submit</Button>
                  <Button type="button" variant="ghost" onClick={() => setActiveSlot(null)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResidentCombobox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
}) {
  // Simple wrapper around the existing Select components to provide a typed combobox
  return (
    <Select value={value ?? ""} onValueChange={(v: string) => onChange(v || null)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id}>
            {o.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EventBlock({ ev }: { ev: typeof events[number] }) {
  const SLOT_PX = 64;
  const BORDER_PX = 1;
  const PX_PER_MIN = SLOT_PX / 60;

  const startMin = toMinutes(ev.start);
  const endMin = toMinutes(ev.end);
  const durMin = Math.max(0, endMin - startMin);

  const startHour = Math.floor(startMin / 60);
  const startMinute = startMin % 60;

  const hourBoundariesCrossed =
    Math.max(0, Math.floor((endMin - 1) / 60) - Math.floor(startMin / 60));

  const top =
    startHour * SLOT_PX +
    startHour * BORDER_PX +
    startMinute * PX_PER_MIN;

  const height = Math.max(
    36,
    durMin * PX_PER_MIN + hourBoundariesCrossed * BORDER_PX
  );

  const [mine, setMine] = React.useState(false);
  const [count, setCount] = React.useState(ev.registered);
  const [selectedResident, setSelectedResident] = React.useState<string | null>(null);
  const full = count >= ev.capacity;
  const remaining = Math.max(ev.capacity - count, 0);

  const color =
    ev.type === "visit" ? "bg-amber-50 ring-amber-200" : "bg-sky-50 ring-sky-200";

  const canRegister =
    ev.type === "visit" ? !!selectedResident && !mine && !full : !mine && !full;

  const onRegister = () => {
    if (!canRegister) return;
    setMine(true);
    setCount((c) => Math.min(ev.capacity, c + 1));
  };
  const onCancel = () => {
    if (!mine) return;
    setMine(false);
    setCount((c) => Math.max(0, c - 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`absolute left-1 right-1 rounded-xl ring-1 text-left p-2 shadow-sm hover:shadow ${color} z-20`}
          style={{ top, height }}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm truncate">{ev.name}</div>
            <Badge variant={full ? "destructive" : "secondary"}>
              <Users className="h-3.5 w-3.5 mr-1" />
              {count}/{ev.capacity}
            </Badge>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card className="shadow-none border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {ev.name}
              <Badge variant="outline">{ev.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4" /> {ev.start}–{ev.end}
            </div>
            <div className="text-slate-600">Loc: {ev.location}</div>
            <div className="text-slate-600">Staff: {ev.staff}</div>
            <div className="text-slate-600">
              Note: {ev.note || "No notes available"}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3.5 w-3.5 mr-1" />
                {count}/{ev.capacity}
              </Badge>
              {full ? (
                <Badge variant="destructive">Full</Badge>
              ) : (
                <span className="text-slate-500 text-xs">
                  Remaining: <b>{remaining}</b>
                </span>
              )}
            </div>


            {ev.type === "visit" && (
              <div className="space-y-1">
                <div className="text-xs text-slate-500">Resident</div>
                <ResidentCombobox
                  value={selectedResident}
                  onChange={setSelectedResident}
                  options={myResidents}
                  placeholder="Select resident…"
                />
              </div>
            )}

            <div className="pt-1 flex gap-2">
              <Button
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={onRegister}
                disabled={!canRegister}
              >
                {mine ? "Registered" : "Register"}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={!mine}>
                Cancel
              </Button>
            </div>

          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function DayColumn({
  date,
  items,
  addEvent,
}: {
  date: Date;
  items: Array<{
    id: string;
    date: string;
    start: string;
    end: string;
    name: string;
    type: "care" | "visit";
    location: string;
    staff: string;
    capacity: number;
    registered: number;
    note: string;
  }>;
  addEvent: (ev: {
    id: string;
    date: string;
    start: string;
    end: string;
    name: string;
    type: "care" | "visit";
    location: string;
    staff: string;
    capacity: number;
    registered: number;
    note: string;
  }) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const dayISO = date.toISOString().slice(0, 10);
  const dayEvents = items.filter((e) => e.date === dayISO);
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  return (
    <div className="col-span-1 border-r min-h-[1024px] relative">
      <div className="h-10 flex items-center justify-center text-xs border-b">
        {date.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" })}
      </div>
      <div className="relative">
        {hours.map((h) => (
          <EmptySlot
            key={h}
            time={h}
            date={date}
            activeSlot={activeSlot}
            setActiveSlot={setActiveSlot}
            addEvent={addEvent}
            events={items}
          />
        ))}

        {dayEvents.map((ev) => (
          <EventBlock key={ev.id} ev={ev as any} />
        ))}
      </div>
    </div>
  );
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function WeeklyDailyCalendar() {
  const [activeButton, setActiveButton] = useState<string>("Event");
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-4" style={{ width: '100%', overflowX: 'auto', maxWidth: '100vw' }}>
      {/* Top horizontal sidebar (fixed) */}
      <div className="fixed top-0 left-0 w-full bg-[#5985D8] text-white shadow-md z-50">
        <div className="flex justify-around items-center py-4">
          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Monitor health records" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Monitor health records");
              navigate("/monitor-health-records");
            }}
          >
            Monitor health records
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Diary" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Diary");
              navigate("/diary");
            }}
          >
            Diary
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Notifications" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Notifications");
              navigate("/notifications");
            }}
          >
            Notifications
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Schedule Visit" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Schedule Visit");
              navigate("/register-visit");
            }}
          >
            Schedule Visit
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Feedback" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Feedback");
              navigate("/feedback");
            }}
          >
            Feedback
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Payment" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Payment");
              navigate("/payment");
            }}
          >
            Payment
          </button>
        </div>
      </div>

      {/* spacer to offset fixed top bar height */}
      <div style={{ height: 64 }} />

      {/* Toolbar */}
      <Calendar />

      {/* Legend for event types */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2 text-left">Event Type Legend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-100 border border-sky-200 rounded"></div>
            <span>Care Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded"></div>
            <span>Family Visit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border border-red-500 rounded"></div>
            <span>No Seat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyDailyCalendar;