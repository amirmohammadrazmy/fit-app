import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Image as RNImage } from 'react-native';
import { Link, router } from 'expo-router';
import { Camera, Image, ArrowLeft, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAIRecognition } from '@/hooks/use-ai-recognition';
import { useFoodStore } from '@/hooks/use-food-store';
import Colors, { getPersianFont } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
  const [error, setError] = useState<string | null>(null);
  const { recognizeFoodFromImage, error: aiError } = useAIRecognition();
  const { recognizedFood, isRecognizing, foods, setRecognizedFood, currentImage, setCurrentImage } = useFoodStore();
  
  // Combine errors from different sources
  const displayError = error || aiError;
  
  const pickImage = async () => {
    try {
      console.log('📱 Opening image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      console.log('📱 Image picker result:', { canceled: result.canceled, hasAssets: !!result.assets });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('📱 Selected image:', { width: asset.width, height: asset.height, hasBase64: !!asset.base64 });
        
        if (asset.base64) {
          const imageUri = `data:image/jpeg;base64,${asset.base64}`;
          setCurrentImage(imageUri);
          await recognizeFoodFromImage(asset.base64);
        } else {
          console.error('❌ No base64 data in selected image');
          setError('خطا در خواندن تصویر. لطفاً دوباره تلاش کنید.');
        }
      }
    } catch (error) {
      console.error('❌ Error picking image:', error);
      setError('خطا در انتخاب تصویر. لطفاً دوباره تلاش کنید.');
    }
  };
  
  const takePhoto = async () => {
    try {
      console.log('📷 Requesting camera permissions...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('متأسفانه برای استفاده از دوربین نیاز به مجوز داریم!');
        return;
      }
      
      console.log('📷 Opening camera...');
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      console.log('📷 Camera result:', { canceled: result.canceled, hasAssets: !!result.assets });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log('📷 Captured image:', { width: asset.width, height: asset.height, hasBase64: !!asset.base64 });
        
        if (asset.base64) {
          const imageUri = `data:image/jpeg;base64,${asset.base64}`;
          setCurrentImage(imageUri);
          await recognizeFoodFromImage(asset.base64);
        } else {
          console.error('❌ No base64 data in captured image');
          setError('خطا در خواندن تصویر. لطفاً دوباره تلاش کنید.');
        }
      }
    } catch (error) {
      console.error('❌ Error taking photo:', error);
      setError('خطا در گرفتن عکس. لطفاً دوباره تلاش کنید.');
    }
  };
  
  const handleCameraOpen = () => {
    if (Platform.OS === 'web') {
      // On web, we'll use the image picker since camera might not be available
      pickImage();
    } else {
      // On mobile, navigate to the camera screen
      router.push('/camera');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Sparkles size={24} color={Colors.saffron} />
            <Text style={styles.title}>غذای خود را اسکن کنید</Text>
          </View>
          <Text style={styles.subtitle}>
            عکس غذای ایرانی خود را بگیرید تا اطلاعات تغذیه‌ای آن را دریافت کنید
          </Text>
        </View>
        
        {isRecognizing ? (
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
              style={styles.loadingGradient}
            >
              <ActivityIndicator size="large" color={Colors.text.inverse} />
              <Text style={styles.loadingText}>در حال تحلیل غذای شما...</Text>
            </LinearGradient>
          </View>
        ) : recognizedFood ? (
          <View style={styles.resultContainer}>
            {currentImage && (
              <View style={styles.imageContainer}>
                <RNImage source={{ uri: currentImage }} style={styles.uploadedImage} />
              </View>
            )}
            
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>یافت شد: {recognizedFood.nameFa}</Text>
              <Text style={styles.resultSubtitle}>{recognizedFood.name}</Text>
            </View>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recognizedFood.calories}</Text>
                <Text style={styles.nutritionLabel}>کالری</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recognizedFood.protein}g</Text>
                <Text style={styles.nutritionLabel}>پروتئین</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recognizedFood.carbs}g</Text>
                <Text style={styles.nutritionLabel}>کربوهیدرات</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{recognizedFood.fat}g</Text>
                <Text style={styles.nutritionLabel}>چربی</Text>
              </View>
            </View>
            
            <Link href={`/food-details/${recognizedFood.id}`} asChild>
              <TouchableOpacity style={styles.detailsButton}>
                <LinearGradient
                  colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
                  style={styles.detailsButtonGradient}
                >
                  <Text style={styles.detailsButtonText}>مشاهده جزئیات</Text>
                  <ArrowLeft size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <>
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={handleCameraOpen}>
                <LinearGradient
                  colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
                  style={styles.optionGradient}
                >
                  <Camera size={32} color={Colors.text.inverse} />
                  <Text style={styles.optionText}>عکس بگیرید</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                <LinearGradient
                  colors={[Colors.gradient.saffron[0], Colors.gradient.saffron[1]]}
                  style={styles.optionGradient}
                >
                  <Image size={32} color={Colors.text.inverse} />
                  <Text style={styles.optionText}>از گالری انتخاب کنید</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {displayError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            )}
            
            {/* Test button for debugging */}
            {__DEV__ && (
              <TouchableOpacity 
                style={styles.testButton} 
                onPress={() => {
                  // Test with a sample food item
                  const testFood = foods[0]; // Ghormeh Sabzi
                  setRecognizedFood(testFood);
                }}
              >
                <Text style={styles.testButtonText}>🧪 تست (فقط در حالت توسعه)</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Sparkles size={16} color={Colors.text.light} />
          <Text style={styles.footerText}>
            هوش مصنوعی ما تمامی انواع غذاها از ایرانی تا بین‌المللی را تشخیص می‌دهد
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary,
    marginLeft: 8,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  optionsContainer: {
    gap: 20,
  },
  optionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.inverse,
    textAlign: 'center',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  resultContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  resultSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontFamily: getPersianFont('regular'),
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  nutritionCard: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    fontFamily: getPersianFont('bold'),
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  detailsButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  detailsButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: getPersianFont('semiBold'),
    writingDirection: 'rtl',
  },
  errorContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
    marginLeft: 8,
    lineHeight: 20,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  testButton: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  testButtonText: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getPersianFont('semiBold'),
    writingDirection: 'rtl',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadedImage: {
    width: 200,
    height: 150,
    borderRadius: 16,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
});
