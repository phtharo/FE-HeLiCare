//resident's schedule : view calendar, register/cancel care event


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
} from "lucide-react";
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
  const [residentSchedule, setResidentSchedule] = useState<CareEvent[]>([]);

  useEffect(() => {
    // Fetch care events from API or shared state
    fetchCareEvents().then((events: CareEvent[]) => setEventsState(events));

    // Fetch resident-specific schedules created by staff
    fetchResidentSchedule().then((schedule: CareEvent[]) => setResidentSchedule(schedule));

    // Fetch new visit event from family register visit
    fetchNewVisitEvent().then((newEvent: CareEvent) => {
      setEventsState((prevEvents) => [...prevEvents, newEvent]);
    });
  }, []);

  return (
    <div className="space-y-4 border border-gray-500 rounded-md" style={{ width: '100%', maxWidth: '2000px', margin: '0 auto' }}>
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
      <div className="grid grid-cols-7 border-t border-gray-500 min-w-[1100px]" style={{ gridTemplateColumns: 'repeat(7, 1fr)', width: '100%' }}>
        {days.map((d) => (
          <DayColumn
            key={d.toDateString()}
            date={d}
            items={[...eventsState, ...residentSchedule]}
          />
        ))}
      </div>
    </div>
  );
}

async function fetchResidentSchedule(): Promise<any[]> {
  // Mock API call to fetch resident-specific schedules
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve([
        {
          id: "r1",
          date: "2025-10-22",
          start: "10:00",
          end: "11:00",
          name: "Physical Therapy",
          type: "care",
          location: "Therapy Room",
          staff: "Dr. Smith",
          capacity: 1,
          registered: 1,
          note: "Scheduled by staff",
        },
        {
          id: "r2",
          date: "2025-10-23",
          start: "14:00",
          end: "15:00",
          name: "Speech Therapy",
          type: "care",
          location: "Speech Room",
          staff: "Dr. Brown",
          capacity: 1,
          registered: 1,
          note: "Scheduled by staff",
        },
      ]),
      200
    )
  );
}

// Mock API to simulate receiving new events from family register visit
const fetchNewVisitEvent = async (): Promise<any> => {
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({
        id: "e4",
        date: "2025-10-24",
        start: "16:00",
        end: "17:00",
        name: "Family visit",
        type: "visit",
        location: "Lobby B",
        staff: "Receptionist",
        capacity: 4,
        registered: 2,
        note: "Bring ID for verification",
      }),
      500
    )
  );
};

// ---------- toolbar
function Toolbar({ view, setView, label, onPrev, onNext, onToday }: any) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" style={{ width: '100%', margin: '0 auto' }}>
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
        <div className="relative">
          <Input placeholder="Search events…" className="pl-9 w-[220px]" />
          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function EmptySlot({
  time, disabled = false
}: {
  time: string;
  disabled?: boolean;
}) {
  return (
    <div className="h-16 border-t text-[11px] text-slate-400 pl-1 flex items-start">
      <div
        className={`w-full h-full bg-transparent ${disabled ? "pointer-events-none" : ""}`}
      >
        {time}
      </div>
    </div>
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
  const full = count >= ev.capacity;
  const remaining = Math.max(ev.capacity - count, 0);

  const color =
    ev.type === "visit" ? "bg-amber-50 ring-amber-200" : "bg-sky-50 ring-sky-200";

  const canRegister =
    ev.type === "visit" ? !mine && !full : !mine && !full;

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
        {hours.map((time) => (
          <EmptySlot
            key={time}
            time={time}
            disabled={false}
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
            className={`px-4 py-2 font-semibold ${activeButton === "Schedule" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Schedule");
              navigate("/resident-schedule");
            }}
          >
            Schedule
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "Notification" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("Notification");
              navigate("/resident-notification");
            }}
          >
            Notification
          </button>

          {/* <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "RegisterEvent" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("RegisterEvent");
              navigate("/register-event");
            }}
          >
            Register Event
          </button> */}

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "VideoCall" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("VideoCall");
              navigate("/video-call");
            }}
          >
            Video Call
          </button>

          <button
            type="button"
            className={`px-4 py-2 font-semibold ${activeButton === "SOS" ? "bg-white text-black" : "hover:bg-[#4773c1]"}`}
            onClick={() => {
              setActiveButton("SOS");
              navigate("/sos");
            }}
          >
            SOS
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