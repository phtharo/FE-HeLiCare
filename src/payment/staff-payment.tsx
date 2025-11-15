import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

// Mock data for service requests
const initialRequests = [
  {
    id: 1,
    residentName: 'Nguyen Van A',
    serviceType: 'Home Care',
    notes: 'Weekly visits needed',
    price: 500000,
    status: 'Pending admin approval' as 'Pending admin approval' | 'Approved' | 'Rejected',
  },
  {
    id: 2,
    residentName: 'Tran Thi B',
    serviceType: 'Medical Checkup',
    notes: 'Monthly health check',
    price: 300000,
    status: 'Approved' as 'Pending admin approval' | 'Approved' | 'Rejected',
  },
];

const PaymentModuleStaff: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [formData, setFormData] = useState({
    residentName: '',
    serviceType: '',
    notes: '',
    price: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.residentName || !formData.serviceType || !formData.price) return;

    const newRequest = {
      id: requests.length + 1,
      residentName: formData.residentName,
      serviceType: formData.serviceType,
      notes: formData.notes,
      price: parseInt(formData.price),
      status: 'Pending admin approval' as const,
    };

    // Mock API call
    setTimeout(() => {
      setRequests(prev => [...prev, newRequest]);
      setFormData({ residentName: '', serviceType: '', notes: '', price: '' });
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending admin approval':
        return <Badge variant="secondary" className="text-lg">Pending</Badge>;
      case 'Approved':
        return <Badge variant="default" className="text-lg">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="text-lg">Rejected</Badge>;
      default:
        return <Badge className="text-lg">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Payment Module - Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="residentName" className="text-lg">Resident Name</Label>
              <Input
                id="residentName"
                value={formData.residentName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('residentName', e.target.value)}
                placeholder="Enter resident name"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="serviceType" className="text-lg">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home Care">Home Care</SelectItem>
                  <SelectItem value="Medical Checkup">Medical Checkup</SelectItem>
                  <SelectItem value="Emergency Assistance">Emergency Assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes" className="text-lg">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-lg">Price (VND)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
                className="text-lg"
              />
            </div>
            <Button onClick={handleSubmit} className="text-lg bg-[#5985d8] hover:bg-[#4a6fc1]">
              Submit Service Request
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">Resident Name</TableHead>
                <TableHead className="text-lg">Service Type</TableHead>
                <TableHead className="text-lg">Notes</TableHead>
                <TableHead className="text-lg">Price (VND)</TableHead>
                <TableHead className="text-lg">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="text-lg">{request.residentName}</TableCell>
                  <TableCell className="text-lg">{request.serviceType}</TableCell>
                  <TableCell className="text-lg">{request.notes}</TableCell>
                  <TableCell className="text-lg">{request.price.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModuleStaff;
