import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const residentData = {
    residentName: "Nguyen Van A",
    room: "P203",
    bed: "B01",
    floor: 2,
    area: "A",
    status: "Occupied" as "Available" | "Occupied" | "Maintenance",
};

const RoomBedFamilyPage: React.FC = () => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available":
                return <Badge className="bg-green-500 text-white text-sm">Available</Badge>;
            case "Occupied":
                return <Badge className="bg-yellow-500 text-white text-sm">Occupied</Badge>;
            case "Maintenance":
                return <Badge variant="destructive" className="text-sm">Maintenance</Badge>;
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
                        <div className="max-w-lg grid grid-cols-[150px_1fr] gap-y-4 text-base items-center">

                            <div className="font-semibold">Name:</div>
                            <div>{residentData.residentName}</div>

                            <div className="font-semibold">Room:</div>
                            <div>{residentData.room}</div>

                            <div className="font-semibold">Bed:</div>
                            <div>{residentData.bed}</div>

                            <div className="font-semibold">Floor:</div>
                            <div>{residentData.floor}</div>

                            <div className="font-semibold">Area:</div>
                            <div>{residentData.area}</div>

                            <div className="font-semibold">Status:</div>
                            <div>{getStatusBadge(residentData.status)}</div>

                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export { RoomBedFamilyPage };
