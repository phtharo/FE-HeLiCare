import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
// removed import of missing ScrollArea component; using native scroll container instead
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

interface Submission {
  id: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  date: string;
  attachment?: File | null;
}

const FamilyFeedbackSupport: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      category: 'App Issue',
      subject: 'App crashes on login',
      message: 'The app keeps crashing when I try to log in. Please fix this.',
      priority: 'High',
      status: 'In Review',
      date: '2023-10-01',
      attachment: null,
    },
    {
      id: '2',
      category: 'Care Concern',
      subject: 'Medication reminder not working',
      message: 'The medication reminder is not sending notifications.',
      priority: 'Medium',
      status: 'Resolved',
      date: '2023-09-15',
      attachment: null,
    },
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!category || !subject || !message || !priority) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const newSubmission: Submission = {
      id: Date.now().toString(),
      category,
      subject,
      message,
      priority,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      attachment,
    };
    setSubmissions([newSubmission, ...submissions]);
    setCategory('');
    setSubject('');
    setMessage('');
    setPriority('');
    setAttachment(null);
    toast.success('Feedback submitted successfully!');
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Review':
        return 'bg-blue-500';
      case 'Resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#5985D8' }}>
        Feedback & Support
      </h1>

      {/* Submit Feedback Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Feedback or Support Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Feedback">General Feedback</SelectItem>
                <SelectItem value="App Issue">App Issue</SelectItem>
                <SelectItem value="Care Concern">Care Concern</SelectItem>
                <SelectItem value="Request Assistance">Request Assistance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message / Description *</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your feedback or issue"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority *</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Attachment (optional)</label>
            <Input
              type="file"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              accept="image/*"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            style={{ backgroundColor: '#5985D8' }}
          >
            Submit
          </Button>
        </CardContent>
      </Card>

      {/* Feedback History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-auto">
            {submissions.length === 0 ? (
              <p className="text-center text-gray-500">No submissions yet.</p>
            ) : (
              submissions.map((submission, index) => (
                <div key={submission.id}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <span className="text-sm text-gray-600">{submission.category}</span>
                      </div>
                      <p className="font-medium">{submission.subject}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {submission.message.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500">Submitted: {submission.date}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(submission)}
                    >
                      View Details
                    </Button>
                  </div>
                  {index < submissions.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <strong>Category:</strong> {selectedSubmission.category}
              </div>
              <div>
                <strong>Subject:</strong> {selectedSubmission.subject}
              </div>
              <div>
                <strong>Message:</strong> {selectedSubmission.message}
              </div>
              <div>
                <strong>Priority:</strong> {selectedSubmission.priority}
              </div>
              <div>
                <strong>Status:</strong> {selectedSubmission.status}
              </div>
              <div>
                <strong>Date:</strong> {selectedSubmission.date}
              </div>
              {selectedSubmission.attachment && (
                <div>
                  <strong>Attachment:</strong>
                  <img
                    src={URL.createObjectURL(selectedSubmission.attachment)}
                    alt="Attachment"
                    className="mt-2 max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyFeedbackSupport;
