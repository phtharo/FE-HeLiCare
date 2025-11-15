import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Mock data for price list
const initialPriceList = [
  { id: 1, serviceName: 'Home Care Service', price: 500000 },
  { id: 2, serviceName: 'Medical Checkup', price: 300000 },
  { id: 3, serviceName: 'Emergency Assistance', price: 200000 },
];

// Mock data for all invoices
const initialInvoices = [
  {
    id: 1,
    serviceName: 'Home Care Service',
    residentName: 'Nguyen Van A',
    amount: 500000,
    vat: 50000,
    total: 550000,
    status: 'paid' as 'paid' | 'unpaid' | 'failed' | 'approved' | 'rejected',
  },
  {
    id: 2,
    serviceName: 'Medical Checkup',
    residentName: 'Tran Thi B',
    amount: 300000,
    vat: 30000,
    total: 330000,
    status: 'unpaid' as 'paid' | 'unpaid' | 'failed' | 'approved' | 'rejected',
  },
  {
    id: 3,
    serviceName: 'Emergency Assistance',
    residentName: 'Le Van C',
    amount: 200000,
    vat: 20000,
    total: 220000,
    status: 'approved' as 'paid' | 'unpaid' | 'failed' | 'approved' | 'rejected',
  },
];

const PaymentModuleAdmin: React.FC = () => {
  const [priceList, setPriceList] = useState(initialPriceList);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddPriceDialogOpen, setIsAddPriceDialogOpen] = useState(false);
  const [isEditPriceDialogOpen, setIsEditPriceDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{ id: number; serviceName: string; price: number } | null>(null);
  const [newPrice, setNewPrice] = useState({ serviceName: '', price: '' });

  // Revenue summary
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

  const handleAddPrice = () => {
    if (!newPrice.serviceName || !newPrice.price) return;
    const newItem = {
      id: priceList.length + 1,
      serviceName: newPrice.serviceName,
      price: parseInt(newPrice.price),
    };
    setPriceList(prev => [...prev, newItem]);
    setNewPrice({ serviceName: '', price: '' });
    setIsAddPriceDialogOpen(false);
  };

  const handleEditPrice = () => {
    if (!editingPrice) return;
    setPriceList(prev =>
      prev.map(item =>
        item.id === editingPrice.id ? { ...item, serviceName: editingPrice.serviceName, price: editingPrice.price } : item
      )
    );
    setIsEditPriceDialogOpen(false);
    setEditingPrice(null);
  };

  const handleDeletePrice = (id: number) => {
    setPriceList(prev => prev.filter(item => item.id !== id));
  };

  const handleMarkInvoice = (id: number, status: 'approved' | 'rejected') => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const filteredInvoices = filterStatus === 'all' ? invoices : invoices.filter(inv => inv.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="text-lg">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="secondary" className="text-lg">Unpaid</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-lg">Failed</Badge>;
      case 'approved':
        return <Badge variant="default" className="text-lg">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-lg">Rejected</Badge>;
      default:
        return <Badge className="text-lg">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue" className="text-lg">Revenue Summary</TabsTrigger>
          <TabsTrigger value="prices" className="text-lg">Manage Price List</TabsTrigger>
          <TabsTrigger value="invoices" className="text-lg">View Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} VND</p>
                  <p className="text-lg">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalInvoices}</p>
                  <p className="text-lg">Total Invoices</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{paidInvoices}</p>
                  <p className="text-lg">Paid Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Manage Price List</CardTitle>
              <Dialog open={isAddPriceDialogOpen} onOpenChange={setIsAddPriceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-lg">Add New Service</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">Add New Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="serviceName" className="text-lg">Service Name</Label>
                      <Input
                        id="serviceName"
                        value={newPrice.serviceName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPrice(prev => ({ ...prev, serviceName: e.target.value }))}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-lg">Price (VND)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newPrice.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPrice(prev => ({ ...prev, price: e.target.value }))}
                        className="text-lg"
                      />
                    </div>
                    <Button onClick={handleAddPrice} className="w-full text-lg">Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg">Service Name</TableHead>
                    <TableHead className="text-lg">Price (VND)</TableHead>
                    <TableHead className="text-lg">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-lg">{item.serviceName}</TableCell>
                      <TableCell className="text-lg">{item.price.toLocaleString()}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPrice(item);
                            setIsEditPriceDialogOpen(true);
                          }}
                          className="text-lg"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeletePrice(item.id)}
                          className="text-lg"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditPriceDialogOpen} onOpenChange={setIsEditPriceDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Service</DialogTitle>
              </DialogHeader>
              {editingPrice && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editServiceName" className="text-lg">Service Name</Label>
                    <Input
                      id="editServiceName"
                      value={editingPrice.serviceName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingPrice(prev => prev ? { ...prev, serviceName: e.target.value } : null)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPrice" className="text-lg">Price (VND)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      value={editingPrice.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingPrice(prev => prev ? { ...prev, price: parseInt(e.target.value) } : null)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleEditPrice} className="w-full text-lg">Save</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">All Invoices</CardTitle>
              <div className="flex items-center space-x-4">
                <Label htmlFor="filter" className="text-lg">Filter by Status:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg">Service Name</TableHead>
                    <TableHead className="text-lg">Resident Name</TableHead>
                    <TableHead className="text-lg">Amount (VND)</TableHead>
                    <TableHead className="text-lg">VAT (VND)</TableHead>
                    <TableHead className="text-lg">Total (VND)</TableHead>
                    <TableHead className="text-lg">Status</TableHead>
                    <TableHead className="text-lg">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="text-lg">{invoice.serviceName}</TableCell>
                      <TableCell className="text-lg">{invoice.residentName}</TableCell>
                      <TableCell className="text-lg">{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-lg">{invoice.vat.toLocaleString()}</TableCell>
                      <TableCell className="text-lg font-bold">{invoice.total.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="space-x-2">
                        {invoice.status !== 'approved' && invoice.status !== 'rejected' && (
                          <>
                            <Button
                              onClick={() => handleMarkInvoice(invoice.id, 'approved')}
                              className="text-lg"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleMarkInvoice(invoice.id, 'rejected')}
                              className="text-lg"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentModuleAdmin;
