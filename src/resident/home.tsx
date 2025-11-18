import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';

interface Vital {
  name: string;
  value: string;
  unit: string;
  normal: boolean;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

interface Meal {
  time: string;
  meal: string;
  description: string;
}

interface Medication {
  name: string;
  dosage: string;
  time: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ResidentHomeScreen: React.FC = () => {
  const residentName = 'John Doe';

  const vitals: Vital[] = [
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', normal: true },
    { name: 'Heart Rate', value: '72', unit: 'bpm', normal: true },
    { name: 'Temperature', value: '98.6', unit: '°F', normal: true },
  ];

  const schedule: ScheduleItem[] = [
    { time: '9:00 AM', activity: 'Morning Walk' },
    { time: '11:00 AM', activity: 'Physical Therapy' },
    { time: '2:00 PM', activity: 'Lunch' },
  ];

  const meals: Meal[] = [
    { time: '8:00 AM', meal: 'Breakfast', description: 'Oatmeal with fruits' },
    { time: '12:00 PM', meal: 'Lunch', description: 'Grilled chicken salad' },
    { time: '6:00 PM', meal: 'Dinner', description: 'Baked salmon with veggies' },
  ];

  const medications: Medication[] = [
    { name: 'Aspirin', dosage: '81mg', time: '8:00 AM' },
    { name: 'Metformin', dosage: '500mg', time: '12:00 PM' },
  ];

  const messages: Message[] = [
    { sender: 'Alice', content: 'Hi Dad, how are you?', timestamp: '10:00 AM' },
    { sender: 'Bob', content: 'Call me when you can.', timestamp: '9:30 AM' },
    { sender: 'System', content: 'Medication reminder set.', timestamp: '8:00 AM' },
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen p-4">
      {/* Welcome Header */}
      <div className="flex items-center mb-6">
        <Avatar className="w-16 h-16 mr-4">
          <AvatarImage src="https://via.placeholder.com/64" alt={residentName} />
          <AvatarFallback>{residentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#5985D8' }}>
            Welcome, {residentName}
          </h1>
          <p className="text-gray-600">Here's your daily overview</p>
        </div>
      </div>

      {/* Today's Vital Signs */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Today's Vital Signs</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vitals.map((vital) => (
              <div key={vital.name} className="text-center">
                <p className="text-lg font-semibold">{vital.name}</p>
                <p className={`text-2xl font-bold ${vital.normal ? 'text-green-600' : 'text-red-600'}`}>
                  {vital.value} {vital.unit}
                </p>
                {!vital.normal && <Badge variant="destructive">Abnormal</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Schedule Preview */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Daily Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-32">
            {schedule.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <p className="font-semibold">{item.time}</p>
                <p>{item.activity}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Nutrition & Meals Preview */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-32">
            {meals.map((meal, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{meal.time} - {meal.meal}</p>
                <p className="text-sm text-gray-600">{meal.description}</p>
                {index < meals.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Medication Reminders */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-32">
            {medications.map((med, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm text-gray-600">{med.dosage}</p>
                </div>
                <p>{med.time}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Family Messages Preview */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Family Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-32">
            {messages.map((msg, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{msg.sender}</p>
                <p className="text-sm text-gray-600">{msg.content}</p>
                <p className="text-xs text-gray-500">{msg.timestamp}</p>
                {index < messages.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Button className="h-16 text-lg" style={{ backgroundColor: '#5985D8' }}>
          My Profile
        </Button>
        <Button className="h-16 text-lg" style={{ backgroundColor: '#5985D8' }}>
          Health Records
        </Button>
        <Button className="h-16 text-lg" style={{ backgroundColor: '#5985D8' }}>
          Daily Activities
        </Button>
        <Button className="h-16 text-lg" style={{ backgroundColor: '#5985D8' }}>
          Nutrition
        </Button>
        <Button className="h-16 text-lg" style={{ backgroundColor: '#5985D8' }}>
          Family Communication
        </Button> */}
      {/* </div> */}
    </div>
  );
};

export default ResidentHomeScreen;
