import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

/* ------------------------------------------
   MOCK: Resident data
-------------------------------------------*/
const residentData = {
    residentName: "Nguyen Van A",
    room: 'P203',
    bed: 'B02',
    status: 'Occupied' as 'Occupied' | 'Available' | 'Maintenance',
};

type MaintenanceRequest = {
    id: string;
    note: string;
    room: string;
    bed: string;
    createdAt: string;
    status: "Pending" | "In Progress" | "Done";
};

const RoomBedResidentPage: React.FC = () => {
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [requestNote, setRequestNote] = useState('');

    // NEW: list of requests stored inside this page
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);

    const handleSubmitRequest = () => {
        if (!requestNote.trim()) return;

        const newRequest: MaintenanceRequest = {
            id: crypto.randomUUID(),
            note: requestNote,
            room: residentData.room,
            bed: residentData.bed,
            createdAt: new Date().toLocaleString(),
            status: "Pending",
        };

        // Push to list
        setRequests(prev => [...prev, newRequest]);

        setRequestNote('');
        setIsRequestDialogOpen(false);
    };

    return (
        <div className="w-full relative">
            <div className="container mx-auto p-6 space-y-6 -ml-10">
                <h1 className="text-3xl font-bold text-gray-800">My Room & Bed</h1>

                {/* ROOM INFO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Assigned Room and Bed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div><strong>Resident:</strong> {residentData.residentName}</div>
                            <div><strong>Room:</strong> {residentData.room}</div>
                            <div><strong>Bed:</strong> {residentData.bed}</div>
                            <div><strong>Status:</strong> {residentData.status}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* SUPPORT REQUEST */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Support Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg mb-4">
                            If you need assistance with your room or bed, please submit a maintenance request.
                        </p>

                        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="text-lg bg-blue-500 hover:bg-blue-600 text-white">
                                    Request Maintenance Assistance
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Request Maintenance Assistance</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="note" className="text-lg">Describe the issue</Label>
                                        <Textarea
                                            id="note"
                                            value={requestNote}
                                            onChange={(e) => setRequestNote(e.target.value)}
                                            placeholder="Please describe the problem with your room or bed"
                                            className="text-lg"
                                        />
                                    </div>

                                    <Button onClick={handleSubmitRequest} className="w-full text-lg">
                                        Submit Request
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* REQUEST HISTORY */}
                {requests.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">My Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {requests.map(req => (
                                    <div key={req.id} className="p-3 border rounded-lg bg-gray-50">
                                        <p><strong>Issue:</strong> {req.note}</p>
                                        <p><strong>Room/Bed:</strong> {req.room} - {req.bed}</p>
                                        <p><strong>Time:</strong> {req.createdAt}</p>
                                        <p><strong>Status:</strong> {req.status}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
};

export default RoomBedResidentPage;
