// FamilyHealthCare.tsx
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Heart, Activity, Pill, Calendar, FileText, AlertTriangle } from 'lucide-react';

// Mock data
const mockResident = {
  name: 'John Doe',
  age: 75,
  room: '101',
  bed: 'A',
  photo: 'https://via.placeholder.com/100', // Placeholder image
};

const mockVitals = {
  bp: '120/80 mmHg',
  hr: '72 bpm',
  o2: '98%',
  glucose: '95 mg/dL',
  temp: '98.6°F',
  lastUpdated: '2023-10-01 14:00',
};

const mockMedications = [
  { name: 'Lisinopril', dosage: '10mg', nextDose: '20:00', status: 'upcoming' },
  { name: 'Metformin', dosage: '500mg', nextDose: '12:00', status: 'taken' },
];

const mockCareUpdates = [
  { time: '08:00', activity: 'Morning Medication', note: 'Administered without issues.' },
  { time: '09:00', activity: 'Breakfast', note: 'Ate 80% of meal.' },
  { time: '10:00', activity: 'Physical Therapy', note: 'Completed exercises, good progress.' },
  { time: '15:00', activity: 'Well-being Check', note: 'Resident reports feeling well.' },
];

const mockHealthEvents = [
  { date: '2023-10-01', event: 'Abnormal Vitals', details: 'BP elevated to 140/90, monitored.' },
  { date: '2023-09-28', event: 'Fall Incident', details: 'Minor fall in room, no injury.' },
  { date: '2023-09-25', event: 'Symptom Report', details: 'Reported mild headache, medication adjusted.' },
];

const mockCareNotes = [
  { date: '2023-10-01', nurse: 'Alice Nguyen', note: 'Resident stable, good appetite.' },
  { date: '2023-09-30', nurse: 'Bob Smith', note: 'Increased mobility exercises recommended.' },
];

// Simple mini-chart for vitals trend
const MiniChart: React.FC<{ data: number[] }> = ({ data }) => (
  <div className="flex items-end space-x-1 h-16">
    {data.map((value, idx) => (
      <div
        key={idx}
        className="bg-[#5985D8] rounded-t"
        style={{ height: `${(value / 100) * 64}px`, width: '8px' }}
      ></div>
    ))}
  </div>
);

const FamilyHealthCare: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#5985D8] mb-6">Health & Care</h1>

      {/* Resident Overview Card */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={mockResident.photo} alt={mockResident.name} />
                <AvatarFallback>{mockResident.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl">{mockResident.name}</h2>
                <p className="text-gray-600">Age: {mockResident.age} | Room: {mockResident.room}, Bed: {mockResident.bed}</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="care-updates">Care Updates</TabsTrigger>
          <TabsTrigger value="health-events">Health Events</TabsTrigger>
          <TabsTrigger value="care-notes">Care Notes</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity size={20} />
                <span>Latest Vital Signs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-medium">Blood Pressure</p>
                  <p>{mockVitals.bp}</p>
                </div>
                <div>
                  <p className="font-medium">Heart Rate</p>
                  <p>{mockVitals.hr}</p>
                </div>
                <div>
                  <p className="font-medium">O₂ Saturation</p>
                  <p>{mockVitals.o2}</p>
                </div>
                <div>
                  <p className="font-medium">Glucose</p>
                  <p>{mockVitals.glucose}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium">Temperature</p>
                <p>{mockVitals.temp}</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">Last Updated: {mockVitals.lastUpdated}</p>
              <div className="mt-4">
                <p className="mb-2">Trend (Last 7 Days - HR)</p>
                <MiniChart data={[70, 75, 72, 78, 74, 76, 72]} />
              </div>
              <Button variant="outline" className="mt-4">View Full History</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill size={20} />
                <span>Medication Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Next Dose</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMedications.map((med, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.nextDose}</TableCell>
                      <TableCell>
                        <Badge variant={med.status === 'taken' ? 'default' : 'secondary'}>{med.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4">View Full List</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-updates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Daily Care Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {mockCareUpdates.map((update, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{update.time} - {update.activity}</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{update.note}</p>
                      {idx < mockCareUpdates.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button variant="outline" className="mt-4">View Full Updates</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle size={20} />
                <span>Recent Health Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {mockHealthEvents.map((event, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{event.date} - {event.event}</span>
                        <Badge variant="destructive">Alert</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      {idx < mockHealthEvents.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button variant="outline" className="mt-4">View Full Events</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText size={20} />
                <span>Care Team Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {mockCareNotes.map((note, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{note.date} - {note.nurse}</span>
                      </div>
                      <p className="text-sm text-gray-600">{note.note}</p>
                      {idx < mockCareNotes.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button variant="outline" className="mt-4">View All Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Medications Today: {mockMedications.length}</p>
                <p>Care Updates: {mockCareUpdates.length}</p>
                <p>Health Events: {mockHealthEvents.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No active alerts.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyHealthCare;
