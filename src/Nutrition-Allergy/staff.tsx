import React, { useState, useEffect } from "react";

import {
  mapConditions,
  mapAllergies,
  detectDietGroup,
  mockConditions,
  mockAllergens,
  mockDietGroups,
  mockMenuItems,
  checkAllergy,
  normalizeList
} from "../utils/nutrition-core";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";


// ------------------------------------------
// Resident Interface
// ------------------------------------------
export interface Resident {
  id: string;
  name: string;
  avatar?: string;
  room: string;
  bed?: string;
  conditions: typeof mockConditions;
  allergies: typeof mockAllergens;
  dietGroupId?: string;
}


// ------------------------------------------
// Convert raw resident → Resident model chuẩn
// ------------------------------------------
function convertResidents(rawResidents: any[], roomData: any[]): Resident[] {
  return rawResidents.map((r) => {
    const conditions = mapConditions(r.comorbidities || []);
    const allergies = mapAllergies(r.allergies || []);

    const roomEntry =
      roomData.find((x) => String(x.residentId) === String(r.id)) ||
      { room: "N/A", bed: "N/A" };

    return {
      id: String(r.id),
      name: r.fullName,
      avatar: r.avatar || "https://via.placeholder.com/40",
      room: roomEntry.room,
      bed: roomEntry.bed,
      conditions,
      allergies,
      dietGroupId: detectDietGroup(conditions),
    };
  });
}


