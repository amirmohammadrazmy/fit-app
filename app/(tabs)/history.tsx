import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFoodStore } from '@/hooks/use-food-store';
import { FoodLogItem } from '@/components/FoodLogItem';
import { Link } from 'expo-router';
import { Calendar, TrendingUp } from 'lucide-react-native';
import Colors, { getPersianFont } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function HistoryScreen() {
  const { nutritionLogs } = useFoodStore();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Group logs by date
  const logsByDate = useMemo(() => {
    const grouped: Record<string, typeof nutritionLogs> = {};
    
    nutritionLogs.forEach(log => {
      if (!grouped[log.date]) {
        grouped[log.date] = [];
      }
      grouped[log.date].push(log);
    });
    
    // Sort logs within each date by timestamp (newest first)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => b.timestamp - a.timestamp);
    });
    
    return grouped;
  }, [nutritionLogs]);
  
  // Get unique dates from logs (sorted newest first)
  const dates = useMemo(() => {
    return Object.keys(logsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [logsByDate]);
  
  // Format date for display in Persian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
  };
  
  // Format full date in Persian
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  // Check if date is today
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };
  
  // Calculate total calories for a date
  const getTotalCalories = (date: string) => {
    return logsByDate[date]?.reduce((sum, log) => sum + log.calories, 0) || 0;
  };
  
  return (
    <View style={styles.container}>
      {dates.length > 0 ? (
        <>
          <View style={styles.dateSelector}>
            <FlatList
              horizontal
              data={dates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dateItem,
                    selectedDate === item && styles.selectedDateItem
                  ]}
                  onPress={() => setSelectedDate(item)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === item && styles.selectedDateText
                    ]}
                  >
                    {isToday(item) ? 'امروز' : formatDate(item)}
                  </Text>
                  <Text
                    style={[
                      styles.caloriesText,
                      selectedDate === item && styles.selectedCaloriesText
                    ]}
                  >
                    {getTotalCalories(item)} کالری
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />
          </View>
          
          <View style={styles.logsContainer}>
            <View style={styles.dateTitleContainer}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.dateTitle}>
                {isToday(selectedDate) ? 'امروز' : formatFullDate(selectedDate)}
              </Text>
            </View>
            
            {logsByDate[selectedDate]?.length > 0 ? (
              <FlatList
                data={logsByDate[selectedDate]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Link href={`/food-details/${item.foodId}`} asChild>
                    <FoodLogItem log={item} />
                  </Link>
                )}
                contentContainerStyle={styles.logsList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>هیچ وعده‌ای برای این تاریخ ثبت نشده</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <TrendingUp size={48} color={Colors.text.light} />
          </View>
          <Text style={styles.emptyTitle}>تاریخچه غذایی ندارید</Text>
          <Text style={styles.emptyText}>
            با اسکن کردن غذاهایتان شروع به پیگیری کنید
          </Text>
          <Link href="/scan" asChild>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>اسکن غذا</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  dateSelector: {
    backgroundColor: Colors.background.primary,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateList: {
    paddingHorizontal: 16,
  },
  dateItem: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDateItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    fontFamily: getPersianFont('semiBold'),
    writingDirection: 'rtl',
  },
  selectedDateText: {
    color: Colors.text.inverse,
    fontWeight: '700',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  caloriesText: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  selectedCaloriesText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  dateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: 8,
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  logsList: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  scanButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getPersianFont('semiBold'),
    writingDirection: 'rtl',
  },
});
