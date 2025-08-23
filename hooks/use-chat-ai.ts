import { useState } from 'react';
import { RORK_API_KEY, RORK_API_URL } from '@/constants/api';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const useChatAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message to the list
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare messages for the API
      const apiMessages = [
        {
          role: 'system',
          content: 'You are a helpful nutrition assistant specializing in Persian cuisine. Provide concise, accurate information about Persian foods, their nutritional values, and healthy eating tips. Keep responses brief and focused on nutrition information. You can respond in English or Farsi based on the language the user is using.'
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content }
      ];
      
      // Make the API request
      const response = await fetch(RORK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RORK_API_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add assistant message to the list
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.completion,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
