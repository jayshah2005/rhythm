import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const MoodSelector = ({ visible, onMoodSelect, isDarkMode }) => {
  const moods = [
    { emoji: '🥱', label: 'Tired', value: 'tired' },
    { emoji: '😁', label: 'Good', value: 'good' },
    { emoji: '🫠', label: 'Stressed', value: 'stressed' },
    { emoji: '😎', label: 'Keep Going', value: 'keep_going' },
  ];

  const styles = createStyles(isDarkMode);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onMoodSelect('tired')} // Default to tired if dismissed
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>Select your mood after this work session</Text>
          
          <View style={styles.moodGrid}>
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={styles.moodButton}
                onPress={() => onMoodSelect(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDarkMode) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodButton: {
    alignItems: 'center',
    padding: 20,
    margin: 5,
    borderRadius: 15,
    backgroundColor: isDarkMode ? '#3C3C3C' : '#F8F9FA',
    minWidth: (width * 0.8 - 60) / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDarkMode ? '#E0E0E0' : '#2C3E50',
    textAlign: 'center',
  },
});

export default MoodSelector;
