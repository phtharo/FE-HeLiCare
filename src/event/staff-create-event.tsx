// Form for staff to create/edit/delete events
import React, { useMemo, useState } from "react";
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
//import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, Clock, QrCode } from "lucide-react";
// import { SearchIcon } from "@heroicons/react/solid";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { CareEvent, FamilyVisit } from "../layout/AppLayout";

/** ────────────────────────────────────────────────────────────────────────────
 *  Types
 *  ──────────────────────────────────────────────────────────────────────────── */
type EventKind = "care" | "visit";
type CareType = "vital_check" | "medication" | "hygiene" | "therapy" | "meal";
type Frequency = "none" | "daily" | "weekly" | "monthly";

type StaffOption = { id: number; name: string };
type ResidentOption = { id: number; name: string };

/** Mock options (thay = API thực) */
const STAFFS: StaffOption[] = [
    { id: 41, name: "Nurse Linh" },
    { id: 42, name: "Nurse Khoa" },
    { id: 45, name: "Caregiver Minh" },
];
const RESIDENTS: ResidentOption[] = [
    { id: 101, name: "John Doe" },
    { id: 102, name: "Jane Smith" },
    { id: 103, name: "Nguyen Van A" },
];

/** Build RRULE cơ bản */
function buildRRule(freq: Frequency, dt: string) {
    if (freq === "none" || !dt) return null;
    const d = new Date(dt);
    const h = d.getHours();
    const m = d.getMinutes();
    const BYHOUR = `BYHOUR=${h}`;
    const BYMINUTE = `BYMINUTE=${m}`;
    if (freq === "daily") return `FREQ=DAILY;${BYHOUR};${BYMINUTE}`;
    if (freq === "weekly")
        return `FREQ=WEEKLY;BYDAY=${["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()]};${BYHOUR};${BYMINUTE}`;
    if (freq === "monthly") return `FREQ=MONTHLY;BYMONTHDAY=${d.getDate()};${BYHOUR};${BYMINUTE}`;
    return null;
}

/** ────────────────────────────────────────────────────────────────────────────
 *  Page
 *  ──────────────────────────────────────────────────────────────────────────── */
