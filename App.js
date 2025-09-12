import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './components/HomeScreen';
import PomodoroTimer from './components/PomodoroTimer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' or 'timer'
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleStartSession = () => {
    setCurrentScreen('timer');
  };

  const handleEndSession = () => {
    setCurrentScreen('home');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SafeAreaProvider>
      {currentScreen === 'home' ? (
        <HomeScreen 
          onStartSession={handleStartSession}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : (
        <PomodoroTimer 
          onEndSession={handleEndSession}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
