import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

// Mock data for residents
const initialResidents = [
    {
        id: 1,
        name: 'Nguyen Van A',
        age: 70,
        room: 'P203',
        bed: 'B01',
        status: 'Occupied' as 'Occupied' | 'Available' | 'Maintenance',
    },
    {
        id: 2,
        name: 'Tran Thi B',
        age: 65,
        room: 'P203',
        bed: 'B02',
        status: 'Occupied' as 'Occupied' | 'Available' | 'Maintenance',
    },
    {
        id: 3,
        name: null,
        age: null,
        room: 'P105',
        bed: 'B01',
        status: 'Maintenance' as 'Occupied' | 'Available' | 'Maintenance',
    },
];

// Mock available rooms/beds (for assignment)
const availableRooms = [
    { room: 'P203', bed: 'B02', status: 'Available' },
    { room: 'P204', bed: 'B01', status: 'Available' },
    { room: 'P204', bed: 'B02', status: 'Available' },
];

type Resident = typeof initialResidents[0];

const RoomBedStaffPage: React.FC = () => {
    const [residents, setResidents] = useState<Resident[]>(initialResidents);
    const [isAdmitDialogOpen, setIsAdmitDialogOpen] = useState(false);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [newResident, setNewResident] = useState({
        name: '',
        age: '',
        room: '',
        bed: '',
    });
    const [transferData, setTransferData] = useState({
        room: '',
        bed: '',
    });
    const [maintenanceNote, setMaintenanceNote] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Available':
                return <Badge variant="default" className="bg-green-500 text-white text-sm">Available</Badge>;
            case 'Occupied':
                return <Badge variant="secondary" className="bg-yellow-500 text-white text-sm">Occupied</Badge>;
            case 'Maintenance':
                return <Badge variant="destructive" className="text-sm">Maintenance</Badge>;
            default:
                return <Badge className="text-sm bg-gray-300 text-gray-700">Unknown</Badge>;
        }
    };

    const handleAdmitResident = () => {
        if (!newResident.name || !newResident.age || !newResident.room || !newResident.bed) return;

        const newRes = {
            id: residents.length + 1,
            name: newResident.name,
            age: parseInt(newResident.age),
            room: newResident.room,
            bed: newResident.bed,
            status: 'Occupied' as const,
        };

        setResidents(prev => [...prev, newRes]);
        setNewResident({ name: '', age: '', room: '', bed: '' });
        setIsAdmitDialogOpen(false);
    };

    const handleTransferResident = () => {
        if (!selectedResident || !transferData.room || !transferData.bed) return;

        setResidents(prev =>
            prev.map(res =>
                res.id === selectedResident.id
                    ? { ...res, room: transferData.room, bed: transferData.bed }
                    : res
            )
        );
        setIsTransferDialogOpen(false);
        setSelectedResident(null);
        setTransferData({ room: '', bed: '' });
    };

    const handleCreateMaintenanceTicket = () => {
        if (!maintenanceNote) return;
        // Mock: just alert
        alert(`Maintenance ticket created: ${maintenanceNote}`);
        setMaintenanceNote('');
        setIsMaintenanceDialogOpen(false);
    };

    const availableOptions = availableRooms.filter(room => room.status === 'Available');

    return (
        <div className="w-full relative">
            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Room & Bed Management - Staff</h1>

                <div className="flex space-x-4">
                    <Dialog open={isAdmitDialogOpen} onOpenChange={setIsAdmitDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="text-lg bg-blue-500 text-white">Admit New Resident</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Admit New Resident</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-lg">Name</Label>
                                    <Input
                                        id="name"
                                        value={newResident.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewResident(prev => ({ ...prev, name: e.target.value }))}
                                        className="text-lg"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="age" className="text-lg">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={newResident.age}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewResident(prev => ({ ...prev, age: e.target.value }))}
                                        className="text-lg"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="room" className="text-lg">Room</Label>
                                    <Select value={newResident.room} onValueChange={(value: string) => setNewResident(prev => ({ ...prev, room: value }))}>
                                        <SelectTrigger className="text-lg">
                                            <SelectValue placeholder="Select room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.map((opt, idx) => (
                                                <SelectItem key={idx} value={opt.room}>
                                                    {opt.room} - {opt.bed}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="bed" className="text-lg">Bed</Label>
                                    <Select value={newResident.bed} onValueChange={(value: string) => setNewResident(prev => ({ ...prev, bed: value }))}>
                                        <SelectTrigger className="text-lg">
                                            <SelectValue placeholder="Select bed" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.filter(opt => opt.room === newResident.room).map((opt, idx) => (
                                                <SelectItem key={idx} value={opt.bed}>
                                                    {opt.bed}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAdmitResident} className="w-full text-lg bg-blue-500 text-white">
                                    Admit Resident
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-lg text-black">Create Maintenance Ticket</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Create Maintenance Ticket</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="note" className="text-lg">Note</Label>
                                    <Textarea
                                        id="note"
                                        value={maintenanceNote}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMaintenanceNote(e.target.value)}
                                        placeholder="Describe the issue"
                                        className="text-lg"
                                    />
                                </div>
                                <Button onClick={handleCreateMaintenanceTicket} className="w-full text-lg">
                                    Submit Ticket
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">All Residents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-lg font-semibold text-center">Name</TableHead>
                                    <TableHead className="text-lg font-semibold text-center">Age</TableHead>
                                    <TableHead className="text-lg font-semibold text-center">Room</TableHead>
                                    <TableHead className="text-lg font-semibold text-center">Bed</TableHead>
                                    <TableHead className="text-lg font-semibold text-center">Status</TableHead>
                                    <TableHead className="text-lg font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {residents.map((resident) => (
                                    <TableRow key={resident.id}>
                                        <TableCell className="text-base">{resident.name || 'N/A'}</TableCell>
                                        <TableCell className="text-base">{resident.age || 'N/A'}</TableCell>
                                        <TableCell className="text-base">{resident.room}</TableCell>
                                        <TableCell className="text-base">{resident.bed}</TableCell>
                                        <TableCell >{getStatusBadge(resident.status)}</TableCell>
                                        <TableCell>
                                            {resident.status === 'Occupied' && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedResident(resident);
                                                        setIsTransferDialogOpen(true);
                                                    }}
                                                    className="text-lg"
                                                >
                                                    Transfer
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Transfer Dialog */}
                <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Transfer Resident</DialogTitle>
                        </DialogHeader>
                        {selectedResident && (
                            <div className="space-y-4">
                                <p className="text-lg">Transferring: {selectedResident.name}</p>
                                <div>
                                    <Label htmlFor="transferRoom" className="text-lg">New Room</Label>
                                    <Select value={transferData.room} onValueChange={(value: string) => setTransferData(prev => ({ ...prev, room: value }))}>
                                        <SelectTrigger className="text-lg">
                                            <SelectValue placeholder="Select room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.map((opt, idx) => (
                                                <SelectItem key={idx} value={opt.room}>
                                                    {opt.room} - {opt.bed}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="transferBed" className="text-lg">New Bed</Label>
                                    <Select value={transferData.bed} onValueChange={(value: string) => setTransferData(prev => ({ ...prev, bed: value }))}>
                                        <SelectTrigger className="text-lg">
                                            <SelectValue placeholder="Select bed" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableOptions.filter(opt => opt.room === transferData.room).map((opt, idx) => (
                                                <SelectItem key={idx} value={opt.bed}>
                                                    {opt.bed}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleTransferResident} className="w-full text-lg bg-blue-500 text-white">
                                    Transfer
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default RoomBedStaffPage;
