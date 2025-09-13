import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeminiService from '../services/geminiService';
import ArcadeYouTubeService from '../services/arcade';

const BreakActivity = ({ workedFor, breakTime, mood, isDarkMode }) => {
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [activityType, setActivityType] = useState('gemini'); // 'gemini' or 'youtube'

  // YouTube search keywords based on mood and break time
  // Generate YouTube search keywords based on mood and break time
  const getYouTubeKeywords = (mood, breakTime) => {
    const options = {
      tired: {
        short: [
          "3 minute breathing exercise for energy",
          "short relaxing stretch for fatigue",
          "quick breathing reset for tiredness"
        ],
        medium: [
          "5 minute gentle stretch for tired muscles",
          "quick yoga for relaxation and recharge",
          "short guided meditation for energy"
        ],
        long: [
          "10 minute deep relaxation meditation",
          "restorative yoga for tiredness",
          "guided body scan meditation for rest"
        ]
      },
      stressed: {
        short: [
          "2 minute guided breathing for stress relief",
          "quick breathing exercise to calm stress",
          "short relaxation technique for anxiety"
        ],
        medium: [
          "5 minute stress relief yoga",
          "quick mindfulness meditation for calm",
          "guided breathing to release tension"
        ],
        long: [
          "10 minute mindfulness meditation for stress",
          "progressive muscle relaxation guided",
          "calming yoga flow for stress relief"
        ]
      },
      good: {
        short: [
          "3 minute energizing dance break",
          "short uplifting breathing exercise",
          "quick upbeat music workout"
        ],
        medium: [
          "5 minute positive affirmations with music",
          "quick fun stretch routine",
          "energizing music with light movement"
        ],
        long: [
          "10 minute uplifting stretch and movement",
          "guided meditation for positivity",
          "happy dance workout beginner friendly"
        ]
      }
    };

    // Pick length bucket
    let lengthBucket = "short";
    if (breakTime >= 10) {
      lengthBucket = "long";
    } else if (breakTime >= 5) {
      lengthBucket = "medium";
    }

    const moodOptions = options[mood] || options["tired"]; // default to tired
    const keywords = moodOptions[lengthBucket];

    // Deterministic selection: based on breakTime to avoid randomness
    const index = breakTime % keywords.length;

    return keywords[index];
  };


  const shouldUseYouTube = () => {
    // 50% chance if break time is 5+ minutes
    return breakTime >= 5 && Math.random() < 0.5;
  };

  const generateActivity = async () => {
    setLoading(true);
    setError(false);
    setShowVideoModal(false);
    setVideoData(null);
    
    try {
      // Decide between YouTube and Gemini
      const useYouTube = shouldUseYouTube();
      
      if (useYouTube && ArcadeYouTubeService.isConfigured()) {
        setActivityType('youtube');
        const keywords = getYouTubeKeywords(mood, breakTime);
        const result = await ArcadeYouTubeService.searchVideo(keywords);
        
        if (result.success && result.video) {
          setVideoData(result.video);
          setActivity(`🎥 Watch this video: ${result.video.title}`);
          setShowVideoModal(true);
        } else {
          // Fallback to Gemini if YouTube fails
          await generateGeminiActivity();
        }
      } else {
        await generateGeminiActivity();
      }
    } catch (err) {
      console.error('Error generating break activity:', err);
      setError(true);
      setActivity("Take a few deep breaths and stretch your arms");
    } finally {
      setLoading(false);
    }
  };

  const generateGeminiActivity = async () => {
    setActivityType('gemini');
    
    if (!GeminiService.isConfigured()) {
      setActivity("Configure your API keys to get personalized break suggestions!");
      return;
    }

    try {
      const suggestion = await GeminiService.generateBreakActivity(workedFor, breakTime, mood);
      setActivity(suggestion);
    } catch (err) {
      console.error('Error generating Gemini activity:', err);
      setError(true);
      setActivity("Take a few deep breaths and stretch your arms");
    }
  };

  const handleVideoPress = async () => {
    if (videoData && videoData.url) {
      try {
        await Linking.openURL(videoData.url);
      } catch (err) {
        Alert.alert('Error', 'Could not open video link');
      }
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setVideoData(null);
  };

  useEffect(() => {
    generateActivity();
  }, [workedFor, breakTime, mood]);

  const handleRefresh = () => {
    generateActivity();
  };

  const styles = createStyles(isDarkMode);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons 
              name={activityType === 'youtube' ? "play-circle-outline" : "bulb-outline"} 
              size={20} 
              color={isDarkMode ? "#FFD700" : "#FF6B6B"} 
            />
            <Text style={styles.title}>
              {activityType === 'youtube' ? 'Break Video' : 'Break Activity'}
            </Text>
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
              <Text style={styles.loadingText}>
                {activityType === 'youtube' ? 'Finding the perfect video...' : 'Finding the perfect break activity...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.activityText}>
              {activity}
            </Text>
          )}
        </View>
      </View>

      {/* YouTube Video Modal */}
      <Modal
        visible={showVideoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎥 Break Video</Text>
              <TouchableOpacity onPress={closeVideoModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#2C3E50"} />
              </TouchableOpacity>
            </View>
            
            {videoData && (
              <View style={styles.videoContent}>
                <Text style={styles.videoTitle}>{videoData.title}</Text>
                <Text style={styles.videoChannel}>{videoData.channelTitle}</Text>
                {videoData.description && (
                  <Text style={styles.videoDescription} numberOfLines={3}>
                    {videoData.description}
                  </Text>
                )}
                
                <TouchableOpacity 
                  style={styles.watchButton} 
                  onPress={handleVideoPress}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={styles.watchButtonText}>Watch Video</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
  },
  closeButton: {
    padding: 4,
  },
  videoContent: {
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  videoChannel: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#7F8C8D',
    marginBottom: 12,
  },
  videoDescription: {
    fontSize: 14,
    color: isDarkMode ? '#E0E0E0' : '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  watchButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  watchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BreakActivity;


