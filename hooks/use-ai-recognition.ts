import { useState } from 'react';
import { Platform } from 'react-native';
import { useFoodStore } from './use-food-store';
import { FoodItem } from '@/types/food';

export const useAIRecognition = () => {
  const { setRecognizedFood, setIsRecognizing, foods } = useFoodStore();
  const [error, setError] = useState<string | null>(null);

  const recognizeFoodFromImage = async (imageBase64: string) => {
    try {
      setError(null);
      setIsRecognizing(true);
      
      console.log('🔍 Starting food recognition...');
      console.log('📸 Image base64 length:', imageBase64.length);

      // Ensure base64 string is properly formatted
      const cleanBase64 = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
      
      // Prepare the message for the AI
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

      console.log('🚀 Sending request to AI API...');
      
      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (!data.completion) {
        throw new Error('No completion in API response');
      }
      
      const recognizedDishName = data.completion.trim().toLowerCase();
      console.log('🍽️ Recognized dish name:', recognizedDishName);
      
      // Find the food in our database with better matching
      const recognizedFood = foods.find(
        food => {
          const dishName = recognizedDishName.toLowerCase();
          const foodNameEn = food.nameEn.toLowerCase();
          const foodName = food.name.toLowerCase();
          const foodNameFa = food.nameFa.toLowerCase();
          
          // Exact match
          if (foodNameEn === dishName || foodName === dishName) {
            return true;
          }
          
          // Partial match
          if (foodNameEn.includes(dishName) || dishName.includes(foodNameEn) ||
              foodName.includes(dishName) || dishName.includes(foodName)) {
            return true;
          }
          
          // Special cases for common food variations
          if ((dishName.includes('egg') && foodNameEn.includes('egg')) ||
              (dishName.includes('chicken') && foodNameEn.includes('chicken')) ||
              (dishName.includes('rice') && foodNameEn.includes('rice')) ||
              (dishName.includes('potato') && foodNameEn.includes('potato')) ||
              (dishName.includes('salmon') && foodNameEn.includes('salmon')) ||
              (dishName.includes('salad') && foodNameEn.includes('salad'))) {
            return true;
          }
          
          return false;
        }
      );

      if (recognizedFood) {
        console.log('✅ Found matching food:', recognizedFood.nameFa);
        setRecognizedFood(recognizedFood);
      } else {
        console.log('⚠️ No matching food found, using fallback');
        // Create a generic food item based on AI recognition
        const genericFood = {
          id: 'generic-' + Date.now(),
          name: recognizedDishName,
          nameEn: recognizedDishName,
          nameFa: recognizedDishName === 'unknown' ? 'غذای ناشناخته' : recognizedDishName,
          calories: 200, // Generic estimate
          protein: 10,
          carbs: 20,
          fat: 8,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000',
          category: 'شناسایی شده',
          description: `غذای شناسایی شده توسط هوش مصنوعی: ${recognizedDishName}`,
          healthierAlternatives: ['کنترل مقدار مصرف', 'اضافه کردن سبزیجات', 'استفاده از روش‌های پخت سالم‌تر']
        };
        setRecognizedFood(genericFood);
        if (recognizedDishName === 'unknown') {
          setError('متأسفانه نتوانستیم غذا را شناسایی کنیم. لطفاً دوباره تلاش کنید.');
        }
      }
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
