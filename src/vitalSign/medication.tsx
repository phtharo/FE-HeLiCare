import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Mock data
const mockMedications = [
    { id: 1, name: 'Aspirin', dosage: '100mg', frequency: 'Twice daily', startDate: '2023-01-01', endDate: '2023-12-31' },
    { id: 2, name: 'Ibuprofen', dosage: '200mg', frequency: 'Once daily', startDate: '2023-02-01', endDate: '2023-11-30' },
];

const mockCarePlans = [
    { id: 1, title: 'Physical Therapy', assignedStaff: 'Dr. Smith', startDate: '2023-01-01', status: 'Active' },
    { id: 2, title: 'Dietary Plan', assignedStaff: 'Nurse Johnson', startDate: '2023-03-01', status: 'Inactive' },
];

interface Medication {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
}

interface CarePlan {
    id: number;
    title: string;
    assignedStaff: string;
    startDate: string;
    status: string;
}

const MedicationCarePlan: React.FC = () => {
    const [medications, setMedications] = useState<Medication[]>(mockMedications);
    const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlans);
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
    const [isCarePlanDialogOpen, setIsCarePlanDialogOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const [editingCarePlan, setEditingCarePlan] = useState<CarePlan | null>(null);

    // Medication form state
    const [medName, setMedName] = useState('');
    const [medDosage, setMedDosage] = useState('');
    const [medFrequency, setMedFrequency] = useState('');
    const [medStartDate, setMedStartDate] = useState('');
    const [medEndDate, setMedEndDate] = useState('');

    // Care Plan form state
    const [cpTitle, setCpTitle] = useState('');
    const [cpAssignedStaff, setCpAssignedStaff] = useState('');
    const [cpStartDate, setCpStartDate] = useState('');
    const [cpStatus, setCpStatus] = useState('');

    const handleAddMedication = () => {
        if (editingMedication) {
            setMedications(medications.map(med => med.id === editingMedication.id ? { ...editingMedication, name: medName, dosage: medDosage, frequency: medFrequency, startDate: medStartDate, endDate: medEndDate } : med));
        } else {
            const newMed: Medication = { id: Date.now(), name: medName, dosage: medDosage, frequency: medFrequency, startDate: medStartDate, endDate: medEndDate };
            setMedications([...medications, newMed]);
        }
        resetMedicationForm();
        setIsMedicationDialogOpen(false);
    };

    const handleEditMedication = (med: Medication) => {
        setEditingMedication(med);
        setMedName(med.name);
        setMedDosage(med.dosage);
        setMedFrequency(med.frequency);
        setMedStartDate(med.startDate);
        setMedEndDate(med.endDate);
        setIsMedicationDialogOpen(true);
    };

    const handleDeleteMedication = (id: number) => {
        setMedications(medications.filter(med => med.id !== id));
    };

    const handleAddCarePlan = () => {
        if (editingCarePlan) {
            setCarePlans(carePlans.map(cp => cp.id === editingCarePlan.id ? { ...editingCarePlan, title: cpTitle, assignedStaff: cpAssignedStaff, startDate: cpStartDate, status: cpStatus } : cp));
        } else {
            const newCp: CarePlan = { id: Date.now(), title: cpTitle, assignedStaff: cpAssignedStaff, startDate: cpStartDate, status: cpStatus };
            setCarePlans([...carePlans, newCp]);
        }
        resetCarePlanForm();
        setIsCarePlanDialogOpen(false);
    };

    const handleEditCarePlan = (cp: CarePlan) => {
        setEditingCarePlan(cp);
        setCpTitle(cp.title);
        setCpAssignedStaff(cp.assignedStaff);
        setCpStartDate(cp.startDate);
        setCpStatus(cp.status);
        setIsCarePlanDialogOpen(true);
    };

    const handleDeleteCarePlan = (id: number) => {
        setCarePlans(carePlans.filter(cp => cp.id !== id));
    };

    const resetMedicationForm = () => {
        setMedName('');
        setMedDosage('');
        setMedFrequency('');
        setMedStartDate('');
        setMedEndDate('');
        setEditingMedication(null);
    };

    const resetCarePlanForm = () => {
        setCpTitle('');
        setCpAssignedStaff('');
        setCpStartDate('');
        setCpStatus('');
        setEditingCarePlan(null);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto relative">
                <h1 className="text-3xl font-bold text-blue-800 mb-8">Medication & Care Plan</h1>

                <Tabs defaultValue="medications" className="w-full">
                    {/* chưa click được */}
                    <TabsList className="!grid grid-cols-2 w-full bg-white p-4 rounded-xl shadow-sm gap-4 relative z-50">
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                        <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
                    </TabsList>
                    <TabsContent value="medications">
                        <Card className="rounded-xl shadow-sm">
                            <CardHeader className="relative z-0">
                                <CardTitle>Medications</CardTitle>
                                <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetMedicationForm}>Add Medication</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingMedication ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="medName">Medication Name</Label>
                                                <Input id="medName" value={medName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedName(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="medDosage">Dosage</Label>
                                                <Input id="medDosage" value={medDosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedDosage(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="medFrequency">Frequency</Label>
                                                <Select value={medFrequency} onValueChange={setMedFrequency}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select frequency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Once daily">Once daily</SelectItem>
                                                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                                                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="medStartDate">Start Date</Label>
                                                <Input id="medStartDate" type="date" value={medStartDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedStartDate(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="medEndDate">End Date</Label>
                                                <Input id="medEndDate" type="date" value={medEndDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedEndDate(e.target.value)} />
                                            </div>
                                            <Button onClick={handleAddMedication}>{editingMedication ? 'Update' : 'Add'}</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Medication Name</TableHead>
                                            <TableHead>Dosage</TableHead>
                                            <TableHead>Frequency</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {medications.map((med) => (
                                            <TableRow key={med.id}>
                                                <TableCell>{med.name}</TableCell>
                                                <TableCell>{med.dosage}</TableCell>
                                                <TableCell>{med.frequency}</TableCell>
                                                <TableCell>{med.startDate}</TableCell>
                                                <TableCell>{med.endDate}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditMedication(med)}>Edit</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteMedication(med.id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="care-plans">
                        <Card className="rounded-xl shadow-sm">
                            <CardHeader className="relative z-0">
                                <CardTitle>Care Plans</CardTitle>
                                <Dialog open={isCarePlanDialogOpen} onOpenChange={setIsCarePlanDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetCarePlanForm}>Add Care Plan</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingCarePlan ? 'Edit Care Plan' : 'Add Care Plan'}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="cpTitle">Care Plan Title</Label>
                                                <Input id="cpTitle" value={cpTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpTitle(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="cpAssignedStaff">Assigned Staff</Label>
                                                <Input id="cpAssignedStaff" value={cpAssignedStaff} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpAssignedStaff(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="cpStartDate">Start Date</Label>
                                                <Input id="cpStartDate" type="date" value={cpStartDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpStartDate(e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor="cpStatus">Status</Label>
                                                <Select value={cpStatus} onValueChange={setCpStatus}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button onClick={handleAddCarePlan}>{editingCarePlan ? 'Update' : 'Add'}</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Care Plan Title</TableHead>
                                            <TableHead>Assigned Staff</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {carePlans.map((cp) => (
                                            <TableRow key={cp.id}>
                                                <TableCell>{cp.title}</TableCell>
                                                <TableCell>{cp.assignedStaff}</TableCell>
                                                <TableCell>{cp.startDate}</TableCell>
                                                <TableCell>{cp.status}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => handleEditCarePlan(cp)}>Edit</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteCarePlan(cp.id)}>Delete</Button>
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
        </div>
    );
};

export default MedicationCarePlan;
