// -------------------------------------------
//  NUTRITION LOGIC CORE (DÙNG CHUNG STAFF + ADMIN)
// -------------------------------------------

export interface Condition {
  id: string;
  name: string;
}

export interface Allergen {
  id: string;
  name: string;
}

export interface DietGroup {
  id: string;
  name: string;
  recommendedConditions: Condition[];
}

// MAP TIẾNG VIỆT → ENGLISH
export const conditionMap: Record<string, string> = {
  "Đái tháo đường": "Diabetes",
  "Tăng huyết áp": "Hypertension",
  "Huyết áp cao": "Hypertension",
  "Khó nuốt": "Dysphagia",
  "Rối loạn nuốt": "Dysphagia",
};

export const allergyMap: Record<string, string> = {
  "Đậu phộng": "Peanuts",
  "Sữa": "Milk",
  "Gluten": "Gluten",
};

// MOCK LIST DÙNG CHUNG
export const mockConditions: Condition[] = [
  { id: "1", name: "Diabetes" },
  { id: "2", name: "Hypertension" },
  { id: "3", name: "Dysphagia" },
];

export const mockAllergens: Allergen[] = [
  { id: "1", name: "Peanuts" },
  { id: "2", name: "Milk" },
  { id: "3", name: "Gluten" },
];

export const mockDietGroups: DietGroup[] = [
  { id: "1", name: "Low Sugar", recommendedConditions: [mockConditions[0]] },
  { id: "2", name: "Low Sodium", recommendedConditions: [mockConditions[1]] },
  { id: "5", name: "Soft", recommendedConditions: [mockConditions[2]] },
  { id: "3", name: "Low Carb", recommendedConditions: [] },
  { id: "4", name: "High Protein", recommendedConditions: [] },
];

// MENU ITEMS (DÙNG CHUNG)
export const mockMenuItems = [
  { id: "1", name: "Oatmeal with Peanuts", allergens: [mockAllergens[0]] },
  { id: "2", name: "Milk Shake", allergens: [mockAllergens[1]] },
  { id: "3", name: "Gluten-Free Salad", allergens: [] },
  { id: "4", name: "Chicken Soup", allergens: [] },
  { id: "5", name: "Beef Steak", allergens: [] },
];

// CHUẨN HÓA LIST NHẬP TỪ FORM
export function normalizeList(value: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(",").map(v => v.trim()).filter(Boolean);
}

// RESOLVER – TẠO CONDITION/ALLERGEN MỚI NẾU CHƯA CÓ
export function resolveItem<T extends { id: string; name: string }>(
  rawName: string,
  list: T[]
): T {
  const match = list.find(
    (i) => i.name.toLowerCase() === rawName.toLowerCase()
  );
  if (match) return match;

  const newItem = { id: crypto.randomUUID(), name: rawName } as T;
  list.push(newItem);
  return newItem;
}

// MAP CONDITIONS
export function mapConditions(comorbidities: string[] | string): Condition[] {
  const list = Array.isArray(comorbidities)
    ? comorbidities
    : comorbidities.split(",").map(v => v.trim());

  return list.map(c => {
    const english = conditionMap[c] || c;
    return resolveItem(english, mockConditions);
  });
}

// MAP ALLERGIES
export function mapAllergies(allergies: string[]): Allergen[] {
  return (allergies || []).map(a => {
    const english = allergyMap[a] || a;
    return resolveItem(english, mockAllergens);
  });
}

// AUTO DETECT DIET GROUP
export function detectDietGroup(conditions: Condition[]): string | undefined {
  if (conditions.some(c => c.name === "Diabetes")) return "1";
  if (conditions.some(c => c.name === "Hypertension")) return "2";
  if (conditions.some(c => c.name === "Dysphagia")) return "5";
  return undefined;
}

// CHECK ALLERGY CHO DISH
export function checkAllergy(residentAllergies: Allergen[], dishId: string) {
  const dish = mockMenuItems.find(d => d.id === dishId);
  if (!dish) return false;

  return residentAllergies.some(a => 
    dish.allergens.some(ma => ma.id === a.id)
  );
}
