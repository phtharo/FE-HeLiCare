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
    date: "2025-11-08",
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
    date: "2025-11-05",
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
    id: "e4",
    date: "2025-11-06",
    start: "15:00",
    end: "16:30",
    name: "Family visit",
    type: "visit" as const,
    location: "Lobby A",
    staff: "Frontdesk",
    capacity: 1,
    registered: 0,
    note: "",
  },
  {
    id: "e3",
    date: "2025-11-04",
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
  time: string; // Added
  seats: number; // Added
  maxSeats: number; // Added
  description: string; // Added
};

// ---------- state lịch
function useCalendarState() {
  const [view, setView] = React.useState<"day" | "week">("week");
  const [cursor, setCursor] = React.useState<Date>(new Date());
  const startOfWeek = (d: Date) => {
    const copy = new Date(d);
    const day = (copy.getDay() + 6) % 7; // Mon=0
    copy.setDate(copy.getDate() - day);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  // Ensure the `days` array includes all seven days of the week
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
  return { view, setView, cursor, setCursor, days, label };
}

function Calendar() {
  const { view, setView, cursor, setCursor, days, label } = useCalendarState();

  const [eventsState, setEventsState] = useState<CareEvent[]>([]);
  const [residentSchedule, setResidentSchedule] = useState<CareEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCareEvents().then((events: CareEvent[]) => setEventsState(events));
    fetchResidentSchedule().then((schedule: CareEvent[]) => setResidentSchedule(schedule));
  }, []);

  useEffect(() => {
    if (view === "day") {
      setCursor(new Date()); // Automatically set the cursor to the current date when switching to daily view
    }
  }, [view]);

  const filteredEvents = React.useMemo(() => {
    const all = [...eventsState, ...residentSchedule];
    const term = searchTerm.toLowerCase();
    let res = all.filter((event) =>
      event.name.toLowerCase().includes(term) ||
      event.note.toLowerCase().includes(term)
    );
    if (view === "day" && days.length > 0) {
      const selectedDate = days[0].toISOString().slice(0, 10);
      res = res.filter((event) => event.date === selectedDate);
    }
    return res;
  }, [eventsState, residentSchedule, searchTerm, view, days]);

  return (
    <div className="space-y-4 border border-gray-500 rounded-md mx-auto" style={{ width: '100%', maxWidth: '2000px', margin: '0 auto' }}>
      <Toolbar
        view={view}
        setView={setView}
        label={label}
        onPrev={() => setCursor(new Date(cursor.getTime() - (view === "day" ? 1 : 7) * 86400000))}
        onNext={() => setCursor(new Date(cursor.getTime() + (view === "day" ? 1 : 7) * 86400000))}
        onToday={() => setCursor(new Date())}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div
        className={`grid ${view === "day" ? "grid-cols-1" : "grid-cols-7"} border-t border-gray-500 min-w-[1200px] mx-auto`}
        style={{ gridTemplateColumns: view === "day" ? "1fr" : "repeat(7, 1fr)", width: '100%' }}
      >
        {days.map((d) => (
          <DayColumn
            key={d.toDateString()}
            date={d}
            items={filteredEvents}
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
          date: "2025-11-06",
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
          date: "2025-11-07",
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

// ---------- toolbar
function Toolbar({ view, setView, label, onPrev, onNext, onToday, searchTerm, setSearchTerm }: any) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between " style={{ width: '100%', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" className="bg-gray-400 hover:bg-gray-400 text-white" onClick={onToday}>
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
          <Input
            placeholder="Search events…"
            className="pl-9 w-[220px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function EmptySlot({
  time, disabled = false, style
}: {
  time: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className="h-[60px] border-t text-[14px] text-slate-400 pl-1 flex items-center" style={style}>
      <div
        className={`w-full h-full bg-transparent ${disabled ? "pointer-events-none" : ""}`}
      >
        {time}
      </div>
    </div>
  );
}

function EventBlock({ ev }: { ev: typeof events[number] }) {
  const SLOT_PX = 80;
  const PX_PER_MIN = SLOT_PX / 60;
  const DAY_START_MIN = 8 * 60;

  const navigate = useNavigate();

  const startMin = toMinutes(ev.start);
  const endMin = toMinutes(ev.end);
  const durMin = Math.max(0, endMin - startMin);

  const top = (startMin - DAY_START_MIN) * PX_PER_MIN;

  const height = durMin * PX_PER_MIN;
  const [mine, setMine] = React.useState(false);
  const [count, setCount] = React.useState(ev.registered);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const full = count >= ev.capacity;
  const remaining = Math.max(ev.capacity - count, 0);

  // card color
  const color =
    ev.type === "visit"
      ? mine
        ? "bg-amber-200 ring-amber-300" // Darker color
        : "bg-amber-50 ring-amber-200"
      : mine
        ? "bg-sky-300 ring-sky-400"
        : "bg-sky-50 ring-sky-200";

  const canRegister =
    ev.type === "visit" ? !mine && !full : !mine && !full;

  const onRegister = () => {
    if (!canRegister) return;
    setShowConfirmModal(true);
  };
  const onCancel = () => {
    if (!mine) return;
    setShowCancelModal(true);
  };

  const handleConfirmRegistration = () => {
    setMine(true);
    setCount((c) => Math.min(ev.capacity, c + 1));
    setShowConfirmModal(false);
  };

  const handleConfirmCancel = () => {
    setMine(false);
    setCount((c) => Math.max(0, c - 1));
    setShowCancelModal(false);
  };

  const handleOpenQR = () => {
    if (!mine) return;
    navigate("/booking-status-qr", {
      state: {
        bookingId: ev.id,
        residentName: "Nguyễn Văn A",
        time: `${ev.date}T${ev.start}`,
        status: "CONFIRMED" as const,
      },
    });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`absolute inset-x-1 rounded-xl border border-gray-200 ring-1 text-center p-2 shadow-sm hover:shadow ${color} z-20`}
            style={{ top, height }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="font-medium text-xs text-left truncate">{ev.name}</div>
              <Badge variant={full ? "destructive" : "secondary"}>
                <Users className="h-3.5 w-3.5 mr-1" />
                {count}/{ev.capacity}
              </Badge>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-90">
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
                {ev.type === "visit" && (
                  <Button
                    size="sm"
                    className="bg-sky-500 text-white hover:bg-sky-600"
                    onClick={handleOpenQR}
                    disabled={!mine}
                  >
                    QR Code
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirmModal(false)}
          />

          
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Registration
            </h2>
            <p className="text-sm mb-4">
              Are you sure you want to register for the event "{ev.name}" on{" "}
              {ev.date} from {ev.start} to {ev.end}?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleConfirmRegistration}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            <p className="text-sm mb-4">
              Are you sure you want to cancel your registration for the event "{ev.name}" on {ev.date} from {ev.start} to {ev.end}?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                Cancel
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleConfirmCancel}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
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
  const SLOT_PX = 80;
  const hours = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`); // from 8:00 to 20:00

  return (
    <div className="col-span-1 border-r min-h-[800px] ">
      <div className="h-15 flex items-center justify-center text-base border-b">
        {date.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" })}
      </div>
      <div className="relative w-full overflow-hidden">
        {hours.map((time) => (
          <EmptySlot
            key={time}
            time={time}
            disabled={false}
            style={{ height: SLOT_PX }}
          />
        ))}

        {items.filter((e) => e.date === date.toISOString().slice(0, 10)).map((ev) => (
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
  return (
    <div className="bg-white px-6 py-6 rounded-2xl shadow-sm w-[1250px] -mt-13 -ml-10">
      <div className="flex-1  flex flex-col w-[1200px] bg-white overflow-x-hidden rounded-xl border border-gray-200">

        {/* Toolbar */}
        <Calendar />

        {/* Legend for event types */}
        <div className="mt-6 border-t  p-6">
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
    </div>
  );
}

export default WeeklyDailyCalendar;