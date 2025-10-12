//lỗi bộ lọc so sánh staff id và tên => hiển thị new event sai 
import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Funnel } from "lucide-react";
import { SearchIcon } from "@heroicons/react/solid";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import type { CareEvent, FamilyVisit } from "../layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { MoreVertical } from "lucide-react"; // Import the MoreVertical icon
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu"; // Import DropdownMenu components


type FilterState = {
  from?: string;   // YYYY-MM-DD
  to?: string;     // YYYY-MM-DD
  priority?: "low" | "normal" | "high" | "urgent" | "all";
  staff?: string | "all";
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  staffOptions: Array<{ id: string; name: string }>;
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

// Wrap the main application component
export default function StaffManageEvent(): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const { care, visits } = useOutletContext<{
      care: CareEvent[];
      visits: FamilyVisit[];
    }>();

    const [activeButton, setActiveButton] = useState<string>("Medical");
    const [filters, setFilters] = useState<FilterState>({ priority: "all", staff: "all" });

    // 2) Handle new events from location.state
    useEffect(() => {
        console.log("[Manage] location.state:", location.state);
        const ev = location.state?.newEvent as
            | ({ kind: "care" } & Partial<CareEvent>)
            | ({ kind: "visit" } & Partial<FamilyVisit>)
            | undefined;

        if (!ev) return;
        console.log("[Manage] newEvent:", ev);

        if (ev.kind === "care") {
            const mapped: CareEvent = {
                id: ev.id ?? crypto.randomUUID(),
                priority: (ev.priority ?? "normal") as CareEvent["priority"],
                resident: ev.resident ?? "",
                datetimeISO: ev.datetimeISO!,
                dateISO: ev.dateISO!,
                datetimeLabel: ev.datetimeLabel!,
                staffName: ev.staffName ?? "", 
                location: ev.location ?? "",
                type: ev.type ?? "General", 
            };
          
        } else if (ev.kind === "visit") {
            const mapped: FamilyVisit = {
                id: ev.id ?? crypto.randomUUID(),
                priority: ev.priority ?? "Normal",
                resident: ev.resident ?? "",
                datetime: ev.datetime ?? "",
                family: ev.family ?? "",
                qr: Boolean(ev.qr),
            };
          
        }

        
        setFilters({ from: "", to: "", priority: "all", staff: "all" });

        navigate(location.pathname, { replace: true, state: {} });
    }, [location.state, navigate, location.pathname]);

    //filter
    const toNum = (d?: string) => (d ? Number(d.replaceAll("-", "")) : undefined);
    const fNum = toNum(filters.from);
    const tNum = toNum(filters.to);
    const validRange = !fNum || !tNum || fNum <= tNum;

    const filteredCareEvents = care.filter(e => {
        const dNum = toNum(e.dateISO);

        if (validRange) {
            if (fNum && (dNum ?? 0) < fNum) return false;
            if (tNum && (dNum ?? 99999999) > tNum) return false;
        }

        const prOk = !filters.priority || filters.priority === "all" || e.priority === filters.priority;
        const stOk = !filters.staff || filters.staff === "all" || e.staffName.toLowerCase() === (filters.staff as string).toLowerCase();
        return prOk && stOk;
    });

    const filteredFamilyVisits = visits; 

    const staffOptions = [
        { id: "s1", name: "Nurse Linh" },
        { id: "s2", name: "Nurse Hoa" },
        { id: "s3", name: "Dr. Nam" },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Nền gradient cố định */}
            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

            {/* Main content */}
            <div className="relative h-full overflow-y-auto pt-4 md:pt-8 lg:pt-0">
                <div className="flex min-h-full gap-4 lg:gap-6">
                    <aside className="w-[240px] shrink-0 relative translate-x-3 lg:translate-x-4">
                        {/* Sidebar with functionality buttons */}
                        <div className="mt-4 w-full rounded-2xl bg-white/90 backdrop-blur-md ring-1 ring-black/5 shadow-md flex flex-col py-4 gap-5">
                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Medical" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Medical")}
                            >
                                Medical & Health Record Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "DailyLife" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("DailyLife")}
                            >
                                Daily Life & Nutrition Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Incident" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Incident")}
                            >
                                Incident & Emergency Handling
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Room" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Room")}
                            >
                                Room & Facility Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Communication" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Communication")}
                            >
                                Communication & Reporting
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Visitation" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Visitation")}
                            >
                                Visitation & Access Control
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Payments" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                onClick={() => setActiveButton("Payments")}
                            >
                                Payments & Additional Services
                            </button>
                        </div>
                    </aside>
                    <main className="mx-auto w-full max-w-10xl p-4 lg:p-6">
                        <div className="rounded-3xl bg-white/90 backdrop-blur border border-black/5 shadow-lg h-full">
                            <div className="px-6 pt-6 pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h1 className="text-2xl">Manage Event</h1>

                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Add Event Button */}
                                        <button
                                          type="button"
                                          className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-gray-100 focus:outline-none"
                                          aria-label="Add Event"
                                          onClick={() => navigate("/staff-create-event")}
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

                                        {/* Search Input and Button */}
                                        <div className="flex w-full max-w-sm items-center gap-2">
                                            <Input placeholder="Search..." className="h-10 rounded-2xl flex-1" />
                                            <button
                                                type="button"
                                                className="h-10 px-3 rounded-2xl bg-slate-900 text-white"
                                            >
                                                <SearchIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        {/* Filter Button */}
                                        <FilterButton
                                            value={filters}
                                            onChange={setFilters}
                                            staffOptions={staffOptions}
                                        />
                                        {/* Notification Icon */}
                                        <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Notification">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22.5c1.5 0 2.25-.75 2.25-2.25h-4.5c0 1.5.75 2.25 2.25 2.25zm6.75-6.75v-4.5c0-3.75-2.25-6-6-6s-6 2.25-6 6v4.5l-1.5 1.5v.75h15v-.75l-1.5-1.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="px-2 pb-2">
                                <div className="space-y-6">
                                    <div className="mt-6 grid grid-cols-5 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-12">
                                        {care.map((e) => (
                                            <Card key={e.id} className="rounded-2xl bg-sky-50 ring-1 ring-sky-100 relative" style={{ width: '240px' }}>
                                              <CardHeader>
                                                <CardTitle>Care Event</CardTitle>
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
                                                      <MoreVertical className="h-5 w-5" />
                                                    </button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => console.log('Edit clicked', e.id)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => console.log('Delete clicked', e.id)}>Delete</DropdownMenuItem>
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              </CardHeader>
                                              <CardContent>
                                                <ul className="space-y-2 text-sm text-left">
                                                  <li><span className="font-medium">Priority:</span> {e.priority}</li>
                                                  <li><span className="font-medium">Care Type:</span> {e.type || "N/A"}</li>
                                                  <li><span className="font-medium">Resident:</span> {e.resident}</li>
                                                  <li className="flex items-center gap-1">
                                                      <span className="font-medium">Time:</span> {e.datetimeLabel}
                                                  </li>
                                                  <li><span className="font-medium">Staff:</span> {e.staffName}</li>
                                                  <li><span className="font-medium">Location:</span> {e.location}</li>
                                                  
                                                </ul>
                                              </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="mt-6 grid grid-cols-5 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-12">
                                        {visits.map((v) => (
                                            <Card key={v.id} className="rounded-2xl bg-amber-50 ring-1 ring-amber-100 relative" style={{ width: '240px' }}>
                                              <CardHeader>
                                                <CardTitle>Family Visit</CardTitle>
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
                                                      <MoreVertical className="h-5 w-5" />
                                                    </button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => console.log('Edit clicked', v.id)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => console.log('Delete clicked', v.id)}>Delete</DropdownMenuItem>
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              </CardHeader>
                                              <CardContent>
                                                <ul className="space-y-2 text-sm text-left">
                                                  
                                                  <li><span className="font-medium">Resident:</span> {v.resident}</li>
                                                  <li className="flex items-center gap-1">
                                                    <span className="font-medium">Time:</span> {v.datetime}
                                                  </li>
                                                  <li><span className="font-medium">Family:</span> {v.family}</li>
                                                  <li>
                                                      <span className="font-medium">QR:</span> {v.qr ? "Enabled" : "Disabled"}
                                                  </li>
                                                </ul>
                                              </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}