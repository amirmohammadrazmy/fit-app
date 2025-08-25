import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useFoodStore } from '@/hooks/use-food-store';
import { HealthierAlternatives } from '@/components/HealthierAlternatives';
import Colors from '@/constants/colors';

export default function FoodDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFoodById, addNutritionLog, clearRecognizedFood } = useFoodStore();
  
  const food = getFoodById(id);
  
  if (!food) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Food not found</Text>
      </View>
    );
  }
  
  const handleAddToLog = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    addNutritionLog({
      date: today,
      foodId: food.id,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      image: food.image,
    });
    
    // Clear the recognized food from the store
    clearRecognizedFood();
    
    // Navigate back to home
    router.push('/');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image
        source={{ uri: food.image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.persianName}>{food.nameFa}</Text>
        <Text style={styles.category}>{food.category}</Text>
      </View>
      
      <View style={styles.nutritionCard}>
        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
        
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{food.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{food.protein}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{food.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{food.fat}g</Text>
            <Text style={styles.nutritionLabel}>Fat</Text>
          </View>
        </View>
      </View>
      
      {food.description && (
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{food.description}</Text>
        </View>
      )}
      
      {food.healthierAlternatives && food.healthierAlternatives.length > 0 && (
        <HealthierAlternatives alternatives={food.healthierAlternatives} />
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddToLog}>
        <Text style={styles.addButtonText}>Add to Today's Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 250,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  persianName: {
    fontSize: 18,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  nutritionCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  descriptionCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
});
