// MyResident.tsx
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Heart, Activity, Pill, Calendar, Phone, AlertTriangle } from 'lucide-react';

// Mock data
const mockResident = {
  name: 'John Doe',
  age: 75,
  room: '101',
  bed: 'A',
  photo: 'https://via.placeholder.com/100', // Placeholder image
  healthStatus: 'Stable',
  emergencyContact: 'Jane Doe (Daughter) - 555-1234',
};

const mockVitals = {
  bp: '120/80',
  hr: 72,
  spo2: 98,
  temp: '98.6°F',
  glucose: '95 mg/dL',
  alerts: ['BP slightly elevated'], // Highlight if abnormal
};

const mockCarePlan = {
  summary: 'Focus on diabetes management and fall prevention.',
  assignedCaregivers: ['Dr. Smith', 'Nurse Alice'],
};

const mockMedications = [
  { time: '08:00', name: 'Lisinopril 10mg', status: 'taken' },
  { time: '12:00', name: 'Metformin 500mg', status: 'upcoming' },
  { time: '20:00', name: 'Lisinopril 10mg', status: 'upcoming' },
];

const mockActivities = [
  { time: '09:00', activity: 'Breakfast', status: 'completed' },
  { time: '10:00', activity: 'Physical Therapy', status: 'upcoming' },
  { time: '12:00', activity: 'Lunch', status: 'upcoming' },
  { time: '15:00', activity: 'Well-being Check', status: 'upcoming' },
];

// Simple mini-chart using Tailwind blocks (e.g., for vitals trend)
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

const MyResident: React.FC = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#5985D8] mb-6">My Resident</h1>

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
          <CardContent>
            <p><strong>Health Status:</strong> {mockResident.healthStatus}</p>
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Health Status Section */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart size={20} />
              <span>Health Status</span>
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
                <p>{mockVitals.hr} bpm</p>
              </div>
              <div>
                <p className="font-medium">SpO₂</p>
                <p>{mockVitals.spo2}%</p>
              </div>
              <div>
                <p className="font-medium">Temperature</p>
                <p>{mockVitals.temp}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">Glucose</p>
              <p>{mockVitals.glucose}</p>
            </div>
            {mockVitals.alerts.length > 0 && (
              <div className="mt-4 flex items-center space-x-2">
                <AlertTriangle size={20} className="text-red-500" />
                <span className="text-red-500">{mockVitals.alerts.join(', ')}</span>
              </div>
            )}
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Vital Signs Preview with Mini Chart */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity size={20} />
              <span>Vital Signs Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Recent Trend (Last 7 Days)</p>
            <MiniChart data={[70, 75, 72, 78, 74, 76, 72]} /> {/* Mock data for HR */}
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Care Plan Preview */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Care Plan Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Summary:</strong> {mockCarePlan.summary}</p>
            <p><strong>Assigned Caregivers:</strong> {mockCarePlan.assignedCaregivers.join(', ')}</p>
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Medication List Preview */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pill size={20} />
              <span>Medication List Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {mockMedications.map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{med.time} - {med.name}</span>
                    <Badge variant={med.status === 'taken' ? 'default' : 'secondary'}>{med.status}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Activity & Schedule Preview */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Activity & Schedule Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {mockActivities.map((act, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{act.time} - {act.activity}</span>
                    <Badge variant={act.status === 'completed' ? 'default' : 'secondary'}>{act.status}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>

      {/* Emergency Contact Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone size={20} />
              <span>Emergency Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{mockResident.emergencyContact}</p>
            <Button variant="outline" className="mt-4">View Full Details</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MyResident;
