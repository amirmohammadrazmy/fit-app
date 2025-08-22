import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, NutritionLog, DailyNutrition } from '@/types/food';
import { allFoods } from '@/mocks/persian-foods';

interface FoodState {
  foods: FoodItem[];
  nutritionLogs: NutritionLog[];
  recognizedFood: FoodItem | null;
  isRecognizing: boolean;
  currentImage: string | null;
  
  // Actions
  setRecognizedFood: (food: FoodItem | null) => void;
  setIsRecognizing: (isRecognizing: boolean) => void;
  setCurrentImage: (image: string | null) => void;
  addNutritionLog: (log: Omit<NutritionLog, 'id' | 'timestamp'>) => void;
  getDailyNutrition: (date: string) => DailyNutrition;
  clearRecognizedFood: () => void;
  getFoodById: (id: string) => FoodItem | undefined;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foods: allFoods,
      nutritionLogs: [],
      recognizedFood: null,
      isRecognizing: false,
      currentImage: null,
      
      setRecognizedFood: (food) => set({ recognizedFood: food }),
      setIsRecognizing: (isRecognizing) => set({ isRecognizing }),
      setCurrentImage: (image) => set({ currentImage: image }),
      
      addNutritionLog: (log) => {
        const newLog: NutritionLog = {
          ...log,
          id: Date.now().toString(),
          timestamp: Date.now(),
        };
        
        set((state) => ({
          nutritionLogs: [...state.nutritionLogs, newLog],
        }));
      },
      
      getDailyNutrition: (date) => {
        const { nutritionLogs } = get();
        const dailyLogs = nutritionLogs.filter(log => log.date === date);
        
        return {
          date,
          totalCalories: dailyLogs.reduce((sum, log) => sum + log.calories, 0),
          totalProtein: dailyLogs.reduce((sum, log) => sum + log.protein, 0),
          totalCarbs: dailyLogs.reduce((sum, log) => sum + log.carbs, 0),
          totalFat: dailyLogs.reduce((sum, log) => sum + log.fat, 0),
          meals: dailyLogs,
        };
      },
      
      clearRecognizedFood: () => set({ recognizedFood: null, currentImage: null }),
      
      getFoodById: (id) => {
        return get().foods.find(food => food.id === id);
      },
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
