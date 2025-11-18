import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

/* ============================
   SYNC FROM STAFF MAPPING
============================= */

const conditionMap: Record<string, string> = {
    "Đái tháo đường": "Diabetes",
    "Tăng huyết áp": "Hypertension",
    "Huyết áp cao": "Hypertension",
    "Khó nuốt": "Dysphagia",
    "Rối loạn nuốt": "Dysphagia",
};

const allergyMap: Record<string, string> = {
    "Đậu phộng": "Peanuts",
    "Sữa": "Milk",
    "Gluten": "Gluten",
};

interface Condition {
    id: string;
    name: string;
}

interface Allergen {
    id: string;
    name: string;
}

const mockConditions: Condition[] = [
    { id: "1", name: "Diabetes" },
    { id: "2", name: "Hypertension" },
    { id: "3", name: "Dysphagia" }
];

const mockAllergens: Allergen[] = [
    { id: "1", name: "Peanuts" },
    { id: "2", name: "Milk" },
    { id: "3", name: "Gluten" }
];

function resolveItem<T extends { id: string; name: string }>(
    rawName: string, list: T[]
): T {
    const match = list.find((i) => i.name.toLowerCase() === rawName.toLowerCase());
    if (match) return match;

    const newItem = {
        id: crypto.randomUUID(),
        name: rawName
    } as T;

    list.push(newItem);
    return newItem;
}

function mapConditionsList(comorbidities: string[]): Condition[] {
    return comorbidities.map((c) => {
        const eng = conditionMap[c] || c;
        return resolveItem(eng, mockConditions);
    });
}

function mapAllergiesList(allergies: string[]): Allergen[] {
    return allergies.map((a) => {
        const eng = allergyMap[a] || a;
        return resolveItem(eng, mockAllergens);
    });
}

function detectDietGroup(conditions: Condition[]): string {
    if (conditions.some(c => c.name === "Diabetes")) return "1";
    if (conditions.some(c => c.name === "Hypertension")) return "2";
    if (conditions.some(c => c.name === "Dysphagia")) return "5";
    return "3";
}

/* ============================
       DATA STRUCTURES
============================= */

interface Nutrient {
    name: string;
    value: string;
}

interface Meal {
    id: string;
    name: string;
    image: string;
    calories: number;
    nutrients: Nutrient[];
    allergies: string[];
    dietType: string;
}

interface DayMenu {
    date: string;
    day: string;
    meals: Meal[];
}

interface MealStatus {
    mealId: string;
    status: "Ate all" | "50%" | "Skipped" | null;
    feedback?: string;
}

interface MealLog {
    residentId: string;
    mealId: string;
    consumption?: string;
    feedback?: string;
}

const storedResidents = JSON.parse(localStorage.getItem("residents") || "[]");
const currentResident = storedResidents[0];

const residentConditions = mapConditionsList(currentResident?.comorbidities || []);
const residentAllergies = mapAllergiesList(currentResident?.allergies || []);
const residentDiet = detectDietGroup(residentConditions);

/* ============================
         MENU DUMMY DATA
============================= */

