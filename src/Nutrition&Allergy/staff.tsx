import React, { useState, useEffect } from "react";
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

const normalizeList = (value: string | string[]): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
};

// CONDITION + ALLERGY MAPPING
const conditionMap: Record<string, string> = {
  "Đái tháo đường": "Diabetes",
  "Tăng huyết áp": "Hypertension",
  "Huyết áp cao": "Hypertension",
  "Khó nuốt": "Dysphagia",
  "Rối loạn nuốt": "Dysphagia",
};

const allergyMap: Record<string, string> = {
  "Đậu phộng": "Peanuts",
  Sữa: "Milk",
  Gluten: "Gluten",
};

export interface Condition {
  id: string;
  name: string;
}

export interface Allergen {
  id: string;
  name: string;
}

const mockConditions: Condition[] = [
  { id: "1", name: "Diabetes" },
  { id: "2", name: "Hypertension" },
  { id: "3", name: "Dysphagia" },
];

const mockAllergens: Allergen[] = [
  { id: "1", name: "Peanuts" },
  { id: "2", name: "Milk" },
  { id: "3", name: "Gluten" },
];

function resolveItem<T extends { id: string; name: string }>(
  rawName: string,
  list: T[]
): T {
  const match = list.find(
    (i) => i.name.toLowerCase() === rawName.toLowerCase()
  );
  if (match) return match;

  const newItem = {
    id: crypto.randomUUID(),
    name: rawName,
  } as T;

  list.push(newItem);
  return newItem;
}

function mapConditions(comorbidities: string[] | string): Condition[] {
  const list = Array.isArray(comorbidities)
    ? comorbidities
    : comorbidities?.split(",").map((x) => x.trim()) || [];

  return list.map((c) => {
    const english = conditionMap[c] || c;
    return resolveItem(english, mockConditions);
  });
}

function mapAllergies(allergies: string[]): Allergen[] {
  return (allergies || []).map((a) => {
    const english = allergyMap[a] || a;
    return resolveItem(english, mockAllergens);
  });
}


// DIET GROUP MOCK
export interface DietGroup {
  id: string;
  name: string;
  recommendedConditions: Condition[];
}

const mockDietGroups: DietGroup[] = [
  { id: "1", name: "Low Sugar", recommendedConditions: [mockConditions[0]] },
  { id: "2", name: "Low Sodium", recommendedConditions: [mockConditions[1]] },
  { id: "3", name: "Low Carb", recommendedConditions: [] },
  { id: "4", name: "High Protein", recommendedConditions: [] },
  { id: "5", name: "Soft", recommendedConditions: [mockConditions[2]] },
];

// MENU + MEALS
const mockMeals = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mockMenuItems = [
  { id: "1", name: "Oatmeal with Peanuts", allergens: [mockAllergens[0]] },
  { id: "2", name: "Milk Shake", allergens: [mockAllergens[1]] },
  { id: "3", name: "Gluten-Free Salad", allergens: [] },
  { id: "4", name: "Chicken Soup", allergens: [] },
  { id: "5", name: "Beef Steak", allergens: [] },
];


// RESIDENT INTERFACE + CONVERTER
export interface Resident {
  id: string;
  name: string;
  avatar?: string;
  room: string;
  bed?: string;
  conditions: Condition[];
  allergies: Allergen[];
  dietGroupId?: string;
}

function detectDietGroup(conditions: Condition[]): string | undefined {
  if (conditions.some((c) => c.name === "Diabetes")) return "1";
  if (conditions.some((c) => c.name === "Hypertension")) return "2";
  if (conditions.some((c) => c.name === "Dysphagia")) return "5";
  return undefined;
}

