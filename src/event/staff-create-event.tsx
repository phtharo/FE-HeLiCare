//xem lại cái family đăng kí lịch thăm
//chỉ cần nhập sl family sau đó mỗi gd đki thì sẽ có mã QR riêng
//tạo mã QR cho family
//family visit thì k cần event name
//mã QR hiển thị ở đâu?
//family sẽ

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
//import { Switch } from "../components/ui/switch";
//import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, QrCode } from "lucide-react";
// import { SearchIcon } from "@heroicons/react/solid";
import { useNavigate, useOutletContext } from "react-router-dom";
import MultiSelect from "react-select";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../components/ui/modal";

/** Extend CareEvent type to include staffId */
export type CareEvent = {
  id: string;
  priority: "low" | "normal" | "high";
  datetimeISO: string;
  dateISO: string;
  datetimeLabel: string;
  staffId: string;
  staffName: string;
  location: string;
  type?: string;
  resident?: string;
  quantity?: number;
};

// Define FamilyVisit inline to resolve missing type error
type FamilyVisit = {
  id: string;
  priority: string;
  resident: string;
  family: string;
  qr: boolean;
  date: string;
  datetimeISO: string;
  datetime: string;
  endDatetime?: string;
  notes: string;
};

// import { ArrowLeft } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";


type EventKind = "care" | "visit";
type CareType = "vital_check" | "medication" | "hygiene" | "therapy" | "meal";
type Frequency = "none" | "daily" | "weekly" | "monthly";

type StaffOption = { id: number; name: string };

/** Mock options (thay = API thực) */
const STAFFS: StaffOption[] = [
    { id: 41, name: "Nurse Linh" },
    { id: 42, name: "Nurse Khoa" },
    { id: 45, name: "Caregiver Minh" },
];