const dummyWeeklyMenu: DayMenu[] = [
    {
        date: "2023-10-01", day: "Monday", meals: [
            {
                id: "1",
                name: "Grilled Chicken Salad",
                image: "https://via.placeholder.com/150",
                calories: 450,
                nutrients: [
                    { name: "Protein", value: "30g" },
                    { name: "Carbs", value: "20g" },
                ],
                allergies: ["dairy"],
                dietType: "low salt",
            },
            {
                id: "2",
                name: "Peanut Butter Toast",
                image: "https://via.placeholder.com/150",
                calories: 300,
                nutrients: [
                    { name: "Fat", value: "15g" },
                    { name: "Fiber", value: "5g" },
                ],
                allergies: ["peanuts"],
                dietType: "low sugar",
            },
        ]
    },
    {
        date: "2023-10-02", day: "Tuesday", meals: [
            {
                id: "3",
                name: "Vegetable Stir Fry",
                image: "https://via.placeholder.com/150",
                calories: 350,
                nutrients: [
                    { name: "Vitamins", value: "High" },
                ],
                allergies: [],
                dietType: "diabetic",
            },
        ]
    },
    {
        date: "2023-10-03", day: "Wednesday", meals: [
            {
                id: "4",
                name: "Salmon Fillet",
                image: "https://via.placeholder.com/150",
                calories: 400,
                nutrients: [
                    { name: "Omega-3", value: "High" },
                ],
                allergies: ["seafood"],
                dietType: "low salt",
            },
        ]
    },
    {
        date: "2023-10-04", day: "Thursday", meals: [
            {
                id: "5",
                name: "Oatmeal Bowl",
                image: "https://via.placeholder.com/150",
                calories: 250,
                nutrients: [
                    { name: "Fiber", value: "10g" },
                ],
                allergies: [],
                dietType: "diabetic",
            },
        ]
    },
    {
        date: "2023-10-05", day: "Friday", meals: [
            {
                id: "6",
                name: "Turkey Wrap",
                image: "https://via.placeholder.com/150",
                calories: 350,
                nutrients: [
                    { name: "Protein", value: "25g" },
                ],
                allergies: [],
                dietType: "low sugar",
            },
        ]
    },
    {
        date: "2023-10-06", day: "Saturday", meals: [
            {
                id: "7",
                name: "Fruit Salad",
                image: "https://via.placeholder.com/150",
                calories: 200,
                nutrients: [
                    { name: "Vitamins", value: "High" },
                ],
                allergies: [],
                dietType: "low salt",
            },
        ]
    },
    {
        date: "2023-10-07", day: "Sunday", meals: [
            {
                id: "8",
                name: "Chicken Soup",
                image: "https://via.placeholder.com/150",
                calories: 300,
                nutrients: [
                    { name: "Sodium", value: "Low" },
                ],
                allergies: [],
                dietType: "diabetic",
            },
        ]
    },
];

/* ============================
       MAIN COMPONENT
============================= */

