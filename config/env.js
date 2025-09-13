// Environment configuration for Gemini AI
import Constants from 'expo-constants';

const getEnvVar = (key, defaultValue = null) => {
  // For Expo/React Native, use Constants.expoConfig.extra
  if (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra[key]) {
    return Constants.expoConfig.extra[key];
  }
  
  // Fallback to process.env for development
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // Final fallback
  return defaultValue;
};

export const ENV = {
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY', 'your_gemini_api_key_here'),
  ARCADE_API_KEY: getEnvVar('ARCADE_API_KEY', 'your_arcade_api_key_here'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};

export default ENV;
