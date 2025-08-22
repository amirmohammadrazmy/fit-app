import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFoodStore } from '@/hooks/use-food-store';
import { NutritionSummary } from '@/components/NutritionSummary';
import { NutritionCard } from '@/components/NutritionCard';
import { FoodLogItem } from '@/components/FoodLogItem';
import { Link } from 'expo-router';
import { ScanLine, TrendingUp, Star } from 'lucide-react-native';
import Colors, { getPersianFont } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { foods, getDailyNutrition } = useFoodStore();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get nutrition data for today
  const dailyNutrition = useMemo(() => {
    return getDailyNutrition(today);
  }, [getDailyNutrition, today]);
  
  // Get featured foods (random selection for demo)
  const featuredFoods = useMemo(() => {
    return foods.slice(0, 3);
  }, [foods]);
  
  // Get Persian date
  const persianDate = new Date().toLocaleDateString('fa-IR', { 
    weekday: 'long', 
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>سلام! 👋</Text>
          <Text style={styles.subGreeting}>به کالری یار خوش آمدید</Text>
          <Text style={styles.date}>{persianDate}</Text>
        </View>
      </LinearGradient>
      
      {/* Quick Action Card */}
      <View style={styles.quickActionContainer}>
        <Link href="/scan" asChild>
          <TouchableOpacity style={styles.quickActionCard}>
            <LinearGradient
              colors={[Colors.gradient.saffron[0], Colors.gradient.saffron[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionContent}>
                <ScanLine size={28} color={Colors.text.inverse} />
                <View style={styles.quickActionText}>
                  <Text style={styles.quickActionTitle}>غذای خود را اسکن کنید</Text>
                  <Text style={styles.quickActionSubtitle}>تشخیص هوشمند غذاهای ایرانی</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </View>
      
      <NutritionSummary nutrition={dailyNutrition} />
      
      {dailyNutrition.meals.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>وعده‌های امروز</Text>
          </View>
          {dailyNutrition.meals.slice(0, 3).map((meal) => (
            <FoodLogItem key={meal.id} log={meal} />
          ))}
          
          {dailyNutrition.meals.length > 3 && (
            <Link href="/history" asChild>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>مشاهده همه وعده‌ها</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <ScanLine size={48} color={Colors.text.light} />
          </View>
          <Text style={styles.emptyStateText}>هنوز وعده‌ای ثبت نکرده‌اید</Text>
          <Text style={styles.emptyStateSubtext}>اولین غذای خود را اسکن کنید</Text>
          <Link href="/scan" asChild>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>شروع کنید</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Star size={20} color={Colors.saffron} />
          <Text style={styles.sectionTitle}>غذاهای محبوب</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          از غذاهای ایرانی تا بین‌المللی
        </Text>
        {featuredFoods.map((food) => (
          <Link key={food.id} href={`/food-details/${food.id}`} asChild>
            <NutritionCard food={food} />
          </Link>
        ))}
      </View>
      
      {/* Floating Action Button */}
      <Link href="/scan" asChild>
        <TouchableOpacity style={styles.fab}>
          <LinearGradient
            colors={[Colors.gradient.saffron[0], Colors.gradient.saffron[1]]}
            style={styles.fabGradient}
          >
            <ScanLine size={28} color={Colors.text.inverse} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.inverse,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.text.inverse,
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: getPersianFont('medium'),
  },
  date: {
    fontSize: 14,
    color: Colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
    fontFamily: getPersianFont('regular'),
  },
  quickActionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickActionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  quickActionGradient: {
    padding: 20,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionText: {
    marginLeft: 16,
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 4,
    fontFamily: getPersianFont('bold'),
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: Colors.text.inverse,
    opacity: 0.9,
    fontFamily: getPersianFont('regular'),
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: 8,
    fontFamily: getPersianFont('bold'),
  },
  viewAllButton: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getPersianFont('semiBold'),
  },
  emptyState: {
    backgroundColor: Colors.background.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: getPersianFont('semiBold'),
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: getPersianFont('regular'),
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  scanButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getPersianFont('semiBold'),
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    marginTop: -8,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: Colors.saffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
