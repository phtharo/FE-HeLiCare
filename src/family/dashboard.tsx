// FamilyDashboard.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { MessageSquare, FileText, Heart, Phone } from 'lucide-react';

// Mock data
const mockResident = {
  name: 'John Doe',
  roomBed: 'Room 101, Bed A',
  age: 75,
  healthStatus: 'Stable',
  latestVitals: { bp: '120/80', hr: 72, temp: '98.6°F' },
  lastMedication: 'Lisinopril 10mg at 08:00',
  flags: ['Fall Risk', 'Diabetic'],
};

const mockActivities = [
  { time: '08:00', type: 'Medication', status: 'completed' },
  { time: '09:00', type: 'Breakfast', status: 'completed' },
  { time: '10:00', type: 'Physical Therapy', status: 'upcoming' },
  { time: '12:00', type: 'Lunch', status: 'upcoming' },
  { time: '15:00', type: 'Well-being Check', status: 'upcoming' },
];

const mockNewsfeed = [
  { timestamp: '2023-10-01 14:30', message: 'Resident participated in group exercise session.', staff: 'Alice Nguyen', image: null },
  { timestamp: '2023-10-01 12:00', message: 'Lunch served: Grilled chicken with vegetables.', staff: 'Bob Smith', image: 'meal.jpg' },
  { timestamp: '2023-10-01 10:00', message: 'Physical therapy session completed successfully.', staff: 'Dr. Lee', image: null },
  { timestamp: '2023-10-01 08:00', message: 'Morning medication administered.', staff: 'Alice Nguyen', image: null },
];

const mockAlerts = [
  { type: 'Medication Reminder', message: 'Next dose of Lisinopril due at 20:00', color: 'blue' },
  { type: 'Well-being Check', message: 'Daily check completed at 15:00', color: 'green' },
  { type: 'Visit Request', message: 'Your visit request for 2023-10-05 has been approved.', color: 'yellow' },
];

const mockNextVisit = '2023-10-05 14:00';

const FamilyDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [visitHour, setVisitHour] = useState('');
  const [visitMinute, setVisitMinute] = useState('');
  const [visitReason, setVisitReason] = useState('');

  const handleBookVisit = () => {
    // Mock submit logic
    console.log('Visit booked:', { date: selectedDate, time: `${visitHour}:${visitMinute}`, reason: visitReason });
    // Reset form
    setSelectedDate(new Date());
    setVisitHour('');
    setVisitMinute('');
    setVisitReason('');
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-blue-500';
  };

  const getAlertColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-l-blue-500';
      case 'green': return 'border-l-green-500';
      case 'yellow': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#5985D8] mb-6">Family Dashboard</h1>

      {/* Resident Overview */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Resident Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {mockResident.name}</p>
                <p><strong>Room/Bed:</strong> {mockResident.roomBed}</p>
                <p><strong>Age:</strong> {mockResident.age}</p>
                <p><strong>Health Status:</strong> {mockResident.healthStatus}</p>
              </div>
              <div>
                <p><strong>Latest Vitals:</strong> BP {mockResident.latestVitals.bp}, HR {mockResident.latestVitals.hr}, Temp {mockResident.latestVitals.temp}</p>
                <p><strong>Last Medication:</strong> {mockResident.lastMedication}</p>
                <div className="flex gap-2 mt-2">
                  {mockResident.flags.map((flag, idx) => (
                    <Badge key={idx} variant="destructive">{flag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Daily Activity Timeline */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {mockActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                    <div>
                      <p className="font-medium">{activity.time} - {activity.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Care Updates / Newsfeed */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Care Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNewsfeed.slice(0, 4).map((update, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-600">{update.timestamp} - {update.staff}</p>
                  <p>{update.message}</p>
                  {update.image && <img src={update.image} alt="Update" className="w-16 h-16 mt-2 rounded" />}
                  {idx < mockNewsfeed.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Visit Management */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Visit Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Next Scheduled Visit:</strong> {mockNextVisit}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-[#5985D8]">Book a Visit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book a Visit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">{selectedDate ? selectedDate.toDateString() : 'Pick a date'}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={visitHour} onValueChange={setVisitHour}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={visitMinute} onValueChange={setVisitMinute}>
                      <SelectTrigger>
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {['00', '15', '30', '45'].map(min => (
                          <SelectItem key={min} value={min}>{min}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Reason for visit..."
                    value={visitReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVisitReason(e.target.value)}
                  />
                  <Button onClick={handleBookVisit} className="bg-[#5985D8]">Submit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>

      {/* Alerts & Notifications */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert, idx) => (
                <Card key={idx} className={`border-l-4 ${getAlertColor(alert.color)}`}>
                  <CardContent className="p-4">
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm">{alert.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Family Quick Actions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <span>Send Message</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText size={20} />
                <span>View Health Records</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Heart size={20} />
                <span>View Care Plan</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Phone size={20} />
                <span>Emergency Contact</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default FamilyDashboard;
