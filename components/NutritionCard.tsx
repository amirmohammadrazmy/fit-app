import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { FoodItem } from '@/types/food';
import { Star } from 'lucide-react-native';
import Colors, { getPersianFont } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type NutritionCardProps = {
  food: FoodItem;
  onPress?: () => void;
};

export const NutritionCard = ({ food, onPress }: NutritionCardProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: food.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        >
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.saffron} fill={Colors.saffron} />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameFa}>{food.nameFa}</Text>
          <Text style={styles.nameEn}>{food.name}</Text>
        </View>
        
        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.calories}</Text>
              <Text style={styles.nutritionLabel}>کالری</Text>
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.protein}g</Text>
              <Text style={styles.nutritionLabel}>پروتئین</Text>
            </View>
          </View>
          
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.carbs}g</Text>
              <Text style={styles.nutritionLabel}>کربوهیدرات</Text>
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.fat}g</Text>
              <Text style={styles.nutritionLabel}>چربی</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
    fontFamily: getPersianFont('semiBold'),
  },
  infoContainer: {
    padding: 20,
  },
  nameContainer: {
    marginBottom: 16,
  },
  nameFa: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: getPersianFont('bold'),
  },
  nameEn: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    fontFamily: getPersianFont('medium'),
  },
  nutritionContainer: {
    gap: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
    fontFamily: getPersianFont('bold'),
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
    fontFamily: getPersianFont('medium'),
  },
});
