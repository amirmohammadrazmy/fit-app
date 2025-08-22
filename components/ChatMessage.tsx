import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

type ChatMessageProps = {
  content: string;
  isUser: boolean;
};

export const ChatMessage = ({ content, isUser }: ChatMessageProps) => {
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <Text style={[
        styles.messageText,
        isUser ? styles.userText : styles.assistantText
      ]}>
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.secondary,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: Colors.text.primary,
  },
});
