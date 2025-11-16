import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';

interface Notification {
  id: string;
  residentName: string;
  type: string;
  timestamp: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

const FamilyNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      residentName: 'John Doe',
      type: 'Medication',
      timestamp: '2023-10-01 10:00 AM',
      message: 'Medication reminder: Take aspirin at 10 AM.',
      severity: 'medium',
      isRead: false,
    },
    {
      id: '2',
      residentName: 'Jane Smith',
      type: 'Health Alerts',
      timestamp: '2023-10-01 09:30 AM',
      message: 'Blood pressure reading is high. Please consult a doctor.',
      severity: 'high',
      isRead: false,
    },
    {
      id: '3',
      residentName: 'John Doe',
      type: 'Daily Life',
      timestamp: '2023-09-30 08:00 PM',
      message: 'Daily activity summary: Walked 5000 steps today.',
      severity: 'low',
      isRead: true,
    },
    {
      id: '4',
      residentName: 'Jane Smith',
      type: 'Payment',
      timestamp: '2023-09-29 02:00 PM',
      message: 'Payment for October services is due.',
      severity: 'medium',
      isRead: true,
    },
    {
      id: '5',
      residentName: 'John Doe',
      type: 'Visits',
      timestamp: '2023-09-28 11:00 AM',
      message: 'Scheduled visit with family member today.',
      severity: 'low',
      isRead: false,
    },
  ]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter((n) => n.type === activeTab);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
    markAsRead(notification.id);
  };

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

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#5985D8' }}>
        Notification Center
      </h1>

      {/* Unread Notifications Section */}
      {unreadNotifications.length > 0 && (
        <Card className="mb-6 shadow-lg rounded-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
            <CardTitle className="flex justify-between items-center">
              Unread Notifications ({unreadNotifications.length})
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                style={{ borderColor: '#5985D8', color: '#5985D8' }}
              >
                Mark All as Read
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 overflow-auto custom-scroll">
              {unreadNotifications.map((notification, index) => (
                <div key={notification.id} className="mb-4">
                  <Card className="p-4 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getSeverityColor(notification.severity)}>
                            {notification.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{notification.type}</span>
                        </div>
                        <p className="font-semibold">{notification.residentName}</p>
                        <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(notification)}
                        style={{ borderColor: '#5985D8', color: '#5985D8' }}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                  {index < unreadNotifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6 rounded-lg bg-white shadow-sm">
          <TabsTrigger value="All" className="rounded-md">All</TabsTrigger>
          <TabsTrigger value="Medication" className="rounded-md">Medication</TabsTrigger>
          <TabsTrigger value="Health Alerts" className="rounded-md">Health Alerts</TabsTrigger>
          <TabsTrigger value="Daily Life" className="rounded-md">Daily Life</TabsTrigger>
          <TabsTrigger value="Payment" className="rounded-md">Payment</TabsTrigger>
          <TabsTrigger value="Visits" className="rounded-md">Visits</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
              <CardTitle>{activeTab} Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-96 overflow-auto custom-scroll">
                {filteredNotifications.length === 0 ? (
                  <p className="text-center text-gray-500">No notifications in this category.</p>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <div key={notification.id} className="mb-4">
                      <Card className={`p-4 shadow-sm rounded-lg hover:shadow-md transition-shadow ${!notification.isRead ? 'border-l-4 border-blue-500' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getSeverityColor(notification.severity)}>
                                {notification.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium">{notification.type}</span>
                              {!notification.isRead && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Unread
                                </Badge>
                              )}
                            </div>
                            <p className="font-semibold">{notification.residentName}</p>
                            <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(notification)}
                            style={{ borderColor: '#5985D8', color: '#5985D8' }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                      {index < filteredNotifications.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <strong>Resident:</strong> {selectedNotification.residentName}
              </div>
              <div>
                <strong>Type:</strong> {selectedNotification.type}
              </div>
              <div>
                <strong>Severity:</strong>
                <Badge className={`ml-2 ${getSeverityColor(selectedNotification.severity)}`}>
                  {selectedNotification.severity.toUpperCase()}
                </Badge>
              </div>
              <div>
                <strong>Timestamp:</strong> {selectedNotification.timestamp}
              </div>
              <div>
                <strong>Message:</strong> {selectedNotification.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyNotifications;
