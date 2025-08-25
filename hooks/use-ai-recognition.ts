import { useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFoodStore } from './use-food-store';
import { FoodItem } from '@/types/food';
import { RORK_API_KEY, RORK_API_URL } from '@/constants/api';

export const useAIRecognition = () => {
  const { setRecognizedFood, setIsRecognizing, foods } = useFoodStore();
  const [error, setError] = useState<string | null>(null);

  const recognizeFoodFromImage = async (imageBase64: string) => {
    try {
      setError(null);
      setIsRecognizing(true);
      
      // Simple pseudo-hash for caching to avoid storing huge base64 strings
      const imageHash = imageBase64.substring(0, 100) + imageBase64.substring(imageBase64.length - 100);
      const cacheKey = `@recognized_food:${imageHash}`;

      // 1. Check cache first
      const cachedFood = await AsyncStorage.getItem(cacheKey);
      if (cachedFood) {
        console.log('✅ Found recognition result in cache!');
        setRecognizedFood(JSON.parse(cachedFood));
        return;
      }

      console.log('🔍 Starting food recognition (no cache)...');

      const cleanBase64 = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
      
      const messages = [
        {
          role: 'system',
          content: 'You are a comprehensive food recognition AI. Identify any food item in the image including Persian dishes, international foods, fruits, vegetables, proteins, grains, and basic ingredients. Return only the name of the food in English. Examples: "Ghormeh Sabzi", "Boiled Egg", "Grilled Chicken", "Apple", "French Fries", "Salmon", "Quinoa", etc. If you cannot identify the food, return "unknown".'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What food is this? Please identify any type of food including Persian dishes, basic ingredients, fruits, vegetables, proteins, or any other food items.' },
            { type: 'image', image: cleanBase64 }
          ]
        }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // 2. Make API request if not in cache
      const response = await fetch(RORK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RORK_API_KEY}`,
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.completion) {
        throw new Error('No completion in API response');
      }
      
      const recognizedDishName = data.completion.trim().toLowerCase();
      
      const recognizedFood = foods.find(
        food => {
          const dishName = recognizedDishName.toLowerCase();
          const foodNameEn = food.nameEn.toLowerCase();
          const foodName = food.name.toLowerCase();
          
          if (foodNameEn === dishName || foodName === dishName) return true;
          if (foodNameEn.includes(dishName) || dishName.includes(foodNameEn)) return true;
          if ((dishName.includes('egg') && foodNameEn.includes('egg'))) return true;
          if ((dishName.includes('chicken') && foodNameEn.includes('chicken'))) return true;
          
          return false;
        }
      );

      let foodResult: FoodItem;
      if (recognizedFood) {
        foodResult = recognizedFood;
      } else {
        foodResult = {
          id: 'generic-' + Date.now(),
          name: recognizedDishName,
          nameEn: recognizedDishName,
          nameFa: recognizedDishName === 'unknown' ? 'غذای ناشناخته' : recognizedDishName,
          calories: 200, protein: 10, carbs: 20, fat: 8,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000',
          category: 'شناسایی شده',
          description: `غذای شناسایی شده توسط هوش مصنوعی: ${recognizedDishName}`,
          healthierAlternatives: ['کنترل مقدار مصرف', 'اضافه کردن سبزیجات']
        };
        if (recognizedDishName === 'unknown') {
          setError('متأسفانه نتوانستیم غذا را شناسایی کنیم. لطفاً دوباره تلاش کنید.');
        }
      }

      // 3. Save to cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify(foodResult));
      console.log('💾 Saved recognition result to cache.');

      setRecognizedFood(foodResult);

    } catch (err: any) {
      console.error('❌ Error recognizing food:', err);
      let errorMessage = 'خطا در شناسایی غذا. لطفاً دوباره تلاش کنید.';
      if (err.name === 'AbortError') {
        errorMessage = 'درخواست زمان زیادی طول کشید. لطفاً دوباره تلاش کنید.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'مشکل در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.';
      } else if (err.message.includes('API Error')) {
        errorMessage = 'مشکل در سرویس شناسایی. لطفاً بعداً تلاش کنید.';
      }
      setError(errorMessage);
    } finally {
      setIsRecognizing(false);
    }
  };

  return {
    recognizeFoodFromImage,
    error,
  };
};
