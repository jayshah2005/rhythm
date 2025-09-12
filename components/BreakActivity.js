import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeminiService from '../services/geminiService';

const BreakActivity = ({ workedFor, breakTime, mood, isDarkMode }) => {
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generateActivity = async () => {
    if (!GeminiService.isConfigured()) {
      setActivity("Configure your Gemini API key to get personalized break suggestions!");
      return;
    }

    setLoading(true);
    setError(false);
    
    try {
      const suggestion = await GeminiService.generateBreakActivity(workedFor, breakTime, mood);
      setActivity(suggestion);
    } catch (err) {
      console.error('Error generating break activity:', err);
      setError(true);
      setActivity("Take a few deep breaths and stretch your arms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateActivity();
  }, [workedFor, breakTime, mood]);

  const handleRefresh = () => {
    generateActivity();
  };

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name="bulb-outline" 
            size={20} 
            color={isDarkMode ? "#FFD700" : "#FF6B6B"} 
          />
          <Text style={styles.title}>Break Activity</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} disabled={loading}>
          <Ionicons 
            name="refresh" 
            size={18} 
            color={isDarkMode ? "#B0B0B0" : "#7F8C8D"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="small" 
              color={isDarkMode ? "#FFD700" : "#FF6B6B"} 
            />
            <Text style={styles.loadingText}>Finding the perfect break activity...</Text>
          </View>
        ) : (
          <Text style={styles.activityText}>
            {activity}
          </Text>
        )}
      </View>
    </View>
  );
};

const createStyles = (isDarkMode) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    marginLeft: 8,
  },
  content: {
    minHeight: 40,
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    marginLeft: 8,
  },
  activityText: {
    fontSize: 16,
    lineHeight: 22,
    color: isDarkMode ? '#E0E0E0' : '#2C3E50',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BreakActivity;