// ------------------------------------------
// Group Card Component
// ------------------------------------------
const GroupCard = ({ group, onDetail, onAssign }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button className="bg-gray-200 text-black" onClick={onDetail}>
            Detail
          </Button>
          <Button className="bg-amber-200 text-black" onClick={onAssign}>
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


// ------------------------------------------
// Resident Detail Dialog
// ------------------------------------------
const ResidentDetailDialog = ({
  group,
  residents,
  onAssign,
  onClose,
  className,
}: any) => {
  const [search, setSearch] = useState("");

  const filtered = residents.filter(
    (r: Resident) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.room.includes(search)
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Residents in {group.name}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search resident"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filtered.map((r: Resident) => (
            <div key={r.id} className="flex justify-between">
              <div>
                <p>
                  {r.name} (Room {r.room})
                </p>
                <div className="flex gap-1">
                  {r.conditions.map((c) => (
                    <Badge key={c.id}>{c.name}</Badge>
                  ))}
                  {r.allergies.map((a) => (
                    <Badge key={a.id} variant="destructive">
                      {a.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Select onValueChange={(val) => onAssign(r.id, val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change group" />
                </SelectTrigger>
                <SelectContent>
                  {mockDietGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ------------------------------------------
// Meal Log Table
// ------------------------------------------
const MealLogTable = ({ residents, date, mealType, dishId, onLog }: any) => {
  const [consumptions, setConsumptions] = useState<
    Record<string, string | undefined>
  >({});

  const handleLog = (id: string) => {
    const consumption = consumptions[id];
    if (!consumption) return alert("Select consumption");

    onLog({
      id: `${id}-${date}-${mealType}-${dishId}`,
      residentId: id,
      date,
      mealType,
      dishId,
      consumption,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resident</TableHead>
          <TableHead>Consumption</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {residents.map((r: Resident) => {
          const conflict = checkAllergy(r.allergies, dishId);

          return (
            <TableRow key={r.id} className={conflict ? "bg-red-50" : ""}>
              <TableCell>
                {r.name}
                {conflict && <span className="text-red-600 ml-2">Allergy Risk</span>}
              </TableCell>

              <TableCell>
                <Select
                  onValueChange={(v) =>
                    setConsumptions((p) => ({ ...p, [r.id]: v }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="half">50%</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell>
                <Button onClick={() => handleLog(r.id)}>Log</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};


// ------------------------------------------
// MAIN PAGE – STAFF DASHBOARD
// ------------------------------------------
const NutritionPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [assignGroup, setAssignGroup] = useState<any>(null);
  const [selectedLogGroup, setSelectedLogGroup] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedDish, setSelectedDish] = useState("");

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("residents") || "[]");
    const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");

    setResidents(convertResidents(raw, rooms));
  }, []);

  const assignResident = (id: string, groupId: string) => {
    const updated = residents.map((r) =>
      r.id === id ? { ...r, dietGroupId: groupId } : r
    );

    setResidents(updated);
    localStorage.setItem("residents", JSON.stringify(updated));
  };

  const logMeal = (record: any) => {
    if (!record.mealType || !record.dishId) {
      alert("Invalid meal record");
      return;
    }

    const resident = residents.find((r) => r.id === record.residentId);
    const item = mockMenuItems.find((m) => m.id === record.dishId);
    if (!item) return;

    const conflict = resident?.allergies.some((a) =>
      item.allergens.some((al) => al.id === a.id)
    );

    if (conflict) {
      const ok = window.confirm(
        `${resident?.name} is allergic to this meal. Continue?`
      );
      if (!ok) return;
    }

    const logs = JSON.parse(localStorage.getItem("mealLogs") || "[]");

    const newLog = {
      id: crypto.randomUUID(),
      residentId: record.residentId,
      date: record.date,
      mealType: record.mealType,
      dishId: record.dishId,
      consumption: record.consumption,
      timestamp: Date.now(),
    };

    localStorage.setItem("mealLogs", JSON.stringify([...logs, newLog]));
    alert("Meal logged!");
  };

  const todayAllergens = selectedDish
    ? mockMenuItems.find((i) => i.id === selectedDish)?.allergens || []
    : [];

  const conflictingResidents = residents.filter((r) =>
    r.allergies.some((a) =>
      todayAllergens.some((al) => al.name === a.name)
    )
  );


  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div className="w-full relative">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>

      <div className="relative z-10 container mx-auto p-4 space-y-6">
        
        {/* DASHBOARD CARD */}
        <Card className="bg-sky-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Nutrition Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDietGroups.map((g) => (
                <div key={g.id} className="text-center">
                  <h3 className="font-semibold">{g.name}</h3>
                  <p>
                    {
                      residents.filter((r) => r.dietGroupId === g.id).length
                    }{" "}
                    residents
                  </p>
                </div>
              ))}
            </div>

            {conflictingResidents.length > 0 && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
                <h4 className="font-semibold text-red-700">
                  Allergy Warnings
                </h4>
                <ul>
                  {conflictingResidents.map((r) => (
                    <li key={r.id}>
                      {r.name} (Room {r.room})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GROUPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          {mockDietGroups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              onDetail={() => setSelectedGroup(g)}
              onAssign={() => setAssignGroup(g)}
            />
          ))}
        </div>

        {/* ASSIGN DIALOG */}
        <Dialog open={!!assignGroup} onOpenChange={() => setAssignGroup(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Assign Resident to {assignGroup?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {residents.map((r) => (
                <div key={r.id} className="flex justify-between text-black">
                  <div>
                    <p>
                      {r.name} (Room {r.room})
                    </p>

                    <div className="flex gap-1">
                      {r.conditions.map((c) => (
                        <Badge key={c.id}>{c.name}</Badge>
                      ))}
                      {r.allergies.map((a) => (
                        <Badge key={a.id} variant="destructive">
                          {a.name}
                        </Badge>
                      ))}
                    </div>

                    {r.allergies.length > 0 && (
                      <p className="text-red-600 text-sm">
                        Resident has allergies.
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      assignResident(r.id, assignGroup!.id);
                      setAssignGroup(null);
                    }}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>


        {/* MEAL LOGGING */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Meal Logging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <Select
                value={selectedMealType}
                onValueChange={setSelectedMealType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDish} onValueChange={setSelectedDish}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Menu Item" />
                </SelectTrigger>
                <SelectContent>
                  {mockMenuItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLogGroup?.id ?? ""}
                onValueChange={(val) =>
                  setSelectedLogGroup(
                    mockDietGroups.find((g) => g.id === val) || null
                  )
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  {mockDietGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLogGroup && selectedMealType && selectedDish && (
              <MealLogTable
                residents={residents.filter(
                  (r) => r.dietGroupId === selectedLogGroup.id
                )}
                date={selectedDate}
                mealType={selectedMealType}
                dishId={selectedDish}
                onLog={logMeal}
              />
            )}
          </CardContent>
        </Card>

        {selectedGroup && (
          <ResidentDetailDialog
            className="text-black"
            group={selectedGroup}
            residents={residents.filter(
              (r) => r.dietGroupId === selectedGroup.id
            )}
            onAssign={assignResident}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NutritionPage;