function convertResidents(rawResidents: any[], roomData: any[]): Resident[] {
  return rawResidents.map((r) => {
    const cond = mapConditions(r.comorbidities || []);
    const allerg = mapAllergies(r.allergies || []);

    const roomEntry = roomData.find(
      (x) => String(x.residentId) === String(r.id)
    ) || { room: "N/A", bed: "N/A" };

    return {
      id: String(r.id),
      name: r.fullName,
      avatar: r.avatar || "https://via.placeholder.com/40",
      room: roomEntry.room,
      bed: roomEntry.bed,
      conditions: cond,
      allergies: allerg,
      dietGroupId: detectDietGroup(cond),
    };
  });
}

// GROUP CARD
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

// RESIDENT DETAIL DIALOG
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


// CHECK ALLERGY FOR MEAL
function checkAllergy(resident: Resident, dishId: string) {
  const dish = mockMenuItems.find(d => d.id === dishId);
  if (!dish) return false;

  return resident.allergies.some(a =>
    dish.allergens.some(ma => ma.id === a.id)
  );
}


// MEAL LOG TABLE
const MealLogTable = ({ residents, date, mealType, dishId, onLog }: any) => {
  const [consumptions, setConsumptions] = useState<Record<string, string | undefined>>({});
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
          const conflict = checkAllergy(r, dishId);

          return (
            <TableRow key={r.id} className={conflict ? "bg-red-50" : ""}>
              <TableCell>
                {r.name}
                {conflict && (
                  <span className="text-red-600 ml-2">
                    Allergy Risk
                  </span>
                )}
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

// MAIN PAGE
const NutritionPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<DietGroup | null>(null); // detail dialog
  const [selectedLogGroup, setSelectedLogGroup] = useState<DietGroup | null>(null); // meal logging
  const [assignGroup, setAssignGroup] = useState<DietGroup | null>(null);
  // const [selectedMeal, setSelectedMeal] = useState("");
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

  const saveResident = (form: any) => {
    const resident = {
      id: form.id ?? crypto.randomUUID(),
      fullName: form.fullName.trim(),
      avatar: form.avatar || "",
      comorbidities: normalizeList(form.comorbidities),
      allergies: normalizeList(form.allergies),
      dietGroupId: form.dietGroupId || undefined,
    };

    const stored = JSON.parse(localStorage.getItem("residents") || "[]");

    const updated = [
      ...stored.filter((r: any) => String(r.id) !== String(resident.id)),
      resident
    ];

    localStorage.setItem("residents", JSON.stringify(updated));
    setResidents(updated);
  };

  const groupCounts = mockDietGroups.map((g) => ({
    ...g,
    count: residents.filter((r) => r.dietGroupId === g.id).length,
  }));

  const todayAllergens = selectedDish
    ? mockMenuItems.find(i => i.id === selectedDish)?.allergens || []
    : [];


  const conflictingResidents = residents.filter((r) =>
    r.allergies.some((a) =>
      todayAllergens.some((al) => al.name === a.name)
    )
  );

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

    // Allergy check
    const conflict = resident?.allergies.some((a) =>
      item.allergens.some((al) => al.id === a.id)
    );

    if (conflict) {
      const ok = window.confirm(
        `${resident?.name} is allergic to this meal. Continue?`
      );
      if (!ok) return;
    }

    // ------------------------------
    // ✅ SAVE MEAL LOG TO localStorage
    // ------------------------------
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

    const updatedLogs = [...logs, newLog];
    localStorage.setItem("mealLogs", JSON.stringify(updatedLogs));

    console.log("Saved Meal:", newLog);
    alert("Meal logged!");
  };


  return (
    <div className="w-full relative">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>

      <div className="relative z-10 container mx-auto p-4 space-y-6">
        <Card className="bg-sky-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Nutrition Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupCounts.map((g) => (
                <div key={g.id} className="text-center">
                  <h3 className="font-semibold">{g.name}</h3>
                  <p>{g.count} residents</p>
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

        {/* GROUP CARDS */}
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
                <div
                  key={r.id}
                  className="flex justify-between text-black"
                >
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

              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
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
                  {mockMenuItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLogGroup?.id ?? ""}
                onValueChange={(val) =>
                  setSelectedLogGroup(mockDietGroups.find((g) => g.id === val) || null)
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
