import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LiquidProgress from './LiquidProgress';
import MoodSelector from './MoodSelector';
import { initDatabase, addCycle, getStatistics } from '../utils/database';

const { width, height } = Dimensions.get('window');

const PomodoroTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(0.1); // minutes
  const [breakDuration, setBreakDuration] = useState(0.1); // minutes
  const [currentCycle, setCurrentCycle] = useState(1); // 1 = work, 2 = break
  const [tempWorkDuration, setTempWorkDuration] = useState('25'); // for input
  const [tempBreakDuration, setTempBreakDuration] = useState('5'); // for input
  const [timeLeft, setTimeLeft] = useState(1 * 60); // Initialize with 1 minute for testing
  const [db, setDb] = useState(null);
  const [stats, setStats] = useState({ total: 0, work: 0, breaks: 0, today: 0 });
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [pendingWorkCycle, setPendingWorkCycle] = useState(null);
  const intervalRef = useRef(null);

  // Timer durations
  const WORK_DURATION = workDuration * 60; // convert to seconds
  const BREAK_DURATION = breakDuration * 60; // convert to seconds

  // Initialize database when component mounts
  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = initDatabase();
        setDb(database);
        
        // Load initial statistics
        const initialStats = await getStatistics(database);
        setStats(initialStats);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initializeDb();
  }, []);

  // Initialize timer when component mounts or durations change
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
    }
  }, [workDuration, breakDuration, isBreak, isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);


  const handleTimerComplete = async () => {
    setIsRunning(false);
    Vibration.vibrate([0, 500, 200, 500]); // Vibration pattern
    
    if (!isBreak) {
      // Work session completed - show mood selector
      setPendingWorkCycle({
        type: 'work',
        duration: workDuration
      });
      setShowMoodSelector(true);
    } else {
      // Break completed - save directly and start work
      if (db) {
        try {
          await addCycle(db, 'break', breakDuration);
          const updatedStats = await getStatistics(db);
          setStats(updatedStats);
        } catch (error) {
          console.error('Error saving break cycle to database:', error);
        }
      }
      
      setIsBreak(false);
      setCurrentCycle(1);
      setTimeLeft(WORK_DURATION);
      // Auto-start work timer
      setTimeout(() => {
        setIsRunning(true);
      }, 1000);
    }
  };

  const handleMoodSelect = async (mood) => {
    setShowMoodSelector(false);
    
    if (db && pendingWorkCycle) {
      try {
        // Save work cycle with mood
        await addCycle(db, pendingWorkCycle.type, pendingWorkCycle.duration, mood);
        
        // Update statistics
        const updatedStats = await getStatistics(db);
        setStats(updatedStats);
      } catch (error) {
        console.error('Error saving work cycle with mood to database:', error);
      }
    }
    
    if (mood === 'keep_going') {
      // Keep going - restart work timer
      setCycles(prev => prev + 1);
      setTimeLeft(WORK_DURATION);
      setTimeout(() => {
        setIsRunning(true);
      }, 1000);
    } else {
      // Normal flow - start break
      setCycles(prev => prev + 1);
      setIsBreak(true);
      setCurrentCycle(2);
      setTimeLeft(BREAK_DURATION);
      setTimeout(() => {
        setIsRunning(true);
      }, 1000);
    }
    
    setPendingWorkCycle(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCycle = () => {
    if (!isRunning) {
      if (isBreak) {
        // Currently on break, switch to work
        setIsBreak(false);
        setCurrentCycle(1);
        setTimeLeft(WORK_DURATION);
      } else {
        // Currently on work, switch to break
        setIsBreak(true);
        setCurrentCycle(2);
        setTimeLeft(BREAK_DURATION);
      }
    }
  };

  const saveSettings = () => {
    const workValue = parseInt(tempWorkDuration) || 25;
    const breakValue = parseInt(tempBreakDuration) || 5;
    
    if (workValue < 1 || workValue > 60 || breakValue < 1 || breakValue > 30) {
      Alert.alert('Invalid Duration', 'Work duration must be 1-60 minutes, break duration must be 1-30 minutes');
      return;
    }
    
    // Update the actual durations
    setWorkDuration(workValue);
    setBreakDuration(breakValue);
    
    // Reset timer with new durations
    setIsRunning(false);
    setTimeLeft(isBreak ? breakValue * 60 : workValue * 60);
    setShowSettings(false);
  };

  const openSettings = () => {
    setTempWorkDuration(workDuration.toString());
    setTempBreakDuration(breakDuration.toString());
    setShowSettings(true);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentCycle(1);
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Rhythm</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleCycle}>
            <Ionicons 
              name="play-forward" 
              size={24} 
              color={isDarkMode ? "#E0E0E0" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={openSettings}>
            <Ionicons name="settings-outline" size={24} color={isDarkMode ? "#E0E0E0" : "#666"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={toggleDarkMode}>
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon-outline"} 
              size={24} 
              color={isDarkMode ? "#FFD700" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, { 
          borderColor: isBreak ? '#4CAF50' : '#FF6B6B'
        }]}>
          {/* Liquid Progress Animation */}
          <LiquidProgress
            progress={getProgress() / 100}
            color={isBreak ? '#b7dfb9' : '#ff9e9e'}
            backgroundColor={isDarkMode ? '#2C2C2C' : '#F8F9FA'}
            size={width * 0.7}
          />
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>
              {isBreak ? 'Break Time' : 'Focus Time'}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
        >
          <Ionicons name="refresh" size={24} color={isDarkMode ? "#E0E0E0" : "#666"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.mainButton]}
          onPress={isRunning ? pauseTimer : startTimer}
        >
          <Ionicons 
            name={isRunning ? "pause" : "play"} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Mini Stats */}
      <View style={styles.miniStats}>
        <Text style={styles.statsText}>Total: {stats.total}</Text>
        <Text style={styles.statsText}>Today: {stats.today}</Text>
        <Text style={styles.statsText}>
          {isBreak ? 'Break' : 'Work'} Session
        </Text>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Work Duration (minutes):</Text>
              <TextInput
                style={styles.settingInput}
                value={tempWorkDuration}
                onChangeText={setTempWorkDuration}
                keyboardType="numeric"
                maxLength={2}
                placeholder="25"
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Break Duration (minutes):</Text>
              <TextInput
                style={styles.settingInput}
                value={tempBreakDuration}
                onChangeText={setTempBreakDuration}
                keyboardType="numeric"
                maxLength={2}
                placeholder="5"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSettings(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveSettings}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mood Selector Modal */}
      <MoodSelector
        visible={showMoodSelector}
        onMoodSelect={handleMoodSelect}
        isDarkMode={isDarkMode}
      />
    </View>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  timerCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  timerFill: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: (width * 0.7) / 2,
    opacity: 0.3,
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 16,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    marginTop: 8,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  controlButton: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: isDarkMode ? '#333' : '#ECF0F1',
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  statsText: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: isDarkMode ? '#E0E0E0' : '#2C3E50',
    flex: 1,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#DDD',
    borderRadius: 8,
    padding: 12,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: isDarkMode ? '#444' : '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: isDarkMode ? '#E0E0E0' : '#2C3E50',
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default PomodoroTimer;
