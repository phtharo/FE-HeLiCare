// StaffSOSIncidentManagement.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Toaster, toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns/format';

// Mock data for alerts
interface Alert {
    id: string;
    residentName: string;
    roomBed: string;
    type: 'fall' | 'abnormal_vitals' | 'emergency_button';
    timestamp: string;
    vitalSnapshot?: string; // e.g., "BP: 180/110, HR: 120"
    severity: 'high' | 'medium' | 'low'; // For color coding
    status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated';
    timer: number; // Countdown in seconds
}

const mockAlerts: Alert[] = [
    {
        id: '1',
        residentName: 'John Doe',
        roomBed: 'Room 101, Bed A',
        type: 'fall',
        timestamp: '2023-10-01 14:30:00',
        vitalSnapshot: 'BP: 120/80, HR: 72',
        severity: 'high',
        status: 'pending',
        timer: 60,
    },
    {
        id: '2',
        residentName: 'Jane Smith',
        roomBed: 'Room 102, Bed B',
        type: 'abnormal_vitals',
        timestamp: '2023-10-01 15:00:00',
        vitalSnapshot: 'BP: 180/110, HR: 120, Glucose: 12.5',
        severity: 'high',
        status: 'pending',
        timer: 60,
    },
    {
        id: '3',
        residentName: 'Bob Johnson',
        roomBed: 'Room 103, Bed C',
        type: 'emergency_button',
        timestamp: '2023-10-01 15:15:00',
        severity: 'medium',
        status: 'pending',
        timer: 60,
    },
];

// Mock data for residents
const mockResidents = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
];

interface IncidentReport {
    id: string;
    residentId: string;
    incidentType: string;
    rootCause: string;
    actionsTaken: string;
    outcome: string;
    timeOccurred: string;
    dateOccurred: string;
    staffOnDuty: string;
    images: File[];
}

// Mock data for reported incidents
const mockReportedIncidents: IncidentReport[] = [
    {
        id: '1',
        residentId: '1',
        incidentType: 'fall',
        rootCause: 'Slippery floor',
        actionsTaken: 'Assisted resident, called nurse',
        outcome: 'Stabilized, monitored for 24 hours',
        timeOccurred: '14:30',
        dateOccurred: '2023-10-01',
        staffOnDuty: 'Alice Johnson',
        images: [],
    },
    {
        id: '2',
        residentId: '2',
        incidentType: 'health_event',
        rootCause: 'Unknown',
        actionsTaken: 'Administered medication, contacted doctor',
        outcome: 'Transferred to hospital',
        timeOccurred: '15:00',
        dateOccurred: '2023-10-01',
        staffOnDuty: 'Bob Smith',
        images: [],
    },
];

