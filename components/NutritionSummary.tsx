import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyNutrition } from '@/types/food';
import Colors, { getPersianFont } from '@/constants/colors';

type NutritionSummaryProps = {
  nutrition: DailyNutrition;
};

export const NutritionSummary = ({ nutrition }: NutritionSummaryProps) => {
  // Calculate recommended daily values (simplified)
  const recommendedCalories = 2000;
  const recommendedProtein = 50;
  const recommendedCarbs = 275;
  const recommendedFat = 78;
  
  // Calculate percentages
  const caloriePercentage = Math.min(100, (nutrition.totalCalories / recommendedCalories) * 100);
  const proteinPercentage = Math.min(100, (nutrition.totalProtein / recommendedProtein) * 100);
  const carbsPercentage = Math.min(100, (nutrition.totalCarbs / recommendedCarbs) * 100);
  const fatPercentage = Math.min(100, (nutrition.totalFat / recommendedFat) * 100);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>تغذیه امروز</Text>
      
      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>کالری</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${caloriePercentage}%`, backgroundColor: Colors.primary }]} />
        </View>
        <Text style={styles.nutrientValue}>{nutrition.totalCalories} / {recommendedCalories}</Text>
      </View>
      
      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>پروتئین</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${proteinPercentage}%`, backgroundColor: Colors.success }]} />
        </View>
        <Text style={styles.nutrientValue}>{nutrition.totalProtein}g / {recommendedProtein}g</Text>
      </View>
      
      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>کربوهیدرات</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${carbsPercentage}%`, backgroundColor: Colors.warning }]} />
        </View>
        <Text style={styles.nutrientValue}>{nutrition.totalCarbs}g / {recommendedCarbs}g</Text>
      </View>
      
      <View style={styles.nutrientRow}>
        <Text style={styles.nutrientLabel}>چربی</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${fatPercentage}%`, backgroundColor: Colors.danger }]} />
        </View>
        <Text style={styles.nutrientValue}>{nutrition.totalFat}g / {recommendedFat}g</Text>
      </View>
      
      <Text style={styles.mealCount}>
        {nutrition.meals.length} وعده غذایی امروز ثبت شده
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    fontFamily: getPersianFont('semiBold'),
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientLabel: {
    width: 80,
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: getPersianFont('regular'),
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.secondary,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientValue: {
    width: 100,
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'right',
    fontFamily: getPersianFont('regular'),
  },
  mealCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: getPersianFont('regular'),
  },
});
