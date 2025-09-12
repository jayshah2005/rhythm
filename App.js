import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PomodoroTimer from './components/PomodoroTimer';

export default function App() {
  return (
    <SafeAreaProvider>
      <PomodoroTimer />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
