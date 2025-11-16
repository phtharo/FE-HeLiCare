import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';

interface Vital {
  name: string;
  value: string;
  unit: string;
  normal: boolean;
}

interface Medication {
  name: string;
  dosage: string;
  time: string;
}

interface WellnessEntry {
  date: string;
  stress: number;
  mood: string;
  sleep: number;
  appetite: string;
  notes: string;
}

interface Alert {
  id: string;
  date: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

const ResidentMyHealth: React.FC = () => {
  const vitals: Vital[] = [
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', normal: true },
    { name: 'Heart Rate', value: '72', unit: 'bpm', normal: true },
    { name: 'Temperature', value: '98.6', unit: '°F', normal: true },
    { name: 'SpO2', value: '95', unit: '%', normal: false },
    { name: 'Glucose', value: '140', unit: 'mg/dL', normal: false },
  ];

  const hrTrend = [65, 70, 72, 75, 68, 72, 74];
  const bpTrend = [118, 120, 122, 119, 121, 120, 118];
  const glucoseTrend = [130, 135, 140, 138, 142, 139, 141];

  const medications: Medication[] = [
    { name: 'Aspirin', dosage: '81mg', time: '8:00 AM' },
    { name: 'Metformin', dosage: '500mg', time: '12:00 PM' },
    { name: 'Lisinopril', dosage: '10mg', time: '6:00 PM' },
  ];

  const carePlan = [
    'Daily walk for 30 minutes',
    'Low-sodium diet',
    'Blood pressure check twice daily',
    'Avoid caffeine after 2 PM',
  ];

  const wellnessLog: WellnessEntry[] = [
    {
      date: '2023-10-01',
      stress: 3,
      mood: 'Good',
      sleep: 8,
      appetite: 'Normal',
      notes: 'Felt energetic today.',
    },
    {
      date: '2023-09-30',
      stress: 5,
      mood: 'Tired',
      sleep: 6,
      appetite: 'Low',
      notes: 'Had trouble sleeping.',
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      date: '2023-10-01',
      message: 'High blood pressure detected.',
      severity: 'high',
    },
    {
      id: '2',
      date: '2023-09-28',
      message: 'Low SpO2 level.',
      severity: 'medium',
    },
    {
      id: '3',
      date: '2023-09-25',
      message: 'Glucose level elevated.',
      severity: 'low',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderChart = (data: number[], label: string) => (
    <div className="flex items-end space-x-1 h-20">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-blue-300 rounded-t"
          style={{ height: `${(value / Math.max(...data)) * 100}%`, width: '20px' }}
        ></div>
      ))}
      <p className="text-xs mt-2">{label}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
        <h1 className="text-3xl font-bold" style={{ color: '#5985D8' }}>
          My Health Overview
        </h1>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6 rounded-lg bg-white shadow-sm">
          <TabsTrigger value="vitals" className="rounded-md">Vitals</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-md">Trends</TabsTrigger>
          <TabsTrigger value="meds" className="rounded-md">Meds</TabsTrigger>
          <TabsTrigger value="care" className="rounded-md">Care Plan</TabsTrigger>
          <TabsTrigger value="wellness" className="rounded-md">Wellness</TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-md">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.map((vital) => (
              <Card key={vital.name} className="shadow-lg rounded-lg">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
                  <CardTitle className="text-lg">{vital.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className={`text-2xl font-bold ${vital.normal ? 'text-green-600' : 'text-red-600'}`}>
                    {vital.value} {vital.unit}
                  </p>
                  {!vital.normal && <Badge variant="destructive" className="mt-2">Abnormal</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-lg rounded-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
                <CardTitle>Heart Rate Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {renderChart(hrTrend, 'bpm')}
              </CardContent>
            </Card>
            <Card className="shadow-lg rounded-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
                <CardTitle>Blood Pressure Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {renderChart(bpTrend, 'mmHg')}
              </CardContent>
            </Card>
            <Card className="shadow-lg rounded-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
                <CardTitle>Glucose Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {renderChart(glucoseTrend, 'mg/dL')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meds">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
              <CardTitle>Upcoming Medications</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-64">
                {medications.map((med, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      💊
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage} at {med.time}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
              <CardTitle>Care Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {carePlan.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
              <CardTitle>Daily Wellness Log</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-64">
                {wellnessLog.map((entry, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{entry.date}</p>
                    <p>Stress: {entry.stress}/10</p>
                    <p>Mood: {entry.mood}</p>
                    <p>Sleep: {entry.sleep} hours</p>
                    <p>Appetite: {entry.appetite}</p>
                    <p>Notes: {entry.notes}</p>
                    {index < wellnessLog.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
              <CardTitle>My Alerts History</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-64">
                {alerts.map((alert, index) => (
                  <div key={alert.id} className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-600">{alert.date}</span>
                    </div>
                    <p>{alert.message}</p>
                    {index < alerts.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResidentMyHealth;