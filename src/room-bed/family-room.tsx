import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Mock data for the resident's room and bed (from family perspective)
const residentData = {
    residentName: "Nguyen Van A",   // ← thêm field này
    room: "P203",
    floor: 2,
    area: "A",
    status: "Safe" as "Safe" | "Maintenance" | "Occupied",
};

const RoomBedFamilyPage: React.FC = () => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Safe":
                return (
                    <Badge variant="default" className="bg-green-500 text-white text-lg">
                        Safe
                    </Badge>
                );
            case "Maintenance":
                return (
                    <Badge variant="destructive" className="text-lg">
                        Maintenance
                    </Badge>
                );
            case "Occupied":
                return (
                    <Badge variant="secondary" className="bg-yellow-500 text-white text-lg">
                        Occupied
                    </Badge>
                );
            default:
                return <Badge className="text-lg">Unknown</Badge>;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 rounded-2xl">
            <h1 className="text-3xl font-bold text-gray-800">
                {residentData.residentName}'s Room & Bed
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Room Information for {residentData.residentName}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-center">
                        <div className="max-w-lg mx-auto grid grid-cols-[150px_1fr] gap-y-4 text-lg items-center">
                            <div className="font-semibold text-left">Resident Name:</div>
                            <div>{residentData.residentName}</div>

                            <div className="font-semibold text-left">Room Details:</div>
                            <div>{residentData.room}</div>

                            <div className="font-semibold text-left">Floor:</div>
                            <div>{residentData.floor}</div>

                            <div className="font-semibold text-left">Area:</div>
                            <div>{residentData.area}</div>
                            <div className='text-left'>
                                <strong>Status:</strong> {getStatusBadge(residentData.status)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export { RoomBedFamilyPage };