export default function StaffCreateEvent(): React.JSX.Element {
    const navigate = useNavigate();
    const outletContext = useOutletContext<{ setCare?: React.Dispatch<React.SetStateAction<CareEvent[]>>; setVisits?: React.Dispatch<React.SetStateAction<FamilyVisit[]>>; addNotification?: (type: string, message: string) => void; }>() || {};
    const setCare = outletContext.setCare || (() => {});
    const setVisits = outletContext.setVisits || (() => {});
    const addNotification = outletContext.addNotification || (() => {});

    const [kind, setKind] = useState<EventKind>("care");
    const [scheduledAt, setScheduledAt] = useState<string>("");
    const [endAt, setEndAt] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [eventName, setEventName] = useState<string>("");
    const [createQR, setCreateQR] = useState<boolean>(true);
    const [residentName, setResidentName] = useState<string>("");
    const [familyInfo, setFamilyInfo] = useState<string>("");

    // Care-only fields
    const [careType, setCareType] = useState<CareType>("vital_check");
    const [quantity, setQuantity] = useState<number>(1);
    const [assignedStaffIds, setAssignedStaffIds] = useState<number[]>([]);
    const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
    const [location, setLocation] = useState<string>("");
    const [freq, setFreq] = useState<Frequency>("none");
    const [medName, setMedName] = useState<string>("");
    const [medDose, setMedDose] = useState<string>("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState<"delete" | "done" | null>(null);
    const [showCreateConfirmModal, setShowCreateConfirmModal] = useState(false);

    // Add state for success message
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const valid = useMemo(() => {
        if (!scheduledAt) return false;
        if (kind === "care") {
            if (!assignedStaffIds.length) return false;
            if (careType === "medication" && (!medName.trim() || !medDose.trim())) return false;
        } else {
            if (!residentName) return false;
        }
        return true;
    }, [scheduledAt, kind, assignedStaffIds, careType, medName, medDose, residentName]);

    function onCreate(e: React.FormEvent) {
        e.preventDefault();

        const startISO = new Date(scheduledAt).toISOString();
        const label = new Date(scheduledAt).toLocaleString();

        console.log("Creating event...");
        console.log("Event kind:", kind);
        console.log("Scheduled at:", scheduledAt);
        console.log("End at:", endAt);
        console.log("Notes:", notes);

        if (kind === "care") {
            const newEventCare: CareEvent = {
                id: crypto.randomUUID(),
                priority,
                datetimeISO: startISO,
                dateISO: startISO.split("T")[0],
                datetimeLabel: label,
                staffId: assignedStaffIds.join(","),
                staffName: STAFFS.filter(s => assignedStaffIds.includes(s.id)).map(s => s.name).join(", "), // Populate staffName
                location,
                type: careType,
                quantity, // Added quantity field
            };

            console.log("New care event:", newEventCare);

            setCare((prev) => {
                const updatedCare = [newEventCare, ...prev];
                console.log("Updated care events:", updatedCare);
                return updatedCare;
            });
            navigate("/staff-manage-event", { state: { newEvent: newEventCare } });
            addNotification("new", `New care event '${newEventCare.type}' added.`); // Add notification
            return;
        }

        const newEventVisit: FamilyVisit = {
            id: crypto.randomUUID(),
            priority: "Normal",
            resident: residentName,
            family: familyInfo,
            qr: createQR,
            date: startISO.split("T")[0],
            datetimeISO: startISO,
            datetime: label,
            endDatetime: endAt ? new Date(endAt).toISOString() : undefined,
            notes,
        };

        console.log("New family visit event:", newEventVisit);

        setVisits((prev) => {
            const updatedVisits = [newEventVisit, ...prev];
            console.log("Updated family visits:", updatedVisits);
            return updatedVisits;
        });
        navigate("/staff-manage-event", { state: { newEvent: newEventVisit } });
        addNotification("new", `New family visit for '${newEventVisit.resident}' added.`); // Add notification
    }

    // function handleActionConfirm(action: "delete" | "done") {
    //     setModalAction(action);
    //     setShowConfirmModal(true);
    // }

    // function confirmAction() {
    //     if (modalAction === "delete") {
    //         console.log("Event deleted.");
    //         // Add delete logic here
    //     } else if (modalAction === "done") {
    //         console.log("Event marked as done.");
    //         // Add mark as done logic here
    //     }
    //     setShowConfirmModal(false);
    // }

    const handleCreateEvent = () => {
        setShowCreateConfirmModal(true);
    };

    
    // Update confirmCreateEvent to include kind in navigation
    const confirmCreateEvent = async () => {
        console.log("Creating event...", {
            kind,
            scheduledAt,
            endAt,
            notes,
            eventName,
            createQR,
            residentName,
            familyInfo,
            careType,
            quantity,
            assignedStaffIds,
            priority,
            location,
            freq,
            medName,
            medDose,
        });

        // Close modal and show success message
        setShowCreateConfirmModal(false);
        setShowSuccessMessage(true);

        // Automatically hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);

        const startISO = new Date(scheduledAt).toISOString();
        const label = new Date(scheduledAt).toLocaleString();

        if (kind === "care") {
            const newEventCare: CareEvent = {
                id: crypto.randomUUID(),
                priority,
                datetimeISO: startISO,
                dateISO: startISO.split("T")[0],
                datetimeLabel: label,
                staffId: assignedStaffIds.join(","),
                staffName: STAFFS.filter(s => assignedStaffIds.includes(s.id)).map(s => s.name).join(", "),
                location,
                type: careType,
                quantity,
            };

            setCare(prev => [newEventCare, ...prev]);

            navigate("/staff-manage-event", {
                state: {
                    newEvent: {
                        kind: "care" as const,
                        ...newEventCare,
                    },
                },
            });

            addNotification("new", `New care event '${newEventCare.type}' added.`);
            return;
        }

        const newEventVisit: FamilyVisit = {
            id: crypto.randomUUID(),
            priority: "Normal",
            resident: residentName,
            family: familyInfo,
            qr: createQR,
            date: startISO.split("T")[0],
            datetimeISO: startISO,
            datetime: label,
            endDatetime: endAt ? new Date(endAt).toISOString() : undefined,
            notes,
        };

        setVisits(prev => [newEventVisit, ...prev]);

        navigate("/staff-manage-event", {
            state: {
                newEvent: {
                    kind: "visit" as const,
                    ...newEventVisit,
                },
            },
        });

        addNotification("new", `New family visit for '${newEventVisit.resident}' added.`);
    };

    return (
        <div className="w-full pt-2">
            {/* Nền gradient cố định */}
            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

            <div className="relative h-full overflow-y-auto -mt-10 ">
                <div className="flex min-h-full gap-4 lg:gap-6">

                    <main className="w-full max-w-8xl p-4 lg:p-6  ">
                        <div className="rounded-3xl bg-white/90 backdrop-blur border border-black/5 shadow-lg px-0 pb-6 -pt-10">
                            <CardHeader className="px-6 pt-1 pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {/* <ArrowLeft
                                            className="h-5 w-5 text-slate-700 cursor-pointer"
                                            onClick={() => navigate("/staff-manage-event")}
                                        /> */}
                                        <div>
                                            <CardTitle className="text-2xl text-[#5985d8]">Create Event</CardTitle>
                                            <CardDescription>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                                        </div>
                                    </div>

                                </div>
                            </CardHeader>

                            <CardContent className="px-6 pb-6">
                                <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Left column */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="rounded-2xl">
                                            <CardHeader>
                                                <CardTitle>Event details</CardTitle>
                                                <CardDescription>Choose type and fill required information</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-4 md:grid-cols-2">
                                                {/* event kind  */}
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

                                                {/* quantity */}
                                                {kind === "care" && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label>Quantity (Maximum) *</Label>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            value={quantity === 0 ? "" : String(quantity)}
                                                            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                                                            onBlur={() => setQuantity(quantity || 1)}
                                                            placeholder="Enter quantity"
                                                            className="appearance-none"
                                                        />
                                                    </div>
                                                )}

                                                {/* Hide resident field when care event is selected */}
                                                {kind === "visit" && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label>Resident name *</Label>
                                                        <Input
                                                            value={residentName}
                                                            onChange={(e) => setResidentName(e.target.value)}
                                                            placeholder="Enter resident name"
                                                        />
                                                    </div>
                                                )}

                                                {/* Hide event name field when family name is selected */}
                                                {kind !== "visit" && (
                                                    <div className="flex flex-col gap-1 md:col-span-2">
                                                        <Label>Event name *</Label>
                                                        <Input
                                                            value={eventName}
                                                            onChange={(e) => setEventName(e.target.value)}
                                                            placeholder="Enter event name"
                                                        />
                                                    </div>
                                                )}

                                                {/* from - to */}
                                                <div className="flex flex-col gap-1">
                                                    <Label>Date & time *</Label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
                                                                if (input && typeof input.showPicker === 'function') {
                                                                    input.showPicker();
                                                                } else {
                                                                    alert('Please manually select a date and time.');
                                                                }
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

                                                <div className="flex flex-col gap-1">
                                                    <Label>End Date & time *</Label>
                                                    <div className="relative">
                                                        <Calendar
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[name="end-datetime"]') as HTMLInputElement;
                                                                if (input && typeof input.showPicker === 'function') {
                                                                    input.showPicker();
                                                                } else {
                                                                    alert('Please manually select an end date and time.');
                                                                }
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
                                                </div>

                                                {/* Row 4: Notes */}
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
                                                        {/* <Select
                                                            value={assignedStaffIds.map(String).join(",") ?? ""}
                                                            onValueChange={(v) => setAssignedStaffIds(v.split(",").map(id => Number(id)))}
                                                            multiple
                                                        >
                                                            <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                                                            <SelectContent>
                                                                {STAFFS.map(s => (
                                                                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select> */}
                                                        <MultiSelect
                                                            options={STAFFS.map(s => ({ value: s.id, label: s.name }))}
                                                            value={STAFFS.filter(s => assignedStaffIds.includes(s.id)).map(s => ({ value: s.id, label: s.name }))}
                                                            onChange={(selected) => setAssignedStaffIds((selected || []).map(option => option.value))}
                                                            placeholder="Select staff"
                                                            isMulti
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <Label>Location</Label>
                                                            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
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
                                        {/* FAMILY VISIT */}
                                        {kind === "visit" && (
                                            <Card className="rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle>Family visit</CardTitle>
                                                    <CardDescription>QR will be used for check-in if enabled</CardDescription>
                                                </CardHeader>
                                                <CardContent className="grid gap-4 md:grid-cols-2">
                                                    <div className="flex flex-col gap-1 md:col-span-1">
                                                        <Label>Family's information</Label>
                                                        <Input
                                                            type="text"
                                                            value={familyInfo}
                                                            onChange={(e) => setFamilyInfo(e.target.value)}
                                                            placeholder="Enter family information"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-lg border px-3 py-2 md:col-span-1">
                                                        <div className="flex items-center gap-2">
                                                            <QrCode className="h-4 w-4 text-slate-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">Generate QR for check-in</p>
                                                                <p className="text-xs text-slate-500">QR code for family with the schedule.</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={createQR}
                                                            onCheckedChange={(v) => setCreateQR(v === true)}
                                                            className="
                                                                h-5 w-5 rounded-full border border-gray-300 bg-white
                                                                data-[state=checked]:bg-black data-[state=checked]:border-black
                                                                data-[state=checked]:text-white
                                                                [&>svg]:h-3 [&>svg]:w-3
                                                            "
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
                                                    <p className="flex items-left gap-1">
                                                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                                                        {scheduledAt ? new Date(scheduledAt).toLocaleString() : "—"}
                                                    </p>
                                                    {kind === "care" && (
                                                        <>
                                                            <p><span className="text-left text-slate-500">Event Name:</span> {eventName || "—"}</p>
                                                            <p><span className="text-left text-slate-500">Quantity:</span> {quantity || "—"}</p>
                                                            <p><span className="text-left text-slate-500">Care type:</span> {careType}</p>
                                                            <p><span className="text-left text-slate-500">Staff:</span> {STAFFS.filter(s => assignedStaffIds.includes(s.id)).map(s => s.name).join(", ")}</p>
                                                            <p><span className="text-left text-slate-500">Loc:</span>{location} </p>
                                                            <p><span className="text-left text-slate-500">Notes:</span> {notes || "—"}</p>
                                                            <div className="flex items-left gap-2 mt-1">
                                                                <Badge variant="secondary">Priority: {priority}</Badge>
                                                                {freq !== "none" && <Badge variant="outline">Repeat</Badge>}
                                                            </div>
                                                        </>
                                                    )}
                                                    {kind === "visit" && (
                                                        <>
                                                            <p><span className="text-slate-500">Resident:</span> {residentName || "—"}</p>
                                                            <p><span className="text-slate-500">Family:</span> {familyInfo || "—"}</p>
                                                            <p><span className="text-slate-500">QR:</span> {createQR ? "Yes" : "No"}</p>
                                                            <p><span className="text-slate-500">Notes:</span> {notes || "—"}</p>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" className="w-1/2">Cancel</Button>
                                                    <Button
                                                      type="button"
                                                      onClick={() => setShowCreateConfirmModal(true)}
                                                      className="w-1/2"
                                                      style={{ backgroundColor: "#5985d8", color: "white" }}
                                                      disabled={!valid}
                                                    >
                                                      Create
                                                    </Button>
                                                </div>
                                                {!valid && (
                                                    <p className="text-xs text-amber-600">
                                                        Fill required fields (time, {kind === "care" ? "assigned staff" : "family user"}…)
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

            {/* Modal for confirmation */}
            {/* {showConfirmModal && (
                <Modal>
                    <ModalHeader>
                        <h2>Confirm Action</h2>
                    </ModalHeader>
                    <ModalContent>
                        <p>Are you sure you want to {modalAction === "delete" ? "delete this event" : "mark this event as done"}?</p>
                    </ModalContent>
                    <ModalFooter>
                        <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
                        <button onClick={confirmAction}>Confirm</button>
                    </ModalFooter>
                </Modal>
            )} */}

            {/* Modal for create event confirmation */}
            {showCreateConfirmModal && (
                <Modal>
                    <ModalHeader>
                        <h2>Confirm Create Event</h2>
                    </ModalHeader>
                    <ModalContent>
                        <p>Are you sure you want to create this event?</p>
                    </ModalContent>
                    <ModalFooter>
                        <button
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          onClick={() => setShowCreateConfirmModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            setShowCreateConfirmModal(false);
                            confirmCreateEvent();
                          }}
                        >
                          Confirm
                        </button>
                    </ModalFooter>
                </Modal>
            )}

            {/* Success message */}
            {showSuccessMessage && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                    Event created successfully!
                </div>
            )}
        </div>
    );
}

// Add Tailwind animation for fade-in effect
// @keyframes fade-in {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in {
//     animation: fade-in 0.3s ease-out;
// }