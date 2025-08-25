import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { NutritionLog } from '@/types/food';
import Colors, { getPersianFont } from '@/constants/colors';

type FoodLogItemProps = {
  log: NutritionLog;
  onPress?: () => void;
};

export const FoodLogItem = ({ log, onPress }: FoodLogItemProps) => {
  // Format time from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {log.image ? (
        <Image
          source={{ uri: log.image }}
          style={styles.image}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.foodName}>{log.foodName}</Text>
          <Text style={styles.time}>{formatTime(log.timestamp)}</Text>
        </View>
        
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{log.calories}</Text>
            <Text style={styles.nutritionLabel}>کالری</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{log.protein}g</Text>
            <Text style={styles.nutritionLabel}>پروتئین</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{log.carbs}g</Text>
            <Text style={styles.nutritionLabel}>کربوهیدرات</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{log.fat}g</Text>
            <Text style={styles.nutritionLabel}>چربی</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholderImage: {
    backgroundColor: Colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    fontFamily: getPersianFont('medium'),
    textAlign: 'right',
  },
  time: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: getPersianFont('regular'),
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    fontFamily: getPersianFont('semiBold'),
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
});