export default function StaffCreateEvent(): React.JSX.Element {
    const navigate = useNavigate();
    const { care, setCare, visits, setVisits } = useOutletContext<{
        care: CareEvent[];
        setCare: React.Dispatch<React.SetStateAction<CareEvent[]>>;
        visits: FamilyVisit[];
        setVisits: React.Dispatch<React.SetStateAction<FamilyVisit[]>>;
    }>();

    // Loại sự kiện
    const [kind, setKind] = useState<EventKind>("care");

    // Common fields
    const [residentId, setResidentId] = useState<number | null>(101);
    const [scheduledAt, setScheduledAt] = useState<string>(""); // datetime-local
    const [endAt, setEndAt] = useState<string>(""); // End datetime-local
    const [notes, setNotes] = useState("");

    // Care-only
    const [careType, setCareType] = useState<CareType>("vital_check");
    const [assignedStaffId, setAssignedStaffId] = useState<number | null>(41);
    const [room, setRoom] = useState<string>("101");
    const [bed, setBed] = useState<string>("1");
    const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
    const [freq, setFreq] = useState<Frequency>("none");

    // Medication extra (nếu careType=medication)
    const [medName, setMedName] = useState("");
    const [medDose, setMedDose] = useState("");

    // Visit-only
    const [familyUserId, setFamilyUserId] = useState<number | null>(987);
    const [createQR, setCreateQR] = useState<boolean>(true);

    // Add state for activeButton and setActiveButton
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const rrule = useMemo(() => buildRRule(freq, scheduledAt), [freq, scheduledAt]);

    const valid = useMemo(() => {
        if (!residentId || !scheduledAt) return false;
        if (kind === "care") {
            if (!assignedStaffId) return false;
            if (careType === "medication" && (!medName.trim() || !medDose.trim())) return false;
        } else {
            if (!familyUserId) return false;
        }
        return true;
    }, [residentId, scheduledAt, kind, assignedStaffId, careType, medName, medDose, familyUserId]);

    function onCreate(e: React.FormEvent) {
        e.preventDefault();

        const now = new Date();
        const start = new Date(scheduledAt);
        const end = new Date(endAt);

        // 1. Không được ở quá khứ
        if (start < now) {
            setValidationError("The start time cannot be in the past.");
            return;
        }

        // 2. Thứ tự hợp lệ
        if (end <= start) {
            setValidationError("The end time must be after the start time.");
            return;
        }

        const duration = (end.getTime() - start.getTime()) / (1000 * 60); // Duration in minutes
        if (duration < 5 || duration > 20160) { // 20160 minutes = 2 weeks
            setValidationError("The event duration must be between 5 minutes and 2 weeks.");
            return;
        }

        // 3. Khoảng báo trước (lead time)
        const leadTime = (start.getTime() - now.getTime()) / (1000 * 60); // Lead time in minutes
        if (leadTime < 15) {
            setValidationError("The event must be created at least 15 minutes in advance.");
            return;
        }

        // 4. Giới hạn tầm nhìn (horizon)
        const horizon = (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30); // Horizon in months
        if (horizon > 12) {
            setValidationError("The event cannot be scheduled more than 12 months in advance.");
            return;
        }

        setValidationError(null); // Clear any previous errors

        if (!valid) return;

        const startISO = new Date(scheduledAt).toISOString();
        const dateISO  = startISO.split("T")[0];
        const label    = new Date(scheduledAt).toLocaleString();

        if (kind === "care") {
            const newEventCare: CareEvent = {
                id: crypto.randomUUID(),
                priority,
                resident: RESIDENTS.find(r => r.id === residentId)?.name ?? "Unknown",
                datetimeISO: startISO,
                dateISO,
                datetimeLabel: label,
                staffName: STAFFS.find(s => s.id === assignedStaffId)?.name ?? "",
                location: `Room ${room} / Bed ${bed}`,
                type: careType,
            };

            setCare(prev => [newEventCare, ...prev]);
            navigate("/staff-manage-event");
            return;
        }

        const newEventVisit: FamilyVisit = {
            id: crypto.randomUUID(),
            priority: "Normal",
            resident: RESIDENTS.find(r => r.id === residentId)?.name ?? "Unknown",
            datetime: label,
            family: familyUserId === 987 ? "Pham T. (Father)" : "Le H. (Daughter)",
            qr: createQR,
        };

        setVisits(prev => [newEventVisit, ...prev]);
        navigate("/staff-manage-event");
    }

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Nền gradient cố định */}
            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

            <div className="relative h-full overflow-y-auto pt-4 md:pt-8 lg:pt-0">
                <div className="flex min-h-full gap-4 lg:gap-6">
                    <aside className="w-[240px] shrink-0 relative translate-x-3 lg:translate-x-4">
                        {/* Sidebar with functionality buttons */}
                        <div className="mt-4 w-full rounded-2xl bg-white/90 backdrop-blur-md ring-1 ring-black/5 shadow-md flex flex-col py-4 gap-5">
                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Medical" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Medical")}
                            >
                                Medical & Health Record Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "DailyLife" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("DailyLife")}
                            >
                                Daily Life & Nutrition Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Incident" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Incident")}
                            >
                                Incident & Emergency Handling
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Room" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Room")}
                            >
                                Room & Facility Management
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Communication" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Communication")}
                            >
                                Communication & Reporting
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Visitation" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Visitation")}
                            >
                                Visitation & Access Control
                            </button>

                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2 font-semibold ${activeButton === "Payments" ? "bg-[#5985D8] text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={() => setActiveButton("Payments")}
                            >
                                Payments & Additional Services
                            </button>
                        </div>
                    </aside>
                    <main className="mx-auto w-full max-w-10xl p-4 lg:p-6">
                        <div className="rounded-3xl bg-white/90 backdrop-blur border border-black/5 shadow-lg">
                            <CardHeader className="px-6 pt-6 pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <ArrowLeft className="h-5 w-5 text-slate-700 cursor-pointer" />
                                        <div>
                                            <CardTitle className="text-xl">Create Event</CardTitle>
                                            <CardDescription>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                                        </div>
                                    </div>
                                    
                                </div>
                            </CardHeader>

                            <CardContent className="px-6 pb-6">
                                <form onSubmit={onCreate} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Left column */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="rounded-2xl">
                                            <CardHeader>
                                                <CardTitle>Event details</CardTitle>
                                                <CardDescription>Choose type and fill required information</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-4 md:grid-cols-2">
                                                {/* Kind */}
                                                <div className="flex flex-col gap-1">
                                                    <Label>Event kind</Label>
                                                    <Select value={kind} onValueChange={(v) => setKind(v as EventKind)}>
                                                        <SelectTrigger><SelectValue placeholder="Select kind" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="care">Care event</SelectItem>
                                                            <SelectItem value="visit">Family visit</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Resident */}
                                                <div className="flex flex-col gap-1">
                                                    <Label>Resident *</Label>
                                                    <Select
                                                        value={residentId?.toString() ?? ""}
                                                        onValueChange={(v) => setResidentId(Number(v))}
                                                    >
                                                        <SelectTrigger><SelectValue placeholder="Select resident" /></SelectTrigger>
                                                        <SelectContent>
                                                            {RESIDENTS.map(r => (
                                                                <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Date time */}
                                                <div className="flex flex-col gap-1">
                                                    <Label>Date & time *</Label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
                                                                if (input) input.showPicker();
                                                            }}
                                                        />
                                                        <Input
                                                            type="datetime-local"
                                                            className="pl-8"
                                                            value={scheduledAt}
                                                            onChange={(e) => setScheduledAt(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* End Date time */}
                                                <div className="flex flex-col gap-1">
                                                    <Label>End Date & time *</Label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[name="end-datetime"]') as HTMLInputElement;
                                                                if (input) input.showPicker();
                                                            }}
                                                        />
                                                        <Input
                                                            name="end-datetime"
                                                            type="datetime-local"
                                                            className="pl-8"
                                                            value={endAt}
                                                            onChange={(e) => setEndAt(e.target.value)}
                                                        />
                                                    </div>
                                                    {validationError && <p className="text-xs text-red-600">{validationError}</p>}
                                                </div>

                                                {/* Notes */}
                                                <div className="flex flex-col gap-1 md:col-span-2">
                                                    <Label>Notes</Label>
                                                    <Textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Extra notes…"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* CARE-only block */}
                                        {kind === "care" && (
                                            <Card className="rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle>Care configuration</CardTitle>
                                                    <CardDescription>Assign staff, location, frequency…</CardDescription>
                                                </CardHeader>
                                                <CardContent className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex flex-col gap-1">
                                                        <Label>Care type</Label>
                                                        <Select value={careType} onValueChange={(v) => setCareType(v as CareType)}>
                                                            <SelectTrigger><SelectValue placeholder="Select care type" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="vital_check">Vital check</SelectItem>
                                                                <SelectItem value="medication">Medication</SelectItem>
                                                                <SelectItem value="hygiene">Hygiene</SelectItem>
                                                                <SelectItem value="therapy">Therapy</SelectItem>
                                                                <SelectItem value="meal">Meal / Nutrition</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <Label>Assigned staff *</Label>
                                                        <Select
                                                            value={assignedStaffId?.toString() ?? ""}
                                                            onValueChange={(v) => setAssignedStaffId(Number(v))}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                                                            <SelectContent>
                                                                {STAFFS.map(s => (
                                                                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <Label>Room</Label>
                                                            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="101" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Label>Bed</Label>
                                                            <Input value={bed} onChange={(e) => setBed(e.target.value)} placeholder="1" />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <Label>Priority</Label>
                                                        <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                                                            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="low">Low</SelectItem>
                                                                <SelectItem value="normal">Normal</SelectItem>
                                                                <SelectItem value="high">High</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <Label>Repeat</Label>
                                                        <Select value={freq} onValueChange={(v) => setFreq(v as Frequency)}>
                                                            <SelectTrigger><SelectValue placeholder="No repeat" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">None</SelectItem>
                                                                <SelectItem value="daily">Daily</SelectItem>
                                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {rrule && (
                                                            <p className="text-xs text-slate-500 mt-1">RRULE: <span className="font-mono">{rrule}</span></p>
                                                        )}
                                                    </div>

                                                    {/* Medication extras */}
                                                    {careType === "medication" && (
                                                        <>
                                                            <div className="flex flex-col gap-1">
                                                                <Label>Medication name *</Label>
                                                                <Input value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Amlodipine" />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <Label>Dose *</Label>
                                                                <Input value={medDose} onChange={(e) => setMedDose(e.target.value)} placeholder="5 mg" />
                                                            </div>
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* VISIT-only block */}
                                        {kind === "visit" && (
                                            <Card className="rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle>Family visit</CardTitle>
                                                    <CardDescription>QR will be used for check-in if enabled</CardDescription>
                                                </CardHeader>
                                                <CardContent className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex flex-col gap-1">
                                                        <Label>Family user</Label>
                                                        <Select
                                                            value={familyUserId?.toString() ?? ""}
                                                            onValueChange={(v) => setFamilyUserId(Number(v))}
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="Select family account" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="987">Pham T. (Father)</SelectItem>
                                                                <SelectItem value="988">Le H. (Daughter)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <QrCode className="h-4 w-4 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">Generate QR for check-in</p>
                                                                <p className="text-xs text-slate-500">QR code for family with the schedule.</p>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={createQR}
                                                            onCheckedChange={setCreateQR}
                                                            className="h-5 w-10 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300"
                                                            thumbClassName="h-4 w-4 bg-white rounded-full"
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Right column – Summary & Actions */}
                                    <div className="lg:col-span-1 text-left">
                                        <Card className="rounded-2xl">
                                            <CardHeader>
                                                <CardTitle className="text-base text-center">Summary</CardTitle>
                                                <CardDescription className="text-center">Quick review before creating</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="text-sm">
                                                    <p><span className="text-left text-slate-500">Kind:</span> <span className="font-medium">{kind}</span></p>
                                                    <p><span className="text-left text-slate-500">Resident:</span> {RESIDENTS.find(r => r.id === residentId)?.name}</p>
                                                    <p className="flex items-left gap-1">
                                                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                                                        {scheduledAt ? new Date(scheduledAt).toLocaleString() : "—"}
                                                    </p>
                                                    {kind === "care" && (
                                                        <>
                                                            <p><span className="text-left text-slate-500">Care type:</span> {careType}</p>
                                                            <p><span className="text-left text-slate-500">Staff:</span> {STAFFS.find(s => s.id === assignedStaffId)?.name}</p>
                                                            <p><span className="text-left text-slate-500">Loc:</span> Room {room} / Bed {bed}</p>
                                                            <div className="flex items-left gap-2 mt-1">
                                                                <Badge variant="secondary">Priority: {priority}</Badge>
                                                                {rrule && <Badge variant="outline">Repeat</Badge>}
                                                            </div>
                                                        </>
                                                    )}
                                                    {kind === "visit" && (
                                                        <>
                                                            <p><span className="text-slate-500">Family:</span> {familyUserId ?? "—"}</p>
                                                            <p><span className="text-slate-500">QR:</span> {createQR ? "Yes" : "No"}</p>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" className="w-1/2">Cancel</Button>
                                                    <Button type="submit" className="w-1/2 text-black" disabled={!valid}>
                                                        Create
                                                    </Button>
                                                </div>
                                                {!valid && (
                                                    <p className="text-xs text-amber-600">
                                                        Fill required fields (resident, time, {kind === "care" ? "assigned staff" : "family user"}…)
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </form>
                            </CardContent>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
