import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase, getTodayStats } from '../utils/database';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ onStartSession, isDarkMode, onToggleDarkMode }) => {
  const [stats, setStats] = useState({ totalTimeWorked: 0, totalCyclesToday: 0, overallMood: null });
  const [db, setDb] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Initialize database and load stats
  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = initDatabase();
        setDb(database);
        
        const initialStats = await getTodayStats(database);
        setStats(initialStats);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initializeDb();
  }, []);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to get mood emoji and label based on mood value
  const getMoodInfo = (moodValue) => {
    const moodInfo = {
      'tired': { emoji: '🥱', label: 'Tired' },
      'good': { emoji: '😁', label: 'Good' },
      'stressed': { emoji: '🫠', label: 'Stressed' },
      'keep_going': { emoji: '😎', label: 'In the Rhythm' },
    };
    return moodInfo[moodValue] || { emoji: '😐', label: 'Neutral' };
  };

  // Function to format time in minutes to hours and minutes
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const styles = createStyles(isDarkMode);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Rhythm</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onToggleDarkMode}>
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon-outline"} 
            size={24} 
            color={isDarkMode ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Rhythm</Text>
          <Text style={styles.welcomeSubtitle}>
            Focus, take breaks, and track your productivity
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTime(stats.totalTimeWorked)}</Text>
            <Text style={styles.statLabel}>Time Worked Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalCyclesToday}</Text>
            <Text style={styles.statLabel}>Pomodoro Cycles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getMoodInfo(stats.overallMood).emoji}</Text>
            <Text style={styles.moodLabel}>{getMoodInfo(stats.overallMood).label}</Text>
            <Text style={styles.statLabel}>Overall Mood</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={onStartSession}
          >
            <Ionicons name="play" size={32} color="white" />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="timer-outline" size={20} color={isDarkMode ? "#B0B0B0" : "#7F8C8D"} />
            <Text style={styles.featureText}>Pomodoro Technique</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="trending-up-outline" size={20} color={isDarkMode ? "#B0B0B0" : "#7F8C8D"} />
            <Text style={styles.featureText}>Progress Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="happy-outline" size={20} color={isDarkMode ? "#B0B0B0" : "#7F8C8D"} />
            <Text style={styles.featureText}>Mood Tracking</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FAFAFA',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    letterSpacing: 1,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    textAlign: 'center',
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    textAlign: 'center',
    marginBottom: 2,
  },
  actionButtons: {
    alignItems: 'center',
    marginBottom: 50,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginVertical: 8,
    minWidth: 200,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default HomeScreen;
