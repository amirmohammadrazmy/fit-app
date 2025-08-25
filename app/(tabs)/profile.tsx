import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useChatAI } from '@/hooks/use-chat-ai';
import { ChatMessage } from '@/components/ChatMessage';
import { Send, MessageCircle, Info, Sparkles, Heart } from 'lucide-react-native';
import Colors, { getPersianFont } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { messages, isLoading, sendMessage, clearMessages } = useChatAI();
  const [inputText, setInputText] = useState('');
  const [showNutritionChat, setShowNutritionChat] = useState(false);
  
  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileIcon}>
              <Heart size={32} color={Colors.text.inverse} />
            </View>
            <Text style={styles.headerTitle}>کالری یار هوشمند</Text>
            <Text style={styles.headerSubtitle}>دستیار تغذیه شخصی شما</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>دستیار تغذیه</Text>
          </View>
          <Text style={styles.sectionDescription}>
            سوالات خود درباره غذاهای ایرانی، اطلاعات تغذیه‌ای یا نکات سلامت بپرسید
          </Text>
          
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>فعال‌سازی چت تغذیه</Text>
            <Switch
              value={showNutritionChat}
              onValueChange={setShowNutritionChat}
              trackColor={{ false: Colors.text.light, true: Colors.primary }}
              thumbColor={Colors.background.primary}
            />
          </View>
        </View>
        
        {showNutritionChat && (
          <View style={styles.chatSection}>
            <View style={styles.chatContainer}>
              {messages.length === 0 ? (
                <View style={styles.emptyChatState}>
                  <View style={styles.emptyChatIcon}>
                    <Sparkles size={32} color={Colors.primary} />
                  </View>
                  <Text style={styles.emptyChatText}>
                    هر سوالی درباره غذاهای ایرانی، تغذیه یا نکات سلامت از من بپرسید!
                  </Text>
                  <Text style={styles.emptyChatSuggestion}>
                    مثال: فواید زعفران چیست؟ یا چگونه می‌توانم غذای سالم‌تری بخورم؟
                  </Text>
                </View>
              ) : (
                <View style={styles.messagesContainer}>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      isUser={message.role === 'user'}
                    />
                  ))}
                  {isLoading && (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>در حال فکر کردن...</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="سوال خود را بپرسید..."
                placeholderTextColor={Colors.text.light}
                multiline
                maxLength={200}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.disabledSendButton]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            {messages.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
                <Text style={styles.clearButtonText}>پاک کردن چت</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <Info size={20} color={Colors.saffron} />
            <Text style={styles.sectionTitle}>درباره کالری یار هوشمند</Text>
          </View>
          <Text style={styles.aboutText}>
            کالری یار هوشمند به شما کمک می‌کند تا غذاهای سنتی ایرانی و بین‌المللی را شناسایی کرده و اطلاعات تغذیه‌ای آن‌ها را پیگیری کنید.
            هوش مصنوعی ما می‌تواند بیش از ۱۰۰ غذای محبوب را تشخیص دهد و اطلاعات دقیق کالری و مواد مغذی ارائه دهد.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>نسخه ۱.۰.۰</Text>
            <Text style={styles.madeWithLove}>ساخته شده با ❤️ برای ایرانیان</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    marginLeft: 8,
    fontFamily: getPersianFont('semiBold'),
    writingDirection: 'rtl',
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 22,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  chatSection: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chatContainer: {
    minHeight: 200,
    maxHeight: 400,
  },
  emptyChatState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyChatText: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  emptyChatSuggestion: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  messagesContainer: {
    padding: 8,
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    maxHeight: 100,
    fontFamily: getPersianFont('regular'),
    textAlign: 'right',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: Colors.text.light,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  aboutText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
    fontFamily: getPersianFont('regular'),
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    marginHorizontal: -16,
    marginTop: -16,
  },
  headerContent: {
    padding: 32,
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text.inverse,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: getPersianFont('bold'),
    writingDirection: 'rtl',
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: getPersianFont('medium'),
    writingDirection: 'rtl',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyChatIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  madeWithLove: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: getPersianFont('regular'),
    writingDirection: 'rtl',
  },
});
