export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  nameFa: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  category: string;
  description?: string;
  healthierAlternatives?: string[];
}

export interface NutritionLog {
  id: string;
  date: string;
  foodId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  timestamp: number;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: NutritionLog[];
}