const NutritionAllergyPage: React.FC = () => {

    const [mealStatuses, setMealStatuses] = useState<MealStatus[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("Monday");
    const [feedbackDialog, setFeedbackDialog] = useState<{ isOpen: boolean; mealId: string | null }>({
        isOpen: false, mealId: null
    });
    const [selectedFeedback, setSelectedFeedback] = useState("");

    /* ----- allergy detect ----- */
    const hasAllergyAlert = (meal: Meal) =>
        residentAllergies.some(al =>
            meal.allergies.some(ma =>
                al.name.toLowerCase().includes(ma.toLowerCase()) ||
                ma.toLowerCase().includes(al.name.toLowerCase())
            )
        );


    /* ----- update meal consumption ----- */
    const updateMealStatus = (mealId: string, status: MealStatus["status"]) => {

        const updated = mealStatuses.map((s) =>
            s.mealId === mealId ? { ...s, status } : s
        ).concat(
            mealStatuses.find((s) => s.mealId === mealId)
                ? []
                : [{ mealId, status }]
        );

        setMealStatuses(updated);

        const logs = JSON.parse(localStorage.getItem("mealLogs") || "[]");

        const existingIndex = logs.findIndex(
            (l: MealLog) => l.mealId === mealId && l.residentId === currentResident.id
        );

        if (existingIndex >= 0) logs[existingIndex].consumption = status === "Ate all" ? "full" : status;
        else logs.push({ residentId: currentResident.id, mealId, consumption: status });

        localStorage.setItem("mealLogs", JSON.stringify(logs));
    };

    /* ----- FIXED submitFeedback */
    const submitFeedback = (mealId: string, feedback: string) => {
        setMealStatuses((prev) => {
            const exists = prev.find((s) => s.mealId === mealId);

            if (exists) {
                return prev.map((s) =>
                    s.mealId === mealId ? { ...s, feedback } : s
                );
            }

            
            return [...prev, { mealId, status: null, feedback }];
        });

        // Save to localStorage
        const logs = JSON.parse(localStorage.getItem("mealLogs") || "[]");

        const existingIndex = logs.findIndex(
            (l: MealLog) => l.mealId === mealId && l.residentId === currentResident.id
        );

        if (existingIndex >= 0) logs[existingIndex].feedback = feedback;
        else logs.push({ residentId: currentResident.id, mealId, feedback });

        localStorage.setItem("mealLogs", JSON.stringify(logs));

        setFeedbackDialog({ isOpen: false, mealId: null });
        setSelectedFeedback("");
    };


    /* ----- progress bar ----- */
    const totalMeals = dummyWeeklyMenu.flatMap((d) => d.meals).length;
    const logs = JSON.parse(localStorage.getItem("mealLogs") || "[]");
    const completedMeals = logs.filter(
        (l: MealLog) => l.residentId === currentResident.id && l.consumption === "full"
    ).length;
    const progressPercent = Math.round((completedMeals / totalMeals) * 100);

    /* ============================
           SUB COMPONENTS
    ============================= */

    const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
        const status = mealStatuses.find((s) => s.mealId === meal.id)?.status || null;
        const feedback = mealStatuses.find((s) => s.mealId === meal.id)?.feedback;
        const alert = hasAllergyAlert(meal);

        return (
            <Card className={`rounded-lg shadow-lg h-auto bg-white ${alert ? "border-red-500 border-2" : ""}`}>
                <CardHeader>
                    <img src={meal.image} alt={meal.name} className="w-[500px] h-32 object-cover rounded-t-lg" />
                    <CardTitle className="text-lg">{meal.name}</CardTitle>

                    {alert && (
                        <Alert className="bg-red-100 border-red-300 rounded-lg">
                            <AlertDescription className="text-base text-red-800">
                                ⚠️ Contains allergens: {meal.allergies.join(", ")}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>

                <CardContent className="flex flex-col space-y-4">
                    <p className="text-base mb-2">Calories: {meal.calories}</p>

                    <div className="mb-2">
                        <strong className="text-base">Nutrients:</strong>
                        <ul className="list-disc list-inside text-sm">
                            {meal.nutrients.map((nutrient, idx) => (
                                <li key={idx}>{nutrient.name}: {nutrient.value}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <Badge variant="outline" className="text-sm mr-2">
                            Diet: {meal.dietType}
                        </Badge>

                        {meal.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-sm mr-2">
                                {allergy}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex space-x-2 mb-4">
                        <Button
                            variant={status === "Ate all" ? "default" : "outline"}
                            onClick={() => updateMealStatus(meal.id, "Ate all")}
                            className="text-lg"
                        >
                            Ate All
                        </Button>

                        <Button
                            variant={status === "50%" ? "default" : "outline"}
                            onClick={() => updateMealStatus(meal.id, "50%")}
                            className="text-lg"
                        >
                            50%
                        </Button>

                        <Button
                            variant={status === "Skipped" ? "default" : "outline"}
                            onClick={() => updateMealStatus(meal.id, "Skipped")}
                            className="text-lg"
                        >
                            Skipped
                        </Button>
                    </div>

                    <Button
                        onClick={() => setFeedbackDialog({ isOpen: true, mealId: meal.id })}
                        className="text-lg w-full text-black bg-gray-200 hover:bg-gray-300"
                    >
                        Give Feedback
                    </Button>

                    {feedback && (
                        <p className="text-sm mt-2">Feedback: {feedback}</p>
                    )}
                </CardContent>
            </Card>
        );
    };

    const FeedbackDialogComponent = () => {
        const emojis = ["😊", "😐", "😞", "👍", "👎"];

        return (
            <Dialog
                open={feedbackDialog.isOpen}
                onOpenChange={() => setFeedbackDialog({ isOpen: false, mealId: null })}
            >
                <DialogContent className="rounded-lg text-black">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-black">Quick Feedback</DialogTitle>
                    </DialogHeader>

                    <div className="flex space-x-4 mb-4 text-lg justify-center">
                        {emojis.map((emoji) => (
                            <Button
                                key={emoji}
                                variant={selectedFeedback === emoji ? "default" : "outline"}
                                onClick={() => setSelectedFeedback(emoji)}
                                className="text-2xl p-4"
                            >
                                {emoji}
                            </Button>
                        ))}
                    </div>

                    <input
                        placeholder="Or add a short note..."
                        value={selectedFeedback}
                        onChange={(e) => setSelectedFeedback(e.target.value)}
                        className="w-full p-2 border rounded-lg text-base font-medium"
                    />

                    <DialogFooter>
                        <Button
                            onClick={() =>
                                feedbackDialog.mealId &&
                                submitFeedback(feedbackDialog.mealId, selectedFeedback)
                            }
                            className="text-lg text-black"
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const WeeklyMenu = () => (
        <div className="w-full mt-6">
            <h2 className="text-2xl font-semibold text-[#5985d8] mb-4">Weekly Overview</h2>

            <div className="grid grid-cols-7 gap-2 w-full">
                {dummyWeeklyMenu.map((day) => (
                    <Card key={day.day} className="min-w-[100px] rounded-lg shadow border border-blue-500">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{day.day}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {day.meals.map((meal) => (
                                <div key={meal.id} className="mb-2">
                                    <p className="text-sm font-semibold">{meal.name}</p>
                                    <Badge variant="secondary" className="text-xs">
                                        {meal.dietType}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    /* ============================
              MAIN UI
    ============================= */

    return (
        <div className="w-full relative -ml-10">

            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>

            <div className="relative z-10 max-w-6xl mx-auto p-2 space-y-6">

                <h1 className="text-3xl font-bold text-blue-800 mb-6">Nutrition & Allergy</h1>

                <p className="text-lg text-gray-600 mb-4">
                    Your assigned diet: {residentDiet}
                </p>

                <Alert className="mb-6 bg-red-100 border-red-300 rounded-lg">
                    <AlertDescription className="text-base font-semibold text-red-800">
                        Alert: Meals containing {residentAllergies.map(a => a.name).join(", ")} are highlighted.
                        Please avoid or consult staff.
                    </AlertDescription>
                </Alert>

                {/* Progress */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-2">Weekly Progress</h2>

                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className="bg-green-500 h-6 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <p className="text-lg mt-2">
                        {completedMeals} of {totalMeals} meals completed ({progressPercent}%)
                    </p>
                </div>

                {/* ================= TABS ================ */}
                <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">

                    <div className="w-full flex justify-center mt-4 mb-4">
                        <TabsList className="flex space-x-4 bg-white rounded-xl shadow px-4 py-2">
                            {dummyWeeklyMenu.map((day) => (
                                <TabsTrigger
                                    key={day.day}
                                    value={day.day}
                                    className="
                                            text-lg text-black 
                                            h-10 px-4 
                                            flex items-center justify-center
                                            rounded-lg
                                            data-[state=active]:bg-[#5895d8] 
                                            data-[state=active]:text-white
                                            transition-all">

                                    {day.day}
                                </TabsTrigger>

                            ))}
                        </TabsList>
                    </div>





                    {dummyWeeklyMenu.map((day) => (
                        <TabsContent
                            key={day.day}
                            value={day.day}
                            className="mt-0 py-3"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {day.meals.map((meal) => (
                                    <MealCard key={meal.id} meal={meal} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}

                </Tabs>

                {/* Weekly Overview */}
                <WeeklyMenu />

                {/* Feedback dialog */}
                <FeedbackDialogComponent />

            </div>
        </div>
    );
};

export default NutritionAllergyPage;
