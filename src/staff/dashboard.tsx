// StaffDashboard.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

// Mock data
const mockStaff = { name: 'Alice Nguyen, RN' };

const mockSummary = {
  activeSOSAlerts: 5,
  scheduledActivities: 12,
  residentsCheckIn: 8,
  pendingIncidents: 3,
  medicationTasks: 15,
  visitorsExpected: 4,
};

const mockUpcomingEvents = [
  { id: 1, title: 'Morning Medication', time: '08:00', residents: ['John Doe', 'Jane Smith'], status: 'Scheduled' },
  { id: 2, title: 'Physical Therapy', time: '10:00', residents: ['Bob Johnson'], status: 'In Progress' },
  { id: 3, title: 'Lunch Time', time: '12:00', residents: ['All Residents'], status: 'Scheduled' },
  { id: 4, title: 'Afternoon Check-In', time: '15:00', residents: ['John Doe'], status: 'Completed' },
];

const mockSOSAlerts = [
  { id: 1, resident: 'John Doe', type: 'Fall', severity: 'high', timestamp: '2023-10-01 14:30' },
  { id: 2, resident: 'Jane Smith', type: 'Abnormal Vitals', severity: 'high', timestamp: '2023-10-01 15:00' },
  { id: 3, resident: 'Bob Johnson', type: 'Emergency Button', severity: 'medium', timestamp: '2023-10-01 15:15' },
];

const mockIncidentReports = [
  { id: 1, resident: 'John Doe', type: 'Fall', dateTime: '2023-10-01 14:30', staff: 'Alice Nguyen', outcome: 'Stabilized' },
  { id: 2, resident: 'Jane Smith', type: 'Health Event', dateTime: '2023-10-01 15:00', staff: 'Bob Smith', outcome: 'Transferred' },
  { id: 3, resident: 'Bob Johnson', type: 'Behavioral', dateTime: '2023-10-01 15:15', staff: 'Alice Nguyen', outcome: 'Monitored' },
];

const StaffDashboard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-300';
      case 'medium': return 'bg-yellow-200';
      case 'low': return 'bg-green-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-600';
      case 'In Progress': return 'bg-yellow-600';
      case 'Completed': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-[#5985D8]">HeLiCare</h1>
          <Avatar>
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium">{mockStaff.name}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#5985D8] hover:bg-[#4a6fb8]">Create Incident Report</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Incident Report</DialogTitle>
              </DialogHeader>
              <p>Incident report form would go here (placeholder).</p>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-[#5985D8] text-[#5985D8]">Record Vital Signs</Button>
          <Button variant="outline" className="border-[#5985D8] text-[#5985D8]">View SOS Alerts</Button>
        </div>
      </header>

      {/* Today’s Summary Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today’s Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Active SOS Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.activeSOSAlerts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Activities Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.scheduledActivities}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Residents Requiring Check-In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.residentsCheckIn}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.pendingIncidents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medication Tasks Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.medicationTasks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visitors Expected Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mockSummary.visitorsExpected}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events Timeline</h2>
        <ScrollArea className="h-64 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
          <div className="space-y-4">
            {mockUpcomingEvents.map((event, index) => (
              <div key={event.id}>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.time} - Residents: {event.residents.join(', ')}</p>
                  </div>
                </div>
                {index < mockUpcomingEvents.length - 1 && <Separator className="mt-4 bg-gray-300 h-[2px] rounded-full" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* SOS Alerts Preview */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">SOS Alerts Preview</h2>
          <Button variant="outline" className="border-[#5985D8] text-[#5985D8]">View All</Button>
        </div>
        <div className="space-y-4">
          {mockSOSAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{alert.resident}</h3>
                    <p className="text-sm text-gray-700">{alert.type} - {alert.timestamp}</p>
                  </div>
                  <Badge className={getBadgeColor(alert.severity)}>{alert.severity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Incident Reports */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Incident Reports</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-lg font-semibold text-center'>Resident</TableHead>
                  <TableHead className='text-lg font-semibold'>Incident Type</TableHead>
                  <TableHead className='text-lg font-semibold'>Date/Time</TableHead>
                  <TableHead className='text-lg font-semibold'>Staff</TableHead>
                  <TableHead className='text-lg font-semibold'>Outcome</TableHead>
                  <TableHead className='text-lg font-semibold'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIncidentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className='text-center'>{report.resident}</TableCell>
                    <TableCell className='text-left'>{report.type}</TableCell>
                    <TableCell className='text-left'>{report.dateTime}</TableCell>
                    <TableCell className='text-left'>{report.staff}</TableCell>
                    <TableCell className='text-left'>{report.outcome}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StaffDashboard;
