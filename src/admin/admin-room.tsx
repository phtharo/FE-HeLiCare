import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

// Mock data for rooms and beds
const initialRooms = [
  {
    id: 'P203',
    floor: 2,
    area: 'A',
    description: 'Standard room with basic amenities',
    beds: [
      { bed: 'B01', status: 'Occupied' as 'Occupied' | 'Available' | 'Maintenance', resident: 'Nguyen Van A' },
      { bed: 'B02', status: 'Available' as 'Occupied' | 'Available' | 'Maintenance', resident: null },
    ],
  },
  {
    id: 'P105',
    floor: 1,
    area: 'B',
    description: 'VIP room with premium services',
    beds: [
      { bed: 'B01', status: 'Maintenance' as 'Occupied' | 'Available' | 'Maintenance', resident: null },
    ],
  },
];

type Room = typeof initialRooms[0];
type Bed = typeof initialRooms[0]['beds'][0];

const RoomBedAdminPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Calculate occupancy stats
  const totalBeds = rooms.reduce((sum, room) => sum + room.beds.length, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.beds.filter(bed => bed.status === 'Occupied').length, 0);
  const availableBeds = rooms.reduce((sum, room) => sum + room.beds.filter(bed => bed.status === 'Available').length, 0);
  const maintenanceBeds = rooms.reduce((sum, room) => sum + room.beds.filter(bed => bed.status === 'Maintenance').length, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge variant="default" className="bg-green-500 text-white text-lg">Available</Badge>;
      case 'Occupied':
        return <Badge variant="secondary" className="bg-yellow-500 text-white text-lg">Occupied</Badge>;
      case 'Maintenance':
        return <Badge variant="destructive" className="text-lg">Maintenance</Badge>;
      default:
        return <Badge className="text-lg">Unknown</Badge>;
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingRoom) return;
    setRooms(prev =>
      prev.map(room =>
        room.id === editingRoom.id ? editingRoom : room
      )
    );
    setIsEditDialogOpen(false);
    setEditingRoom(null);
  };

  const handleInputChange = (field: keyof Room, value: string | number) => {
    if (!editingRoom) return;
    setEditingRoom(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-6 overflow-visible">
      <h1 className="text-3xl font-bold text-gray-800">Room & Bed Management</h1>

      {/* Occupancy Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBeds}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{occupiedBeds}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{availableBeds}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{maintenanceBeds}</p>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Rate Chart (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <div className="flex items-center space-x-4">
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ width: `${occupancyRate}%` }}
              >
                {occupancyRate}%
              </div>
            </div>
          </div>
          <p className="text-lg mt-2">Current occupancy: {occupiedBeds} / {totalBeds} beds</p>
        </CardContent>
      </Card>

      {/* Rooms List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All Rooms</CardTitle>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">Room ID</TableHead>
                <TableHead className="text-lg">Floor</TableHead>
                <TableHead className="text-lg">Area</TableHead>
                <TableHead className="text-lg">Description</TableHead>
                <TableHead className="text-lg">Beds</TableHead>
                <TableHead className="text-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="text-lg font-bold">{room.id}</TableCell>
                  <TableCell className="text-lg">{room.floor}</TableCell>
                  <TableCell className="text-lg">{room.area}</TableCell>
                  <TableCell className="text-lg">{room.description}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {room.beds.map((bed, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-lg">{bed.bed}:</span>
                          {getStatusBadge(bed.status)}
                          {bed.resident && <span className="text-lg">({bed.resident})</span>}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditRoom(room)} className="text-lg bg-gray-400 hover:bg-gray-500 text-white">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Room</DialogTitle>
          </DialogHeader>
          {editingRoom && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="floor" className="text-lg">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  value={editingRoom.floor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('floor', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-lg">Area</Label>
                <Input
                  id="area"
                  value={editingRoom.area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('area', e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-lg">Description</Label>
                <Textarea
                  id="description"
                  value={editingRoom.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button onClick={handleSaveEdit} className="w-full text-lg">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomBedAdminPage;
