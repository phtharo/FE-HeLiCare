import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Textarea } from '../components/ui/textarea';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for nutrition plans
const initialPlans = [
    {
        id: 1,
        mealName: 'Breakfast - Oatmeal',
        calories: 300,
        mealType: 'Breakfast',
        date: '2023-10-01',
        assignedResident: 'Nguyen Van A',
        notes: 'Low sugar, high fiber',
    },
    {
        id: 2,
        mealName: 'Lunch - Grilled Chicken Salad',
        calories: 450,
        mealType: 'Lunch',
        date: '2023-10-01',
        assignedResident: 'Tran Thi B',
        notes: 'Balanced protein and veggies',
    },
    {
        id: 3,
        mealName: 'Dinner - Baked Salmon',
        calories: 500,
        mealType: 'Dinner',
        date: '2023-10-02',
        assignedResident: 'Le Van C',
        notes: 'Omega-3 rich',
    },
    // Add more mock data as needed
];

interface DietGroup {
    conditions?: string[];
    allergies?: string[];
}

type Plan = {
    id: number;
    mealName: string;
    calories: number;
    mealType: string;
    date: string;
    assignedResident: string;
    notes: string;
    dietGroup?: DietGroup;
    dietCategory?: string;
};

const NutritionPlanManagementPage: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [search, setSearch] = useState('');
    const [mealTypeFilter, setMealTypeFilter] = useState('');
    const [residentFilter, setResidentFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        mealName: '',
        calories: '',
        mealType: '',
        date: '',
        assignedResident: '',
        dietGroup: {
            conditions: [] as string[],
            allergies: [] as string[],
        },
        dietCategory: '',
        notes: '',
    });

    const uniqueDietGroups = useMemo<string[]>(() => {
        const groups = plans.map(p => {
            const g = p.dietGroup;
            if (!g) return null;
            return `${g.conditions?.join(",") || ""}|${g.allergies?.join(",") || ""}`;
        });

        return Array.from(new Set(groups.filter((g): g is string => g !== null && g !== undefined)));
    }, [plans]);


    const dietCategories = [
        "Low Sugar",
        "Low Sodium",
        "Low Carb",
        "High Protein",
        "Soft",
    ];
    const itemsPerPage = 5;

    // Filtered and searched plans
    const filteredPlans = useMemo(() => {
        const s = search.toLowerCase();

        return plans.filter(plan => {
            // Search theo nhiều field
            const matchesSearch =
                plan.mealName.toLowerCase().includes(s) ||
                plan.notes.toLowerCase().includes(s) ||
                plan.assignedResident.toLowerCase().includes(s);

            // Meal type filter fix all_types
            const matchesMealType =
                mealTypeFilter === "" ||
                mealTypeFilter === "all_types" ||
                plan.mealType === mealTypeFilter;

            // Resident filter fix all_residents
            const matchesResident =
                residentFilter === "" ||
                residentFilter === "all_residents" ||
                plan.assignedResident === residentFilter;

            const matchesDate = !dateFilter || plan.date === dateFilter;

            // Diet Group filter fix
            let matchesGroup = true;

            if (groupFilter && groupFilter !== "all") {
                const [condStr, allergyStr] = groupFilter.split("|");
                const condArr = condStr ? condStr.split(",") : [];
                const allergyArr = allergyStr ? allergyStr.split(",") : [];

                matchesGroup =
                    condArr.some(c => plan.dietGroup?.conditions?.includes(c)) ||
                    allergyArr.some(a => plan.dietGroup?.allergies?.includes(a));
            }

            return (
                matchesSearch &&
                matchesMealType &&
                matchesResident &&
                matchesDate &&
                matchesGroup
            );
        });
    }, [plans, search, mealTypeFilter, residentFilter, dateFilter, groupFilter]);


    // Paginated plans
    const paginatedPlans = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPlans.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPlans, currentPage]);

    const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

    const handleAddEdit = () => {
        if (editingPlan) {
            setPlans(prev =>
                prev.map(plan => (plan.id === editingPlan.id ? { ...plan, ...formData, calories: parseInt(formData.calories) || 0 } : plan))
            );
        } else {
            const newPlan = {
                id: plans.length + 1,
                ...formData,
                calories: parseInt(formData.calories) || 0,
            };
            setPlans(prev => [...prev, newPlan]);
        }
        setIsDialogOpen(false);
        setEditingPlan(null);
        setFormData({
            mealName: '',
            calories: '',
            mealType: '',
            date: '',
            assignedResident: '',
            dietGroup: {
                conditions: [] as string[],
                allergies: [] as string[],
            },
            dietCategory: '',
            notes: '',
        });
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            mealName: plan.mealName,
            calories: plan.calories.toString(),
            mealType: plan.mealType,
            date: plan.date,
            assignedResident: plan.assignedResident,
            dietGroup: (plan as any).dietGroup ?? { conditions: [] as string[], allergies: [] as string[] },
            dietCategory: (plan as any).dietCategory ?? '', // Load giá trị dietCategory
            notes: plan.notes,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setPlans(prev => prev.filter(plan => plan.id !== id));
    };

    const handleView = (plan: Plan) => {
        alert(`Viewing details for ${plan.mealName}`);
    };

    const uniqueMealTypes = [...new Set(plans.map(p => p.mealType))];
    const uniqueResidents = [...new Set(plans.map(p => p.assignedResident))];

    return (
        <div className="container mx-auto p-6 space-y-6 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-800">Nutrition Plan Management</h1>

            {/* Filters and Search */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search plans..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="mealTypeFilter">Meal Type</Label>
                            <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_types">All Types</SelectItem>
                                    {uniqueMealTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Diet Group</Label>
                            <Select value={groupFilter} onValueChange={setGroupFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Groups</SelectItem>

                                    {uniqueDietGroups.map(g => (
                                        <SelectItem key={g} value={g}>
                                            {g.replace("|", " + ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="residentFilter">Resident</Label>
                            <Select value={residentFilter} onValueChange={setResidentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Residents" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_residents">All Residents</SelectItem>
                                    {uniqueResidents.map(resident => (
                                        <SelectItem key={resident} value={resident}>{resident}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="dateFilter">Date</Label>
                            <Input
                                id="dateFilter"
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Plan Button */}
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingPlan(null)} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Nutrition Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingPlan ? 'Edit Nutrition Plan' : 'Add New Nutrition Plan'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="mealName">Meal Name</Label>
                                <Input
                                    id="mealName"
                                    value={formData.mealName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, mealName: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="calories">Calories</Label>
                                    <Input
                                        id="calories"
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mealType">Meal Type</Label>
                                    <Select value={formData.mealType} onValueChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Breakfast">Breakfast</SelectItem>
                                            <SelectItem value="Lunch">Lunch</SelectItem>
                                            <SelectItem value="Dinner">Dinner</SelectItem>
                                            <SelectItem value="Snack">Snack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="assignedResident">Assigned Resident</Label>
                                    <Input
                                        id="assignedResident"
                                        value={formData.assignedResident}
                                        onChange={(e) => setFormData(prev => ({ ...prev, assignedResident: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>
                            <Button onClick={handleAddEdit} className="w-full bg-blue-600 hover:bg-blue-700">
                                {editingPlan ? 'Update Plan' : 'Add Plan'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Plans Table */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Nutrition Plans</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-base font-semibold text-center">Meal Name</TableHead>
                                <TableHead className="text-base font-semibold text-center">Calories</TableHead>
                                <TableHead className="text-base font-semibold text-center">Meal Type</TableHead>
                                <TableHead className="text-base font-semibold text-center">Date</TableHead>
                                <TableHead className="text-base font-semibold text-center">Resident</TableHead>
                                <TableHead className="text-base font-semibold text-center">Diet Group</TableHead>
                                <TableHead className="text-base font-semibold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPlans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="text-base font-medium text-left">{plan.mealName}</TableCell>
                                    <TableCell className="text-base text-center">{plan.calories}</TableCell>
                                    <TableCell className="text-base text-center">{plan.mealType}</TableCell>
                                    <TableCell className="text-base text-center">{plan.date}</TableCell>
                                    <TableCell className="text-base text-left">{plan.assignedResident}</TableCell>
                                    <TableCell className="text-lg">
                                        <div className="flex flex-wrap gap-1">
                                            {plan.dietGroup?.conditions?.map((c, i) => (
                                                <Badge key={`c-${i}`} variant="outline" className="bg-blue-50 text-blue-700">
                                                    {c}
                                                </Badge>
                                            ))}
                                            {plan.dietGroup?.allergies?.map((a, i) => (
                                                <Badge key={`a-${i}`} variant="outline" className="bg-red-50 text-red-700">
                                                    {a}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleView(plan)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default NutritionPlanManagementPage;
