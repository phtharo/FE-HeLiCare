import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

// Mock data for the resident's room and bed
const residentData = {
    room: 'P203',
    bed: 'B02',
    status: 'Occupied' as 'Occupied' | 'Available' | 'Maintenance',
};

const RoomBedResidentPage: React.FC = () => {
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [requestNote, setRequestNote] = useState('');

    const handleSubmitRequest = () => {
        if (!requestNote.trim()) return;
        // Mock: just alert
        alert(`Maintenance request submitted: ${requestNote}`);
        setRequestNote('');
        setIsRequestDialogOpen(false);
    };

    return (
        <div className="w-full relative">
            <div className="container mx-auto p-6 space-y-6 -ml-10">
                <h1 className="text-3xl font-bold text-gray-800">My Room & Bed</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Assigned Room and Bed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-base">
                                <strong>Room:</strong> {residentData.room}
                            </div>
                            <div className="text-base">
                                <strong>Bed:</strong> {residentData.bed}
                            </div>
                            <div className="text-base">
                                <strong>Status:</strong> {residentData.status}
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                <Button className="text-lg bg-blue-500 hover:bg-blue-600 text-white">Request Maintenance Assistance</Button>
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
            </div>
        </div>
    );
};

export default RoomBedResidentPage;
