import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

type HealthierAlternativesProps = {
  alternatives: string[];
};

export const HealthierAlternatives = ({ alternatives }: HealthierAlternativesProps) => {
  if (!alternatives || alternatives.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthier Alternatives</Text>
      
      {alternatives.map((alternative, index) => (
        <View key={index} style={styles.alternativeItem}>
          <View style={styles.bullet} />
          <Text style={styles.alternativeText}>{alternative}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginTop: 6,
    marginRight: 8,
  },
  alternativeText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 20,
  },
});