const StaffSOSIncidentManagement: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
    const [reportedIncidents, setReportedIncidents] = useState<IncidentReport[]>(mockReportedIncidents);
    const [report, setReport] = useState<IncidentReport>({
        id: '',
        residentId: '',
        incidentType: '',
        rootCause: '',
        actionsTaken: '',
        outcome: '',
        timeOccurred: '',
        dateOccurred: '',
        staffOnDuty: '',
        images: [],
    });
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Timer logic: Decrement timer for pending alerts every second
    useEffect(() => {
        const interval = setInterval(() => {
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) =>
                    alert.status === 'pending' && alert.timer > 0
                        ? { ...alert, timer: alert.timer - 1 }
                        : alert.timer === 0 && alert.status === 'pending'
                            ? { ...alert, status: 'escalated' } // Auto-escalate if timer hits 0
                            : alert
                )
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Handle acknowledge alert
    const acknowledgeAlert = (id: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, status: 'acknowledged' } : alert
            )
        );
        toast('Alert Acknowledged — You have acknowledged the alert.');
    };

    // Handle mark in progress
    const markInProgress = (id: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, status: 'in_progress' } : alert
            )
        );
        toast('Alert In Progress — Alert marked as in progress.');
    };

    // Handle resolve alert
    const resolveAlert = (id: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === id ? { ...alert, status: 'resolved' } : alert
            )
        );
        setResolutionNotes('');
        toast('Alert Resolved — Alert has been resolved.');
    };

    // Open incident report dialog, pre-populate with alert data if available
    const openIncidentReport = (alert?: Alert) => {
        if (alert) {
            setReport({
                ...report,
                residentId: mockResidents.find(r => r.name === alert.residentName)?.id || '',
                incidentType: alert.type,
                timeOccurred: alert.timestamp.split(' ')[1] || '',
                dateOccurred: alert.timestamp.split(' ')[0] || '',
            });
            setDate(new Date(alert.timestamp));
        }
        setIsIncidentDialogOpen(true);
    };

    // Handle incident report submission
    const handleSubmitReport = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation: Check required fields
        if (!report.residentId || !report.incidentType || !report.actionsTaken || !report.outcome) {
            toast('Validation Error — Please fill in all required fields.');
            return;
        }
        // Mock submit logic: Add to reported incidents
        const newReport: IncidentReport = {
            ...report,
            id: Date.now().toString(),
            dateOccurred: date?.toISOString().split('T')[0] || '',
        };
        setReportedIncidents([newReport, ...reportedIncidents]);
        console.log('Incident Report Submitted:', newReport);
        toast('Report Submitted — Incident report has been submitted successfully.');
        // Reset form
        setReport({
            id: '',
            residentId: '',
            incidentType: '',
            rootCause: '',
            actionsTaken: '',
            outcome: '',
            timeOccurred: '',
            dateOccurred: '',
            staffOnDuty: '',
            images: [],
        });
        setDate(new Date());
        setIsIncidentDialogOpen(false);
    };

    // Handle file upload (mock)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setReport({ ...report, images: [...report.images, ...files] });
    };

    // Get severity color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-300';
            case 'medium': return 'bg-yellow-200';
            case 'low': return 'bg-green-300';
            default: return 'bg-gray-300';
        }
    };

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-gradient-radial from-helicare-blue to-white p-4 md:p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* SOS Alerts Section */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">Active SOS Alerts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {alerts.map((alert) => (
                                <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)} shadow-lg`}>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>{alert.residentName}</span>
                                            <Badge variant={alert.status === 'pending' ? 'destructive' : 'secondary'}>
                                                {alert.status}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p><strong>Room/Bed:</strong> {alert.roomBed}</p>
                                        <p><strong>Type:</strong> {alert.type.replace('_', ' ')}</p>
                                        <p><strong>Timestamp:</strong> {alert.timestamp}</p>
                                        {alert.vitalSnapshot && <p><strong>Vitals:</strong> {alert.vitalSnapshot}</p>}
                                        {alert.status === 'pending' && (
                                            <p className="text-red-600 font-bold">Timer: {alert.timer}s</p>
                                        )}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {alert.status === 'pending' && (
                                                <Button onClick={() => acknowledgeAlert(alert.id)} className="bg-helicare-blue">
                                                    Acknowledge
                                                </Button>
                                            )}
                                            {alert.status === 'acknowledged' && (
                                                <Button onClick={() => markInProgress(alert.id)} className="bg-yellow-500">
                                                    In Progress
                                                </Button>
                                            )}
                                            {(alert.status === 'acknowledged' || alert.status === 'in_progress') && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button onClick={() => setSelectedAlert(alert)} className="bg-green-500">
                                                            Resolve
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Resolve Alert</DialogTitle>
                                                        </DialogHeader>
                                                        <textarea
                                                            placeholder="Resolution notes..."
                                                            value={resolutionNotes}
                                                            onChange={(e) => setResolutionNotes(e.target.value)}
                                                            className="w-full p-2 border rounded"
                                                        />
                                                        <Button onClick={() => resolveAlert(alert.id)} className="bg-helicare-blue">
                                                            Submit Resolution
                                                        </Button>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            <Dialog open={isIncidentDialogOpen} onOpenChange={setIsIncidentDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button onClick={() => openIncidentReport(alert)} variant="outline" className="text-helicare-blue border-helicare-blue">
                                                        Create Incident Report
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className=" max-w-6xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Incident Report Form</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleSubmitReport} className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium">Resident *</label>
                                                                <Select value={report.residentId} onValueChange={(value: string) => setReport({ ...report, residentId: value })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select resident" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {mockResidents.map((res) => (
                                                                            <SelectItem key={res.id} value={res.id}>
                                                                                {res.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium">Incident Type *</label>
                                                                <Select value={report.incidentType} onValueChange={(value: string) => setReport({ ...report, incidentType: value })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="fall">Fall</SelectItem>
                                                                        <SelectItem value="health_event">Health Event</SelectItem>
                                                                        <SelectItem value="behavioral">Behavioral</SelectItem>
                                                                        <SelectItem value="environmental_hazard">Environmental Hazard</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        {/* date */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="text-sm font-medium">Date Occurred</label>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <div className="relative">
                                                                            <input
                                                                                readOnly
                                                                                value={date ? format(date, "yyyy-MM-dd") : ""}
                                                                                placeholder="Select date"
                                                                                className="w-full border rounded-md px-3 py-2 text-sm cursor-pointer bg-white"
                                                                            />

                                                                            <CalendarIcon
                                                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                                                                            />
                                                                        </div>
                                                                    </PopoverTrigger>

                                                                    <PopoverContent
                                                                        className="p-0 scale-75 origin-top-left"
                                                                        side="bottom"
                                                                        align="start"
                                                                        sideOffset={4}
                                                                    >
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={date ?? undefined}
                                                                            onSelect={(d) => d && setDate(d)}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>

                                                            {/* time */}
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="text-sm font-medium">Time Occurred</label>

                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <div className="relative">
                                                                            <Input
                                                                                readOnly
                                                                                placeholder="Select time"
                                                                                value={report.timeOccurred}
                                                                                className="cursor-pointer text-sm"
                                                                            />

                                                                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                                                                        </div>
                                                                    </PopoverTrigger>

                                                                    <PopoverContent
                                                                        className="p-3 w-48 scale-90"
                                                                        side="bottom"
                                                                        align="start"
                                                                        sideOffset={4}
                                                                    >
                                                                        <div className="grid grid-cols-2 gap-2">

                                                                            {/* Hours */}
                                                                            <Select
                                                                                onValueChange={(val: string) => {
                                                                                    const minutes = report.timeOccurred.split(':')[1] || '00';
                                                                                    setReport({ ...report, timeOccurred: `${val}:${minutes}` })
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="h-8 px-2 text-sm">
                                                                                    <SelectValue placeholder="Hr" />
                                                                                </SelectTrigger>

                                                                                <SelectContent className="max-h-40 text-sm">
                                                                                    {Array.from({ length: 24 }, (_, i) => {
                                                                                        const hr = String(i).padStart(2, "0");
                                                                                        return (
                                                                                            <SelectItem key={hr} value={hr}>
                                                                                                {hr}
                                                                                            </SelectItem>
                                                                                        );
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>


                                                                            {/* Minutes */}
                                                                            <select
                                                                                className="border rounded-md p-2 text-sm appearance-none bg-white 
                                                                                        scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
                                                                                value={report.timeOccurred.split(':')[1] || ''}
                                                                                onChange={(e) => {
                                                                                    const [h] = report.timeOccurred.split(':');
                                                                                    const minutes = e.target.value;
                                                                                    setReport({ ...report, timeOccurred: `${h || "00"}:${minutes}` });
                                                                                }}
                                                                            >
                                                                                <option value="">Min</option>
                                                                                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                                                                                    <option key={m} value={m}>
                                                                                        {m}
                                                                                    </option>
                                                                                ))}
                                                                            </select>


                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>


                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Root Cause</label>
                                                            <Textarea
                                                                placeholder="Describe the root cause if known..."
                                                                value={report.rootCause}
                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReport({ ...report, rootCause: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Actions Taken *</label>
                                                            <Textarea
                                                                placeholder="Detail the actions taken..."
                                                                value={report.actionsTaken}
                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReport({ ...report, actionsTaken: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Outcome *</label>
                                                            <Textarea
                                                                placeholder="Describe the outcome (e.g., stabilized, transferred)..."
                                                                value={report.outcome}
                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReport({ ...report, outcome: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium">Staff on Duty</label>
                                                                <Input
                                                                    placeholder="Enter staff name"
                                                                    value={report.staffOnDuty}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReport({ ...report, staffOnDuty: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium">Upload Images (Optional)</label>
                                                                <input type="file" multiple onChange={handleFileUpload} className="block w-full" />
                                                                {report.images.length > 0 && (
                                                                    <p className="text-xs text-gray-400 mt-1 bg-gray-100 rounded-md px-2">
                                                                        {report.images.length} file(s) selected
                                                                    </p>
                                                                )}
                                                            </div>

                                                        </div>
                                                        <div className="flex gap-4">
                                                            <Button type="submit" className="bg-blue-600">
                                                                Submit Report
                                                            </Button>
                                                            <Button type="button" onClick={() => setIsIncidentDialogOpen(false)} variant="secondary">
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
                {/* Reported Incidents Table Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">Reported Incidents</h2>
                    <Card className="shadow-lg">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='text-lg font-semibold text-center'>Resident</TableHead>
                                            <TableHead className='text-lg font-semibold text-center'>Incident Type</TableHead>
                                            <TableHead className='text-lg font-semibold text-center'>Date/Time</TableHead>
                                            <TableHead className='text-lg font-semibold text-center'>Actions Taken</TableHead>
                                            <TableHead className='text-lg font-semibold text-center'>Outcome</TableHead>
                                            <TableHead className='text-lg font-semibold text-center'>Staff</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportedIncidents.map((incident) => (
                                            <TableRow key={incident.id}>
                                                <TableCell>{mockResidents.find(r => r.id === incident.residentId)?.name || 'Unknown'}</TableCell>
                                                <TableCell>{incident.incidentType.replace('_', ' ')}</TableCell>
                                                <TableCell>{incident.dateOccurred} {incident.timeOccurred}</TableCell>
                                                <TableCell className="max-w-xs truncate">{incident.actionsTaken}</TableCell>
                                                <TableCell className="max-w-xs truncate">{incident.outcome}</TableCell>
                                                <TableCell>{incident.staffOnDuty}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </div>
        </>
    );
};

export default StaffSOSIncidentManagement;
