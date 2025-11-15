import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";

interface Nutrient {
    name: string;
    value: string;
}

interface Meal {
    id: string;
    name: string;
    calories: number;
    image: string;
    nutrients: Nutrient[];
    allergies: string[];
    dietType: string;
}

interface DayMenu {
    day: string;
    meals: Meal[];
}

interface MealLog {
    residentId: string;
    mealId: string;
    consumption: "full" | "half" | "none";
}

interface Resident {
    id: string;
    fullName: string;
    allergies: string[];
    comorbidities: string[];
}

const resident: Resident = {
    id: "r001",
    fullName: "Nguyễn Văn A",
    allergies: ["Đậu phộng", "Sữa"],
    comorbidities: ["Tăng huyết áp"],
};

const comorbidityMapping: { [key: string]: string } = {
    "Đái tháo đường": "Diabetes",
    "Tăng huyết áp": "Hypertension",
    "Khó nuốt": "Dysphagia",
};

const allergyMapping: { [key: string]: string } = {
    "Đậu phộng": "Peanuts",
    "Sữa": "Milk",
};

const dietMapping: { [key: string]: string } = {
    "Diabetes": "Low Sugar",
    "Hypertension": "Low Sodium",
    "Dysphagia": "Soft Diet",
};

const weeklyMenu: DayMenu[] = [
    {
        day: "Monday",
        meals: [
            {
                id: "m01",
                name: "Grilled Chicken",
                calories: 450,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Protein", value: "30g" }],
                allergies: ["Milk"],
                dietType: "low salt",
            },
        ],
    },
    {
        day: "Tuesday",
        meals: [
            {
                id: "m02",
                name: "Vegetable Stir Fry",
                calories: 350,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Vitamins", value: "High" }],
                allergies: [],
                dietType: "diabetic",
            },
        ],
    },
    {
        day: "Wednesday",
        meals: [
            {
                id: "m03",
                name: "Salmon Fillet",
                calories: 400,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Omega-3", value: "High" }],
                allergies: ["Seafood"],
                dietType: "low salt",
            },
        ],
    },
    {
        day: "Thursday",
        meals: [
            {
                id: "m04",
                name: "Oatmeal Bowl",
                calories: 250,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Fiber", value: "10g" }],
                allergies: [],
                dietType: "diabetic",
            },
        ],
    },
    {
        day: "Friday",
        meals: [
            {
                id: "m05",
                name: "Turkey Wrap",
                calories: 350,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Protein", value: "25g" }],
                allergies: [],
                dietType: "low sugar",
            },
        ],
    },
    {
        day: "Saturday",
        meals: [
            {
                id: "m06",
                name: "Fruit Salad",
                calories: 200,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Vitamins", value: "High" }],
                allergies: [],
                dietType: "low salt",
            },
        ],
    },
    {
        day: "Sunday",
        meals: [
            {
                id: "m07",
                name: "Chicken Soup",
                calories: 300,
                image: "https://via.placeholder.com/300",
                nutrients: [{ name: "Sodium", value: "Low" }],
                allergies: [],
                dietType: "diabetic",
            },
        ],
    },
];

const NutritionAllergyPage: React.FC = () => {
    const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("Monday");

    useEffect(() => {
        const stored = localStorage.getItem("mealLogs");
        if (stored) {
            setMealLogs(JSON.parse(stored));
        }
    }, []);

    const getConsumptionStatus = (mealId: string): string => {
        const log = mealLogs.find((l) => l.mealId === mealId && l.residentId === resident.id);
        if (!log) return "Not logged yet";
        switch (log.consumption) {
            case "full": return "Full";
            case "half": return "50%";
            case "none": return "Skipped";
            default: return "Not logged yet";
        }
    };

    const hasAllergyAlert = (meal: Meal) =>
        meal.allergies.some((allergy) => resident.allergies.includes(allergy) || Object.values(allergyMapping).includes(allergy));

    const detectedDiet = resident.comorbidities.length > 0 ? dietMapping[comorbidityMapping[resident.comorbidities[0]]] || "General" : "General";

    const totalMeals = weeklyMenu.flatMap((d) => d.meals).length;
    const completedMeals = mealLogs.filter((l) => l.consumption === "full" && l.residentId === resident.id).length;
    const progressPercent = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
        const status = getConsumptionStatus(meal.id);
        const alert = hasAllergyAlert(meal);

        return (
            <Card className={`rounded-lg shadow-lg bg-white ${alert ? "border-red-500 border-2" : ""}`}>
                <CardHeader>
                    <img src={meal.image} alt={meal.name} className="w-full h-32 object-cover rounded-t-lg" />
                    <CardTitle className="text-xl">{meal.name}</CardTitle>
                    {alert && (
                        <Alert className="bg-red-100 border-red-300 rounded-lg">
                            <AlertDescription className="text-lg text-red-800">
                                Contains allergens: {meal.allergies.join(", ")}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-2">Calories: {meal.calories}</p>
                    <div className="mb-2">
                        <strong className="text-lg">Nutrients:</strong>
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
                    <p className="text-lg font-semibold">Consumption: {status}</p>
                </CardContent>
            </Card>
        );
    };

    const WeeklyOverview: React.FC = () => (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Weekly Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weeklyMenu.map((day) => (
                    <Card key={day.day} className="rounded-lg border border-blue-500 shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {day.meals.map((meal) => (
                                <div key={meal.id} className="mb-2">
                                    <p className="text-sm font-medium">{meal.name}</p>
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

    return (
        <div className="w-full relative">
            <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
            <div className="relative z-10 max-w-6xl mx-auto p-2 space-y-6">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">Nutrition & Allergy</h1>
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Resident Summary</h2>
                    <p className="text-lg"><strong>Name:</strong> {resident.fullName}</p>
                    <p className="text-lg"><strong>Conditions:</strong> {resident.comorbidities.map(c => comorbidityMapping[c] || c).join(", ")}</p>
                    <p className="text-lg"><strong>Auto-detected Diet Group:</strong> {detectedDiet}</p>
                    <div className="mt-2">
                        <strong className="text-lg">Allergies:</strong>
                        {resident.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-sm ml-2">
                                {allergyMapping[allergy] || allergy}
                            </Badge>
                        ))}
                    </div>
                </div>
                <Alert className="mb-6 bg-red-100 border-red-300 rounded-lg">
                    <AlertDescription className="text-lg text-red-800">
                        ⚠️ Alert: Meals containing {resident.allergies.map(a => allergyMapping[a] || a).join(", ")} are highlighted.
                    </AlertDescription>
                </Alert>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">Weekly Progress</h2>
                    <Progress value={progressPercent} className="w-full" />
                    <p className="text-lg mt-2">{completedMeals} of {totalMeals} meals completed ({progressPercent}%)</p>
                </div>
                <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
                    <div className="w-full flex justify-center mt-4 mb-4">
                        <TabsList className="flex space-x-4 bg-white rounded-xl shadow px-4 py-2">
                                    {weeklyMenu.map((day) => (
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

                    {weeklyMenu.map((day) => (
                        <TabsContent key={day.day} value={day.day}>
                            <div className="grid gap-4 md:grid-cols-2">
                                {day.meals.map((meal) => (
                                    <MealCard key={meal.id} meal={meal} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
                <WeeklyOverview />
            </div>
        </div>
    );
};

export default NutritionAllergyPage;
