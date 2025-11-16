import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'image' | 'update';
  content: string;
  image?: string;
}

interface Visit {
  id: string;
  visitor: string;
  relationship: string;
  date: string;
  time: string;
  status: 'approved' | 'pending' | 'completed';
}

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

const ResidentFamily: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isVideoCallDialogOpen, setIsVideoCallDialogOpen] = useState<boolean>(false);
  const [selectedCallMember, setSelectedCallMember] = useState<string>('');

  const initialMessages: Message[] = [
    {
      id: '1',
      sender: 'Alice Johnson',
      timestamp: '2023-10-01 10:00 AM',
      type: 'text',
      content: 'Hi Mom, how are you feeling today?',
    },
    {
      id: '2',
      sender: 'Bob Smith',
      timestamp: '2023-10-01 09:30 AM',
      type: 'image',
      content: 'Here\'s a photo from our family picnic!',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: '3',
      sender: 'System',
      timestamp: '2023-09-30 08:00 PM',
      type: 'update',
      content: 'New medication schedule updated.',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const visits: Visit[] = [
    {
      id: '1',
      visitor: 'Alice Johnson',
      relationship: 'Daughter',
      date: '2023-10-05',
      time: '2:00 PM',
      status: 'approved',
    },
    {
      id: '2',
      visitor: 'Bob Smith',
      relationship: 'Son',
      date: '2023-10-10',
      time: '11:00 AM',
      status: 'pending',
    },
  ];

  const photos: Photo[] = [
    { id: '1', url: 'https://via.placeholder.com/200', caption: 'Family gathering' },
    { id: '2', url: 'https://via.placeholder.com/200', caption: 'Birthday celebration' },
    { id: '3', url: 'https://via.placeholder.com/200', caption: 'Holiday trip' },
  ];

  const notifications: Notification[] = [
    { id: '1', message: 'Visit request approved by Alice Johnson', timestamp: '2023-10-01 10:00 AM' },
    { id: '2', message: 'New message from Bob Smith', timestamp: '2023-10-01 09:30 AM' },
  ];

  const familyMembers = ['Alice Johnson', 'Bob Smith', 'Charlie Brown'];

  const handleRequestSubmit = () => {
    if (!selectedMember || !selectedDate || !selectedTime || !purpose) {
      alert('Please fill in all fields.');
      return;
    }
    alert('Visit request submitted!');
    setIsRequestDialogOpen(false);
    setSelectedMember('');
    setSelectedDate(new Date());
    setSelectedTime('');
    setPurpose('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      timestamp: format(new Date(), 'yyyy-MM-dd hh:mm a'),
      type: 'text',
      content: newMessage,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleStartVideoCall = () => {
    if (!selectedCallMember) {
      alert('Please select a family member to call.');
      return;
    }
    alert(`Starting video call with ${selectedCallMember}`);
    setIsVideoCallDialogOpen(false);
    setSelectedCallMember('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#5985D8' }}>
        Family Module
      </h1>

      {/* Family Communication Overview */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className=" rounded-t-lg flex justify-between items-center">
          <CardTitle></CardTitle>
          <Dialog open={isVideoCallDialogOpen} onOpenChange={setIsVideoCallDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#5985D8' }}>Video Call</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Start Video Call</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Family Member</label>
                  <Select value={selectedCallMember} onValueChange={setSelectedCallMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleStartVideoCall} className="w-full" style={{ backgroundColor: '#5985D8' }}>
                  Start Call
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-64">
            {messages.map((msg, index) => (
              <div key={msg.id} className="mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold">{msg.sender}</p>
                      <p className="text-xs text-gray-500">{msg.timestamp}</p>
                    </div>
                    {msg.type === 'text' && <p>{msg.content}</p>}
                    {msg.type === 'image' && (
                      <div>
                        <p>{msg.content}</p>
                        <img src={msg.image} alt="Shared" className="mt-2 max-w-full h-auto rounded" />
                      </div>
                    )}
                    {msg.type === 'update' && <p className="text-blue-600">{msg.content}</p>}
                  </div>
                </div>
                {index < messages.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </ScrollArea>
          <div className="mt-4 flex space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} style={{ backgroundColor: '#5985D8' }}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Family Visit Schedule */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Upcoming Visits</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-48">
            {visits.map((visit, index) => (
              <div key={visit.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{visit.visitor} ({visit.relationship})</p>
                    <p className="text-sm text-gray-600">{visit.date} at {visit.time}</p>
                  </div>
                  <Badge className={getStatusColor(visit.status)}>
                    {visit.status.toUpperCase()}
                  </Badge>
                </div>
                {index < visits.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Request a Visit */}
      <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Request a Visit</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#5985D8' }}>Request Visit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request a Visit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Family Member</label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Purpose</label>
                  <Textarea
                    value={purpose}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)}
                    placeholder="Describe the purpose of the visit"
                  />
                </div>
                <Button onClick={handleRequestSubmit} className="w-full" style={{ backgroundColor: '#5985D8' }}>
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Photo & Memory Gallery */}
      {/* <Card className="mb-6 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Photo & Memory Gallery</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedPhoto(photo);
                  setIsPhotoDialogOpen(true);
                }}
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover rounded" />
                <p className="text-sm mt-1">{photo.caption}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Notifications Panel */}
      {/* <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-white rounded-t-lg">
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-32">
            {notifications.map((notif, index) => (
              <div key={notif.id} className="mb-2">
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.timestamp}</p>
                {index < notifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card> */}

      {/* Photo Preview Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.caption}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full h-auto rounded" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentFamily;
