import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Calendar } from '../components/ui/calendar';
import { Checkbox } from '../components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define TypeScript types
type HealthLevel = "low" | "medium" | "high";

type EventStatus = "upcoming" | "ongoing" | "ended" | "cancelled";

type StaffEvent = {
  id: string;
  name: string;
  description?: string;
  type: "exercise" | "entertainment" | "medical" | "other";
  date: string;          // ISO date
  startTime: string;     // "HH:mm"
  endTime: string;       // "HH:mm"
  location: string;
  capacity: number;
  registeredCount: number;
  minHealthLevel: HealthLevel;
  targetGroup: "all" | "limited-mobility" | "cardio" | "diabetes" | "custom";
  createdBy: string;     // staff name
  status: EventStatus;
};

// Zod schema for form validation
const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["exercise", "entertainment", "medical", "other"]),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  minHealthLevel: z.enum(["low", "medium", "high"]),
  targetGroup: z.enum(["all", "limited-mobility", "cardio", "diabetes", "custom"]),
});

// Mock data for demonstration
const mockEvents: StaffEvent[] = [
  {
    id: "1",
    name: "Dưỡng sinh sáng",
    description: "Morning tai chi session",
    type: "exercise",
    date: "2023-10-15",
    startTime: "07:00",
    endTime: "08:00",
    location: "Garden",
    capacity: 20,
    registeredCount: 15,
    minHealthLevel: "medium",
    targetGroup: "all",
    createdBy: "Nguyen Van A",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Yoga nhẹ",
    description: "Gentle yoga for seniors",
    type: "exercise",
    date: "2023-10-16",
    startTime: "09:00",
    endTime: "10:00",
    location: "Yoga Room",
    capacity: 15,
    registeredCount: 10,
    minHealthLevel: "low",
    targetGroup: "limited-mobility",
    createdBy: "Tran Thi B",
    status: "ongoing",
  },
  {
    id: "3",
    name: "Đi dạo công viên",
    description: "Park walk",
    type: "exercise",
    date: "2023-10-14",
    startTime: "14:00",
    endTime: "15:30",
    location: "Local Park",
    capacity: 25,
    registeredCount: 20,
    minHealthLevel: "high",
    targetGroup: "cardio",
    createdBy: "Le Van C",
    status: "ended",
  },
  {
    id: "4",
    name: "Văn nghệ cuối tuần",
    description: "Weekend entertainment show",
    type: "entertainment",
    date: "2023-10-20",
    startTime: "18:00",
    endTime: "20:00",
    location: "Auditorium",
    capacity: 50,
    registeredCount: 45,
    minHealthLevel: "low",
    targetGroup: "all",
    createdBy: "Pham Thi D",
    status: "cancelled",
  },
];

const StaffEventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<StaffEvent[]>(mockEvents);
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<StaffEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "exercise",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      capacity: 1,
      minHealthLevel: "low",
      targetGroup: "all",
    },
  });

  const filteredEvents = events.filter(event => {
    const statusMatch = filterStatus === "all" || event.status === filterStatus;
    const typeMatch = filterType === "all" || event.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleAddEvent = (data: z.infer<typeof eventSchema>) => {
    const newEvent: StaffEvent = {
      id: Date.now().toString(),
      ...data,
      registeredCount: 0,
      createdBy: "Current Staff", // In real app, get from auth
      status: "upcoming",
    };
    setEvents([...events, newEvent]);
    setDialogOpen(false);
    form.reset();
    setToastMessage("Event added successfully!");
  };

  const handleEditEvent = (data: z.infer<typeof eventSchema>) => {
    if (!editingEvent) return;
    const updatedEvent: StaffEvent = {
      ...editingEvent,
      ...data,
    };
    setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
    setDialogOpen(false);
    setEditingEvent(null);
    form.reset();
    setToastMessage("Event updated successfully!");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setToastMessage("Event deleted successfully!");
  };

  const openEditDialog = (event: StaffEvent) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      description: event.description || "",
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      capacity: event.capacity,
      minHealthLevel: event.minHealthLevel,
      targetGroup: event.targetGroup,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    form.reset();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
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
            <SelectItem value="exercise">Exercise</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Event Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { setEditingEvent(null); form.reset(); }}>Add New Event</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(editingEvent ? handleEditEvent : handleAddEvent)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="startTime" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endTime" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="capacity" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl><Input type="number" {...field} onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value || '0', 10))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="minHealthLevel" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Min Health Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="targetGroup" render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Target Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="limited-mobility">Limited Mobility</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">{editingEvent ? "Update" : "Add"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell><Badge variant="outline">{event.type}</Badge></TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.startTime} - {event.endTime}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.capacity}</TableCell>
                <TableCell>{event.registeredCount}</TableCell>
                <TableCell><Badge variant={event.status === "upcoming" ? "default" : event.status === "ongoing" ? "secondary" : "destructive"}>{event.status}</Badge></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Toast for notifications */}
      {/* Toast for notifications (simple inline toast to avoid undefined Toast component) */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default StaffEventManagementPage;
