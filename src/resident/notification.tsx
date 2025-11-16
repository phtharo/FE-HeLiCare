import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { AlertTriangle, Pill, Calendar, ClipboardList, MessageSquare, Bell } from 'lucide-react';
interface Notification {
    id: string;
    category: 'SOS' | 'Medication' | 'Schedule' | 'Care Plan' | 'Messages';
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
}

const ResidentNotificationsCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            category: 'SOS',
            title: 'SOS Alert Triggered',
            description: 'An SOS alert was activated in your room. Staff is responding.',
            timestamp: '2023-10-01 10:00 AM',
            isRead: false,
        },
        {
            id: '2',
            category: 'Medication',
            title: 'Medication Reminder',
            description: 'Time to take your aspirin (81mg).',
            timestamp: '2023-10-01 09:30 AM',
            isRead: false,
        },
        {
            id: '3',
            category: 'Schedule',
            title: 'Upcoming Appointment',
            description: 'Doctor visit scheduled for tomorrow at 2:00 PM.',
            timestamp: '2023-09-30 08:00 PM',
            isRead: true,
        },
        {
            id: '4',
            category: 'Care Plan',
            title: 'Care Plan Update',
            description: 'Your daily exercise routine has been updated.',
            timestamp: '2023-09-29 07:00 PM',
            isRead: false,
        },
        {
            id: '5',
            category: 'Messages',
            title: 'New Message from Staff',
            description: 'Dr. Smith: Please call the clinic for your results.',
            timestamp: '2023-09-28 06:00 PM',
            isRead: true,
        },
    ]);

    const [activeTab, setActiveTab] = useState<string>('All');

    const filteredNotifications = activeTab === 'All'
        ? notifications
        : activeTab === 'Unread'
            ? notifications.filter((n) => !n.isRead)
            : notifications.filter((n) => n.category === activeTab);

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };



    // ... rest of the component ...

    const getIcon = (category: string) => {
        switch (category) {
            case 'SOS':
                return <AlertTriangle size={24} />;
            case 'Medication':
                return <Pill size={24} />;
            case 'Schedule':
                return <Calendar size={24} />;
            case 'Care Plan':
                return <ClipboardList size={24} />;
            case 'Messages':
                return <MessageSquare size={24} />;
            default:
                return <Bell size={24} />;
        }
    };


    return (
        <div className="container mx-auto p-4 max-w-6xl min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#5985D8' }}>
                Notifications Center
            </h1>

            <div className="flex justify-between items-center mb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 rounded-lg bg-white shadow-sm">
                        <TabsTrigger value="All" className="rounded-md">All</TabsTrigger>
                        <TabsTrigger value="Unread" className="rounded-md">Unread</TabsTrigger>
                        <TabsTrigger value="SOS" className="rounded-md">Alerts</TabsTrigger>
                        <TabsTrigger value="Schedule" className="rounded-md">Schedule</TabsTrigger>
                        <TabsTrigger value="Messages" className="rounded-md">Messages</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    style={{ borderColor: '#5985D8', color: '#5985D8' }}
                >
                    Mark All as Read
                </Button>
            </div>

            <div className="space-y-4 mt-2">
                {filteredNotifications.length === 0 ? (
                    <p className="text-center text-gray-500">No notifications in this category.</p>
                ) : (
                    filteredNotifications.map((notification, index) => (
                        <div key={notification.id}>
                            <Card className={`p-4 shadow-sm rounded-lg hover:shadow-md transition-shadow ${!notification.isRead ? 'border-l-4 border-blue-500' : ''}`}>
                                <CardContent className="p-0">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">{getIcon(notification.category)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold">{notification.title}</h3>
                                                <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                                                    {notification.isRead ? 'Read' : 'Unread'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{notification.description}</p>
                                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {index < filteredNotifications.length - 1 && (
                                <Separator className="my-3" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResidentNotificationsCenter;
